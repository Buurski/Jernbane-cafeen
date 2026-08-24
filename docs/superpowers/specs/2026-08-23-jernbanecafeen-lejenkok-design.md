# Jernbanecaféen + Lejen Kok Design Specification

**Date:** 2026-08-23
**Status:** Approved direction; written spec awaiting Lucas' review before implementation
**Repositories:** `/root/Jernbane-cafeen` for Jernbanecaféen; a separate Lejen Kok codebase must not be merged into it

## Goal

Build two polished, factual, conversion-focused websites for Niels' businesses:

1. Jernbanecaféen in Ikast: make original Danish kro-mad and the restaurant experience unmistakable, while presenting Thai food for dine-in and takeaway as a clear second food track.
2. Lejen Kok: create a self-contained private-chef/catering brand that belongs to Niels' universe but has its own story, structure, visual language, and code context.

Both sites must be easy to maintain, locally discoverable, accessible, fast, and backed by the agreed delivery scope: Jernbanecaféen site + CMS, separate three-page Lejen Kok site, SEO foundation, Facebook work, hosting/drift, and four reusable seasonal social templates.

## Source and fact rules

- The customer's supplied logo assets are brand assets, not redesign targets.
- Niels' statement that he grew up at a kro is approved as a central story point, but wording and final publication still require factual customer sign-off.
- NAP, CVR, opening hours, menu claims, experience claims, ingredients, reviews, and historical claims are published only after verification against the customer site, customer material, official listings, or direct customer confirmation.
- No invented reviews, review counts, awards, ingredient sourcing, staff credentials, or customer outcomes.
- The current live sites are research sources only. They are not treated as final copy.
- Facebook and Instagram are sources for approved assets and links, not a reason to scrape or auto-publish a live feed.

## Brand architecture

### Jernbanecaféen

Jernbanecaféen owns the local restaurant decision: what can I eat, when is it open, where is it, and how do I contact or book it? Its primary story is Danish kro-mad and the warm station setting. Thai food is presented as a distinct, easy-to-find track that can be eaten at the café and taken away, subject to final menu confirmation.

### Lejen Kok

Lejen Kok owns the private-chef decision: can Niels cook for my occasion, what kind of occasion fits, and how do I ask for a proposal? It has a separate navigation, page hierarchy, copy voice, imagery, and design tokens. Its relationship to Jernbanecaféen appears only as a restrained cross-link and shared, verified contact facts.

### CMS

The two sites are separate CMS entries with separate content and publishing contexts. Shared CMS infrastructure is an implementation detail, not a shared customer-facing page. Niels may have both sites under the same CMS account, but editing one site must not silently alter the other.

## Jernbanecaféen information architecture

The agreed five-page structure is:

- `/`: home
- `/dagens-ret/`: today's dish and current update
- `/menu/`: full menu
- `/catering/`: catering and parties
- `/om-os/`: Niels, the kro background, the station, and the people behind the food

Contact, opening hours, phone, map, and social links are available in the shared site footer and in the highest-intent sections. A visitor should not need a separate contact page to reach the café.

### Jernbanecaféen homepage flow

1. **Header:** approved logo, simple navigation, phone action, visible mobile menu.
2. **Hero:** food or interior image, never the weak facade image as the main hero. Headline communicates Danish kro-mad in Ikast. Supporting copy names Thai food without making the offer confusing.
3. **Current action row:** today's dish, opening state, and menu action.
4. **Today's dish module:** CMS-driven banner with active state, text, optional period, and automatic expiry. Loading, empty, and error states are designed rather than hidden.
5. **Two food tracks:** one editorial section for Danish kro-mad/frokost/klassikere and one for Thai dine-in/takeaway. They are related but not mixed into one generic card grid.
6. **The station and the people:** interior image and concise story about the place, Niels, Rapheephon, and the kro background only where verified.
7. **Catering:** clear route for parties and food out of the house, with a quiet cross-link to Lejen Kok for occasions where a private chef is the better fit.
8. **Find and contact:** hours, address, phone, map, social links, and form.

### Jernbanecaféen visual direction

**Concept:** Railway table.

- The existing railway logo is the fixed identity anchor.
- A railway-line motif appears sparingly as structural rules and section transitions; it must never become a decorative wallpaper.
- Base palette: ink charcoal, bone, muted station blue/grey, and one restrained amber/rust action color. Amber is not used for normal body text where it fails contrast.
- Display type is characterful and restrained; body type is a readable sans-serif with a clear scale. The existing Lora/Outfit direction may be retained or replaced only after checking the current loading/performance cost.
- Layout uses an editorial split and occasional asymmetry rather than identical three-card rows.
- Images use mixed aspect ratios: one confident hero, one interior frame, one food/catering crop. No stock “team” photography.
- Cards exist only when elevation communicates a real choice. No endless rounded containers.
- Motion is purposeful: a short track-line reveal on first load, gentle image/text entry with IntersectionObserver, and physical hover/press states. All motion uses transform/opacity and respects `prefers-reduced-motion`.

## Lejen Kok information architecture

The agreed three-page structure is:

- `/`: home
- `/anledninger/`: private dining, parties, company events, and other confirmed services
- `/om-niels/`: Niels, the approach, contact, and inquiry flow

The exact service list is finalized from customer-approved material. The site must not present every possible catering service merely because the old copy listed it.

### Lejen Kok homepage flow

1. **Quiet header:** own wordmark, compact navigation, one clear inquiry action.
2. **Hero:** Niels or food imagery when approved; otherwise a text-led hero with an intentional image slot rather than an invented portrait.
3. **Occasion chooser:** a small set of concrete occasions, not a generic “we do everything” list.
4. **How it works:** inquiry, menu conversation, cooking/serving. Only steps that match the real service.
5. **Niels:** direct, personal copy with verified experience.
6. **Inquiry CTA/form:** the strongest conversion point, with clear response expectations only when agreed.
7. **Cross-link:** a small route to Jernbanecaféen, never a second competing navigation.

### Lejen Kok visual direction

**Concept:** At the host's table.

- The site gets its own palette and rhythm: deep ink/olive, bone, and a muted copper or clay accent.
- It uses more breathing room and close food/table crops than the café site.
- Typography is more personal and hospitality-led, but body text remains accessible and readable.
- Motion is slower and quieter than Jernbanecaféen: image mask reveals, subtle line movement, and small interaction feedback. No cinematic autoplay video, parallax that harms mobile, or motion that delays the inquiry action.
- The site must feel like a person and a service, not a luxury-template restaurant.

## CMS and content model

### Today's dish

The public site stops depending on the Notion endpoint. The existing CMS `banner` type is reused because it already provides the minimum needed model:

- active/inactive toggle
- editable message
- optional “gælder til” text
- automatic ISO expiry date

The homepage and `/dagens-ret/` page render the same published value. If no current value exists, the page shows a useful empty state that points to the menu/contact path. The old Notion fetch and its credentials are not used in the public runtime.

### Menu

The CMS structured menu field is used for menu sections, dish names, descriptions, and prices. Prices are not invented or silently reformatted. Menu markup is rendered semantically and can be referenced by menu schema when the content is complete.

### Images

Editable editorial images use the CMS image field and require descriptive alt text. Fixed brand assets remain in code. Missing approved Niels imagery is handled with an intentional layout state, not a random placeholder or the rejected facade hero.

### Seasonal social templates

The four templates are reusable social assets, not hidden homepage themes:

- one base seasonal system with four approved seasonal variants
- Facebook-first dimensions and readable type at mobile scale
- clear space for today's dish/menu text
- no generated claims, fake reviews, or unapproved photography
- same brand tokens as Jernbanecaféen so Facebook posts and site updates feel related

## SEO and social delivery

### SEO foundation

The one-time SEO work covers both sites within the agreed scope:

- page-specific title, description, H1, and canonical
- Open Graph and social preview metadata
- local business/restaurant schema for Jernbanecaféen
- service schema where the service is real and approved
- menu schema only for published menu content
- sitemap, robots, and an AI-readable business summary
- consistent NAP and internal links
- mobile/performance basics: correct image dimensions, lazy loading below the fold, stable layout, and no blocking animation

No specific ranking position is promised. The work creates a measurable technical and local foundation.

### Ongoing work

The monthly delivery remains aligned with the accepted agreement:

- Facebook: two to three posts weekly from approved material
- SEO: local visibility, content/Google Business Profile support, monitoring, and practical iteration
- hosting/drift for both sites

The website does not promise a Google position. Monthly reporting distinguishes impressions, clicks, calls/form leads, and actual ranking movement.

## Forms and data flow

- Each site posts to its own CMS inbox slug.
- Existing defenses remain: honeypot, minimum fill time, origin validation, throttling, and validation.
- Client-side fields have labels, useful required states, keyboard-visible focus, inline errors, and a clear success state.
- Local end-to-end tests verify request payload, validation, inbox storage response, and error handling without sending a real notification email.
- The agent never sends a real email. Any customer notification behavior is tested with mail disabled or mocked.

## Quality and review loop

Before implementation is reported as complete:

1. Run the Open Design/Impeccable preflight on all changed pages.
2. Remove real contrast, heading, focus, spacing, and motion problems; do not blindly silence stylistic advisories.
3. Test with a real browser at desktop, tablet, and mobile viewports.
4. Scroll every page from top to bottom and inspect empty, loading, error, reduced-motion, and long-copy states.
5. Test keyboard order, visible focus, labels, alt text, touch targets, and 200% zoom behavior.
6. Test both forms end-to-end without real mail.
7. Run HTML/SEO checks and a local server smoke test.
8. Run a final four-perspective council: critic, optimist, innovator, pragmatist.
9. Repeat only the loop that fixes a concrete finding. Do not add motion or features just to make a loop longer.

## Explicit non-goals

- No framework migration for the existing static Jernbanecaféen site.
- No live social-feed scraping.
- No invented reviews, awards, ingredients, credentials, or ranking promises.
- No public Notion dependency for today's dish.
- No merging Lejen Kok into the Jernbanecaféen site.
- No deployment or push to `main` without Lucas' explicit approval.
- No real email sent by the agent.

## Acceptance criteria

The work is ready for Lucas' visual review when:

- both brands are visibly distinct but connected through Niels and restrained cross-links
- Jernbanecaféen's first impression clearly communicates Danish kro-mad in Ikast and also exposes Thai food
- today's dish can be changed from the Jernbanecaféen CMS without Notion
- the five Jernbane routes and three Lejen Kok routes work without dead links
- forms show usable validation and store a test submission in the correct CMS inbox path without real mail
- the major Impeccable accessibility and anti-slop findings are resolved or explicitly justified
- desktop and mobile scroll-throughs show no clipped, empty, unreadable, or motion-blocked sections
- SEO metadata, structured data, sitemap/robots assets, social sharing metadata, and NAP are present with only verified values
- the implementation remains within the agreed website/CMS/SEO/social scope
