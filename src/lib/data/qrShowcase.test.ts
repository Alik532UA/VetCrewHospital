import { describe, it, expect } from 'vitest';
import {
	REVIEW_FILES,
	WEBSITE_FILES,
	DEFAULT_QR_CONFIG,
	serializeQrConfig,
	parseQrConfig,
	generateQrShareText,
	generateQrShareUrl,
	type QrShowcaseConfig
} from './qrShowcase';

describe('qrShowcase data', () => {
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

	it('serializes and parses default configuration correctly', () => {
		const token = serializeQrConfig(DEFAULT_QR_CONFIG);
		expect(token.startsWith('VQR1:')).toBe(true);

		const parsed = parseQrConfig(token);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.serviceOrder).toEqual(['wifi', 'instagram', 'reviews', 'website']);
			expect(parsed.data.reviewVariant).toBe('vidhuk');
			expect(parsed.data.websiteVariant).toBe('v2');
			expect(parsed.data.withBg).toBe(true);
			expect(parsed.data.sharedFgCode).toBe('060M');
			expect(parsed.data.cardBgCodes.wifi).toBe('020M');
			expect(parsed.data.cardBgCodes.instagram).toBe('068M');
		}
	});

	it('handles custom order, variants, unlinked colors in config', () => {
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
		}
	});

	it('parses tokens from hybrid share text and URLs', () => {
		const token = serializeQrConfig(DEFAULT_QR_CONFIG);
		const shareText = generateQrShareText(DEFAULT_QR_CONFIG, token);
		expect(shareText).toContain('Конфігурація QR-навігації');
		expect(shareText).toContain(token);

		const parsedFromText = parseQrConfig(shareText);
		expect(parsedFromText.success).toBe(true);

		const shareUrl = generateQrShareUrl(token);
		expect(shareUrl).toContain('qr=');
		const parsedFromUrl = parseQrConfig(shareUrl);
		expect(parsedFromUrl.success).toBe(true);
	});

	it('gracefully handles invalid configuration inputs', () => {
		expect(parseQrConfig('').success).toBe(false);
		expect(parseQrConfig('random garbage text').success).toBe(false);
		expect(parseQrConfig('VQR1:invalidBase64!!').success).toBe(false);
		expect(parseQrConfig('{"v":999}').success).toBe(false);
	});
});
