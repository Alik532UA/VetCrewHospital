export type SignFormat = 'composite' | 'icon' | 'text';

export interface SignItem {
	id: string;
	num: string;
	titleUk: string;
	titleEn: string;
	file: string;
}

export interface SignColor {
	hex: string;
	name: string;
	textColor: string;
}

export const COMPOSITE_PLAQUES: SignItem[] = [
	{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception Desk', file: 'reception.svg' },
	{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Vet Crew Shop', file: 'pet-shop.svg' },
	{ id: 'hospital', num: '03', titleUk: 'Стаціонар', titleEn: 'Inpatient Hospital', file: 'hospital.svg' },
	{ id: 'surgery', num: '04', titleUk: 'Операційна', titleEn: 'Surgery Room', file: 'surgery.svg' },
	{ id: 'procedures', num: '05', titleUk: 'Процедурна', titleEn: 'Procedure Room', file: 'procedures.svg' },
	{ id: 'consultation', num: '06', titleUk: 'Приймальний кабінет', titleEn: 'Examination Room', file: 'consultation.svg' },
	{ id: 'laboratory', num: '07', titleUk: 'Лабораторія', titleEn: 'Clinical Laboratory', file: 'laboratory.svg' }
];

export const TEXT_PLAQUES: SignItem[] = [
	{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception Desk', file: 'reception.svg' },
	{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Vet Crew Shop', file: 'pet-shop.svg' },
	{ id: 'hospital', num: '03', titleUk: 'Стаціонар', titleEn: 'Inpatient Hospital', file: 'hospital.svg' },
	{ id: 'surgery', num: '04', titleUk: 'Операційна', titleEn: 'Surgery Room', file: 'surgery.svg' },
	{ id: 'procedures', num: '05', titleUk: 'Процедурна', titleEn: 'Procedure Room', file: 'procedures.svg' },
	{ id: 'consultation', num: '06', titleUk: 'Приймальний кабінет', titleEn: 'Examination Room', file: 'consultation.svg' },
	{ id: 'laboratory', num: '07', titleUk: 'Лабораторія', titleEn: 'Clinical Laboratory', file: 'laboratory.svg' }
];

export const ICON_PLAQUES: SignItem[] = [
	{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception & Waiting', file: 'reception.svg' },
	{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Pet Shop & Gear', file: 'pet-shop.svg' },
	{ id: 'pharmacy', num: '03', titleUk: 'Ветеринарна аптека', titleEn: 'Veterinary Pharmacy', file: 'pharmacy.svg' },
	{ id: 'herpetology', num: '04', titleUk: 'Герпетологія (Рептилії)', titleEn: 'Herpetology Department', file: 'herpetology.svg' },
	{ id: 'ornithology', num: '05', titleUk: 'Орнітологія (Птахи)', titleEn: 'Ornithology Department', file: 'ornithology.svg' },
	{ id: 'surgery', num: '06', titleUk: 'Хірургічний блок', titleEn: 'Surgical Suite', file: 'surgery.svg' },
	{ id: 'hospital', num: '07', titleUk: 'Ветеринарний стаціонар', titleEn: 'Inpatient Hospital Care', file: 'hospital.svg' },
	{ id: 'laboratory', num: '08', titleUk: 'Клінічна лабораторія', titleEn: 'Clinical Laboratory', file: 'laboratory.svg' }
];

export const SIGNAGE_BRAND_COLORS: SignColor[] = [
	{ hex: '#13371B', name: 'Dark Green', textColor: '#ffffff' },
	{ hex: '#598F3A', name: 'Main Green', textColor: '#ffffff' },
	{ hex: '#93C84A', name: 'Light Green', textColor: '#101e14' },
	{ hex: '#FFB327', name: 'Brand Gold', textColor: '#101e14' },
	{ hex: '#E5E5E5', name: 'Light Gray', textColor: '#101e14' },
	{ hex: '#262626', name: 'Dark Gray', textColor: '#ffffff' },
	{ hex: '#FFFFFF', name: 'Pure White', textColor: '#13371b' }
];

