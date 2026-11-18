// Business Card Data & Vector Generation Engine (ADR 0003)
// Supports Standard UA (90x50 mm) & Euro (85x55 mm), Frosted Acrylic, and Double/Single Sided Cardstock

import { TELEGRAM_QR_MODULES } from './telegramQrData';

export type CardFormat = 'standard' | 'euro';
export type CardMaterial = 'frosted' | 'double' | 'single';
export type CardSide = 'front' | 'back';
export type FrostedInk = 'dark' | 'white';
export type SolidTheme = 'dark' | 'light';

export interface CardDimension {
	id: CardFormat;
	nameUk: string;
	nameEn: string;
	widthMm: number;
	heightMm: number;
	widthUnits: number;
	heightUnits: number;
	aspectRatio: string;
}

export const CARD_DIMENSIONS: Record<CardFormat, CardDimension> = {
	standard: {
		id: 'standard',
		nameUk: 'Стандарт (90 × 50 мм)',
		nameEn: 'Standard UA (90 × 50 mm)',
		widthMm: 90,
		heightMm: 50,
		widthUnits: 900,
		heightUnits: 500,
		aspectRatio: '9 / 5'
	},
	euro: {
		id: 'euro',
		nameUk: 'Євро-формат (85 × 55 мм)',
		nameEn: 'Euro Format (85 × 55 mm)',
		widthMm: 85,
		heightMm: 55,
		widthUnits: 850,
		heightUnits: 550,
		aspectRatio: '85 / 55'
	}
};

export const BLEED_MARGIN_MM = 2; // 2mm bleed under die-cut
export const SAFE_MARGIN_MM = 4; // 4mm inner safe margin

export interface CardInfoText {
	clinicName: string;
	statusUk: string;
	statusEn: string;
	specUk: string;
	specEn: string;
	phoneDisplay: string;
	phoneTel: string;
	qrCaptionUk: string;
	qrCaptionEn: string;
	website: string;
	cityUk: string;
	cityEn: string;
	slogan: string;
}

export const CARD_INFO: CardInfoText = {
	clinicName: 'VET CREW HOSPITAL',
	statusUk: 'ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ',
	statusEn: 'VETERINARY HOSPITAL',
	specUk: 'Екзотичні, дикі та дрібні тварини',
	specEn: 'Exotic, Wild & Small Animals',
	phoneDisplay: '+380 77 501 01 01',
	phoneTel: '+380775010101',
	qrCaptionUk: 'Telegram: @VetCrewHospital',
	qrCaptionEn: 'Telegram: @VetCrewHospital',
	website: 'vet-crew-hospital.org',
	cityUk: 'Одеса, Україна',
	cityEn: 'Odesa, Ukraine',
	slogan: 'Exotic, Wild & Special'
};

export interface CardRenderOptions {
	format?: CardFormat;
	material?: CardMaterial;
	side?: CardSide;
	frostedInk?: FrostedInk;
	solidTheme?: SolidTheme;
	showBleed?: boolean;
	lang?: 'uk' | 'en';
}

// Logo paths (scaled from 1000x1000 normalized viewBox)
export const LOGO_PATHS = {
	toeLeft:
		'M268.13,265.47c33.8-2.93,48.26,33.6,55.72,60.24,8.21,29.29,17.39,77.33.09,104.32-2.46,3.85-11.14,15.41-15.6,9.21-1.82-2.53,2.74-13.32,3.16-17.48,2.43-24.16-11.76-63.77-41.14-61.83-30.66,2.03-33.04,46.54-23.58,68.46,1.51,3.48,7.88,12.4,8.19,14.31,1.46,8.71-8.55,4.45-12.77,2.74-77.76-31.56-42.77-174.01,25.92-179.97h.02Z',
	toeCenterLeft:
		'M402.02,73.45c45.87-4.35,59.24,38.87,63.33,75.91,4.09,37.05,4.43,105.17-25.36,132.69-3.43,3.17-11.09,9.61-15.82,6.73-5.51-3.35,1.61-11.65,3.36-15.87,11.59-27.94,4.59-84.72-32.5-88.09-37.47-3.4-49.35,49.43-42.11,77.94,1.21,4.79,7.5,15.99,5.13,19.65-4.07,6.26-17.25-4.63-21.08-7.84-30.4-25.49-37.35-65.18-27.63-102.5,10.39-39.98,48.28-94.38,92.67-98.6v-.03Z',
	toeCenterRight:
		'M540.25,73.17c48.07-4.91,90.27,51.22,102.95,92.13,12.12,39.13,6.75,81.69-25.83,108.99-3.52,2.95-21.27,16.96-22.01,5.38-.17-2.62,5.19-13.58,6.21-17.83,6.89-28.48-4.94-80.69-42.34-77.29-36.55,3.31-44.06,59.13-32.99,86.88,1.8,4.53,9.28,13.79,3.82,17.08-6.56,3.97-18.79-9.4-22.46-14.26-21.7-28.71-22.41-82.28-19.62-116.85,2.79-34.57,11.93-80.12,52.25-84.23l.03-.02Z',
	toeRight:
		'M676.68,265.15c37.9-2.6,64.76,41.72,73.13,73.61,9.52,36.28,4.07,77.44-28.62,99.86-4.51,3.1-18.2,11.55-23.18,8.51-4.98-3.03,1.47-8.86,3.4-12.5,11.08-21,14.34-59.44-10.38-72.01-33.69-17.13-55.34,34.58-50.56,62.22.81,4.68,5.9,13.61.36,15.83-4.79,1.92-11.55-7.99-13.71-11.62-16.71-27.97-7.65-75.97,1.09-105.91,6.9-23.67,19.83-56.01,48.49-57.99h-.02Z',
	pad: 'M589.86,459.3c8.44-1.49,15.98-2.2,24.53-2.5,110.71-3.73,173.65,123.53,103.54,209.91-11.94,14.71-37.6,34.73-56.49,38.29-7.47,1.42-13.81-4.44-10.62-11.45,1.42-3.14,14.06-12.56,17.66-16.43,66.87-71.53,14.82-189.63-82.35-189.63-8.29,0-15.5,2.48-21.65,1.75-4.19-.5-8.48-3.9-9.34-8.11-1.18-5.74,3.71-14.21,5.22-20.17,17.66-69.55-41.53-138.41-113.71-117.83-34.58,9.86-60.72,43.2-65.42,78.44-1.53,11.52,1.94,30.95-16.99,26.74-9.08-2.03-11.01-23.91-11.44-31.8-4.47-80.99,72.61-138.17,149.76-123.11,75.35,14.69,120.9,94.75,87.29,165.88l.02.02Z'
};

/**
 * Pure function to generate clean vector SVG string for the business card
 */
export function generateCardSvg(options: CardRenderOptions = {}): string {
	const format = options.format ?? 'standard';
	const material = options.material ?? 'frosted';
	const side = options.side ?? 'front';
	const frostedInk = options.frostedInk ?? 'dark';
	const solidTheme = options.solidTheme ?? 'dark';
	const showBleed = options.showBleed ?? false;
	const lang = options.lang ?? 'uk';

	const dim = CARD_DIMENSIONS[format];
	const w = dim.widthUnits;
	const h = dim.heightUnits;

	// Determine palette colors
	let bgFill = 'transparent';
	let primaryInk = '#13371B';
	let secondaryInk = '#598F3A';
	let accentInk = '#FFB327';
	let textMuted = '#4A6B50';
	let isFrosted = material === 'frosted';

	if (isFrosted) {
		bgFill = 'none';
		if (frostedInk === 'white') {
			primaryInk = '#FFFFFF';
			secondaryInk = 'rgba(255, 255, 255, 0.85)';
			accentInk = '#FFFFFF';
			textMuted = 'rgba(255, 255, 255, 0.65)';
		} else {
			primaryInk = '#13371B';
			secondaryInk = '#598F3A';
			accentInk = '#FFB327';
			textMuted = '#445D48';
		}
	} else {
		// Solid or Double cardstock
		if (solidTheme === 'dark') {
			bgFill = '#13371B';
			primaryInk = '#FFFFFF';
			secondaryInk = '#93C84A';
			accentInk = '#FFB327';
			textMuted = '#9BB7A1';
		} else {
			bgFill = '#FFFFFF';
			primaryInk = '#13371B';
			secondaryInk = '#598F3A';
			accentInk = '#FFB327';
			textMuted = '#55695B';
		}
	}

	const statusText = lang === 'uk' ? CARD_INFO.statusUk : CARD_INFO.statusEn;
	const specText = lang === 'uk' ? CARD_INFO.specUk : CARD_INFO.specEn;
	const qrLabel = lang === 'uk' ? CARD_INFO.qrCaptionUk : CARD_INFO.qrCaptionEn;
	const cityText = lang === 'uk' ? CARD_INFO.cityUk : CARD_INFO.cityEn;

	// Build SVG Elements based on layout
	const isDoubleFront = material === 'double' && side === 'front';

	let content = '';

	if (isDoubleFront) {
		// FRONT of Double-Sided card: Premium brand showcase
		content = `
    <!-- FRONT PRESENTATION -->
    <g transform="translate(${w / 2}, ${h / 2 - 40})">
      <!-- Centered Logo Paw -->
      <g transform="translate(-80, -90) scale(0.16)" fill="${primaryInk}">
        <path d="${LOGO_PATHS.toeLeft}" />
        <path d="${LOGO_PATHS.toeCenterLeft}" />
        <path d="${LOGO_PATHS.toeCenterRight}" />
        <path d="${LOGO_PATHS.toeRight}" />
        <path d="${LOGO_PATHS.pad}" fill="${accentInk}" />
      </g>
    </g>

    <!-- Clinic Title & Subtitle -->
    <text x="${w / 2}" y="${h / 2 + 55}" text-anchor="middle" font-family="'InGlobal', 'Montserrat', sans-serif" font-weight="700" font-size="28" letter-spacing="3" fill="${primaryInk}">
      ${CARD_INFO.clinicName}
    </text>
    <text x="${w / 2}" y="${h / 2 + 90}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="600" font-size="14" letter-spacing="4" fill="${secondaryInk}">
      ${statusText}
    </text>
    <text x="${w / 2}" y="${h / 2 + 120}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="400" font-size="11" letter-spacing="2" fill="${textMuted}">
      ${CARD_INFO.slogan}
    </text>
    `;
	} else {
		// BACK of Double-Sided OR Single-Sided / Frosted: Complete Contact Grid
		const qrSize = format === 'standard' ? 240 : 250;
		const qrX = w - 60 - qrSize;
		const qrY = (h - qrSize) / 2 - 15;

		content = `
    <!-- LEFT COLUMN: BRAND & CONTACTS -->
    <g transform="translate(60, 55)">
      <!-- Compact Brand Header -->
      <g transform="translate(0, 0)">
        <g transform="translate(0, 0) scale(0.09)" fill="${primaryInk}">
          <path d="${LOGO_PATHS.toeLeft}" />
          <path d="${LOGO_PATHS.toeCenterLeft}" />
          <path d="${LOGO_PATHS.toeCenterRight}" />
          <path d="${LOGO_PATHS.toeRight}" />
          <path d="${LOGO_PATHS.pad}" fill="${accentInk}" />
        </g>
        <g transform="translate(110, 32)">
          <text x="0" y="0" font-family="'InGlobal', 'Montserrat', sans-serif" font-weight="700" font-size="21" letter-spacing="2" fill="${primaryInk}">
            ${CARD_INFO.clinicName}
          </text>
          <text x="0" y="24" font-family="'Montserrat', sans-serif" font-weight="600" font-size="11" letter-spacing="2" fill="${secondaryInk}">
            ${statusText}
          </text>
        </g>
      </g>

      <!-- Subtitle description -->
      <text x="0" y="145" font-family="'Montserrat', sans-serif" font-weight="500" font-size="13" letter-spacing="0.5" fill="${textMuted}">
        ${specText}
      </text>

      <!-- Decorative Divider -->
      <line x1="0" y1="165" x2="${qrX - 100}" y2="165" stroke="${secondaryInk}" stroke-width="1.5" opacity="0.35" />

      <!-- Phone Number (Prominent Emergency/Call) -->
      <g transform="translate(0, 220)">
        <text x="0" y="0" font-family="'Montserrat', sans-serif" font-weight="700" font-size="25" letter-spacing="1.5" fill="${primaryInk}">
          ${CARD_INFO.phoneDisplay}
        </text>
        <text x="0" y="28" font-family="'Montserrat', sans-serif" font-weight="500" font-size="11" letter-spacing="1" fill="${textMuted}">
          ${lang === 'uk' ? 'Цілодобовий прийом та стаціонар' : 'Inpatient care & emergency calls'}
        </text>
      </g>

      <!-- Footer Info: Website & City -->
      <g transform="translate(0, 335)">
        <text x="0" y="0" font-family="'Montserrat', sans-serif" font-weight="600" font-size="13" letter-spacing="1" fill="${secondaryInk}">
          ${CARD_INFO.website}
        </text>
        <text x="0" y="24" font-family="'Montserrat', sans-serif" font-weight="400" font-size="11" fill="${textMuted}">
          ${cityText}
        </text>
      </g>
    </g>

    <!-- RIGHT COLUMN: TELEGRAM QR CODE -->
    <g transform="translate(${qrX}, ${qrY})">
      <!-- QR modules -->
      <svg x="0" y="0" width="${qrSize}" height="${qrSize}" viewBox="0 0 740 740" fill="${primaryInk}">
        <g class="telegram-qr-modules">
          ${TELEGRAM_QR_MODULES}
        </g>
      </svg>
      <!-- QR Caption -->
      <text x="${qrSize / 2}" y="${qrSize + 28}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="600" font-size="11.5" letter-spacing="0.5" fill="${primaryInk}">
        ${qrLabel}
      </text>
    </g>
    `;
	}

	// Bleed & Safe margin visual guides (only when showBleed is active)
	let bleedGuides = '';
	if (showBleed) {
		const safeMargin = 40; // 4mm
		bleedGuides = `
    <!-- BLEED & TRIM MARGIN GUIDES (PRINT READY) -->
    <rect x="${safeMargin}" y="${safeMargin}" width="${w - safeMargin * 2}" height="${h - safeMargin * 2}" fill="none" stroke="#E11D48" stroke-width="1" stroke-dasharray="4,4" opacity="0.6" />
    <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#2563EB" stroke-width="1.5" opacity="0.8" />
    <text x="${safeMargin + 6}" y="${safeMargin - 10}" font-family="monospace" font-size="9" fill="#E11D48" opacity="0.8">SAFE AREA (4mm)</text>
    <text x="6" y="${h - 8}" font-family="monospace" font-size="9" fill="#2563EB" opacity="0.8">CUT LINE (${dim.widthMm}x${dim.heightMm}mm)</text>
    `;
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${dim.widthMm}mm" height="${dim.heightMm}mm">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&amp;display=swap');
    </style>
  </defs>
  <!-- BACKGROUND -->
  ${bgFill !== 'none' ? `<rect width="${w}" height="${h}" fill="${bgFill}" rx="${isFrosted ? 16 : 0}" />` : ''}
  
  <!-- CARD BODY -->
  ${content}

  ${bleedGuides}
</svg>`.trim();
}
