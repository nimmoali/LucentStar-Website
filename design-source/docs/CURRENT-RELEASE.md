# Current LucentStar release

## Latest: purple homepage theme, live 17 October 2026

Website revision `1b8f8d1` is published at `/`. The public homepage matched the committed HTML byte for byte after the Pages deployment completed. The homepage now uses purple title emphasis, dark-purple actions with white text, a standalone dark-purple star in the header and footer, and yellow icons inside the active approach steps. Its copy, layout and motion remain unchanged. The shared LucentSignal and LucentAlba product colours remain distinct.

The source build and static checks passed. The live page retained the consent-gated Google Analytics ID `G-LF5E1LE400`, the configured enquiry endpoint and both form honeypots. This release did not resubmit a form, retest inbox arrival or deploy the blog or app. The shared export content hash remained `e3eb79d8d1`.

## Latest: LucentAlba redesign, live 17 October 2026

Website revision `4808320` is published at `/lucentalba/`. The live clean route matched the committed HTML byte for byte. The redesigned page retains consent-gated Google Analytics `G-LF5E1LE400`, the shared enquiry endpoint and its honeypot. A live waitlist submission and a normal AI visibility enquiry both received provider acceptance; inbox arrival was not checked. The form route and server honeypot also passed the existing 29 local tests before release.

The owner explicitly chose to release the reviewed waitlist, countdown to 7 November 2026 at 09:00 UK, and displayed joined count as supplied. The joined count starts at the recorded 564 on 17 October and the page script adds simulated daily increases. This is not connected to a live sign-up source. Waitlist requests currently go to the existing enquiry inbox rather than a sign-up database. Its privacy wording and launch-email promise remain to reconcile. The products menu still says “See planned features” although that section was removed.

The preview was checked at 1440, 768, 390 and 320px, including reduced motion, replayed scroll animation and both form modes. The live release was checked for the built page, consent tag and accepted form submissions. Screen readers, Safari, Firefox, 200% zoom, a real phone and inbox arrival were not verified for this release.

## Latest: LucentAlba copy and FAQ alignment, live 16 October 2026

Website revision `d39bb906ecbf099ee5c035cf1eac60c4c8b93ccf` is published. It adds the reviewed LucentAlba copy and buyer context section, removes the extra planned-features footnote, and keeps one short factual notice that Fernhill Studio is fictional beside each invented screen. The shared FAQ template keeps styled product names together, so the homepage and LucentSignal FAQs were rebuilt as well. The existing shared export `2026-10-14.e3eb79d8d1` remains in use; the blog and app were not changed.

The source build and static checks passed. The live LucentAlba clean route returned HTTP 200 and matched the released HTML byte for byte. The live homepage and LucentSignal page returned HTTP 200 with the FAQ fix, Google Analytics tag and configured enquiry endpoint still present. Form delivery, screen readers and a fresh visual browser pass were not retested for this copy release.

## Latest: company identity and registered office, live 15 October 2026

Approved legal-page and shared-footer update published: website `fa96e55afbca1f3598cf7a2d3ad477ea9985355c`, app/blog `b9f4f0c885c945f130c59387b873f9484f83eb42`, export `2026-10-14.e3eb79d8d1`. Eight legal/settings pages identify LucentStar AI Ltd, company 17492207, registered office 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ. Shared website/blog/app footers include those details. The old Hanbury address is removed from Terms/Privacy. Build and 16 local checks passed; all deployments and 24 live checks passed. Form/consent behavior and unrelated work preserved. [Release evidence](/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/legal-entity-update/REVIEW-RESULTS.md). This status pointer was updated locally after publication.

## Latest: shared enquiry protection and source identity, 14 October 2026

Website runtime revision `37e675cd0bf0e5f632a8977ed1b705581ab5443e`, app/blog `4be06fc1c359d50c9958c9e93e0acdc39cc1e367`, shared `2026-10-14.e1f04922f6`: published and verified. Every public enquiry uses the inert shared decoy and existing server bot controls. Emails identify the containing page and popup/bottom form, with optional CTA context and no URL query/fragment values. 29 fake-provider tests, 16 local and 20 live desktop/phone form cases passed; filled decoys rejected by production. No new inbox messages sent. [Release evidence](/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/bot-protection-review/RELEASE-RESULTS.md). See [forms documentation](FORMS-AND-PRIVACY.md). This local status record was updated after verification and is separate from the deployed runtime revision.

## Earlier launch snapshot, 4 October 2026

Verified release state, 4 October 2026. This snapshot supersedes older preview/not-published statements. Documentation housekeeping does not itself publish or authorise a new release.

- Website published revision: `fcbeaff520e5828d6cde1ad09791f4319d2ed3d9`.
- App/blog published revision: `a1954c94627097d909292a85509409d80d306aa0`.
- Active shared export: `2026-10-04.d526db3c81`.
- Live: [website](https://lucentstar.ai/), [Alba](https://lucentstar.ai/lucentalba/), [blog](https://blog.lucentstar.ai/) and [Signal login](https://signalapp.lucentstar.ai/login).
- Product names: Lucent `#0B0F1A`, Signal `#00E676`, Alba `#7759B3` from the existing headline token `--a-3`. Dark surfaces use a light backing; filled buttons inherit readable labels. [PRODUCT-BRAND.md](PRODUCT-BRAND.md) is authoritative.
- Consulting leads the homepage. LucentSignal is available now; LucentAlba's limited online version remains coming soon. The approved About page and partnership copy are live. Earlier LucentAlbedo names belong to historical material.
- Enquiries are enabled and deliver to `hello@lucentstar.ai`; contact links open the existing popup. Both bottom and floating submissions were verified in the authenticated 123 Reg / Titan inbox on 4 October. Preserve these settings. [Forms record](FORMS-AND-PRIVACY.md).
- Creator £19/month and Pro £39/month use live GBP billing. Free is three initial full posts, with no monthly reset. Historical USD billing recognition remains for existing records. No successful paid transaction was tested by the release.
- Signed-in analytics consent was fixed and checked during the launch. Website, blog and app preferences remain separate by origin. No social pixels were added.

Evidence is cumulative. The latest colour release checked eight local and fifteen live desktop/phone cases; it did not repeat every authentication, payment or accessibility check.

- [Original launch and consent/GBP evidence](/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/round6-release/LAUNCH-RESULTS.md).
- [Latest colour release and deployment evidence](/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/alba-colour-release/RELEASE-RESULTS.md).
- [Latest desktop screenshot](/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/alba-colour-release/live-alba-1440.png) and [phone screenshot](/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/alba-colour-release/live-alba-390.png).
- [Obsidian current design index](</Users/ali/Desktop/Cowork/projects/website redesign/00 Read Me First.md>).

Permanent repositories: `/Users/ali/LucentStar-Website` and `/Users/ali/linkedin-generator`. Their history has been reconciled to the published revisions while retaining unrelated working changes. Future releases should use these repositories with a reviewed, scoped change set; a dirty working tree is not a release manifest. Temporary release checkouts are historical, not the default source.
