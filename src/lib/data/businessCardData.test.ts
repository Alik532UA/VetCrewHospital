import { describe, it, expect } from 'vitest';
import {
	CARD_DIMENSIONS,
	CARD_INFO,
	generateCardSvg,
	type CardFormat,
	type CardMaterial
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

	it('містить актуальний телефон клініки, графік та Telegram дескриптор', () => {
		expect(CARD_INFO.phoneDisplay).toBe('+380 77 501 01 01');
		expect(CARD_INFO.phoneTel).toBe('+380775010101');
		expect(CARD_INFO.scheduleUk).toBe('Пн–Пт 10:00 – 18:00');
		expect(CARD_INFO.scheduleEn).toBe('Mon–Fri 10:00 – 18:00');
		expect(CARD_INFO.qrCaptionUk).toContain('@VetCrewHospital');
		expect(CARD_INFO.website).toBe('vet-crew-hospital.org');
	});

	it('генерує валідний SVG для прозорого пластику (frosted)', () => {
		const svgDark = generateCardSvg({
			material: 'frosted',
			frostedInk: 'dark',
			format: 'standard',
			lang: 'uk'
		});
		expect(svgDark).toContain('<svg');
		expect(svgDark).toContain('viewBox="0 0 900 500"');
		expect(svgDark).toContain('+380 77 501 01 01');
		expect(svgDark).toContain('Пн–Пт 10:00 – 18:00');
		expect(svgDark).toContain('telegram-qr-modules');
		expect(svgDark).toContain('id="text-vet-crew"');
		expect(svgDark).toContain('id="text-hospital"');

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
		expect(svgWhite).toContain('Mon–Fri 10:00 – 18:00');
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
		expect(front).toContain('ВЕТЕРИНАРНИЙ ГОСПІТАЛЬ');
		expect(front).toContain('Exotic, Wild & Special');
		// Front does not contain QR code
		expect(front).not.toContain('telegram-qr-modules');

		const back = generateCardSvg({
			material: 'double',
			side: 'back',
			solidTheme: 'dark',
			lang: 'uk'
		});
		expect(back).toContain('+380 77 501 01 01');
		expect(back).toContain('Пн–Пт 10:00 – 18:00');
		expect(back).toContain('telegram-qr-modules');
		expect(back).toContain('vet-crew-hospital.org');
	});

	it('генерує валідний SVG для односторонньої картки (solid)', () => {
		const singleDark = generateCardSvg({
			material: 'single',
			solidTheme: 'dark',
			lang: 'uk'
		});
		expect(singleDark).toContain('fill="#13371B"');
		expect(singleDark).toContain('+380 77 501 01 01');
		expect(singleDark).toContain('telegram-qr-modules');

		const singleLight = generateCardSvg({
			material: 'single',
			solidTheme: 'light',
			lang: 'en'
		});
		expect(singleLight).toContain('fill="#FFFFFF"');
		expect(singleLight).toContain('VETERINARY HOSPITAL');
		expect(singleLight).toContain('Mon–Fri 10:00 – 18:00');
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
});
