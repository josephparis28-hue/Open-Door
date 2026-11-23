"""Format all generated HTML pages with readable indentation.

Run after `node build-seo.js`: `python format-html.py`.
Requires Beautiful Soup 4 (`pip install beautifulsoup4`).
"""
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
for page in sorted(ROOT.rglob('index.html')):
    if 'node_modules' in page.parts:
        continue
    source = page.read_text(encoding='utf-8')
    soup = BeautifulSoup(source, 'html.parser')
    page.write_text('<!doctype html>\n' + soup.prettify(formatter='minimal').replace('<!DOCTYPE html>\n', '').replace('<!doctype html>\n', ''), encoding='utf-8')
    print('Formatted:', page.relative_to(ROOT))
