// src/lib/hotkeys/brandbookSequence.ts — пасхалка: перехід до брендбука за 7 натисканнями 'B'
import { createKeySequence, type KeySequence } from '$lib/debug/keySequence';

export const BRANDBOOK_KEY = 'b';
export const BRANDBOOK_THRESHOLD = 7;

export function createBrandbookSequence(onTrigger: () => void): KeySequence {
	return createKeySequence({
		letter: BRANDBOOK_KEY,
		threshold: BRANDBOOK_THRESHOLD,
		onComplete: onTrigger
	});
}
