import { describe, it, expect } from 'vitest';
import {
	CARD_DIMENSIONS,
	CARD_INFO,
	CARD_CONTACT_ICONS,
	generateCardSvg
} from './businessCardData';

describe('Business Card Data & Generator (ADR 0003)', () => {
	it('має точні фізичні розміри для стандартного та євро форматів', () => {
		expect(CARD_DIMENSIONS.standard.widthMm).toBe(90);
		expect(CARD_DIMENSIONS.standard.heightMm).toBe(50);
		expect(CARD_DIMENSIONS.standard.widthUnits).toBe(900);
		expect(CARD_DIMENSIONS.standard.heightUnits).toBe(500);

		expect(CARD_DIMENSIONS.euro.widthMm).toBe(85);
		expect(CARD_DIMENSIONS.euro.heightMm).toBe(55);
		expect(CARD_DIMENSIONS.euro.widthUnits).toBe(850);
		expect(CARD_DIMENSIONS.euro.heightUnits).toBe(550);
	});

	it('містить актуальний телефон клініки, повну адресу з Майстрова 4 та Telegram дескриптор', () => {
		expect(CARD_INFO.phoneDisplay).toBe('+380 77 501 01 01');
		expect(CARD_INFO.phoneTel).toBe('+380775010101');
		expect(CARD_INFO.qrCaptionUk).toContain('@VetCrewHospital');
		expect(CARD_INFO.website).toBe('vet-crew-hospital.org');
		expect(CARD_INFO.addressUk).toContain('Майстрова, 4');
		expect(CARD_INFO.cityUk).toContain('Майстрова, 4');
	});

	it('генерує валідний SVG для прозорого пластику (frosted) з адаптивним QR, іконкою літачка в колір QR та повною адресою', () => {
		const svgDark = generateCardSvg({
			material: 'frosted',
			frostedInk: 'dark',
			format: 'standard',
			lang: 'uk'
		});
		expect(svgDark).toContain('<svg');
		expect(svgDark).toContain('viewBox="0 0 900 500"');
		expect(svgDark).toContain('+380 77 501 01 01');
		expect(svgDark).toContain('Майстрова, 4');
		expect(svgDark).toContain('telegram-qr-modules');
		expect(svgDark).toContain('id="text-vet-crew"');
		expect(svgDark).toContain('id="text-hospital"');

		// Working days and hours strictly removed from business card
		expect(svgDark).not.toContain('Пн–Пт');
		expect(svgDark).not.toContain('10:00 – 18:00');

		// Telegram QR & messaging icon (clean without outer stroke outline, matching ink color)
		expect(svgDark).toContain('viewBox="70 70 680 680"');
		expect(svgDark).toContain('qr-center-badge');
		expect(svgDark).toContain('M365.32 132.19');
		expect(svgDark).toContain('M256 0C114.61');
		expect(svgDark).not.toContain('stroke-width="8"');

		// Only @VetCrewHospital under QR, no redundant 'Telegram' label
		expect(svgDark).toContain('@VetCrewHospital');
		expect(svgDark).not.toContain('>Telegram<');

		// Invariant: no redundant plain-text subtitle
		expect(svgDark).not.toContain('ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ');
		expect(svgDark).not.toContain('VETERINARY HOSPITAL');

		// CRITICAL INVARIANT: NEVER 24/7 or цілодобово
		expect(svgDark.toLowerCase()).not.toContain('цілодобов');
		expect(svgDark).not.toContain('24/7');

		// Frosted has no solid rect background
		expect(svgDark).not.toContain('<rect width="900" height="500" fill="#');

		const svgWhite = generateCardSvg({
			material: 'frosted',
			frostedInk: 'white',
			format: 'euro',
			lang: 'en'
		});
		expect(svgWhite).toContain('viewBox="0 0 850 550"');
		expect(svgWhite).toContain('fill="#FFFFFF"');
		expect(svgWhite).toContain('stroke="#FFFFFF"');
		expect(svgWhite).toContain('4 Maystrova St');
		expect(svgWhite).not.toContain('Mon–Fri');
	});

	it('генерує валідний SVG для двосторонньої візитки (лице та зворот)', () => {
		const front = generateCardSvg({
			material: 'double',
			side: 'front',
			solidTheme: 'dark',
			lang: 'uk'
		});
		expect(front).toContain('id="text-vet-crew"');
		expect(front).toContain('id="text-hospital"');
		expect(front).toContain('vet-crew-hospital.org');
		expect(front).toContain('Майстрова, 4');
		// Redundant subtitle omitted
		expect(front).not.toContain('ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ');
		// Schedule omitted
		expect(front).not.toContain('Пн–Пт');
		// Front does not contain QR code
		expect(front).not.toContain('telegram-qr-modules');

		const back = generateCardSvg({
			material: 'double',
			side: 'back',
			solidTheme: 'dark',
			lang: 'uk'
		});
		expect(back).toContain('+380 77 501 01 01');
		expect(back).toContain('Майстрова, 4');
		expect(back).not.toContain('Пн–Пт');
		expect(back).toContain('telegram-qr-modules');
		expect(back).toContain('qr-center-badge');
		expect(back).toContain('vet-crew-hospital.org');
		expect(back).not.toContain('ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ');
		expect(back).not.toContain('>Telegram<');
	});

	it('генерує валідний SVG для односторонньої картки (solid)', () => {
		const singleDark = generateCardSvg({
			material: 'single',
			solidTheme: 'dark',
			lang: 'uk'
		});
		expect(singleDark).toContain('fill="#13371B"');
		expect(singleDark).toContain('+380 77 501 01 01');
		expect(singleDark).toContain('Майстрова, 4');
		expect(singleDark).not.toContain('Пн–Пт');
		expect(singleDark).toContain('telegram-qr-modules');
		expect(singleDark).toContain('qr-center-badge');
		expect(singleDark).not.toContain('ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ');
		expect(singleDark).not.toContain('>Telegram<');

		const singleLight = generateCardSvg({
			material: 'single',
			solidTheme: 'light',
			lang: 'en'
		});
		expect(singleLight).toContain('fill="#FFFFFF"');
		expect(singleLight).toContain('4 Maystrova St');
		expect(singleLight).not.toContain('Mon–Fri');
		expect(singleLight).not.toContain('VETERINARY HOSPITAL');
	});

	it('включає лінії під обріз та безпечну зону при showBleed: true', () => {
		const withBleed = generateCardSvg({
			showBleed: true,
			format: 'standard'
		});
		expect(withBleed).toContain('SAFE AREA (4mm)');
		expect(withBleed).toContain('CUT LINE (90x50mm)');

		const withoutBleed = generateCardSvg({
			showBleed: false,
			format: 'standard'
		});
		expect(withoutBleed).not.toContain('SAFE AREA');
	});

	it('повторює затверджений клієнтський макет: емблема з тваринами, розділювач, пігулка Telegram, телефон, адреса та сайт', () => {
		const card = generateCardSvg({
			material: 'frosted',
			frostedInk: 'dark',
			format: 'standard',
			lang: 'uk'
		});

		// 1. Ліва колонка: повна емблема з силуетами тварин та написами
		expect(card).toContain('id="animal-silhouettes"');
		expect(card).toContain('id="text-center-treatment"');
		expect(card).toContain('id="text-subtitle"');
		expect(card).toContain('id="text-vet-crew"');
		expect(card).toContain('id="text-hospital"');

		// 2. Центральний вертикальний розділювач зі звуженням по краях та розширенням по центру
		expect(card).toContain('M 445 45 C');

		// 3. Права колонка: Telegram QR з круглим бейджем та літачком
		expect(card).toContain('telegram-qr-modules');
		expect(card).toContain('qr-center-badge');

		// 4. Зелена плашка-пігулка "Запис у Telegram"
		expect(card).toContain('Запис у Telegram');

		// 5. Контактний блок з іконками: телефон, адреса та сайт під адресою
		expect(card).toContain('+380 77 501 01 01');
		expect(card).toContain('Майстрова, 4');
		expect(card).toContain('vet-crew-hospital.org');

		// Порядок елементів у правому блоці: телефон -> адреса -> сайт
		const phoneIdx = card.indexOf('+380 77 501 01 01');
		const addrIdx = card.indexOf('Майстрова, 4');
		const webIdx = card.indexOf('vet-crew-hospital.org');
		expect(phoneIdx).toBeGreaterThan(0);
		expect(addrIdx).toBeGreaterThan(phoneIdx);
		expect(webIdx).toBeGreaterThan(addrIdx);
	});

	it('використовує за замовчуванням емблему "01 вхід" (гекон, кролик, миша, їжак, какаду) та підтримує інші версії', () => {
		const cardDefault = generateCardSvg();
		// 01 вхід animal path starts with M648.0,1118.64
		expect(cardDefault).toContain('M648.0,1118.64');

		const card04 = generateCardSvg({ emblemVariant: '04' });
		// 04 сходи animal path starts with M871.68,1130.64
		expect(card04).toContain('M871.68,1130.64');
		expect(card04).not.toContain('M648.0,1118.64');

		const card02 = generateCardSvg({ emblemVariant: '02' });
		expect(card02).toContain('id="animal-silhouettes"');

		const card03 = generateCardSvg({ emblemVariant: '03' });
		expect(card03).toContain('id="animal-silhouettes"');
	});

	it('має однакову товщину шрифта (700) для списку контактів (телефон, адреса, сайт)', () => {
		const card = generateCardSvg();
		expect(card).toContain(
			'font-weight="700" font-size="23" letter-spacing="0.5" fill="#13371B">\n        +380 77 501 01 01'
		);
		expect(card).toContain(
			'font-weight="700" font-size="18" letter-spacing="0.3" fill="#13371B">\n        м. Одеса, вул. Майстрова, 4'
		);
		expect(card).toContain(
			'font-weight="700" font-size="19" letter-spacing="0.4" fill="#13371B">\n        vet-crew-hospital.org'
		);
	});

	it('має розділювач з однаковою відстанню до логотипу та до контактів', () => {
		const card = generateCardSvg({ format: 'standard' });
		expect(card).toContain('M 445 45 C');
		expect(card).toContain('transform="translate(505, ');
	});

	it('фарбує текст сайту та іконку сайту в темно-зелений колір (#13371B) для темного чорнила / світлої теми', () => {
		const card = generateCardSvg({ material: 'frosted', frostedInk: 'dark' });
		expect(card).toContain(
			'stroke="#13371B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">\n        ' +
				CARD_CONTACT_ICONS.globe
		);
		expect(card).toContain('fill="#13371B">\n        vet-crew-hospital.org');
	});
});
