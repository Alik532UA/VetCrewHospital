export type AnimalCategory = 'birds' | 'reptiles' | 'mammals' | 'exotics';

export interface AnimalItem {
	id: string;
	num: string;
	nameUk: string;
	nameEn: string;
	file: string;
	category: AnimalCategory;
}

export const ANIMALS: AnimalItem[] = [
	{
		id: 'parrot',
		num: '01',
		nameUk: 'Папуга',
		nameEn: 'Parrot',
		file: '01 - parrot.svg',
		category: 'birds'
	},
	{
		id: 'cockatoo',
		num: '02',
		nameUk: 'Какаду',
		nameEn: 'Cockatoo',
		file: '02 - cockatoo.svg',
		category: 'birds'
	},
	{
		id: 'cockatiel',
		num: '03',
		nameUk: 'Корела',
		nameEn: 'Cockatiel',
		file: '03 - cockatiel.svg',
		category: 'birds'
	},
	{
		id: 'falcon',
		num: '04',
		nameUk: 'Сокіл',
		nameEn: 'Falcon',
		file: '04 - falcon.svg',
		category: 'birds'
	},
	{
		id: 'hawk',
		num: '05',
		nameUk: 'Яструб',
		nameEn: 'Hawk',
		file: '05 - hawk.svg',
		category: 'birds'
	},
	{ id: 'owl', num: '06', nameUk: 'Сова', nameEn: 'Owl', file: '06 - owl.svg', category: 'birds' },
	{
		id: 'snake',
		num: '07',
		nameUk: 'Змія',
		nameEn: 'Snake',
		file: '07 - snake.svg',
		category: 'reptiles'
	},
	{
		id: 'turtle',
		num: '08',
		nameUk: 'Черепаха',
		nameEn: 'Turtle',
		file: '08 - turtle.svg',
		category: 'reptiles'
	},
	{
		id: 'bearded-dragon',
		num: '09',
		nameUk: 'Бородата агама',
		nameEn: 'Bearded Dragon',
		file: '09 - bearded dragon.svg',
		category: 'reptiles'
	},
	{
		id: 'gecko',
		num: '10',
		nameUk: 'Гекон',
		nameEn: 'Gecko',
		file: '10 - gecko.svg',
		category: 'reptiles'
	},
	{
		id: 'chameleon',
		num: '11',
		nameUk: 'Хамелеон',
		nameEn: 'Chameleon',
		file: '11 - chameleon.svg',
		category: 'reptiles'
	},
	{
		id: 'frog',
		num: '12',
		nameUk: 'Деревна жаба',
		nameEn: 'Tree Frog',
		file: '12 - frog.svg',
		category: 'reptiles'
	},
	{
		id: 'chinchilla',
		num: '13',
		nameUk: 'Шиншила',
		nameEn: 'Chinchilla',
		file: '13 - chinchilla.svg',
		category: 'mammals'
	},
	{
		id: 'rat',
		num: '14',
		nameUk: 'Декоративний щур',
		nameEn: 'Rat',
		file: '14 - rat.svg',
		category: 'mammals'
	},
	{
		id: 'mouse',
		num: '15',
		nameUk: 'Миша',
		nameEn: 'Mouse',
		file: '15 - mouse.svg',
		category: 'mammals'
	},
	{
		id: 'guinea-pig',
		num: '16',
		nameUk: 'Морська свинка',
		nameEn: 'Guinea Pig',
		file: '16 - guinea pig.svg',
		category: 'mammals'
	},
	{
		id: 'rabbit',
		num: '17',
		nameUk: 'Кролик',
		nameEn: 'Rabbit',
		file: '17 - rabbit.svg',
		category: 'mammals'
	},
	{
		id: 'squirrel',
		num: '18',
		nameUk: 'Білка',
		nameEn: 'Squirrel',
		file: '18 - squirrel.svg',
		category: 'mammals'
	},
	{
		id: 'ferret',
		num: '19',
		nameUk: 'Тхір',
		nameEn: 'Ferret',
		file: '19 - ferret.svg',
		category: 'mammals'
	},
	{
		id: 'hedgehog',
		num: '20',
		nameUk: 'Їжак',
		nameEn: 'Hedgehog',
		file: '20 - hedgehog.svg',
		category: 'mammals'
	},
	{
		id: 'angelfish',
		num: '21',
		nameUk: 'Скалярія',
		nameEn: 'Angelfish',
		file: '21 - angelfish.svg',
		category: 'exotics'
	},
	{
		id: 'snail',
		num: '22',
		nameUk: 'Гігантський равлик',
		nameEn: 'Giant Snail',
		file: '22 - snail.svg',
		category: 'exotics'
	},
	{
		id: 'monkey',
		num: '23',
		nameUk: 'Капуцин',
		nameEn: 'Monkey',
		file: '23 - monkey.svg',
		category: 'exotics'
	},
	{
		id: 'chimpanzee',
		num: '24',
		nameUk: 'Магот',
		nameEn: 'Chimpanzee',
		file: '24 - chimpanzee.svg',
		category: 'exotics'
	},
	{
		id: 'axolotl',
		num: '25',
		nameUk: 'Аксолотль',
		nameEn: 'Axolotl',
		file: '25 - axolotl.svg',
		category: 'exotics'
	},
	{
		id: 'iguana',
		num: '26',
		nameUk: 'Ігуана',
		nameEn: 'Iguana',
		file: '26 - iguana.svg',
		category: 'reptiles'
	},
	{
		id: 'capybara',
		num: '27',
		nameUk: 'Капібара',
		nameEn: 'Capybara',
		file: '27 - capybara.svg',
		category: 'mammals'
	},
	{
		id: 'raccoon',
		num: '28',
		nameUk: 'Єнот',
		nameEn: 'Raccoon',
		file: '28 - raccoon.svg',
		category: 'mammals'
	},
	{
		id: 'meerkat',
		num: '29',
		nameUk: 'Сурикат',
		nameEn: 'Meerkat',
		file: '29 - meerkat.svg',
		category: 'mammals'
	},
	{
		id: 'lemur',
		num: '30',
		nameUk: 'Лемур',
		nameEn: 'Lemur',
		file: '30 - lemur.svg',
		category: 'mammals'
	},
	{
		id: 'flamingo',
		num: '31',
		nameUk: 'Фламінго',
		nameEn: 'Flamingo',
		file: '31 - flamingo.svg',
		category: 'birds'
	},
	{
		id: 'red-panda',
		num: '32',
		nameUk: 'Червона панда',
		nameEn: 'Red Panda',
		file: '32 - red-panda.svg',
		category: 'mammals'
	},
	{
		id: 'penguin',
		num: '33',
		nameUk: 'Пінгвін',
		nameEn: 'Penguin',
		file: '33 - penguin.svg',
		category: 'birds'
	},
	{
		id: 'lynx',
		num: '34',
		nameUk: 'Рись',
		nameEn: 'Lynx',
		file: '34 - lynx.svg',
		category: 'mammals'
	},
	{
		id: 'leopard',
		num: '35',
		nameUk: 'Леопард',
		nameEn: 'Leopard',
		file: '35 - leopard.svg',
		category: 'mammals'
	},
	{
		id: 'dodo',
		num: '36',
		nameUk: 'Дронт',
		nameEn: 'Dodo',
		file: '36 - dodo.svg',
		category: 'birds'
	},
	{
		id: 'ant',
		num: '37',
		nameUk: 'Мураха',
		nameEn: 'Ant',
		file: '37 - ant.svg',
		category: 'exotics'
	}
];

export const ANIMAL_BRAND_COLORS = [
	{ hex: '#13371B', name: 'Dark Green', textColor: '#ffffff' },
	{ hex: '#598F3A', name: 'Main Green', textColor: '#ffffff' },
	{ hex: '#93C84A', name: 'Light Green', textColor: '#101e14' },
	{ hex: '#FFB327', name: 'Yellow', textColor: '#101e14' },
	{ hex: '#E5E5E5', name: 'Light Gray', textColor: '#101e14' },
	{ hex: '#262626', name: 'Dark Gray', textColor: '#ffffff' },
	{ hex: '#FFFFFF', name: 'White', textColor: '#13371b' }
];
