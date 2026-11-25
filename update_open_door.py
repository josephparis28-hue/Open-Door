"""Run from the church project: python -X utf8 update_open_door.py
Builds and validates a temporary copy before replacing any project files.
"""
from pathlib import Path
import os, re, shutil, subprocess, tempfile, sys, datetime

ROOT = Path.cwd()
ART = {
    'about': ['set-1-throne-room-scene.webp', 'set-2-throne-room.webp'],
    'beliefs': ['set-1-holy-spirit-scene.webp', 'set-2-holy-spirit.webp', 'set-2-cross.webp'],
    'vision': ['set-2-spiritual-warfare.webp', 'set-2-kingdom-authority.webp', 'set-2-purpose.webp'],
    'ministries': ['set-2-kingdom-living.webp', 'set-2-holy-spirit-scene.webp'],
    'events': ['set-2-worship.webp'],
    'sermons': ['set-2-living-word-scene.webp', 'set-2-living-word.webp'],
    'visit': ['set-1-kingdom-gates-scene.webp'],
    'giving': ['set-2-cross.webp'],
    'contact': ['set-2-holy-spirit-scene.webp', 'set-2-throne-room-scene.webp'],
}
MARK = '// BEGIN PORTABLE KINGDOM ARTWORK'
CSS_MARK = '/* BEGIN PORTABLE KINGDOM ARTWORK */'

def replace_once(s, old, new):
    if s.count(old) != 1:
        raise ValueError('Expected exactly one occurrence: ' + old[:100])
    return s.replace(old, new, 1)

def run(*args, cwd, env=None):
    subprocess.run(args, cwd=cwd, env=env, check=True)

def main():
    for name in ('script.js', 'build-seo.js', 'styles.css', 'README.md', 'seo-pages.json', 'validate.py', 'format-html.py', '404.html'):
        if not (ROOT / name).is_file():
            raise ValueError('Open the project root first. Missing: ' + name)
    for files in ART.values():
        for name in files:
            if not (ROOT / 'assets/images/kingdom' / name).is_file():
                raise ValueError('Missing artwork: ' + name)
    with tempfile.TemporaryDirectory(prefix='open-door-') as tmp:
        stage = Path(tmp) / 'site'
        shutil.copytree(ROOT, stage, ignore=shutil.ignore_patterns('.git', 'node_modules', '__pycache__', '.venv', 'update_open_door.py'))
        def read(name): return (stage / name).read_text(encoding='utf-8')
        def write(name, value): (stage / name).write_text(value, encoding='utf-8')
        s = read('script.js')
        if MARK in s: raise ValueError('Artwork update already installed.')
        import json
        config = json.dumps(ART, indent=4)
        block = MARK + '\nconst KINGDOM_PAGE_ART = ' + config + ';\n\n' + '''function kingdomPageArtwork(page) {
    const files = KINGDOM_PAGE_ART[page] || [];
    if (!files.length) return "";
    return `<div class="kingdom-page-art" aria-hidden="true">
        ${files.map((file) => `<div class="kingdom-page-art-frame">
            <img src="${SITE_BASE}/assets/images/kingdom/${file}" alt="" loading="lazy" decoding="async">
        </div>`).join("")}
    </div>`;
}
// END PORTABLE KINGDOM ARTWORK

'''
        s = replace_once(s, 'function scriptureSection(page) {', block + 'function scriptureSection(page) {')
        s = replace_once(s, '<div class="scripture-foundation-grid">', '${kingdomPageArtwork(page)}\n        <div class="scripture-foundation-grid">')
        write('script.js', s)
        css = read('styles.css')
        if CSS_MARK in css: raise ValueError('Artwork styles already installed.')
        write('styles.css', css + '\n\n' + CSS_MARK + '''
.kingdom-page-art {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: clamp(12px, 2vw, 24px);
    margin: 24px 0 36px;
}
.kingdom-page-art-frame {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border: 1px solid #b89a55;
    border-radius: 12px;
    background: #164c52;
    box-shadow: 0 12px 28px rgba(22, 76, 82, 0.15);
}
.kingdom-page-art-frame img {
    display: block;
    width: 100%;
    height: clamp(180px, 24vw, 320px);
    object-fit: cover;
    object-position: center;
    transition: transform 700ms ease;
}
.kingdom-page-art-frame::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 50%, rgba(22, 76, 82, 0.32));
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
    .kingdom-page-art-frame:hover img { transform: scale(1.035); }
}
/* END PORTABLE KINGDOM ARTWORK */
''')
        b = read('build-seo.js')
        b, n = re.subn(r'([\'"])https://josephparis28-hue\.github\.io\1', '""', b)
        if n != 1: raise ValueError('Expected original hosting default in build-seo.js')
        # Use a quote-independent boundary; fail explicitly if it cannot be located.
        start = b.index('vm.runInContext(')
        end = b.index('const base', start)
        b = b[:start] + '''const browserBoundary = source.search(/document\\.addEventListener\\(\\s*['"]click['"]\\s*,/);
if (browserBoundary < 0) throw Error("Cannot locate browser initialization in script.js");
vm.runInContext(
    source.slice(0, browserBoundary) +
        '\\n globalThis.staticRender = id => header(id) + `<main id="main" tabindex="-1">` + pages[id]() + `</main>` + footer(id);',
    context,
);
''' + b[end:]
        b = b.replace('conbuild-seo.jstent', 'content')
        b += '''\n// Generate the not-found link for the selected deployment path.
const notFoundPath = path.join(root, "404.html");
const notFound = fs.readFileSync(notFoundPath, "utf8");
fs.writeFileSync(notFoundPath, notFound.replace(/(<a\\s+href=")[^"]*(">Return to Open Door Church<\\/a>)/, `$1${sitePath}/$2`), "utf8");
'''
        write('build-seo.js', b)
        f = read('404.html')
        f = re.sub(r'https://josephparis28-hue\.github\.io/Open-Door/?', '/Open-Door/', f)
        write('404.html', f)
        v = read('validate.py').replace('.read_text()', ".read_text(encoding='utf-8')")
        write('validate.py', v)
        r = read('README.md')
        r = re.sub(r'\[Visit the church website\]\(https://josephparis28-hue\.github\.io/Open-Door/\) · ', '', r)
        r = re.sub(r'`git clone https://github\.com/josephparis28-hue/Open-Door\.git`', 'using the repository’s Code menu', r)
        r = re.sub(r'^Repository: <https://github\.com/josephparis28-hue/Open-Door>\s*', '', r, flags=re.M)
        r = re.sub(r'<https://josephparis28-hue\.github\.io/Open-Door/>', 'the URL shown in Settings → Pages', r)
        r = re.sub(r'^The current sitemap is .*$', 'A sitemap is generated only when SITE_URL is configured. Submit the resulting sitemap to Search Console if configured.', r, flags=re.M)
        r = r.replace('The default build targets the current GitHub Pages address.', 'The default build uses the /Open-Door project path without a hardcoded public hostname.')
        r = r.replace('its homepage URL must be updated manually when moving hosts.', 'its homepage link is generated from SITE_PATH.')
        r = r.replace('Manually update the home link in `404.html` to `/` for root hosting.', 'The generator updates the 404 home link from SITE_PATH.')
        r += '''\n## Portable hosting and artwork\n\nEdit `KINGDOM_PAGE_ART` in `script.js` to select decorative artwork for the Scripture sections. Existing text, photographs and banners remain in place. Rebuild after changes.\n\nNo personal hosting address is embedded by default. Without SITE_URL, absolute canonical/social URL metadata and sitemap.xml are omitted. Set SITE_URL to the actual HTTPS origin and SITE_PATH to the deployment prefix (empty for a root domain) when ready to publish domain-specific SEO. The 404 home link uses SITE_PATH; rebuild for the selected host.\n'''
        r = re.sub(r'https://(?:github\.com/|)josephparis28-hue(?:\.github\.io)?/[^\s<>`)]+', 'the configured church website or repository URL', r)
        write('README.md', r)
        env = os.environ.copy(); env.pop('SITE_URL', None); env['SITE_PATH'] = '/Open-Door'
        run('node', '--check', 'script.js', cwd=stage)
        run('node', '--check', 'build-seo.js', cwd=stage)
        run('node', 'build-seo.js', cwd=stage, env=env)
        run(sys.executable, '-X', 'utf8', 'format-html.py', cwd=stage)
        run(sys.executable, '-X', 'utf8', 'validate.py', cwd=stage, env=env)
        # Check every text source, including workflow and generated pages.
        for p in stage.rglob('*'):
            if p.is_file() and p.suffix.lower() in ('.html','.js','.css','.md','.xml','.txt','.json','.py','.yml','.yaml'):
                if 'josephparis' in p.read_text(encoding='utf-8').lower():
                    raise ValueError('Personal hosting reference remains: ' + str(p.relative_to(stage)))
        # Check current approved schedule and ensure both pages agree.
        for name in ('index.html', 'visit/index.html'):
            if '6:00 PM' not in read(name): raise ValueError('Wednesday schedule missing: ' + name)
        # Test root hosting separately, then restore project-path output.
        env['SITE_PATH'] = ''
        run('node', 'build-seo.js', cwd=stage, env=env)
        run(sys.executable, '-X', 'utf8', 'validate.py', cwd=stage, env=env)
        env['SITE_PATH'] = '/Open-Door'
        run('node', 'build-seo.js', cwd=stage, env=env)
        run(sys.executable, '-X', 'utf8', 'format-html.py', cwd=stage)
        run(sys.executable, '-X', 'utf8', 'validate.py', cwd=stage, env=env)
        names = ['script.js','build-seo.js','styles.css','README.md','validate.py','404.html','robots.txt','sitemap.xml'] + [str(p.relative_to(stage)) for p in stage.rglob('index.html')]
        backup = ROOT.parent / (ROOT.name + '-backup-' + datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
        backup.mkdir()
        for name in names:
            original = ROOT / name
            if original.exists():
                dest = backup / name; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(original, dest)
        for name in names:
            src = stage / name; dest = ROOT / name
            if src.exists(): shutil.copy2(src, dest)
            elif dest.exists(): dest.unlink()
        print('Update complete. Backup:', backup)
        print('Review changes in VS Code, preview with Live Server, then commit and push.')

if __name__ == '__main__':
    try: main()
    except Exception as exc:
        print('Update stopped:', exc, file=sys.stderr)
        sys.exit(1)
