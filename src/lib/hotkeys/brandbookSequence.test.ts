// src/lib/hotkeys/brandbookSequence.test.ts — тести пасхалки 7xB для брендбука
import { describe, expect, it, vi } from 'vitest';
import { createBrandbookSequence, BRANDBOOK_KEY, BRANDBOOK_THRESHOLD } from './brandbookSequence';
import type { KeyStroke } from '$lib/debug/keySequence';

const press = (letter: string | null = 'b', extra: Partial<KeyStroke> = {}): KeyStroke => ({
	letter,
	code: letter ? `Key${letter.toUpperCase()}` : 'KeyB',
	...extra
});

describe('createBrandbookSequence (7x B easter egg)', () => {
	it('має правильні константи: клавіша B і поріг 7', () => {
		expect(BRANDBOOK_KEY).toBe('b');
		expect(BRANDBOOK_THRESHOLD).toBe(7);
	});

	it('активує перехід рівно після 7 натискань B', () => {
		const onTrigger = vi.fn();
		const sequence = createBrandbookSequence(onTrigger);

		for (let i = 1; i <= 6; i++) {
			const completed = sequence.handle(press('b'));
			expect(completed).toBe(false);
			expect(sequence.count).toBe(i);
			expect(onTrigger).not.toHaveBeenCalled();
		}

		const completed = sequence.handle(press('b'));
		expect(completed).toBe(true);
		expect(onTrigger).toHaveBeenCalledTimes(1);
		expect(sequence.count).toBe(0);
	});

	it('скидає лічильник при натисканні іншої клавіші', () => {
		const onTrigger = vi.fn();
		const sequence = createBrandbookSequence(onTrigger);

		sequence.handle(press('b'));
		sequence.handle(press('b'));
		expect(sequence.count).toBe(2);

		sequence.handle(press('a'));
		expect(sequence.count).toBe(0);
		expect(onTrigger).not.toHaveBeenCalled();
	});

	it('затиснута клавіша (repeat) ігнорується', () => {
		const onTrigger = vi.fn();
		const sequence = createBrandbookSequence(onTrigger);

		sequence.handle(press('b'));
		expect(sequence.count).toBe(1);

		sequence.handle(press('b', { repeat: true }));
		expect(sequence.count).toBe(1);
		expect(onTrigger).not.toHaveBeenCalled();
	});

	it('натискання в полі вводу не збиває і не збільшує серію', () => {
		const onTrigger = vi.fn();
		const sequence = createBrandbookSequence(onTrigger);
		const input = { closest: (sel: string) => (sel.includes('input') ? {} : null) };

		sequence.handle(press('b'));
		expect(sequence.count).toBe(1);

		sequence.handle(press('b', { target: input as unknown as EventTarget }));
		expect(sequence.count).toBe(1);
		expect(onTrigger).not.toHaveBeenCalled();
	});

	it('комбінація з модифікатором (Ctrl+B) скидає серію', () => {
		const onTrigger = vi.fn();
		const sequence = createBrandbookSequence(onTrigger);

		sequence.handle(press('b'));
		sequence.handle(press('b'));
		expect(sequence.count).toBe(2);

		sequence.handle(press('b', { ctrlKey: true }));
		expect(sequence.count).toBe(0);
		expect(onTrigger).not.toHaveBeenCalled();
	});
});
