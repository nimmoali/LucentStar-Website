# Codex handover: maintained live website

Updated 4 October 2026. The website, blog and real Signal login/welcome presentation have been integrated and published. Read [CURRENT-RELEASE.md](CURRENT-RELEASE.md) for exact deployed revisions, evidence and limits, then [SITE-PLAN.md](SITE-PLAN.md). Do not follow an old review kit's “nothing published” instructions as current status.

Editable website source is `/Users/ali/LucentStar-Website/design-source`; the dynamic blog and real app routes remain in `/Users/ali/linkedin-generator`. Prefer these permanent repositories. Preserve unrelated dirty files, all routes, articles, assets, structured data, authentication contracts and billing behavior. Commit explicit reviewed paths only. Publication is a separate authorised action.

Read [PRODUCT-BRAND.md](PRODUCT-BRAND.md), [DESIGN-AND-MOTION.md](DESIGN-AND-MOTION.md), [DECISIONS.md](DECISIONS.md), [SHARED-DESIGN.md](SHARED-DESIGN.md), [FORMS-AND-PRIVACY.md](FORMS-AND-PRIVACY.md) and [the source README](../README.md). In the app repository, read its applicable instructions and handover before touching runtime behavior.

Change content in `content/pages/*.yaml`, facts in `content/products/*.yaml`, and shared presentation in templates/styles/scripts. Do not edit generated pages or exports as primary source. Run the website root's `build-release.py` with a Python environment containing Jinja2 and PyYAML; it checks source and propagates a versioned export to the adjacent permanent app repository. Review generated output and stage only intended files; keep `design-source/dist` out of release commits. A shared design change requires coordinated website/blog/app publication and actual deployed version verification.

Forms are enabled and tested, not simulated or unavailable. Contact actions open the existing popup. Authentication and live GBP/Free behavior are already integrated; a presentation change must preserve them. Routine copy polish, social pixels and new refinement features are post-launch items. Real paid payment/webhook reconciliation, broader accessibility/browser coverage and provider-account practice audits remain limited by the evidence recorded in SITE-PLAN.md.

The complete pre-consolidation handover is preserved in [the historical snapshot](archive/CODEX-HANDOVER-before-consolidation-2026-10-04.md). It describes earlier review work and must not override current release facts.
