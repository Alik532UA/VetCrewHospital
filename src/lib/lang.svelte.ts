import { safeLocalStorage } from './services/storage';

export type Lang = 'uk' | 'en';

const TRANSLATIONS = {
	uk: {
		hospital_name: 'Vet Crew Hospital',
		status_badge: 'Госпіталь 24/7 • Відкрито',
		emergency_tagline: 'Цілодобова ветеринарна допомога та турбота',
		subtitle_hero: 'Надійний захист та лікування для вашого улюбленця',
		scroll_hint: 'Прокрутіть або торкніться для контактів',
		scroll_back: 'Повернутися нагору',
		btn_phone_label: 'Телефон',
		btn_phone_display: '+380 77 501 01 01',
		btn_phone_sub: 'Цілодобова гаряча лінія',
		btn_phone_action: 'Подзвонити зараз',
		btn_instagram_label: 'Instagram',
		btn_instagram_sub: '@vet.crew.hospital',
		btn_instagram_action: 'Перейти до профілю',
		btn_map_label: 'Карта та маршрут',
		btn_map_sub: 'Google Maps навігація',
		btn_map_action: 'Прокласти маршрут',
		copy_phone: 'Скопіювати номер',
		copied: 'Номер скопійовано!',
		theme_toggle: 'Змінити тему',
		lang_name: 'UA'
	},
	en: {
		hospital_name: 'Vet Crew Hospital',
		status_badge: 'Hospital 24/7 • Open Now',
		emergency_tagline: '24/7 Veterinary emergency & loving care',
		subtitle_hero: 'Dedicated protection & treatment for your pet',
		scroll_hint: 'Scroll or tap for emergency contacts',
		scroll_back: 'Back to top',
		btn_phone_label: 'Phone',
		btn_phone_display: '+380 77 501 01 01',
		btn_phone_sub: '24/7 Emergency Line',
		btn_phone_action: 'Call Now',
		btn_instagram_label: 'Instagram',
		btn_instagram_sub: '@vet.crew.hospital',
		btn_instagram_action: 'Visit Instagram',
		btn_map_label: 'Map & Location',
		btn_map_sub: 'Google Maps navigation',
		btn_map_action: 'Get Directions',
		copy_phone: 'Copy phone number',
		copied: 'Phone number copied!',
		theme_toggle: 'Toggle theme',
		lang_name: 'EN'
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

