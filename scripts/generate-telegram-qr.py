import xml.etree.ElementTree as ET
import os

input_path = r'C:\Users\alik5\Downloads\qrcode-t.me_VetCrewHospital_+logo.svg'
output_ts_path = r'src\lib\data\telegramQrData.ts'
output_svg_path = r'static\brand\qr\telegram-qr.svg'

tree = ET.parse(input_path)
root = tree.getroot()
ns = {'svg': 'http://www.w3.org/2000/svg'}
inner_svg = root.find('.//svg:svg', ns)

modules = []
finder_rects = []
for el in inner_svg.findall('svg:rect', ns):
    w = float(el.attrib.get('width', 0))
    h = float(el.attrib.get('height', 0))
    x = float(el.attrib.get('x', 0))
    y = float(el.attrib.get('y', 0))
    rx = el.attrib.get('rx', '6.67')
    ry = el.attrib.get('ry', '6.67')
    if w == 18.0:
        if not (300 <= x <= 520 and 300 <= y <= 520):
            modules.append(f'<rect x="{x:.1f}" y="{y:.1f}" rx="6.67" ry="6.67" width="18" height="18" />')
    elif w == 60.0:
        finder_rects.append(f'<rect x="{int(x)}" y="{int(y)}" rx="20" ry="20" width="60" height="60" />')

finder_paths = []
for el in inner_svg.findall('svg:path', ns):
    d = el.attrib.get('d')
    finder_paths.append(f'<path d="{d}" fill-rule="evenodd" />')

modules_body = '\n    '.join(modules + finder_paths + finder_rects)

ts_content = f'''// Canonical Telegram QR Vector Modules (viewBox 0 0 820 820)
// Source: C:\\Users\\alik5\\Downloads\\qrcode-t.me_VetCrewHospital_+logo.svg
// Features smooth rounded finder corners (rx=28/20), rounded modules (rx=6.67),
// and the official Paper Airplane messaging icon matching the QR ink color exactly.

export const TELEGRAM_QR_VIEWBOX = '0 0 820 820';

export const TELEGRAM_QR_RAW_MODULES = `
    {modules_body}
`.trim();

/**
 * Returns QR vector group with customizable center quiet zone background (e.g. 'none' for frosted acrylic)
 * and matching ink color for the center paper-airplane messaging icon.
 */
export function renderTelegramQrModules(centerBg: string = '#FFFFFF', iconColor: string = 'currentColor'): string {{
	const bgRect =
		centerBg !== 'none'
			? `<rect x="0" y="0" width="220" height="220" rx="44" fill="${{centerBg}}" />`
			: '';
	return `
    {modules_body}
    <!-- Telegram Message (Paper Airplane) Center Badge (clean, matching QR ink color) -->
    <g class="qr-center-badge" transform="translate(300, 300)">
      ${{bgRect}}
      <g transform="translate(38, 38) scale(6)" fill="none" stroke="${{iconColor}}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </g>
    </g>
  `.trim();
}}

export const TELEGRAM_QR_MODULES = renderTelegramQrModules('#FFFFFF', '#13371B');

/**
 * Returns complete standalone Telegram QR SVG with custom ink and center background
 */
export function getTelegramQrSvg(fillColor = '#13371B', centerBg = '#FFFFFF'): string {{
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 820" width="820" height="820" fill="${{fillColor}}" color="${{fillColor}}">
  <g class="telegram-qr-modules">
    ${{renderTelegramQrModules(centerBg, fillColor)}}
  </g>
</svg>`.trim();
}}
'''

with open(output_ts_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)
print(f'Wrote {output_ts_path}')

os.makedirs(os.path.dirname(output_svg_path), exist_ok=True)
standalone_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 820" width="820" height="820" fill="#13371B" color="#13371B">
  <g class="telegram-qr-modules">
    {modules_body}
    <!-- Telegram Message (Paper Airplane) Center Badge (clean, matching QR ink color) -->
    <g class="qr-center-badge" transform="translate(300, 300)">
      <rect x="0" y="0" width="220" height="220" rx="44" fill="#FFFFFF" />
      <g transform="translate(38, 38) scale(6)" fill="none" stroke="#13371B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </g>
    </g>
  </g>
</svg>
'''
with open(output_svg_path, 'w', encoding='utf-8') as f:
    f.write(standalone_svg)
print(f'Wrote {output_svg_path}')
