# Jernbanecaféen + Lejen Kok Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Redesign Jernbanecaféen around Danish kro-mad and Thai food, build Lejen Kok as a separate site in Niels' universe, connect both to the existing CMS model, and verify the full experience on desktop and mobile.

**Architecture:** Keep Jernbanecaféen as a vanilla static site with its existing flat HTML files and CMS anchors. Add the missing today's-dish page without migrating frameworks. Create Lejen Kok in a separate local codebase with its own HTML, CSS, JavaScript, metadata, and CMS slug. Reuse the existing CMS inbox and content field types instead of adding a new backend.

**Tech Stack:** HTML5, vanilla CSS, browser JavaScript, existing buur-cms `banner`, `menu`, `hours`, `image`, and inbox interfaces, Python `http.server` for local smoke tests, Playwright where the local browser runtime is available, and Impeccable for static design diagnostics.

## Global Constraints

- No em dashes in new customer-facing copy, specs, plans, social templates, or changed UI strings.
- Use anti-slop copy: concrete Danish, active voice, no invented reviews, no generic luxury claims, no ranking promises.
- Jernbanecaféen must communicate Danish kro-mad and Niels' kro background, plus Thai food for eating at the café and takeaway when confirmed.
- Lejen Kok is a separate brand and separate code context. It may cross-link to Jernbanecaféen but must not become a subpage inside it.
- Today's dish must not depend on Notion at runtime. Reuse the CMS `banner` type with active state and expiry date.
- Preserve the existing CMS inbox payload and defenses: `name`, `email`, `message`, `honeypot`, and `ts`.
- Never send a real email during testing. Test with a local mock or disabled notification path.
- Do not add a dependency unless the existing repository proves it is needed.
- Do not push `main` or deploy without Lucas' explicit approval.
- Do not commit unless Lucas explicitly asks for a commit.
- Councils are allowed after each major visual checkpoint. Repeat a loop only when it produces a concrete finding or correction.

---

### Task 1: Lock source facts and replace risky customer copy

**Files:**
- Modify: `/root/Jernbane-cafeen/index.html`
- Modify: `/root/Jernbane-cafeen/menu.html`
- Modify: `/root/Jernbane-cafeen/catering.html`
- Modify: `/root/Jernbane-cafeen/om-os.html`
- Modify: `/root/Jernbane-cafeen/main.js`
- Review source: `/root/KnowledgeOS/wiki/kunder/jernbanecafeen.md`
- Review source: `/root/KnowledgeOS/wiki/kunder/lejenkok.md`

**Interfaces:**
- Keeps the current `data-cms` keys stable unless an element is deliberately removed.
- Keeps the current form field names and the `data-slug="jernbane-cafeen"` contract.
- Produces verified, short copy for the visual redesign tasks.

- [ ] **Step 1: Inventory copy that cannot ship unchanged.**

Search the four HTML files and `main.js` for:

```text
96%
review
fantastisk
lokale råvarer
fritgående
økologiske
Le Canard
Norsminde
placeholder
kommer snart
—
```

Mark each match as one of: verified fact, customer-supplied fact needing confirmation, or copy to remove. Do not preserve the current synthetic review marquee or its percentage statistic.

- [ ] **Step 2: Rewrite the main Jernbane message.**

Use this copy direction, then keep each sentence short and specific:

```html
<h1>Dansk kromad i Ikast</h1>
<p>Niels er vokset op på en kro. På Jernbanecaféen møder den klassiske danske tallerken Thai-mad fra køkkenet, som du kan spise her eller tage med.</p>
```

Do not publish the sentence above if the customer later corrects the factual detail. Do not use “gourmet”, “ekstraordinær”, “hver bid fortæller en historie”, or “bedste råvarer” without evidence.

- [ ] **Step 3: Make the Danish and Thai offer explicit.**

Replace the current generic menu cards with two clear content paths:

```html
<section aria-labelledby="kromad-title">
  <h2 id="kromad-title">Kromad med rødder</h2>
  <p>Klassiske danske retter, frokost og dagens ret i stationsbygningen.</p>
</section>
<section aria-labelledby="thai-title">
  <h2 id="thai-title">Thai fra køkkenet</h2>
  <p>Thai-retter, som kan nydes i caféen eller tages med, når menuen tilbyder det.</p>
</section>
```

Use the CMS anchors on the actual editable headings and paragraphs. Do not describe Thai as only takeaway.

- [ ] **Step 4: Remove the old Notion language.**

The public copy must not say that the day's dish is waiting for a future connection. It must show either the current CMS value or a useful empty state such as:

```text
Dagens ret bliver lagt op her, når køkkenet har valgt den.
Ring til os, hvis du vil vide, hvad der står på i dag.
```

- [ ] **Step 5: Run the copy gate before moving on.**

Run:

```bash
python3 -c 'from pathlib import Path; files=[Path("index.html"),Path("menu.html"),Path("catering.html"),Path("om-os.html"),Path("main.js")]; hits=[f"{p}:{i}" for p in files for i,line in enumerate(p.read_text().splitlines(),1) if "—" in line]; print(hits); raise SystemExit(1 if hits else 0)'
```

Expected: `[]` and exit code `0` for the changed customer-facing source. If a remaining em dash is a code comment, rewrite the comment too so the repository stays consistent.

---

### Task 2: Rebuild Jernbanecaféen structure and CMS-driven today's dish

**Files:**
- Modify: `/root/Jernbane-cafeen/index.html`
- Create: `/root/Jernbane-cafeen/dagens-ret.html`
- Modify: `/root/Jernbane-cafeen/menu.html`
- Modify: `/root/Jernbane-cafeen/catering.html`
- Modify: `/root/Jernbane-cafeen/om-os.html`
- Modify: `/root/Jernbane-cafeen/main.js`
- Delete after usage is removed: `/root/Jernbane-cafeen/api/dagens-ret.js`

**Interfaces:**
- CMS field: `data-cms="dagens-ret" data-cms-type="banner"`.
- CMS menu field: the existing `data-cms-type="menu"` pattern.
- Form: existing `data-slug="jernbane-cafeen"` and the current CMS endpoint.

- [ ] **Step 1: Add a first-class today's-dish page.**

Create `dagens-ret.html` by following the existing page shell, shared navigation, `lang="da"`, canonical metadata pattern, and footer. The page must include:

```html
<main id="main-content">
  <section class="daily-hero" aria-labelledby="daily-title">
    <p class="section-kicker">Fra køkkenet i dag</p>
    <h1 id="daily-title">Dagens ret</h1>
    <div data-cms="dagens-ret" data-cms-type="banner" aria-live="polite"></div>
    <a class="btn-solid" href="menu.html">Se menukortet</a>
  </section>
</main>
```

Keep the fallback text in the static HTML so the page remains useful before CMS content is published. Do not use a client-side fetch to Notion.

- [ ] **Step 2: Reuse the same CMS value on the homepage and menu page.**

Replace the current placeholder card with the same banner field and a clear published-value container. The homepage and `dagens-ret.html` must not maintain separate daily-dish values. Keep `menu.html#dagens-ret` as a stable anchor.

- [ ] **Step 3: Remove the Notion runtime path.**

Delete the `loadDagensRet` fetch from `main.js` after the CMS markup is in place. Confirm that this search returns no public caller:

```bash
python3 -c 'from pathlib import Path; files=list(Path(".").rglob("*.html"))+[Path("main.js")]; hits=[f"{p}:{i}" for p in files for i,line in enumerate(p.read_text().splitlines(),1) if "/api/dagens-ret" in line or "NOTION" in line]; print(hits); raise SystemExit(1 if hits else 0)'
```

Expected: `[]` and exit code `0`. Delete `api/dagens-ret.js` only after this check passes.

- [ ] **Step 4: Preserve the real form contract while making it testable.**

Keep this exact payload shape in the submit handler:

```js
const body = {
  name: data.get("navn") || "",
  email: data.get("email") || "",
  message: (telefon ? "Telefon: " + telefon + "\n\n" : "") + besked,
  honeypot: data.get("website") || "",
  ts: renderedAt,
};
```

Add an optional `data-endpoint` attribute to the form. The production default remains `https://buur-cms.vercel.app/api/inbox/`, and the local test can replace the attribute with a mock endpoint without changing production behavior.

- [ ] **Step 5: Run CMS ingest tests against the new anchors.**

From `/root/buur-cms`, run:

```bash
npm test -- --test-name-pattern='propose|rebuild'
```

Expected: all selected content ingest tests pass, including detection of the `banner` and `menu` fields. If the CMS parser rejects the anchor shape, change the HTML to match the existing parser contract instead of modifying the parser first.

---

### Task 3: Implement the Jernbane visual system and motion pass

**Files:**
- Modify: `/root/Jernbane-cafeen/style.css`
- Modify: `/root/Jernbane-cafeen/main.js`
- Modify: the four Jernbane HTML pages from Tasks 1 and 2

**Interfaces:**
- Existing vanilla CSS remains the only styling system.
- Existing `.reveal`, `.reveal-left`, and `.reveal-right` hooks may be retained only if their animation uses transform and opacity.
- No new animation library.

- [ ] **Step 1: Establish tokens before component styling.**

Define named CSS custom properties for:

```css
:root {
  --c-ink: #1e1c1a;
  --c-paper: #f2ede4;
  --c-rail: #59636a;
  --c-amber: #a96c2a;
  --c-rust: #7a3b1e;
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --radius-image: 0.25rem;
  --ease-heavy: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Use the amber only in large text or surfaces that meet contrast. Use ink or rust for normal text and buttons.

- [ ] **Step 2: Replace the facade hero.**

Use `billeder/mad-restaurant.jpg` or `billeder/om-interior.png` as the initial hero after visual inspection. Keep `hero-facade.png` available for a later approved location section, but do not use it as the hero or social preview. The hero must make the food and the kro story visible within the first viewport.

- [ ] **Step 3: Remove generic and distracting patterns.**

Remove or replace:

- synthetic review data and the auto-scrolling marquee
- the fake percentage recommendation
- tiny tracked body labels
- body text in all caps
- duplicated three-card menu patterns where a two-track editorial layout is clearer
- parallax scroll listeners that animate layout or create mobile jank
- inline style overrides that conflict with the token system

Use a single calm railway-line motif as the signature. Do not add decorative ornaments merely to fill empty space.

- [ ] **Step 4: Implement deliberate motion.**

Use an `IntersectionObserver` to add `.is-visible` once per element. The CSS must animate only `opacity`, `transform`, and, where needed, a mask or clip path. Use the approved easing token, not `linear` or `ease-in-out`.

```css
.reveal {
  opacity: 0;
  transform: translateY(1.25rem);
  transition: opacity 650ms var(--ease-heavy), transform 650ms var(--ease-heavy);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The hero may have one initial line-draw reveal. It must not delay the headline or the first action.

- [ ] **Step 5: Run Impeccable and resolve real findings.**

Run:

```bash
npx --yes impeccable detect . --json
```

Inspect the JSON. Resolve all relevant contrast, heading, focus, touch-target, cramped-padding, layout-animation, marquee, and undersized-text findings on the changed pages. Keep a stylistic advisory only when it is an intentional brand choice and document the reason in the final review.

---

### Task 4: Add Jernbane SEO, metadata, and social handoff

**Files:**
- Modify: `/root/Jernbane-cafeen/index.html`
- Modify: `/root/Jernbane-cafeen/menu.html`
- Modify: `/root/Jernbane-cafeen/catering.html`
- Modify: `/root/Jernbane-cafeen/om-os.html`
- Modify: `/root/Jernbane-cafeen/dagens-ret.html`
- Modify: `/root/Jernbane-cafeen/robots.txt`
- Modify: `/root/Jernbane-cafeen/sitemap.xml`
- Modify: `/root/Jernbane-cafeen/301-redirects.csv`
- Create: `/root/Jernbane-cafeen/llms.txt`
- Create: `/root/Jernbane-cafeen/favicon.svg`

**Interfaces:**
- Keep `https://jbcafeen.dk` as the public origin.
- Keep `.html` filenames as compatibility URLs unless the host's redirect file proves a clean route works.
- Use only NAP and opening hours already present in verified customer sources.

- [ ] **Step 1: Give every page a specific title, description, canonical, and social preview.**

Use the page's actual intent. Examples:

```html
<title>Dagens ret i Ikast | Jernbanecaféen</title>
<meta name="description" content="Se dagens ret fra Jernbanecaféen i Ikast og find menukort, åbningstider og kontakt.">
<link rel="canonical" href="https://jbcafeen.dk/dagens-ret.html">
```

Do not use the rejected facade image for `og:image`. Use a food or interior asset with a descriptive `og:image:alt`.

- [ ] **Step 2: Update Restaurant schema without unverified claims.**

Keep `Restaurant`, address, telephone, email, URL, cuisine, opening hours, and approved social links. Do not add `AggregateRating` without a real source and current value. Add `hasMenu` only when the menu page is complete.

- [ ] **Step 3: Update sitemap and redirects.**

`/root/Jernbane-cafeen/sitemap.xml` must list the five canonical `.html` URLs. Update `301-redirects.csv` so the old `/dagens-ret/` request reaches `dagens-ret.html`, while existing `/menu/`, `/kontakt/`, and `/booking/` compatibility behavior remains intentional and documented.

- [ ] **Step 4: Add an AI-readable business summary.**

Create `llms.txt` with short factual sections for business, food, location, opening hours, contact, menu, catering, and links. Do not include ranking promises or unverified superlatives. Use normal punctuation with no em dashes.

- [ ] **Step 5: Run a metadata and punctuation check.**

Run:

```bash
python3 -c 'from pathlib import Path; files=list(Path(".").glob("*.html"))+[Path("llms.txt")]; required=["<title>","description","canonical"]; bad=[]; dash=[]; [bad.append(str(p)) for p in files if not all(x in p.read_text().lower() for x in required)]; [dash.append(str(p)) for p in files if "—" in p.read_text()]; print({"missing_metadata":bad,"em_dash_files":dash}); raise SystemExit(1 if bad or dash else 0)'
```

Expected: both lists are empty and exit code `0`.

---

### Task 5: Create Lejen Kok as a separate static site

**Files:**
- Create: `/root/Lejen-kok/index.html`
- Create: `/root/Lejen-kok/anledninger.html`
- Create: `/root/Lejen-kok/om-niels.html`
- Create: `/root/Lejen-kok/style.css`
- Create: `/root/Lejen-kok/main.js`
- Create: `/root/Lejen-kok/robots.txt`
- Create: `/root/Lejen-kok/sitemap.xml`
- Create: `/root/Lejen-kok/llms.txt`
- Create: `/root/Lejen-kok/favicon.svg`
- Create: `/root/Lejen-kok/billeder/` with approved food and catering assets only

**Interfaces:**
- Lejen Kok form slug: `lejenkok` after the CMS site entry is verified.
- Form payload matches the Jernbane payload and uses the same optional `data-endpoint` test hook.
- The site does not import CSS or JavaScript from `/root/Jernbane-cafeen`.

- [ ] **Step 1: Create the three-page shell with a distinct wordmark.**

Use a text wordmark until Niels approves a dedicated logo. Use semantic `header`, `nav`, `main`, `section`, `article`, `form`, and `footer`. Add a skip link and a visible current-page state.

- [ ] **Step 2: Write the first-pass Lejen Kok copy.**

The copy must be specific and modest. Use a direction such as:

```html
<h1>Niels kommer med maden. I får tiden sammen.</h1>
<p>Fortæl, hvad I skal samles om, så finder vi en menu, der passer til dagen og gæsterne.</p>
```

Do not claim a fixed response time, service area, menu format, staff size, or event type unless it is verified.

- [ ] **Step 3: Use a separate visual system.**

Use deep ink, muted olive, bone, and one clay accent. Use more whitespace and close food/table crops than the café site. Keep animation quieter: image mask reveal, line movement, and button feedback. Do not reuse the railway-line signature as a dominant motif.

- [ ] **Step 4: Add the inquiry form.**

Use labeled fields for name, email, phone, event date, guest count, and message only if the CMS inbox can store the extra data safely. If the current endpoint accepts only `name`, `email`, and `message`, combine optional details into `message` and keep the payload contract unchanged.

- [ ] **Step 5: Add SEO and social metadata.**

Use `lejenkok.dk` as the public origin. Add page-specific titles, descriptions, canonical URLs, Open Graph metadata, `Service` schema only for confirmed services, and an AI-readable summary with no claims beyond the approved customer material.

- [ ] **Step 6: Run the punctuation and static link gate.**

Run:

```bash
python3 -c 'from pathlib import Path; files=list(Path(".").glob("*.html"))+[Path("style.css"),Path("main.js"),Path("llms.txt")]; dash=[str(p) for p in files if "—" in p.read_text()]; print({"em_dash_files":dash}); raise SystemExit(1 if dash else 0)'
```

Expected: `{"em_dash_files": []}` and exit code `0`.

---

### Task 6: Build the four seasonal social templates

**Files:**
- Create: `/root/Jernbane-cafeen/social/nytaar.svg`
- Create: `/root/Jernbane-cafeen/social/paaske.svg`
- Create: `/root/Jernbane-cafeen/social/sommer.svg`
- Create: `/root/Jernbane-cafeen/social/jul.svg`
- Create: `/root/Jernbane-cafeen/social/README.md`

**Interfaces:**
- Templates use the fixed Jernbane logo asset and the same token names as the website.
- Each template leaves a readable text area for today's dish or menu.
- Text uses normal punctuation and no em dashes.

- [ ] **Step 1: Define one SVG grid and four token variants.**

Each SVG must have a `viewBox="0 0 1080 1080"`, a background, a safe area, logo placement, seasonal title, and a blank content block. Use railway geometry only as a restrained structural element.

- [ ] **Step 2: Verify readability at mobile size.**

Render or open each SVG at 390px wide. Body text must remain legible, the logo must not be clipped, and the content block must have enough room for a real menu sentence.

- [ ] **Step 3: Document usage.**

`social/README.md` must state the four filenames, intended season, safe text length, and that Niels supplies the final approved menu/photo before publishing.

---

### Task 7: Browser verification, councils, and final correction loop

**Files:**
- Create temporary test script under `/tmp/`, not in the repositories: `/tmp/jernbane_playwright_check.py`
- Verify all changed HTML, CSS, JavaScript, SVG, SEO, and CMS-facing files

**Interfaces:**
- Local server: `python3 -m http.server 4173` from Jernbane repo and a separate port for Lejen Kok.
- Browser checks use real rendered DOM, screenshots, console errors, and form state.
- No production inbox POST during tests.

- [ ] **Step 1: Start both static servers and verify readiness.**

Run the existing Jernbane server with the terminal process manager and start Lejen Kok on port `4174`. Verify:

```bash
curl -fsS http://127.0.0.1:4173/index.html >/dev/null
curl -fsS http://127.0.0.1:4174/index.html >/dev/null
```

Expected: both commands exit `0` before browser testing starts.

- [ ] **Step 2: Run the browser scroll-through.**

The Playwright script must visit every page at 1440x900, 1024x900, 768x1024, and 390x844. For each page it must:

```python
page.goto(url, wait_until="networkidle")
page.screenshot(path=path, full_page=True)
page.locator("body").press("Home")
page.locator("body").press("End")
assert page.title()
assert page.locator("main").count() == 1
```

It must collect console errors, broken image URLs, horizontal overflow, missing form labels, and links that return non-200 locally. Expected: zero uncaught console errors, zero broken local images, no horizontal overflow at mobile width, and no dead internal links.

- [ ] **Step 3: Test keyboard and reduced motion behavior.**

Tab from the skip link through navigation, menu, CTA, form, and footer. Every focusable element must have a visible focus style. Emulate `prefers-reduced-motion: reduce` and confirm computed transition/animation duration is effectively disabled.

- [ ] **Step 4: Test forms through a local mock.**

Run a local HTTP mock that records POST JSON and returns `{ "ok": true }`. Set the form's `data-endpoint` to that mock before submit. Submit valid data and assert the mock receives:

```json
{
  "name": "Testperson",
  "email": "test@example.com",
  "message": "Telefon: 12 34 56 78\n\nEn testbesked",
  "honeypot": "",
  "ts": 0
}
```

Also test invalid email, short message, filled honeypot, and mock 503. Expected: inline validation or error text, button state restored, and no browser alert.

- [ ] **Step 5: Run repository checks.**

Run from `/root/buur-cms`:

```bash
npm run test
npm run typecheck
npm run build
```

Run from each static site:

```bash
npx --yes impeccable detect . --json
python3 -c 'from pathlib import Path; files=[p for p in Path(".").rglob("*") if p.is_file() and p.suffix in {".html",".css",".js",".svg",".md"}]; hits=[str(p) for p in files if "—" in p.read_text(errors="ignore")]; print(hits); raise SystemExit(1 if hits else 0)'
```

Expected: CMS tests, typecheck, and build exit `0`; the punctuation check prints `[]`; Impeccable has no unresolved blocking quality findings on changed pages.

- [ ] **Step 6: Run council review after the visual pass.**

Dispatch four read-only council roles: critic, optimist, innovator, and pragmatist. Give them the rendered screenshots, the changed file list, the contract scope, and the rule that they must return concrete findings only. Apply a correction if at least one council role identifies a real usability, factual, accessibility, or visual problem. Re-run the affected browser checks after each correction.

- [ ] **Step 7: Stop with evidence, not assumptions.**

Before reporting the work as ready, collect:

```bash
git status --short --branch
```

Read the actual test outputs, screenshot paths, Impeccable output, and council findings. Report any missing customer approval, missing Lejen Kok repository remote, or unverified NAP as a blocker rather than inventing completion.
