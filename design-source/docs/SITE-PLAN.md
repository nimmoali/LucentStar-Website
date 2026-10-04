## Published follow-up, 4 October 2026

Approved homepage introduction, consulting-led services, direct product cards and separate About page. LucentAlba replaces the public LucentAlbedo name, using #24105E for its wordmark. Legacy product pages redirect to /lucentalba. The approved five-step partnership copy is retained. Public forms retain their released disabled configuration and email fallback. Earlier records below describe historical states.

# LucentStar website plan

Version 6, 1 October 2026 (Round 6). This plan covers every public page listed in the lucentstar.ai and blog.lucentstar.ai sitemaps (read again on 28 September 2026), the /pricing address the footer links to, the older copies of the blog articles under lucentstar.ai/blog/, pages the website repository serves outside its sitemap, and the LucentSignal sign-in, welcome, registration and secure access link screens. Existing addresses are kept. The eight pages in the review set don't replace the full-site sweep: every other page below still needs its own design, build and check.

## Owner direction recorded in Codex, 3 October 2026

Source: Ali's “GA IS FINE BUT HIGHLIGHT WE ARE MISSING THE SOCIAL ONE LATER TO ME ADD THIS TO A ROADMAP”, followed by “JUST TO BE CLEAR THIS SHOULD BE IN CODEX” and “DONT START MESSING AROUND WITH CODE THIS CHAT IS DIRECTIONAL”, in “Rebrief LucentStar AI website” (`01a0e36e-6919-7463-9086-71331c6463d8`). Recorded here in the isolated website review candidate only, not Cowork or the LucentAlbedo product roadmap.

- **Google Analytics IDs: owner direction accepted.** Keep `G-LF5E1LE400` for website/blog and `G-7QXEM75LZJ` for LucentSignal. This accepts the identifiers as direction; it does not verify Analytics admin settings, event delivery or the signed-in app consent flow. No new tracking implementation is authorised.
- **Social media tracking pixels: future / not built. Not a Round 6 launch requirement.** Platform and account IDs have not been supplied. Decide which platforms and purposes are needed, add separate advertising/social consent and updated notices, then implement and verify across each relevant origin before activation. Analytics acceptance must not be treated as advertising/social consent. No social pixels are being added in Round 6.
- **Separate release issue: signed-in LucentSignal analytics consent.** The existing app loads its GA tag without checking the shared analytics choice, and its old cookie-settings preference does not govern that tag. This remains a release gap; accepting the GA IDs does not settle it. No fix is implemented or authorised by this directional discussion.

The previously authorised Round 6 copy corrections remain implemented and tested. This roadmap note grants no commit/push, publication, provider activation, production access, commercial or Albedo claim approval.

## Launch focus and Free offer, 3 October 2026

Owner direction: get the Round 6 website live. Social pixels and additional AI-assisted refinement work are future roadmap items, not launch requirements. The existing refinement endpoints are not a new feature in this release.

Free is **three posts initially, not three per month** (confirmed owner decision). The isolated candidate now reserves three lifetime full-draft slots, makes optional refinements unable to reduce those slots, retains bounded refinement checks and displays no monthly Free reset. Paid, private-trial and repurpose windows remain unchanged. Real disposable PostgreSQL and browser evidence is in the release report; this is not deployed.

Existing-account treatment selected under Ali's latest direction, without another owner decision: count retained full-draft history across all plans; do not refresh Free allowance on cancellation/downgrade. Historical rows lacking attribution are not guessed or back-charged. No schema migration or mass reset is prepared. Prices remain a separate live-billing verification item.

Recommended launch scope: current hosting, reviewed website/blog/entry changes and the Free correction, with email contact available and form delivery disabled until its separate activation gates are satisfied. Final content/privacy closeout and publication approval remain. The routine existing-account treatment is not a launch gate. See the candidate's `GO-LIVE-CHECKLIST.md` for the single launch sequence, integration assessment and final test plan.

## How to read the status

| Status | Meaning |
| --- | --- |
| Proposed choice | Suggested in a review round. Not yet approved by the owner. |
| Owner decision | Decided by the owner, with the date. |
| Implemented preview | Built in the source kit and viewable in the review set. Not live. |
| Tested | Checked in a browser in a review round (see `docs/DECISIONS.md` for the evidence). |
| Live | Changed on a live site. **Nothing so far**: nothing on lucentstar.ai, blog.lucentstar.ai or signalapp.lucentstar.ai has been changed, published or connected. |

## Shared across every page

- **Header:** How we help, Our products (LucentSignal and LucentAlbedo), Our approach, About and Blog, then Sign in and Let's talk. Clients is added only when approved client material exists.
- **Footer:** How we help, Products (each product, Try LucentSignal, Sign in, Pricing and Help), Company (About, Our approach, Blog, Contact) and Legal (all eight policy pages).
- **Page title:** every page starts with the same title style (Poppins 700, 40 to 80px) and introduction.
- **Product wordmarks:** LucentSignal and LucentAlbedo labels, menus, tiles, product screens and the sign-in title use one wordmark component. Lucent is the brand blue #0B0F1A on light backgrounds (owner decision, Round 5) and white on dark; Signal is green and Albedo purple.
- **Contact:** the floating Contact us panel appears on the main site and the blog, and the contact form ends most main-site pages. Both are enquiry-only, show the owner's enquiry notice above the send button, and will deliver to hello@lucentstar.ai once a form service is connected and tested. The current candidate disables delivery and offers an email fallback; it does not simulate successful sending. See `docs/FORMS-AND-PRIVACY.md`.
- **The blog and the app** will take the header, footer and styles from the kit's shared export once their adapters are built (see `docs/SHARED-DESIGN.md`).

## Page by page

| Address | Today | Plan | Built from | Status |
| --- | --- | --- | --- | --- |
| / | Software-led homepage featuring LucentSignal, LucentCase and LucentChatter | The consulting-led homepage, kept concise: the opening and its "Industries we’ve worked with" examples; How we can help with two customer problems (AI visibility, then AI workflows in marketing), each leading to its product page or a conversation, and bespoke projects; five practical steps; the products and their stories (LucentAlbedo's report labelled planned); About, questions and contact. Keeps the #products, #bespoke, #workflows and #visibility anchors | Opening, services, workflow, products, showcases, about, questions, contact | Implemented preview, tested (Round 6). Awaiting approval |
| /lucentalbedo (new) | None | LucentAlbedo page in the Albedo purple theme. The AI visibility story, leading with unreliable measurement, as consulting available now (#evidence); two ways to work with us; then the planned online version: the report design and planned features | Page opening, story, ways, showcase, card grid, questions, contact | Implemented preview, tested (Round 6). Awaiting approval |
| /lucentsignal.html | Product page saying "Now in private access" | Rebuilt at the same address with the live title, description and search engine data kept: "Available now"; its story from your expertise to a planned post (#workflow); who it helps; LucentSignal or bespoke consulting (#fit); a closer look at voice, the three styles, feedback, scoring, planning and export (not publishing); pricing at #pricing and questions at #faq. The Agencies card no longer claims several clients in one dashboard | Page opening, story, card grid, ways, chapters, pricing, questions, closing band | Implemented preview, tested (Round 6). Plans to reconcile and facts to check in the app (see below) |
| /pricing | A redirect page to /lucentsignal.html#pricing (noindex) | Keep as a redirect page (GitHub Pages has no server redirects) | Redirect | Proposed choice |
| /about | About page centred on LucentSignal and "a small, focused team" | Rebuild at the same address with the general introduction and principles. The header's About link moves here once it's live | Page opening, about, contact | Proposed choice |
| /help | LucentSignal help: getting started, common questions, contact support | Shared header and footer, questions as expandable items. Style and Ghostwriter names follow the app once checked | Page opening, questions, contact | Proposed choice |
| /help/ghostwriter | Help article "Getting better results with Ghostwriter" | Article layout with a "Back to help" link. Its style names (Direct, Measured, Sharp) must be reconciled first | Article template | Proposed choice |
| /privacy, /terms, /cookie-policy, /acceptable-use, /ai-transparency, /accessibility, /subprocessors | Policy pages | Policy layout: title, last updated date, a contents list for long pages and a readable column. Wording only changes after legal review, including the enquiry work in `docs/FORMS-AND-PRIVACY.md` | Policy template | Proposed choice |
| /cookie-settings | Cookie preference controls | The policy layout, with its controls kept working | Policy template and existing controls | Proposed choice |
| blog.lucentstar.ai/ | Blog index with two articles, called "Guides" | Shared header and footer with Blog current. Cards show category, title, summary, reading time and date, with a LucentSignal band | Blog index template | Implemented preview, tested. Awaiting approval |
| blog.lucentstar.ai/safe-linkedin-tools | Article with a quick answer, a table, an audit list and related links | The article template, same address, with its Article and FAQPage data kept | Article template | Implemented preview, tested. Awaiting approval |
| blog.lucentstar.ai/taplio-alternatives | Article with comparison tables, eight tool cards and in-article actions | The article template, same address, keeping its Article, ItemList and FAQPage data. The review version adds a hero photo, a photo with a caption and a quote, to exercise the live blog's image and quote blocks | Article template, comparison cards | Implemented preview, tested. Awaiting approval |
| lucentstar.ai/blog/, /blog/index.html, /blog/safe-linkedin-tools.html, /blog/taplio-alternatives.html | Older copies of the blog, each pointing search engines at blog.lucentstar.ai | Keep the addresses working as redirect pages to the blog | Redirect | Proposed choice |
| signalapp.lucentstar.ai/login | Dark sign-in card with its own top bar and footer | Owner decision (Round 5): apply the new design to the existing `/login` route in linkedin-generator. Keep its form contract, rate limiting, sessions, redirects, registration and recovery links, and every server message, in the error, success and neutral message variants. The reset link describes the reset accurately | Sign-in template (shared export) | Owner decision. Implemented preview with every message state, tested. The restyle in the app isn't built |
| signalapp.lucentstar.ai/welcome | The page people reach after a successful magic-link sign-in, with separate desktop and mobile presentations (not visible without signing in, so not read for this plan) | Owner request (29 September 2026): redesign it in the white shared design with the signed-in header and footer ("Open LucentSignal"), the wordmark title, a short "what happens next", one "Create your first post" action available at once, and an idea, draft and review illustration with restrained motion. Keep the magic-link sign-in, the session handling and the existing destination into the app | Welcome template (shared export) | Implemented preview, tested. Awaiting approval. Not built in the app |
| signalapp.lucentstar.ai/forgot-password, /register | Dark cards like the sign-in screen | Later, as separate changes: the same shell, but each keeps its own form, fields, destination and messages. Registration keeps its optional product-updates box. The recovery page's "No password needed" wording must match what the route does | Sign-in shell | Proposed choice, not in the confirmed scope |

Add /lucentalbedo to the lucentstar.ai sitemap when it goes live. The blog sitemap doesn't change.

## Routes and metadata to keep

Read from the website repository and the live pages on 28 September 2026. When a page is rebuilt, keep its address and canonical link, and keep its search engine data. Titles and descriptions stay as they are unless a change is listed here (em dashes in titles are replaced).

| Address | Live title | Canonical | Search engine data | In the rebuild |
| --- | --- | --- | --- | --- |
| / | LucentStar AI (em dash) Practical AI products for business teams | https://lucentstar.ai/ | None | Proposed new title "LucentStar AI \| Practical AI, built around your business" and a new description, for the agency-led positioning |
| /lucentsignal.html | LucentSignal \| AI LinkedIn Post Generator That Sounds Like You | https://lucentstar.ai/lucentsignal.html | Organization, SoftwareApplication (with the three prices), FAQPage | Title and description kept; the data is now made from the product file and the page's questions |
| /about | About LucentStar AI | https://lucentstar.ai/about | None | Keep |
| /help | Help & Support · LucentStar AI | https://lucentstar.ai/help | None | Keep |
| /help/ghostwriter | Getting better results with Ghostwriter \| LucentSignal | https://lucentstar.ai/help/ghostwriter | None | Keep (the name follows the app once checked) |
| /privacy | Privacy Policy · LucentStar AI | https://lucentstar.ai/privacy | None | Keep until the privacy review decides the name |
| /terms, /cookie-policy, /cookie-settings, /acceptable-use, /ai-transparency, /accessibility, /subprocessors | Their current titles, each ending "· LucentStar AI" | The same addresses without .html | None | Keep |
| /pricing | Pricing · LucentStar AI (noindex) | None | None | Keep as a noindex redirect page |
| blog.lucentstar.ai/ | The LucentStar Blog | https://blog.lucentstar.ai/ | Social tags | Kept in the design |
| blog.lucentstar.ai/safe-linkedin-tools | Safe LinkedIn Tools: Which Ones Never Touch Your Account | The same address | Article, FAQPage, social tags | Kept in the design |
| blog.lucentstar.ai/taplio-alternatives | 8 Best Taplio Alternatives in 2026 | The same address | Article, ItemList, FAQPage, social tags | Keep |
| lucentstar.ai/blog/ copies | "Guides (em dash) LucentStar AI" and the article titles | The blog.lucentstar.ai addresses | None | Redirect pages |
| signalapp.lucentstar.ai/login | LucentStar AI (em dash) Sign in | None | None | Proposed "Sign in \| LucentSignal" |
| signalapp.lucentstar.ai/register, /forgot-password | LucentStar AI (em dash) Create your account; LucentStar AI (em dash) Forgot password | None | None | Titles without the em dash, when those screens are designed |

## Pages served outside the sitemaps

The website repository publishes everything in it, so these addresses are reachable today although no page links to them:

- **/company-homepage-draft.html:** a draft homepage, with no canonical link and no noindex.
- **/v2/:** 13 small redirect pages (home, LucentSignal, help, the Ghostwriter article and the policy pages), each forwarding to the current page with a meta refresh and a canonical link. Round 4 called them copies; Round 5 checked four of them and corrected this. They're harmless and can stay.

Proposed: decide whether to remove the draft homepage or turn it into a redirect page when the new site is published, so it isn't found by search engines or visitors. Plan it with the other redirects; nothing has been deleted.

## Blog index and articles

- **Navigation:** the same header and footer as the main site, with Blog as the current item.
- **Header action (proposed, recommended in the Round 4 review):** the shared "Let's talk". Try LucentSignal stays in the index band and in articles' own actions.
- **Readers' questions:** questions keep the reader's own words ("Can LinkedIn restrict my account...?"), as the owner allowed in Round 4. The build treats article questions and product-page questions marked `reader_voice` as the reader's voice.
- **Reading:** an article column about 68 characters wide, body text at 18px with a line height of 1.7, clear heading levels, styled tables (one labelled card per row on phones), numbered lists and callouts.
- **Motion:** restrained: the heading fades in once and index cards reveal once. No pinning and no scroll-linked effects, and reduced motion is respected.
- **Addresses:** existing article addresses stay exactly as they are. In the review set, every article built in the kit opens its local design; others open the live article.

## LucentSignal facts: where they come from

The product file (`content/products/lucentsignal.yaml`, `verification:`) records each fact's source and status. The independent Round 4 review read the app's source code (linkedin-generator, last commit 70e4444 of 5 September 2026, with uncommitted local edits), which moves several facts to "checked in the app's source". That is evidence, not proof of the deployed version, and nothing has been checked in the live app or in Stripe.

| Fact | Status | Evidence | What's left |
| --- | --- | --- | --- |
| Plans, prices, allowances | Conflict | Counts match the constants (Free 3, trial 5, Creator 20, Pro 75; `server.js:87`, `139`). The quota counts use within the calendar month, Free included, and a refinement uses 0.34 of the budget (`server.js:4154`, `4286`) | Decide the intended offer, confirm the deployed revision and check the Stripe prices, then word the plans to match. The site keeps the marketing wording until then |
| Exports by plan | Source | `/api/export`, `/api/exports/allowed`, `/api/exports/calendar/:type` | Trial and internal exceptions; not exercised with account data |
| Platform formats | Source | Routes for Hootsuite, Agorapulse, Airtable, Notion and an ICS file ("Google Calendar") | No downloaded files checked |
| Other plan features | Marketing page | The brand system disagrees about Free, Creator and Pro | Plan gating in the app |
| Style names | Source | `public/index.html:2725` | Align the help page and the Ghostwriter article |
| Scoring | Source | Editor score handling and export code | Align the AI transparency page |
| Feedback and review | Marketing page | "The reason behind it", "specific feedback" | How suggestions work in the app |
| Several clients | Conflict | One voice profile per account (`db/schema.sql:88`, `server.js:3561`) | Claim removed; bring it back only with a verified feature |
| Voice feature name | Source | Ghostwriter labels and `/api/ghost` | Align the privacy policy's wording |
| Publishing | Owner decision | "No" | None, unless a publishing feature is confirmed |
| Password recovery | Source | `/forgot-password` resets the password (`server.js:3213`); `/recover` is passwordless | The live wording describes passwordless access |
| Screen labels | Written for the design | None | Compare with the app |

## Owner decisions

- 1 October 2026 (Round 6): refine the homepage and both product pages as one connected journey. LucentStar is a close, practical consulting partner supported by LucentSignal (available now) and LucentAlbedo (coming soon), for businesses and smaller in-house teams. The homepage stays concise, makes consulting prominent, introduces two recognisable problems and sends visitors to the relevant product page or a conversation; the fuller pain points, visuals and methods go on the product pages. AI visibility leads with unreliable measurement (a design priority, not a claim about industry consensus). LucentAlbedo keeps consulting now and the planned online version clearly apart, and its disclosure. LucentSignal shows its own role and is told apart from bespoke consulting; it doesn't publish to LinkedIn or provide every integration. Pricing and FAQ anchors stay, and the plan question stays open.
- 1 October 2026: never the word "most" anywhere on the site.
- 29 September 2026 (Round 5, final pass): remove three homepage notes ("Example using fictional data and stock photos", the services examples' fictional-data note and the LucentSignal story's note), with no replacement disclaimers. LucentAlbedo's disclosure and limitations stay, and photo credits stay in the internal records.
- 29 September 2026: the homepage's review step now reads "We agree what AI can handle and where a person needs to review, approve or take over. Routine answers can use your approved guidance; sensitive questions and important decisions stay with your team."
- 29 September 2026: example switching keeps the current photo until the next is ready, with a graceful fallback, and never holds up scrolling.
- 29 September 2026: any screen that shows the LucentSignal app looks like the app (its dark blue interface), on the page's white background.
- 29 September 2026: redesign the LucentSignal welcome screen (`/welcome`) in the new design, with "Open LucentSignal" instead of "Sign in" in the header, keeping its magic-link sign-in, sessions and destination. Pricing and allowance decisions stay open and flagged.
- 28 September 2026 (Round 5): the brand blue is #0B0F1A. Lucent is #0B0F1A on light backgrounds and white on dark; Signal and Albedo keep their colours. The Round 4 proposal #2451E6 is rejected.
- 28 September 2026 (Round 5): apply the new sign-in design to the existing sign-in page, by restyling the `/login` route in linkedin-generator and keeping its authentication contract.
- 28 September 2026 (Round 5): the homepage examples get relevant imagery and the label "Industries we’ve worked with", which describes the team's wider industry experience, not delivered client projects.
- 28 September 2026 (Round 4): LucentSignal shows Lucent in blue and Signal in green on light backgrounds; LucentAlbedo shows Lucent in blue and Albedo in purple; on dark backgrounds Lucent is white. One reusable wordmark with light and dark variants, keeping the full name accessible. Ordinary mentions in sentences stay plain text.
- 28 September 2026 (Round 4): the homepage's dash-like separators are replaced with an icon; a four-point star is the proposed treatment.
- 28 September 2026 (Round 4): both forms are enquiry-only, with the owner's notice near both send buttons and no marketing subscription, consent checkbox or privacy-acceptance checkbox. Company and topic stay optional. The simulated-delivery disclosure stays until delivery is connected and tested.
- 28 September 2026 (Round 4): LucentSignal doesn't publish directly to LinkedIn: the answer is "No".
- 28 September 2026 (Round 4): readers' natural questions, such as "my account", may stay.
- 28 September 2026 (Round 3): #00E676 stays the main website's brand green, including heading emphasis, chosen knowingly despite its contrast limitation. The proposed #009E51 is withdrawn.
- 28 September 2026 (Round 3): the LucentAlbedo page uses the Albedo purple for heading emphasis, buttons, accents and the Contact us launcher.
- 28 September 2026 (Round 3): homepage product sections use white pills, keep Try LucentSignal, and link to each full product page.
- 28 September 2026 (Round 3): text links are underlined; heading emphasis and navigation stay colour-based; pill buttons have no underline.
- 28 September 2026 (Round 3): one discreet "Example using fictional data" note instead of "Illustrative example" badges. DMC means destination management company.
- Round 2, kept: marketing is the default homepage example; About is business-focused; LucentSignal is available now; LucentAlbedo is coming soon, with planned online features and consultancy kept distinct; clients stay hidden; both contact forms stay.

## Tested in Round 6 (1 October 2026, Chromium)

Full evidence is in `docs/DECISIONS.md`. In short: the build, a production build and a rebuild from the kit zip pass; twenty deliberate mistakes stop the build, including the word "most" and a comma that splits a text value; no stuck scrolling and no long tasks on the three pages at 1440 by 900 and 1280 by 800; no sideways scrolling at 320px or 390px in either motion mode on every page; every new link and anchor works by keyboard with a visible focus outline, and the story pictures hold nothing focusable; the stories change state with the wheel and with Page Down; the Contact us panel, the switcher and the questions behave as before.

## Tested in the final pass (29 September 2026, Chromium)

Full evidence is in `docs/DECISIONS.md`. In short: the three notes are gone from the homepage with the spacing closed (the services section now ends 144px after its content on desktop and 80px on phones, like the next section); switching kept the current example until the next photos were decoded, fell back to the tinted panel when photos failed, went ahead at six seconds when they were very slow, let the newest choice win, and scrolling carried on while it waited; the welcome screen's action was in view and usable in the first frame at every width, with no sideways scrolling at 320px or 390px; the build, a production build and the deliberate-mistake tests pass.

## Tested in Round 5 (review preview, Chromium)

Full evidence is in `docs/DECISIONS.md`. In short: the build, a production-mode build and a rebuild from the kit zip pass; eighteen deliberate mistakes each stop the build; a disposable third product, landing page with one example, article using every newer block, client, logo and text-only example were added without template changes; Lucent is #0B0F1A in every light context; the switcher has its visible name, keyboard control, deep links and deferred photos; the second article's cards, images, quote and metadata are right; the sign-in message states have the right roles and focus.

## Tested in Round 4 (review preview, Chromium)

Full evidence is in `docs/DECISIONS.md`. In short: the full build and a production-mode build pass their checks; twelve deliberate mistakes each stop the build; a disposable third product, landing page, article, client and logo were added without template changes; wordmark colours and accessible names are right in every context; the Contact us panel keeps its timings, keyboard behaviour and reduced-motion behaviour; collapsed answers stay out of the accessibility tree; no page scrolls sideways at 320px or 390px; no stuck scrolling on the three main pages.

Not tested: screen readers, 200% browser zoom, Safari and Firefox, real form delivery, and anything in the live app or its billing.

## Consistency fixes found during the reviews

- LucentSignal's status reads "Live" on the homepage and "Now in private access" on its own page. It becomes "Available now" everywhere.
- The writing style names, scoring terms and the voice feature's name differ between pages (see the facts table above).
- The blog calls itself "Guides". It becomes "Blog" everywhere.
- The live LucentSignal page links to /ai-answer-visibility.html, which returns "page not found". The rebuilt page drops the link; a redirect page to /lucentalbedo would catch old links.
- The safe LinkedIn tools article links to lucentstar.ai/blog/taplio-alternatives.html, an older copy. The design points it at blog.lucentstar.ai/taplio-alternatives.
- The sign-in page title puts an em dash between "LucentStar AI" and "Sign in", and its username field has `autocomplete="off"`. The design proposes "Sign in | LucentSignal" and `autocomplete="username"`.
- The privacy policy and the subprocessors page give the subprocessor list's address as lucentstar.ai/legal/subprocessors, which returns "page not found". The list is at /subprocessors.
- The current "Contact" link opens an email. The new site uses the contact form and shows the address as text with a copy button.
- LucentCase and LucentChatter appear on the current homepage but have no pages. They are not part of the new product story.

## Launch requirements carried over from the live site

- **Analytics and cookie consent:** the live homepage and LucentSignal page load Google Analytics with consent defaulting to "denied" and a cookie banner. The rebuilt pages need the same banner and consent handling before they go live.
- **The blog's consent gap:** the live blog loads Google Analytics with no banner and no consent default. The blog should get the same banner and consent handling as the main site. This is worth fixing before the redesign, and isn't legal advice.
- **Structured data:** the kit now writes the LucentSignal page's and the article's data from their content. The blog adapter must carry the article data across, including Taplio alternatives' ItemList.
- **Redirects:** /pricing, /ai-answer-visibility.html, the lucentstar.ai/blog/ copies, and a decision on /company-homepage-draft.html and /v2/.
- **Enquiry forms:** the ten steps in `docs/FORMS-AND-PRIVACY.md`, then connect and test delivery to hello@lucentstar.ai and set `simulated: false`.
- **Product facts:** the checks in the facts table above, before the LucentSignal page goes live.
- **Adapters:** the blog and app adapters and their releases (`docs/SHARED-DESIGN.md`).

## Phases

1. Review and approve the review set: homepage with its photos, LucentAlbedo, LucentSignal, the blog designs, the sign-in design and the welcome screen, plus the star and the other proposed choices.
2. Check the LucentSignal facts in the app and billing, then build the approved LucentSignal page, the /pricing redirect and the About page.
3. Help and the Ghostwriter article, with the names reconciled.
4. Policy pages (layout only), and the privacy notice work for the enquiry forms.
5. The sign-in and welcome restyles in the app (the owner's confirmed scope), with every message state, each as its own change and release. Then the blog adapter, restyling the live renderer block by block. Registration and recovery later, each with its own contract.
6. Launch preparation:
   - choose hosting for clean addresses (`url_mode: clean`)
   - check every existing address, redirect and draft page
   - carry over analytics and the cookie banner
   - connect and test form delivery, then turn off the simulated labels
   - test with a screen reader, at 200% zoom and in Safari and Firefox
   - final content sign-off

## Open questions

- **Star:** navy at 12px, as shown, or in the page accent colour? And should the middle dots in step labels also become stars?
- **LucentAlbedo screens:** white header bars (so the wordmark reads clearly), as shown, or the previous deep purple with a different wordmark treatment?
- **Privacy page name:** the forms and footer now say "Privacy Notice" (reviewer's recommendation); the live page's heading says "Privacy Policy" until it is updated.
- **Switcher labels and photos:** "Marketing" instead of "Marketing teams", the supporting line, and the four stock photos.
- **Passwordless access:** should the sign-in screen also offer `/recover`, next to the password reset?
- **LucentSignal plans (unresolved, flagged):** fixed post counts on the site, a monthly budget with fractional refinements in the app. Which is the intended offer, and do the £19 and £39 charges match Stripe? The site keeps its current wording and claims no live verification until this is settled.
- **Welcome screen:** the destination of "Create your first post" and "Open LucentSignal" is the one today's `/welcome` page uses; confirm it in the app when the restyle is built.
- **LucentSignal and source material (Round 6, to confirm):** the page says LucentSignal helps you turn your expertise into LinkedIn drafts, and its story shows notes, a talk, a saved article and a past post feeding one idea. The product record confirms a one-sentence idea, trending topics, and writing examples and voice rules for the voice; whether material can be pasted or uploaded directly isn't confirmed. If it can't, the picture should show the material informing your idea rather than going into the app.
- **LucentSignal planning (Round 6):** the story says "plan when it goes out" without naming the calendar, because the marketing page lists the calendar on Creator and Pro and plan gating isn't checked.
- **LucentAlbedo consulting method (Round 6, to confirm):** agreeing the questions, the assistants and settings, and when to repeat checks; keeping every answer in full with its sources; saying what wasn't assessed; a short list of priorities tied to the evidence. Confirm this matches how the consulting is delivered today.
- **Blog wording:** the live articles still use the word "most"; the kit's article designs don't. Change the live text through the blog pipeline if you'd like them to match.
- **LucentSignal page title:** the live title "AI LinkedIn Post Generator That Sounds Like You" is kept for search, although the brand system avoids positioning LucentSignal as an AI generator. Keep it?
- **LucentSignal facts:** the checks in the facts table.
- **LucentAlbedo online version:** scope, price and release date are not confirmed. /lucentalbedo is a proposed new address.
- **Build and hosting:** the kit is a candidate foundation for Claude and Codex, and the hosting decision is still open.
- **Clients:** the section stays hidden until approved material is supplied.

## Out of scope

- The signed-in LucentSignal app and the LucentAlbedo report application.
- Any marketing subscription. It would need its own decision (see `docs/FORMS-AND-PRIVACY.md`).


## 3 October 2026 integrated launch decision

This update supersedes older launch questions above. The maintained website, blog and login/welcome integration is prepared. Free is three initial posts with no monthly reset and retained generation history. Owner direction sets all offer prices to £ sterling, Creator £19/month and Pro £39/month. Live Stripe still uses USD; verified GBP activation is a paid-launch blocker. Forms remain unavailable with a working email link until real delivery is tested. The public draft remains, with its remaining em dash corrected. Albedo consultancy accuracy awaits owner confirmation. The signed-in analytics gap is now fixed in the integrated source; controlled production verification remains required. Routine copy polish, social pixels and new refinement features are post-launch. Review the Round 6 integrated report/checklist before committing, pushing or publishing.


## 3 October 2026 live release closeout

The owner’s “review codex and send live” approval superseded the preparation-only status above. The website, dynamic blog, login/welcome and signed-in consent fix are published. Creator £19 and Pro £39 GBP prices and the dedicated billing portal are verified and configured in production, with historical USD recognition retained. Free remains three initial posts with no reset. Live auth/session, entitlement, consent and unpaid checkout inspections passed; no real payment, AI generation or email was created. Albedo consultancy copy now invites a scoped project discussion and labels fictional illustrations; the online product remains planned. Mailbox operational details are not invented. Forms stay disabled with email links. Legacy routes and the draft remain, with the draft punctuation fixed. Routine copy polish, social pixels, new refinements and form activation remain post-launch.
