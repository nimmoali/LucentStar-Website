## Published follow-up, 4 October 2026

Approved homepage introduction, consulting-led services, direct product cards and separate About page. LucentAlba replaces the public LucentAlbedo name, using #24105E for its wordmark. Legacy product pages redirect to /lucentalba. The approved five-step partnership copy is retained. Public forms retain their released disabled configuration and email fallback. Earlier records below describe historical states.

# Website decision record

Keeps owner decisions, proposed choices, what the preview implements, what was tested and the live state apart. Newest first. Earlier rounds are summarised at the end; the full Round 1 to 3 record is in the project's decision record.

## Round 6 (1 October 2026): one connected journey across the homepage and both product pages

### Owner decisions

- **One journey, consulting first.** LucentStar is a close, practical consulting partner supported by two focused products: LucentSignal, available now, and LucentAlbedo, coming soon. The main audiences are businesses and smaller in-house teams. The homepage and both product pages are refined as one connected journey.
- **A concise homepage.** It makes consulting prominent, introduces two recognisable problems (AI visibility, and AI workflows in marketing) and sends visitors to the relevant product page or a conversation. Tightening or replacing existing copy and visuals is preferred to adding sections. The fuller pain points, visual explanations and methods go on the product pages. The opening application example (Marketing by default) and the "Industries we’ve worked with" switcher (Agencies, Travel DMCs, Holiday lets) stay; the heading describes the team's wider industry experience, not delivered LucentStar AI projects.
- **AI visibility leads with unreliable measurement:** one prompt, model or run can mislead; answers vary with wording, model and time; no universal cross-model score resolves this. Other pains: being absent or described inaccurately, unclear sources and not knowing what to address first. This is the owner's design priority, not a public claim about industry consensus.
- **LucentAlbedo page:** the problem and the potential response as a visual sequence (one buyer question, different captured answers, the questions tested, sources, variation, limitations, a short list of priorities), with mentioned, recommended and cited kept distinct, and how consulting defines a sensible scope, examines the evidence and helps a business decide. Consulting available now and the planned limited online version are clearly separate. The existing disclosure stays. Nothing implies complete coverage, stable rankings, a trustworthy universal score, guaranteed improvement or revenue attribution.
- **LucentSignal page:** deeper on its actual role (expertise and source material into LinkedIn drafts shaped by the user's voice, with editorial guidance, human review and planning), shown as a visual progression, and distinguished from bespoke consulting for wider marketing workflows. LucentSignal doesn't publish directly to LinkedIn or provide every bespoke integration. The pricing and FAQ anchors stay, and the plan and refinement allowance question is not resolved by assumption.
- **Never the word "most"** anywhere on the site (1 October 2026).
- **Kept:** every earlier decision, including white spacious layouts, the shared title sizes, the colours and wordmarks, the bright-green headline emphasis, white homepage product pills, underlined text links, the star, no em dashes, no green or faded content-box borders, the Contact us panel and bottom form (simulated), Blog in the navigation, hidden clients, and no return of the three removed homepage notes.

### Proposed choices, awaiting approval

- **Page order and journey.** Homepage: opening, How we can help (AI visibility, AI workflows in marketing, bespoke), How we work together (five steps), the products and their two stories, About, questions, contact. LucentAlbedo: opening, the visual story (consulting, available now), two ways to work with us, the report design (planned for the online version), planned features, questions, contact. LucentSignal: opening, the visual story, who it helps, LucentSignal or bespoke consulting, a closer look at each step, pricing, questions, closing band.
- **Copy.** The new homepage introduction, the How we can help lead and its two problem chapters (each with a product page link and a conversation link), How we work together as five practical steps told through a small marketing team's monthly newsletter (the fifth keeps the owner's wording of 29 September), the LucentAlbedo story, ways and labels, the LucentSignal story and the LucentSignal or bespoke section. The exact text is in the review set's `ROUND6-COPY.md`.
- **Two smaller consistency edits** on the homepage: About now says "a small, hands-on AI consultancy" for "businesses and smaller in-house teams", and its second paragraph (which repeated the approach) is gone; "Consultancy" is "Consulting" on the LucentAlbedo page's way card.
- **The homepage's LucentAlbedo report** is labelled "Planned: How a report is designed to work in the online version", its tile reads "Being built to show…" with "See the planned design", and its final step reads "Next time, the same question would be asked the same way."
- **Each product page tells its own visual story,** so the homepage's two product stories are no longer repeated there: on the LucentSignal page the new story replaces the reused homepage sequence; on the LucentAlbedo page the report design stays, labelled as planned, after the consulting story.
- **Story pictures use fictional data,** with a note on each product page: Fernhill Studio, its competitors, the answers and sources on LucentAlbedo; the material, post and scores on LucentSignal (the product file's example).
- **Text never waits for a reveal:** cards and bands that carry text or actions now only rise a little as they come into view (`data-reveal="text"`) instead of fading in.
- **The word "most" removed:** About ("Often the best first step is a small one."), the Agencies example ("Much of the growth…"), the LucentSignal example post (idea "AI plans often skip the hard question: what should stop?" and hook "Plenty of AI plans list what to add. Few say what should stop."), and ten places in the two blog article designs ("many", "hardest", "clearest", "Our preferred approach", "Which Taplio alternative writes in my own voice?"). The live articles on blog.lucentstar.ai are unchanged and still use the word.

### Implemented in the review preview

- Homepage: `content/pages/home.yaml` (introduction, How we can help, How we work together, product tiles lead, About), the services chapters can take their own list label and several links, a new `variation` illustration (`templates/visuals/service.html`, shared with the services section), a compact five-step diagram (`wf-n5`), and per-product tile links.
- Product pages: a new `stories` section (`templates/sections/stories.html`), its pictures (`templates/visuals/stories.html`: `visibility` and `signal`), `styles/08b-stories.css` and the story behaviour in `scripts/03-sections.js` (`data-seq="story"`). Desktop with motion: the picture stays in view (sticky, never pinned) and changes state as each step is read, with a rail that fills. Reduced motion: each step beside its own still picture. Tablets: each step, then its picture. Phones: a compact picture of just that step's state.
- `ways` cards can take a white pill and a foot line; the LucentAlbedo report section can carry a status label; `{{<product>.status_lc}}` gives a status inside a sentence ("available now").
- Icons used only by the website's own pages are in `templates/partials/icons-extra.html` (`extra_icons: true` on a page), so the shared header's icons, and the shared export, don't change for them.
- The build stops on the word "most" in any page's text, title or description, or in content and templates (`SITE_WORDS` in `build.py`).
- The shared export's version changed only because the component reference shows the LucentSignal example post; the header, footer, styles, scripts and `nav.json` are unchanged.

### Tested (Chromium, 1 October 2026, on the final build)

- **Builds:** `python3 build.py --check` passes with eight pages. A production-mode copy (`url_mode: clean`) passes, with clean addresses (`/lucentalbedo#features`, `/lucentsignal.html`) and the sign-in, welcome and blog designs kept in `dist/designs/`. A fresh copy unpacked from the kit zip rebuilds the review pages byte for byte.
- **Deliberate mistakes:** 20 of 20 stop the build: Round 5's eighteen, plus the word "most" in page copy and a comma that splits a text value inside `{...}` in a content file. **Extension:** the disposable product, landing page, article, client and text-only example still need no template or build changes.
- **The word "most":** absent from every built page (all eight, the component reference and the shared export): visible text, alternative text, labels, titles, descriptions and structured data.
- **Scrolling:** no stuck scrolling and no long tasks on the homepage, LucentAlbedo and LucentSignal at 1440 by 900 and 1280 by 800 (the homepage is 15,158px tall at 1440, against 14,736px in FINAL6; LucentAlbedo 10,255px; LucentSignal 11,807px). The story pictures stay in view beside their steps and are never pinned.
- **Stories:** the sticky picture took states 1 to 5 in order as each step reached the middle of the screen. With Page Down, LucentAlbedo went through states 1, 2, 3, 4 and 5; LucentSignal through 1, 2, 3 and 5 (one Page Down covers more than one of its shorter steps). With reduced motion, each step sat beside its own complete picture with no movement; on phones each step showed its own compact picture.
- **Layout:** no sideways scrolling at 320px or 390px, with motion on or reduced, on all eight pages and the component reference. The products menu fits at 1100px and 1280px.
- **Keyboard and links:** at 1440, 390 and 320px every link in the changed sections had a visible focus outline and scrolled into view when focused. The pictures hold nothing focusable and are hidden from screen readers. The homepage's two "Talk about…" links and "Discuss a project" moved focus to the contact form with the right topic chosen; "See how we approach it" (LucentAlbedo) and "See how LucentSignal helps" open their pages; the LucentAlbedo opening's "See how we approach it" moved focus to the story, and the story's link to the form with "AI visibility" chosen. Every anchor checked landed just below the header: on the homepage `#help`, `#visibility`, `#workflows`, `#bespoke`, `#approach`, `#products`, `#signal`, `#albedo` and `#contact`; on LucentAlbedo `#evidence`, `#ways`, `#example`, `#features`, `#questions` and `#contact`; on LucentSignal `#workflow`, `#who`, `#fit`, `#how`, `#pricing`, `#faq` and `#start`.
- **Unchanged behaviour, rechecked:** the switcher (its name, arrow keys, deep links and photos); the Contact us panel's timings (homepage 4 to 187ms of the 220ms opening; LucentAlbedo 12 to 195ms; phone 8 to 191ms, closed at 229ms) and its Tab loop, which never reached the page behind; reduced motion opening it at once; the questions, products menu and mobile menu by keyboard; no console errors.

**Not tested:** screen readers, 200% zoom, Safari and Firefox, real devices and networks, real form delivery, and anything in the live app, its billing or the live blog.

### Production changes

None. lucentstar.ai, blog.lucentstar.ai and signalapp.lucentstar.ai are unchanged. The live blog articles still use the word "most" until their own text is changed.

### Found during Round 6

- **To confirm (LucentSignal and source material):** the page says LucentSignal helps you turn your expertise into LinkedIn drafts, and its story shows notes, a talk, a saved article and a past post feeding one idea. The product record confirms a one-sentence idea, trending topics, and writing examples and voice rules; whether material can be pasted or uploaded directly isn't confirmed.
- **To confirm (LucentSignal guidance):** "the reason behind every score" comes from the marketing page and isn't checked in the app.
- **LucentSignal planning:** the story says "plan when it goes out" without naming the calendar, because the marketing page lists the calendar on Creator and Pro and plan gating isn't checked. The plan and refinement allowance question is still open and untouched.
- **To confirm (LucentAlbedo consulting method):** agreeing the questions, the assistants and settings, and when to repeat checks; keeping every answer in full with its sources; saying what wasn't assessed; a short list of priorities tied to the evidence. Confirm it matches how the consulting is delivered today.
- **A content pitfall, now caught:** an unquoted comma inside `{...}` in a YAML file silently cut a text value short ("Ideas in chat, notes in the shared drive" became "Ideas in chat"). The build now stops on it.

## Round 5, final pass (29 September 2026): notes, switching, review wording, welcome screen and handover

### Owner decisions

- **Homepage notes removed.** "Example using fictional data and stock photos", "These examples use fictional data. They show the kind of work we can help with, not client projects." and "Example using fictional data. Scores are AI-generated editorial guidance, not a prediction of reach or engagement." are gone from the homepage, with no replacement disclaimers. LucentAlbedo's disclosure and limitations are unchanged. Photo credits, sources and licences stay in `content/examples.yaml`. The LucentSignal page keeps its own notes.
- **Human review wording.** The homepage's review step reads: "We agree what AI can handle and where a person needs to review, approve or take over. Routine answers can use your approved guidance; sensitive questions and important decisions stay with your team." It replaces "Anything that reaches a customer or makes a decision is checked by a person."
- **Switching on slow connections.** Keep the current image visible until the next is ready, with a graceful failure fallback, and never hold up scrolling.
- **Welcome screen.** Redesign LucentSignal's existing `/welcome` page, reached after a successful magic-link sign-in: the white design, the shared header and footer with "Open LucentSignal" instead of "Sign in", the correct wordmark, a brief "what happens next", one prominent "Create your first post" action available at once, and an idea, draft and review illustration with restrained motion. Desktop and mobile, with reduced motion. Keep the magic-link sign-in, the session handling and the existing destination; the signed-in app is out of scope.
- **App screens look like the app.** Any screen that shows LucentSignal uses the app's own dark blue interface, while the page background stays white.
- **Documentation.** #0B0F1A is confirmed, not proposed. The quote missing in Round 4 was a kit issue, not a live-blog issue. Explain the date-based export version accurately. Leave the pricing and allowance decisions explicitly flagged; don't change the commercial offer or claim live verification.
- **Kept:** every earlier decision not changed above.

### Proposed choices, awaiting approval

- **Welcome copy:** the "You’re signed in" label, the introduction, "What happens next" with its three steps, and the help line. The screen grab uses the site's example post and scores.
- **Signed-in footer:** "Sign in to LucentSignal" becomes "Open LucentSignal", and "Try LucentSignal" is left out, extending the header instruction to the footer. The header keeps "Let’s talk".
- **A quiet cue on a slow switch:** after a quarter of a second, the chosen button's label pulses gently (not with reduced motion). The switch goes ahead after six seconds, and late photos fade in.

### Implemented in the review preview

- Notes: the hero `note` and the services `foot` are gone (the services template now treats its note as optional), and `notes: false` on the homepage's product stories hides each story's note (`sc.note`) but never a product's disclosure and limitations (`sc.limits`).
- The review wording is in `content/pages/home.yaml`; the component reference's sample text follows it.
- Switching (`scripts/05-examples.js`): the pressed button moves at once; the screens and caption wait until the next example's visible photos are loaded and decoded, then crossfade. A failed photo leaves its tinted panel (`.en-pic.is-failed`). After six seconds the switch goes ahead and late photos fade in (`is-waiting`). The newest choice wins. `aria-busy` is set while waiting. A link that opens an example when the page loads shows it at once.
- Welcome screen: `content/pages/signal-welcome.yaml`, `templates/pages/signal-welcome.html`, `templates/visuals/signal-flow.html` (the screen grab, reusable) and `styles/17c-welcome.css`. The header and footer have a signed-in variant (`signed_in: true`), and the product record has `destinations.open` and `open_label`. The shared export adds `header-app-signed-in.html`, `footer-signed-in.html` and `lucentstar-welcome.css`, nav.json gains each product's `open` link, and the component reference shows the welcome components.
- Docs: README, the design and motion guide (version 1.5), `docs/SHARED-DESIGN.md` (the welcome screen, the version explained, the quote corrected), the site plan (version 5), this record and the new `docs/CODEX-HANDOVER.md`.

### Tested (Chromium, 29 September 2026, on the final build)

- **Builds:** `python3 build.py --check` passes with eight pages. Every page except the welcome screen is identical to the tested notes build apart from the added styles. A production-mode copy passes, with the sign-in and welcome designs in `dist/designs/app/`, away from lucentstar.ai. A fresh copy unpacked from the kit zip rebuilds the review pages and the shared export byte for byte.
- **Deliberate mistakes:** 18 of 18 still stop the build. **Extension:** the disposable product, landing page, article, client and text-only example still need no template or build changes.
- **Notes and spacing:** the three notes are absent from the homepage; LucentAlbedo's disclosure appears on the homepage and on its own page; the LucentSignal page keeps its notes. The services section now ends 144px after its last content on desktop and 80px on phones, the same as the next section, and the opening's caption and the LucentSignal story end without a gap.
- **Switching,** with photos delayed or failed by the test's network:
  - photos 2.5 seconds slow: the pressed button moved at once, the current example stayed, the cue appeared at 0.25 seconds, and the switch came at 1.84 seconds with both photos decoded;
  - failed photos: it switched at once to the tinted panels, with no broken image;
  - photos 9 seconds slow: it switched at 6.1 seconds, and the photos faded in when they arrived;
  - Agencies then Holiday lets in quick succession: only Holiday lets was shown;
  - the page scrolled 960px in 0.78 seconds while a switch waited;
  - the right arrow key moved focus and the pressed state at once; reduced motion switched as soon as the photos were ready;
  - at 390px only the phone's photo was waited for, and no laptop-sized photo was fetched;
  - a `#for-dmc` link showed Travel DMCs at once; a first photo that failed on load left its tinted panel;
  - no long tasks after the click, apart from one of 51ms.
- **Welcome screen:** "Create your first post" was in view, fully opaque and not animated in the first frame at 1440, 1024, 390 and 320px. The header offers "Open LucentSignal", and the page has no "Sign in" link. The title's wordmark measured #0B0F1A and #00E676. The screen grab is hidden from screen readers and holds nothing focusable. Tab goes skip link, brand, navigation, Open LucentSignal, Let’s talk, then the action (on phones: skip link, brand, Menu, action). Twelve animations run with motion and none with reduced motion. No sideways scrolling at 320px or 390px in either mode. Title "Welcome | LucentSignal", noindex. No em dashes, and no allowance, trial or credit wording.
- **Rechecked on the final build:** the switcher's name and deep links; the Contact us panel's timings (homepage 6 to 190ms of the 220ms opening; phone 6 to 173ms, closed at 213ms) and its Tab loop, which never reached the page behind; no sideways scrolling on all eight pages and the component reference; no stuck scrolling or long tasks on the homepage.

**Not tested:** screen readers, 200% zoom, Safari and Firefox, real slow networks and devices (the delays were simulated), real form delivery, and anything in the live app: the sign-in and welcome restyles there aren't built.

### Production changes

None. lucentstar.ai, blog.lucentstar.ai and signalapp.lucentstar.ai are unchanged; the app, its authentication and its welcome page weren't touched.

### Found during the final pass

- The live `/welcome` page can only be seen after signing in (it sends other visitors to sign-in), so its current destination and the differences between its desktop and mobile presentations have to be confirmed in the app code when the restyle is built.
- The pricing and allowance conflict is unchanged and still flagged: fixed post counts on the site, a monthly budget with fractional refinements in the app, and £19 and £39 not checked in Stripe.

## Round 5 (28 September 2026, evening): review corrections and homepage imagery

### Owner decisions

- **Brand blue.** The brand blue is #0B0F1A. On light backgrounds, Lucent is #0B0F1A, Signal stays #00E676 and Albedo stays #7759B3. On dark backgrounds, Lucent is white. The Round 4 proposal #2451E6 is rejected.
- **Sign-in.** The owner likes the new sign-in design and wants it applied to the existing sign-in page. That means restyling the existing `/login` route in linkedin-generator and keeping its authentication contract, not replacing real sign-in with the static preview. The confirmed scope is sign-in only.
- **Homepage imagery.** The example switcher gets relevant photos for travel, holiday lets, agencies and the marketing example, while still showing an application. Its label becomes "Industries we’ve worked with". This describes the team's wider industry experience. It isn't a claim that the fictional demonstrations are delivered client projects.
- **Kept:** every Round 4 decision apart from the rejected blue.

### Proposed choices, awaiting approval

- **Switcher copy and labels.** The supporting line "Our team brings experience from these industries. Here’s how we could apply AI to their everyday work." (proposed in the brief). "Marketing teams" becomes "Marketing", so the labels read as industries, without adding sectors.
- **The photos.** Four representative stock photos under the Unsplash License: a kitchen with a reclaimed wood island for the joinery story, the Old Man of Storr on Skye for the Highlands itinerary, a cottage on a Kent headland for the holiday let, and a walker's boots in a stream for the agency's outdoor client. The opening's note reads "Example using fictional data and stock photos". None of the photos shows a LucentStar client, project or property.
- **Photo layout.** On the laptop, the photo fills the top of the main pane with the task's title on a white label, and the working panel sits over its lower edge: the request, the draft, the material it came from and the review step. The note that a person checks the work moves to the foot of the list. On the phone, the photo is a cropped header with the app's bar on white over its lower edge.
- **Sign-in messages.** Three variants (error, success, neutral) for the app's own messages, with example wording in the preview only.
- **Recovery wording.** "Forgotten your password?" with "We’ll email you a link to reset it.", because `/forgot-password` resets the password. Whether to also offer passwordless access (`/recover`) is a separate owner decision.
- **Agencies card on the LucentSignal page.** "Start from the notes, articles and brand material a client supplies, and turn them into drafts your team can review and edit before anything goes out." The multi-client claim is removed.
- **Privacy Notice.** The footer label changes from "Privacy policy" to "Privacy Notice", to match the forms (the reviewer's recommendation). The page's own heading changes when that page is updated.
- **Kept from the review's recommendations:** the four-point star; the white header bars on the LucentAlbedo screens; "Let’s talk" in the blog header, with Try LucentSignal in product and article actions. These are recommendations, not owner approval of each use.
- **The second review article** (Taplio alternatives) adds a hero photo, a photo with a caption and a quote from our own safe LinkedIn tools article. They exercise the blocks the live blog supports, and aren't in the live article.

### Implemented in the review preview

- `--wm-lucent` is #0B0F1A (the navy) in the shared tokens, the wordmark styles, the component reference and every document.
- Example photos: an optional `image` on each example in `content/examples.yaml` (sizes, dimensions, tint, alt text, focal points, label, credit, source and licence). One photo treatment for the laptop and the phone in `templates/examples/app.html`. The chosen example's photo loads first; the others are lazy and low priority, and are fetched when a switcher button is pointed at or focused, and once the page has loaded. Where the laptop is hidden (760px and narrower), its photos are swapped for an empty image and never downloaded. Space is reserved by fixed heights, width and height, and a tint. Text-only examples still work. The build checks every photo record and size.
- The switcher is labelled by its visible heading (`aria-labelledby`) and described by the supporting line. The phone never catches a click meant for the switcher, and the caption stays clear of the phone at tablet widths (at 1024px the phone used to cover the "Holiday lets" button).
- Sign-in: one message box above the fields with error, success and neutral variants. Errors are an alert and take focus when the page loads (`data-focus-on-load`, handled by the shared script); the other two are status messages read with the first field (`aria-describedby`). A review-only control shows each state.
- The article template covers the live blog's block vocabulary: callout, quote, checklist, comparison cards, images (wide or inline), video, a hero image and social image metadata, plus the existing blocks. An unknown block, an image without alt text or dimensions, a missing image size and a video from an unexpected host all stop the build. The comparison cards produce ItemList data.
- The Taplio alternatives article is built as the second review article from the live text: eight comparison cards, the table, the decision guide, questions and call to action. LucentSignal's facts in it come from the product record, and its card says "No direct publishing to LinkedIn".
- Product facts have two new statuses: `source` (matches the app's source, as read by the Round 4 review, with file and line) and `conflict` (the source contradicts the claim). The build prints the counts and rejects unknown statuses.
- `docs/SHARED-DESIGN.md`: the app adapter covers the sign-in screen only and keeps each route's own form contract; the blog adapter restyles the live renderer, block by block, instead of replacing it.

### Tested (Chromium, 28 September 2026, on the final Round 5 build)

- **Builds:** `python3 build.py --check` passes (seven pages, 22 photos and sizes copied). A production-mode copy passes too, with the blog and sign-in designs kept apart: lucentstar.ai gets only the homepage's photos, and the article's photos are copied with the blog designs (a Round 5 fix; before it, every photo went to the main site). A fresh copy unpacked from the kit zip rebuilds the review pages byte for byte.
- **Deliberate mistakes:** 18 of 18 stop the build: Round 4's twelve, plus an article block the template doesn't show, an article image without alt text, a video from another host, a missing photo size, a photo without a licence and a fact with an unknown status.
- **Extension:** a disposable copy added a third product, a landing page using the homepage opening with one example (Agencies, with its photo) and no switcher, an article using a callout, an inline image, a video, a checklist, a quote and a comparison card, an approved client with a logo, and a fifth example with no photo, which showed as text only. No template or build changes.
- **Wordmarks:** Lucent measured #0B0F1A on white, Cloud and lavender, and white on navy; Signal #00E676 and Albedo #7759B3 everywhere.
- **Switcher:** the group is named "Industries we’ve worked with" by its visible label and described by the supporting line; the buttons read Marketing (selected), Agencies, Travel DMCs and Holiday lets. The right arrow key moved to Agencies and selected it, with the pressed states and caption following. `#for-dmc` opened Travel DMCs, on load and from a link on the same page. With reduced motion the change was instant.
- **Photos:** with the first photo slowed by 1.5 seconds, the other examples' photos only started after the page's load event (1.73 seconds at 1440px, 1.53 at 390px). At 390px only phone-sized photos were fetched, and no laptop photo. Every visible photo loaded with its width and height set, inside screens hidden from screen readers. At 900, 1024, 1280 and 1440px the switcher and caption stay clear of the phone, which no longer catches clicks. At 1440 by 900 the phone’s photo starts just below the fold; while scrolling, it was already painted as it came into view.
- **Second article:** eight comparison cards in an ordered list with level-3 headings; ours on Cloud with no border; the hero loads first and the inline photo lazily, both with alt text, caption and credit; the quote cites and links the safe tools article; Article (with its image), ItemList (8) and FAQPage (5) data; `og:image` and a large Twitter card pointing at a real file.
- **Sign-in:** the three error states are alerts and take focus; the success and neutral states are status messages tied to the email field; the reset link reads "Forgotten your password?" with "We’ll email you a link to reset it."; the title is "Sign in | LucentSignal".
- **Contact us panel:** on the homepage it moved between 4 and 182ms of the 220ms opening and closed at 194ms; on LucentAlbedo, 8 to 191ms and 187ms, with the purple launcher; on a phone, 11 to 194ms and 216ms, with the page locked. Focus went to the heading and back to the launcher. Tab and Shift+Tab never reached the page behind (homepage, LucentSignal, blog). Interruptions reversed, the backdrop closed it, and with reduced motion it was instant.
- **Forms:** the exact notice sits before the send button in every form, with no checkboxes; name, email and message are required; company and topic are optional; the footer says "Privacy Notice".
- **Questions and keyboard:** collapsed answers are absent from the accessibility tree; the skip link, products menu, mobile menu, style tabs and questions work by keyboard; both blog cards open their local articles.
- **Layout:** no sideways scrolling at 320px or 390px, with motion on or reduced, on all seven pages and the component reference. The products menu fits at 1100px and 1280px. Every page title is Poppins 700 at 80px (1440px wide). No console errors.
- **Scrolling:** no stuck scrolling on the homepage, LucentSignal and LucentAlbedo pages at 1440 by 900 and 1280 by 800, and no long tasks while scrolling.

**Not tested:** screen readers, 200% browser zoom, Safari and Firefox, real form delivery, photo loading on a real slow network (it was simulated), anything in the live app or its billing, and the sign-in restyle in the app, which isn't built.

### Live state

Nothing on lucentstar.ai, blog.lucentstar.ai or signalapp.lucentstar.ai has been changed, published or connected. The linkedin-generator repository wasn't touched: the sign-in restyle there is the next step, and needs its own change and release. The live sites were only read. The Round 3 and Round 4 review sets are kept for comparison.

### Found during Round 5

- The LucentSignal plans: the app's constants match the counts (Free 3, trial 5, Creator 20, Pro 75), but the quota counts use within the calendar month, Free included, and a refinement uses 0.34 of the same budget. The site describes fixed post counts and a Free allowance that doesn't renew, and the Taplio article says "no credit system". Reconcile with the intended offer and the deployed revision before publishing; the £19 and £39 charges still need checking in Stripe.
- The multi-client claim ("Manage multiple clients from one dashboard") on the live LucentSignal page is contradicted by the app keeping one voice profile per account.
- The live sign-in link ("Request a secure access link") and the live `/forgot-password` page ("No password needed") describe passwordless access, but that route resets the password.
- Correction to Round 4: the /v2/ pages aren't duplicate copies. Each of the 13 is a small redirect page (meta refresh and canonical) to the current page. `/company-homepage-draft.html` is still a reachable draft.

## Round 4 (28 September 2026)

### Owner decisions

- **Product wordmarks.** On white or light backgrounds, LucentSignal shows Lucent in blue and Signal in the existing green (#00E676), and LucentAlbedo shows Lucent in blue and Albedo in the existing purple (#7759B3). On dark backgrounds, Lucent is white and the product half keeps its colour. One reusable component with explicit light and dark variants, keeping the full product name accessible. Ordinary mentions in sentences stay plain text.
- **Separators.** The homepage's dash-like visual separators are replaced with an icon, with a restrained four-point star as the treatment for review.
- **Enquiry forms.** Both forms stay enquiry-only. No marketing subscription, no required consent checkbox, no required privacy-acceptance checkbox, and sending never subscribes anyone. The owner's notice sits near both send buttons with "Privacy Notice" linked. Company and topic stay optional. The simulated-delivery disclosure stays until delivery is connected and tested. Messages are meant for hello@lucentstar.ai.
- **Marketing later** needs a separate decision, an optional opt-in, consent records and unsubscribe handling. Not part of this revision.
- **Publishing:** LucentSignal doesn't publish directly to LinkedIn. The answer is "No", not "Not yet".
- **Readers' questions** such as "my account" may stay in the reader's own words.
- **Kept from Round 3:** the title style and scale in Poppins 700; #00E676 for heading emphasis with its recorded contrast limitation; purple controls on the LucentAlbedo page; white homepage product pills; underlined text links; colour-based navigation emphasis; the marketing-first homepage; the business-focused About; DMC meaning destination management company; discreet fictional-data notes; hidden clients; collapsed answers hidden from assistive technology; the build refusing a live form without an endpoint; the visible panel slide, Escape, focus return and reduced-motion behaviour; no motion switch.

### Proposed choices, awaiting approval

- **Lucent blue #2451E6.** Rejected in Round 5: the owner confirmed the brand blue is #0B0F1A. No established brand blue was found: the live site's stylesheet, the LucentSignal brand system (`docs/BRAND_SYSTEM.md` in the website repository, May 2026) and the LucentSignal email template all use navy and green only, and the email template puts Lucent in navy on light backgrounds. The proposal is 6.2:1 on white, 5.7:1 on Cloud and 5.5:1 on lavender. It is labelled as proposed in the tokens, the guide and the component reference.
- **The star.** A four-point star with straight edges like the LucentStar mark, navy, 12px, with a 13px gap. It replaces the short bars before each service example (nine on the homepage) and the dashed line above the prototype notes. The middle dots in step labels, example screens and the footer separate words rather than look like dashes, so they are unchanged; they could become stars too.
- **LucentAlbedo screens** have white header bars with a hairline instead of deep purple, so the light wordmark reads clearly (Albedo purple on the deep purple bar would be 2.9:1).
- **Where the wordmark is not used:** footer link lists, form options, button labels and sentences.
- **Products without their own colour** show the product half in navy (grey on dark) with a neutral dot.
- **Homepage products heading:** "Products built for specific jobs", with "Each one" instead of "Both", so it stays right when a product is added.
- **LucentSignal page:** the live page's title, description and search engine data are kept. The questions return to the live page's wording in the reader's voice ("Can I just use ChatGPT?", "Can I export my posts?"). The review chapter now says what the marketing page supports: each score comes with its reason and specific feedback. Round 3's "use, change or ignore each suggestion" and the one-click "Use suggestion" button in the screens are withdrawn until the app is checked.
- **Voice feature name:** "Ghostwriter" throughout, including the example screen (which said "Your voice profile"), set in one place until the app's label is confirmed.
- **Blog header action:** the shared "Let's talk" (recommended in the Round 4 review), with Try LucentSignal in the index band and article actions.
- **Privacy page name:** the forms say "Privacy Notice" (owner's wording); the page and footer say "Privacy Policy". To settle during the privacy review.
- **Draft pages** at /company-homepage-draft.html and /v2/: remove or redirect at launch.

### Implemented in the review preview

- One wordmark component (`wordmark()` in `build.py`, `.wm` styles in the shared CSS) used in the header products menu and mobile menu, product tiles, product labels, the LucentSignal app screens (dark), the LucentAlbedo screens (light) and the sign-in title. Copy can place it with `{{wordmark:signal}}`.
- The star as `star-list`, `star-rule` and `ui.star()`, decorative only.
- The enquiry notice above both send buttons, its link opening the privacy page in a new tab with a screen reader hint. No checkboxes.
- `docs/FORMS-AND-PRIVACY.md`: the decisions, what the current Privacy Policy says, and ten steps to finish before the forms send anything.
- Reusability fixes from the independent review:
  - local article links are automatic: any page built here opens its local design in review builds, and the build checks and prints every blog card's destination;
  - product facts are typed once and quoted with placeholders in page copy, FAQs, introductions, descriptions and search engine data; the build stops on a hand-typed fact or an unknown placeholder;
  - the products heading no longer counts products;
  - the shared export's `VERSION` is the date plus a content hash, stamped in every exported file;
  - the footer and `nav.json` are made from one footer model, and the build checks them against each other (and the products menu);
  - a component reference, `dist/shared/reference.html`, built only from the shared export.
- Also fixed: availability labels, the product label chip and responsive rules for sections, questions and forms were missing from the shared export; a capitalised "My" slipped past the first-person check; YAML mistakes now stop the build with the file and line; the example screens are checked against the product's style and scoring names.
- Search engine data: canonical links on site and blog pages; Organization, SoftwareApplication and FAQPage on the LucentSignal page, and Article and FAQPage on the article, made from their content; social tags on blog pages.
- Product facts record where each fact came from (`verification:` in the product file), and the build prints the count.

### Tested (Chromium, 28 September 2026, on the final Round 4 build)

- **Builds:** `python3 build.py --check` passes. A production-mode copy (`url_mode: clean`) also passes, with the blog and sign-in designs kept apart in `dist/designs/`. A fresh copy unpacked from the kit zip rebuilds the six review pages and the shared export byte for byte.
- **Deliberate mistakes:** each of these stops the build: a hand-typed allowance, a hand-typed price, an unknown fact, a wordmark for an unknown product, a live form without an endpoint, a template linking a built article by its public address, `nav.json` missing a footer link, an example screen selecting a style that doesn't exist, an example screen scoring other dimensions, an em dash, "My" in our own copy, and a missing image (12 of 12).
- **Extension:** a disposable copy added a third product (neutral colour, generic showcase), a landing page, an article with a body, and an approved client with a logo, with no template changes. The product appeared in the tiles, both menus, the footer, the contact topics and `nav.json` with its wordmark; the new article's card opened its local design; the client section and its navigation item appeared and the logo was copied.
- **Version:** building the same content twice gave the same version; changing one shared style value gave a new hash; changing it back restored the first version.
- **Wordmarks:** Lucent measured #2451E6 on white, Cloud and lavender and white on navy; Signal #00E676 and Albedo #7759B3 in every context. Screen readers get "LucentSignal", "LucentAlbedo" and "Sign in to LucentSignal." as whole names.
- **Star:** list items are read without any marker; the marker is 12px navy; the dashed line is gone. No dash-like bars remain on the homepage apart from the plus and minus signs on questions.
- **Forms:** the exact notice appears above the send button in every enquiry form (both forms on the homepage and LucentAlbedo, the panel on the LucentSignal page and the blog designs), linking to https://lucentstar.ai/privacy in a new tab. No checkboxes; name, email and message required; company and topic optional; the simulated notice shown.
- **Contact us panel:** on the homepage it moved from 0 to 176ms of a 220ms opening, and on closing the dialog closed at 207ms, after the 180ms exit; on LucentAlbedo, 2 to 200ms and 185ms, with the purple launcher. On a phone it moved between 13 and 179ms of a 250ms opening, locked the page and scrolled inside itself, and closed at 226ms. Focus went to the heading and back to the launcher. With the panel open, Tab and Shift+Tab never reached the page behind it (homepage, LucentSignal page and blog index). Interrupted opening and closing reversed, and a click on the backdrop closed it. With reduced motion it opened and closed instantly.
- **Keyboard:** the skip link, the products menu (Enter, Tab into it, Escape back to its button), the mobile menu, the style tabs (arrow keys and End) and the questions (Enter) all work. Every LucentSignal anchor exists.
- **Questions:** collapsed answers are absent from the accessibility tree on the homepage and the LucentSignal page, and read once opened.
- **Layout:** no sideways scrolling at 320px or 390px, with motion on or reduced, on all six pages and the component reference. The products menu fits at 1100px and 1280px. Page-by-page screenshots at 1440px and 390px were reviewed. No console errors.
- **Scrolling:** no stuck scrolling on the homepage, LucentSignal and LucentAlbedo pages at 1440 by 900 and 1280 by 800, and no long tasks.
- **Titles:** every page title is Poppins 700 at 80px (1440px wide), with Round 3's colours.

**Not tested:** screen readers, 200% browser zoom, Safari and Firefox, real form delivery, and any product fact in the live app or its billing (no access from this session).

### Live state

Nothing on lucentstar.ai, blog.lucentstar.ai or signalapp.lucentstar.ai has been changed, published or connected. The live sites were only read. The Round 3 review set and its artifact version are kept for comparison.

### Found during Round 4

- The privacy policy and subprocessors page point to lucentstar.ai/legal/subprocessors, which returns "page not found".
- The current Privacy Policy doesn't name a lawful basis for website enquiries, and its processor list has no form service or mailbox provider.
- /company-homepage-draft.html and a /v2/ copy of 13 pages are publicly reachable outside the sitemap.
- The LucentSignal facts differ between the marketing page, the help pages, the AI transparency page, the privacy policy and the May 2026 brand system (see the site plan).
- Round 3's record called the LucentSignal facts "verified". They were copied from the live marketing page and have not been checked in the app or its billing.

## Earlier rounds

- **Round 3:** consistent Poppins 700 page titles; #00E676 heading emphasis restored as an owner decision; the Albedo purple theme on the LucentAlbedo page; white homepage product pills; a smooth, fast panel slide; underlined text links; one "Example using fictional data" note; the fuller LucentSignal page; blog, article and sign-in designs; the shared export.
- **Round 2:** agency-led positioning for businesses and in-house teams; the marketing example first; About introduces the business; LucentSignal available now; LucentAlbedo coming soon; both forms, marked as simulated; Blog in the navigation; a bolder homepage title.
- **Round 1:** shorter pinned sequences with no dead scrolling; the motion switch removed; audience examples; the Contact us panel; an optional clients section; the content, template and motion structure with copy checks.
