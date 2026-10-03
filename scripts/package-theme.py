from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path.cwd();out=root/'output';out.mkdir(exist_ok=True)
with ZipFile(out/'oorvi-premium-theme.zip','w',ZIP_DEFLATED) as z:
    for folder in ['assets','config','layout','locales','sections','snippets','templates']:
        for p in sorted((root/folder).rglob('*')):
            if p.is_file():z.write(p,p.relative_to(root).as_posix())
with ZipFile(out/'oorvi-premium-theme.zip') as z:
    assert z.testzip() is None
    assert 'layout/theme.liquid' in z.namelist()
    assert 'assets/oorvi-hero-v4.webp' in z.namelist()
    assert not any(n.startswith(('node_modules/','scripts/','.claude/')) for n in z.namelist())
    print(f'Theme package verified: {len(z.namelist())} files, {(out/"oorvi-premium-theme.zip").stat().st_size/1024/1024:.1f} MB')
