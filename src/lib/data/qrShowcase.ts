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
