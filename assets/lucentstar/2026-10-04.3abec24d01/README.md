<!-- LucentStar shared design, version 2026-10-04.3abec24d01. Copied from docs/SHARED-DESIGN.md by build.py. -->
# Sharing the design with the blog and the app

Three LucentStar sites use one header, footer and visual language. This kit is the single source for all three: `content/site.yaml` for navigation and the footer, `content/products/` for products, and `styles/` and `templates/` for the look. The blog and the app take a generated copy of the shared files, adapted to how each of them is built.

**Status, 28 September 2026:** the export is generated and tested in this kit. Neither the blog nor the app uses it yet. Both need the adapters and separate releases described below, so a new export on its own changes nothing on blog.lucentstar.ai or signalapp.lucentstar.ai.

| Site | What it is | Built by | Published by |
| --- | --- | --- | --- |
| lucentstar.ai | The main website | This kit (`build.py`) | GitHub Pages (apex domain, no nameserver changes) |
| blog.lucentstar.ai | The LucentStar Blog | The Blog & Content Engine in the linkedin-generator repository | That repository's own deployment |
| signalapp.lucentstar.ai | The LucentSignal app | The linkedin-generator repository (Node.js and Express, vanilla JavaScript front end) | That repository's own deployment |

## What the kit exports

Every build writes `dist/shared/`. Nothing in it is edited by hand.

| File | What it is | Used by |
| --- | --- | --- |
| `lucentstar-shell.css` | Tokens, type, buttons and links, product wordmarks, availability labels, the star, header, footer, questions, forms, the Contact us panel and reduced motion | Blog and app |
| `lucentstar-blog.css` | Blog index and article components | Blog |
| `lucentstar-auth.css` | Sign-in screens | App |
| `lucentstar-welcome.css` | The welcome screen: its layout, the idea, draft and review illustration, and the next steps | App |
| `lucentstar-mode.js` | A few lines for the `<head>`: follow the device's reduced-motion setting | Blog and app |
| `lucentstar-shell.js` | Header behaviour (products menu, mobile menu, section highlighting), expandable questions, tabs and the copy button | Blog and app |
| `lucentstar-enquiry.js` | The enquiry form and the Contact us panel. Load it after `lucentstar-shell.js` | Blog (optional) |
| `header-blog.html` | The header with Blog marked as the current item, including the icon set | Blog |
| `header-app.html` | The header with Sign in marked as the current item. Links into the app stay in the same tab | App |
| `header-app-signed-in.html` | The header for people who are already signed in (the welcome screen): "Open LucentSignal" instead of "Sign in", in the same tab | App |
| `header.html` | The header with no current item | Any other page |
| `footer.html` | The footer, without the review note | Blog and app |
| `footer-signed-in.html` | The footer for signed-in screens: "Open LucentSignal" instead of "Sign in to LucentSignal", and no "Try LucentSignal" | App |
| `enquiry-panel.html` | The Contact us launcher and panel | Blog (optional) |
| `nav.json` | The same navigation as data (see below). The build checks it against `footer.html` and the header's products menu | Code that builds its own menus |
| `reference.html` | The component reference: wordmarks, headings, buttons, links, the star and the Contact us panel, built only from these files. Not for publishing (noindex) | Anyone checking a page against the shared system |
| `README.md` | This guide | Both |
| `VERSION` | Two parts, for example `2026-09-28.d157954484`: the date the build ran (from the build machine's clock), then the first ten characters of a SHA-256 hash of every exported file. The hash depends only on the content: the same export gives the same hash on any day, and any change gives a new one. The date only records when the build ran, so rebuilding unchanged content on a later day gives a new date with the same hash. To tell whether two exports differ, compare the hash | Both, to see which version is live |

Every address in the export is absolute (`https://lucentstar.ai/...`), so the header and footer work on any subdomain. Links between lucentstar.ai and the blog stay in the same tab; links into the LucentSignal app open in a new tab, except in `header-app.html`. Every exported file starts with its version.

### nav.json

| Key | What it holds |
| --- | --- |
| `version` | The same value as `VERSION` |
| `brand` | Name, home address and tagline |
| `nav` | The main navigation in order. Each link has `label`, `href`, `new_tab` and `current_key`; the products menu's place is an item with `type: products` |
| `products` | For each product: `id`, `name`, `wordmark` (`lead`, `tail`, `accent`), `status` (only once confirmed), `menu_text`, `mobile_text`, `page` (the menu link), and `try` and `sign_in` where they exist |
| `products_menu` | The menu's help link |
| `actions` | Sign in and the Let's talk button |
| `footer` | The footer columns in order, each link with `label`, `href`, `new_tab` and `kind` (`product`, `try`, `sign_in` or `link`). These are exactly the links in `footer.html` |
| `footer_base` | Legal name, registration and LinkedIn |

`new_tab` is right for the blog. Inside the app, links to signalapp.lucentstar.ai stay in the same tab, as `header-app.html` does.

## How the blog uses it

The Blog & Content Engine generates each page, so it includes the shared files at build time rather than loading them from lucentstar.ai while a visitor waits.

1. Copy `dist/shared/` into the repository at a folder named after `VERSION`, for example `blog/shared/2026-09-28.d157954484/`. If the hash part matches the version already in use, the files are identical and there's nothing to copy, even when the date differs.
2. In the blog's page template:
   - In `<head>`: the Poppins font (400 to 700), `lucentstar-shell.css`, `lucentstar-blog.css` and `lucentstar-mode.js`.
   - After `<body>`: the contents of `header-blog.html`.
   - Before `</body>`: `footer.html`, then `lucentstar-shell.js`. Add `enquiry-panel.html` and `lucentstar-enquiry.js` only if the blog should have the Contact us panel.
3. **Restyle the blog's own renderer; don't replace it.** The live blog builds its pages with `lib/blog-render.js` and `blog-server.js` in the linkedin-generator repository (read by the Round 4 review). Keep that renderer, with its sanitising, and change the markup and classes each block produces to the kit's, following the table below. The class names in `templates/pages/blog-index.html` and `templates/pages/article.html` are the contract; the generator can use any templating language.
4. **Every block the live renderer supports has a kit component.** A block without a mapping must stop the blog's build with an error. It must never be dropped silently. (In Round 4 it was this kit's own article template that dropped a quote block without saying so, not the live blog, whose renderer shows quotes. The kit's build now stops on any block its template can't show.)

   | Live renderer (class it writes today) | Kit block | Kit markup |
   | --- | --- | --- |
   | Paragraph (`blog-p`) | `p` | `<p>` in `.art-body` |
   | Headings (`blog-h2`, `blog-h3`) | `h2`, `h3` | `<h2 id>`, `<h3>`. The live headings' coloured word (`green`) is dropped: colour emphasis is only for display titles |
   | Callout labelled "Quick answer" (`blog-callout`) | `quick_answer` | `.art-quick` |
   | Any other callout (`blog-callout`, `blog-callout-label`) | `callout` | `.art-callout`, `.art-callout-k` |
   | Quote (`blog-quote`) | `quote` | `<figure class="art-quote"><blockquote cite>` and a `<figcaption>` for the source |
   | Lists (`blog-list`) | `ul`, `ol` | `.art-ul`, `.art-ol` |
   | Checklist (`blog-checklist`) | `checklist` | `.art-check`, with a numbered list or the star list |
   | Table and its note (`blog-table-wrap`, `blog-table`, `blog-table-note`, `blog-risk-*`) | `table` | `.art-table`: a caption for screen readers, a keyboard-scrollable region, one labelled card per row on phones, risk as a filled label |
   | Tool comparison cards (`blog-tool-card`, `--highlight`, `blog-tool-rank`, `blog-tool-bestfor`, `blog-tool-disclosure`, `blog-pros-cons`, `blog-pricing-line`) | `tools` | `<ol class="art-tools">` of `.art-tool`. Our own product is marked by its disclosure and a Cloud fill (`is-ours`), never a coloured border. Pros and cons use tick and cross icons, not dashes |
   | Images (`blog-image`, `blog-image--inline`, `article-inline-image`) | `image` (`size: wide` or `inline`) | `<figure class="art-fig">` with `width`, `height`, `srcset`, alt text (or `alt=""` when decorative), caption and credit |
   | Embedded video (`blog-video`) | `video` | `.art-video`: a 16:9 frame, `loading="lazy"` and a `title` on the `<iframe>`, embedded only from YouTube (preferably youtube-nocookie.com) or Vimeo |
   | Hero image (`blog-hero`) | `hero` | `<figure class="art-hero">`, loaded first (`fetchpriority="high"`), with its credit |
   | Social image metadata (`blog-server.js`) | `social_image`, or the hero | `og:image`, `og:image:alt`, `twitter:card` (`summary_large_image` when there's an image) and `twitter:image` |
   | Questions (`blog-faq-item`) | `qa` | `.art-qa`, and FAQPage data |
   | Call to action (`blog-cta-band`, `blog-cta-btn`, `blog-cta-secondary`, `blog-cta-footnote`) | `cta` | `.art-cta`, with the shared buttons |
   | Related articles (`blog-related-heading`, `blog-card`) | `related` | `.art-related` with the index card |

   `content/blog/posts/taplio-alternatives.yaml` uses the comparison cards, a hero image, an image with a caption and a quote; `safe-linkedin-tools.yaml` uses the table, the numbered list and the questions. A disposable test article also exercises the video block.
5. Keep every article address exactly as it is. No redirects are needed.
6. Keep each article's canonical address and structured data: Article (with its image), FAQPage for questions, and ItemList for comparison cards, as the live articles have. Keep captions, alt text and credits on every image, and the sanitising the renderer already does.

## How the app uses it

The owner's confirmed scope (28 September 2026) is the existing sign-in screen at `/login`: restyle it with the approved design and keep everything it does. Registration and password recovery may get matching styling later, as separate changes. Each of them keeps its own form, fields and destination, and never takes the sign-in form's. On 29 September 2026 the owner added the welcome screen at `/welcome`, which people reach after a successful magic-link sign-in (see below).

1. Serve the export from a folder named after `VERSION`, for example `public/shared/2026-09-28.d157954484/`, with the rest of the app's static files.
2. On the sign-in screen (GET `/login`, around line 1387 of `server.js` in the version the Round 4 review read):
   - Insert `header-app.html` after `<body>` and `footer.html` before `</body>`, and remove the page's own top bar and footer.
   - Keep the sign-in form's contract exactly: `method="POST"`, `action="/login"`, the `email` field (email or username), the `password` field, any hidden fields, and the links to `/forgot-password` and `/register`.
   - Keep everything POST `/login` does (around line 1569): rate limiting, session handling, redirects and every message the server produces.
   - Add the shared classes: `form-card` on the card, `f` on the form, `f-label` and `f-input` on labels and fields, and `btn btn-primary` on the submit button. The layout is in `templates/pages/signal-login.html`.
   - Use `autocomplete="username"` on the email or username field and `autocomplete="current-password"` on the password field.
   - Use a page title without an em dash ("Sign in | LucentSignal"), and remove em dashes from the screen's messages.
   - Leave out the preview's review-only parts: `data-auth-preview` on the form, the "Preview a message" control and `scripts/08-previews.js`. None of them is in the export.
3. Render the server's own message, when there is one, in the message box above the fields. It has three variants:

   | Server state | Variant | Roles and focus |
   | --- | --- | --- |
   | Wrong email, username or password | `auth-msg-error`, icon `i-alert` | `role="alert"`, `tabindex="-1"` and `data-focus-on-load`: it takes focus when the page loads (`lucentstar-shell.js` does this) |
   | Account not active | `auth-msg-error` | The same |
   | Access or reset link expired, already used or invalid | `auth-msg-error` | The same |
   | Signed out, or the session changed | `auth-msg-neutral`, icon `i-info` | `role="status"`, no `tabindex`; the email field gets `aria-describedby="auth-msg"` |
   | Password reset successfully | `auth-msg-success`, icon `i-check` | The same as neutral |

   ```html
   <div class="auth-msg auth-msg-error" id="auth-msg" role="alert" tabindex="-1" data-focus-on-load>
     <span class="auth-msg-ic"><svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg></span>
     <div><h2>The server's heading</h2><p>The server's message</p></div>
   </div>
   ```

   A message that is one sentence goes in the `<h2>` alone. The preview's wording is an example; the app keeps its own.
4. **Recovery wording.** The existing `/forgot-password` route resets the password: it emails a `/reset-password` link (`server.js:3213`). So the link reads "Forgotten your password?", with "We'll email you a link to reset it." The live screens' wording ("Request a secure access link", "No password needed") describes passwordless access, which is a different route (`/recover`). Whether the sign-in screen should also offer passwordless access is a separate decision for the owner. Neither route's behaviour changes as part of the restyle.
5. Signed-in screens keep the app's own dark interface.
6. The sign-in title uses the LucentSignal wordmark: `<span class="wm wm-light wm-signal" translate="no"><span class="wm-lead">Lucent</span><span class="wm-tail">Signal</span></span>`, with no space between the spans, exactly as `build.py` writes it. Signed-in screens on the dark interface use `wm-dark`.
7. **Later, not part of the confirmed scope:** registration and recovery can use the same shell, classes and message box, but each keeps its own method, action, fields and messages. Registration keeps its own optional product-updates box.

### The welcome screen (`/welcome`)

People reach `/welcome` after a successful magic-link sign-in, so they are already signed in. The redesign covers this page only, not the signed-in application.

1. Keep everything the route does today: the magic-link check that leads here, session creation and checks, what happens to a visitor who isn't signed in, and the existing destination of the page's main action and of any link into the app. Only the page's markup and classes change. Nothing about authentication changes.
2. The route has separate desktop and mobile presentations today. The kit's design covers both in one responsive template (`templates/pages/signal-welcome.html`): at 1000px and wider, the introduction and the action sit beside the illustration; narrower, the action comes straight after the introduction, then a compact illustration, then the steps. Apply the template to both presentations, or map its two layouts onto the existing ones, and keep any server-side difference between them (a different destination on phones, for example) exactly as it is.
3. Use `header-app-signed-in.html` and `footer-signed-in.html`: "Open LucentSignal" replaces "Sign in" and stays in the same tab. Point it at the app entry the current page uses.
4. The one main action is "Create your first post", a link styled as a button (`a.btn.btn-primary.wl-cta`). Its address is the destination today's welcome page uses; the preview uses the app's root (`https://signalapp.lucentstar.ai/`) only as a stand-in. It is never animated or delayed.
5. The illustration (`templates/visuals/signal-flow.html`, styled in `lucentstar-welcome.css`) is a screen grab of the app in its own dark blue on the white page, and is decorative (`aria-hidden="true"`); the steps say the same in text. It plays once, in about two seconds, only when the device allows motion (`lucentstar-mode.js` in the `<head>` sets `html.motion`), and is shown complete otherwise.
6. Page title "Welcome | LucentSignal", with `<meta name="robots" content="noindex">`.
7. No plan, allowance or trial details, no testimonials and no personal details (name or email) on this page, unless the owner confirms them later.

## Adapters and releases still needed

The export is the source. These pieces don't exist yet, and each is its own change and release:

| Piece | Where | What it does | Status |
| --- | --- | --- | --- |
| Blog adapter | The Blog & Content Engine (linkedin-generator repository) | Restyles the blog's existing renderer: the shared header, footer, styles and scripts in its page template, every live block mapped to its kit component (an unmapped block stops the build), and each article's address, metadata and structured data kept | Not built |
| Blog consent banner | The blog | The same analytics consent handling as the main site (the live blog loads Google Analytics without a banner) | Not built |
| App adapter | The LucentSignal app (linkedin-generator repository) | Restyles the existing sign-in screen at `/login` with the shared header, footer, classes and message box, keeping its form contract, behaviour and every server message, and the welcome screen at `/welcome`, keeping the magic-link sign-in, the session handling and its destination (owner's confirmed scope). Registration and recovery are separate, later changes | Not built |
| Main site publishing | GitHub Pages for lucentstar.ai | Publishes the rebuilt pages, redirect pages and sitemap | Not done |

Until each is built, tested and released, the live blog and app keep their current design. The export being up to date doesn't show that they use it: check the version at the top of the live header or footer.

## Keeping the three sites in step

1. Make the change in this kit: `content/site.yaml` for navigation and footer, `styles/` for the look.
2. Run `python3 build.py --check`. It regenerates `dist/shared/`, checks that `nav.json` matches the footer and the products menu, and prints the `VERSION` (its hash changes only when the export's content changes).
3. Publish the main site.
4. In the linkedin-generator repository, add the new version folder, point the blog and app templates at it, and remove the old folder. Keep to that repository's conventions (one change per commit, and no push without the owner's instruction).
5. Check the blog index, one article and the sign-in screen on a desktop and a phone, and compare them with `reference.html`, then deploy.
6. Note the version in the decision record.

Never edit the exported files in the other repository. Change them here and export again.

## Which changes need separate publishing

| Change | lucentstar.ai | blog.lucentstar.ai | signalapp.lucentstar.ai |
| --- | --- | --- | --- |
| Page copy, a new page or product facts on the main site | Publish the main site | No | No |
| Navigation, footer, colours, type or buttons | Publish the main site | Copy the new export and deploy | Copy the new export and deploy |
| A new blog article | No | Publish through the pipeline | No |
| LucentSignal prices or plans | Publish the main site (product record) | Check articles that mention prices | Billing must already match |
| Sign-in, access link, welcome screen or registration behaviour | No | No | Deploy the app |
| Form delivery to hello@lucentstar.ai | Publish the main site | Deploy, if the blog has the panel | No |
| Redirects (/pricing, /ai-answer-visibility.html, /blog/...) | Redirect pages in the main site (GitHub Pages has no server redirects) | No | No |
