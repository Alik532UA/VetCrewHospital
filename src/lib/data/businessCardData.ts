// Business Card Data & Vector Generation Engine (ADR 0003)
// Supports Standard UA (90x50 mm) & Euro (85x55 mm), Frosted Acrylic, and Double/Single Sided Cardstock
// Features official integrated Vet Crew Hospital vector logo mark, Telegram QR code, and strict clinic schedule.

import logoPaths from '../assets/logo-paths.json';
import { renderTelegramQrModules, TELEGRAM_QR_VIEWBOX } from './telegramQrData';

export type CardFormat = 'standard' | 'euro';
export type CardMaterial = 'frosted' | 'double' | 'single';
export type CardSide = 'front' | 'back';
export type FrostedInk = 'dark' | 'white' | 'brand';
export type SolidTheme = 'dark' | 'light';
export type LogoStyle = 'emblem' | 'badge';

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
	phoneDisplay: string;
	phoneTel: string;
	scheduleUk: string;
	scheduleEn: string;
	qrCaptionUk: string;
	qrCaptionEn: string;
	website: string;
	addressUk: string;
	addressEn: string;
	cityUk: string;
	cityEn: string;
	slogan: string;
}

export const CARD_INFO: CardInfoText = {
	clinicName: 'VET CREW HOSPITAL',
	statusUk: 'ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ',
	statusEn: 'VETERINARY HOSPITAL',
	phoneDisplay: '+380 77 501 01 01',
	phoneTel: '+380775010101',
	scheduleUk: 'Пн–Пт 10:00 – 18:00',
	scheduleEn: 'Mon–Fri 10:00 – 18:00',
	qrCaptionUk: '@VetCrewHospital',
	qrCaptionEn: '@VetCrewHospital',
	website: 'vet-crew-hospital.org',
	addressUk: 'Одеса, вул. Майстрова, 4',
	addressEn: '4 Maystrova St, Odesa',
	cityUk: 'Одеса, вул. Майстрова, 4',
	cityEn: '4 Maystrova St, Odesa',
	slogan: 'Exotic, Wild & Special'
};

export interface CardRenderOptions {
	format?: CardFormat;
	material?: CardMaterial;
	side?: CardSide;
	frostedInk?: FrostedInk;
	solidTheme?: SolidTheme;
	logoStyle?: LogoStyle;
	showBleed?: boolean;
	lang?: 'uk' | 'en';
}

// Official logo geometry from canonical logo-paths.json
export const OFFICIAL_LOGO_PATHS = {
	toeLeft: logoPaths['paw-toe-left'].d,
	toeCenterLeft: logoPaths['paw-toe-center-left'].d,
	toeCenterRight: logoPaths['paw-toe-center-right'].d,
	toeRight: logoPaths['paw-toe-right'].d,
	pad: logoPaths['paw-pad'].d,
	textVetCrew: logoPaths['text-vet-crew'].d,
	textHospital: logoPaths['text-hospital'].d
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
	const logoStyle = options.logoStyle ?? 'emblem';
	const showBleed = options.showBleed ?? false;
	const lang = options.lang ?? 'uk';

	const dim = CARD_DIMENSIONS[format];
	const w = dim.widthUnits;
	const h = dim.heightUnits;

	const isFrosted = material === 'frosted';
	const isDoubleFront = material === 'double' && side === 'front';

	// Determine palette colors
	let bgFill: string;
	let primaryInk: string;
	let secondaryInk: string;
	let textMuted: string;
	let centerBg: string;
	let logoColors: {
		paw: string;
		pad: string;
		vetCrew: string;
		hospital: string;
		circleBg: string;
	};

	if (isFrosted) {
		bgFill = 'none';
		centerBg = 'none';
		if (frostedInk === 'white') {
			primaryInk = '#FFFFFF';
			secondaryInk = 'rgba(255, 255, 255, 0.9)';
			textMuted = 'rgba(255, 255, 255, 0.72)';
			logoColors = {
				paw: '#FFFFFF',
				pad: '#FFFFFF',
				vetCrew: '#FFFFFF',
				hospital: '#FFFFFF',
				circleBg: 'rgba(255, 255, 255, 0.15)'
			};
		} else if (frostedInk === 'brand') {
			primaryInk = '#13371B';
			secondaryInk = '#598F3A';
			textMuted = '#4A6B50';
			logoColors = {
				paw: '#13371B',
				pad: '#FFB327',
				vetCrew: '#FFB327',
				hospital: '#598F3A',
				circleBg: '#13371B'
			};
		} else {
			// frostedInk === 'dark' (luxury emerald monochrome print)
			primaryInk = '#13371B';
			secondaryInk = '#13371B';
			textMuted = 'rgba(19, 55, 27, 0.75)';
			logoColors = {
				paw: '#13371B',
				pad: '#13371B',
				vetCrew: '#13371B',
				hospital: '#13371B',
				circleBg: 'rgba(19, 55, 27, 0.1)'
			};
		}
	} else {
		// Solid or Double cardstock
		if (solidTheme === 'dark') {
			bgFill = '#13371B';
			centerBg = '#13371B';
			primaryInk = '#FFFFFF';
			secondaryInk = '#93C84A';
			textMuted = '#B5D1BC';
			logoColors = {
				paw: '#FFFFFF',
				pad: '#FFB327',
				vetCrew: '#FFB327',
				hospital: '#93C84A',
				circleBg: '#0D2613'
			};
		} else {
			bgFill = '#FFFFFF';
			centerBg = '#FFFFFF';
			primaryInk = '#13371B';
			secondaryInk = '#598F3A';
			textMuted = '#526857';
			logoColors = {
				paw: '#13371B',
				pad: '#FFB327',
				vetCrew: '#FFB327',
				hospital: '#598F3A',
				circleBg: '#EBF4EA'
			};
		}
	}

	const scheduleText = lang === 'uk' ? CARD_INFO.scheduleUk : CARD_INFO.scheduleEn;
	const qrLabel = lang === 'uk' ? CARD_INFO.qrCaptionUk : CARD_INFO.qrCaptionEn;
	const addressText = lang === 'uk' ? CARD_INFO.addressUk : CARD_INFO.addressEn;

	let content: string;

	if (isDoubleFront) {
		// FRONT of Double-Sided card: Centered Official Logo & Slogan (>80% content coverage)
		const isEuro = format === 'euro';
		const centerLogoSize = isEuro ? 340 : 320;
		const centerLogoX = (w - centerLogoSize) / 2;
		const centerLogoY = (h - centerLogoSize) / 2 - 35;
		const websiteY = centerLogoY + centerLogoSize + 48;
		const addressY = websiteY + 28;

		content = `
    <!-- FRONT PRESENTATION -->
    <svg x="${centerLogoX}" y="${centerLogoY}" width="${centerLogoSize}" height="${centerLogoSize}" viewBox="0 0 970.62 970.62">
      ${logoStyle === 'badge' ? `<circle cx="485.31" cy="485.31" r="461.76" fill="${logoColors.circleBg}" />` : ''}
      <g id="logo-content" transform="translate(0, 6.15)">
        <g id="paw" fill="${logoColors.paw}">
          <path d="${OFFICIAL_LOGO_PATHS.toeRight}" />
          <path d="${OFFICIAL_LOGO_PATHS.toeCenterRight}" />
          <path d="${OFFICIAL_LOGO_PATHS.toeCenterLeft}" />
          <path d="${OFFICIAL_LOGO_PATHS.toeLeft}" />
          <path d="${OFFICIAL_LOGO_PATHS.pad}" fill="${logoColors.pad}" />
        </g>
        <path id="text-vet-crew" fill="${logoColors.vetCrew}" d="${OFFICIAL_LOGO_PATHS.textVetCrew}" />
        <path id="text-hospital" fill="${logoColors.hospital}" d="${OFFICIAL_LOGO_PATHS.textHospital}" />
      </g>
    </svg>

    <!-- Clinic Website & Full Address -->
    <text x="${w / 2}" y="${websiteY}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="700" font-size="20" letter-spacing="2" fill="${secondaryInk}">
      ${CARD_INFO.website}
    </text>
    <text x="${w / 2}" y="${addressY}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="500" font-size="14" letter-spacing="1.2" fill="${textMuted}">
      ${addressText}
    </text>
    `;
	} else {
		// ALL-IN-ONE LAYOUT (Frosted Acrylic, Single-Sided, or Back of Double-Sided)
		// Left: Full Official Logo + Direct Phone + Strictly Clinic Schedule + Website + Full Address (Майстрова, 4)
		// Right: Telegram QR Code + Clean Handle (no redundant 'Telegram' label, >80% visual coverage)
		const isEuro = format === 'euro';
		const leftX = 45;
		const logoSize = isEuro ? 245 : 230;
		const logoY = isEuro ? 40 : 35;

		const phoneY = isEuro ? 345 : 320;
		const phoneFontSize = isEuro ? 31 : 30;

		const scheduleY = isEuro ? 390 : 362;
		const scheduleFontSize = isEuro ? 17 : 16;

		const websiteY = isEuro ? 438 : 408;
		const websiteFontSize = isEuro ? 19 : 18;

		const addressY = isEuro ? 478 : 446;
		const addressFontSize = isEuro ? 16 : 15.5;

		const qrSize = isEuro ? 360 : 340;
		const qrX = w - 45 - qrSize;
		const qrY = isEuro ? 40 : 35;
		const qrCaptionY = qrY + qrSize + (isEuro ? 46 : 44);
		const qrCaptionFontSize = isEuro ? 22 : 21;

		content = `
    <!-- LEFT COLUMN: OFFICIAL LOGO & CONTACTS -->
    <svg x="${leftX}" y="${logoY}" width="${logoSize}" height="${logoSize}" viewBox="0 0 970.62 970.62">
      ${logoStyle === 'badge' ? `<circle cx="485.31" cy="485.31" r="461.76" fill="${logoColors.circleBg}" />` : ''}
      <g id="logo-content" transform="translate(0, 6.15)">
        <g id="paw" fill="${logoColors.paw}">
          <path d="${OFFICIAL_LOGO_PATHS.toeRight}" />
          <path d="${OFFICIAL_LOGO_PATHS.toeCenterRight}" />
          <path d="${OFFICIAL_LOGO_PATHS.toeCenterLeft}" />
          <path d="${OFFICIAL_LOGO_PATHS.toeLeft}" />
          <path d="${OFFICIAL_LOGO_PATHS.pad}" fill="${logoColors.pad}" />
        </g>
        <path id="text-vet-crew" fill="${logoColors.vetCrew}" d="${OFFICIAL_LOGO_PATHS.textVetCrew}" />
        <path id="text-hospital" fill="${logoColors.hospital}" d="${OFFICIAL_LOGO_PATHS.textHospital}" />
      </g>
    </svg>

    <!-- Direct Emergency / Call Telephone -->
    <text x="${leftX}" y="${phoneY}" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${phoneFontSize}" letter-spacing="1.2" fill="${primaryInk}">
      ${CARD_INFO.phoneDisplay}
    </text>

    <!-- Working Hours Schedule (CRITICAL: Strictly Mon-Fri 10:00-18:00, non-stop care claim is forbidden) -->
    <text x="${leftX}" y="${scheduleY}" font-family="'Montserrat', sans-serif" font-weight="600" font-size="${scheduleFontSize}" letter-spacing="0.5" fill="${textMuted}">
      ${scheduleText}
    </text>

    <!-- Official Website URL -->
    <text x="${leftX}" y="${websiteY}" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${websiteFontSize}" letter-spacing="0.8" fill="${secondaryInk}">
      ${CARD_INFO.website}
    </text>

    <!-- Full Address with Maystrova 4 -->
    <text x="${leftX}" y="${addressY}" font-family="'Montserrat', sans-serif" font-weight="600" font-size="${addressFontSize}" letter-spacing="0.5" fill="${textMuted}">
      ${addressText}
    </text>

    <!-- RIGHT COLUMN: TELEGRAM QR CODE -->
    <g transform="translate(${qrX}, ${qrY})">
      <svg x="0" y="0" width="${qrSize}" height="${qrSize}" viewBox="${TELEGRAM_QR_VIEWBOX}" fill="${primaryInk}">
        <g class="telegram-qr-modules">
          ${renderTelegramQrModules(centerBg)}
        </g>
      </svg>
      <!-- Telegram Handle Caption (clean, no duplicate label) -->
      <text x="${qrSize / 2}" y="${qrCaptionY - qrY}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${qrCaptionFontSize}" letter-spacing="0.8" fill="${primaryInk}">
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
