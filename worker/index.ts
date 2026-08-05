export interface Env {
  ASSETS: Fetcher;
  CONTACT_RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  ADMIN_NOTIFICATION_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

/**
 * Verifies a Cloudflare Turnstile token. Fails OPEN (returns true) when
 * TURNSTILE_SECRET_KEY isn't configured, so the form keeps working before
 * Turnstile is set up.
 */
async function verifyTurnstile(token: unknown, secretKey: string | undefined, remoteIp: string): Promise<boolean> {
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured — skipping Turnstile verification');
    return true;
  }

  if (typeof token !== 'string' || !token) {
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token, remoteip: remoteIp }),
    });
    const result = (await response.json()) as { success: boolean };
    return result.success === true;
  } catch (err) {
    console.error('Turnstile verification request failed', err);
    return false;
  }
}

/**
 * Best-effort email send — never throws. Missing config or a failed send is
 * logged and swallowed so it can never break the request that triggered it.
 */
async function sendEmail(env: Env, to: string, subject: string, text: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) {
    console.warn('Email not configured (RESEND_API_KEY/MAIL_FROM) — skipping email to', to);
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: env.MAIL_FROM, to, subject, text }),
    });

    if (!response.ok) {
      console.error('Email send failed', response.status, await response.text());
    }
  } catch (err) {
    console.error('Email send failed', err);
  }
}

async function sendAdminNotification(env: Env, subject: string, text: string): Promise<void> {
  if (!env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('ADMIN_NOTIFICATION_EMAIL not configured — skipping admin notification');
    return;
  }
  await sendEmail(env, env.ADMIN_NOTIFICATION_EMAIL, subject, text);
}

async function handleContact(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';

  const { success: withinLimit } = await env.CONTACT_RATE_LIMITER.limit({ key: ip });
  if (!withinLimit) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data = body?.data ?? {};
  const { name, email, subject, message, website, turnstileToken } = data;

  // Honeypot: bots fill this hidden field, real users never see it. Respond
  // as if it succeeded so bots don't learn to avoid the field.
  if (website) {
    return Response.json({
      data: { name, email, subject: subject ?? null, message, createdAt: new Date().toISOString() },
    });
  }

  if (!name || !email || !message) {
    return Response.json({ error: 'name, email, and message are required' }, { status: 400 });
  }

  const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!verified) {
    return Response.json({ error: 'Verification failed. Please try again.' }, { status: 400 });
  }

  ctx.waitUntil(
    sendAdminNotification(
      env,
      `New portfolio contact: ${subject || 'General Inquiry'}`,
      `From: ${name} <${email}>\nSubject: ${subject || 'General Inquiry'}\n\n${message}`
    )
  );

  return Response.json({
    data: { name, email, subject: subject ?? null, message, createdAt: new Date().toISOString() },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};
