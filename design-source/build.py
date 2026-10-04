#!/usr/bin/env python3
"""Build the LucentStar website from content, templates, styles and scripts.

    python3 build.py            build every page, then report any problems
    python3 build.py --check    the same, but stop with an error if any check fails

Output (dist/ is emptied first, so nothing out of date is ever left behind):
    dist/site/        complete pages plus assets/, ready to open in a browser or host.
                      In review mode (url_mode: files) this also holds the blog and
                      LucentSignal sign-in designs, so every link can be followed.
    dist/artifact/    the same pages for the Claude artifact viewer: the homepage
                      without its <html> wrapper (the viewer adds it), others complete
    dist/designs/     (url_mode: clean only) the blog and sign-in designs, with the
                      images they use, kept apart so they are never published on
                      lucentstar.ai by mistake
    dist/shared/      the shared header, footer, styles, script and navigation data
                      for blog.lucentstar.ai and signalapp.lucentstar.ai
                      (see docs/SHARED-DESIGN.md)

Checks run on every build:
    copy     no em dashes, none of the banned words, no first-person singular
             (articles marked imported: true keep their readers' questions as written),
             and none of the words ruled out of site copy (SITE_WORDS)
    content  a comma inside {...} that split a text value in two (the rest would be lost)
    markup   unique ids, images with alt text, new-tab links with rel="noopener"
    links    every link to a page or section (on any page) points at something real
    assets   every local image exists and is copied into the built site
    forms    a live form (simulated: false) must have a delivery endpoint; the build
             refuses to run otherwise, so a form can never pretend to send
"""
import datetime
import glob
import hashlib
import html as htmllib
import json
import os
import re
import shutil
import sys
from html.parser import HTMLParser

import yaml
from jinja2 import Environment, FileSystemLoader, pass_context, select_autoescape
from markupsafe import Markup, escape

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
BANNED = ['supercharge', 'leverage', 'unlock', 'game-changing', 'game changing', 'revolutionise', 'revolutionize', 'streamline']
# No additional blanket word bans are confirmed. Keep the approved copy;
# the prior "most" prohibition was an unconfirmed review interpretation.
SITE_WORDS = []
REFERENCE_ONLY_CSS = {'20-reference.css'}
EXTERNAL = ('http://', 'https://', 'mailto:', 'tel:')

# The shared export for the blog and the app: which styles and scripts it carries
SHARED_CSS = ['01-tokens.css', '02-layout.css', '03-controls.css', '03b-brand.css', '04-header.css', '14-faq.css',
              '15-forms.css', '16-footer.css', '16b-enquiry.css', '19-reduced.css', '21-integrations.css']
VERSION_MARK = '@@LS_VERSION@@'   # replaced by the export's version once its content hash is known

# Product facts quoted in copy as {{<product id>.<fact>}} (see product_facts)
FACT_RE = re.compile(r'\{\{\s*([a-z][\w-]*(?:\.[\w-]+)+)\s*\}\}')
# Wordmarks written inside copy as {{wordmark:<product id>}} or {{wordmark:<id>:dark}}
WORDMARK_RE = re.compile(r'\{\{\s*wordmark:([\w-]+)(?::(light|dark))?\s*\}\}')
NUMBER_WORDS = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten'}
SHARED_EXTRA_CSS = {'lucentstar-blog.css': ['17a-blog.css'], 'lucentstar-auth.css': ['17b-auth.css'],
                    'lucentstar-welcome.css': ['17c-welcome.css']}
SHARED_JS = ['01-core.js', '04-site.js', '09-consent.js']


def load(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        try:
            return yaml.safe_load(f)
        except yaml.YAMLError as err:
            mark = getattr(err, 'problem_mark', None)
            where = f' at line {mark.line + 1}, column {mark.column + 1}' if mark else ''
            print(f'Stopped: {path} is not valid YAML{where}: {getattr(err, "problem", None) or err}.'
                  ' Put quotes around text that contains a colon, a question mark inside {...}, or starts with a brace.')
            sys.exit(1)


def split_values(obj, path, where=()):
    """Text after a comma inside {...} becomes a key with no value, which drops
    it from the page silently: {text: Ideas in chat, notes in the drive}. Report
    any key with no value that reads like words, so it can be quoted."""
    found = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if v is None and isinstance(k, str) and ' ' in k.strip():
                found.append(f'{path}: "{k}" at {" > ".join(map(str, where)) or "the top"} has no value; a comma inside {{...}} probably split the text. Put the whole text in quotes')
            found += split_values(v, path, where + (k,))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            found += split_values(v, path, where + (i + 1,))
    return found


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')


def join_words(items):
    items = [str(i) for i in items]
    return items[0] if len(items) == 1 else ', '.join(items[:-1]) + ' and ' + items[-1]


# ---------------------------------------------------------------- product facts
def product_facts(p):
    """Facts that any copy can quote as {{<id>.<fact>}}, so each one is typed once,
    in the product file. Derived from the product's own records:

        {{signal.name}}                     LucentSignal
        {{signal.status}}                   Available now (only once verified)
        {{signal.status_lc}}                available now, for use inside a sentence
        {{signal.plan.free.posts}}          3     (also .name .price .period .allowance)
        {{signal.styles}}                   Thoughtful, Focused and Challenging
        {{signal.styles_count}}             three
        {{signal.styles_described}}         Thoughtful holds nuance and invites reflection. Focused ...
        {{signal.scoring.dimensions}}       hook, insight, clarity and closing
        {{signal.scoring.count}}            four
        {{signal.scoring.out_of}}           40
        {{signal.platforms}}                Hootsuite, Agorapulse, ... and Google Calendar
        {{signal.<key>}}                    any value under the product's facts:
    """
    f = {'name': p['name']}
    av = p.get('availability') or {}
    if av.get('verified') and av.get('label'):
        f['status'] = av['label']
        f['status_lc'] = av['label'][:1].lower() + av['label'][1:]
    for pl in p.get('plans') or []:
        key = pl.get('key') or slugify(pl['name'])
        for k in ('name', 'price', 'period', 'posts', 'allowance'):
            if pl.get(k) is not None:
                f[f'plan.{key}.{k}'] = str(pl[k])
    if p.get('styles'):
        names = [s['name'] for s in p['styles']]
        f['styles'] = join_words(names)
        f['styles_count'] = NUMBER_WORDS.get(len(names), str(len(names)))
        f['styles_described'] = ' '.join(f'{s["name"]} {s["text"][:1].lower()}{s["text"][1:]}' for s in p['styles'] if s.get('text'))
    sc = p.get('scoring') or {}
    if sc.get('dimensions'):
        f['scoring.dimensions'] = join_words([d.lower() for d in sc['dimensions']])
        f['scoring.count'] = NUMBER_WORDS.get(len(sc['dimensions']), str(len(sc['dimensions'])))
    if sc.get('out_of') is not None:
        f['scoring.out_of'] = str(sc['out_of'])
    if p.get('platforms'):
        f['platforms'] = join_words(p['platforms'])
    for k, v in (p.get('facts') or {}).items():
        if isinstance(v, (str, int, float)):
            f[k] = str(v)
    return {f'{p["id"]}.{k}': v for k, v in f.items()}


def resolve_facts(obj, facts, where, problems):
    """Replace {{<id>.<fact>}} in every string of a content record."""
    if isinstance(obj, str):
        def rep(m):
            if m.group(1) in facts:
                return facts[m.group(1)]
            problems.append(f'{where}: unknown product fact "{{{{{m.group(1)}}}}}"')
            return m.group(0)
        return FACT_RE.sub(rep, obj)
    if isinstance(obj, list):
        return [resolve_facts(v, facts, where, problems) for v in obj]
    if isinstance(obj, dict):
        return {k: resolve_facts(v, facts, where, problems) for k, v in obj.items()}
    return obj


def hand_typed_facts(products):
    """Phrases that must come from the product record, not be typed into page copy."""
    rules = []
    for p in products:
        pid = p['id']
        for pl in p.get('plans') or []:
            key = pl.get('key') or slugify(pl['name'])
            price = str(pl.get('price') or '')
            if price and re.sub(r'[^\d.]', '', price) not in ('', '0'):
                rules.append((re.compile(re.escape(price) + r'(?![\d.])'), f'{{{{{pid}.plan.{key}.price}}}}'))
            if pl.get('posts') is not None:
                n = re.escape(str(pl['posts']))
                rules.append((re.compile(rf'\b{n} (free posts|posts (per|a) month)\b', re.I), f'{{{{{pid}.plan.{key}.posts}}}}'))
        if len(p.get('styles') or []) > 1:
            rules.append((re.compile(re.escape(join_words([s['name'] for s in p['styles']]))), f'{{{{{pid}.styles}}}}'))
        sc = p.get('scoring') or {}
        if len(sc.get('dimensions') or []) > 1:
            rules.append((re.compile(re.escape(join_words([d.lower() for d in sc['dimensions']])), re.I), f'{{{{{pid}.scoring.dimensions}}}}'))
        if sc.get('out_of') is not None:
            rules.append((re.compile(rf'\bout of {sc["out_of"]}\b'), f'{{{{{pid}.scoring.out_of}}}}'))
        if len(p.get('platforms') or []) > 1:
            rules.append((re.compile(re.escape(join_words(p['platforms']))), f'{{{{{pid}.platforms}}}}'))
    return rules


def check_hand_typed(products):
    """Page copy, site copy and the blog settings quote product facts through
    placeholders, so a plan change can't leave a contradiction behind. Blog
    articles are published by the blog pipeline and are not checked here."""
    problems = []
    rules = hand_typed_facts(products)
    files = (sorted(glob.glob(os.path.join(ROOT, 'content/pages/*.yaml')))
             + [os.path.join(ROOT, f) for f in ('content/site.yaml', 'content/examples.yaml', 'content/blog/blog.yaml')])
    for path in files:
        if not os.path.isfile(path):
            continue
        with open(path, encoding='utf-8') as fh:
            for n, line in enumerate(fh, 1):
                if line.lstrip().startswith('#'):
                    continue
                for rx, use in rules:
                    m = rx.search(line)
                    if m:
                        problems.append(f'{os.path.relpath(path, ROOT)}:{n}: "{m.group(0)}" is a product fact typed by hand; write {use}')
    return problems


# ---------------------------------------------------------------- product wordmark
def wordmark_parts(p):
    """The two halves of a product name: 'Lucent' and the product's own word.
    A product file can set wordmark: {lead, tail} if its name splits differently."""
    wm = p.get('wordmark') or {}
    name = p['name']
    lead = wm.get('lead', 'Lucent' if name.startswith('Lucent') and len(name) > 6 else '')
    tail = wm.get('tail', name[len(lead):])
    return lead, tail


def wordmark_html(p, variant='light', cls=''):
    """The product wordmark. variant: light (on white or light backgrounds) or
    dark (on navy and other dark surfaces). No space between the halves, so the
    accessible name is the full product name."""
    if variant not in ('light', 'dark'):
        raise ValueError(f'wordmark variant must be light or dark, not {variant!r}')
    lead, tail = wordmark_parts(p)
    accent = p.get('accent') if p.get('accent') in ('signal', 'albedo') else 'neutral'
    extra = f' {cls}' if cls else ''
    lead_html = f'<span class="wm-lead">{escape(lead)}</span>' if lead else ''
    return Markup(f'<span class="wm wm-{variant} wm-{accent}{extra}" translate="no">{lead_html}<span class="wm-tail">{escape(tail)}</span></span>')


def footer_columns(data):
    """The footer as data. The HTML footer and nav.json are both made from this,
    so anything that builds its own footer gets exactly the same links."""
    cols = []
    products = data['products']
    signin = next((p for p in products if (p.get('destinations') or {}).get('sign_in')), None)
    for c in data['site']['footer']['columns']:
        links = []
        if c.get('products'):
            for p in products:
                d = p['destinations']
                links.append({'label': p['name'], 'href': d.get('detail_page') or d['section'], 'kind': 'product', 'product': p['id']})
            for p in products:
                d = p['destinations']
                if d.get('try'):
                    links.append({'label': d.get('try_label') or 'Try ' + p['name'], 'href': d['try'], 'kind': 'try', 'product': p['id']})
            if signin:
                links.append({'label': 'Sign in to ' + signin['name'], 'href': signin['destinations']['sign_in'], 'kind': 'sign_in', 'product': signin['id']})
        for l in c.get('links') or []:
            if not l.get('requires') or l['requires'] in data['live_sections']:
                links.append({'label': l['label'], 'href': l['href'], 'kind': 'link', 'same_tab': bool(l.get('same_tab'))})
        cols.append({'heading': c['heading'], 'links': links})
    return cols


# ---------------------------------------------------------------- content
# Article blocks the template can show (templates/pages/article.html), each with
# the fields it needs. The live blog's renderer has the same vocabulary (see
# docs/SHARED-DESIGN.md); anything else stops the build instead of vanishing.
ARTICLE_BLOCKS = {
    'p': (), 'h2': (), 'h3': (), 'quick_answer': (), 'ol': (), 'ul': (), 'qa': (), 'tools': (),
    'callout': ('label', 'text'), 'quote': ('text',), 'table': ('caption', 'head', 'rows'),
    'checklist': ('heading', 'items'), 'image': ('src', 'widths', 'width', 'height'),
    'video': ('src', 'title'), 'cta': ('heading', 'text'),
}
VIDEO_HOSTS = ('https://www.youtube-nocookie.com/embed/', 'https://www.youtube.com/embed/', 'https://player.vimeo.com/video/')


def image_file(im):
    """The file for an image record: the largest listed size (<name>-<width>.jpg), or src itself."""
    src = str(im.get('src') or '')
    widths = im.get('widths') or []
    if widths and '.' in src and not src.startswith(EXTERNAL):
        base, ext = src.rsplit('.', 1)
        return f'{base}-{max(widths)}.{ext}'
    return src


def check_image_record(im, where, problems):
    for key in ('src', 'widths', 'width', 'height'):
        if not im.get(key):
            problems.append(f'{where} needs "{key}"')
    if not (im.get('alt') or im.get('decorative')):
        problems.append(f'{where} needs "alt" (what it shows) or "decorative: true"')
    src = str(im.get('src') or '')
    if '.' in src and not src.startswith(EXTERNAL):
        base, ext = src.rsplit('.', 1)
        for w in im.get('widths') or []:
            if not os.path.isfile(os.path.join(ROOT, f'{base}-{w}.{ext}')):
                problems.append(f'{where}: the {w}px size "{base}-{w}.{ext}" is missing')


def check_article(post, problems):
    """Every block of an article must be one the template shows, with the fields it needs."""
    where = f'content/blog/posts/{post["slug"]}.yaml'
    if post.get('hero'):
        check_image_record(post['hero'], f'{where}: hero', problems)
    for i, blk in enumerate(post.get('body') or [], 1):
        if not isinstance(blk, dict) or len(blk) != 1:
            problems.append(f'{where}: block {i} must have exactly one type ({", ".join(ARTICLE_BLOCKS)})')
            continue
        kind, val = next(iter(blk.items()))
        if kind not in ARTICLE_BLOCKS:
            problems.append(f'{where}: block {i} is "{kind}", which the article template doesn\'t show; '
                            f'use one of {", ".join(ARTICLE_BLOCKS)}, or add it to the template first')
            continue
        for k in ARTICLE_BLOCKS[kind]:
            if not isinstance(val, dict) or not val.get(k):
                problems.append(f'{where}: block {i} ({kind}) needs "{k}"')
        if kind == 'image' and isinstance(val, dict):
            check_image_record(val, f'{where}: block {i} (image)', problems)
        if kind == 'video' and isinstance(val, dict) and not str(val.get('src', '')).startswith(VIDEO_HOSTS):
            problems.append(f'{where}: block {i} (video) must embed from {", ".join(VIDEO_HOSTS)}')
        if kind == 'tools':
            for j, t in enumerate(val or [], 1):
                for k in ('name', 'best_for', 'text', 'pros', 'cons'):
                    if not t.get(k):
                        problems.append(f'{where}: block {i} (tools), card {j} needs "{k}"')


def check_example_images(examples, problems):
    """An example's photo is optional, but a photo that is there must be complete:
    every size on disk, its dimensions (so its space is reserved), what it
    shows (or decorative: true) and where it came from, with its licence."""
    for ex in (examples or {}).get('items') or []:
        im = ex.get('image')
        if not im:
            continue
        where = f'content/examples.yaml: {ex.get("id")} image'
        for key in ('src', 'widths', 'width', 'height', 'licence'):
            if not im.get(key):
                problems.append(f'{where} needs "{key}"')
        if not (im.get('alt') or im.get('decorative')):
            problems.append(f'{where} needs "alt" (what it shows) or "decorative: true"')
        if not (im.get('source') or im.get('credit')):
            problems.append(f'{where} needs "source" or "credit" (where the photo came from)')
        src = str(im.get('src') or '')
        if '.' in src:
            base, ext = src.rsplit('.', 1)
            for w in im.get('widths') or []:
                if not os.path.isfile(os.path.join(ROOT, f'{base}-{w}.{ext}')):
                    problems.append(f'{where}: the {w}px size "{base}-{w}.{ext}" is missing')


def collect():
    problems = []
    site = load('content/site.yaml')
    raw_products = [(os.path.relpath(p, ROOT), load(os.path.relpath(p, ROOT))) for p in sorted(glob.glob(os.path.join(ROOT, 'content/products/*.yaml')))]
    # Facts come from the product records; a fact may itself quote another fact
    facts = {}
    for _, p in raw_products:
        facts.update(product_facts(p))
    for _ in range(5):
        changed = False
        for k, v in facts.items():
            nv = FACT_RE.sub(lambda m: facts.get(m.group(1), m.group(0)), v)
            if nv != v:
                facts[k], changed = nv, True
        if not changed:
            break
    products = [resolve_facts(p, facts, path, problems) for path, p in raw_products]
    products.sort(key=lambda p: p.get('order', 99))
    site = resolve_facts(site, facts, 'content/site.yaml', problems)
    examples = resolve_facts(load('content/examples.yaml'), facts, 'content/examples.yaml', problems)
    check_example_images(examples, problems)
    clients = load('content/clients.yaml') or {}
    approved = [c for c in (clients.get('items') or []) if c.get('approved')]
    clients_live = bool(clients.get('enabled')) and bool(approved)
    live_sections = {'clients'} if clients_live else set()
    nav = [n for n in site['nav'] if not n.get('requires') or n['requires'] in live_sections]

    # Contact topics: the three services, then any product with its own topic, then "not sure"
    topics = [dict(t) for t in site['form'].get('topics', [])]
    keys = {t['key'] for t in topics}
    for p in products:
        d = p.get('destinations') or {}
        if d.get('contact_topic') and d['contact_topic'] not in keys:
            topics.append({'key': d['contact_topic'], 'label': d.get('contact_topic_label') or p['name']})
            keys.add(d['contact_topic'])
    topics.append({'key': 'unsure', 'label': site['form']['unsure_topic']})

    f = site['form']
    delivery = f.get('delivery') or {}
    js_text = {
        'errors': f['errors'], 'summary_one': f['summary_one'], 'summary_many': f['summary_many'],
        'done_title': f['done_title'], 'done_text': f['done_text'], 'send': f['send_label'],
        'sending': f['sending_label'], 'sending_status': f.get('sending_status', 'Sending your message'),
        'retry': f['retry_label'], 'error_preview': f['error_preview'], 'error_preview_on': f['error_preview_on'],
        'close': site['header']['close_label'],
        'delivery': {'to': delivery.get('to', ''), 'endpoint': delivery.get('endpoint', ''),
                     'enabled': delivery.get('enabled', False) is True,
                     'simulated': delivery.get('simulated', True) is not False},
    }

    pages = {}
    for path in sorted(glob.glob(os.path.join(ROOT, 'content/pages/*.yaml'))):
        if os.path.basename(path).startswith('_'):
            continue
        page = resolve_facts(load(os.path.relpath(path, ROOT)), facts, os.path.relpath(path, ROOT), problems)
        page.setdefault('slug', os.path.splitext(os.path.basename(path))[0])
        page.setdefault('url', '/' if page['slug'] == 'index' else '/' + page['slug'])
        page.setdefault('property', 'site')
        page['ids'] = {('top' if s.get('type') in ('hero', 'page_hero') else s.get('id')) for s in page.get('sections', [])} - {None}
        page['ids'] |= {c.get('id') for s in page.get('sections', []) for c in (s.get('chapters') or []) if c.get('id')}
        page['ids'] |= set(page.get('extra_ids') or [])
        pages[page['slug']] = page

    # The blog: an index page and one page per article that has a body
    blog = load('content/blog/blog.yaml') if os.path.isfile(os.path.join(ROOT, 'content/blog/blog.yaml')) else None
    blog = resolve_facts(blog, facts, 'content/blog/blog.yaml', problems) if blog else None
    posts = []
    if blog:
        for path in sorted(glob.glob(os.path.join(ROOT, 'content/blog/posts/*.yaml'))):
            if os.path.basename(path).startswith('_'):
                continue
            post = resolve_facts(load(os.path.relpath(path, ROOT)), facts, os.path.relpath(path, ROOT), problems)
            post.setdefault('slug', os.path.splitext(os.path.basename(path))[0])
            post['url'] = blog['base_url'].rstrip('/') + '/' + post['slug']
            posts.append(post)
        posts.sort(key=lambda p: str(p.get('date', '')), reverse=True)
        pages['blog'] = {'slug': 'blog', 'url': blog['base_url'], 'property': 'blog', 'template': 'pages/blog-index.html',
                         'title': blog['title'], 'seo_title': blog.get('seo_title'), 'description': blog.get('description', ''),
                         'nav_current': 'blog', 'blog': blog, 'ids': {'top', 'articles'}}
        for post in posts:
            if not post.get('body'):
                continue
            check_article(post, problems)
            ids = {'top', 'related'} | {slugify(b['h2']) for b in post['body'] if isinstance(b, dict) and 'h2' in b}
            pages['blog-' + post['slug']] = {
                'slug': 'blog-' + post['slug'], 'url': post['url'], 'property': 'blog', 'template': 'pages/article.html',
                'title': post['title'], 'seo_title': post.get('seo_title') or post['title'], 'description': post.get('description', ''),
                'nav_current': 'blog', 'post': post, 'blog': blog, 'imported': post.get('imported', False), 'ids': ids}
    data = {
        'site': site, 'products': products, 'products_by_id': {p['id']: p for p in products},
        'examples': examples, 'clients': clients, 'clients_live': clients_live, 'live_sections': live_sections,
        'nav': nav, 'topics': topics, 'js_text': js_text, 'year': datetime.date.today().year,
        'simulated': js_text['delivery']['simulated'], 'delivery': delivery, 'pages': pages,
        'posts': posts, 'blog': blog, 'facts': facts, 'problems': problems,
    }
    data['footer_columns'] = footer_columns(data)
    return data


# ---------------------------------------------------------------- links and assets
class Build:
    """Turns content links into real addresses.

    mode files     review build: index.html, lucentalbedo.html ... Links to the
                   public address of any page built here (the blog index, each
                   article with a body, the sign-in design) open the local
                   design instead, so every link in the review set can be followed
    mode clean     production: each page's url (/, /lucentalbedo ...)
    mode absolute  the shared export: full https:// addresses on lucentstar.ai
    """

    def __init__(self, data, mode=None):
        self.data = data
        self.mode = mode or data['site'].get('url_mode', 'files')
        self.base = data['site'].get('production_url', 'https://lucentstar.ai').rstrip('/')
        # Public address of every page built here that lives on another site
        self.local = {}
        for slug, pg in data['pages'].items():
            u = str(pg.get('url') or '')
            if u.startswith(('http://', 'https://')):
                self.local[u] = slug
                self.local[u.rstrip('/')] = slug
        self.problems = []
        self.assets = set()
        # Which properties use each file ('site', 'blog', 'app'), so a production
        # build copies the blog's photos with the blog designs, not onto lucentstar.ai
        self.asset_props = {}

    def page_url(self, slug):
        page = self.data['pages'][slug]
        if self.mode == 'files':
            return 'index.html' if slug == 'index' else slug + '.html'
        url = page['url']
        if self.mode == 'absolute' and not url.startswith(EXTERNAL):
            return self.base + url
        return url

    def resolve(self, target, cur):
        """Turn a content link into a real address for the page being built."""
        if not target:
            return ''
        if target.startswith(EXTERNAL):
            base, hash_, anchor = target.partition('#')
            if self.mode == 'files' and base in self.local:
                return self.page_url(self.local[base]) + (hash_ + anchor if anchor else '')
            return target
        pages = self.data['pages']
        if target == '@contact':
            target = '#contact' if cur in pages and 'contact' in pages[cur]['ids'] else 'index#contact'
        if target.startswith('#'):
            return target
        slug, _, anchor = target.partition('#')
        if slug not in pages:
            self.problems.append(f'{cur}: link to unknown page "{slug}"')
            return target
        if slug == cur:
            return '#' + (anchor or 'top')
        url = self.page_url(slug)
        if anchor == 'top' and self.mode != 'files':
            return url
        return url + ('#' + anchor if anchor else '')

    def asset(self, path, cur):
        """Register a local file (image, logo) so it is copied into the built site."""
        if not path or str(path).startswith(EXTERNAL + ('data:',)):
            return path
        path = str(path).lstrip('/')
        if not os.path.isfile(os.path.join(ROOT, path)):
            self.problems.append(f'{cur}: missing asset "{path}"')
        self.assets.add(path)
        self.asset_props.setdefault(path, set()).add(self.data['pages'].get(cur, {}).get('property', 'site'))
        if self.mode == 'absolute':
            return self.base + '/' + path
        return ('/' + path) if self.mode == 'clean' else path


def make_env(b):
    e = Environment(loader=FileSystemLoader(os.path.join(ROOT, 'templates')), autoescape=select_autoescape(['html']),
                    trim_blocks=True, lstrip_blocks=True)

    @pass_context
    def link(ctx, target):
        return b.resolve(target, ctx['page']['slug'])

    @pass_context
    def asset(ctx, path):
        return b.asset(path, ctx['page']['slug'])

    @pass_context
    def inline(ctx, text):
        # *emphasis*, **bold** and [label](target) inside content strings
        if text is None:
            return ''
        s = str(escape(str(text)))

        def a(m):
            href = b.resolve(htmllib.unescape(m.group(2)), ctx['page']['slug'])
            ext = ' target="_blank" rel="noopener"' if is_newtab(href) else ''
            return '<a class="ilink" href="%s"%s>%s</a>' % (escape(href), ext, m.group(1))
        s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', a, s)
        s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
        s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<span class="em">\1</span>', s)

        def wm(m):
            p = b.data['products_by_id'].get(m.group(1))
            if not p:
                b.problems.append(f'{ctx["page"]["slug"]}: wordmark for unknown product "{m.group(1)}"')
                return m.group(0)
            return str(wordmark_html(p, m.group(2) or 'light'))
        s = WORDMARK_RE.sub(wm, s)
        return Markup(s)

    def wordmark(p, variant='light', cls=''):
        """{{ wordmark(product) }} or {{ wordmark('signal', 'dark') }}"""
        if isinstance(p, str):
            p = b.data['products_by_id'][p]
        return wordmark_html(p, variant, cls)

    def nl2br(text):
        return Markup('<br>'.join(str(escape(line)) for line in str(text).split('\n')))

    def is_external(href):
        return str(href).startswith(EXTERNAL)

    own = tuple(b.data['site'].get('same_tab_prefixes') or ())

    def is_newtab(href):
        """External addresses open in a new tab, except LucentStar's own sites."""
        return str(href).startswith(EXTERNAL) and not str(href).startswith(own)

    def date_long(value):
        try:
            d = value if isinstance(value, datetime.date) else datetime.date.fromisoformat(str(value))
            return f'{d.day} {d.strftime("%B %Y")}'
        except ValueError:
            return str(value)

    e.globals.update(link=link, asset=asset, wordmark=wordmark)
    e.filters.update(inline=inline, nl2br=nl2br, slugify=slugify, date_long=date_long)
    e.tests['external'] = is_external
    e.tests['newtab'] = is_newtab
    return e


# ---------------------------------------------------------------- checks
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'use', 'path', 'circle', 'rect'}


class Scan(HTMLParser):
    """Collects what the checks need from a built page. Text inside an element
    marked data-voice="reader" (a reader's own question, such as "Can I export
    my posts?") is kept apart from LucentStar's own copy for the first-person check."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.hrefs, self.imgs, self.text, self.skip = [], [], [], [], 0
        self.reader_text, self.stack = [], []
        self.imgs_no_alt, self.blank_no_rel = 0, 0

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'title'):
            self.skip -= 1
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag not in VOID:
            self.stack.append((tag, a.get('data-voice') == 'reader'))
        if tag in ('script', 'style', 'title'):
            self.skip += 1
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'a' and a.get('href'):
            self.hrefs.append(a['href'])
        if tag == 'img':
            self.imgs.append(a.get('src', ''))
            if 'alt' not in a:
                self.imgs_no_alt += 1
        if tag == 'a' and a.get('target') == '_blank' and 'noopener' not in (a.get('rel') or ''):
            self.blank_no_rel += 1
        for k in ('aria-label', 'alt', 'title', 'placeholder'):
            if a.get(k):
                self.text.append(a[k])

    def handle_data(self, data):
        if not self.skip:
            (self.reader_text if any(r for _, r in self.stack) else self.text).append(data)


def check_copy(label, text):
    problems = []
    for m in re.finditer('—', text):
        problems.append(f'{label}: em dash near "{text[max(0, m.start() - 30):m.start() + 30]}"')
    for m in re.finditer(r'\s–\s', text):
        problems.append(f'{label}: spaced en dash used as a dash near "{text[max(0, m.start() - 30):m.start() + 30]}"')
    low = text.lower()
    for w in BANNED:
        for m in re.finditer(r'\b' + re.escape(w), low):
            problems.append(f'{label}: banned word "{w}" near "{text[max(0, m.start() - 30):m.start() + 40]}"')
    return problems


def check_site_words(label, text):
    problems = []
    for w in SITE_WORDS:
        for m in re.finditer(r'\b' + re.escape(w) + r'\b', text, re.I):
            problems.append(f'{label}: the word "{m.group(0)}" near "{text[max(0, m.start() - 30):m.start() + 30]}" is ruled out of site copy')
    return problems


def check_sources():
    problems = []
    files = (glob.glob(os.path.join(ROOT, 'content/**/*.yaml'), recursive=True)
             + glob.glob(os.path.join(ROOT, 'templates/**/*.html'), recursive=True)
             + glob.glob(os.path.join(ROOT, 'docs/*.md')) + [os.path.join(ROOT, 'README.md')])
    for path in files:
        if os.path.isfile(path):
            with open(path, encoding='utf-8') as f:
                text = f.read()
            if path.endswith('.md'):
                # Guides list the banned words on purpose; skip lines that name several of them
                text = '\n'.join(l for l in text.split('\n') if sum(w in l.lower() for w in BANNED) < 3)
            problems += check_copy(os.path.relpath(path, ROOT), text)
            if not path.endswith('.md'):
                problems += check_site_words(os.path.relpath(path, ROOT), text)
    return problems


def check_pages(scans, b, imported):
    problems = []
    ids_by_file = {os.path.basename(k): set(v.ids) for k, v in scans.items()}
    for name, sc in scans.items():
        visible = ' '.join(sc.text)
        problems += check_copy(name + ' (visible text)', visible + ' ' + ' '.join(sc.reader_text))
        problems += check_site_words(name + ' (visible text)', visible + ' ' + ' '.join(sc.reader_text))
        for m in re.finditer(r'\{\{[^}]*\}\}', visible + ' ' + ' '.join(sc.reader_text)):
            problems.append(f'{name}: placeholder left in the page: "{m.group(0)}"')
        if name not in imported:
            for m in re.finditer(r"\b(I|I'm|I’m|I've|I’ve|I'll|I’ll|I'd|I’d|[Mm]y|[Mm]ine|[Mm]e)\b", visible):
                problems.append(f'{name}: first-person singular "{m.group(0)}" near "{visible[max(0, m.start() - 30):m.start() + 30]}"')
        if b.mode == 'files':
            for h in sc.hrefs:
                if h.partition('#')[0] in b.local:
                    problems.append(f'{name}: links to the public address {h}, but that page is built here; the review build should open {b.page_url(b.local[h.partition("#")[0]])}')
        seen, dups = set(), set()
        for i in sc.ids:
            (dups if i in seen else seen).add(i)
        problems += [f'{name}: duplicate id "{d}"' for d in sorted(dups)]
        for h in sc.hrefs:
            if h.startswith(EXTERNAL) or h.startswith('data:'):
                continue
            page, _, anchor = h.partition('#')
            if page and b.mode == 'files':
                if page not in ids_by_file:
                    problems.append(f'{name}: link to missing page "{page}"')
                    continue
                target_ids = ids_by_file[page]
            elif page:
                continue  # clean addresses are checked on the hosting side
            else:
                target_ids = seen
            if anchor and anchor not in target_ids and not anchor.startswith('for-'):
                problems.append(f'{name}: link to missing section "{h}"')
        for src in sc.imgs:
            if src and not src.startswith(EXTERNAL + ('data:',)) and not os.path.isfile(os.path.join(DIST, 'site', src.lstrip('/'))):
                problems.append(f'{name}: image "{src}" is not in the built site')
        if sc.imgs_no_alt:
            problems.append(f'{name}: {sc.imgs_no_alt} image(s) without alt text')
        if sc.blank_no_rel:
            problems.append(f'{name}: {sc.blank_no_rel} new-tab link(s) without rel="noopener"')
    return problems


def check_mockups(data):
    """Product screens show example data, but their labels must match the product's facts."""
    problems = []
    for p in data['products']:
        app = (p.get('showcase_content') or {}).get('app') or {}
        styles = [s['name'] for s in p.get('styles') or []]
        if app.get('style_on') and styles and app['style_on'] not in styles:
            problems.append(f'{p["id"]}: the example screen selects the style "{app["style_on"]}", which is not one of {styles}')
        dims = (p.get('scoring') or {}).get('dimensions') or []
        shown = [d['name'] for d in app.get('dimensions') or []]
        if shown and dims and shown != dims:
            problems.append(f'{p["id"]}: the example screen scores {shown}, but the product scores {dims}')
        ex = [d['name'] for d in ((p.get('scoring') or {}).get('example') or {}).get('dimensions') or []]
        if ex and dims and ex != dims:
            problems.append(f'{p["id"]}: the scoring example uses {ex}, but the product scores {dims}')
    return problems


def check_forms(data):
    """A live form must have somewhere to send to."""
    d = data['delivery']
    if d.get('simulated', True) is False and not str(d.get('endpoint') or '').strip():
        return ('content/site.yaml: form.delivery.simulated is false but form.delivery.endpoint is empty. '
                'Set the endpoint of a tested form service, or keep simulated: true.')
    return None


# ---------------------------------------------------------------- build
def read_all(pattern, exclude=(), only=None):
    out = []
    names = only if only is not None else [os.path.basename(p) for p in sorted(glob.glob(os.path.join(ROOT, pattern)))]
    folder = os.path.dirname(pattern)
    for name in names:
        if name in exclude:
            continue
        with open(os.path.join(ROOT, folder, name), encoding='utf-8') as f:
            out.append(f.read().strip())
    return '\n'.join(out)


def html_page(title, desc, styles, body, scripts, body_class='', head=''):
    cls = f' class="{body_class}"' if body_class else ''
    return ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<meta name="description" content="{htmllib.escape(desc or "", quote=True)}">\n<title>{htmllib.escape(title)}</title>\n'
            + head + styles + f'</head>\n<body{cls}>\n' + body + scripts + '</body>\n</html>\n')


# ---------------------------------------------------------------- metadata
def plain(text, data):
    """Content text without inline markup, for metadata and structured data."""
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'\1', str(text))
    s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'\1', s)
    return WORDMARK_RE.sub(lambda m: data['products_by_id'][m.group(1)]['name'] if m.group(1) in data['products_by_id'] else m.group(0), s)


def public_url(page, data):
    u = str(page.get('url') or '')
    return u if u.startswith(EXTERNAL) else data['site'].get('production_url', 'https://lucentstar.ai').rstrip('/') + u


def structured_data(page, data):
    """Search engine data made from the same content as the page, so it can't
    drift: organization, software (product and prices from the product file),
    faq (the page's questions), and Article plus FAQPage for blog articles."""
    site = data['site']
    base = site.get('production_url', 'https://lucentstar.ai').rstrip('/')
    brand = site['brand']['name'] + ' ' + site['brand']['suffix']
    org_id = base + '/#org'
    kinds = page.get('structured_data') or []
    graph = []
    if 'organization' in kinds:
        org = {'@type': 'Organization', '@id': org_id, 'name': brand, 'url': base + '/', 'email': site['contact']['email']}
        if (site.get('organization') or {}).get('founding_location'):
            org['foundingLocation'] = {'@type': 'Place', 'name': site['organization']['founding_location']}
        graph.append(org)
    if 'software' in kinds:
        p = data['products_by_id'][page['product']]
        sch = p.get('schema') or {}
        app = {'@type': 'SoftwareApplication', 'name': p['name'], 'url': public_url(page, data),
               'applicationCategory': sch.get('category', 'BusinessApplication'), 'operatingSystem': sch.get('os', 'Web'),
               'publisher': {'@id': org_id}}
        if sch.get('description'):
            app['description'] = plain(sch['description'], data)
        offers = [{'@type': 'Offer', 'name': pl['name'], 'price': re.sub(r'[^\d.]', '', str(pl['price'])), 'priceCurrency': sch.get('currency', 'GBP')}
                  for pl in p.get('plans') or [] if re.sub(r'[^\d.]', '', str(pl.get('price') or ''))]
        if offers:
            app['offers'] = offers
        graph.append(app)
    qa = []
    if 'faq' in kinds:
        qa = [it for s in page.get('sections') or [] if s.get('type') == 'faq' for it in s.get('items') or []]
    post = page.get('post')
    if post and post.get('schema'):
        sch = post['schema']
        art = {'@type': 'Article', 'headline': sch.get('headline') or post['title'], 'mainEntityOfPage': post['url'],
               'description': sch.get('description') or post.get('description'),
               'datePublished': sch.get('date_published'), 'dateModified': sch.get('date_modified'),
               'author': {'@type': 'Organization', 'name': brand, 'url': base + '/'}, 'publisher': {'@type': 'Organization', 'name': brand}}
        if post.get('hero') and not post['hero'].get('decorative'):
            art['image'] = data['blog']['base_url'].rstrip('/') + '/' + image_file(post['hero']).lstrip('/')
        graph.append({k: v for k, v in art.items() if v})
        tools = [t for blk in post.get('body') or [] if isinstance(blk, dict) and blk.get('tools') for t in blk['tools']]
        if tools:
            items = []
            for n, t in enumerate(tools, 1):
                it = {'@type': 'ListItem', 'position': n, 'name': t['name']}
                if t.get('url'):
                    it['url'] = t['url']
                items.append(it)
            graph.append({'@type': 'ItemList', 'itemListOrder': 'https://schema.org/ItemListOrderAscending',
                          'numberOfItems': len(items), 'itemListElement': items})
        qa = [it for blk in post.get('body') or [] if isinstance(blk, dict) and blk.get('qa') for it in blk['qa']]
    if qa:
        graph.append({'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': plain(it['q'], data),
                                                          'acceptedAnswer': {'@type': 'Answer', 'text': plain(it['a'], data)}} for it in qa]})
    if not graph:
        return ''
    text = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, indent=1).replace('</', '<\\/')
    return f'<script type="application/ld+json">\n{text}\n</script>\n'


def head_meta(page, data, title, desc):
    """Canonical address (kept from the live site), social tags for the blog,
    structured data, and noindex for pages that must never be indexed."""
    out = '''<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="icon" href="/assets/favicon.ico"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">\n'''
    prop = page.get('property', 'site')
    if page.get('noindex'):
        out += '<meta name="robots" content="noindex">\n'
    elif prop in ('site', 'blog'):
        out += f'<link rel="canonical" href="{htmllib.escape(public_url(page, data), quote=True)}">\n'
    if prop == 'blog':
        og = {'og:type': 'article' if page.get('post') else 'website', 'og:title': title, 'og:description': desc, 'og:url': public_url(page, data)}
        post = page.get('post') or {}
        social = post.get('social_image') or post.get('hero')
        img = None
        if social and social.get('src') and not social.get('decorative'):
            src = image_file(social)
            img = src if src.startswith(EXTERNAL) else data['blog']['base_url'].rstrip('/') + '/' + src.lstrip('/')
            og['og:image'] = img
            og['og:image:alt'] = social.get('alt', '')
        out += ''.join(f'<meta property="{k}" content="{htmllib.escape(str(v or ""), quote=True)}">\n' for k, v in og.items())
        tw = {'twitter:card': 'summary_large_image' if img else 'summary', 'twitter:title': title, 'twitter:description': desc}
        if img:
            tw['twitter:image'] = img
        out += ''.join(f'<meta name="{k}" content="{htmllib.escape(str(v or ""), quote=True)}">\n' for k, v in tw.items())
    return out + structured_data(page, data)


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


class LinkScan(HTMLParser):
    """The links in a fragment, in order: (text, href, opens a new tab, classes, inside a <nav>)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.cur, self.nav = [], None, 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'nav':
            self.nav += 1
        if tag == 'a':
            self.cur = ['', a.get('href', ''), a.get('target') == '_blank', a.get('class') or '', self.nav > 0]

    def handle_endtag(self, tag):
        if tag == 'nav':
            self.nav -= 1
        if tag == 'a' and self.cur is not None:
            self.cur[0] = re.sub(r'\s+', ' ', self.cur[0]).strip()
            self.links.append(tuple(self.cur))
            self.cur = None

    def handle_data(self, data):
        if self.cur is not None:
            self.cur[0] += data


def nav_data(data, b, version):
    """Navigation as data, for code that builds its own menus. Made from the same
    records as the generated header and footer (checked by check_nav_parity)."""
    site = data['site']
    own = tuple(site.get('same_tab_prefixes') or ())

    def entry(label, target, same_tab=False, **extra):
        href = b.resolve(target, '_shared')
        d = {'label': label, 'href': href, 'new_tab': href.startswith(EXTERNAL) and not href.startswith(own) and not same_tab}
        d.update({k: v for k, v in extra.items() if v is not None})
        return d

    products = []
    for p in data['products']:
        d = p['destinations']
        lead, tail = wordmark_parts(p)
        av = p.get('availability') or {}
        item = {'id': p['id'], 'name': p['name'],
                'wordmark': {'lead': lead, 'tail': tail, 'accent': p.get('accent') if p.get('accent') in ('signal', 'albedo') else 'neutral'},
                'status': av.get('label') if av.get('verified') else None,
                'menu_text': p.get('menu_text'), 'mobile_text': p.get('mobile_text'),
                'page': entry(d.get('menu_link_label') or site['products_menu']['item_link'], d.get('detail_page') or d['section'])}
        if d.get('try'):
            item['try'] = entry(d.get('try_label') or 'Try ' + p['name'], d['try'])
        if d.get('sign_in'):
            item['sign_in'] = entry('Sign in to ' + p['name'], d['sign_in'])
        if d.get('open'):
            item['open'] = entry(d.get('open_label') or 'Open ' + p['name'], d['open'], True)
        products.append(item)
    signin = next((p for p in data['products'] if (p.get('destinations') or {}).get('sign_in')), None)
    return {
        'version': version,
        'brand': {'name': site['brand']['name'] + ' ' + site['brand']['suffix'], 'home': b.resolve('index#top', '_shared'), 'tagline': site['brand']['tagline']},
        'nav': [{'label': n['label'], 'type': 'products', 'current_key': n.get('spy')} if n.get('type') == 'products'
                else entry(n['label'], n.get('href', ''), n.get('same_tab', False), current_key=n.get('spy')) for n in data['nav']],
        'products': products,
        'products_menu': {'help': entry(site['products_menu']['help_link'], site['products_menu']['help_href'])},
        'actions': {'sign_in': entry('Sign in', signin['destinations']['sign_in'], sr=' to ' + signin['name']) if signin else None,
                    'cta': entry(site['header']['cta_label'], site['header']['cta_href'])},
        'footer': [{'heading': c['heading'], 'links': [entry(l['label'], l['href'], l.get('same_tab', False), kind=l['kind'], product=l.get('product'))
                                                       for l in c['links']]} for c in data['footer_columns']],
        'footer_base': {'legal_name': site['brand']['legal_name'], 'registered': site['brand']['registered'], 'linkedin': site['brand']['linkedin']},
    }


def check_nav_parity(files, nav):
    """nav.json must reproduce the links of the generated footer and products menu."""
    problems = []
    ls = LinkScan()
    ls.feed(files['footer.html'])
    html_links = [(t, h, nt) for t, h, nt, _, in_nav in ls.links if in_nav]
    json_links = [(l['label'], l['href'], l['new_tab']) for c in nav['footer'] for l in c['links']]
    if html_links != json_links:
        extra = [x for x in html_links if x not in json_links][:3]
        missing = [x for x in json_links if x not in html_links][:3]
        problems.append(f'shared export: nav.json footer differs from footer.html (footer only: {extra}; nav.json only: {missing})')
    ls = LinkScan()
    ls.feed(files['header.html'])
    menu = [h for t, h, nt, cls, _ in ls.links if 'pm-item' in cls.split()]
    if menu != [p['page']['href'] for p in nav['products']]:
        problems.append(f'shared export: nav.json products differ from the header products menu ({menu})')
    return problems


def export_shared(data):
    """Header, footer, styles, scripts, navigation data and the component
    reference for the blog and the app. Nothing here is edited by hand. The
    version is the build date plus a hash of everything exported, so two
    builds with different content on the same day are told apart."""
    b = Build(data, mode='absolute')
    e = make_env(b)
    # Inside the app, links to the app itself stay in the same tab
    app_prefix = data['site'].get('app_url', 'https://signalapp.lucentstar.ai/')
    app_data = dict(data, site=dict(data['site'], same_tab_prefixes=list(data['site'].get('same_tab_prefixes') or []) + [app_prefix]))
    e_app = make_env(Build(app_data, mode='absolute'))
    V = VERSION_MARK
    files = {}
    shared_data = dict(data, site=dict(data['site'], footer=dict(data['site']['footer'], prototype_note='')))
    icons = e.get_template('partials/icons.html').render(page={'slug': '_shared'}, **data)
    for name, cur, env, d in (('header-blog.html', 'blog', e, data), ('header-app.html', 'signin', e_app, app_data),
                              ('header-app-signed-in.html', None, e_app, app_data), ('header.html', None, e, data)):
        page = {'slug': '_shared', 'nav_current': cur, 'signed_in': name == 'header-app-signed-in.html'}
        hdr = env.get_template('partials/header.html').render(page=page, **d)
        files[name] = f'<!-- LucentStar shared header, version {V}. Generated by build.py: do not edit here. -->\n' + icons + '\n' + hdr
    ftr = e.get_template('partials/footer.html').render(page={'slug': '_shared'}, **shared_data)
    files['footer.html'] = f'<!-- LucentStar shared footer, version {V}. Generated by build.py: do not edit here. -->\n' + ftr
    # For screens inside the app where the visitor is already signed in (the
    # LucentSignal welcome screen): "Open LucentSignal" instead of "Sign in"
    app_shared = dict(app_data, site=dict(app_data['site'], footer=dict(app_data['site']['footer'], prototype_note='')))
    ftr_in = e_app.get_template('partials/footer.html').render(page={'slug': '_shared', 'signed_in': True}, **app_shared)
    files['footer-signed-in.html'] = f'<!-- LucentStar shared footer for signed-in screens, version {V}. Generated by build.py: do not edit here. -->\n' + ftr_in
    files['lucentstar-shell.css'] = f'/* LucentStar shared styles, version {V}. Generated by build.py from styles/: do not edit here. */\n' + read_all('styles/*.css', only=SHARED_CSS)
    for fname, parts in SHARED_EXTRA_CSS.items():
        files[fname] = f'/* LucentStar {fname}, version {V}. Generated by build.py: do not edit here. */\n' + read_all('styles/*.css', only=parts)
    # The floating Contact us panel, for sites that want the same component
    panel = e.get_template('partials/enquiry-panel.html').render(page={'slug': '_shared'}, **data)
    files['enquiry-panel.html'] = f'<!-- LucentStar Contact us launcher and panel, version {V}. Generated by build.py: do not edit here. -->\n' + panel
    files['lucentstar-enquiry.js'] = (f'/* LucentStar enquiry forms and Contact us panel, version {V}. Load after lucentstar-shell.js. */\n'
                                      + 'window.LS_TEXT=' + json.dumps(data['js_text'], ensure_ascii=False) + ';\n' + read_all('scripts/*.js', only=['06-enquiry.js']) + '\n(function(){window.LS.remeasure()})();\n')
    files['lucentstar-mode.js'] = f'/* LucentStar reduced-motion mode, version {V}. Put it in the <head>. */\n' + read_all('scripts/*.js', only=['00-mode.js'])
    files['lucentstar-shell.js'] = (f'/* LucentStar shared behaviour, version {V}: header, menus, questions, tabs. */\n'
                                    + read_all('scripts/*.js', only=SHARED_JS) + '\n(function(){window.LS.start()})();\n')
    files['analytics-consent.js'] = read_all('scripts/*.js', only=['09-consent.js'])
    files['welcome-events.js'] = read_all('scripts/*.js', only=['10-welcome-events.js'])
    nav = nav_data(data, b, V)
    files['nav.json'] = json.dumps(nav, ensure_ascii=False, indent=2) + '\n'
    files['login-main.html'] = e_app.get_template('pages/signal-login.html').render(page=data['pages']['signal-login'], **app_data)
    files['welcome-main.html'] = e_app.get_template('pages/signal-welcome.html').render(page=data['pages']['signal-welcome'], **app_data)
    # The component reference: built only from the files above, so it shows
    # exactly what a site using the shared export gets
    ref_page = {'slug': '_shared', 'nav_current': None, 'title': 'Component reference'}
    files['reference.html'] = e.get_template('pages/reference.html').render(
        page=ref_page, version=V, ref_css=read_all('styles/*.css', only=sorted(REFERENCE_ONLY_CSS)),
        shared_css=SHARED_CSS, **shared_data)
    if os.path.isfile(os.path.join(ROOT, 'docs/SHARED-DESIGN.md')):
        with open(os.path.join(ROOT, 'docs/SHARED-DESIGN.md'), encoding='utf-8') as f:
            files['README.md'] = f'<!-- LucentStar shared design, version {V}. Copied from docs/SHARED-DESIGN.md by build.py. -->\n' + f.read()
    digest = hashlib.sha256()
    for name in sorted(files):
        digest.update(name.encode() + b'\0' + files[name].encode('utf-8') + b'\0')
    version = datetime.date.today().isoformat() + '.' + digest.hexdigest()[:10]
    out = os.path.join(DIST, 'shared')
    for name, text in files.items():
        write(os.path.join(out, name), text.replace(V, version))
    write(os.path.join(out, 'VERSION'), version + '\n')
    return b.problems + check_nav_parity(files, nav), version


def article_destinations(data, b):
    """Where each blog card leads in this build: the local design for articles
    built here, the live article otherwise. A built article must never lead to
    the live address in a review build."""
    rows, problems = [], []
    for post in data['posts']:
        dest = b.resolve(post['url'], 'blog')
        built = ('blog-' + post['slug']) in data['pages']
        expected = b.page_url('blog-' + post['slug']) if built and b.mode == 'files' else (post['url'] if b.mode == 'files' else dest)
        if dest != expected:
            problems.append(f'blog: the card for "{post["slug"]}" leads to {dest}, expected {expected}')
        rows.append(f'{post["slug"]} -> {dest}' + (' (design built here)' if built else ' (live article, not built here)'))
    return rows, problems


def build(check=False):
    data = collect()
    stop = check_forms(data)
    if stop:
        print('Stopped:', stop)
        sys.exit(1)
    b = Build(data)
    e = make_env(b)
    head_js = read_all('scripts/00-mode.js', only=['00-mode.js'])
    js = read_all('scripts/*.js', only=[os.path.basename(p) for p in sorted(glob.glob(os.path.join(ROOT, 'scripts/0[1-9]-*.js'))) if '08-previews' not in p])
    js_text = 'window.LS_TEXT=' + json.dumps(data['js_text'], ensure_ascii=False) + ';'
    shutil.rmtree(DIST, ignore_errors=True)
    os.makedirs(os.path.join(DIST, 'site'))
    os.makedirs(os.path.join(DIST, 'artifact'))
    problems = list(data['problems']) + check_sources() + check_hand_typed(data['products']) + check_mockups(data)
    for path in sorted(glob.glob(os.path.join(ROOT, 'content/**/*.yaml'), recursive=True)):
        problems += split_values(load(os.path.relpath(path, ROOT)), os.path.relpath(path, ROOT))
    rendered, imported = [], set()
    for slug, page in data['pages'].items():
        css = read_all('styles/*.css', exclude=REFERENCE_ONLY_CSS)
        body = e.get_template(page.get('template', 'pages/page.html')).render(page=page, css=css, **data)
        title = page.get('seo_title') or page['title']
        desc = page.get('description', '')
        problems += check_copy(f'{slug} (title and description)', title + ' | ' + desc)
        problems += check_site_words(f'{slug} (title and description)', title + ' | ' + desc)
        styles = f'<link rel="stylesheet" href="{FONTS}">\n<style>\n{css}\n</style>\n<script>{head_js}</script>\n'
        scripts = f'<script>{js_text}\n{js}\n</script>\n'
        body_class = ' '.join(c for c in ['theme-' + page['theme'] if page.get('theme') else ''] if c)
        full = html_page(title, desc, styles, body, scripts, body_class, head_meta(page, data, title, desc))
        fname = b.page_url(slug) if b.mode == 'files' else ('index.html' if slug == 'index' else slug + '.html')
        other_property = page.get('property', 'site') != 'site'
        if b.mode != 'files' and other_property:
            write(os.path.join(DIST, 'designs', page['property'], fname), full)
            continue
        write(os.path.join(DIST, 'site', fname), full)
        # Artifact viewer: the homepage is published without its wrapper; other pages stay complete
        art = (f'<title>{htmllib.escape(page["title"])}</title>\n' + styles + body + scripts) if slug == 'index' else full
        write(os.path.join(DIST, 'artifact', fname), art)
        rendered.append((fname, len(full.encode('utf-8')), page.get('property', 'site')))
        if page.get('imported'):
            imported.add(fname)
    copied = 0
    for rel in sorted(b.assets):
        if not os.path.isfile(os.path.join(ROOT, rel)):
            continue
        props = b.asset_props.get(rel) or {'site'}
        if b.mode == 'files':
            dests = ['site', 'artifact']
        else:
            dests = (['site', 'artifact'] if 'site' in props else []) + \
                    [os.path.join('designs', prop) for prop in sorted(props) if prop != 'site']
        for d in dests:
            dst = os.path.join(DIST, d, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(ROOT, rel), dst)
        copied += 1
    scans = {}
    for fname, _, _ in rendered:
        sc = Scan()
        with open(os.path.join(DIST, 'site', fname), encoding='utf-8') as f:
            sc.feed(f.read())
        scans[fname] = sc
    problems += b.problems + check_pages(scans, b, imported)
    dest_rows, dest_problems = article_destinations(data, b)
    problems += dest_problems
    shared_problems, version = export_shared(data)
    problems += shared_problems
    for fname, size, prop in rendered:
        note = '' if prop == 'site' else f'  (design for {prop})'
        print(f'built {fname} ({size / 1024:.0f} KB){note}')
    print(f'assets copied: {copied} of {len(b.assets)} referenced')
    print('article links:', '; '.join(dest_rows) if dest_rows else 'no articles')
    print(f'shared export: dist/shared/ version {version} (header, footer, styles, scripts, nav.json, reference.html)')
    print('clients section:', 'shown' if data['clients_live'] else 'hidden (not switched on, or no approved clients)')
    print('form delivery:', 'unavailable; email option enabled' if not data['js_text']['delivery']['enabled'] else 'endpoint configured; real inbox delivery requires separate verification')
    names = {'verified': 'verified in the live app or billing', 'source': 'checked in the app\'s source only',
             'conflict': 'in conflict with the app\'s source, to reconcile', 'owner': 'confirmed by the owner',
             'marketing': 'copied from the marketing page, not yet checked', 'design': 'written for this design, to confirm'}
    for p in data['products']:
        v = p.get('verification') or []
        for x in v:
            if x.get('status') not in names:
                problems.append(f'content/products: {p["name"]} fact "{str(x.get("fact"))[:60]}" has an unknown status "{x.get("status")}"; use one of {", ".join(names)}')
        if v:
            counts = {k: sum(1 for x in v if x.get('status') == k) for k in names}
            print(f'{p["name"]} facts ({len(v)}): ' + ', '.join(f'{n} {names[k]}' for k, n in counts.items()) + ' (verification: in its product file)')
    if problems:
        print('\nChecks found %d problem(s):' % len(problems))
        for p in problems:
            print(' -', p)
        if check:
            sys.exit(1)
    else:
        print('checks passed: copy, product facts, markup, links across pages, article links, navigation data, assets and form settings')


if __name__ == '__main__':
    build(check='--check' in sys.argv)
