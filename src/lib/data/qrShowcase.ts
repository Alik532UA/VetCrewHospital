export type ServiceId = 'wifi' | 'instagram' | 'reviews' | 'website';
export type PlaqueId = 'background' | ServiceId;

export type ReviewVariant = 'vidhuk' | 'google-reviews' | 'reviews';
export type WebsiteVariant = 'v2' | 'v1';

export interface QrFileVariant {
	bg: string;
	nobg: string;
	labelUk: string;
	labelEn: string;
}

export const REVIEW_FILES: Record<ReviewVariant, QrFileVariant> = {
	vidhuk: {
		bg: 'vidhuk.svg',
		nobg: 'vidhuk-nobg.svg',
		labelUk: 'Відгуки (UA)',
		labelEn: 'Reviews (UA)'
	},
	'google-reviews': {
		bg: 'google-reviews.svg',
		nobg: 'google-reviews-nobg.svg',
		labelUk: 'Google Reviews',
		labelEn: 'Google Reviews'
	},
	reviews: {
		bg: 'reviews.svg',
		nobg: 'reviews-nobg.svg',
		labelUk: 'Reviews',
		labelEn: 'Reviews'
	}
};

export const WEBSITE_FILES: Record<WebsiteVariant, QrFileVariant> = {
	v2: {
		bg: 'website-v2.svg',
		nobg: 'website-v2-nobg.svg',
		labelUk: 'Валентина',
		labelEn: 'Valentyna'
	},
	v1: {
		bg: 'website.svg',
		nobg: 'website-nobg.svg',
		labelUk: 'Алік',
		labelEn: 'Alik'
	}
};

export interface QrShowcaseConfig {
	serviceOrder: ServiceId[];
	reviewVariant: ReviewVariant;
	websiteVariant: WebsiteVariant;
	withBg: boolean;
	stageTheme: string;
	syncFgColors: boolean;
	sharedFgCode: string;
	cardBgCodes: Record<PlaqueId, string>;
	cardFgCodes: Record<ServiceId, string>;
}

export interface QrParsedConfig {
	serviceOrder: ServiceId[];
	reviewVariant: ReviewVariant;
	websiteVariant: WebsiteVariant;
	withBg: boolean;
	stageTheme: string;
	syncFgColors: boolean;
	sharedFgCode: string;
	cardBgCodes: Record<PlaqueId, string>;
	cardFgCodes: Record<ServiceId, string>;
}

export const DEFAULT_QR_CONFIG: QrShowcaseConfig = {
	serviceOrder: ['wifi', 'instagram', 'reviews', 'website'],
	reviewVariant: 'vidhuk',
	websiteVariant: 'v2',
	withBg: true,
	stageTheme: 'checker',
	syncFgColors: true,
	sharedFgCode: '060M',
	cardBgCodes: {
		background: '020M',
		wifi: '020M',
		instagram: '068M',
		reviews: '021M',
		website: '063M'
	},
	cardFgCodes: {
		wifi: '060M',
		instagram: '060M',
		reviews: '060M',
		website: '060M'
	}
};

function toBase64(str: string): string {
	if (typeof btoa === 'function') {
		return btoa(unescape(encodeURIComponent(str)));
	}
	return Buffer.from(str, 'utf-8').toString('base64');
}

function fromBase64(b64: string): string {
	if (typeof atob === 'function') {
		return decodeURIComponent(escape(atob(b64)));
	}
	return Buffer.from(b64, 'base64').toString('utf-8');
}

/**
 * Serializes QR showcase configuration into a compact Base64 token with prefix "VQR1:".
 */
export function serializeQrConfig(config: QrShowcaseConfig): string {
	const payload = {
		v: 1,
		so: config.serviceOrder,
		rv: config.reviewVariant,
		wv: config.websiteVariant,
		wb: config.withBg ? 1 : 0,
		st: config.stageTheme,
		sf: config.syncFgColors ? 1 : 0,
		fg: config.sharedFgCode,
		bg: config.cardBgCodes,
		fgs: config.cardFgCodes
	};
	return `VQR1:${toBase64(JSON.stringify(payload))}`;
}

/**
 * Parses and strictly validates a QR configuration string.
 * Supports:
 * - Hybrid message containing "VQR1:..."
 * - Standalone token "VQR1:..."
 * - Share URL containing "?qr=VQR1:..."
 * - Raw JSON
 */
export function parseQrConfig(
	input: string
): { success: true; data: QrParsedConfig } | { success: false; error: string } {
	if (!input || typeof input !== 'string') {
		return { success: false, error: 'Порожній текст конфігурації.' };
	}

	let token = input.trim();
	const urlMatch = token.match(/[?&]qr=([A-Za-z0-9+/=_%-]+)/i);
	if (urlMatch && urlMatch[1]) {
		token = decodeURIComponent(urlMatch[1]);
	}

	const match = token.match(/VQR1:([A-Za-z0-9+/=_-]+)/);
	let jsonStr: string;

	if (match && match[1]) {
		try {
			jsonStr = fromBase64(match[1]);
		} catch {
			return {
				success: false,
				error: 'Некоректний код конфігурації. Будь ласка, перевірте скопійований текст.'
			};
		}
	} else if (token.startsWith('VQR1:')) {
		try {
			jsonStr = fromBase64(token.slice(5));
		} catch {
			return {
				success: false,
				error: 'Некоректний код конфігурації. Будь ласка, перевірте скопійований текст.'
			};
		}
	} else {
		jsonStr = token;
	}

	let obj: Record<string, unknown>;
	try {
		obj = JSON.parse(jsonStr);
	} catch {
		return {
			success: false,
			error: 'Некоректний код конфігурації. Будь ласка, перевірте скопійований текст.'
		};
	}

	if (!obj || typeof obj !== 'object') {
		return { success: false, error: 'Некоректна структура конфігурації.' };
	}

	if (obj.v !== 1) {
		return { success: false, error: `Непідтримувана версія конфігурації: ${String(obj.v)}.` };
	}

	const validServices: ServiceId[] = ['wifi', 'instagram', 'reviews', 'website'];
	const serviceOrder: ServiceId[] = [];
	if (Array.isArray(obj.so)) {
		for (const s of obj.so) {
			if (validServices.includes(s as ServiceId) && !serviceOrder.includes(s as ServiceId)) {
				serviceOrder.push(s as ServiceId);
			}
		}
	}
	for (const s of validServices) {
		if (!serviceOrder.includes(s)) {
			serviceOrder.push(s);
		}
	}

	const validReviews: ReviewVariant[] = ['vidhuk', 'google-reviews', 'reviews'];
	const reviewVariant: ReviewVariant = validReviews.includes(obj.rv as ReviewVariant)
		? (obj.rv as ReviewVariant)
		: 'vidhuk';

	const validWebsites: WebsiteVariant[] = ['v2', 'v1'];
	const websiteVariant: WebsiteVariant = validWebsites.includes(obj.wv as WebsiteVariant)
		? (obj.wv as WebsiteVariant)
		: 'v2';

	const withBg = obj.wb === 0 ? false : true;
	const stageTheme = typeof obj.st === 'string' && obj.st.trim() ? obj.st.trim() : 'checker';
	const syncFgColors = obj.sf === 0 ? false : true;
	const sharedFgCode = typeof obj.fg === 'string' && obj.fg.trim() ? obj.fg.trim() : '060M';

	const defaultBgs: Record<PlaqueId, string> = {
		background: '020M',
		wifi: '020M',
		instagram: '068M',
		reviews: '021M',
		website: '063M'
	};
	const rawBgs = (obj.bg && typeof obj.bg === 'object' ? obj.bg : {}) as Record<string, string>;
	const cardBgCodes: Record<PlaqueId, string> = {
		background: rawBgs.background || defaultBgs.background,
		wifi: rawBgs.wifi || defaultBgs.wifi,
		instagram: rawBgs.instagram || defaultBgs.instagram,
		reviews: rawBgs.reviews || defaultBgs.reviews,
		website: rawBgs.website || defaultBgs.website
	};

	const rawFgs = (obj.fgs && typeof obj.fgs === 'object' ? obj.fgs : {}) as Record<string, string>;
	const cardFgCodes: Record<ServiceId, string> = {
		wifi: rawFgs.wifi || sharedFgCode,
		instagram: rawFgs.instagram || sharedFgCode,
		reviews: rawFgs.reviews || sharedFgCode,
		website: rawFgs.website || sharedFgCode
	};

	return {
		success: true,
		data: {
			serviceOrder,
			reviewVariant,
			websiteVariant,
			withBg,
			stageTheme,
			syncFgColors,
			sharedFgCode,
			cardBgCodes,
			cardFgCodes
		}
	};
}

/**
 * Generates a human-readable share text for client communication including the VQR1 code.
 */
export function generateQrShareText(config: QrShowcaseConfig, token: string): string {
	const reviewLabel = REVIEW_FILES[config.reviewVariant]?.labelUk ?? config.reviewVariant;
	const websiteLabel = WEBSITE_FILES[config.websiteVariant]?.labelUk ?? config.websiteVariant;
	const orderNames = config.serviceOrder
		.map((id, idx) => {
			const name =
				id === 'wifi'
					? 'Wi-Fi'
					: id === 'instagram'
						? 'Instagram'
						: id === 'reviews'
							? `Відгуки (${reviewLabel})`
							: `Сайт (${websiteLabel})`;
			const bgCode = config.cardBgCodes[id] ?? '020M';
			return `${idx + 1}. ${name} [ORACAL ${bgCode}]`;
		})
		.join('\n  ');

	return `📐 Конфігурація QR-навігації та табличок сервісів Vet Crew Hospital
• Порядок табличок у ряду:
  ${orderNames}
• Варіант напису відгуків: ${reviewLabel}
• Варіант сайту: ${websiteLabel}
• Режим контейнера: ${config.withBg ? `З підкладкою (ORACAL ${config.cardBgCodes.background ?? '020M'})` : 'Прозорий (без фону)'}
• Колір графіки / QR-кодів: ORACAL ${config.sharedFgCode}${config.syncFgColors ? ' (спільний для всіх)' : ' (індивідуальний)'}
• Тло прев'ю: ${config.stageTheme}

Код конфігурації:
${token}`;
}

/**
 * Generates a direct link with the QR token preloaded in URL query parameter.
 */
export function generateQrShareUrl(token: string): string {
	const origin =
		typeof window !== 'undefined' ? window.location.origin : 'https://vet-crew-hospital.org';
	return `${origin}/brandbook#qr-codes?qr=${encodeURIComponent(token)}`;
}
