# LucentAlba Platforms release, 28 October 2026

Ali approved the completed Claude proposal, including its specified animation, and explicitly authorised implementation and public release in this Codex chat on 28 October 2026.

The approved section follows Buyer journey and precedes the example. It shows ChatGPT, Gemini, Google AI Mode, Google AI Overviews, Claude and Perplexity with the five approved SVG assets. Future-facing copy and “up to six” are retained. The existing question, fan paths, stagger, outcome sequence and off-screen reset/replay are preserved exactly. No public-provider calls, customer data, payments or enquiry submissions are involved in verification.

## Bounded validation

The source build and its existing checks pass. Existing product YAML matches the release base after removing the added Platforms section. Both published product HTML routes match each other. The analytics ID and enquiry destination are retained, and the shared export content hash remains `e3eb79d8d1`, so no blog/app release is required. SVGs match Claude's supplied files byte-for-byte.

- Layout, names, SVGs, settled animation and axe checks 1440px
- Layout, names, SVGs, settled animation and axe checks 768px
- Layout, names, SVGs, settled animation and axe checks 390px
- Layout, names, SVGs, settled animation and axe checks 320px
- Specified stagger, path drawing, reset outside viewport and replay
- Reduced motion complete immediately 1440px
- Reduced motion complete immediately 390px
- Get started, both waitlist buttons, Escape and restored normal enquiry
- No live submissions and no page JavaScript errors
- Six experiences remain visible without JavaScript

The accessibility check covers the settled new section with axe WCAG A/AA/2.1 AA rules. It is not a full site or screen-reader conformance claim. Form verification uses a local status fixture and opens/closes the existing modes; no message is sent. Safari, Firefox, a physical phone and inbox delivery were not re-tested.

## Release isolation and source records

Release base: `1c7c077ecf98447520081a01546773f5c9c13031`. The new public page is built from that published base plus this approved section only. The separate, uncommitted Resources candidate and all unrelated working files remain outside this release. In the maintained working tree, those pending changes and the existing featured-guide section are preserved.

Approved source handover: `projects/website redesign/previews/2026-10-28-lucentalba-multiplatform/codex-handover/HANDOVER.md` in the Cowork vault. Asset sources and approval are retained in DECISIONS.md; design and animation behaviour are retained in DESIGN-AND-MOTION.md.

The public page matched the base HTML byte-for-byte before release. Publication and live verification results will be recorded separately after the GitHub Pages build completes; this pre-release record does not itself assert deployment success.
