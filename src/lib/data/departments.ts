export type MedicalSpecialty =
	'surgery' | 'diagnostics' | 'intensive_care' | 'rehabilitation' | 'exotic_medicine' | 'dentistry';

export interface MedicalEquipment {
	id: string;
	nameUk: string;
	nameEn: string;
	specification: string;
}

export interface DepartmentItem {
	id: string;
	slug: string;
	titleUk: string;
	titleEn: string;
	descriptionUk: string;
	descriptionEn: string;
	specialty: MedicalSpecialty;
	equipment: MedicalEquipment[];
	capacity: number;
	acceptsWildlife: boolean;
}

export const DEPARTMENTS: DepartmentItem[] = [
	{
		id: 'dept-surgery',
		slug: 'surgical-complex',
		titleUk: 'Хірургічний комплекс',
		titleEn: 'Surgical Complex',
		descriptionUk:
			'Стерильні операційні зали з мікрохірургічним обладнанням для складних операцій диким та екзотичним тваринам.',
		descriptionEn:
			'Sterile surgical suites with microsurgical instrumentation for complex wildlife and exotic animal procedures.',
		specialty: 'surgery',
		equipment: [
			{
				id: 'eq-micro-1',
				nameUk: 'Операційний мікроскоп',
				nameEn: 'Surgical Microscope',
				specification: 'Leica M525 F20'
			},
			{
				id: 'eq-gas-anesthesia',
				nameUk: 'Інгаляційний наркозний апарат',
				nameEn: 'Inhalation Anesthesia Machine',
				specification: 'Mindray Veta 5'
			}
		],
		capacity: 6,
		acceptsWildlife: true
	},
	{
		id: 'dept-icu',
		slug: 'intensive-care-unit',
		titleUk: 'Відділення інтенсивної терапії та реанімації',
		titleEn: 'Intensive Care Unit (ICU)',
		descriptionUk:
			'Цілодобовий моніторинг життєвих показників, кисневі бокси та клімат-контрольовані інкубатори.',
		descriptionEn:
			'Round-the-clock vital signs monitoring, oxygen chambers, and climate-controlled incubators.',
		specialty: 'intensive_care',
		equipment: [
			{
				id: 'eq-icu-box',
				nameUk: 'Кисневий інкубаторний бокс',
				nameEn: 'Oxygen Incubator Chamber',
				specification: 'Curadle PRO Plus'
			},
			{
				id: 'eq-multiparameter',
				nameUk: 'Монітор пацієнта мультипараметричний',
				nameEn: 'Multiparameter Patient Monitor',
				specification: 'Comen V6'
			}
		],
		capacity: 12,
		acceptsWildlife: true
	},
	{
		id: 'dept-diagnostics',
		slug: 'diagnostic-imaging',
		titleUk: 'Центр променевої діагностики та УЗД',
		titleEn: 'Diagnostic Imaging Center',
		descriptionUk:
			'Цифровий рентген високої чіткості та експертне ультразвукове дослідження м’яких тканин і судин.',
		descriptionEn:
			'High-definition digital radiography and expert ultrasonography for soft tissues and vascular imaging.',
		specialty: 'diagnostics',
		equipment: [
			{
				id: 'eq-digital-dr',
				nameUk: 'Цифрова рентген-система DR',
				nameEn: 'Digital Radiography DR System',
				specification: 'Carestream Vita Flex CR'
			},
			{
				id: 'eq-ultrasound-color',
				nameUk: 'УЗД-апарат експертного класу',
				nameEn: 'Expert Ultrasound System',
				specification: 'Mindray M9 Vet'
			}
		],
		capacity: 8,
		acceptsWildlife: true
	},
	{
		id: 'dept-rehab',
		slug: 'wildlife-rehabilitation',
		titleUk: 'Реабілітаційний вольєрний модуль',
		titleEn: 'Wildlife Rehabilitation Module',
		descriptionUk:
			'Просторі адаптаційні вольєри для відновлення природних рефлексів перед випуском у дику природу.',
		descriptionEn:
			'Spacious adaptation enclosures to restore natural reflexes prior to wild release.',
		specialty: 'rehabilitation',
		equipment: [
			{
				id: 'eq-flight-tunnel',
				nameUk: 'Тренувальний льотний тунель',
				nameEn: 'Flight Training Tunnel',
				specification: 'Aero-Mesh 30m'
			}
		],
		capacity: 20,
		acceptsWildlife: true
	}
];
