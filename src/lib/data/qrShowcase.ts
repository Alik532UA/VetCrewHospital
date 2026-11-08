import { getQrBgShapeById } from './qrBackgroundShapes';

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

export interface QrBgTransform {
	shapeId: string;
	rotation: number;
	flipX: boolean;
	scale: number;
	offsetX: number;
	offsetY: number;
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
	syncBgShapes: boolean;
	sharedBgTransform: QrBgTransform;
	cardBgTransforms: Record<PlaqueId, QrBgTransform>;
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
	syncBgShapes: boolean;
	sharedBgTransform: QrBgTransform;
	cardBgTransforms: Record<PlaqueId, QrBgTransform>;
}

export const DEFAULT_BG_TRANSFORM: QrBgTransform = {
	shapeId: 'shape-spot-2',
	rotation: 0,
	flipX: false,
	scale: 1.05,
	offsetX: 5,
	offsetY: 46
};

export const DEFAULT_QR_CONFIG: QrShowcaseConfig = {
	serviceOrder: ['reviews', 'website', 'wifi', 'instagram'],
	reviewVariant: 'reviews',
	websiteVariant: 'v2',
	withBg: true,
	stageTheme: 'dark',
	syncFgColors: true,
	sharedFgCode: '060M',
	cardBgCodes: {
		background: '020M',
		wifi: '063M',
		instagram: '021M',
		reviews: '021M',
		website: '010M'
	},
	cardFgCodes: {
		wifi: '060M',
		instagram: '060M',
		reviews: '060M',
		website: '060M'
	},
	syncBgShapes: true,
	sharedBgTransform: { ...DEFAULT_BG_TRANSFORM },
	cardBgTransforms: {
		background: { ...DEFAULT_BG_TRANSFORM },
		wifi: { ...DEFAULT_BG_TRANSFORM },
		instagram: { ...DEFAULT_BG_TRANSFORM },
		reviews: { ...DEFAULT_BG_TRANSFORM },
		website: { ...DEFAULT_BG_TRANSFORM }
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
 * Builds a dynamic SVG string with background silhouette and foreground elements.
 * Rotation, flip, scale, and offset are applied strictly to the background container;
 * the foreground (QR code, icons, text) remains upright and centered.
 */
export function buildQrSvg({
	foregroundInnerSvg,
	bgColorHex,
	fgColorHex,
	showBg,
	shapeD,
	rotation = 0,
	flipX = false,
	scale = 1.0,
	offsetX = 0,
	offsetY = 0
}: {
	foregroundInnerSvg?: string;
	bgColorHex: string;
	fgColorHex: string;
	showBg: boolean;
	shapeD: string;
	rotation?: number;
	flipX?: boolean;
	scale?: number;
	offsetX?: number;
	offsetY?: number;
}): string {
	const rot = ((Math.round(rotation) % 360) + 360) % 360;
	const s =
		typeof scale === 'number' && !isNaN(scale) && scale > 0 ? Number(scale.toFixed(2)) : 1.0;
	const ox = Math.round(offsetX || 0);
	const oy = Math.round(offsetY || 0);

	let transformAttr = '';
	if (rot !== 0 || flipX || s !== 1.0 || ox !== 0 || oy !== 0) {
		const transforms: string[] = [];
		transforms.push(`translate(${400 + ox}, ${400 + oy})`);
		if (rot !== 0) {
			transforms.push(`rotate(${rot})`);
		}
		const scaleX = flipX ? -s : s;
		const scaleY = s;
		if (scaleX !== 1 || scaleY !== 1) {
			transforms.push(`scale(${scaleX}, ${scaleY})`);
		}
		transforms.push('translate(-400, -400)');
		transformAttr = ` transform="${transforms.join(' ')}"`;
	}

	const bgPath = showBg
		? `  <path id="container-bg" fill="${bgColorHex}" d="${shapeD}"${transformAttr}/>\n`
		: '';

	let fgPart = '';
	if (foregroundInnerSvg) {
		fgPart = foregroundInnerSvg
			.replace(/fill="#13371b"/gi, `fill="${fgColorHex}"`)
			.replace(/fill="#101e14"/gi, `fill="${fgColorHex}"`);
		if (!fgPart.endsWith('\n')) fgPart += '\n';
	}

	// Dynamic safety viewBox so the shape is never cut off against the canvas boundary
	// Base artboard is 800x800 centered at (400, 400).
	const maxShapeExtent = 350 * s;
	const maxDistX = Math.max(400, Math.abs(ox) + maxShapeExtent + 10);
	const maxDistY = Math.max(400, Math.abs(oy) + maxShapeExtent + 10);
	const halfSize = Math.ceil(Math.max(maxDistX, maxDistY));
	const vbX = 400 - halfSize;
	const vbY = 400 - halfSize;
	const vbSize = halfSize * 2;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbSize} ${vbSize}" width="800" height="800" style="overflow: visible;">\n${bgPath}${fgPart}</svg>`;
}

/**
 * Serializes QR showcase configuration into a compact Base64 token with prefix "VQR1:".
 */
export function serializeQrConfig(config: QrShowcaseConfig): string {
	function packTransform(t: QrBgTransform) {
		const out: Record<string, unknown> = {
			s: t.shapeId,
			r: t.rotation,
			f: t.flipX ? 1 : 0
		};
		if (t.scale !== 1.0) out.sc = Math.round(t.scale * 100);
		if (t.offsetX !== 0) out.ox = Math.round(t.offsetX);
		if (t.offsetY !== 0) out.oy = Math.round(t.offsetY);
		return out;
	}

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
		fgs: config.cardFgCodes,
		sb: config.syncBgShapes ? 1 : 0,
		bt: packTransform(config.sharedBgTransform),
		bts: {
			background: packTransform(config.cardBgTransforms.background),
			wifi: packTransform(config.cardBgTransforms.wifi),
			instagram: packTransform(config.cardBgTransforms.instagram),
			reviews: packTransform(config.cardBgTransforms.reviews),
			website: packTransform(config.cardBgTransforms.website)
		}
	};
	return `VQR1:${toBase64(JSON.stringify(payload))}`;
}

function parseSingleTransform(raw: unknown, fallback: QrBgTransform): QrBgTransform {
	if (!raw || typeof raw !== 'object') return { ...fallback };
	const r = raw as Record<string, unknown>;
	const rawShapeId = typeof r.s === 'string' && r.s.trim() ? r.s.trim() : fallback.shapeId;
	const shape = getQrBgShapeById(rawShapeId);
	const rawRotation = typeof r.r === 'number' ? r.r : fallback.rotation;
	const rotation = ((Math.round(rawRotation) % 360) + 360) % 360;
	const flipX =
		r.f === 1 || r.f === true ? true : r.f === 0 || r.f === false ? false : fallback.flipX;

	const scale =
		typeof r.sc === 'number' && !isNaN(r.sc) && r.sc >= 30 && r.sc <= 250
			? Number((r.sc / 100).toFixed(2))
			: (fallback.scale ?? 1.0);
	const offsetX =
		typeof r.ox === 'number' && !isNaN(r.ox)
			? Math.max(-200, Math.min(200, Math.round(r.ox)))
			: (fallback.offsetX ?? 0);
	const offsetY =
		typeof r.oy === 'number' && !isNaN(r.oy)
			? Math.max(-200, Math.min(200, Math.round(r.oy)))
			: (fallback.offsetY ?? 0);

	return {
		shapeId: shape.id,
		rotation,
		flipX,
		scale,
		offsetX,
		offsetY
	};
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
		wifi: '063M',
		instagram: '021M',
		reviews: '021M',
		website: '010M'
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

	// Parse shape synchronization and transforms (backward compatible with old tokens)
	const syncBgShapes = obj.sb === 0 ? false : true;
	const sharedBgTransform = parseSingleTransform(obj.bt, DEFAULT_BG_TRANSFORM);

	const rawBts = (obj.bts && typeof obj.bts === 'object' ? obj.bts : {}) as Record<string, unknown>;
	const cardBgTransforms: Record<PlaqueId, QrBgTransform> = {
		background: parseSingleTransform(rawBts.background, sharedBgTransform),
		wifi: parseSingleTransform(rawBts.wifi, sharedBgTransform),
		instagram: parseSingleTransform(rawBts.instagram, sharedBgTransform),
		reviews: parseSingleTransform(rawBts.reviews, sharedBgTransform),
		website: parseSingleTransform(rawBts.website, sharedBgTransform)
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
			cardFgCodes,
			syncBgShapes,
			sharedBgTransform,
			cardBgTransforms
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

	const shape = getQrBgShapeById(config.sharedBgTransform.shapeId);
	const shapeInfo = config.syncBgShapes
		? `• Форма підкладки: ${shape.nameUk} (кути: ${config.sharedBgTransform.rotation}°${config.sharedBgTransform.flipX ? ', віддзеркалено ↔' : ''})`
		: '• Форма підкладки: індивідуальна для кожної таблички';

	return `📐 Конфігурація QR-навігації та табличок сервісів Vet Crew Hospital
• Порядок табличок у ряду:
  ${orderNames}
• Варіант напису відгуків: ${reviewLabel}
• Варіант сайту: ${websiteLabel}
• Режим контейнера: ${config.withBg ? `З підкладкою (ORACAL ${config.cardBgCodes.background ?? '020M'})` : 'Прозорий (без фону)'}
${shapeInfo}
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
