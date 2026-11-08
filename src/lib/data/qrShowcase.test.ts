import { describe, it, expect } from 'vitest';
import {
	REVIEW_FILES,
	WEBSITE_FILES,
	DEFAULT_QR_CONFIG,
	DEFAULT_BG_TRANSFORM,
	serializeQrConfig,
	parseQrConfig,
	generateQrShareText,
	generateQrShareUrl,
	buildQrSvg,
	type QrShowcaseConfig
} from './qrShowcase';
import { QR_BACKGROUND_SHAPES, DEFAULT_BG_SHAPE_ID, getQrBgShapeById } from './qrBackgroundShapes';

describe('qrShowcase data and shapes', () => {
	it('defines all 18 background shapes with default as shape-default', () => {
		expect(QR_BACKGROUND_SHAPES.length).toBe(18);
		expect(DEFAULT_BG_SHAPE_ID).toBe('shape-default');

		const defaultShape = getQrBgShapeById('shape-default');
		expect(defaultShape.id).toBe('shape-default');
		expect(defaultShape.nameUk).toContain('Органічна форма 1');

		const classicShape = getQrBgShapeById('shape-classic');
		expect(classicShape.id).toBe('shape-classic');

		// Unknown fallback to default
		const fallback = getQrBgShapeById('non-existent');
		expect(fallback.id).toBe('shape-default');
	});

	it('defines all expected review variants with bg and nobg filenames', () => {
		expect(REVIEW_FILES.vidhuk.bg).toBe('vidhuk.svg');
		expect(REVIEW_FILES.vidhuk.nobg).toBe('vidhuk-nobg.svg');
		expect(REVIEW_FILES['google-reviews'].bg).toBe('google-reviews.svg');
		expect(REVIEW_FILES['google-reviews'].nobg).toBe('google-reviews-nobg.svg');
		expect(REVIEW_FILES.reviews.bg).toBe('reviews.svg');
		expect(REVIEW_FILES.reviews.nobg).toBe('reviews-nobg.svg');
	});

	it('defines website variants with correct filenames', () => {
		expect(WEBSITE_FILES.v2.bg).toBe('website-v2.svg');
		expect(WEBSITE_FILES.v2.nobg).toBe('website-v2-nobg.svg');
		expect(WEBSITE_FILES.v1.bg).toBe('website.svg');
		expect(WEBSITE_FILES.v1.nobg).toBe('website-nobg.svg');
	});

	it('serializes and parses default configuration correctly including shape & transform', () => {
		const token = serializeQrConfig(DEFAULT_QR_CONFIG);
		expect(token.startsWith('VQR1:')).toBe(true);

		const parsed = parseQrConfig(token);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.serviceOrder).toEqual(['reviews', 'website', 'wifi', 'instagram']);
			expect(parsed.data.reviewVariant).toBe('reviews');
			expect(parsed.data.websiteVariant).toBe('v2');
			expect(parsed.data.withBg).toBe(true);
			expect(parsed.data.stageTheme).toBe('dark');
			expect(parsed.data.sharedFgCode).toBe('060M');
			expect(parsed.data.cardBgCodes.background).toBe('020M');
			expect(parsed.data.cardBgCodes.reviews).toBe('021M');
			expect(parsed.data.cardBgCodes.website).toBe('010M');
			expect(parsed.data.cardBgCodes.wifi).toBe('063M');
			expect(parsed.data.cardBgCodes.instagram).toBe('021M');
			expect(parsed.data.syncBgShapes).toBe(true);
			expect(parsed.data.sharedBgTransform).toEqual(DEFAULT_BG_TRANSFORM);
			expect(parsed.data.cardBgTransforms.wifi.shapeId).toBe('shape-spot-2');
			expect(parsed.data.cardBgTransforms.wifi.scale).toBe(1.05);
			expect(parsed.data.cardBgTransforms.wifi.offsetX).toBe(5);
			expect(parsed.data.cardBgTransforms.wifi.offsetY).toBe(46);
		}
	});

	it('handles custom order, variants, unlinked colors, shapes, rotations, scale and offset', () => {
		const customConfig: QrShowcaseConfig = {
			serviceOrder: ['reviews', 'website', 'instagram', 'wifi'],
			reviewVariant: 'google-reviews',
			websiteVariant: 'v1',
			withBg: false,
			stageTheme: 'dark',
			syncFgColors: false,
			sharedFgCode: '070M',
			cardBgCodes: {
				background: '010M',
				wifi: '019M',
				instagram: '613M',
				reviews: '063M',
				website: '091M'
			},
			cardFgCodes: {
				wifi: '010M',
				instagram: '020M',
				reviews: '060M',
				website: '070M'
			},
			syncBgShapes: false,
			sharedBgTransform: {
				shapeId: 'shape-spot-3',
				rotation: 90,
				flipX: true,
				scale: 1.1,
				offsetX: 15,
				offsetY: -20
			},
			cardBgTransforms: {
				background: {
					shapeId: 'shape-classic',
					rotation: 0,
					flipX: false,
					scale: 1.0,
					offsetX: 0,
					offsetY: 0
				},
				wifi: {
					shapeId: 'shape-spot-1',
					rotation: 45,
					flipX: false,
					scale: 0.9,
					offsetX: 10,
					offsetY: 5
				},
				instagram: {
					shapeId: 'shape-spot-2',
					rotation: 180,
					flipX: true,
					scale: 1.05,
					offsetX: -12,
					offsetY: 8
				},
				reviews: {
					shapeId: 'shape-var-1',
					rotation: 270,
					flipX: false,
					scale: 1.0,
					offsetX: 0,
					offsetY: 0
				},
				website: {
					shapeId: 'shape-var-2',
					rotation: 15,
					flipX: true,
					scale: 0.95,
					offsetX: 0,
					offsetY: -10
				}
			}
		};

		const token = serializeQrConfig(customConfig);
		const parsed = parseQrConfig(token);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.serviceOrder).toEqual(['reviews', 'website', 'instagram', 'wifi']);
			expect(parsed.data.reviewVariant).toBe('google-reviews');
			expect(parsed.data.websiteVariant).toBe('v1');
			expect(parsed.data.withBg).toBe(false);
			expect(parsed.data.stageTheme).toBe('dark');
			expect(parsed.data.syncFgColors).toBe(false);
			expect(parsed.data.cardBgCodes.reviews).toBe('063M');
			expect(parsed.data.cardFgCodes.instagram).toBe('020M');
			expect(parsed.data.syncBgShapes).toBe(false);
			expect(parsed.data.sharedBgTransform).toEqual({
				shapeId: 'shape-spot-3',
				rotation: 90,
				flipX: true,
				scale: 1.1,
				offsetX: 15,
				offsetY: -20
			});
			expect(parsed.data.cardBgTransforms.instagram).toEqual({
				shapeId: 'shape-spot-2',
				rotation: 180,
				flipX: true,
				scale: 1.05,
				offsetX: -12,
				offsetY: 8
			});
		}
	});

	it('parses legacy tokens without shape data with complete backward compatibility', () => {
		// Old token containing only serviceOrder, colors, variants
		const legacyJson = JSON.stringify({
			v: 1,
			so: ['wifi', 'instagram', 'reviews', 'website'],
			rv: 'vidhuk',
			wv: 'v2',
			wb: 1,
			st: 'checker',
			sf: 1,
			fg: '060M',
			bg: { wifi: '020M' },
			fgs: { wifi: '060M' }
		});
		const legacyToken = `VQR1:${Buffer.from(legacyJson).toString('base64')}`;

		const parsed = parseQrConfig(legacyToken);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.syncBgShapes).toBe(true);
			expect(parsed.data.sharedBgTransform).toEqual(DEFAULT_BG_TRANSFORM);
		}
	});

	it('buildQrSvg produces correctly transformed SVG markup with scale and offset', () => {
		const shape = getQrBgShapeById('shape-default');
		const svg = buildQrSvg({
			foregroundInnerSvg: '<g id="icon" fill="#13371b"><rect width="10" height="10"/></g>',
			bgColorHex: '#ffb327',
			fgColorHex: '#13371b',
			showBg: true,
			shapeD: shape.d,
			rotation: 90,
			flipX: true,
			scale: 1.1,
			offsetX: 20,
			offsetY: -15
		});

		expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
		expect(svg).toContain('id="container-bg"');
		expect(svg).toContain(
			'transform="translate(420, 385) rotate(90) scale(-1.1, 1.1) translate(-400, -400)"'
		);
		expect(svg).toContain('<g id="icon" fill="#13371b">');
	});

	it('buildQrSvg omits background container when showBg is false', () => {
		const shape = getQrBgShapeById('shape-default');
		const svg = buildQrSvg({
			foregroundInnerSvg: '<g id="icon" fill="#13371b"><rect width="10" height="10"/></g>',
			bgColorHex: '#ffb327',
			fgColorHex: '#00aa00',
			showBg: false,
			shapeD: shape.d
		});

		expect(svg).not.toContain('id="container-bg"');
		expect(svg).toContain('<g id="icon" fill="#00aa00">');
	});

	it('parses tokens from hybrid share text and URLs', () => {
		const token = serializeQrConfig(DEFAULT_QR_CONFIG);
		const shareText = generateQrShareText(DEFAULT_QR_CONFIG, token);
		expect(shareText).toContain('Конфігурація QR-навігації');
		expect(shareText).toContain('Форма підкладки: Силует плями 2');
		expect(shareText).toContain(token);

		const parsedFromText = parseQrConfig(shareText);
		expect(parsedFromText.success).toBe(true);

		const shareUrl = generateQrShareUrl(token);
		expect(shareUrl).toContain('qr=');
		const parsedFromUrl = parseQrConfig(shareUrl);
		expect(parsedFromUrl.success).toBe(true);
	});
});
