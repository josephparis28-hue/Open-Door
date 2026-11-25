from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from html.parser import HTMLParser
import os, re
root=Path(__file__).resolve().parent
base=os.environ.get('SITE_PATH','/Open-Door')+'/'
origin='https://local.invalid'
errors=[]; count=0
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]; self.ids=set()
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        for k in ('href','src','poster'):
            if a.get(k): self.refs.append(a[k])
pages={}
for p in root.rglob('*.html'):
    parser=Parser(); parser.feed(p.read_text(encoding='utf-8')); pages[p]=parser
for p,parser in pages.items():
    for ref in parser.refs:
        u=urlsplit(urljoin(origin+base+p.relative_to(root).as_posix(),ref))
        if u.netloc!='local.invalid' or u.scheme!='https': continue
        count+=1
        if not u.path.startswith(base): errors.append(f'{p.name}: outside base {ref}'); continue
        dest=root/unquote(u.path[len(base):]); dest=dest/'index.html' if dest.is_dir() else dest
        if not dest.is_file(): errors.append(f'{p.relative_to(root)}: missing {ref}')
        elif u.fragment and dest in pages and unquote(u.fragment) not in pages[dest].ids: errors.append(f'{p.relative_to(root)}: missing anchor {ref}')
for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)',(root/'styles.css').read_text(encoding='utf-8')):
    if ref.startswith('assets/') and not (root/ref).is_file(): errors.append(f'CSS missing {ref}')
print(f'Checked {len(pages)} HTML files and {count} internal references')
if errors: raise SystemExit('\n'.join(errors))
