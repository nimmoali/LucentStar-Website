# LucentStar design and motion guide

Version 1.6, 1 October 2026 (Round 6). This guide is for everyone who changes the website, the blog or the LucentSignal sign-in and welcome screens, including Claude and Codex. The source kit applies these rules, and `build.py` checks the ones that can be automated. `dist/shared/reference.html` shows the shared components, built only from the shared export, so any page can be compared with it.

## Principles

- **Customer-centred and honest.** We explain what we do in plain British English. We say "we" and "you", and we never invent results, clients or product status.
- **White space and calm type.** Pages are mostly white, with generous spacing, clear headings and short line lengths.
- **Motion explains.** Movement shows how something works or where to look next. It never delays reading or makes scrolling feel stuck.
- **Crisp, not decorated.** No glows, and no tinted or faded borders.
- **One source for facts.** Product names, statuses, prices, allowances, style names and links live in `content/products/`. Copy quotes them with placeholders such as `{{signal.plan.free.posts}}`, so a plan change can't leave a contradiction behind.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| Navy | #0B0F1A | Headings, primary text on light backgrounds, the current navigation item, the Contact us launcher |
| Text | #1E2433 | Body copy |
| Muted | #5B6475 | Secondary copy, navigation items, captions (6.0:1 on white) |
| Line | #E4E7EC | Hairline borders and dividers |
| Cloud | #F5F6F8 | Alternate section background |
| Brand green | #00E676 | The main website's accent: filled buttons, product dots, text link underlines, and heading emphasis in titles (see the decision record) |
| Albedo purple | #7759B3, hover #50398C, ink #24105E, lavender #F2EFFC | The LucentAlbedo page theme, LucentAlbedo screens, "Planned" labels and "Albedo" in the wordmark |
| Brand blue (Lucent) | #0B0F1A | "Lucent" in product wordmarks on light backgrounds (owner decision, 28 September 2026). The same value as the navy, 19.1:1 on white. On dark backgrounds Lucent is white |
| Signal dark | #0B0F1A, #151B2E, #232B42 | LucentSignal product screens |

Components use accent roles (`--accent`, `--em`, `--link-line`, `--launcher`) rather than raw colours, so a page theme can change them in one place.

**Page themes.** A page file can set `theme: albedo`. The LucentAlbedo page then uses the Albedo purple for heading emphasis (#7759B3, 5.4:1 on white), filled buttons with white labels (5.4:1, and 9.1:1 on hover), text link underlines, the chosen topic in the enquiry form and the Contact us launcher (#50398C). Every other page uses the brand green.

Rules:

- Heading emphasis is a text colour only. It is never underlined and never has a highlight bar.
- Content boxes of any kind never have green borders. Borders are Line hairlines, or none, and never tinted or semi-transparent.
- The header shows the current section or page by colour: items are grey and the current one is navy.
- Status labels are filled pills with no border. "Available now" has a green dot, and "Coming soon" and "Planned" use neutral or lavender fills.

**Decision record.** On 28 September 2026 the owner explicitly chose to keep #00E676 for heading emphasis on the main website, knowing that bright green text is 1.67:1 on white, below the WCAG AA minimum for text. The proposed darker text green (#009E51) was withdrawn. To keep the impact small, #00E676 is only used as text for emphasised words inside display-size titles, never for body text, links, labels or small text. The one other place it appears as text is the Signal half of the LucentSignal wordmark (owner decision, Round 4), which is a brand name and so counts as a logotype (see Product wordmarks). Any statement of accessibility conformance must list the heading emphasis as a known exception.

## Product wordmarks

One component, `wordmark(product, variant)` in `build.py`, writes every branded product name. Never type the coloured spans by hand.

| Background | Lucent | Signal | Albedo | A product without its own colour |
| --- | --- | --- | --- | --- |
| White or light (`light`) | Brand blue #0B0F1A | #00E676 | #7759B3 | Navy |
| Navy or dark (`dark`) | White | #00E676 | #7759B3 | Grey #94A3B8 |

- **Where:** the header products menu and mobile menu, product tiles, the product label above a showcase or page title, product screens (dark on the LucentSignal app, light on the LucentAlbedo screens), and the sign-in title ("Sign in to LucentSignal."). In copy, `{{wordmark:signal}}` writes it inside a heading.
- **Not used:** in sentences, footer link lists, form options and button labels. Those stay plain text.
- **Accessible name:** the two halves are inline, with no space between them, so screen readers and copied text get the full name ("LucentSignal").
- **Contrast:** Signal green is 1.7:1 on white. WCAG's contrast minimum doesn't apply to text that is part of a logo or brand name, but small sizes are still hard to read, so the wordmark is used at 15px or larger and in bold. Albedo purple is 3.5:1 on navy.
- The LucentAlbedo screens have white header bars (with a hairline), so they use the light wordmark. This is a proposed change for review; a dark header with the dark wordmark would also work.

## Four-point star

A restrained four-point star, drawn with straight edges like the LucentStar mark, replaces dash-like marks. It is navy, 12px, with a 13px gap, and it is decorative only: it is drawn by CSS or an SVG hidden from assistive technology.

- `class="star-list"` puts it before each item of a list (the homepage service examples).
- `class="star-rule"` starts a separator line with it (above the prototype notes in the forms and the sign-in preview).
- `ui.star()` gives the same star as an inline icon.

It replaced the short bars before each service example and the dashed line above the prototype notes. Middle dots in step labels ("1 · A rough idea"), in example screens and in the footer are separators between words, not dashes, and are unchanged (see the decision record). The star's colour is one token (`--star-colour`), so it can follow the page accent if the owner prefers.

## Typography

| Role | Font and weight | Size |
| --- | --- | --- |
| Page title, every page (`.h-title`) | Poppins 700 | 40 to 80px, line height 1.04 |
| Product wordmark | Poppins 700 | 15px or larger on the page (smaller only inside scaled product screens) |
| Introduction under a page title (`.intro`) | Poppins 400 | 18 to 21px, line height 1.6 |
| Section heading | Poppins 600 | 32 to 52px |
| Chapter heading (product pages) | Poppins 600 | 28 to 40px |
| Sub-heading | Poppins 600 | 22 to 28px |
| Body | Poppins 400 | 17px (16px on phones), line height 1.65 |
| Article body | Poppins 400 | 18px (17px on phones), line height 1.7 |
| Labels and buttons | Poppins 500 to 600 | 13 to 16px |
| LucentAlbedo screens | Inter | Scaled inside the device frame |

Every page starts with the shared opening (`.opening`): the page title, the introduction, then its actions. The title's line length adapts to the heading (about 14 characters on the homepage, 20 elsewhere, 11 on sign-in), but the style and size never change. Headings use `text-wrap: balance`. Leads stay under about 40em wide, and article text under about 68 characters.

## Links and buttons

- **Text links are underlined** in the page accent: 2px, 5px below the text (4px for links inside sentences), thickening to 3.5px on hover. This covers links such as "See how we can help", "See planned features" and "Sign in", links inside sentences, footer links on hover and links in forms.
- **Not underlined:** pill buttons, navigation items (they use colour), heading emphasis and product names in menus.
- **Filled pill** (`style: primary`): the page's main action, in the accent colour.
- **White pill** (`style: pill`): a white button with a navy outline. The homepage's product sections use it for Try LucentSignal and Talk about AI visibility, so the products don't compete with the page's main action.
- Links between lucentstar.ai and the blog stay in the same tab (`same_tab_prefixes` in `content/site.yaml`). Links into the LucentSignal app, such as Try LucentSignal and Sign in, open it in a new tab from the website and the blog, and stay in the same tab inside the app (`header-app.html`). Other external links open in a new tab.

## Layout and spacing

- The content width is 1264px, with side gutters of 32px, 20px under 760px and 16px under 600px.
- Section padding is 144px, falling to 104px on tablets and 80px on phones.
- Cards use a 24 to 28px radius and a Line hairline. Buttons are 52px tall (44px for small buttons), and controls give at least 44px touch targets.
- Grids stack to one column on phones. No page scrolls sideways at 320px.

## Components

Each component has one template in `templates/` and takes its copy from `content/`.

- **Shared on every page:** the header (navigation, products menu, mobile menu, Blog, Sign in), the footer, the floating Contact us launcher and panel, the product wordmark, availability labels, the star, and the icon set. The blog and the app use the same header and footer (`dist/shared/`), and `dist/shared/reference.html` shows them all.
- **Openings:** the homepage opening with interchangeable audience examples, and the page opening for every other page.
- **Story sections:** services (sticky illustration; on the homepage, the two customer problems and bespoke projects, each with its own links), workflow (sticky diagram, four or five steps), about and principles, and questions.
- **Product page stories** (`stories`): a short sequence of steps from the customer's problem to the response, beside a picture that changes state as each step is read (see Product page stories).
- **Products:** product tiles, product showcases (LucentSignal, LucentAlbedo, and a generic one for new products), status labels, card grid, "ways to work with us", chapters (text beside a product screen), pricing and a closing band.
- **Blog:** the index (article cards, newest first) and the article (breadcrumb, title, meta, quick answer, tables, numbered lists, questions, a call to action and related articles).
- **Sign-in:** the app's own form in a card beside the page title, with the app's own messages above the fields in one of three variants (see Sign-in messages).
- **Welcome:** the screen people reach after a successful magic-link sign-in: the wordmark title, a short introduction, one main action, the idea, draft and review screen grab, and the next steps (see Welcome screen).
- **App screens look like the app** (owner decision, 29 September 2026): wherever a page shows LucentSignal itself, as a showcase or a screen grab, it uses the app's own dark blue interface (the `--s-*` surfaces, borders and labels, and the dark wordmark), placed on the page's own background, which stays white.
- **Conversation:** one enquiry form used by the contact section and the floating panel. Both show the enquiry notice just above the send button (see `docs/FORMS-AND-PRIVACY.md`). There are no consent or marketing checkboxes.
- **Clients:** hidden until it is switched on with approved material.

## Example photos

The homepage opening's examples ("Industries we’ve worked with") can each carry a photo that belongs to the task on screen: the project under review, the client's campaign, the itinerary's destination, the guest's cottage.

- **On the laptop,** the photo fills the top of the main pane, with the task's title on a white label and a small white tag naming the photo. The working panel sits over the photo's lower edge: the request, the useful output, the material it came from and the review step. The note that a person checks the work sits at the foot of the list.
- **On the phone,** the photo is a cropped header (about a third of the screen, less for a conversation), with the app's bar on white over its lower edge, then the drafts or the conversation.
- **Text always sits on solid white,** never on the photo.
- **Loading.** The chosen example's photo loads with the page; the others are fetched after the page has loaded, or as soon as their button is pointed at or focused. Space is reserved by fixed heights, width and height, and a tint colour, so nothing shifts. Where the laptop is hidden (760px and narrower), its photos are never downloaded.
- **Motion.** The photo changes with its example in the existing crossfade. Nothing rotates on its own, and with reduced motion the change is instant.
- **Slow connections.** The pressed button moves at once, but the screens and caption keep the current example until the next example's visible photos are loaded and decoded; only then do they crossfade. After a quarter of a second of waiting, the chosen button's label pulses gently (not with reduced motion). A photo that fails leaves its tinted panel in place, never a broken image. If the photos take longer than six seconds, the switch goes ahead and each late photo fades in when it arrives. The newest choice always wins, and the waiting never blocks scrolling.
- **Honesty.** Photos are representative stock. Their credit, source and licence stay in `content/examples.yaml`; the homepage shows no note about them (owner decision, 29 September 2026). A photo never stands for a LucentStar client, project or property.
- An example without a photo shows text only.

## Examples and honest labels

- The homepage carries no fictional-data notes: not under the opening examples, the service examples or the LucentSignal story (owner decision, 29 September 2026). Don't add replacement disclaimers there. Inner pages may carry one discreet note where fictional businesses or results could look real (the LucentSignal page keeps its notes). There are no "Illustrative example" badges.
- Explanations stay where they help: on the LucentSignal page, scores are "AI-generated editorial guidance, not a prediction of reach or engagement"; LucentAlbedo's disclosure and limitations (a report "shows what was captured under stated conditions") show wherever its story appears, the homepage included.
- Planned features are labelled "Planned". A status label only appears when it has been confirmed.
- LucentAlbedo's report screens show the planned online version's design, so they carry a "Planned" label wherever they appear (the homepage and the LucentAlbedo page). Consulting, available now, is labelled "Available now through consulting".
- Each product page's story notes that its example uses fictional data. The homepage still carries no such notes.
- Product facts (styles, allowances, prices) are recorded once in the product file, with where each came from. Facts copied from the marketing page are labelled as such until someone checks them in the app or its billing (`verification:` in the product file). Example screens only show features the product page states.

## Motion

Tokens: 180ms for control feedback, 320ms for small state changes and 680ms for larger ones, with the easing curve `cubic-bezier(.16,1,.3,1)`.

| Pattern | Attribute | Behaviour |
| --- | --- | --- |
| Reveal | `data-reveal` | A picture fades and rises once. |
| Reveal text | `data-reveal="text"` | A card or band that carries text or actions only rises a little, once. Its text and buttons are visible and usable from the start. |
| Beats | `data-beats` | A small illustration builds in three steps. |
| Step marker | `data-reveal-step` | A step lights up as it reaches the middle of the screen. |
| Push-in | `data-push` | The opening devices scale slightly as you start to scroll. |
| Sticky aside | `data-seq` | The text scrolls normally while one visual stays in view and follows it. |
| Pinned stages | `data-stage` | A short pinned sequence with captions that fill as you scroll. |
| Story | `data-seq="story"` | Product page stories: the steps scroll normally while the picture stays in view and takes the state of the step being read; a rail above it fills as you read. Never pinned. |

**Contact us panel.** The panel slides up from the launcher with a light fade (on phones, up from the bottom edge), and the backdrop fades with it, using the same duration and easing.

| | Duration | Easing |
| --- | --- | --- |
| Open | 220ms (250ms on phones) | `cubic-bezier(.22,1,.36,1)` |
| Close | 180ms (200ms on phones) | `cubic-bezier(.33,1,.68,1)` |

Movement starts on the first frame, with no bounce. The dialog only closes once the exit has finished, and opening or closing part-way through reverses from where it is. Escape, the Close button and a click on the backdrop all close it, focus returns to the launcher, and the panel scrolls inside itself on phones while the page behind stays still.

Rules:

- Every scroll movement changes something on screen. There is no dead scrolling.
- A pinned sequence lasts no more than 0.9 screen heights.
- On phones there is no pinning. Sequences become stacked content with light reveals.
- Motion follows the device's reduced-motion setting, and there is no switch on the site. With reduced motion on, every pattern shows its finished state and the panel opens and closes instantly.
- The scroll loop reads only the scroll position and cached sizes, so scrolling never forces layout work.
- Articles, the blog index and policy pages use restrained motion: the article heading fades in once on load and index cards reveal once, with no pinning or scroll-linked effects.

## Accessibility (WCAG 2.2 AA)

- Text contrast is at least 4.5:1, or 3:1 for large text, with one known exception: the owner's choice of #00E676 for heading emphasis (see the decision record). Product wordmarks count as logotypes, which WCAG exempts from the contrast minimum; they keep the full product name for screen readers.
- Decorative marks (the star, product dots) are hidden from assistive technology.
- Every control shows a visible focus outline (3px navy, white on dark panels), and a skip link leads to the main content.
- Reading order matches visual order. The LucentAlbedo notes, for example, are a list in the order 1, 2, 3, 4.
- Collapsed answers to questions are hidden from screen readers and the Tab key until they are opened.
- Forms have labels, hints, an error summary and inline errors, and keep what the visitor typed. Sign-in fields use `autocomplete="username"` and `autocomplete="current-password"`.
- Tables in articles keep their headers, can be scrolled by keyboard, and become one labelled card per row on phones.
- The floating panel is a modal dialog. It closes with Escape or its Close button, and focus returns to the launcher. The launcher never covers a focused element, because of extra scroll padding.
- Pages reflow at 320px and at 200% zoom.
- These points need checking with assistive technology before any claim of conformance.

## Copy rules (checked by `build.py`)

- UK English, "we" and "you", and no first-person singular in our own copy ("My" at the start of a sentence counts too). Readers' own questions may keep their voice ("Can I export my posts?"): questions in a list marked `reader_voice: true` and questions in articles. Imported blog articles (`imported: true`) keep their text as written.
- Product facts are never typed into page copy. The build stops if it finds a price, an allowance, the style names, the scoring dimensions or the export tools typed by hand, and names the placeholder to use instead.
- Titles and descriptions are checked too.
- No em dashes, and none of these words: supercharge, leverage, unlock, game-changing, revolutionise, streamline.
- Never the word "most", anywhere on the site (owner decision, 1 October 2026). The build checks every page's text, title and description, and the content and templates.
- No invented clients, logos, testimonials, results or pricing.

## Blog and articles

- The same header and footer as the main site, with Blog as the current item, so readers can move between the blog and the main site.
- The index shows each article's category, title, summary, reading time and date, newest first, with a closing band for LucentSignal.
- Articles use the page title style, a meta line (category, date, reading time), a "Quick answer" when useful, one in-article call to action and related articles.
- Tables have a grey header row and hairline rows. A risk or status value is a filled label, never a coloured border.
- Articles can also use a callout, a quote with its source, a checklist, comparison cards, images (wide or inline, with alt text, caption and credit), an embedded video and a hero image. These cover everything the live blog's renderer shows. An unknown block stops the build instead of disappearing.
- Comparison cards mark our own product with its disclosure and a Cloud fill, never a coloured border. Pros and cons use tick and cross icons, not dashes.
- Headings in articles are plain navy; colour emphasis is only for display titles.
- Existing article addresses stay exactly as they are.

## Sign-in messages

The app renders its own messages above the sign-in fields, in one message box with three variants. The wording is always the app's own.

| Variant | Use | Look | Behaviour |
| --- | --- | --- | --- |
| Error | Wrong details, an account that isn't active, a link that has expired or been used | Red outline on a light red fill, alert icon | `role="alert"`; takes focus when the page loads |
| Success | Password reset | Light green fill, no border, tick icon | `role="status"`; read with the first field |
| Neutral | Signed out, or the session changed | Cloud fill, information icon | `role="status"`; read with the first field |

The reset link reads "Forgotten your password?", with "We’ll email you a link to reset it."

## Welcome screen

The LucentSignal welcome screen (`/welcome`) greets people who have just signed in with a magic link. It uses the white shared design, the signed-in header and footer ("Open LucentSignal" instead of "Sign in") and the LucentSignal wordmark in the title.

- **One main action:** "Create your first post", a large primary button straight after the introduction. It is never animated or delayed, so it works the moment the page appears. There are no other buttons in the page body.
- **What happens next:** three short steps (an idea, a draft in your voice, a review), in a row on desktop and a list on phones, with a link to the help pages.
- **Illustration:** a screen grab of the app in its own dark blue, on the white page: the app bar with the LucentSignal wordmark (dark variant) and Write, then three cards stepping down from the idea (with the chosen style) to the draft to the review (score ring and the four score boxes), drawn from the product's example screen. It is decorative and hidden from screen readers; the steps say the same in text.
- **Motion:** the cards arrive once, in order, over about two seconds, with the draft's lines and the scores settling in last. Nothing loops. With reduced motion everything is shown complete.
- **Desktop and phones:** at 1000px and wider the introduction and action sit beside the illustration; narrower, the action comes straight after the introduction, then a compact illustration, then the steps.
- **Honesty:** no plan, allowance or trial details, no testimonials and no personal details.

## Product page stories

Each product page tells its own visual story, so the homepage's product stories aren't repeated there (owner's brief, 1 October 2026). The section is `stories`, with its pictures in `templates/visuals/stories.html` and its styles in `styles/08b-stories.css`.

- **Content:** a heading, a lead, an optional status label, and a story of four or five steps (`rail`, `heading`, `text`, and optionally `terms`, `points`, a product note or links), with a picture (`visual.kind`) and an optional note. The copy and the picture's example data live in the page file.
- **Desktop with motion:** the steps on the left scroll normally; the picture on the right stays in view and changes state as each step reaches the middle of the screen. Earlier parts stay, fold or dim so the newest one leads. A rail above the picture fills as you read. Nothing is pinned, so there is no dead scrolling.
- **Reduced motion:** each step sits beside its own still picture, drawn at that step's state.
- **Tablets:** each step, then its picture.
- **Phones:** each step, then a compact picture of just that state (for example only the new card in the app, or only the evidence rows).
- **Pictures** are decorative and hidden from screen readers, with nothing focusable inside; the steps say the same in text. The LucentSignal picture uses the app's own dark blue for the app's parts, on the white page.
- **AI visibility (LucentAlbedo):** one buyer question and one answer; four captured answers that differ by wording, assistant and date; the questions tested and the conditions; the evidence, with mentioned, recommended and cited kept separate, what wasn't assessed and what the set can't show; then a short list of priorities tied to the evidence. No score.
- **LucentSignal:** what you know, scattered, with the week's rhythm; one idea in the app; a draft in your voice; the editorial guidance; then your review and plan, with a reminder that you publish.

## Component reference

`dist/shared/reference.html` is built by every build from the shared export only. It shows the wordmarks (light and dark), headings and text, buttons and links in both page themes, the star, the welcome screen's components, and the Contact us panel with its open and close timings read from the running animation. Check a new page, the blog or the app against it before release.

## Changing the site

1. Edit content in `content/`. Change templates only when the layout needs to change.
2. Run `python3 build.py --check`.
3. Review the page on desktop, on a phone at 390px and 320px, with reduced motion on, and with the keyboard only, and compare it with the component reference.
4. If the header, footer, colours or type changed, update the blog and the app from `dist/shared/` (see `docs/SHARED-DESIGN.md`).
5. Keep proposed designs, owner decisions, implemented previews, tested behaviour and production changes clearly separate in the decision record.
