<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { SIGNAGE_BRAND_COLORS, type SignColor } from '$lib/data/doorSignage';

	interface Props {
		activeSection?: string;
		selectedColor?: string | null;
		onColorChange?: (color: string) => void;
		onSectionActive?: (sectionId: string) => void;
		activeTargetName?: string;
		colors?: SignColor[];
	}

	let {
		activeSection = 'door-signs',
		selectedColor = null,
		onColorChange,
		onSectionActive,
		activeTargetName = '',
		colors = SIGNAGE_BRAND_COLORS
	}: Props = $props();

	// Sections where BrandColorNav is active and provides universal color control
	const COLOR_SECTIONS = ['logo-studio', 'slogan', 'animals', 'door-signs'];

	let isVisible = $state(false);
	let detectedSection = $state<string>('door-signs');

	$effect(() => {
		if (!browser) return;

		const checkVisibility = () => {
			const viewHeight = window.innerHeight;
			let bestId: string | null = null;
			let maxVisibleHeight = 0;

			for (const id of COLOR_SECTIONS) {
				const el = document.getElementById(id);
				if (!el) continue;

				const rect = el.getBoundingClientRect();
				const visibleTop = Math.max(0, rect.top);
				const visibleBottom = Math.min(viewHeight, rect.bottom);
				const visibleHeight = Math.max(0, visibleBottom - visibleTop);

				if (visibleHeight > 60 && visibleHeight > maxVisibleHeight) {
					maxVisibleHeight = visibleHeight;
					bestId = id;
				}
			}

			if (bestId && maxVisibleHeight > 60) {
				isVisible = true;
				detectedSection = bestId;
				onSectionActive?.(bestId);
			} else {
				if (COLOR_SECTIONS.includes(activeSection)) {
					const el = document.getElementById(activeSection);
					if (el) {
						const r = el.getBoundingClientRect();
						if (r.bottom > 0 && r.top < viewHeight) {
							isVisible = true;
							detectedSection = activeSection;
							return;
						}
					}
				}
				isVisible = false;
			}
		};

		let queued = false;
		const onScroll = () => {
			if (queued) return;
			queued = true;
			requestAnimationFrame(() => {
				checkVisibility();
				queued = false;
			});
		};

		checkVisibility();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	let currentSection = $derived(
		COLOR_SECTIONS.includes(activeSection) ? activeSection : detectedSection
	);

	let activeHex = $derived(
		selectedColor ?? (themeStore.current === 'dark' ? '#93C84A' : '#13371B')
	);

	// Primary brand palette (excluding monochrome White & Black)
	let primaryColors = $derived(
		colors.filter((c) => c.hex.toUpperCase() !== '#FFFFFF' && c.hex.toUpperCase() !== '#000000')
	);

	// Monochromatic White & Black swatches placed at the end, separated by divider line
	let monoColors = $derived<SignColor[]>([
		{
			hex: '#FFFFFF',
			name: langStore.current === 'uk' ? 'Білий' : 'Pure White',
			textColor: '#13371b'
		},
		{
			hex: '#000000',
			name: langStore.current === 'uk' ? 'Чорний' : 'Black',
			textColor: '#ffffff'
		}
	]);

	let allPresetColors = $derived([...primaryColors, ...monoColors]);

	let isCustomActive = $derived(
		!allPresetColors.some((c) => c.hex.toUpperCase() === activeHex.toUpperCase())
	);

	let currentSectionTitle = $derived.by(() => {
		switch (currentSection) {
			case 'logo-studio':
				return langStore.current === 'uk'
					? activeTargetName
						? `Колір: ${activeTargetName}`
						: 'Колір логотипу'
					: activeTargetName
						? `Color: ${activeTargetName}`
						: 'Logo Color';
			case 'slogan':
				return langStore.current === 'uk' ? 'Колір метелика' : 'Butterfly Color';
			case 'animals':
				return langStore.current === 'uk' ? 'Колір іконок тварин' : 'Animal Icons Color';
			case 'door-signs':
				return langStore.current === 'uk' ? 'Колір табличок та стрілки' : 'Sign & Arrow Color';
			default:
				return langStore.current === 'uk' ? 'Фірмовий колір' : 'Brand Color';
		}
	});

	function handleSelect(hex: string) {
		if (onColorChange) {
			onColorChange(hex);
		}
	}

	function scrollToCurrentSection(e: MouseEvent) {
		e.preventDefault();
		if (!browser) return;
		const target = document.getElementById(currentSection);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<aside
	class="brand-color-nav"
	class:is-visible={isVisible}
	aria-label={langStore.current === 'uk'
		? 'Швидкий вибір фірмового кольору'
		: 'Brand Color Palette'}
>
	<div class="color-nav-list" role="toolbar" aria-label="Кольори розділу">
		<!-- Navigation Header Icon / Scroll to Active Section button -->
		<button
			type="button"
			class="color-nav-head-btn"
			onclick={scrollToCurrentSection}
			title="{currentSectionTitle}: {activeHex}"
			aria-label="{currentSectionTitle}: {activeHex}"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
				<circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
				<circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
				<circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
				<path
					d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
				/>
			</svg>
			<span class="color-tooltip" role="tooltip">
				<span class="tooltip-text">
					{currentSectionTitle}:
					<strong>{activeHex}</strong>
				</span>
			</span>
		</button>

		<div class="color-nav-divider" role="separator"></div>

		<!-- Primary brand color swatches -->
		{#each primaryColors as c (c.hex)}
			{@const isActive = activeHex.toUpperCase() === c.hex.toUpperCase()}
			<button
				type="button"
				class="color-btn"
				class:is-active={isActive}
				style:background-color={c.hex}
				onclick={() => handleSelect(c.hex)}
				title="{c.name} ({c.hex})"
				aria-label="{c.name} ({c.hex})"
			>
				{#if isActive}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke={c.textColor}
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				{/if}

				<span class="color-tooltip" role="tooltip">
					<span class="tooltip-text">{c.name}</span>
					<span class="tooltip-hex">{c.hex}</span>
				</span>
			</button>
		{/each}

		<div class="color-nav-divider" role="separator"></div>

		<!-- Monochromatic swatches (White and Black) separated by divider line -->
		{#each monoColors as c (c.hex)}
			{@const isActive = activeHex.toUpperCase() === c.hex.toUpperCase()}
			<button
				type="button"
				class="color-btn"
				class:is-active={isActive}
				class:is-white-btn={c.hex === '#FFFFFF'}
				class:is-black-btn={c.hex === '#000000'}
				style:background-color={c.hex}
				onclick={() => handleSelect(c.hex)}
				title="{c.name} ({c.hex})"
				aria-label="{c.name} ({c.hex})"
			>
				{#if isActive}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke={c.textColor}
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				{/if}

				<span class="color-tooltip" role="tooltip">
					<span class="tooltip-text">{c.name}</span>
					<span class="tooltip-hex">{c.hex}</span>
				</span>
			</button>
		{/each}

		<div class="color-nav-divider" role="separator"></div>

		<!-- Custom HTML5 Color Picker Button -->
		<label
			class="color-btn custom-picker-btn"
			class:is-active={isCustomActive}
			title={langStore.current === 'uk' ? 'Власний колір (палітра)' : 'Custom color'}
		>
			<input
				type="color"
				value={activeHex}
				oninput={(e) => handleSelect((e.target as HTMLInputElement).value.toUpperCase())}
				aria-label="Custom color picker"
			/>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#ffffff"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="picker-icon"
				aria-hidden="true"
			>
				<circle cx="13.5" cy="6.5" r=".5" fill="#ffffff" />
				<circle cx="17.5" cy="10.5" r=".5" fill="#ffffff" />
				<circle cx="8.5" cy="7.5" r=".5" fill="#ffffff" />
				<circle cx="6.5" cy="12.5" r=".5" fill="#ffffff" />
				<path
					d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
				/>
			</svg>
			<span class="color-tooltip" role="tooltip">
				<span class="tooltip-text"
					>{langStore.current === 'uk' ? 'Власний колір' : 'Custom color'}</span
				>
				<span class="tooltip-hex">{activeHex}</span>
			</span>
		</label>
	</div>
</aside>

<style>
	.brand-color-nav {
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
		align-self: start;
		z-index: 30;
		max-height: 94vh;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.25s ease,
			visibility 0.25s ease;
	}

	.brand-color-nav.is-visible {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	.color-nav-list {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		background: var(--panel-bg);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		padding: 0.55rem;
		border-radius: 18px;
		border: 1px solid var(--border);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		width: fit-content;
		align-items: center;
		max-height: 94vh;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.color-nav-list::-webkit-scrollbar {
		display: none;
	}

	.color-nav-head-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--bg-secondary);
		border: 1.5px solid var(--border);
		color: var(--brand-leaf, #598f3a);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .color-nav-head-btn,
	:global(.dark) .color-nav-head-btn {
		color: var(--brand-gold, #ffb327);
		border-color: rgba(255, 179, 39, 0.2);
	}

	.color-nav-head-btn:hover {
		transform: scale(1.06);
		border-color: var(--brand-leaf, #598f3a);
		background: var(--panel-bg);
	}

	:global([data-theme='dark']) .color-nav-head-btn:hover,
	:global(.dark) .color-nav-head-btn:hover {
		border-color: var(--brand-gold, #ffb327);
	}

	.color-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		border: 2px solid rgba(0, 0, 0, 0.12);
		cursor: pointer;
		transition: all 0.18s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='dark']) .color-btn,
	:global(.dark) .color-btn {
		border-color: rgba(255, 255, 255, 0.15);
	}

	.color-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		z-index: 2;
	}

	.color-btn.is-active {
		border-color: var(--brand-leaf, #598f3a);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.35);
		transform: scale(1.08);
		z-index: 3;
	}

	:global([data-theme='dark']) .color-btn.is-active,
	:global(.dark) .color-btn.is-active {
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 0 0 3px rgba(255, 179, 39, 0.35);
	}

	.is-white-btn {
		border-color: rgba(0, 0, 0, 0.22);
	}

	:global([data-theme='dark']) .is-white-btn,
	:global(.dark) .is-white-btn {
		border-color: rgba(255, 255, 255, 0.35);
	}

	.is-black-btn {
		border-color: rgba(0, 0, 0, 0.35);
	}

	:global([data-theme='dark']) .is-black-btn,
	:global(.dark) .is-black-btn {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.color-nav-divider {
		height: 1px;
		width: 100%;
		background: var(--border);
		margin: 2px 0;
	}

	/* CUSTOM PICKER BUTTON */
	.custom-picker-btn {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		background: transparent;
	}

	.custom-picker-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 10px;
		background: conic-gradient(
			from 0deg at 50% 50%,
			#ff0000 0deg,
			#ffa500 51deg,
			#ffff00 102deg,
			#008000 153deg,
			#0000ff 204deg,
			#4b0082 255deg,
			#ee82ee 306deg,
			#ff0000 360deg
		);
		z-index: 0;
	}

	.custom-picker-btn input[type='color'] {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.picker-icon {
		position: relative;
		z-index: 1;
		filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7));
	}

	/* TOOLTIPS (Displayed to the left of the sticky bar) */
	.color-tooltip {
		position: absolute;
		right: calc(100% + 12px);
		top: 50%;
		transform: translateY(-50%) translateX(6px);
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

	:global([data-theme='dark']) .color-tooltip,
	:global(.dark) .color-tooltip {
		background: #182b1d;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #f5f8f5;
	}

	.color-tooltip::before {
		content: '';
		position: absolute;
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		border: 5px solid transparent;
		border-left-color: #13371b;
	}

	:global([data-theme='dark']) .color-tooltip::before,
	:global(.dark) .color-tooltip::before {
		border-left-color: #182b1d;
	}

	.tooltip-hex {
		color: #ffb327;
		font-family: monospace;
		font-size: 0.76rem;
		font-weight: 800;
	}

	.color-btn:hover .color-tooltip,
	.color-btn:focus-visible .color-tooltip,
	.color-nav-head-btn:hover .color-tooltip,
	.color-nav-head-btn:focus-visible .color-tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateY(-50%) translateX(0);
	}

	@media (max-width: 900px) {
		.brand-color-nav {
			display: none;
		}
	}
</style>
