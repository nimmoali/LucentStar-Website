# LucentStar website source

The site is built from separate kinds of file, so copy, product facts, layout and motion can change independently.

| Folder | What it holds | Who edits it |
| --- | --- | --- |
| `content/` | Page copy (`pages/`), product facts (`products/`), blog articles (`blog/`), the opening examples and the optional clients list | Anyone |
| `templates/` | The shared shell (header, footer, contact panel), one file per section, page layouts and product screens | Designer or developer |
| `styles/` | Tokens and page themes (`01-tokens.css`) and component styles | Designer or developer |
| `scripts/` | The motion library and page behaviour | Developer |
| `assets/` | Local images, such as client logos and product screens | Anyone |
| `docs/` | The design and motion guide, the site plan, the decision record, the enquiry forms and privacy notes, how the blog and app share the design, and the Codex handover (`CODEX-HANDOVER.md`) | Anyone |

Build with Python 3 (`pip install jinja2 pyyaml`), then run `python3 build.py`. It empties `dist/` first, then writes:

- `dist/site/`: complete pages plus `assets/`, ready to open in a browser or host
- `dist/artifact/`: the same pages for the Claude artifact viewer
- `dist/shared/`: the header, footer, styles, scripts, navigation data and component reference (`reference.html`) for blog.lucentstar.ai and signalapp.lucentstar.ai, with a `VERSION` made of the date and a content hash (see `docs/SHARED-DESIGN.md`)
- `dist/designs/` (production builds only): the blog and sign-in designs, with the images they use, kept apart so they are never published on lucentstar.ai

Every build checks:

- **Copy:** no em dashes, no banned words, never the word "most" (owner decision, 1 October 2026), and no first-person singular in our own copy, including titles and descriptions. Readers' own questions may keep "I" and "my".
- **Product facts:** every `{{placeholder}}` exists, and no price, allowance, style list, scoring list or export list is typed into page copy by hand.
- **Example screens:** the selected style and the scores shown match the product's facts.
- **Markup:** ids, alt text and new-tab links, and no placeholder left in a page.
- **Links:** links between pages and sections point at something that exists.
- **Article links:** in review builds, every article built here opens its local design, never the live address. The build prints where each blog card leads.
- **Navigation data:** `nav.json` has exactly the links of the generated footer and products menu.
- **Images:** every local image exists and is copied into the built site.
- **Forms:** a live form must have a delivery address. With `simulated: false` and no `endpoint`, the build stops.
- **Content files:** a YAML mistake stops the build with the file and line, and so does a comma inside `{...}` that splits a text value in two (quote the whole text).

Run `python3 build.py --check` to stop on any problem.

## Rules

See `docs/DESIGN-AND-MOTION.md` for the full guide. In short:

- **Titles.** The main title of every page uses one style, `.h-title` (Poppins 700, 40 to 80px), inside the shared opening (`.opening`, `.intro`).
- **Colour.** The main website's accent is the brand green #00E676, including heading emphasis in titles. The owner chose it knowing it is below the WCAG AA text contrast minimum, so it is never used for body text, links or small labels. The Signal half of the LucentSignal wordmark is the one exception: it is a brand name, which WCAG treats as a logotype. The LucentAlbedo page uses the Albedo purple theme (`theme: albedo`).
- **Links.** Text links are underlined in the page accent. Pill buttons, navigation and heading emphasis are never underlined.
- **Borders.** Content boxes never have green or faded borders. Borders are crisp grey hairlines, or none.
- **Honest labels.** The homepage carries no fictional-data notes (owner decision, 29 September 2026): its opening examples are framed by the supporting line, "Here’s how we could apply AI to their everyday work". Don't add replacement disclaimers there. Inner pages keep their notes where they help (the LucentSignal page's example screens and scores), and LucentAlbedo's disclosure and limitations show wherever its story appears. Planned features are labelled "Planned", and a status label only appears once it has been confirmed.
- **Wordmarks.** Branded product names come from `wordmark()`: Lucent in the brand blue #0B0F1A on light backgrounds (confirmed by the owner) and white on dark, Signal green, Albedo purple. Sentences keep plain text.
- **Star.** The four-point star (`star-list`, `star-rule`, `ui.star()`) replaces dash-like marks. It is decorative and hidden from screen readers.
- **Reference.** `dist/shared/reference.html` shows the shared components; compare new pages with it.

## Pages and links

Each file in `content/pages/` is a page. `sections:` lists the components in order:

| Section | What it is |
| --- | --- |
| `hero` | The homepage opening, with the example switcher |
| `page_hero` | The opening for any other page: title, introduction, actions and a note |
| `services`, `workflow`, `about`, `clients`, `people` | Homepage stories |
| `products`, `showcases`, `showcase` | Product tiles and product stories (one product with `showcase`) |
| `stories` | A product page's visual story: steps beside a picture that changes state as each step is read |
| `features` | A card grid. Items with a status show it; items without one don't |
| `ways` | Two ways to work with us |
| `chapters` | Alternating text and product screens that explain how something works |
| `pricing` | Plans and prices from the product record |
| `faq` | Expandable questions |
| `contact` | The enquiry form |
| `cta_band` | A closing call to action |

`content/pages/lucentalbedo.yaml` and `content/pages/lucentsignal.yaml` are worked examples of inner pages.

Actions are written as a list, and the build turns each one into a button or link:

```yaml
actions:
  - {label: Try LucentSignal, href: "https://signalapp.lucentstar.ai/register", style: primary}  # filled pill
  - {label: Talk about AI visibility, href: "@contact", style: pill, topic: visibility}          # white pill
  - {label: See pricing, href: "#pricing", icon: down}                                           # underlined text link
```

Write links in content like this:

| Write | Means |
| --- | --- |
| `index#help` | A section on another page (here, the homepage) |
| `lucentalbedo` | Another page, by its file name |
| `#faq` | A section on the same page |
| `@contact` | This page's contact form if it has one, otherwise the homepage's |
| `https://...` | An external address. lucentstar.ai and the blog open in the same tab; the LucentSignal app and other sites open in a new tab |

`url_mode: files` in `content/site.yaml` writes `lucentalbedo.html`-style addresses for review. In review builds, any link to the public address of a page built here (the blog index, each article with a body, the sign-in design) opens the local design automatically, so there is nothing to list. Switch to `clean` for production, which uses each page's `url` and the live addresses.

## Product facts in copy

Facts that appear in several places are typed once, in the product file, and quoted everywhere else:

| Write | Gives (today) |
| --- | --- |
| `{{signal.plan.free.posts}}` | 3 (also `.name`, `.price`, `.period`, `.allowance`, for `free`, `creator` and `pro`) |
| `{{signal.styles}}` | Thoughtful, Focused and Challenging (`{{signal.styles_count}}` gives "three") |
| `{{signal.styles_described}}` | Each style with its one-line description |
| `{{signal.scoring.dimensions}}` | hook, insight, clarity and closing (`.count`, `.out_of`) |
| `{{signal.platforms}}` | Hootsuite, Agorapulse, Airtable, Notion and Google Calendar |
| `{{signal.voice_feature}}` | Ghostwriter |
| `{{signal.status_lc}}` | available now (the status, for use inside a sentence) |
| `{{signal.plans_note}}` | What every plan includes |
| `{{wordmark:signal}}` | The LucentSignal wordmark, inside a heading (`{{wordmark:signal:dark}}` on dark) |

Any value under a product's `facts:` can be quoted the same way. Put quotes around a YAML value that starts with a placeholder.

Each product file also has a `verification:` list saying where every fact came from and what still needs checking. Its status is one of: `verified` (checked in the live app or its billing), `source` (matches the app's source code, with file and line; evidence, not proof of the deployed version), `conflict` (the app's source contradicts the claim, so reconcile it before publishing), `owner`, `marketing` (copied from the marketing page) or `design`. The build prints a summary and stops on any other status.

## Adding a page

1. Copy `content/pages/lucentalbedo.yaml` and set `slug`, `url`, `title`, `description` and `nav_current`. Add `theme: albedo` only for LucentAlbedo pages.
2. List the sections you need and write the copy. `*text*` gives heading emphasis, `**text**` is bold and `[label](target)` is a link.
3. If the page needs a component that doesn't exist, add one file to `templates/sections/` and its styles to `styles/`, using the tokens. Don't restyle shared components for one page.
4. Run `python3 build.py --check`.
5. Check the page on desktop, on a phone at 390px and 320px, with reduced motion on, and with the keyboard only.
6. Add the address to the site plan and the sitemap when it goes live.

A page file whose name starts with `_` is ignored, which is useful for drafts.

## Adding a product

1. Copy `content/products/lucentalbedo.yaml` to a new file and change every field. Facts that appear on several pages (status, prices, plans, features, links) belong here, never in page copy. Quote them with placeholders (see above).
2. Set `availability.verified: true` only once the status has been confirmed. Planned features are always labelled "Planned".
3. Choose a showcase: `signal`, `albedo`, or `generic` (a screen and up to four steps, no new code needed).
4. The product then appears in the header menu, the mobile menu, the product tiles, the footer, the contact topics and `nav.json`, with its wordmark. `accent: signal` or `albedo` colours the product half; any other value shows it in navy (white on dark) with a neutral dot until the product is given its own colour. The wordmark splits "Lucent" from the rest of the name; set `wordmark: {lead, tail}` if a name splits differently.
5. For a product page, add a page file with `page_hero`, `showcase` and whichever of `features`, `chapters`, `pricing`, `faq` and `contact` it needs.

## Adding a blog post

Blog articles are published by the Blog & Content Engine on blog.lucentstar.ai, not by this kit. The kit holds the design and two representative articles.

1. The pipeline writes the article with the fields in `content/blog/posts/*.yaml` and the markup in `templates/pages/article.html`. Its blocks are `p`, `h2`, `h3`, `quick_answer`, `callout`, `quote`, `table`, `ul`, `ol`, `checklist`, `tools` (comparison cards), `image`, `video`, `qa` and `cta`, plus an optional `hero` image. `docs/SHARED-DESIGN.md` maps each one to the live blog's renderer. Any other block, an image without alt text or dimensions, a missing image size or a video from an unexpected host stops the build.
2. Its address is `https://blog.lucentstar.ai/<slug>` and never changes once published.
3. A new article is published through the pipeline only. The main site doesn't need publishing, unless the article should be linked from it.
4. To preview an article design in this kit, add a file to `content/blog/posts/` with a `body`. Its card on the blog index then opens the local design in review builds, with no other setting. A file without a body only appears as a card, linking to the live article.
5. Add `schema:` (headline, description, dates) to keep the live article's structured data; the questions in the body become its FAQ data.

## Products, clients and examples

- **Clients:** `content/clients.yaml`. The section and its links only appear when `enabled: true` and at least one client has `approved: true`. Put logos in `assets/clients/`.
- **Opening examples:** `content/examples.yaml`. The homepage leads with marketing. A link ending in `#for-dmc` (or `?for=dmc` on a normal website) opens a specific example, and so does a link to `#for-dmc` on the same page. DMC means destination management company. A landing page can show one example with `example: dmc` and `switcher: false` in its `hero`.
- **Example photos:** each example can have an `image` (see the comments at the top of `content/examples.yaml`). Save the photo in `assets/examples/` in every listed width as `<name>-<width>.jpg`, record its dimensions, tint, alt text, crops, source, credit and licence, and use only owned or suitably licensed photos that don't stand for a real client, project or property. The build checks every size and field. Leave `image` out for a text-only example.
- **Switching on slow connections:** the button shows the choice at once, but the screens and caption keep the current example until the next one's photos are loaded and decoded, then crossfade. A photo that fails leaves its tinted panel; after six seconds the switch goes ahead anyway and late photos fade in. The newest choice wins, and nothing blocks scrolling (`scripts/05-examples.js`).

## Forms

`content/site.yaml` sets `form.delivery.enabled: false` for this release. Bottom and floating forms show sending unavailable and retain a working email link, including without JavaScript. They make no delivery requests. `scripts/06-enquiry.js` fails closed when disabled.

Activation is a separate approved release: connect the existing enquiry endpoint and provider, confirm mailbox/privacy facts, test actual inbox delivery and failure/abuse behaviour, then enable both source delivery and the server's `ENQUIRIES_ENABLED` flag. A local transport fixture does not prove live delivery.

## Search engine data

Every page keeps its live address and canonical link. A page can add `structured_data: [organization, software, faq]`; the LucentSignal page does, so its organisation, product, prices and questions are written from the same content as the page. Articles with `schema:` get Article and FAQPage data, and blog pages get the social tags the live blog has. The component reference is marked noindex.

## Publishing

| Change | What to publish |
| --- | --- |
| Main site pages, copy or product facts | The main site (`dist/site/`, GitHub Pages) |
| Navigation, footer, colours or type | The main site, then the new `dist/shared/` in the blog and the app (see `docs/SHARED-DESIGN.md`) |
| A blog article | The blog, through the pipeline |
| Sign-in or welcome screen behaviour | The app |

## Motion

Motion patterns are switched on with data attributes (`data-reveal`, `data-reveal="text"` for blocks with text, `data-beats`, `data-reveal-step`, `data-push`, `data-seq`, including `data-seq="story"` for product page stories, and `data-stage`), and the rules are in the guide. Motion follows the device's reduced-motion setting, and there is no switch on the site. The Contact us panel's movement is in `scripts/06-enquiry.js` (timings in `MOVE`).
