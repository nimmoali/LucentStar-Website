# Round 6 maintained integration

The reviewed release is integrated into the maintained LucentStar website and linkedin-generator repositories. No commit, push or publication is implied.

Edit website `design-source/content/`, templates, styles and scripts. Additional policy/help bodies remain editable under `design-source/content/retained/`. Run `python3 build-release.py` with Jinja2 3.1.6 and PyYAML 6.0.3. The wrapper renders root pages and directory routes and copies the shared export to the sibling `linkedin-generator/public/lucentstar/<VERSION>/`. Use `LUCENTSTAR_SIGNAL_REPO` to select a different maintained Signal checkout. Keep the app export pointer and website version aligned.

Real entry rendering remains in `lib/entry-pages.js`; the blog remains dynamically rendered by `blog-server.js`. Existing authentication, routes and articles are preserved. Free has three initial posts with no monthly reset; paid and trial windows remain monthly. Existing full-generation history counts across plan changes.

All advertised offer prices are GBP: Creator £19/month, Pro £39/month. `lib/billing.js` refuses checkout and plan switching unless the configured Stripe price is active GBP, the exact amount and monthly interval. Live GBP activation is still required. Keep historical subscription recognition with optional comma-separated `STRIPE_LEGACY_CREATOR_PRICE_IDS` and `STRIPE_LEGACY_PRO_PRICE_IDS` when replacing current price IDs. This does not automatically convert existing subscriptions.

Source `form.delivery.enabled` and production `ENQUIRIES_ENABLED` remain false. Forms show unavailable delivery with a working hello@lucentstar.ai email option. Enable only after actual provider acceptance, inbox arrival, failure handling and operational privacy facts are tested and approved.

The signed-in consent gap is fixed using the same generated analytics-consent.js source as entry screens. Reject blocks the loader and optional app events; withdrawal preserves essential session cookies. App Cookie settings now shares the application-origin preference. Production verification remains required. See the external Round 6 RELEASE-REPORT and GO-LIVE-CHECKLIST for verified facts, remaining launch blockers, controlled release checks and exact staging/publication steps. Routine copy polish, social pixels and new refinement features are post-launch tasks.

GBP cutover uses a protective code deployment before changing current price mappings. Configure the dedicated active portal with subscription updates disabled while retaining cancellation, payment management and invoice history. Set STRIPE_GBP_PORTAL_CONFIGURATION_ID. The maintained scripts/verify-gbp-cutover.js command is read-only and requires explicit --live-read-only; it does not read .env files or print secrets. Checkout fixes GBP and disables Adaptive Pricing. Existing active USD subscriptions require a separately reviewed transition. Unknown price events leave the account plan unchanged and fail for retry.
