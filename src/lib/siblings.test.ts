import { describe, expect, it } from 'vitest';
import { SIBLINGS, resolveSiblingLocale, siblingUrl } from './siblings';

describe('siblings.ts — міжпроєктна екосистема', () => {
	it('запис власного проєкту відповідає конфігурації VetCrewHospital', () => {
		const self = SIBLINGS.vetcrewhospital;
		expect(self.origin).toBe('https://vet-crew-hospital.org');
		expect(self.base).toBe('');
		expect(self.locales).toEqual(['uk', 'en']);
		expect(self.defaultLocale).toBe('uk');
		expect(self.transport).toBe('query');
	});

	it('resolveSiblingLocale повертає мову, якщо вона підтримується', () => {
		expect(resolveSiblingLocale('vetcrewhospital', 'uk')).toBe('uk');
		expect(resolveSiblingLocale('vetcrewhospital', 'en')).toBe('en');
	});

	it('resolveSiblingLocale для непідтримуваної мови відкочується до англійської або дефолтної', () => {
		expect(resolveSiblingLocale('vetcrewhospital', 'fr')).toBe('en');
	});

	it('siblingUrl коректно будує посилання з query-параметром для власного проєкту', () => {
		const urlEn = siblingUrl('vetcrewhospital', 'en');
		expect(urlEn).toBe('https://vet-crew-hospital.org/?lang=en');

		const urlUk = siblingUrl('vetcrewhospital', 'uk');
		expect(urlUk).toBe('https://vet-crew-hospital.org/?lang=uk');
	});

	it('siblingUrl коректно будує шлях для проєктів із transport: path (VetCrewEmergency)', () => {
		const urlEn = siblingUrl('VetCrewEmergency', 'en');
		expect(urlEn).toBe('https://vet-crew-emergency.org/en');

		const urlUk = siblingUrl('VetCrewEmergency', 'uk');
		expect(urlUk).toBe('https://vet-crew-emergency.org/?lang=uk');
	});
});

