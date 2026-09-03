#!/usr/bin/env python3
"""Replace legacy Voltify hex colors with theme constants / Tailwind brand classes."""
import re
from pathlib import Path

ROOT = Path('/Users/hoanghavu/myprojects/Voltify')
SRC = ROOT / 'src'

COLOR_MAP = {
    'F5A623': 'primary',
    'E09000': 'primary-hover',
    '1A3A5C': 'secondary',
    '0F2440': 'secondary-hover',
    'E8F4FD': 'tint',
    'F8FAFB': 'bg-alt',
    '1A1A1A': 'secondary-hover',
}

HEX_RE = r'[A-F0-9]{6}'

# 1) Tailwind arbitrary classes
UTILITIES = r'bg|text|border|ring|fill|stroke|from|to|via|decoration|outline|caret|shadow|placeholder:text|selection:bg|selection:text'
CLASS_RE = re.compile(
    r'\b((?:[\w-]+:)*)(' + UTILITIES + r')-\[#(' + HEX_RE + r')\](/\d+)?(?=\s|$|["\'])'
)

# 2) JSX/SVG color attributes
ATTR_RE = re.compile(
    r'\b(fill|stroke|stopColor|strokeColor|color|backgroundColor|borderColor)\s*=\s*["\']#(' + HEX_RE + r')["\']'
)

# 3) JS object property values
PROP_RE = re.compile(
    r'([a-zA-Z_$][\w$]*)\s*:\s*["\']#(' + HEX_RE + r')["\']'
)

# 4) Canvas/context assignments
CTX_RE = re.compile(
    r'\b(strokeStyle|fillStyle)\s*=\s*["\']#(' + HEX_RE + r')["\']'
)

def relative_import(file: Path) -> str:
    depth = len(file.relative_to(SRC).parts) - 1
    return ('../' * depth) + 'lib/theme'

def replace_in_file(file: Path):
    content = file.read_text(encoding='utf-8')
    original = content

    def repl_class(m):
        prefix, util, hexv, opacity = m.groups()
        name = COLOR_MAP.get(hexv)
        if not name:
            return m.group(0)
        return f'{prefix}{util}-brand-{name}{opacity or ""}'

    def repl_attr(m):
        attr, hexv = m.groups()
        name = COLOR_MAP.get(hexv)
        if not name:
            return m.group(0)
        return f'{attr}={{COLORS.{name}}}'

    def repl_value(m):
        key, hexv = m.groups()
        name = COLOR_MAP.get(hexv)
        if not name:
            return m.group(0)
        return f'{key}: COLORS.{name}'

    def repl_ctx(m):
        var, hexv = m.groups()
        name = COLOR_MAP.get(hexv)
        if not name:
            return m.group(0)
        return f'{var}=COLORS.{name}'

    content = CLASS_RE.sub(repl_class, content)
    content = ATTR_RE.sub(repl_attr, content)
    content = PROP_RE.sub(repl_value, content)
    content = CTX_RE.sub(repl_ctx, content)

    if content != original:
        if 'COLORS.' in content and not re.search(r"import\s*\{\s*COLORS\s*\}\s*from\s*['\"]", content):
            imp = f"import {{ COLORS }} from '{relative_import(file)}';\n"
            content = imp + content
        file.write_text(content, encoding='utf-8')
        return True
    return False

# Process all .ts/.tsx except theme/branding constants
for f in sorted(SRC.rglob('*.ts*')):
    if f.name in ('theme.ts', 'branding.ts'):
        continue
    if 'node_modules' in f.parts:
        continue
    replace_in_file(f)

# Also process App.css with CSS variables
app_css = SRC / 'App.css'
if app_css.exists():
    css = app_css.read_text(encoding='utf-8')
    css_orig = css
    css = re.sub(r'#F5A623', 'rgb(var(--color-primary))', css)
    css = re.sub(r'#E09000', 'rgb(var(--color-primary-hover))', css)
    css = re.sub(r'#1A3A5C', 'rgb(var(--color-secondary))', css)
    css = re.sub(r'#0F2440', 'rgb(var(--color-secondary-hover))', css)
    css = re.sub(r'#E8F4FD', 'rgb(var(--color-tint))', css)
    css = re.sub(r'#F8FAFB', 'rgb(var(--color-bg-alt))', css)
    css = re.sub(r'#1A1A1A', 'rgb(var(--color-secondary-hover))', css)
    if css != css_orig:
        app_css.write_text(css, encoding='utf-8')

print('Done.')
