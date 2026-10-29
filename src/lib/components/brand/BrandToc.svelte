<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';

	interface TocSection {
		id: string;
		num: string;
		titleUk: string;
		titleEn: string;
		iconType: 'palette' | 'paw' | 'naming' | 'slogan' | 'animals' | 'qr' | 'typography' | 'doors' | 'photo';
	}

	export const SECTIONS: TocSection[] = [
		{ id: 'palette', num: '01', titleUk: 'Колірна палітра', titleEn: 'Color Palette', iconType: 'palette' },
		{ id: 'logo-studio', num: '02', titleUk: 'Студія логотипу', titleEn: 'Logo Studio', iconType: 'paw' },
		{ id: 'naming', num: '03', titleUk: 'Назва та суббренди', titleEn: 'Naming & Brands', iconType: 'naming' },
		{ id: 'slogan', num: '04', titleUk: 'Слоган та цінності', titleEn: 'Brand Slogan', iconType: 'slogan' },
		{ id: 'animals', num: '05', titleUk: 'Іконки 24 тварин', titleEn: 'Animal Icons (24)', iconType: 'animals' },
		{ id: 'qr', num: '06', titleUk: 'QR-таблички', titleEn: 'QR Signage', iconType: 'qr' },
		{ id: 'typography', num: '07', titleUk: 'Типографіка', titleEn: 'Typography', iconType: 'typography' },
		{ id: 'door-signs', num: '08', titleUk: 'Таблички відділень', titleEn: 'Clinic Signage', iconType: 'doors' },
		{ id: 'photo-logos', num: '09', titleUk: 'Комплексний логотип з тваринами', titleEn: 'Composite Logos with Animals', iconType: 'photo' }
	];

	let activeId = $state<string>('palette');
	let host = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!browser) return;

		const targets = SECTIONS
			.map((s) => document.getElementById(s.id))
			.filter((el): el is HTMLElement => el !== null);

		if (targets.length === 0) return;

		const sync = () => {
			const line = window.innerHeight * 0.35;
			let current = targets[0];
			for (const t of targets) {
				if (t.getBoundingClientRect().top > line) break;
				current = t;
			}
			if (current) {
				activeId = current.id;
			}
		};

		let queued = false;
		const onScroll = () => {
			if (queued) return;
			queued = true;
			requestAnimationFrame(() => {
				sync();
				queued = false;
			});
		};

		sync();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	function scrollToSection(e: MouseEvent, id: string) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
			history.replaceState(null, '', '#' + id);
			activeId = id;
		}
	}
</script>

<nav
	class="brand-toc"
	bind:this={host}
	aria-label={langStore.current === 'uk' ? 'Зміст брендбуку' : 'BrandBook Contents'}
>
	<div class="toc-list">
		{#each SECTIONS as s (s.id)}
			{@const name = langStore.current === 'uk' ? `${s.num}. ${s.titleUk}` : `${s.num}. ${s.titleEn}`}
			<a
				href="#{s.id}"
				class="toc-btn"
				class:is-active={activeId === s.id}
				aria-label={name}
				aria-current={activeId === s.id ? 'true' : undefined}
				onclick={(e) => scrollToSection(e, s.id)}
			>
				<span class="toc-icon-wrap">
					{#if s.iconType === 'palette'}
						<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
							<circle cx="8" cy="8" r="1.5" fill="#FFB327" stroke="none"/>
							<circle cx="12" cy="6" r="1.5" fill="#598F3A" stroke="none"/>
							<circle cx="16" cy="8" r="1.5" fill={themeStore.current === 'dark' ? '#FFFFFF' : '#13371B'} stroke="none"/>
						</svg>
					{:else if s.iconType === 'paw'}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<circle cx="4.5" cy="9.5" r="2.2"/>
							<circle cx="9.2" cy="5.5" r="2.2"/>
							<circle cx="14.8" cy="5.5" r="2.2"/>
							<circle cx="19.5" cy="9.5" r="2.2"/>
							<path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.49-1.68-1.15-4.04-1.15-5.72 0-.88.6-1.61 1.47-2.48 2.49-1.22 1.43-2.16 3.16-1.44 4.88.75 1.78 2.71 2.26 4.3 1.95.8-.16 1.63-.69 2.48-.69s1.69.53 2.48.69c1.59.31 3.55-.17 4.3-1.95.72-1.72-.22-3.45-1.44-4.88z"/>
						</svg>
					{:else if s.iconType === 'naming'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
							<path d="m9 12 2 2 4-4"/>
						</svg>
					{:else if s.iconType === 'slogan'}
						<svg width="22" height="22" viewBox="0 0 260 300" fill="currentColor" aria-hidden="true">
							<path d="M145.67,128.27c6.5-8.68,11.89-18.24,19.03-26.47,14.64-16.9,46.38-45.5,70.29-32.34,21.57,11.87,12.85,54.35,5.17,72.8-10.58,25.4-26.93,49.67-55.04,56.97-.63,6.11,2.1,10.89,1.59,17.59-.29,3.84-3.37,12.35-6.64,14.35-2.63,1.6-6.24.41-7.93,2.07-1.17,1.15-5.19,15.08-6.61,18.39-6.7,15.57-25.58,41.91-45.75,32.03-11.96-5.86-12.52-22.52-12.15-33.93.1-3.09,2.45-6.35-.45-8.43-18.62,9.62-42.88,17.49-64.05,16.01-58.05-4.04-25.68-72.76,12.06-85.03.64-.21,2.27.36,1.47-1.49-.41-.94-12.57-11.2-14.96-14.04-20.46-24.34-32.56-69.39-29.9-100.84,4.33-51.24,45.32-52.67,75.38-18.64,29.34,33.22,47,84.97,47.48,129.02l-3.08-.6c-15.61-36.43-31.12-82.64-59.84-110.96-6.37-6.28-22.93-20.67-30.51-10.39-8.45,11.46-2.9,53.1.72,67.16,5.54,21.46,12.66,36,28.7,51.3,2.59,2.47,11.15,7.62,11,11.03-.12,2.74-9.23,5.66-11.83,7.11-13.05,7.23-26.65,17.45-31.91,32.09-14.82,41.28,52.18,19.82,70.43,12.43,5.7-2.31,10.76-7.11,17.33-6.18,1.07,11.75-4.35,23.84-3,35.5,1.69,14.65,13.74,6.48,19.96,0,8.26-8.59,23.58-32.86,20.83-44.8-.68-2.96-3.7-4.87-3.83-9.24-.45-14.69,15.02-13.6,24.09-17.92,17.84-8.49,36.02-41.6,39.5-60.5,1.39-7.54,4.9-30.69-7.02-30.1-14.5.71-45.65,32.06-56.05,43.04-2.91,3.08-14.9,19.02-17.98,19.03-5.49-9.13-3.3-21.16-4.53-31.5-1.3-10.96-5.9-19.75-7.75-29.26-1.4-7.21,3.3-8.09,7.65-3.64,3.27,3.34,8.12,18.4,8.12,22.88v15.5Z"/>
						</svg>
					{:else if s.iconType === 'animals'}
						<svg width="22" height="22" viewBox="260 500 1420 1280" fill="currentColor" aria-hidden="true">
							<g transform="translate(0, 85.9847) scale(1.563359)">
								<path d="M466.64,286.36c15.51,15.22,9.07,60.74,11.31,81.19.17,1.51.09,2.48,1.55,3.43,43.53-32.82,96.43-54.58,150.29-63.69,163.77-27.69,276.11,63.94,351.38,199.04,67.19,120.59,111.67,323.66,40.35,449.69-50.36,88.99-168.98,144.65-264.54,91.5-72.91-40.55-102.08-140.52-32.45-199.49,51.53-43.64,141.24-32.47,167.65,33.29,25.73,64.06-45.65,123.29-100.09,86.09-33.87-23.14-17.28-73.77,22.32-68.32,3.2.44,5.64,2.88,8.58,2.42-24.45-30.58-66.54-2.83-69.87,30.11-6.7,66.29,79.8,78.12,125.9,51.9,99.93-56.83,69.05-223.21-20.35-275.69-2.57-1.51-17.04-9.16-18.63-7.79-3.8,19.41-16.28,36.41-35.04,43.46.99,1.36,2.51,1.58,3.98,2.02,18.2,5.57,39.55,8.42,58.44,13.56,7.73,2.1,15.55,4.22,23.11,6.89,6.87,10.37,13.62,22.47,17.76,34.24,1.71,4.88,8.82,23.5,1,24.59-43.81-11.48-87.48-23.49-131.84-32.85-4.33-.12-7.4,4.59-11.12,6.87-26.27,16.12-63.7,7-74.81-22.83-16.14-43.35,27.61-85.75,70.44-80.04,5.1-32.15,19.19-67.03,51.08-80.42,29.19-12.25,58.34-1.76,86.97,6.46-24.75-28.75-69.67-38.76-103.88-21.37-27.31,13.88-42.28,41.76-44.12,71.9-.16,2.67,1.71,8.84-.6,9.42-46.34-11.75-93.98-18.17-140.41-29.43-4.18-1.01-12.33-2.42-15.71-4.28-1.14-.63-1.69.04-1.26-2.22,36.99-17.49,63.5-49.49,33.97-88.49-25.68-33.91-78.51-47.17-118.98-38.52-.25,2.67-.02,1.61,1.5,1.98,34.33,8.2,81.25,15.17,100.02,50,30.43,56.46-54.73,87.5-88.24,109.79-1.83,1.22-18.01,12.81-15.27,15.22,61.09,6.63,121.76,16.7,182.02,28.48,1.58,1.2.51,1.16.15,2.18-1.59,4.49-4.19,8.2-5.67,13.35-3.33,11.55-2.96,22.2-1.51,33.99-28.23-4.15-56.4-9.63-84.66-13.83-28.5-4.23-63.61-10.89-91.84-12.15-11.02-.49-9.59,2.76-17.57,7.4-45.84,26.66-92.58-13.2-72.4-63.4,9.24-22.99,30.08-40.96,55-44,2.88-.35,6.29.49,8.97-.03,3.28-.64,6.22-7.59,8.54-10.46,3.93-4.88,8.27-9.88,12.47-14.53,1.43-1.58,12.8-11.73,11.51-12.98-25.02-3.75-49.07-11.78-73.48-18.07-52.69,24.76-115.6,30.12-172.86,20.91-13.68-2.2-54.76-12.12-62.1-23.93-8.27-13.31,24.17-9.52,29.93-9.92,26.67-1.86,53.14-9.12,76.5-22,.24-1.76-2.27-.99-3.37-.87-4.28.47-8.91,2.09-13.28,2.73-26.77,3.87-75.25,7.6-100.57-1.12-16.19-5.57-10.11-28-7.46-40.91,21.55-105.16,122.71-189.66,219.44-225.56,15.84-5.88,48.16-18.37,61.89-4.9ZM318.76,410.26c-51.4,6.95-32.71,88.51,17.52,70.52,40.93-14.67,27.07-76.54-17.52-70.52Z"/>
								<path d="M353.79,687.29c14.67-.43,36.8-2,50.75-.34,1.11.13,2.22,0,3.03,1,.92,1.24-3.74,14.56-4.3,17.83-1.5,8.75-1.44,15.71,0,24.45.39,2.36,3.56,9.21,1.76,10.31l-46.58-.58c-15.14-.33-41.52,5.27-54.84-1.08-19.82-9.45-18.12-38.45,1.38-47.37,9.26-4.24,37.22-3.87,48.79-4.21Z"/>
							</g>
						</svg>
					{:else if s.iconType === 'qr'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect width="5" height="5" x="3" y="3" rx="1"/>
							<rect width="5" height="5" x="16" y="3" rx="1"/>
							<rect width="5" height="5" x="3" y="16" rx="1"/>
							<path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
							<path d="M21 21v.01"/>
							<path d="M12 7v3a2 2 0 0 1-2 2H7"/>
							<path d="M3 12h.01"/>
							<path d="M12 3h.01"/>
							<path d="M12 16v.01"/>
							<path d="M16 12h1"/>
							<path d="M21 12v.01"/>
							<path d="M12 21v-1"/>
						</svg>
					{:else if s.iconType === 'typography'}
						<span class="type-glyph">Aa</span>
					{:else if s.iconType === 'doors'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/>
							<path d="M2 20h20"/>
							<circle cx="14" cy="12" r="1" fill="currentColor"/>
						</svg>
					{:else if s.iconType === 'photo'}
						<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="8" r="6"/>
							<path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
						</svg>
					{/if}
				</span>

				<span class="toc-tooltip" role="tooltip">
					<span class="tooltip-num">{s.num}</span>
					<span class="tooltip-text">{langStore.current === 'uk' ? s.titleUk : s.titleEn}</span>
				</span>
			</a>
		{/each}

		<div class="toc-divider" aria-hidden="true"></div>

		<!-- THEME TOGGLE BUTTON -->
		<button
			type="button"
			class="toc-btn toc-theme-btn"
			onclick={() => themeStore.toggle()}
			aria-label={themeStore.current === 'dark' ? (langStore.current === 'uk' ? 'Увімкнути світлу тему' : 'Switch to Light Mode') : (langStore.current === 'uk' ? 'Увімкнути темну тему' : 'Switch to Dark Mode')}
			title={themeStore.current === 'dark' ? (langStore.current === 'uk' ? 'Увімкнути світлу тему' : 'Switch to Light Mode') : (langStore.current === 'uk' ? 'Увімкнути темну тему' : 'Switch to Dark Mode')}
		>
			<span class="toc-icon-wrap">
				{#if themeStore.current === 'dark'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="4"/>
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
					</svg>
				{/if}
			</span>

			<span class="toc-tooltip" role="tooltip">
				<span class="tooltip-text">{themeStore.current === 'dark' ? (langStore.current === 'uk' ? 'Світла тема' : 'Light Mode') : (langStore.current === 'uk' ? 'Темна тема' : 'Dark Mode')}</span>
			</span>
		</button>
	</div>
</nav>

<style>
	.brand-toc {
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
		align-self: start;
		z-index: 30;
	}

	.toc-list {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		background: var(--panel-bg);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		padding: 0.55rem;
		border-radius: 18px;
		border: 1px solid var(--border);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		width: fit-content;
	}

	.toc-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
		border-radius: 12px;
		background: var(--bg-secondary);
		border: 2px solid transparent;
		color: var(--fg-secondary);
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.toc-btn:hover {
		transform: scale(1.06);
		color: var(--brand-leaf);
		border-color: var(--border-hover);
		background: var(--panel-bg);
	}

	.toc-btn.is-active {
		border-color: var(--brand-leaf);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.25);
		background: var(--panel-bg);
		color: var(--brand-leaf);
	}

	.toc-icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.type-glyph {
		font-size: 1.05rem;
		font-weight: 800;
		font-family: 'Montserrat', -apple-system, sans-serif;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	/* TOOLTIP */
	.toc-tooltip {
		position: absolute;
		left: calc(100% + 12px);
		top: 50%;
		transform: translateY(-50%) translateX(-6px);
		background: #13371b;
		color: #ffffff;
		padding: 0.35rem 0.75rem;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 700;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition: all 0.18s ease;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: center;
		gap: 0.45rem;
		z-index: 50;
	}

	:global([data-theme='dark']) .toc-tooltip,
	:global(.dark) .toc-tooltip {
		background: #182b1d;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #f5f8f5;
	}

	.toc-tooltip::before {
		content: '';
		position: absolute;
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		border: 5px solid transparent;
		border-right-color: #13371b;
	}

	:global([data-theme='dark']) .toc-tooltip::before,
	:global(.dark) .toc-tooltip::before {
		border-right-color: #182b1d;
	}

	.tooltip-num {
		color: #ffb327;
		font-size: 0.74rem;
	}

	.toc-btn:hover .toc-tooltip,
	.toc-btn:focus-visible .toc-tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateY(-50%) translateX(0);
	}

	.toc-divider {
		height: 1px;
		width: 100%;
		background: var(--border);
		margin: 2px 0;
	}

	.toc-theme-btn {
		color: var(--fg-secondary);
	}

	.toc-theme-btn:hover {
		color: var(--brand-leaf);
	}

	:global([data-theme='dark']) .toc-theme-btn:hover,
	:global(.dark) .toc-theme-btn:hover {
		color: var(--brand-gold);
	}

	:global([data-theme='dark']) .toc-btn.is-active,
	:global(.dark) .toc-btn.is-active {
		border-color: var(--brand-gold);
		box-shadow: 0 0 0 3px rgba(255, 179, 39, 0.25);
		color: var(--brand-gold);
	}

	/* MOBILE DOCK */
	@media (max-width: 900px) {
		.brand-toc {
			position: fixed;
			top: auto;
			bottom: calc(max(0.6rem, env(safe-area-inset-bottom, 0.6rem)));
			left: 50%;
			transform: translateX(-50%);
			width: calc(100% - 1.5rem);
			max-width: 480px;
			z-index: 45;
			pointer-events: none;
		}

		.toc-list {
			pointer-events: auto;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			gap: 4px;
			padding: 0.35rem 0.45rem;
			border-radius: 16px;
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
		}

		.toc-divider {
			width: 1px;
			height: 28px;
			align-self: center;
			margin: 0 2px;
		}

		.toc-btn {
			width: clamp(32px, 8.5vw, 40px);
			height: clamp(32px, 8.5vw, 40px);
			border-radius: 9px;
			flex-shrink: 1;
		}

		.toc-tooltip {
			display: none;
		}
	}
</style>

