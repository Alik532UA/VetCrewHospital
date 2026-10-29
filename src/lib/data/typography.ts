export type FontId = 'inglobal' | 'montserrat' | 'permanent';

export interface FontInfo {
	id: FontId;
	name: string;
	fontFamily: string;
	categoryUk: string;
	categoryEn: string;
	descUk: string;
	descEn: string;
	weights: string;
	file: string;
	sampleHead: string;
}

export const FONTS: FontInfo[] = [
	{
		id: 'inglobal',
		name: 'InGlobal Bold',
		fontFamily: 'InGlobal',
		categoryUk: 'Фірмовий дисплейний гротеск',
		categoryEn: 'Brand Display Grotesque',
		descUk: 'Ексклюзивний акцидентний шрифт назви «VET CREW HOSPITAL» із характерними геометричними скошеними кутами та сильною енергетикою.',
		descEn: 'Exclusive display typeface of the "VET CREW HOSPITAL" wordmark with sharp aerodynamic terminals.',
		weights: 'Bold 700',
		file: 'inglobalb.ttf',
		sampleHead: 'VET CREW HOSPITAL'
	},
	{
		id: 'montserrat',
		name: 'Montserrat Variable',
		fontFamily: 'Montserrat',
		categoryUk: 'Корпоративна робоча гарнітура',
		categoryEn: 'Primary Corporate Typeface',
		descUk: 'Універсальний геометричний гротеск для навігації, документації, інформаційних табличок, веб-інтерфейсів та поліграфії.',
		descEn: 'Clean geometric sans-serif for medical forms, navigational signs, web UI, and patient identity tags.',
		weights: 'Variable 100–900',
		file: 'Montserrat-VariableFont_wght.ttf',
		sampleHead: 'Турбота про кожне дике та екзотичне життя'
	},
	{
		id: 'permanent',
		name: 'Permanent Marker',
		fontFamily: 'Permanent Marker',
		categoryUk: 'Акцентний рукописний шрифт',
		categoryEn: 'Friendly Accent Marker Script',
		descUk: 'Живий теплий почерк для персональних нотаток лікарів, історій порятунку пацієнтів, наліпок та соцмереж.',
		descEn: 'Warm hand-drawn marker font for rescue stories, doctor personal notes, stickers, and awareness campaigns.',
		weights: 'Regular 400',
		file: 'PermanentMarker-Regular.ttf',
		sampleHead: 'Exotic. Wild. Special. Important!'
	}
];

export const FONT_SIZES: number[] = [20, 28, 36, 48, 64];

export interface TypographyPreset {
	labelUk: string;
	labelEn: string;
	textUk: string;
	textEn: string;
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
	{
		labelUk: 'Заголовок',
		labelEn: 'Headline',
		textUk: 'VET CREW HOSPITAL — Професійна турбота',
		textEn: 'VET CREW HOSPITAL — Specialized Animal Care'
	},
	{
		labelUk: 'Панграма (А–Я)',
		labelEn: 'Pangram',
		textUk: 'Жебракують філософи при ґанку церковнім, ввічливо благаючи дещицю коштів.',
		textEn: 'The quick brown fox jumps over the lazy dog.'
	},
	{
		labelUk: 'Слоган',
		labelEn: 'Slogan',
		textUk: 'Екзотичні. Дикі. Особливі. Важливі.',
		textEn: 'Exotic. Wild. Special. Important.'
	},
	{
		labelUk: 'Цифри та знаки',
		labelEn: 'Numbers & Info',
		textUk: '0123456789 — +380 77 501 01 01 · vetcrew.org',
		textEn: '0123456789 — +380 77 501 01 01 · vetcrew.org'
	}
];

