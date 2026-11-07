<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import {
		ORACAL_641_PALETTE,
		ORACAL_PRIORITY_COLORS,
		ORACAL_CATEGORIES,
		type OracalColor,
		type OracalCategory
	} from '$lib/data/oracal641Data';

	interface Props {
		selectedColor: OracalColor;
		onselect: (color: OracalColor) => void;
		label?: string;
		compact?: boolean;
		align?: 'left' | 'center' | 'right';
		disabled?: boolean;
	}

	let {
		selectedColor,
		onselect,
		label,
		compact = false,
		align = 'center',
		disabled = false
	}: Props = $props();

	let isOpen = $state(false);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let autoAlign = $state<'left' | 'center' | 'right' | null>(null);
	let effectiveAlign = $derived(autoAlign ?? align);

	let searchQuery = $state('');
	let activeCategory = $state<OracalCategory | 'all'>('all');

	// Unique ID coordinate closing across all picker instances
	const instanceId = Math.random().toString(36).slice(2, 9);
	const GLOBAL_PICKER_EVENT = 'vetcrew:close-oracal-pickers';

	function togglePopover(e: MouseEvent) {
		e.stopPropagation();
		if (disabled) return;
		if (!isOpen) {
			window.dispatchEvent(
				new CustomEvent(GLOBAL_PICKER_EVENT, { detail: { openId: instanceId } })
			);
			isOpen = true;
			searchQuery = '';
			activeCategory = 'all';
			autoAlign = null;
		} else {
			isOpen = false;
		}
	}

	function handleColorSelect(color: OracalColor) {
		onselect(color);
		isOpen = false;
	}

	// Filter colors based on category and search query
	let filteredColors = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		return ORACAL_641_PALETTE.filter((c) => {
			if (activeCategory !== 'all' && c.category !== activeCategory) {
				return false;
			}
			if (!q) return true;
			return (
				c.code.toLowerCase().includes(q) ||
				c.nameEn.toLowerCase().includes(q) ||
				c.nameUk.toLowerCase().includes(q)
			);
		});
	});

	// Screen edge detection to prevent clipping
	$effect(() => {
		if (isOpen && popoverEl) {
			const rect = popoverEl.getBoundingClientRect();
			const rightMargin = window.innerWidth - rect.right;
			const leftMargin = rect.left;

			if (rightMargin < 16) {
				autoAlign = 'right';
			} else if (leftMargin < 16) {
				autoAlign = 'left';
			} else {
				autoAlign = null;
			}
		}
	});

	$effect(() => {
		if (!browser) return;

		const onDocClick = () => {
			if (isOpen) isOpen = false;
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) isOpen = false;
		};
		const onGlobalClose = (e: Event) => {
			const custom = e as CustomEvent<{ openId: string }>;
			if (custom.detail?.openId !== instanceId && isOpen) {
				isOpen = false;
			}
		};

		window.addEventListener('click', onDocClick);
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener(GLOBAL_PICKER_EVENT, onGlobalClose);
		return () => {
			window.removeEventListener('click', onDocClick);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener(GLOBAL_PICKER_EVENT, onGlobalClose);
		};
	});
</script>

<div
	class="oracal-picker-wrapper align--{effectiveAlign}"
	class:is-compact={compact}
	class:is-open={isOpen}
>
	{#if label}
		<span class="picker-label">{label}</span>
	{/if}

	<button
		type="button"
		class="picker-trigger-btn"
		class:is-compact={compact}
		onclick={togglePopover}
		{disabled}
		aria-haspopup="dialog"
		aria-expanded={isOpen}
		title="{langStore.current === 'uk'
			? 'Обрати плівку ORACAL 641'
			: 'Select ORACAL 641 Vinyl'}: {selectedColor.code} {langStore.current === 'uk'
			? selectedColor.nameUk
			: selectedColor.nameEn}"
	>
		<span class="color-dot" style="background-color: {selectedColor.hex};" aria-hidden="true"
		></span>
		<span class="color-code">{selectedColor.code}</span>
		<span class="color-name">
			{langStore.current === 'uk' ? selectedColor.nameUk : selectedColor.nameEn}
		</span>
		<svg
			width="10"
			height="10"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			class="chevron-icon"
			class:is-flipped={isOpen}
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>

	{#if isOpen}
		<!-- Popover Menu -->
		<div
			bind:this={popoverEl}
			class="picker-popover align--{effectiveAlign}"
			role="dialog"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') isOpen = false;
			}}
		>
			<div class="popover-header">
				<span class="popover-title">
					{langStore.current === 'uk' ? 'Плівка ORACAL® 641 (Matt)' : 'ORACAL® 641 (Matt) Film'}
				</span>
				<span class="popover-total">
					{filteredColors.length} / {ORACAL_641_PALETTE.length}
				</span>
			</div>

			<!-- Quick Priority Swatches -->
			<div class="priority-swatches-box">
				<span class="priority-label"
					>{langStore.current === 'uk' ? 'Швидкий вибір:' : 'Quick Select:'}</span
				>
				<div class="priority-swatches-row">
					{#each ORACAL_PRIORITY_COLORS as color (color.code)}
						<button
							type="button"
							class="priority-swatch"
							class:is-active={color.code === selectedColor.code}
							style="background-color: {color.hex};"
							title="{color.code} - {langStore.current === 'uk' ? color.nameUk : color.nameEn}"
							onclick={() => handleColorSelect(color)}
						>
							{#if color.code === selectedColor.code}
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3.5"
									class="swatch-check"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Search & Filter Controls -->
			<div class="popover-search-wrap">
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					class="search-icon"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
				<input
					type="text"
					class="search-input"
					bind:value={searchQuery}
					placeholder={langStore.current === 'uk'
						? 'Пошук: 068, green, білий...'
						: 'Search: 068, green, white...'}
					aria-label={langStore.current === 'uk' ? 'Пошук плівки Oracal' : 'Search Oracal vinyl'}
				/>
				{#if searchQuery}
					<button
						type="button"
						class="clear-search-btn"
						onclick={() => (searchQuery = '')}
						aria-label={langStore.current === 'uk' ? 'Очистити пошук' : 'Clear search'}
					>
						✕
					</button>
				{/if}
			</div>

			<!-- Category Tabs -->
			<div class="popover-categories">
				{#each ORACAL_CATEGORIES as cat (cat.id)}
					<button
						type="button"
						class="category-tab"
						class:is-active={activeCategory === cat.id}
						onclick={() => (activeCategory = cat.id)}
					>
						{langStore.current === 'uk' ? cat.nameUk : cat.nameEn}
					</button>
				{/each}
			</div>

			<!-- Scrollable Color Swatch List -->
			<div class="popover-colors-grid">
				{#if filteredColors.length === 0}
					<div class="no-results-msg">
						{langStore.current === 'uk' ? 'Плівку не знайдено' : 'No vinyl colors found'}
					</div>
				{:else}
					{#each filteredColors as color (color.code)}
						<button
							type="button"
							class="color-grid-item"
							class:is-selected={color.code === selectedColor.code}
							onclick={() => handleColorSelect(color)}
						>
							<span
								class="item-swatch-box"
								style="background-color: {color.hex};"
								aria-hidden="true"
							></span>
							<div class="item-text-info">
								<span class="item-code">{color.code}</span>
								<span class="item-name">
									{langStore.current === 'uk' ? color.nameUk : color.nameEn}
								</span>
							</div>
							{#if color.code === selectedColor.code}
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									class="selected-check-icon"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.oracal-picker-wrapper {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.oracal-picker-wrapper.is-compact {
		display: flex;
		width: 100%;
	}

	.oracal-picker-wrapper.is-open {
		z-index: 120;
	}

	.picker-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-secondary);
	}

	.picker-trigger-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.65rem;
		background: var(--panel-bg, #ffffff);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--fg-primary);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.18s ease;
		text-align: left;
		white-space: nowrap;
		max-width: 100%;
	}

	.picker-trigger-btn.is-compact {
		width: 100%;
		justify-content: flex-start;
		padding: 0.4rem 0.55rem;
		font-size: 0.75rem;
	}

	.picker-trigger-btn:hover:not(:disabled) {
		border-color: var(--border-hover);
		background: var(--bg-secondary);
	}

	.oracal-picker-wrapper.is-open .picker-trigger-btn {
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 0 0 2px rgba(89, 143, 58, 0.2);
	}

	:global(.dark) .oracal-picker-wrapper.is-open .picker-trigger-btn {
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 0 0 2px rgba(255, 179, 39, 0.25);
	}

	.picker-trigger-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.color-dot {
		display: inline-block;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.18);
		flex-shrink: 0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	}

	:global(.dark) .color-dot {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.color-code {
		font-weight: 800;
		font-family: monospace;
		font-size: 0.76rem;
		color: var(--brand-emerald, #13371b);
	}

	:global(.dark) .color-code {
		color: var(--brand-gold, #ffb327);
	}

	.color-name {
		color: var(--fg-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 130px;
	}

	.chevron-icon {
		margin-left: auto;
		color: var(--fg-muted, var(--fg-secondary));
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.chevron-icon.is-flipped {
		transform: rotate(180deg);
	}

	/* POPOVER */
	.picker-popover {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		min-width: 285px;
		max-width: 330px;
		background: #ffffff;
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 0.65rem;
		box-shadow:
			0 12px 32px rgba(0, 0, 0, 0.22),
			0 2px 6px rgba(0, 0, 0, 0.08);
		z-index: 150;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		animation: popIn 0.16s ease-out;
	}

	:global([data-theme='dark']) .picker-popover,
	:global(.dark) .picker-popover {
		background: #18221b;
		border-color: rgba(255, 255, 255, 0.16);
		box-shadow:
			0 14px 36px rgba(0, 0, 0, 0.6),
			0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.picker-popover.align--right {
		left: auto;
		right: 0;
	}

	.picker-popover.align--center {
		left: 50%;
		transform: translateX(-50%);
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.popover-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid var(--border);
	}

	.popover-title {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--fg-primary);
	}

	.popover-total {
		font-size: 0.68rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--fg-secondary);
	}

	/* Priority swatches */
	.priority-swatches-box {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.priority-label {
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--fg-secondary);
	}

	.priority-swatches-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.priority-swatch {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		border: 1px solid rgba(0, 0, 0, 0.18);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	:global(.dark) .priority-swatch {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.priority-swatch:hover {
		transform: scale(1.15);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
	}

	.priority-swatch.is-active {
		outline: 2px solid var(--brand-emerald, #13371b);
		outline-offset: 1px;
	}

	:global(.dark) .priority-swatch.is-active {
		outline-color: var(--brand-gold, #ffb327);
	}

	.swatch-check {
		stroke: #ffffff;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
	}

	/* Search input */
	.popover-search-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 0.55rem;
		color: var(--fg-secondary);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.4rem 1.6rem 0.4rem 1.7rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-primary);
		font-size: 0.76rem;
		outline: none;
		transition: border-color 0.15s ease;
	}

	.search-input:focus {
		border-color: var(--brand-emerald, #13371b);
	}

	:global(.dark) .search-input:focus {
		border-color: var(--brand-gold, #ffb327);
	}

	.clear-search-btn {
		position: absolute;
		right: 0.4rem;
		background: transparent;
		border: none;
		color: var(--fg-secondary);
		font-size: 0.75rem;
		cursor: pointer;
		padding: 0.2rem 0.35rem;
	}

	/* Categories */
	.popover-categories {
		display: flex;
		gap: 0.25rem;
		overflow-x: auto;
		padding-bottom: 0.2rem;
		scrollbar-width: thin;
	}

	.category-tab {
		white-space: nowrap;
		padding: 0.22rem 0.45rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		font-size: 0.68rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.category-tab:hover {
		color: var(--fg-primary);
		border-color: var(--border-hover);
	}

	.category-tab.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
	}

	:global(.dark) .category-tab.is-active {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	/* Colors list */
	.popover-colors-grid {
		max-height: 190px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding-right: 0.2rem;
	}

	.no-results-msg {
		padding: 1rem;
		text-align: center;
		font-size: 0.74rem;
		color: var(--fg-secondary);
	}

	.color-grid-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.45rem;
		border-radius: 7px;
		border: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
		width: 100%;
	}

	.color-grid-item:hover {
		background: var(--bg-secondary);
		border-color: var(--border-hover);
	}

	.color-grid-item.is-selected {
		background: rgba(19, 55, 27, 0.1);
		border-color: rgba(19, 55, 27, 0.25);
	}

	:global(.dark) .color-grid-item.is-selected {
		background: rgba(255, 179, 39, 0.15);
		border-color: rgba(255, 179, 39, 0.35);
	}

	.item-swatch-box {
		width: 18px;
		height: 18px;
		border-radius: 5px;
		border: 1px solid rgba(0, 0, 0, 0.18);
		flex-shrink: 0;
	}

	:global(.dark) .item-swatch-box {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.item-text-info {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		flex: 1;
		min-width: 0;
	}

	.item-code {
		font-size: 0.74rem;
		font-family: monospace;
		font-weight: 800;
		color: var(--fg-primary);
	}

	.item-name {
		font-size: 0.72rem;
		color: var(--fg-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.selected-check-icon {
		color: var(--brand-emerald, #13371b);
		margin-left: auto;
		flex-shrink: 0;
	}

	:global(.dark) .selected-check-icon {
		color: var(--brand-gold, #ffb327);
	}
</style>
