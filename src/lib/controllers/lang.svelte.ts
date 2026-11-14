import { browser } from '$app/environment';
import { safeLocalStorage } from '../services/storage';

export type Lang = 'uk' | 'en';

const TRANSLATIONS = {
	uk: {
		hospital_name: 'Vet Crew Hospital',
		contacts_heading: 'КОНТАКТИ',
		btn_phone: 'Телефон',
		btn_phone_display: '+380 77 501 01 01',
		btn_instagram: 'Instagram',
		btn_instagram_display: 'vet.crew.hospital',
		btn_map: 'Карта',
		btn_map_display: 'Майстрова, 4',
		theme_btn: 'Тема',
		lang_btn: 'Мова',
		lang_name: 'UA',
		brandbook_btn: 'Брендбук',
		fullscreen: 'Екран',
		fullscreen_exit: 'Згорнути',
		scroll_hero: 'Головна',
		scroll_contacts: 'Контакти',
		skip_to_content: 'До основного вмісту',
		dev_btn: 'У розробці',
		dev_status_text: 'Цей сайт знаходиться в процесі розробки',
		bg_settings_title: 'Налаштування фону',
		bg_mode_photo: 'Фото',
		bg_mode_solid: 'Суцільний фон',
		bg_blur_label: 'Розмиття:',
		bg_overlay_label: 'Пелена:',
		bg_overlay_theme_light: 'світла',
		bg_overlay_theme_dark: 'темна',
		bg_solid_color_label: 'Колір фону:',
		bg_overlay_color_label: 'Колір пелени:',
		bg_custom_color: 'Власний колір',
		bg_menu_capsule_label: 'Фон головного меню:',
		bg_menu_capsule_on: 'Увімкнено',
		bg_menu_capsule_off: 'Вимкнено',
		bg_reset_all: 'Скинути налаштування',
		bg_reset_btn: 'Скинути',
		bg_close_btn: 'Закрити'
	},
	en: {
		hospital_name: 'Vet Crew Hospital',
		contacts_heading: 'CONTACTS',
		btn_phone: 'Phone',
		btn_phone_display: '+380 77 501 01 01',
		btn_instagram: 'Instagram',
		btn_instagram_display: 'vet.crew.hospital',
		btn_map: 'Map',
		btn_map_display: 'Maystrova, 4',
		theme_btn: 'Theme',
		lang_btn: 'Language',
		lang_name: 'EN',
		brandbook_btn: 'BrandBook',
		fullscreen: 'Fullscreen',
		fullscreen_exit: 'Exit',
		scroll_hero: 'Hero',
		scroll_contacts: 'Contacts',
		skip_to_content: 'Skip to content',
		dev_btn: 'In Progress',
		dev_status_text: 'This website is currently under development',
		bg_settings_title: 'Background Settings',
		bg_mode_photo: 'Photo',
		bg_mode_solid: 'Solid Color',
		bg_blur_label: 'Blur:',
		bg_overlay_label: 'Overlay:',
		bg_overlay_theme_light: 'light',
		bg_overlay_theme_dark: 'dark',
		bg_solid_color_label: 'Background color:',
		bg_overlay_color_label: 'Overlay color:',
		bg_custom_color: 'Custom color',
		bg_menu_capsule_label: 'Main menu background:',
		bg_menu_capsule_on: 'Enabled',
		bg_menu_capsule_off: 'Disabled',
		bg_reset_all: 'Reset to defaults',
		bg_reset_btn: 'Reset',
		bg_close_btn: 'Close'
	}
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.uk;

class LangStore {
	current = $state<Lang>('uk');

	constructor() {
		if (browser) {
			const queryLang =
				typeof window !== 'undefined' && window.location
					? (new URLSearchParams(window.location.search).get('lang') as Lang | null)
					: null;
			const saved = safeLocalStorage.get('lang') as Lang | null;
			if (queryLang === 'uk' || queryLang === 'en') {
				this.current = queryLang;
			} else if (saved === 'uk' || saved === 'en') {
				this.current = saved;
			} else {
				const navLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'uk';
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
		if (!browser || typeof document === 'undefined') return;
		document.documentElement.setAttribute('lang', this.current);
		safeLocalStorage.set('lang', this.current);
	}

	t(key: TranslationKey): string {
		return TRANSLATIONS[this.current][key] ?? TRANSLATIONS.uk[key] ?? key;
	}
}

export const langStore = new LangStore();
