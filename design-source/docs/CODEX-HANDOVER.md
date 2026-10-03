# Codex handover

LucentStar website, blog and LucentSignal entry screens. 1 October 2026 (Round 6: the homepage and both product pages as one connected journey).

This kit holds the approved direction as designs and a working build for lucentstar.ai. Nothing here has been published or connected: lucentstar.ai, blog.lucentstar.ai and signalapp.lucentstar.ai are unchanged. Each piece of work below is its own change and release, and none of it goes live without the owner's instruction.

## Read first

- In this kit: `README.md`, `docs/DESIGN-AND-MOTION.md`, `docs/SHARED-DESIGN.md` (the integration contract), `docs/SITE-PLAN.md`, `docs/FORMS-AND-PRIVACY.md` and `docs/DECISIONS.md`.
- In linkedin-generator, the repository's own `CLAUDE.md` and `HANDOVER.md`, before changing anything there.
- Build the kit with `python3 build.py --check` (Python 3 with Jinja2 and PyYAML). It writes `dist/site/` (pages), `dist/shared/` (the export for the blog and the app) and, in production mode (`url_mode: clean`), `dist/designs/` (the blog and app designs, kept off lucentstar.ai).

## Ground rules

- Keep every existing address, canonical link and piece of structured data.
- Keep authentication exactly as it is: routes, methods, fields, rate limiting, sessions, magic links, redirects and server messages. A restyle never changes behaviour.
- One change per commit. No push without the owner's explicit instruction. UK English, no em dashes, none of these words: supercharge, leverage, unlock, game-changing, revolutionise, streamline, and never the word "most" anywhere on the site (owner decision, 1 October 2026). The kit's build checks its own copy for all of these.
- No invented claims, clients, results or statuses. Product facts live in `content/products/*.yaml`, and its `verification:` list says how far each is checked. Nothing has been verified in the live app or in Stripe.
- Checks against LucentSignal production are read-only: no schema changes, no new tables.
- lucentstar.ai is on GitHub Pages with GoDaddy nameservers. No nameserver changes.
- Change the shared design here, rebuild, then copy the export. Never edit exported files inside another repository. `VERSION` is the build date plus a hash of the exported content: if the hash matches what a site already uses, nothing changed, whatever the date.

## 1. The existing blog (blog.lucentstar.ai)

The Blog & Content Engine in linkedin-generator renders the blog (`lib/blog-render.js` and `blog-server.js`, as the Round 4 review read them; confirm the paths).

- **Restyle it; don't replace it.** Add the shared header (`header-blog.html`), footer, styles and scripts at build time from a folder named after `VERSION`.
- Map every block the live renderer supports to its kit component, using the table in `docs/SHARED-DESIGN.md`. An unmapped block must stop the blog's build, never disappear. (In Round 4 it was the kit's own template that dropped a quote, not the live blog, which shows quotes.)
- Keep the renderer's sanitising, every article address and canonical link, captions, alt text and credits, Article, FAQPage and ItemList data, and the social image tags.
- The live blog loads Google Analytics without a consent banner. Give it the same consent handling as the main site. (This isn't legal advice.)
- **Done when** the index and both reference articles (`safe-linkedin-tools`, `taplio-alternatives`) render with the kit's classes on desktop and phone, no block is lost, structured data validates, and the version is noted in the decision record.
- **Wording:** the kit's two article designs no longer use the word "most" (ten places, listed in the review set's `ROUND6-COPY.md`); the live articles still do. Changing the live text is a content change in the pipeline, separate from the restyle, and only on the owner's instruction.

## 2. LucentSignal: restyle the real `/login`, then `/welcome`

Only these two screens. The signed-in application keeps its own dark interface and is out of scope.

**Sign-in (`/login`).** GET `/login` is around `server.js:1387` and POST around `:1569` in the version the review read; confirm in the current code.

- Keep `method="POST"`, `action="/login"`, the `email` field (email or username), `password`, any hidden fields, rate limiting, sessions, redirects, the links to `/forgot-password` and `/register`, and every server message.
- Swap the page's own top bar and footer for `header-app.html` and `footer.html`, and add the kit's classes (`templates/pages/signal-login.html`). Use `autocomplete="username"` and `autocomplete="current-password"`, and the title "Sign in | LucentSignal".
- Render the server's message in the message box: errors as `role="alert"` with focus on load; success and neutral as `role="status"` tied to the first field (`docs/SHARED-DESIGN.md` has the markup).
- The reset link reads "Forgotten your password?" with "We’ll email you a link to reset it.", because `/forgot-password` resets the password. Offering passwordless access (`/recover`) as well is an open owner decision. Neither route changes.
- Leave out the preview-only parts: `data-auth-preview`, the "Preview a message" control and `scripts/08-previews.js`.

**Welcome (`/welcome`).** Reached after a successful magic-link sign-in.

- Keep the magic-link check that leads here, session creation and checks, what happens to a visitor who isn't signed in, and the existing destination of every link into the app.
- The route has separate desktop and mobile presentations. `templates/pages/signal-welcome.html` covers both in one responsive page (side by side from 1000px; the action first on narrower screens). Apply it to both, or map its two layouts onto the existing ones, and keep any server-side difference between them.
- Use `header-app-signed-in.html` and `footer-signed-in.html` ("Open LucentSignal" instead of "Sign in", same tab), and `lucentstar-welcome.css`.
- "Create your first post" goes to the destination today's page uses; the preview only points at the app's root. It is never animated or delayed.
- The illustration (`templates/visuals/signal-flow.html`) is a screen grab in the app's own dark blue on the white page (owner decision: app screens look like the app). It is decorative and plays once; with reduced motion it is still.
- Title "Welcome | LucentSignal", `noindex`. No plan, allowance, trial, testimonial or personal details.

**Test both in the app before release:** sign-in success and redirect; wrong details, inactive account, expired, used or invalid link, signed out, session changed and reset success; rate limiting unchanged; magic link to `/welcome` to the button's destination, with the session kept; `/welcome` when signed out behaves as today; desktop and mobile presentations; keyboard order; reduced motion.

## 3. Remaining public pages (lucentstar.ai)

- **Built, awaiting approval:** the homepage, `/lucentsignal.html` (keeping `#pricing` and `#faq`) and `/lucentalbedo` (new; add it to the sitemap when it goes live). Round 6 made them one journey: the homepage introduces two customer problems and routes to each product page or a conversation, and each product page tells its own visual story (`stories`, see `docs/DESIGN-AND-MOTION.md`).
- **Still to design and build** (details in `docs/SITE-PLAN.md`): `/about`; `/help` and `/help/ghostwriter` (style and feature names reconciled first); the policy pages (layout only, wording only after legal review); `/cookie-settings` (controls keep working); `/pricing` (keep as a noindex redirect page); `lucentstar.ai/blog/` and its article copies (redirect pages to the blog); `/ai-answer-visibility.html` (redirect page to `/lucentalbedo`); `/company-homepage-draft.html` (remove or redirect). The `/v2/` pages are already redirect pages and can stay.
- Carry over analytics and the cookie banner, with consent denied by default, before anything goes live.
- Hosting for clean addresses (`url_mode: clean`) is an open decision.

## 4. Forms and privacy

- Both forms (the contact section and the Contact us panel) are enquiry-only, show the owner's notice above the send button, have no checkboxes, and stay simulated.
- Before `simulated: false`, the ten steps in `docs/FORMS-AND-PRIVACY.md` must be done: none are yet. They cover the lawful basis, the form service and its terms, the mailbox provider, who can read enquiries, deletion, the privacy page update, one name for it (the forms and footer say "Privacy Notice", the page still says "Privacy Policy"), qualified review, keeping enquiries out of marketing, and an end-to-end delivery test.
- Don't invent a provider, retention period or legal assurance. Adding notice text doesn't make the site compliant, and the site mustn't claim it is.

## 5. Unresolved: LucentSignal pricing and allowances

**Flagged, not decided.** The site and the app disagree:

- The site describes fixed post counts (Free 3, Creator 20, Pro 75), a Free allowance that doesn't renew, and £19 and £39 prices. The Taplio article says "no credit system".
- The app's constants match those counts (plus a 5-post trial), but its source counts usage within the calendar month, Free included, and a refinement uses 0.34 of the same budget (`server.js:87`, `139`, `4154` and `4286` in the version the review read).
- The £19 and £39 charges haven't been checked in Stripe.

Don't change the commercial offer, don't reword the plans to either model, and don't claim live verification. Wait for the owner's decision, then check the deployed revision and Stripe (read-only) and word the site to match.

Other open owner decisions are listed under "Open questions" in `docs/SITE-PLAN.md`.

## 6. Outstanding tests

Tested so far in Chromium only, on the kit's review build (evidence in `docs/DECISIONS.md`). Still to do:

- Screen readers (VoiceOver and NVDA), 200% zoom, Safari and Firefox, and real phones on a slow network.
- Real form delivery, end to end.
- Everything in the live app after the restyles: every sign-in message state, the magic-link welcome flow, sessions, redirects and rate limiting.
- The blog after its adapter: every live block, structured data in a validator, and social cards.
- Stripe prices and plan gating, read-only.
- Performance, analytics and consent on the published pages.

## Where things are

| What | Where |
| --- | --- |
| Page copy | `content/pages/*.yaml` (`home`, `lucentsignal`, `lucentalbedo`, `signal-login`, `signal-welcome`) |
| Products and their facts | `content/products/*.yaml` |
| Homepage examples and photo records | `content/examples.yaml` (credits, sources, licences) |
| Articles | `content/blog/posts/*.yaml` |
| Templates | `templates/` (`pages/`, `sections/` with `stories.html` for the product page stories, `showcases/`, `visuals/` with `stories.html`, `service.html` and `signal-flow.html`, `partials/header.html`, `partials/footer.html`, `partials/icons-extra.html` for icons only the website uses) |
| Styles | `styles/` (`08b-stories.css`, `17a-blog.css`, `17b-auth.css`, `17c-welcome.css` among them) |
| Behaviour | `scripts/` (`03-sections.js` section motion, including the product page stories, `05-examples.js` switching, `06-enquiry.js` forms and panel; `08-previews.js` is review only) |
| The export | `dist/shared/`, with `reference.html` showing every shared component |
