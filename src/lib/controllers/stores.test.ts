import { describe, expect, it } from 'vitest';
import { langStore } from './lang.svelte';
import { themeStore } from './theme.svelte';

describe('langStore controller', () => {
	it('має початкову мову uk або en та коректний переклад назви госпіталю', () => {
		expect(['uk', 'en']).toContain(langStore.current);
		expect(langStore.t('hospital_name')).toBe('Vet Crew Hospital');
	});

	it('перемикає мову та повертає відповідні тексти', () => {
		langStore.set('uk');
		expect(langStore.current).toBe('uk');
		expect(langStore.t('btn_phone')).toBe('Телефон');

		langStore.toggle();
		expect(langStore.current).toBe('en');
		expect(langStore.t('btn_phone')).toBe('Phone');

		langStore.set('uk');
		expect(langStore.current).toBe('uk');
	});
});

describe('themeStore controller', () => {
	it('ініціалізується валідною темою', () => {
		expect(['light', 'dark']).toContain(themeStore.current);
	});

	it('перемикає тему та встановлює значення', () => {
		themeStore.set('light');
		expect(themeStore.current).toBe('light');

		themeStore.toggle();
		expect(themeStore.current).toBe('dark');

		themeStore.set('light');
		expect(themeStore.current).toBe('light');
	});
});

