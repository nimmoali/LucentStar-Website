"""Build the complete website and versioned exports without deleting retained routes."""
from pathlib import Path
import subprocess, sys, shutil, re, json, os

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'design-source'
subprocess.run([sys.executable, str(SOURCE / 'build.py'), '--check'], check=True)
shared = SOURCE / 'dist/shared'
version = (shared / 'VERSION').read_text().strip()
dest = ROOT / 'assets/lucentstar' / version
shutil.copytree(shared, dest, dirs_exist_ok=True)
prefix = '/assets/lucentstar/' + version
for p in (SOURCE / 'dist/site').rglob('*'):
    if p.is_file():
        target = ROOT / p.relative_to(SOURCE / 'dist/site')
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, target)

header=(shared/'header.html').read_text()
footer=(shared/'footer.html').read_text()
panel=(shared/'enquiry-panel.html').read_text()
head=f'''<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="{prefix}/lucentstar-shell.css"><script src="{prefix}/lucentstar-mode.js"></script><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="icon" href="/assets/favicon.ico"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">'''
scripts=f'<script src="{prefix}/lucentstar-shell.js"></script><script src="{prefix}/lucentstar-enquiry.js"></script>'
for p in (SOURCE/'content/retained').rglob('*.html'):
    rel=p.relative_to(SOURCE/'content/retained')
    # Current generated business About takes precedence over the retained legacy body.
    if (SOURCE/'dist/site'/rel).is_file(): continue
    original=p.read_text()
    original_head=re.search(r'<head[^>]*>(.*?)</head>',original,re.S|re.I).group(1)
    metadata='\n'.join(re.findall(r'<(?:meta|title|link\s+rel="canonical")[^>]*>(?:[^<]*</title>)?|<script\s+type="application/ld\+json"[^>]*>.*?</script>',original_head,re.S|re.I))
    main=re.search(r'<main[^>]*>.*?</main>',original,re.S|re.I).group(0).replace('<main ', '<main id="main" tabindex="-1" ',1)
    (ROOT/rel).write_text(f'<!doctype html><html lang="en-GB"><head>{metadata}{head}</head><body>{header}{main}{footer}{panel}{scripts}</body></html>')

(ROOT/'help/index.html').write_text((ROOT/'help.html').read_text())

# Clean routes plus explicit static page redirects for legacy product addresses.
for slug in ['lucentalba', 'about']:
    (ROOT/slug).mkdir(exist_ok=True)
    (ROOT/slug/'index.html').write_text((ROOT/(slug+'.html')).read_text())
redirect='<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/lucentalba"><link rel="canonical" href="https://lucentstar.ai/lucentalba"><title>LucentAlba</title></head><body><p>This product is now LucentAlba. <a href="/lucentalba">Visit LucentAlba</a>.</p></body></html>'
(ROOT/'lucentalbedo.html').write_text(redirect)
(ROOT/'lucentalbedo').mkdir(exist_ok=True)
(ROOT/'lucentalbedo/index.html').write_text(redirect)
sitemap=(ROOT/'sitemap.xml').read_text().replace('https://lucentstar.ai/lucentalbedo<','https://lucentstar.ai/lucentalba<')
(ROOT/'sitemap.xml').write_text(sitemap)
shutil.copy2(ROOT/'assets/favicon.ico', ROOT/'favicon.ico')
(ROOT/'.nojekyll').touch()

signal=Path(os.environ.get('LUCENTSTAR_SIGNAL_REPO', str(ROOT.parent/('signal' if (ROOT.parent/'signal').is_dir() else 'linkedin-generator'))))
if signal.is_dir():
    export=signal/'public/lucentstar'/version
    shutil.copytree(shared,export,dirs_exist_ok=True)
    for name in ['favicon.svg','apple-touch-icon.png']:
        shutil.copy2(ROOT/'assets'/name,export/name)
    shutil.copy2(shared/'analytics-consent.js',export.parent/'analytics-consent.js')
    (export.parent/'VERSION').write_text(version+'\n')
print('Complete website and Signal/blog shared export:',version)
