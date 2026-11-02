import { describe, expect, it } from 'vitest';
import { DEPARTMENTS } from './departments';

describe('Hospital Departments Data Registry (Scalability & Integrity)', () => {
	it('defines at least 4 core medical departments', () => {
		expect(DEPARTMENTS.length).toBeGreaterThanOrEqual(4);
	});

	it('ensures each department has unique id and unique slug', () => {
		const ids = DEPARTMENTS.map((d) => d.id);
		const slugs = DEPARTMENTS.map((d) => d.slug);

		expect(new Set(ids).size).toBe(ids.length);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('guarantees complete bilingual naming and descriptions (UK/EN)', () => {
		for (const dept of DEPARTMENTS) {
			expect(dept.titleUk.trim()).not.toBe('');
			expect(dept.titleEn.trim()).not.toBe('');
			expect(dept.descriptionUk.trim()).not.toBe('');
			expect(dept.descriptionEn.trim()).not.toBe('');
		}
	});

	it('ensures every equipment entry has valid specification and bilingual titles', () => {
		for (const dept of DEPARTMENTS) {
			expect(dept.equipment.length).toBeGreaterThan(0);
			for (const eq of dept.equipment) {
				expect(eq.id.trim()).not.toBe('');
				expect(eq.nameUk.trim()).not.toBe('');
				expect(eq.nameEn.trim()).not.toBe('');
				expect(eq.specification.trim()).not.toBe('');
			}
		}
	});

	it('validates positive patient capacity', () => {
		for (const dept of DEPARTMENTS) {
			expect(dept.capacity).toBeGreaterThan(0);
		}
	});
});

