# Forms and privacy: current delivery record

Updated 4 October 2026. Both public website forms are enabled in source and production. Contact links open the shared popup. The endpoint is `https://signalapp.lucentstar.ai/api/enquiries`; the fixed recipient is `hello@lucentstar.ai`. Do not revert the released forms to disabled or simulated delivery based on historical review notes.

The flow uses the Signal service on Railway, transactional Resend delivery and the 123 Reg / Titan mailbox. It creates no marketing subscription. Public privacy/subprocessor pages describe this actual flow. No secret values belong in documentation.

Actual browser submissions from both live forms were verified in the authenticated hello inbox on 4 October: `LS-LIVE-20261004-1791125382482-BOTTOM` (`f`) and `LS-LIVE-20261004-1791125382482-FLOATING` (`p`). Activation website revision `0781cd8`, app/blog `dcc9d04`, shared `2026-10-04.cfbaf4ba2e`. Later popup/colour releases preserved enabled delivery; the latest colour check confirmed endpoint readiness and popup behavior without submitting another message.

The handler validates and bounds input, fixes the recipient, checks allowed origins and signed short-lived challenges, applies abuse controls, supports idempotent retries and states uncertainty honestly. Provider acceptance and status readiness alone are not inbox proof; retain the actual inbox evidence above.

This release does not certify mailbox access, forwarding, backups, account-specific retention, processor terms or legal compliance. Retention wording is criteria-based rather than an invented fixed period. For any future provider/data-flow change, verify facts, update the public notice, and test actual delivery before activating it.

See [CURRENT-RELEASE.md](CURRENT-RELEASE.md) for latest versions. The complete earlier operational and privacy notes are [preserved unchanged](archive/FORMS-AND-PRIVACY-before-consolidation-2026-10-04.md); disabled-delivery prerequisites there describe historical stages, not the current service.

## Shared honeypot and source identity, 14 October 2026

Every enquiry uses the shared macro: homepage, Alba and About bottom forms; the popup on website product/help/policy pages; and shared blog index/article popups. Signal login/account authentication forms are a separate flow and are unchanged. The inert off-screen text decoy uses a non-personal name (`contact_reference`), autocomplete off, aria-hidden and tabindex -1. The controller sends its value as `website` for the existing server-side check. Any populated or malformed decoy is rejected before the email provider is called. There is no CAPTCHA or new tracking service.

The existing backend checks approved origins, a signed challenge aged 1.5 seconds to 30 minutes, a 16 KB body and bounded required fields. Rate limits are 30 endpoint requests and five POST attempts per IP per 15 minutes. Pending request fingerprints and provider idempotency keys protect duplicates and retries. Rate/idempotency storage is per process and resets on restart; these controls and honeypots reduce simple spam, not all bots or distributed abuse.

Emails now include the containing page title, origin/path, popup vs bottom/contact form and a stable readable ID such as `lucentstar.ai/lucentalba/#popup`. A triggering CTA label/topic is optional and distinct from the user's selected enquiry topic. Client metadata is untrusted context, not authenticated proof. The server bounds strings, removes control characters, requires a page URL matching the approved request origin, strips query/fragment data and never uses source metadata for sender, recipient or headers. Invalid optional context is omitted without blocking genuine delivery. Plain-text email prevents HTML execution.

Verification: focused fake-provider backend cases prove bot/invalid submissions cause zero provider calls, valid empty decoys work for both form types, rate/timing protections hold, retries preserve idempotency and source distinctions remain safe. Browser form submissions are intercepted for UI/source tests; live decoy rejection is checked without a legitimate production submission. October 4 actual inbox proof remains the delivery evidence; this update does not claim a new inbox test. Release evidence: `/Users/ali/.codex/.chatgpt-projects/g-p-6ac130360d00819186f620d0cc712321/bot-protection-review/RELEASE-RESULTS.md`.
