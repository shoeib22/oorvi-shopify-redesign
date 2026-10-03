"""Download the open-source Google Fonts used by this theme for local hosting."""
import hashlib
import re
from pathlib import Path
from urllib.request import Request, urlopen

root = Path(__file__).resolve().parent.parent
url = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bodoni+Moda:ital,wght@0,500;1,500&display=swap'
request = Request(url, headers={'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
css = urlopen(request).read().decode()
assets = {}
for source in re.findall(r'url\((https://[^)]+)\)', css):
    if source not in assets:
        name = 'oorvi-font-' + hashlib.sha256(source.encode()).hexdigest()[:12] + '.woff2'
        (root / 'assets' / name).write_bytes(urlopen(source).read())
        assets[source] = name
    css = css.replace(source, assets[source])
(root / 'assets/oorvi-fonts.css').write_text(css, encoding='utf-8')
for folder, name in [('dmsans', 'DM-Sans'), ('bodonimoda', 'Bodoni-Moda')]:
    license_url = f'https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/OFL.txt'
    (root / 'assets' / f'OFL-{name}.txt').write_bytes(urlopen(license_url).read())
print(f'Vendored {len(assets)} font files and both Open Font Licenses.')
