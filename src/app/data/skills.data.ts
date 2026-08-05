import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';

export interface ShowcaseIcon {
  src: string;
  label: string;
  rounded?: boolean;
}

export interface SkillLogoGroup {
  title: string;
  description: string;
  icons?: string[];
  faIcon?: IconDefinition;
}

export interface SkillArea {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  sideShowcase: ShowcaseIcon[];
  logoGroups: SkillLogoGroup[];
}

export const SKILL_AREAS: SkillArea[] = [
  {
    slug: 'web-apps',
    title: 'Web Applications',
    description:
      "Web apps and sites built from the ground up — HTML5, SCSS, JavaScript, TypeScript, and PHP. I care about the UX as much as the code, so what ships is fast, accessible, and doesn't feel like it was assembled from a template.",
    heroImage: 'assets/image/web-apps-graphic.png',
    sideShowcase: [
      { src: 'assets/svg/html5.svg', label: 'HTML' },
      { src: 'assets/svg/css3.svg', label: 'CSS' },
      { src: 'assets/svg/sass.svg', label: 'SASS' },
      { src: 'assets/svg/javascript.svg', label: 'JavaScript', rounded: true },
      { src: 'assets/svg/typescript.svg', label: 'TypeScript' },
      { src: 'assets/svg/php.svg', label: 'PHP' },
    ],
    logoGroups: [
      {
        title: 'Angular & React',
        description: 'The two frameworks I reach for most for anything beyond a static page.',
        icons: ['assets/svg/angular.svg', 'assets/svg/react.svg'],
      },
      {
        title: 'Wordpress',
        description: 'Custom themes and plugins, from small-business marketing sites to full e-commerce builds.',
        icons: ['assets/svg/wordpress.svg'],
      },
      {
        title: 'Bootstrap & Tailwind',
        description: 'Component-driven or utility-first — whichever fits the project.',
        icons: ['assets/svg/bootstrap.svg', 'assets/svg/tailwind.svg'],
      },
    ],
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile Applications',
    description:
      "Cross-platform mobile apps that feel native — TypeScript, NativeScript, and React Native. Same approach as the web work: the interface should never get in the user's way.",
    heroImage: 'assets/image/mobile-apps-graphic.png',
    sideShowcase: [
      { src: 'assets/svg/javascript.svg', label: 'JavaScript', rounded: true },
      { src: 'assets/svg/typescript.svg', label: 'TypeScript' },
      { src: 'assets/svg/css3.svg', label: 'CSS' },
      { src: 'assets/svg/sass.svg', label: 'SASS' },
    ],
    logoGroups: [
      {
        title: 'Nativescript & ReactNative',
        description: 'One codebase, both platforms, without the usual compromises.',
        icons: ['assets/svg/nativescript.svg', 'assets/svg/react.svg'],
      },
      {
        title: 'iOS & Android',
        description: 'Built and maintained for both, kept current with the latest OS releases.',
        icons: ['assets/svg/apple.svg', 'assets/svg/android.svg'],
      },
    ],
  },
  {
    slug: 'apis',
    title: 'Application Programming Interfaces',
    description:
      'REST APIs that are easy to read, easy to extend, and hard to misuse — built with PHP, JavaScript, and TypeScript, on standards like OAuth and JSON that other tools already expect.',
    heroImage: 'assets/image/apis-graphic.png',
    sideShowcase: [
      { src: 'assets/svg/javascript.svg', label: 'JavaScript', rounded: true },
      { src: 'assets/svg/typescript.svg', label: 'TypeScript' },
      { src: 'assets/svg/php.svg', label: 'PHP' },
      { src: 'assets/svg/python.svg', label: 'Python' },
    ],
    logoGroups: [
      {
        title: 'Node.js & Express.js',
        description: 'My default pairing for a fast, unopinionated backend.',
        icons: ['assets/svg/nodejs.svg'],
      },
      {
        title: 'WordPress',
        description: 'REST endpoints for WP-driven jQuery/AJAX front ends.',
        icons: ['assets/svg/wordpress.svg'],
      },
      {
        title: 'MySQL and MongoDB',
        description: 'Relational or document storage, picked based on how the data actually needs to be queried.',
        faIcon: faDatabase,
      },
    ],
  },
  {
    slug: 'cloud-architecture',
    title: 'Cloud Architecture',
    description:
      "Applications deployed and run on AWS — EC2, ECS, S3, CloudFront, Route 53 — plus the CI/CD pipelines that get code there safely. I've worked directly with dev teams on the architecture decisions, not just the buildout.",
    heroImage: 'assets/image/system-arch-graphic.png',
    sideShowcase: [
      { src: 'assets/svg/ec2.svg', label: 'EC2', rounded: true },
      { src: 'assets/svg/ecs.svg', label: 'ECS', rounded: true },
      { src: 'assets/svg/s3.svg', label: 'S3', rounded: true },
      { src: 'assets/svg/cloudfront.svg', label: 'CloudFront', rounded: true },
      { src: 'assets/svg/route53.svg', label: 'Route 53', rounded: true },
      { src: 'assets/svg/code-pipeline.svg', label: 'Code Pipeline', rounded: true },
    ],
    logoGroups: [
      {
        title: 'Amazon Web Services',
        description: 'Compute, storage, routing, and CI/CD — enough of the stack to run an application end to end.',
        icons: ['assets/svg/aws.svg'],
      },
      {
        title: 'Node.js',
        description: 'Powers the server and most of the tooling around it.',
        icons: ['assets/svg/nodejs.svg'],
      },
      {
        title: 'Git',
        description: 'Non-negotiable for any real collaboration.',
        icons: ['assets/svg/github.svg'],
      },
      {
        title: 'NGINX and Apache',
        description: 'Whichever the stack already expects.',
        icons: ['assets/svg/nginx.svg', 'assets/svg/apache.svg'],
      },
    ],
  },
];
