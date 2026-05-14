---
name: m2m-brand-design
description: Apply M2M~Inc.'s brand system, design standards, front-end architecture, and output formatting to any visual, written, or digital deliverable. Use this skill whenever creating website components, presentations, documents, one-pagers, social content, email templates, UI elements, or any branded output for M2M~Inc., PIVOT OS, BRIDGE OS, or Human OS. Also triggers for model2message.net development tasks, Vercel deployment decisions, JSX component design, or any task requiring M2M Design MD v1.0 compliance. This skill governs every pixel and every sentence that carries the M2M brand.
---

# M2M Brand Design Skill

## Color Architecture
- Navy #0A1628 — backgrounds, headers, authority elements
- Gold #C9A84C — CTAs, highlights, brand moments, display text 24px and above only
- Near-Black #1A1A2E — body text on light backgrounds
- White #FFFFFF — text on Navy backgrounds
- Gold on white fails WCAG AA at body text sizes — never use Gold below 24px

## Typography
- Display: Cormorant Garamond, weight 600-700, 32px minimum, hero headlines only
- Body and UI: DM Sans, weight 400-500, 16px minimum, all body copy and navigation
- Code: JetBrains Mono, weight 400, 14px minimum

## Brand Voice
- Direct, warm, sovereign, veteran-grounded
- Executive peer — not vendor
- Confident, never apologetic, brief
- Sign-off: To the work, followed by Dr. Kevin A. Smith (formal) or Kev (peer)

## Tone by Platform Lane
- PIVOT OS: Personal, hopeful, grounded — individual human register
- BRIDGE OS: Operational, results-focused — business operator register
- Human OS: Strategic, systemic — enterprise decision-maker register

## model2message.net Stack
- React + Vite + TypeScript
- Shadcn/UI on Radix UI primitives
- Tailwind CSS
- GitHub: Kali-Dedwen private repository
- Vercel project: drivenbydesign1-tech-tiil
- Domain: www.model2message.net
- DNS: A record @ to 76.76.21.21, CNAME www to cname.vercel-dns.com
- Database: Supabase jnedssdrsuwddpmcyggs.supabase.co

## Semantic HTML Requirements
- Every page: nav landmark, main landmark, footer landmark
- One h1 per page — hero headline only
- Section titles h2, subsections h3
- All images require alt attribute
- Form fields require associated label
- Focus indicators never overridden

## Accessibility Baseline
- WAVE AIM Score 10/10
- WCAG 2.1 AA zero errors
- Accessibility statement at /accessibility
- Language toggle EN/ES/FR with localStorage persistence

## Document Standards

PPTX:
- Background Navy #0A1628
- Headline Cormorant Garamond Gold 36-44pt
- Body DM Sans White 18-22pt
- Footer: M2M~Inc. Confidential model2message.net
- No default PowerPoint themes

One-Pager:
- Navy header band, Gold accent
- Contact: 980.474.9377 and info@model2message.net
- Include SDVOSB/VBE certification mark

Email:
- Plain text only for automation pipeline
- 4-5 sentences intake, 3-4 sentences outreach
- No HTML formatting in Make.com to Gmail to Superhuman pipeline

## Platform Lane Colors
- PIVOT OS: Navy + Gold, warm amber
- BRIDGE OS: Teal + Coral
- Human OS: Deep slate + Electric blue

## Front-End Principles
- Hero must answer in 3 seconds: who is this for, what do they get, what do I do next
- One primary CTA per page
- 30-40 percent white space for complex value propositions
- All components mobile-first
- No horizontal scroll on any viewport
- Navigation collapses below 768px
- No font sizes below 16px on mobile

## Blind Spots
1. Gold below 24px — fails contrast, enforce at every component review
2. Cormorant Garamond on dark OLED mobile screens — test before every launch
3. To the work sign-off must appear in manual content not just automation outputs
4. No shared design token file separating platform lane components yet
5. No brand standard for video thumbnails, podcast artwork, or webinar backgrounds yet

Confirm file written with exact byte count.
