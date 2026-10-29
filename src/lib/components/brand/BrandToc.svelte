<script lang="ts">
	import { langStore } from '$lib/lang.svelte';

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
		{ id: 'photo-logos', num: '09', titleUk: 'Емблеми з тваринами', titleEn: 'Animal Emblems', iconType: 'photo' }
	];

	let activeId = $state<string>('palette');
	let host = $state<HTMLElement | null>(null);

	$effect(() => {
		if (typeof window === 'undefined') return;

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
			activeId = current.id;
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
						<span class="palette-dots">
							<span class="dot dot--gold"></span>
							<span class="dot dot--leaf"></span>
							<span class="dot dot--emerald"></span>
						</span>
					{:else if s.iconType === 'paw'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 15c-1.5 0-2.8 1-2.8 2.2 0 1.2 1.3 2.2 2.8 2.2s2.8-1 2.8-2.2c0-1.2-1.3-2.2-2.8-2.2zM7.5 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6-4.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
						</svg>
					{:else if s.iconType === 'naming'}
						<span class="glyph-badge">UA</span>
					{:else if s.iconType === 'slogan'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					{:else if s.iconType === 'animals'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="9"/>
							<path d="M10 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
							<path d="M14 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
							<path d="M8 14s1.5 2 4 2 4-2 4-2"/>
						</svg>
					{:else if s.iconType === 'qr'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="3" width="7" height="7"/>
							<rect x="14" y="3" width="7" height="7"/>
							<rect x="3" y="14" width="7" height="7"/>
							<rect x="14" y="14" width="3" height="3"/>
							<rect x="18" y="18" width="3" height="3"/>
						</svg>
					{:else if s.iconType === 'typography'}
						<span class="type-glyph">Aa</span>
					{:else if s.iconType === 'doors'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/>
							<path d="M2 20h20"/>
							<circle cx="14" cy="12" r="1"/>
						</svg>
					{:else if s.iconType === 'photo'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
							<circle cx="8.5" cy="8.5" r="1.5"/>
							<polyline points="21 15 16 10 5 21"/>
						</svg>
					{/if}
				</span>

				<span class="toc-tooltip" role="tooltip">
					<span class="tooltip-num">{s.num}</span>
					<span class="tooltip-text">{langStore.current === 'uk' ? s.titleUk : s.titleEn}</span>
				</span>
			</a>
		{/each}
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

	.palette-dots {
		display: flex;
		gap: 3px;
		align-items: center;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.dot--gold { background: #FFB327; }
	.dot--leaf { background: #598F3A; }
	.dot--emerald { background: #13371B; }

	.glyph-badge {
		font-size: 0.76rem;
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	.type-glyph {
		font-size: 0.95rem;
		font-weight: 800;
		font-family: serif;
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

	.toc-tooltip::before {
		content: '';
		position: absolute;
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		border: 5px solid transparent;
		border-right-color: #13371b;
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

	/* MOBILE DOCK */
	@media (max-width: 900px) {
		.brand-toc {
			position: fixed;
			top: auto;
			bottom: calc(max(0.6rem, env(safe-area-inset-bottom, 0.6rem)));
			left: 50%;
			transform: translateX(-50%);
			width: calc(100% - 1.5rem);
			max-width: 440px;
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

		.toc-btn {
			width: clamp(34px, 10vw, 42px);
			height: clamp(34px, 10vw, 42px);
			border-radius: 9px;
			flex-shrink: 1;
		}

		.toc-tooltip {
			display: none;
		}
	}
</style>

