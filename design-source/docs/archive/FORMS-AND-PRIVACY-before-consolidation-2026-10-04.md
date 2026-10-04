## Live enquiry activation, 4 October 2026

Both website enquiry forms are enabled in source and production. Website release 0781cd8, app/blog release dcc9d04, shared export 2026-10-04.cfbaf4ba2e. Production sender and dedicated form secret are configured securely. The live bottom and floating forms were submitted through the browser and their full messages verified in the authenticated hello@lucentstar.ai 123 Reg / Titan inbox: LS-LIVE-20261004-1791125382482-BOTTOM (Form: f) and LS-LIVE-20261004-1791125382482-FLOATING (Form: p). Earlier disabled/local-only states below are historical. Preserve enabled delivery in future builds.

The public notice describes the actual enquiry flow and no marketing enrollment. This activation is not an audit or certification of mailbox access, forwarding, provider account terms or retention practices. Existing enquiry/email retention wording remains criteria-based rather than claiming an unverified fixed period. Secrets are not stored in documentation.

# Enquiry delivery activation record

4 October 2026. Status: maintained release candidate; delivery disabled. No real enquiry emails have been sent in this follow-up.

## Verified setup

- Website is statically served by GitHub Pages. Both enquiry forms already share the endpoint `https://signalapp.lucentstar.ai/api/enquiries` and one client controller.
- Signal's Railway service has an existing Resend API key and webhook secret. Read-only Resend API inspection confirms `lucentstar.ai` is verified, sending region `eu-west-1`.
- Production `ENQUIRIES_ENABLED=false`. `ENQUIRY_FROM` and a dedicated `ENQUIRY_FORM_SECRET` are not configured. No secrets were printed or saved in this record.
- Incoming MX records are `0 smtp.secureserver.net` and `10 mailstore1.secureserver.net`. Ali confirmed **123 Reg** as the provider in the source chat on 4 October 2026. The 123 Reg Webmail URL opens its branded sign-in page through secureserver SSO. The shared infrastructure is consistent with the MX result; it does not contradict the owner. The actual mailbox/product, forwarding, access and deletion settings remain behind sign-in.
- The Gmail connector is the personal `nimmoali@gmail.com` account. It shows sent mail to hello, which does not establish delivery to the hello inbox. The Resend dashboard requires sign-in in the available browser. Mailbox access is not available through a connected hello mailbox. A 123 Reg Webmail tab is prepared for Ali to sign into hello; no password was requested in chat or account setting changed.

## Implemented transport and controls

The real endpoint fixes `hello@lucentstar.ai` server-side; user-supplied recipients are ignored. Required name/email/message and optional company/topic are validated and bounded. Only the bottom (`f`) and floating (`p`) source markers are accepted. Allowed-origin checks, signed short-lived challenges with a minimum submission time, a hidden honeypot, bounded payloads and per-IP in-memory rate limits provide basic abuse controls. No new challenge vendor or tracker is added.

Submission reaches only the transactional Resend email API. It does not create a contact, user, marketing audience or subscription. There is no mandatory marketing or privacy checkbox. A provider identifier means accepted for email delivery, not inbox arrival. Failure/timeout wording says delivery could not be confirmed, keeps the message and supports a retry with the same provider idempotency key. A new enquiry after success receives a new key even for identical text.

The application does not persist enquiry message bodies to its database or deliberately log them. In-memory rate counters expire after fifteen minutes; request fingerprints and provider receipts expire after twenty-four hours or earlier on failure/restart. Expiry now runs even when no further requests arrive. Railway and email providers have their own operational logs; their account-specific settings remain to verify. Scaling multiple instances would require shared abuse/idempotency storage before treating these in-process controls as global.

## Provider documentation, not account-specific proof

[Resend's GDPR documentation](https://resend.com/security/gdpr) describes US data storage, thirty-day email/log retention for Free/Pro/Scale, flexible enterprise retention, seven-day backups and contacting support for earlier removal. Sending from eu-west-1 does not establish EU storage. The exact account plan, DPA/access and any account-specific retention settings have not been inspected. Those documented defaults must not be claimed as verified mailbox or account settings.

## Exact facts/access needed before enablement

1. Confirm the actual hello mailbox provider/product, hosting/storage region, forwarding destinations and all people/devices with access; confirm existing authentication protections without sharing credentials in chat.
2. Confirm the real mailbox enquiry retention/deletion rule, who performs deletion, trash/recovery and backup limits, and any CRM/export/forwarded/local copies. Provide the actual practice, not a proposed period stated as fact.
3. Confirm Resend account plan, authorised access and applicable processor terms; verify Railway operational-log treatment. Record the enquiry lawful basis and controller identity for the final notice.
4. Provide authenticated access to the hello inbox or have the owner verify the two uniquely labelled test messages there. A Resend accepted/delivered event or HTTP 202 is not inbox proof.

## Activation after those facts are verified

- Complete factual public privacy/subprocessor wording at source; retain the enquiry-only notice and no marketing enrollment.
- Set the confirmed sender and generate a dedicated strong form secret securely inside the service configuration. Do not put a secret in the website or review files.
- With public delivery still disabled, run a restricted local end-to-end test of both actual forms through the real endpoint/provider using synthetic, clearly labelled test messages. Confirm the body/source/recipient and actual hello inbox arrival for each. This local test requires controlled endpoint origins and delivery configuration; remove test-only access/configuration before publication.
- Test provider rejection, missing identifier, timeout, unavailable status, invalid input/origin/challenge, spam and abuse limits against an isolated fake provider; never deliberately break the shared production email key to test failure.
- Only after inbox proof and privacy facts, enable both source `form.delivery.enabled` and production `ENQUIRIES_ENABLED`. Rebuild the shared export, release scoped app/blog/website changes through their existing hosting and verify both live forms.
- On any uncertainty, leave both flags disabled and the working email links visible.

GBP pricing, historical billing mappings and Free three-initial-post behaviour are unchanged. No real payment or paid webhook test is included. Social pixels remain future work.


---

## Historical Round 4 review (superseded by the status above)

The following is the original preview review, not current delivery status or a verified statement of mailbox practice.

# Enquiry forms and privacy

Version 1.1, 28 September 2026. This covers the two enquiry forms on the website: the contact section at the end of most pages and the floating Contact us panel. It records the owner's decisions, what the preview does, and the work that must be finished before the forms send real messages. It isn't legal advice, and adding notice text doesn't make the site compliant with the UK GDPR or the EU GDPR. The site must not claim that it is.

## Owner decisions (Round 4, 28 September 2026)

- Both forms are enquiry-only. Sending an enquiry never subscribes anyone to a mailing list.
- There is no marketing subscription, no required consent checkbox and no required "accept the privacy policy" checkbox.
- Company and topic stay optional. The forms collect only what's needed to reply.
- This notice sits near both send buttons, with "Privacy Notice" linked to the privacy page:

  > LucentStar AI will use your details to respond to your enquiry and manage any related conversation. Sending this form won’t subscribe you to marketing emails. Read our Privacy Notice.

- The simulated-delivery disclosure stays until delivery is connected and tested. Messages are meant for hello@lucentstar.ai.
- If marketing is introduced later, it needs a separate decision, an optional opt-in that isn't ticked in advance, consent records and a way to unsubscribe. None of that is part of this revision.

## What the preview does

| | Contact section | Contact us panel |
| --- | --- | --- |
| Fields | Name, email address, message (required); company, topic (optional) | The same |
| Notice | Just above the send button, with the link opening in a new tab so nothing typed is lost | The same |
| Sending | Simulated. Nothing leaves the page, and both forms say so | The same |
| Checkboxes | None | None |

Once an endpoint is set, `send()` in `scripts/06-enquiry.js` posts these fields as JSON: `to` (hello@lucentstar.ai), `name`, `email`, `company`, `message`, `topic` and `source` (which form: `f` for the contact section, `p` for the panel). Like any web request, it also carries technical details such as the visitor's IP address, which the form service may store. The build refuses to run with `simulated: false` and no endpoint, and a page served that way anyway shows the error message instead of pretending to send.

## What the current Privacy Policy already says

Read on 28 September 2026 at lucentstar.ai/privacy ("Privacy Policy", last updated 6 May 2026, covering lucentstar.ai and the LucentSignal app). These are the page's own statements, recorded here so the review starts from them. None of them has been checked against how the new forms will work, because no form service has been chosen.

| Topic | What the page says | To check before launch |
| --- | --- | --- |
| Identity | "LucentStar AI is the data controller", a UK-based business; contact hello@lucentstar.ai | The footer names LucentStar AI Ltd, registered in England and Wales. Check that the notice gives the controller's full identity and contact details |
| What is collected | "Messages or enquiries submitted via contact forms", and "Information provided when signing up to our mailing list" | Whether a mailing list sign-up still exists anywhere; the new forms have none |
| Purpose | "To respond to your enquiries and provide customer support" | Matches the new notice's purpose. Add "manage any related conversation" if the notice is updated |
| Lawful basis | Contract, legitimate interests, consent (for marketing emails) and legal obligation | No basis is named for website enquiries. Decide and record one |
| Recipients | Anthropic, Stripe, Resend ("Transactional and marketing email delivery") and Railway | No form service is listed, and neither is the provider of the hello@lucentstar.ai mailbox |
| Subprocessor list | "lucentstar.ai/legal/subprocessors" | That address returns "page not found". The list is at /subprocessors, which repeats the same wrong address |
| Retention | "Enquiry and contact form data: 2 years from the date of last contact" | Make sure the form service, the mailbox and any copies are actually deleted on that schedule, or change the stated period |
| International transfers | Standard Contractual Clauses for processors in the USA | Add the form service and the mailbox provider if they store data outside the UK |
| EU | No EU representative under Article 27 has been appointed | Part of the UK and EU review below |
| Rights | Access, deletion and the other rights, a response within a month, and the ICO | Check that the deletion process below can meet it |

The LucentSignal registration screen already has its own optional, unticked box for product updates. That belongs to the app and stays separate from website enquiries.

## Before the forms go live

1. **Lawful basis.** Decide which lawful basis covers website enquiries, and record the decision, who made it and why.
2. **Form service.** Choose a service that emails hello@lucentstar.ai. Review its terms, its data processing agreement, where it stores data, its own subprocessors, how long it keeps submissions, and whether its spam protection brings in another company (some use a third-party challenge). Don't add tracking to submissions.
3. **Mailbox.** Record who provides the hello@lucentstar.ai mailbox, where messages are stored, and its processing terms.
4. **Access.** Decide who can read enquiries in the form service and the mailbox, turn on two-factor sign-in, and remove access when someone leaves.
5. **Deletion.** Write down how an enquiry is deleted at the end of the retention period and on request, in every place it is kept: the form service, the mailbox, and any spreadsheet, CRM or export.
6. **The full notice.** Update the privacy page so that, for website enquiries, it accurately covers: the controller's identity and contact details; the purposes; the lawful basis; the recipients; retention; people's rights; and any international transfers. It must describe the real data flow, including the chosen providers.
7. **Name.** The forms and, since Round 5, the footer say "Privacy Notice" (the reviewer recommended one name, and the address stays /privacy). The live page's heading still says "Privacy Policy": change it when the page is updated. The new name doesn't settle the privacy review.
8. **UK and EU requirements.** Have someone qualified review which UK GDPR and EU GDPR requirements apply to enquiries from the UK and the EU, including the EU representative question the current policy raises.
9. **No marketing.** Make sure enquiries can't reach a mailing list or marketing audience, including through an email tool that's also used for marketing.
10. **Test, then switch on.** Send test enquiries from both forms, confirm they arrive at hello@lucentstar.ai, confirm a failure shows the error message, confirm nothing else is collected, and only then set `endpoint` and `simulated: false` in `content/site.yaml`.

Nothing in this list has been done yet. Each item is implementation work, and the notice and records must reflect the real data flow before launch.

## If marketing is added later

Treat it as a separate decision and a separate change, not an edit to these forms. It would need: an optional opt-in that isn't ticked in advance and isn't required to send an enquiry; a record of who opted in, when and to what wording; an unsubscribe link in every email and a way to honour it; and an update to the Privacy Notice.
