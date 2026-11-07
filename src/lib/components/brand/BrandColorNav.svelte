<script lang="ts">
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { SIGNAGE_BRAND_COLORS, type SignColor } from '$lib/data/doorSignage';
	import {
		ORACAL_PRIORITY_COLORS,
		ORACAL_641_PALETTE,
		type OracalCategory
	} from '$lib/data/oracal641Data';

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
	let isSteleActive = $state<boolean>(false);
	let isOracalPopoverOpen = $state<boolean>(false);
	let oracalSearch = $state<string>('');
	let oracalCat = $state<OracalCategory | 'all'>('all');

	let filteredOracalPalette = $derived(
		ORACAL_641_PALETTE.filter((c) => {
			const matchesCat = oracalCat === 'all' || c.category === oracalCat;
			if (!matchesCat) return false;
			if (!oracalSearch.trim()) return true;
			const q = oracalSearch.toLowerCase().trim();
			return (
				c.code.toLowerCase().includes(q) ||
				c.nameEn.toLowerCase().includes(q) ||
				c.nameUk.toLowerCase().includes(q)
			);
		})
	);

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

			// Specifically detect if directory-stele physical mockup is in main viewport focus
			const steleEl = document.getElementById('directory-stele');
			if (steleEl) {
				const sRect = steleEl.getBoundingClientRect();
				const sVisibleTop = Math.max(0, sRect.top);
				const sVisibleBottom = Math.min(viewHeight, sRect.bottom);
				const sVisibleH = Math.max(0, sVisibleBottom - sVisibleTop);
				// Hysteresis buffer to ensure calm, flicker-free transitions
				isSteleActive = isSteleActive ? sVisibleH > 80 : sVisibleH > 160;
			} else {
				isSteleActive = false;
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

		const onDocClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (isOracalPopoverOpen && !target.closest('.oracal-popover-anchor')) {
				isOracalPopoverOpen = false;
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') isOracalPopoverOpen = false;
		};

		window.addEventListener('click', onDocClick);
		window.addEventListener('keydown', onKeyDown);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('click', onDocClick);
			window.removeEventListener('keydown', onKeyDown);
		};
	});

	let currentSection = $derived(
		COLOR_SECTIONS.includes(activeSection) ? activeSection : detectedSection
	);

	let activeHex = $derived(
		selectedColor ??
			(currentSection === 'door-signs' && isSteleActive
				? null
				: themeStore.current === 'dark'
					? '#93C84A'
					: '#13371B')
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
		activeHex
			? !allPresetColors.some((c) => c.hex.toUpperCase() === activeHex.toUpperCase())
			: false
	);

	let isTransparentActive = $derived(
		selectedColor?.toLowerCase() === 'transparent' || selectedColor?.toLowerCase() === 'checker'
	);

	let currentSectionTitle = $derived.by(() => {
		if (isSteleActive) {
			return langStore.current === 'uk'
				? activeTargetName
					? `Стела: ${activeTargetName}`
					: 'ORACAL 641 (Стела)'
				: activeTargetName
					? `Stele: ${activeTargetName}`
					: 'ORACAL 641 (Stele)';
		}
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
			title="{currentSectionTitle}{activeHex ? ': ' + activeHex : ''}"
			aria-label="{currentSectionTitle}{activeHex ? ': ' + activeHex : ''}"
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
					<strong
						>{activeHex === 'transparent'
							? langStore.current === 'uk'
								? 'Прозорий'
								: 'Transparent'
							: (activeHex ?? '')}</strong
					>
				</span>
			</span>
		</button>

		<div class="color-nav-divider" role="separator"></div>

		<div class="color-nav-switch-container">
			{#if isSteleActive}
				<div class="color-nav-flow-group" transition:fade={{ duration: 500 }}>
					<!-- ORACAL® 641 (STELE) MODE: Priority swatches + transparent + full catalog popover -->
					<!-- 5 Green shades -->
					{#each ORACAL_PRIORITY_COLORS.slice(0, 5) as c (c.code)}
						{@const isActive = activeHex ? activeHex.toUpperCase() === c.hex.toUpperCase() : false}
						<button
							type="button"
							class="color-btn"
							class:is-active={isActive}
							style:background-color={c.hex}
							onclick={() => handleSelect(c.hex)}
							title="{c.code} {langStore.current === 'uk' ? c.nameUk : c.nameEn} ({c.hex})"
							aria-label="{c.code} {c.nameEn}"
						>
							{#if isActive}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#ffffff"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}

							<span class="color-tooltip" role="tooltip">
								<span class="tooltip-text"
									>{c.code} {langStore.current === 'uk' ? c.nameUk : c.nameEn}</span
								>
								<span class="tooltip-hex">{c.hex}</span>
							</span>
						</button>
					{/each}

					<div class="color-nav-divider" role="separator"></div>

					<!-- 2 Neutrals (010M White & 070M Black) + Transparent (Checkerboard) -->
					{#each ORACAL_PRIORITY_COLORS.slice(5, 7) as c (c.code)}
						{@const isActive = activeHex ? activeHex.toUpperCase() === c.hex.toUpperCase() : false}
						<button
							type="button"
							class="color-btn"
							class:is-active={isActive}
							class:is-white-btn={c.code === '010M'}
							class:is-black-btn={c.code === '070M'}
							style:background-color={c.hex}
							onclick={() => handleSelect(c.hex)}
							title="{c.code} {langStore.current === 'uk' ? c.nameUk : c.nameEn} ({c.hex})"
							aria-label="{c.code} {c.nameEn}"
						>
							{#if isActive}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke={c.code === '010M' ? '#13371b' : '#ffffff'}
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}

							<span class="color-tooltip" role="tooltip">
								<span class="tooltip-text"
									>{c.code} {langStore.current === 'uk' ? c.nameUk : c.nameEn}</span
								>
								<span class="tooltip-hex">{c.hex}</span>
							</span>
						</button>
					{/each}

					<!-- Transparent / Checkerboard Swatch -->
					<button
						type="button"
						class="color-btn is-transparent-btn"
						class:is-active={isTransparentActive}
						onclick={() => handleSelect('transparent')}
						title={langStore.current === 'uk' ? 'Прозорий (Шахівниця)' : 'Transparent (Grid)'}
						aria-label={langStore.current === 'uk' ? 'Прозорий' : 'Transparent'}
					>
						{#if isTransparentActive}
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#13371b"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						{/if}

						<span class="color-tooltip" role="tooltip">
							<span class="tooltip-text"
								>{langStore.current === 'uk' ? 'Прозорий' : 'Transparent'}</span
							>
							<span class="tooltip-hex">{langStore.current === 'uk' ? 'Шахівниця' : 'Checker'}</span
							>
						</span>
					</button>

					<div class="color-nav-divider" role="separator"></div>

					<!-- 2 Accents (019M Signal Yellow & 091M Gold Metallic) -->
					{#each ORACAL_PRIORITY_COLORS.slice(7, 9) as c (c.code)}
						{@const isActive = activeHex ? activeHex.toUpperCase() === c.hex.toUpperCase() : false}
						<button
							type="button"
							class="color-btn"
							class:is-active={isActive}
							style:background-color={c.hex}
							onclick={() => handleSelect(c.hex)}
							title="{c.code} {langStore.current === 'uk' ? c.nameUk : c.nameEn} ({c.hex})"
							aria-label="{c.code} {c.nameEn}"
						>
							{#if isActive}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#101e14"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}

							<span class="color-tooltip" role="tooltip">
								<span class="tooltip-text"
									>{c.code} {langStore.current === 'uk' ? c.nameUk : c.nameEn}</span
								>
								<span class="tooltip-hex">{c.hex}</span>
							</span>
						</button>
					{/each}

					<div class="color-nav-divider" role="separator"></div>

					<!-- All 59 Oracal catalog popover trigger button -->
					<div class="oracal-popover-anchor">
						<button
							type="button"
							class="color-btn oracal-catalog-btn"
							class:is-active={isOracalPopoverOpen}
							onclick={(e) => {
								e.stopPropagation();
								isOracalPopoverOpen = !isOracalPopoverOpen;
							}}
							title={langStore.current === 'uk'
								? 'Каталог усіх 59 плівок ORACAL 641'
								: 'All 59 ORACAL films catalog'}
							aria-label="Всі плівки ORACAL 641"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								aria-hidden="true"
							>
								<rect x="3" y="3" width="7" height="7"></rect>
								<rect x="14" y="3" width="7" height="7"></rect>
								<rect x="14" y="14" width="7" height="7"></rect>
								<rect x="3" y="14" width="7" height="7"></rect>
							</svg>
							<span class="color-tooltip" role="tooltip">
								<span class="tooltip-text"
									>{langStore.current === 'uk' ? 'Всі 59 плівок' : 'All 59 Films'}</span
								>
								<span class="tooltip-hex">ORACAL 641</span>
							</span>
						</button>

						{#if isOracalPopoverOpen}
							<div
								class="oracal-flyout-popover"
								role="dialog"
								aria-label="Каталог плівок ORACAL 641"
								tabindex="-1"
								onclick={(e) => e.stopPropagation()}
								onkeydown={(e) => {
									if (e.key === 'Escape') isOracalPopoverOpen = false;
								}}
							>
								<div class="flyout-header">
									<div class="flyout-title-row">
										<span class="flyout-title">ORACAL® 641 (Matt)</span>
										<span class="flyout-count">59</span>
									</div>
									<button
										type="button"
										class="flyout-close-btn"
										onclick={() => (isOracalPopoverOpen = false)}
										aria-label="Close">✕</button
									>
								</div>

								<div class="flyout-search-row">
									<input
										type="text"
										class="flyout-search-input"
										placeholder={langStore.current === 'uk'
											? 'Пошук: 068, grass, green...'
											: 'Search: 068, green...'}
										bind:value={oracalSearch}
									/>
								</div>

								<div class="flyout-swatches-grid">
									{#each filteredOracalPalette as film (film.code)}
										{@const isSelected = activeHex
											? activeHex.toUpperCase() === film.hex.toUpperCase()
											: false}
										<button
											type="button"
											class="flyout-swatch-item"
											class:is-selected={isSelected}
											onclick={() => {
												handleSelect(film.hex);
												isOracalPopoverOpen = false;
											}}
											title="{film.code} {film.nameEn}"
										>
											<span class="flyout-dot" style:background-color={film.hex}></span>
											<span class="flyout-code">{film.code}</span>
											{#if isSelected}
												<span class="flyout-check">✓</span>
											{/if}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="color-nav-flow-group" transition:fade={{ duration: 500 }}>
					<!-- Primary brand color swatches -->
					{#each primaryColors as c (c.hex)}
						{@const isActive = activeHex ? activeHex.toUpperCase() === c.hex.toUpperCase() : false}
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
						{@const isActive = activeHex ? activeHex.toUpperCase() === c.hex.toUpperCase() : false}
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

					{#if currentSection === 'door-signs'}
						<button
							type="button"
							class="color-btn is-transparent-btn"
							class:is-active={isTransparentActive}
							onclick={() => handleSelect('transparent')}
							title={langStore.current === 'uk' ? 'Прозорий (Шахівниця)' : 'Transparent (Grid)'}
							aria-label={langStore.current === 'uk' ? 'Прозорий' : 'Transparent'}
						>
							{#if isTransparentActive}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#13371b"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}

							<span class="color-tooltip" role="tooltip">
								<span class="tooltip-text"
									>{langStore.current === 'uk' ? 'Прозорий' : 'Transparent'}</span
								>
								<span class="tooltip-hex"
									>{langStore.current === 'uk' ? 'Шахівниця' : 'Checker'}</span
								>
							</span>
						</button>
					{/if}

					<div class="color-nav-divider" role="separator"></div>

					<!-- Custom HTML5 Color Picker Button -->
					<label
						class="color-btn custom-picker-btn"
						class:is-active={isCustomActive}
						title={langStore.current === 'uk' ? 'Власний колір (палітра)' : 'Custom color'}
					>
						<input
							type="color"
							value={activeHex?.startsWith('#') && activeHex.length === 7 ? activeHex : '#13371B'}
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
			{/if}
		</div>
	</div>
</aside>

<style>
	.brand-color-nav {
		position: sticky;
		top: 50%;
		transform: translateY(-50%);
		align-self: start;
		z-index: 50;
		max-height: 94vh;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			visibility 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
		overflow: visible;
		transition:
			background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.color-nav-switch-container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		align-items: start;
		justify-items: center;
		width: 100%;
		position: relative;
		overflow: visible;
	}

	.color-nav-switch-container > .color-nav-flow-group {
		grid-column: 1 / 2;
		grid-row: 1 / 2;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		align-items: center;
		width: 100%;
	}

	.color-nav-flow-group {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		align-items: center;
		width: 100%;
	}

	.color-nav-head-btn {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--border);
		color: var(--brand-leaf, #598f3a);
		cursor: pointer;
		transition:
			color 0.4s ease,
			border-color 0.4s ease,
			background-color 0.4s ease,
			transform 0.3s ease;
	}

	:global([data-theme='dark']) .color-nav-head-btn,
	:global(.dark) .color-nav-head-btn {
		color: var(--brand-gold, #ffb327);
		border-color: rgba(255, 179, 39, 0.25);
		background: rgba(255, 179, 39, 0.08);
	}

	.color-nav-head-btn:hover {
		transform: scale(1.1);
		border-color: var(--brand-leaf, #598f3a);
	}

	:global([data-theme='dark']) .color-nav-head-btn:hover,
	:global(.dark) .color-nav-head-btn:hover {
		border-color: var(--brand-gold, #ffb327);
	}

	.color-btn {
		position: relative;
		width: 28px;
		height: 28px;
		border-radius: 12px;
		border: 2px solid rgba(0, 0, 0, 0.12);
		cursor: pointer;
		transition:
			background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.45s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.4s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.color-btn svg {
		animation: checkmark-fade-scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	@keyframes checkmark-fade-scale {
		0% {
			opacity: 0;
			transform: scale(0.45);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
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

	/* TRANSPARENT (CHECKERBOARD) BUTTON */
	.is-transparent-btn {
		position: relative;
		background-color: #ffffff;
		background-image:
			linear-gradient(45deg, #cbd5e1 25%, transparent 25%),
			linear-gradient(-45deg, #cbd5e1 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #cbd5e1 75%),
			linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);
		background-size: 8px 8px;
		background-position:
			0 0,
			0 4px,
			4px -4px,
			-4px 0;
		border-color: rgba(0, 0, 0, 0.22);
	}

	:global([data-theme='dark']) .is-transparent-btn,
	:global(.dark) .is-transparent-btn {
		background-color: #1e293b;
		background-image:
			linear-gradient(45deg, #475569 25%, transparent 25%),
			linear-gradient(-45deg, #475569 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #475569 75%),
			linear-gradient(-45deg, transparent 75%, #475569 75%);
		border-color: rgba(255, 255, 255, 0.25);
	}

	:global([data-theme='dark']) .is-transparent-btn svg,
	:global(.dark) .is-transparent-btn svg {
		stroke: #ffffff;
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
		overflow: visible;
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
		font-weight: 600;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			visibility 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: center;
		gap: 0.45rem;
		z-index: 100;
	}

	:global([data-theme='dark']) .color-tooltip,
	:global(.dark) .color-tooltip {
		background: #2a3d2e;
		border: 1px solid rgba(147, 200, 74, 0.3);
		color: #ffffff;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
	}

	.color-tooltip::after {
		content: '';
		position: absolute;
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		border: 5px solid transparent;
		border-left-color: #13371b;
	}

	:global([data-theme='dark']) .color-tooltip::after,
	:global(.dark) .color-tooltip::after {
		border-left-color: #2a3d2e;
	}

	.color-btn:hover .color-tooltip,
	.color-nav-head-btn:hover .color-tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateY(-50%) translateX(0);
	}

	.tooltip-text {
		color: #ffffff;
	}

	.tooltip-hex {
		font-family: monospace;
		font-size: 0.72rem;
		background: rgba(255, 255, 255, 0.18);
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		color: #ffffff;
	}

	@media (max-width: 900px) {
		.brand-color-nav {
			display: none;
		}
	}

	/* ORACAL FLYOUT POPOVER */
	.oracal-popover-anchor {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.oracal-catalog-btn {
		background: rgba(0, 120, 63, 0.15) !important;
		color: #00783f;
		border: 1px solid rgba(0, 120, 63, 0.3) !important;
	}

	:global(.dark) .oracal-catalog-btn {
		background: rgba(147, 200, 74, 0.18) !important;
		color: #93c84a;
		border-color: rgba(147, 200, 74, 0.4) !important;
	}

	.oracal-catalog-btn.is-active {
		background: #00783f !important;
		color: #ffffff !important;
		box-shadow: 0 0 0 2px #00783f;
	}

	.oracal-flyout-popover {
		position: absolute;
		right: calc(100% + 14px);
		bottom: -20px;
		width: 280px;
		max-height: 400px;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border);
		border-radius: 14px;
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 100;
		animation: popIn 0.15s ease-out;
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: translateX(10px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateX(0) scale(1);
		}
	}

	.flyout-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid var(--border);
	}

	.flyout-title-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.flyout-title {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.flyout-count {
		font-size: 0.68rem;
		font-weight: 800;
		background: #00783f;
		color: #ffffff;
		padding: 0.1rem 0.35rem;
		border-radius: 9999px;
	}

	.flyout-close-btn {
		background: none;
		border: none;
		font-size: 0.85rem;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.2rem;
		line-height: 1;
	}

	.flyout-close-btn:hover {
		color: var(--text-primary);
	}

	.flyout-search-row {
		width: 100%;
	}

	.flyout-search-input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.35rem 0.6rem;
		font-size: 0.75rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.flyout-search-input:focus {
		outline: none;
		border-color: #00783f;
	}

	.flyout-swatches-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.3rem;
		max-height: 280px;
		overflow-y: auto;
		scrollbar-width: thin;
		padding-right: 2px;
	}

	.flyout-swatch-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.4rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.flyout-swatch-item:hover {
		border-color: #00783f;
		background: var(--bg-primary);
	}

	.flyout-swatch-item.is-selected {
		border-color: #00783f;
		box-shadow: 0 0 0 1.5px #00783f;
	}

	.flyout-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
	}

	.flyout-code {
		font-size: 0.68rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.flyout-check {
		margin-left: auto;
		font-size: 0.68rem;
		color: #00783f;
		font-weight: 800;
	}
</style>
