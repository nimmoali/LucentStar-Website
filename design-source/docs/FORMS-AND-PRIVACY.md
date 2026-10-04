# Forms and privacy: current delivery record

Updated 4 October 2026. Both public website forms are enabled in source and production. Contact links open the shared popup. The endpoint is `https://signalapp.lucentstar.ai/api/enquiries`; the fixed recipient is `hello@lucentstar.ai`. Do not revert the released forms to disabled or simulated delivery based on historical review notes.

The flow uses the Signal service on Railway, transactional Resend delivery and the 123 Reg / Titan mailbox. It creates no marketing subscription. Public privacy/subprocessor pages describe this actual flow. No secret values belong in documentation.

Actual browser submissions from both live forms were verified in the authenticated hello inbox on 4 October: `LS-LIVE-20261004-1791125382482-BOTTOM` (`f`) and `LS-LIVE-20261004-1791125382482-FLOATING` (`p`). Activation website revision `0781cd8`, app/blog `dcc9d04`, shared `2026-10-04.cfbaf4ba2e`. Later popup/colour releases preserved enabled delivery; the latest colour check confirmed endpoint readiness and popup behavior without submitting another message.

The handler validates and bounds input, fixes the recipient, checks allowed origins and signed short-lived challenges, applies abuse controls, supports idempotent retries and states uncertainty honestly. Provider acceptance and status readiness alone are not inbox proof; retain the actual inbox evidence above.

This release does not certify mailbox access, forwarding, backups, account-specific retention, processor terms or legal compliance. Retention wording is criteria-based rather than an invented fixed period. For any future provider/data-flow change, verify facts, update the public notice, and test actual delivery before activating it.

See [CURRENT-RELEASE.md](CURRENT-RELEASE.md) for latest versions. The complete earlier operational and privacy notes are [preserved unchanged](archive/FORMS-AND-PRIVACY-before-consolidation-2026-10-04.md); disabled-delivery prerequisites there describe historical stages, not the current service.
