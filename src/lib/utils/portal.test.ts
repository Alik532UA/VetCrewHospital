// src/lib/utils/portal.test.ts — юніт-тест для Svelte дії portal
import { describe, expect, it, vi } from 'vitest';
import { portal } from './portal';

describe('portal utility action', () => {
	it('переносить вузол до цільового контейнера і видаляє його при знищенні', () => {
		const targetChildren: unknown[] = [];
		const target = {
			appendChild: vi.fn((el: unknown) => {
				targetChildren.push(el);
				(el as { parentNode: unknown }).parentNode = target;
			}),
			removeChild: vi.fn((el: unknown) => {
				const idx = targetChildren.indexOf(el);
				if (idx !== -1) targetChildren.splice(idx, 1);
				(el as { parentNode: unknown }).parentNode = null;
			})
		} as unknown as HTMLElement;

		const node = {
			parentNode: null as unknown
		} as unknown as HTMLElement;

		const action = portal(node, target);
		expect(target.appendChild).toHaveBeenCalledWith(node);
		expect((node as unknown as { parentNode: unknown }).parentNode).toBe(target);

		action.destroy();
		expect(target.removeChild).toHaveBeenCalledWith(node);
		expect((node as unknown as { parentNode: unknown }).parentNode).toBeNull();
	});

	it('за замовчуванням переносить у document.body якщо доступний', () => {
		const bodyChildren: unknown[] = [];
		const mockBody = {
			appendChild: vi.fn((el: unknown) => {
				bodyChildren.push(el);
				(el as { parentNode: unknown }).parentNode = mockBody;
			}),
			removeChild: vi.fn((el: unknown) => {
				const idx = bodyChildren.indexOf(el);
				if (idx !== -1) bodyChildren.splice(idx, 1);
				(el as { parentNode: unknown }).parentNode = null;
			})
		};

		vi.stubGlobal('document', { body: mockBody });

		const node = { parentNode: null as unknown } as unknown as HTMLElement;
		const action = portal(node);
		expect(mockBody.appendChild).toHaveBeenCalledWith(node);

		action.destroy();
		expect(mockBody.removeChild).toHaveBeenCalledWith(node);

		vi.unstubAllGlobals();
	});
});
