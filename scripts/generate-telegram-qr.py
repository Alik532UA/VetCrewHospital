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

// Authentic Telegram vector badge paths (Source: message_telegram_512.svg, viewBox 0 0 512 512)
export const TELEGRAM_CIRCLE_PATH =
	'M256 0C114.61 0 0 114.61 0 256s114.61 256 256 256 256-114.61 256-256S397.39 0 256 0';
export const TELEGRAM_PLANE_PATH =
	'M365.32 132.19 94.4 237.77c-8.77 3.42-8.24 16.01.79 18.68l68.84 20.33 25.7 81.53c2.68 8.52 13.48 11.1 19.72 4.72l35.6-36.35 69.84 51.26c8.54 6.27 20.72 1.61 22.89-8.76l46.25-221.15c2.27-10.84-8.39-19.86-18.7-15.84Zm-33.96 49.08L205.52 292.55a6.8 6.8 0 0 0-2.24 4.31l-4.84 43.07c-.16 1.4-2.12 1.59-2.54.24l-19.94-64.23c-.92-2.94.28-6.12 2.89-7.75l148.61-92.17c3.42-2.12 6.92 2.59 3.9 5.25';

export const TELEGRAM_QR_RAW_MODULES = `
    {modules_body}
`.trim();

/**
 * Returns QR vector group with customizable center quiet zone background (e.g. 'none' for frosted acrylic)
 * and matching ink color for the center paper-airplane messaging icon.
 */
export function renderTelegramQrModules(
	centerBg: string = '#FFFFFF',
	iconColor: string = 'currentColor',
	badgeBg?: string,
	planeColor?: string
): string {{
	const bgRect =
		centerBg !== 'none'
			? `<rect x="0" y="0" width="220" height="220" rx="44" fill="${{centerBg}}" />`
			: '';

	const effectiveBadgeBg = badgeBg ?? (iconColor === 'currentColor' ? '#13371B' : iconColor);
	const effectivePlaneColor = planeColor ?? '#FFFFFF';
	return `
    {modules_body}
    <!-- Telegram Official Messaging Center Badge (Source: message_telegram_512.svg) -->
    <g class="qr-center-badge" transform="translate(300, 300)">
      ${{bgRect}}
      <svg x="6" y="6" width="208" height="208" viewBox="0 0 512 512">
        <path d="${{TELEGRAM_CIRCLE_PATH}}" fill="${{effectiveBadgeBg}}" />
        <path d="${{TELEGRAM_PLANE_PATH}}" fill="${{effectivePlaneColor}}" />
      </svg>
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
    <!-- Telegram Official Messaging Center Badge (Source: message_telegram_512.svg) -->
    <g class="qr-center-badge" transform="translate(300, 300)">
      <rect x="0" y="0" width="220" height="220" rx="44" fill="#FFFFFF" />
      <svg x="6" y="6" width="208" height="208" viewBox="0 0 512 512">
        <path d="M256 0C114.61 0 0 114.61 0 256s114.61 256 256 256 256-114.61 256-256S397.39 0 256 0" fill="#13371B" />
        <path d="M365.32 132.19 94.4 237.77c-8.77 3.42-8.24 16.01.79 18.68l68.84 20.33 25.7 81.53c2.68 8.52 13.48 11.1 19.72 4.72l35.6-36.35 69.84 51.26c8.54 6.27 20.72 1.61 22.89-8.76l46.25-221.15c2.27-10.84-8.39-19.86-18.7-15.84Zm-33.96 49.08L205.52 292.55a6.8 6.8 0 0 0-2.24 4.31l-4.84 43.07c-.16 1.4-2.12 1.59-2.54.24l-19.94-64.23c-.92-2.94.28-6.12 2.89-7.75l148.61-92.17c3.42-2.12 6.92 2.59 3.9 5.25" fill="#FFFFFF" />
      </svg>
    </g>
  </g>
</svg>
'''
with open(output_svg_path, 'w', encoding='utf-8') as f:
    f.write(standalone_svg)
print(f'Wrote {output_svg_path}')
