import { safeLocalStorage } from '../services/storage';

export type Lang = 'uk' | 'en';

const TRANSLATIONS = {
	uk: {
		hospital_name: 'Vet Crew Hospital',
		contacts_heading: 'КОНТАКТИ',
		btn_phone: 'Телефон',
		btn_phone_display: '+380 77 501 01 01',
		btn_instagram: 'Instagram',
		btn_instagram_display: '@vet.crew.hospital',
		btn_map: 'Карта',
		btn_map_display: 'Майстрова, 4',
		theme_btn: 'Тема',
		lang_btn: 'Мова',
		lang_name: 'UA',
		brandbook_btn: 'Брендбук',
		fullscreen: 'Екран',
		fullscreen_exit: 'Згорнути',
		scroll_hero: 'Головна',
		scroll_contacts: 'Контакти'
	},
	en: {
		hospital_name: 'Vet Crew Hospital',
		contacts_heading: 'CONTACTS',
		btn_phone: 'Phone',
		btn_phone_display: '+380 77 501 01 01',
		btn_instagram: 'Instagram',
		btn_instagram_display: '@vet.crew.hospital',
		btn_map: 'Map',
		btn_map_display: 'Maystrova, 4',
		theme_btn: 'Theme',
		lang_btn: 'Language',
		lang_name: 'EN',
		brandbook_btn: 'BrandBook',
		fullscreen: 'Fullscreen',
		fullscreen_exit: 'Exit',
		scroll_hero: 'Hero',
		scroll_contacts: 'Contacts'
	}
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.uk;

class LangStore {
	current = $state<Lang>('uk');

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = safeLocalStorage.get('lang') as Lang | null;
			if (saved === 'uk' || saved === 'en') {
				this.current = saved;
			} else {
				const navLang = navigator.language.toLowerCase();
				this.current = navLang.startsWith('uk') ? 'uk' : 'en';
			}
			this.apply();
		}
	}

	toggle() {
		this.current = this.current === 'uk' ? 'en' : 'uk';
		this.apply();
	}

	set(lang: Lang) {
		if (lang === 'uk' || lang === 'en') {
			this.current = lang;
			this.apply();
		}
	}

	apply() {
		if (typeof window === 'undefined') return;
		document.documentElement.setAttribute('lang', this.current);
		safeLocalStorage.set('lang', this.current);
	}

	t(key: TranslationKey): string {
		return TRANSLATIONS[this.current][key] ?? TRANSLATIONS.uk[key] ?? key;
	}
}

export const langStore = new LangStore();
