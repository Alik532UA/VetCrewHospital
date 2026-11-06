/**
 * ORACAL® 641 Economy Cal (Matt) Palette
 *
 * Dedicated fixed vinyl palette for outdoor physical signage and plotter cutting.
 * Used exclusively for directory steles and physical production mockups.
 */

export type OracalCategory =
	'green' | 'blue' | 'yellow_orange' | 'red_pink' | 'violet' | 'neutral' | 'brown' | 'metallic';

export interface OracalCategoryMeta {
	id: OracalCategory | 'all';
	nameUk: string;
	nameEn: string;
}

export const ORACAL_CATEGORIES: OracalCategoryMeta[] = [
	{ id: 'all', nameUk: 'Всі плівки (59)', nameEn: 'All Films (59)' },
	{ id: 'green', nameUk: 'Зелені (7)', nameEn: 'Greens (7)' },
	{ id: 'blue', nameUk: 'Сині та бірюзові (16)', nameEn: 'Blues (16)' },
	{ id: 'yellow_orange', nameUk: 'Жовті та помаранчеві (8)', nameEn: 'Yellows & Oranges (8)' },
	{ id: 'red_pink', nameUk: 'Червоні та рожеві (9)', nameEn: 'Reds & Pinks (9)' },
	{ id: 'violet', nameUk: 'Фіолетові (4)', nameEn: 'Violets (4)' },
	{ id: 'neutral', nameUk: 'Нейтральні / Чорно-білі (7)', nameEn: 'Neutrals (7)' },
	{ id: 'brown', nameUk: 'Коричневі та беж (5)', nameEn: 'Browns & Beige (5)' },
	{ id: 'metallic', nameUk: 'Металіки (3)', nameEn: 'Metallics (3)' }
];

export interface OracalColor {
	code: string;
	nameEn: string;
	nameUk: string;
	finish: 'Matt';
	r: number;
	g: number;
	b: number;
	hex: string;
	category: OracalCategory;
}

export const ORACAL_641_PALETTE: readonly OracalColor[] = [
	{
		code: '000M',
		nameEn: 'Transparent',
		nameUk: 'Прозорий',
		finish: 'Matt',
		r: 213,
		g: 213,
		b: 219,
		hex: '#D5D5DB',
		category: 'neutral'
	},
	{
		code: '010M',
		nameEn: 'White',
		nameUk: 'Білий',
		finish: 'Matt',
		r: 231,
		g: 234,
		b: 238,
		hex: '#E7EAEE',
		category: 'neutral'
	},
	{
		code: '020M',
		nameEn: 'Golden yellow',
		nameUk: 'Золотисто-жовтий',
		finish: 'Matt',
		r: 252,
		g: 166,
		b: 0,
		hex: '#FCA600',
		category: 'yellow_orange'
	},
	{
		code: '019M',
		nameEn: 'Signal yellow',
		nameUk: 'Сигнальний жовтий',
		finish: 'Matt',
		r: 232,
		g: 167,
		b: 0,
		hex: '#E8A700',
		category: 'yellow_orange'
	},
	{
		code: '021M',
		nameEn: 'Yellow',
		nameUk: 'Жовтий',
		finish: 'Matt',
		r: 254,
		g: 198,
		b: 0,
		hex: '#FEC600',
		category: 'yellow_orange'
	},
	{
		code: '022M',
		nameEn: 'Light yellow',
		nameUk: 'Світло-жовтий',
		finish: 'Matt',
		r: 242,
		g: 203,
		b: 0,
		hex: '#F2CB00',
		category: 'yellow_orange'
	},
	{
		code: '025M',
		nameEn: 'Brimstone yellow',
		nameUk: 'Сірчано-жовтий',
		finish: 'Matt',
		r: 241,
		g: 225,
		b: 14,
		hex: '#F1E10E',
		category: 'yellow_orange'
	},
	{
		code: '312M',
		nameEn: 'Burgundy',
		nameUk: 'Бордовий',
		finish: 'Matt',
		r: 116,
		g: 2,
		b: 16,
		hex: '#740210',
		category: 'red_pink'
	},
	{
		code: '030M',
		nameEn: 'Dark red',
		nameUk: 'Темно-червоний',
		finish: 'Matt',
		r: 145,
		g: 8,
		b: 20,
		hex: '#910814',
		category: 'red_pink'
	},
	{
		code: '031M',
		nameEn: 'Red',
		nameUk: 'Червоний',
		finish: 'Matt',
		r: 175,
		g: 0,
		b: 11,
		hex: '#AF000B',
		category: 'red_pink'
	},
	{
		code: '032M',
		nameEn: 'Light red',
		nameUk: 'Світло-червоний',
		finish: 'Matt',
		r: 199,
		g: 12,
		b: 0,
		hex: '#C70C00',
		category: 'red_pink'
	},
	{
		code: '047M',
		nameEn: 'Orange red',
		nameUk: 'Оранжево-червоний',
		finish: 'Matt',
		r: 211,
		g: 48,
		b: 0,
		hex: '#D33000',
		category: 'yellow_orange'
	},
	{
		code: '034M',
		nameEn: 'Orange',
		nameUk: 'Оранжевий',
		finish: 'Matt',
		r: 221,
		g: 68,
		b: 0,
		hex: '#DD4400',
		category: 'yellow_orange'
	},
	{
		code: '036M',
		nameEn: 'Light orange',
		nameUk: 'Світло-оранжевий',
		finish: 'Matt',
		r: 236,
		g: 102,
		b: 0,
		hex: '#EC6600',
		category: 'yellow_orange'
	},
	{
		code: '035M',
		nameEn: 'Pastel orange',
		nameUk: 'Пастельно-оранжевий',
		finish: 'Matt',
		r: 255,
		g: 109,
		b: 0,
		hex: '#FF6D00',
		category: 'yellow_orange'
	},
	{
		code: '404M',
		nameEn: 'Purple',
		nameUk: 'Пурпуровий',
		finish: 'Matt',
		r: 65,
		g: 40,
		b: 114,
		hex: '#412872',
		category: 'violet'
	},
	{
		code: '040M',
		nameEn: 'Violet',
		nameUk: 'Фіолетовий',
		finish: 'Matt',
		r: 93,
		g: 43,
		b: 104,
		hex: '#5D2B68',
		category: 'violet'
	},
	{
		code: '043M',
		nameEn: 'Lavender',
		nameUk: 'Лавандовий',
		finish: 'Matt',
		r: 120,
		g: 95,
		b: 162,
		hex: '#785FA2',
		category: 'violet'
	},
	{
		code: '042M',
		nameEn: 'Lilac',
		nameUk: 'Бузковий',
		finish: 'Matt',
		r: 186,
		g: 148,
		b: 188,
		hex: '#BA94BC',
		category: 'violet'
	},
	{
		code: '041M',
		nameEn: 'Pink',
		nameUk: 'Рожевий',
		finish: 'Matt',
		r: 195,
		g: 40,
		b: 106,
		hex: '#C3286A',
		category: 'red_pink'
	},
	{
		code: '045M',
		nameEn: 'Soft pink',
		nameUk: 'Ніжно-рожевий',
		finish: 'Matt',
		r: 239,
		g: 135,
		b: 184,
		hex: '#EF87B8',
		category: 'red_pink'
	},
	{
		code: '562M',
		nameEn: 'Deep sea blue',
		nameUk: 'Морська глибина',
		finish: 'Matt',
		r: 19,
		g: 29,
		b: 57,
		hex: '#131D39',
		category: 'blue'
	},
	{
		code: '518M',
		nameEn: 'Steel blue',
		nameUk: 'Сталевий синій',
		finish: 'Matt',
		r: 15,
		g: 17,
		b: 58,
		hex: '#0F113A',
		category: 'blue'
	},
	{
		code: '050M',
		nameEn: 'Dark blue',
		nameUk: 'Темно-синій',
		finish: 'Matt',
		r: 28,
		g: 47,
		b: 94,
		hex: '#1C2F5E',
		category: 'blue'
	},
	{
		code: '065M',
		nameEn: 'Cobalt blue',
		nameUk: 'Кобальт синій',
		finish: 'Matt',
		r: 13,
		g: 31,
		b: 106,
		hex: '#0D1F6A',
		category: 'blue'
	},
	{
		code: '049M',
		nameEn: 'King blue',
		nameUk: 'Королівський синій',
		finish: 'Matt',
		r: 23,
		g: 43,
		b: 121,
		hex: '#172B79',
		category: 'blue'
	},
	{
		code: '086M',
		nameEn: 'Brilliant blue',
		nameUk: 'Діамантовий синій',
		finish: 'Matt',
		r: 27,
		g: 47,
		b: 170,
		hex: '#1B2FAA',
		category: 'blue'
	},
	{
		code: '067M',
		nameEn: 'Blue',
		nameUk: 'Синій',
		finish: 'Matt',
		r: 0,
		g: 58,
		b: 120,
		hex: '#003A78',
		category: 'blue'
	},
	{
		code: '057M',
		nameEn: 'Traffic blue',
		nameUk: 'Дорожній синій',
		finish: 'Matt',
		r: 0,
		g: 65,
		b: 142,
		hex: '#00418E',
		category: 'blue'
	},
	{
		code: '051M',
		nameEn: 'Gentian blue',
		nameUk: 'Тирличевий синій',
		finish: 'Matt',
		r: 0,
		g: 69,
		b: 131,
		hex: '#004583',
		category: 'blue'
	},
	{
		code: '098M',
		nameEn: 'Gentian',
		nameUk: 'Тирлич',
		finish: 'Matt',
		r: 0,
		g: 79,
		b: 159,
		hex: '#004F9F',
		category: 'blue'
	},
	{
		code: '052M',
		nameEn: 'Azure blue',
		nameUk: 'Лазурний',
		finish: 'Matt',
		r: 0,
		g: 94,
		b: 173,
		hex: '#005EAD',
		category: 'blue'
	},
	{
		code: '084M',
		nameEn: 'Sky blue',
		nameUk: 'Небесно-синій',
		finish: 'Matt',
		r: 0,
		g: 116,
		b: 187,
		hex: '#0074BB',
		category: 'blue'
	},
	{
		code: '053M',
		nameEn: 'Light blue',
		nameUk: 'Світло-синій',
		finish: 'Matt',
		r: 0,
		g: 136,
		b: 195,
		hex: '#0088C3',
		category: 'blue'
	},
	{
		code: '056M',
		nameEn: 'Ice blue',
		nameUk: 'Крижаний синій',
		finish: 'Matt',
		r: 67,
		g: 162,
		b: 211,
		hex: '#43A2D3',
		category: 'blue'
	},
	{
		code: '066M',
		nameEn: 'Turquoise blue',
		nameUk: 'Бірюзово-синій',
		finish: 'Matt',
		r: 0,
		g: 131,
		b: 142,
		hex: '#00838E',
		category: 'blue'
	},
	{
		code: '054M',
		nameEn: 'Turquoise',
		nameUk: 'Бірюзовий',
		finish: 'Matt',
		r: 0,
		g: 155,
		b: 151,
		hex: '#009B97',
		category: 'blue'
	},
	{
		code: '055M',
		nameEn: 'Mint',
		nameUk: "М'ятний",
		finish: 'Matt',
		r: 95,
		g: 206,
		b: 183,
		hex: '#5FCEB7',
		category: 'blue'
	},
	{
		code: '060M',
		nameEn: 'Dark green',
		nameUk: 'Темно-зелений',
		finish: 'Matt',
		r: 0,
		g: 60,
		b: 36,
		hex: '#003C24',
		category: 'green'
	},
	{
		code: '613M',
		nameEn: 'Forest green',
		nameUk: 'Лісовий зелений',
		finish: 'Matt',
		r: 0,
		g: 82,
		b: 54,
		hex: '#005236',
		category: 'green'
	},
	{
		code: '061M',
		nameEn: 'Green',
		nameUk: 'Зелений',
		finish: 'Matt',
		r: 0,
		g: 122,
		b: 77,
		hex: '#007A4D',
		category: 'green'
	},
	{
		code: '068M',
		nameEn: 'Grass green',
		nameUk: "Трав'яний зелений",
		finish: 'Matt',
		r: 0,
		g: 120,
		b: 63,
		hex: '#00783F',
		category: 'green'
	},
	{
		code: '062M',
		nameEn: 'Light green',
		nameUk: 'Світло-зелений',
		finish: 'Matt',
		r: 0,
		g: 137,
		b: 58,
		hex: '#00893A',
		category: 'green'
	},
	{
		code: '064M',
		nameEn: 'Yellow green',
		nameUk: 'Жовто-зелений',
		finish: 'Matt',
		r: 35,
		g: 155,
		b: 17,
		hex: '#239B11',
		category: 'green'
	},
	{
		code: '063M',
		nameEn: 'Lime-tree green',
		nameUk: 'Липовий зелений',
		finish: 'Matt',
		r: 106,
		g: 167,
		b: 47,
		hex: '#6AA72F',
		category: 'green'
	},
	{
		code: '800M',
		nameEn: 'Nougat brown',
		nameUk: 'Нуга коричневий',
		finish: 'Matt',
		r: 85,
		g: 51,
		b: 28,
		hex: '#55331C',
		category: 'brown'
	},
	{
		code: '083M',
		nameEn: 'Nut brown',
		nameUk: 'Горіховий коричневий',
		finish: 'Matt',
		r: 175,
		g: 89,
		b: 30,
		hex: '#AF591E',
		category: 'brown'
	},
	{
		code: '081M',
		nameEn: 'Light brown',
		nameUk: 'Світло-коричневий',
		finish: 'Matt',
		r: 168,
		g: 135,
		b: 90,
		hex: '#A8875A',
		category: 'brown'
	},
	{
		code: '082M',
		nameEn: 'Beige',
		nameUk: 'Бежевий',
		finish: 'Matt',
		r: 205,
		g: 192,
		b: 158,
		hex: '#CDC09E',
		category: 'brown'
	},
	{
		code: '023M',
		nameEn: 'Cream',
		nameUk: 'Кремовий',
		finish: 'Matt',
		r: 231,
		g: 210,
		b: 147,
		hex: '#E7D293',
		category: 'brown'
	},
	{
		code: '070M',
		nameEn: 'Black',
		nameUk: 'Чорний',
		finish: 'Matt',
		r: 6,
		g: 6,
		b: 7,
		hex: '#060607',
		category: 'neutral'
	},
	{
		code: '073M',
		nameEn: 'Dark grey',
		nameUk: 'Темно-сірий',
		finish: 'Matt',
		r: 75,
		g: 76,
		b: 76,
		hex: '#4B4C4C',
		category: 'neutral'
	},
	{
		code: '071M',
		nameEn: 'Grey',
		nameUk: 'Сірий',
		finish: 'Matt',
		r: 117,
		g: 125,
		b: 124,
		hex: '#757D7C',
		category: 'neutral'
	},
	{
		code: '076M',
		nameEn: 'Telegrey',
		nameUk: 'Телесірий',
		finish: 'Matt',
		r: 128,
		g: 133,
		b: 136,
		hex: '#808588',
		category: 'neutral'
	},
	{
		code: '074M',
		nameEn: 'Middle grey',
		nameUk: 'Середньо-сірий',
		finish: 'Matt',
		r: 138,
		g: 143,
		b: 140,
		hex: '#8A8F8C',
		category: 'neutral'
	},
	{
		code: '072M',
		nameEn: 'Light grey',
		nameUk: 'Світло-сірий',
		finish: 'Matt',
		r: 192,
		g: 195,
		b: 195,
		hex: '#C0C3C3',
		category: 'neutral'
	},
	{
		code: '090M',
		nameEn: 'Silver grey',
		nameUk: 'Сріблясто-сірий (металік)',
		finish: 'Matt',
		r: 111,
		g: 114,
		b: 116,
		hex: '#6F7274',
		category: 'metallic'
	},
	{
		code: '091M',
		nameEn: 'Gold',
		nameUk: 'Золотий (металік)',
		finish: 'Matt',
		r: 121,
		g: 101,
		b: 50,
		hex: '#796532',
		category: 'metallic'
	},
	{
		code: '092M',
		nameEn: 'Copper',
		nameUk: 'Мідний (металік)',
		finish: 'Matt',
		r: 105,
		g: 64,
		b: 30,
		hex: '#69401E',
		category: 'metallic'
	}
];

/**
 * Find Oracal 641 color by exact code (e.g., '068M' or '068')
 */
export function getOracalColorByCode(code: string): OracalColor | undefined {
	const normalized = code.trim().toUpperCase();
	return ORACAL_641_PALETTE.find(
		(c) =>
			c.code.toUpperCase() === normalized || c.code.replace('M', '') === normalized.replace('M', '')
	);
}

/**
 * Find Oracal 641 color by exact hex
 */
export function getOracalColorByHex(hex: string): OracalColor | undefined {
	const normalized = hex.trim().toUpperCase();
	return ORACAL_641_PALETTE.find((c) => c.hex.toUpperCase() === normalized);
}

export interface SteleOracalPreset {
	id: string;
	nameUk: string;
	nameEn: string;
	bgCode: string;
	fgCode: string;
	borderCode: string;
	descriptionUk: string;
	descriptionEn: string;
}

export const STELE_ORACAL_PRESETS: readonly SteleOracalPreset[] = [
	{
		id: 'photo-match',
		nameUk: 'Фірмовий зелений (як на фото)',
		nameEn: 'Brand Green (Photo Match)',
		bgCode: '068M',
		fgCode: '060M',
		borderCode: '060M',
		descriptionUk: 'Фон: 068M Травʼяний зелений • Текст і рамка: 060M Темно-зелений',
		descriptionEn: 'Base: 068M Grass green • Text & Border: 060M Dark green'
	},
	{
		id: 'forest-contrast',
		nameUk: 'Лісовий контраст',
		nameEn: 'Forest Contrast',
		bgCode: '613M',
		fgCode: '063M',
		borderCode: '063M',
		descriptionUk: 'Фон: 613M Лісовий зелений • Текст і рамка: 063M Липовий зелений',
		descriptionEn: 'Base: 613M Forest green • Text & Border: 063M Lime-tree green'
	},
	{
		id: 'clinical-white',
		nameUk: 'Світлий клінічний',
		nameEn: 'Clinical Clean',
		bgCode: '010M',
		fgCode: '060M',
		borderCode: '060M',
		descriptionUk: 'Фон: 010M Білий • Текст і рамка: 060M Темно-зелений',
		descriptionEn: 'Base: 010M White • Text & Border: 060M Dark green'
	},
	{
		id: 'gold-prestige',
		nameUk: 'Преміум темно-зелений + золото',
		nameEn: 'Deep Green + Gold Metallic',
		bgCode: '060M',
		fgCode: '091M',
		borderCode: '091M',
		descriptionUk: 'Фон: 060M Темно-зелений • Текст і рамка: 091M Золото (металік)',
		descriptionEn: 'Base: 060M Dark green • Text & Border: 091M Gold (metallic)'
	},
	{
		id: 'monochrome',
		nameUk: 'Графічний монохром',
		nameEn: 'Graphic Monochrome',
		bgCode: '070M',
		fgCode: '010M',
		borderCode: '010M',
		descriptionUk: 'Фон: 070M Чорний матовий • Текст і рамка: 010M Білий',
		descriptionEn: 'Base: 070M Black matt • Text & Border: 010M White'
	},
	{
		id: 'medical-blue',
		nameUk: 'Медичний сапфір',
		nameEn: 'Medical Sapphire',
		bgCode: '050M',
		fgCode: '010M',
		borderCode: '084M',
		descriptionUk: 'Фон: 050M Темно-синій • Текст: 010M Білий • Рамка: 084M Небесно-синій',
		descriptionEn: 'Base: 050M Dark blue • Text: 010M White • Border: 084M Sky blue'
	}
];
