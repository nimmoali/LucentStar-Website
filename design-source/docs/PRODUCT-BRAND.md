# Product-name graphical direction

Current owner-approved rule, 4 October 2026. This is the maintained graphical reference for product names; earlier colour directions are historical where they differ.

- **Lucent:** dark navy `#0B0F1A`.
- **Signal:** agreed green `#00E676`.
- **Alba:** agreed purple ink `#24105E`.
- Apply the same split-name treatment to wordmarks, product headings, card titles, product navigation and branded inline mentions. Keep the full product name intact for copying and assistive technology. Metadata, URLs, input values and accessible-name attributes remain plain text.
- Use the shared `wordmark()` / `inline` renderer, not hand-coloured spans or separate styling in copied blog/login shells. Inline names inherit the surrounding font weight.
- On dark surfaces, give the wordmark a light backing so Lucent can remain dark and Alba remains readable. Keep other purple theme accents as agreed.
- On coloured filled CTAs, readable button text takes precedence. Names inherit the button’s label colour: **never green Signal text on a green button**. White/outline actions can use the standard branded colours.
- The agreed Signal green has low contrast on white. This is an owner-approved brand treatment, not a claim of WCAG text conformance. Preserve the previously recorded bright-green heading exception and other accessibility rules.

Source: `build.py`, `styles/03b-brand.css`, shared template text filters and the generated component reference. Rebuild exports for website, blog and app entry screens together. Preserve routes, authentication, enabled enquiry delivery, popup contact behaviour, articles, assets and all unrelated edits.
