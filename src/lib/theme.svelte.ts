import { safeLocalStorage } from './services/storage';

export type Theme = 'dark' | 'light';

class ThemeStore {
	current = $state<Theme>('dark');

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = safeLocalStorage.get('theme') as Theme | null;
			if (saved === 'dark' || saved === 'light') {
				this.current = saved;
			} else if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
				this.current = 'light';
			}
			this.apply();
		}
	}

	toggle() {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		this.apply();
	}

	set(theme: Theme) {
		if (theme === 'dark' || theme === 'light') {
			this.current = theme;
			this.apply();
		}
	}

	apply() {
		if (typeof window === 'undefined') return;
		document.documentElement.setAttribute('data-theme', this.current);
		safeLocalStorage.set('theme', this.current);
		try {
			const metaTheme = document.querySelector('meta[name="theme-color"]');
			if (metaTheme) {
				metaTheme.setAttribute('content', this.current === 'dark' ? '#070e09' : '#f5f8f5');
			}
		} catch {}
	}
}

export const themeStore = new ThemeStore();

