import { browser } from '$app/environment';
import { safeLocalStorage } from '../services/storage';

export const MIN_ZOOM = 70;
export const MAX_ZOOM = 130;
export const ZOOM_STEP = 10;
export const DEFAULT_ZOOM = 100;

class ZoomStore {
	level = $state<number>(DEFAULT_ZOOM);

	get scale(): number {
		return this.level / 100;
	}

	constructor() {
		if (browser) {
			const saved = safeLocalStorage.get('brandbook_zoom');
			if (saved) {
				const num = parseInt(saved, 10);
				if (!isNaN(num) && num >= MIN_ZOOM && num <= MAX_ZOOM) {
					this.level = num;
				}
			}
			this.apply();
		}
	}

	zoomIn() {
		this.set(Math.min(MAX_ZOOM, this.level + ZOOM_STEP));
	}

	zoomOut() {
		this.set(Math.max(MIN_ZOOM, this.level - ZOOM_STEP));
	}

	reset() {
		this.set(DEFAULT_ZOOM);
	}

	set(val: number) {
		const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(val / ZOOM_STEP) * ZOOM_STEP));
		this.level = clamped;
		this.apply();
	}

	apply() {
		if (!browser || typeof document === 'undefined') return;
		safeLocalStorage.set('brandbook_zoom', String(this.level));
		try {
			document?.documentElement?.style?.setProperty?.('--brandbook-zoom', this.scale.toString());
		} catch {
			// ignore in test or headless env
		}
	}
}

export const zoomStore = new ZoomStore();
