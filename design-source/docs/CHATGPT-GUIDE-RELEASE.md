# ChatGPT guide release - 18 November 2026

Ali approved the reviewed page for publication and requested a short URL and download tracking in this chat on 18 November 2026.

Scope: /chatgpt-business-guide/ landing page; /chatgpt/ branded short redirect; five-page PDF; homepage guide band; source templates and build mapping; sitemap entry. Dark purple #24105E and yellow #F2CF35 match the owner-approved LucentAlba box. No Resources/Studio candidate work, shared design changes, blog/app deployment, advertising, or email automation is included.

Download measurement, using existing GA4 G-LF5E1LE400 and existing analytics consent:
- guide_cta_click: homepage link to the guide landing page.
- guide_download_click: an accepted activation of a PDF button.
- guide_download_complete: the browser consumed the full PDF response, the byte count and SHA-256 match the exact published asset, and the file-save action was initiated.
- guide_download_error: network, timeout, integrity or browser delivery failure; never counts as completion.

Existing cta_id, cta_label and cta_location fields identify the homepage/opening/closing buttons. Other fixed fields identify the guide and file; bytes_received and completion_method describe successful transfers. No entered data or query/fragment values are added to these custom fields. No new key-event flag or custom report is claimed.

Completion means a complete verified file received by the browser, possibly from its cache. It does not prove the user saved, opened or read it. It is a transfer count, not a unique-person count. Direct PDF URLs, fallback/native downloads and downloads without JavaScript are not counted as verified completions. Rejected/absent analytics consent sends no custom events, including retrospective events; browser blockers can also prevent GA receipt. GA enhanced file_download is a click metric and must not be substituted for guide_download_complete.

The PDF links work without JavaScript. Supported browsers fetch and validate the file, then trigger a native blob download. A 30-second timeout, readable status, retry/direct link and one in-flight transfer prevent false or duplicate completions. Build-time asset metadata automatically follows the PDF. Analytics failure cannot block delivery.

Validation: full source build/check passed; ten focused delivery/consent scenarios passed (full file, rejected consent, network error, corrupt/truncated file, HTTP error, concurrent buttons, withdrawal, unsupported native fallback, blocked analytics and homepage CTA). Prior desktop, 390px and 320px layout, keyboard, FAQ and actual browser download checks passed. Browser status confirmed the new verified-PDF path. Live checks and GA receipt are recorded separately after deployment. No live form was submitted.

Public source references: https://developers.google.com/analytics/devguides/collection/ga4/events and https://developer.mozilla.org/en-US/docs/Web/API/Response/arrayBuffer.
