// Business Card Data & Vector Generation Engine (ADR 0003)
// Supports Standard UA (90x50 mm) & Euro (85x55 mm), Frosted Acrylic, and Double/Single Sided Cardstock
// Features official integrated Vet Crew Hospital vector emblem with animal silhouettes, Telegram QR code, pill booking badge, and contact channels.

import { renderTelegramQrModules, TELEGRAM_QR_VIEWBOX } from './telegramQrData';
import {
	renderEmblemAnimals,
	EMBLEM_ANIMALS_VIEWBOX,
	type EmblemAnimalsColors,
	type EmblemVariantId
} from './emblemAnimalsData';

export type { EmblemVariantId, EmblemVariantInfo } from './emblemAnimalsData';
export { EMBLEM_VARIANTS } from './emblemAnimalsData';

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
	treatmentCenterUk: string;
	treatmentCenterEn: string;
	treatmentCenterSubUk: string;
	treatmentCenterSubEn: string;
	phoneDisplay: string;
	phoneTel: string;
	bookingLabelUk: string;
	bookingLabelEn: string;
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
	treatmentCenterUk: 'ЦЕНТР ЛІКУВАННЯ',
	treatmentCenterEn: 'TREATMENT CENTER',
	treatmentCenterSubUk: 'ЕКЗОТИЧНИХ ТА ДИКИХ ТВАРИН',
	treatmentCenterSubEn: 'EXOTIC AND WILD ANIMALS',
	phoneDisplay: '+380 77 501 01 01',
	phoneTel: '+380775010101',
	bookingLabelUk: 'Запис у Telegram',
	bookingLabelEn: 'Book via Telegram',
	scheduleUk: 'Пн–Пт 10:00 – 18:00',
	scheduleEn: 'Mon–Fri 10:00 – 18:00',
	qrCaptionUk: '@VetCrewHospital',
	qrCaptionEn: '@VetCrewHospital',
	website: 'vet-crew-hospital.org',
	addressUk: 'м. Одеса, вул. Майстрова, 4',
	addressEn: '4 Maystrova St, Odesa',
	cityUk: 'м. Одеса, вул. Майстрова, 4',
	cityEn: '4 Maystrova St, Odesa',
	slogan: 'Exotic, Wild & Special'
};

export const CARD_CONTACT_ICONS = {
	phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />`,
	pin: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />`,
	globe: `<circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />`
};

export interface CardRenderOptions {
	format?: CardFormat;
	material?: CardMaterial;
	side?: CardSide;
	frostedInk?: FrostedInk;
	solidTheme?: SolidTheme;
	logoStyle?: LogoStyle;
	emblemVariant?: EmblemVariantId;
	showBleed?: boolean;
	lang?: 'uk' | 'en';
}

/**
 * Pure function to generate clean vector SVG string for the business card
 */
export function generateCardSvg(options: CardRenderOptions = {}): string {
	const format = options.format ?? 'standard';
	const material = options.material ?? 'frosted';
	const side = options.side ?? 'front';
	const frostedInk = options.frostedInk ?? 'dark';
	const solidTheme = options.solidTheme ?? 'dark';
	const emblemVariant = options.emblemVariant ?? '01';
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
	let dividerColor: string;
	let pillBg: string;
	let pillTextColor: string;
	let contactIconColor: string;
	let websiteColor: string;
	let qrBadgeBg: string;
	let qrPlaneFill: string;
	let centerBg: string;
	let emblemColors: EmblemAnimalsColors;

	if (isFrosted) {
		bgFill = 'none';
		centerBg = 'none';
		if (frostedInk === 'white') {
			primaryInk = '#FFFFFF';
			dividerColor = 'rgba(255, 255, 255, 0.55)';
			pillBg = 'rgba(255, 255, 255, 0.22)';
			pillTextColor = '#FFFFFF';
			contactIconColor = '#FFFFFF';
			websiteColor = '#FFFFFF';
			qrBadgeBg = 'rgba(255, 255, 255, 0.28)';
			qrPlaneFill = '#FFFFFF';
			emblemColors = {
				circleBg: 'rgba(255, 255, 255, 0.18)',
				paw: '#FFFFFF',
				pad: '#FFFFFF',
				vetCrew: '#FFFFFF',
				hospital: '#FFFFFF',
				animals: '#FFFFFF',
				title: '#FFFFFF',
				subtitle: '#FFFFFF'
			};
		} else {
			// Luxury Emerald / Brand (Client Mockup Standard)
			primaryInk = '#13371B';
			dividerColor = '#13371B';
			pillBg = '#C2E29B';
			pillTextColor = '#13371B';
			contactIconColor = '#13371B';
			websiteColor = '#13371B';
			qrBadgeBg = '#13371B';
			qrPlaneFill = '#FFFFFF';
			emblemColors = {
				circleBg: '#13371B',
				paw: '#FFFFFF',
				pad: '#FFFFFF',
				vetCrew: '#FFB327',
				hospital: '#598F3A',
				animals: '#13371B',
				title: '#13371B',
				subtitle: '#598F3A'
			};
		}
	} else {
		// Solid or Double cardstock
		if (solidTheme === 'dark') {
			bgFill = '#13371B';
			centerBg = '#13371B';
			primaryInk = '#FFFFFF';
			dividerColor = 'rgba(255, 255, 255, 0.35)';
			pillBg = '#93C84A';
			pillTextColor = '#13371B';
			contactIconColor = '#FFFFFF';
			websiteColor = '#93C84A';
			qrBadgeBg = '#0D2613';
			qrPlaneFill = '#FFFFFF';
			emblemColors = {
				circleBg: '#0D2613',
				paw: '#FFFFFF',
				pad: '#FFB327',
				vetCrew: '#FFB327',
				hospital: '#93C84A',
				animals: '#FFFFFF',
				title: '#FFFFFF',
				subtitle: '#93C84A'
			};
		} else {
			bgFill = '#FFFFFF';
			centerBg = '#FFFFFF';
			primaryInk = '#13371B';
			dividerColor = 'rgba(19, 55, 27, 0.35)';
			pillBg = '#C2E29B';
			pillTextColor = '#13371B';
			contactIconColor = '#13371B';
			websiteColor = '#13371B';
			qrBadgeBg = '#13371B';
			qrPlaneFill = '#FFFFFF';
			emblemColors = {
				circleBg: '#13371B',
				paw: '#FFFFFF',
				pad: '#FFFFFF',
				vetCrew: '#FFB327',
				hospital: '#598F3A',
				animals: '#13371B',
				title: '#13371B',
				subtitle: '#598F3A'
			};
		}
	}

	const bookingLabel = lang === 'uk' ? CARD_INFO.bookingLabelUk : CARD_INFO.bookingLabelEn;
	const addressText = lang === 'uk' ? CARD_INFO.addressUk : CARD_INFO.addressEn;

	let content: string;

	if (isDoubleFront) {
		// FRONT of Double-Sided card: Centered Official Emblem with Animal Silhouettes & Treatment Center Titles
		const isEuro = format === 'euro';
		const centerLogoSize = isEuro ? 390 : 360;
		const centerLogoX = (w - centerLogoSize) / 2;
		const centerLogoY = (h - centerLogoSize) / 2 - 40;
		const websiteY = centerLogoY + centerLogoSize + 32;
		const addressY = websiteY + 28;

		content = `
    <!-- FRONT PRESENTATION: OFFICIAL EMBLEM WITH ANIMALS & TITLES -->
    <svg x="${centerLogoX}" y="${centerLogoY}" width="${centerLogoSize}" height="${centerLogoSize}" viewBox="${EMBLEM_ANIMALS_VIEWBOX}">
      ${renderEmblemAnimals(emblemColors, emblemVariant)}
    </svg>

    <!-- Clinic Website & Full Address -->
    <text x="${w / 2}" y="${websiteY}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="700" font-size="22" letter-spacing="1.5" fill="${websiteColor}">
      ${CARD_INFO.website}
    </text>
    <text x="${w / 2}" y="${addressY}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="600" font-size="16" letter-spacing="1" fill="${primaryInk}">
      ${addressText}
    </text>
    `;
	} else {
		// ALL-IN-ONE LAYOUT (Frosted Acrylic, Single-Sided, or Back of Double-Sided)
		// Left: Full Official Emblem with Animal Silhouettes & Treatment Center Titles
		// Middle: Thin Vertical Divider Line
		// Right: Telegram QR + Pill Badge "Запис у Telegram" + Phone + Address + Website
		const isEuro = format === 'euro';

		// Left Column: Official Emblem with Animals & Titles
		const emblemSize = isEuro ? 450 : 425;
		const emblemX = isEuro ? 16 : 20;
		const emblemY = isEuro ? 50 : 38;

		// Center Vertical Divider (Spindle / Needle tapering at edges, slightly expanding at center)
		// Exactly halfway between visual right of emblem and contact block left
		const dividerX = isEuro ? 443 : 445;
		const dividerY1 = isEuro ? 45 : 45;
		const dividerY2 = isEuro ? 505 : 455;
		const dividerH = dividerY2 - dividerY1;
		const dividerHw = isEuro ? 1.6 : 1.5;

		// Right Column: Center X
		const rightCenterX = isEuro ? 647 : 673;

		// QR Code (balanced margins within safe area, with tight viewBox so modules dominate)
		const qrSize = isEuro ? 244 : 230;
		const qrX = rightCenterX - qrSize / 2;
		const qrY = isEuro ? 54 : 46;

		// Pill Badge: "Запис у Telegram" (close to QR code)
		const pillW = isEuro ? 270 : 262;
		const pillH = isEuro ? 40 : 38;
		const pillX = rightCenterX - pillW / 2;
		const pillY = qrY + qrSize + 8;
		const pillTextY = pillY + (isEuro ? 25.5 : 24.5);
		const pillFontSize = isEuro ? 18 : 17;

		// Contacts List (Phone, Address, Website)
		// Unified font weight (700) across all items
		const contactX = isEuro ? 485 : 505;
		const contactRowGap = isEuro ? 46 : 42;
		const phoneY = pillY + pillH + (isEuro ? 46 : 44);
		const addressY = phoneY + contactRowGap;
		const websiteY = addressY + contactRowGap;

		const phoneFontSize = isEuro ? 24.5 : 23;
		const addressFontSize = isEuro ? 19 : 18;
		const websiteFontSize = isEuro ? 20 : 19;

		content = `
    <!-- LEFT COLUMN: OFFICIAL EMBLEM WITH ANIMAL SILHOUETTES & TITLES -->
    <svg x="${emblemX}" y="${emblemY}" width="${emblemSize}" height="${emblemSize}" viewBox="${EMBLEM_ANIMALS_VIEWBOX}">
      ${renderEmblemAnimals(emblemColors, emblemVariant)}
    </svg>

    <!-- CENTER VERTICAL DIVIDER (ELEGANT TAPERED SPINDLE) -->
    <path d="M ${dividerX} ${dividerY1} C ${dividerX - dividerHw} ${dividerY1 + dividerH * 0.28}, ${dividerX - dividerHw} ${dividerY2 - dividerH * 0.28}, ${dividerX} ${dividerY2} C ${dividerX + dividerHw} ${dividerY2 - dividerH * 0.28}, ${dividerX + dividerHw} ${dividerY1 + dividerH * 0.28}, ${dividerX} ${dividerY1} Z" fill="${dividerColor}" opacity="0.65" />

    <!-- RIGHT COLUMN: TELEGRAM QR CODE -->
    <g transform="translate(${qrX}, ${qrY})">
      <svg x="0" y="0" width="${qrSize}" height="${qrSize}" viewBox="${TELEGRAM_QR_VIEWBOX}" fill="${primaryInk}" color="${primaryInk}">
        <g class="telegram-qr-modules">
          ${renderTelegramQrModules(centerBg, primaryInk, qrBadgeBg, qrPlaneFill)}
        </g>
      </svg>
    </g>

    <!-- PILL BADGE: BOOKING IN TELEGRAM -->
    <g transform="translate(${pillX}, ${pillY})">
      <rect width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${pillBg}" />
      <text x="${pillW / 2}" y="${pillTextY - pillY}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${pillFontSize}" fill="${pillTextColor}" letter-spacing="0.3" data-handle="${CARD_INFO.qrCaptionUk}">
        ${bookingLabel}
      </text>
    </g>

    <!-- CONTACT ITEMS -->
    <!-- 1. Direct Emergency / Call Telephone -->
    <g transform="translate(${contactX}, ${phoneY})">
      <g transform="translate(0, -20) scale(1.15)" fill="none" stroke="${contactIconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${CARD_CONTACT_ICONS.phone}
      </g>
      <text x="36" y="0" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${phoneFontSize}" letter-spacing="0.5" fill="${primaryInk}">
        ${CARD_INFO.phoneDisplay}
      </text>
    </g>

    <!-- 2. Full Clinic Address -->
    <g transform="translate(${contactX}, ${addressY})">
      <g transform="translate(0, -18) scale(1.05)" fill="none" stroke="${contactIconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${CARD_CONTACT_ICONS.pin}
      </g>
      <text x="36" y="0" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${addressFontSize}" letter-spacing="0.3" fill="${primaryInk}">
        ${addressText}
      </text>
    </g>

    <!-- 3. Official Website (under address as requested) -->
    <g transform="translate(${contactX}, ${websiteY})">
      <g transform="translate(0, -18) scale(1.05)" fill="none" stroke="${websiteColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${CARD_CONTACT_ICONS.globe}
      </g>
      <text x="36" y="0" font-family="'Montserrat', sans-serif" font-weight="700" font-size="${websiteFontSize}" letter-spacing="0.4" fill="${websiteColor}">
        ${CARD_INFO.website}
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
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&amp;display=swap');
    </style>
  </defs>
  <!-- BACKGROUND -->
  ${bgFill !== 'none' ? `<rect width="${w}" height="${h}" fill="${bgFill}" rx="${isFrosted ? 18 : 0}" />` : ''}
  
  <!-- CARD BODY -->
  ${content}

  ${bleedGuides}
</svg>`.trim();
}
