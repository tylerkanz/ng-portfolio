import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { ContactService } from '../../services/contact/contact.service';
import { environment } from '../../../environments/environment';

declare const turnstile: any;

const SUBJECTS = ['Job Opportunity', 'Freelance / Contract Work', 'Collaboration', 'General Inquiry'];

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, FaIconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  faAt = faAt;
  faGithub = faGithub;
  faLinkedin = faLinkedin;

  turnstileSiteKey = environment.turnstileSiteKey;
  subjects = SUBJECTS;

  @ViewChild('turnstileWidget') turnstileWidget?: ElementRef<HTMLElement>;
  private widgetId?: string;

  // `website` is a honeypot: hidden from real users, left blank by them, but
  // bots that auto-fill every field tend to fill it in.
  form = { name: '', email: '', subject: '', message: '', website: '' };
  submitted = false;
  errorMessage = '';

  constructor(private contactService: ContactService) {}

  ngAfterViewInit(): void {
    this.renderTurnstile();
  }

  ngOnDestroy(): void {
    if (this.widgetId && typeof turnstile !== 'undefined') {
      turnstile.remove(this.widgetId);
    }
  }

  // The Cloudflare script is loaded with `render=explicit` (see index.html),
  // so nothing renders the widget automatically — by the time this Angular
  // component exists and its `.cf-turnstile` div is in the DOM, the script's
  // own implicit-render scan has long since finished. We render it ourselves
  // once `turnstile` is available on window, retrying briefly since the
  // script is loaded async and may not be ready yet on first view init.
  private renderTurnstile(retriesLeft = 20): void {
    if (!this.turnstileSiteKey || !this.turnstileWidget) return;

    if (typeof turnstile === 'undefined') {
      if (retriesLeft <= 0) return;
      setTimeout(() => this.renderTurnstile(retriesLeft - 1), 150);
      return;
    }

    this.widgetId = turnstile.render(this.turnstileWidget.nativeElement, {
      sitekey: this.turnstileSiteKey,
    });
  }

  private getTurnstileToken(): string | undefined {
    if (this.widgetId && typeof turnstile !== 'undefined') {
      return turnstile.getResponse(this.widgetId) || undefined;
    }
    return undefined;
  }

  send() {
    this.errorMessage = '';

    const payload = { ...this.form, turnstileToken: this.getTurnstileToken() };

    this.contactService.submitMessage(payload).subscribe({
      next: () => {
        this.submitted = true;
        this.form = { name: '', email: '', subject: '', message: '', website: '' };
        this.resetTurnstile();
        setTimeout(() => (this.submitted = false), 5000);
      },
      error: (err) => {
        console.error('Contact submission failed', err);
        this.errorMessage = 'Something went wrong sending your message. Please try again or email me directly.';
        this.resetTurnstile();
      },
    });
  }

  // Turnstile tokens are single-use, so get a fresh one ready for the next attempt.
  private resetTurnstile(): void {
    if (this.widgetId && typeof turnstile !== 'undefined') {
      turnstile.reset(this.widgetId);
    }
  }
}
