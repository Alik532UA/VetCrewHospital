<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import {
		QR_BACKGROUND_SHAPES,
		getQrBgShapeById,
		type QrBgShape
	} from '$lib/data/qrBackgroundShapes';

	interface Props {
		selectedShapeId: string;
		onselect: (shape: QrBgShape) => void;
		label?: string;
		compact?: boolean;
		align?: 'left' | 'right';
		colorHex?: string;
	}

	let {
		selectedShapeId,
		onselect,
		label,
		compact = false,
		align = 'left',
		colorHex = '#ffb327'
	}: Props = $props();

	type CategoryFilter = 'all' | 'canon' | 'spots' | 'variations';

	let isOpen = $state<boolean>(false);
	let activeCategory = $state<CategoryFilter>('all');
	let containerRef = $state<HTMLDivElement | null>(null);

	let currentShape = $derived(getQrBgShapeById(selectedShapeId));

	let filteredShapes = $derived(
		activeCategory === 'all'
			? QR_BACKGROUND_SHAPES
			: activeCategory === 'canon'
				? QR_BACKGROUND_SHAPES.filter((s) => s.category === 'organic' || s.category === 'classic')
				: QR_BACKGROUND_SHAPES.filter((s) => s.category === activeCategory)
	);

	function getShortTileName(shape: QrBgShape): string {
		if (shape.id === 'shape-default') {
			return langStore.current === 'uk' ? 'Канон 1 (v2)' : 'Canon 1 (v2)';
		}
		if (shape.id === 'shape-classic') {
			return langStore.current === 'uk' ? 'Канон 2 (v1)' : 'Canon 2 (v1)';
		}
		if (shape.id.startsWith('shape-spot-')) {
			const num = shape.id.replace('shape-spot-', '');
			return langStore.current === 'uk' ? `Пляма #${num}` : `Spot #${num}`;
		}
		if (shape.id.startsWith('shape-var-')) {
			const num = shape.id.replace('shape-var-', '');
			return langStore.current === 'uk' ? `Форма #${num}` : `Form #${num}`;
		}
		return langStore.current === 'uk' ? shape.nameUk : shape.nameEn;
	}

	function toggle() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}

	function handleSelect(shape: QrBgShape) {
		onselect(shape);
		close();
	}

	// Click outside and escape handling
	$effect(() => {
		if (!browser || !isOpen) return;

		function handleClickOutside(event: MouseEvent) {
			if (containerRef && !containerRef.contains(event.target as Node)) {
				close();
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				close();
			}
		}

		window.addEventListener('mousedown', handleClickOutside, true);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('mousedown', handleClickOutside, true);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<div
	class="shape-picker-container"
	class:is-compact={compact}
	class:is-open={isOpen}
	bind:this={containerRef}
>
	{#if label}
		<span class="shape-picker-label">{label}</span>
	{/if}

	<button
		type="button"
		class="shape-picker-trigger"
		class:is-active={isOpen}
		onclick={toggle}
		aria-expanded={isOpen}
		aria-haspopup="dialog"
		title={langStore.current === 'uk'
			? `Обрана форма: ${currentShape.nameUk} (натисніть щоб змінити)`
			: `Selected shape: ${currentShape.nameEn} (click to change)`}
	>
		<div class="trigger-preview-box" style="--shape-color: {colorHex}">
			<svg viewBox="0 0 800 800" class="trigger-svg-icon" aria-hidden="true">
				<path d={currentShape.d} fill="currentColor" />
			</svg>
		</div>

		<span class="trigger-shape-name">
			{getShortTileName(currentShape)}
		</span>

		<svg
			class="trigger-chevron"
			class:is-rotated={isOpen}
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>

	{#if isOpen}
		<div
			class="shape-picker-popover align--{align}"
			role="dialog"
			aria-label={langStore.current === 'uk'
				? 'Вибір фонової форми підкладки'
				: 'Choose background plaque shape'}
		>
			<!-- Popover Header -->
			<div class="popover-header">
				<div class="header-title-meta">
					<h4 class="popover-title">
						{langStore.current === 'uk'
							? 'Форма підкладки (18 варіантів)'
							: 'Plaque Silhouette (18 Shapes)'}
					</h4>
					<span class="popover-count"
						>{filteredShapes.length} {langStore.current === 'uk' ? 'форм' : 'shapes'}</span
					>
				</div>
				<button
					type="button"
					class="popover-close-btn"
					onclick={close}
					aria-label={langStore.current === 'uk' ? 'Закрити' : 'Close'}
				>
					✕
				</button>
			</div>

			<!-- Category Filters -->
			<div class="category-tabs" role="tablist">
				<button
					type="button"
					class="cat-tab-btn"
					class:is-active={activeCategory === 'all'}
					onclick={() => (activeCategory = 'all')}
				>
					{langStore.current === 'uk' ? 'Всі (18)' : 'All (18)'}
				</button>
				<button
					type="button"
					class="cat-tab-btn"
					class:is-active={activeCategory === 'canon'}
					onclick={() => (activeCategory = 'canon')}
				>
					{langStore.current === 'uk' ? 'Канон (2)' : 'Canon (2)'}
				</button>
				<button
					type="button"
					class="cat-tab-btn"
					class:is-active={activeCategory === 'spots'}
					onclick={() => (activeCategory = 'spots')}
				>
					{langStore.current === 'uk' ? 'Силуети (9)' : 'Spots (9)'}
				</button>
				<button
					type="button"
					class="cat-tab-btn"
					class:is-active={activeCategory === 'variations'}
					onclick={() => (activeCategory = 'variations')}
				>
					{langStore.current === 'uk' ? 'Варіативні (7)' : 'Variations (7)'}
				</button>
			</div>

			<!-- Shapes Grid (Visual Gallery) -->
			<div class="shapes-gallery-grid">
				{#each filteredShapes as shape (shape.id)}
					{@const isSelected = shape.id === selectedShapeId}
					{@const shortName = getShortTileName(shape)}
					<button
						type="button"
						class="shape-tile-btn"
						class:is-selected={isSelected}
						onclick={() => handleSelect(shape)}
						title={langStore.current === 'uk'
							? `${shape.nameUk} (натисніть щоб обрати)`
							: `${shape.nameEn} (click to choose)`}
					>
						<div class="tile-preview-stage" style="--tile-color: {colorHex}">
							<svg viewBox="0 0 800 800" class="tile-svg" aria-hidden="true">
								<path d={shape.d} fill="currentColor" />
							</svg>

							{#if isSelected}
								<span class="selected-badge" aria-hidden="true">
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
									>
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								</span>
							{/if}
						</div>

						<span class="tile-name" title={shortName}>
							{shortName}
						</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.shape-picker-container {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		gap: 0.35rem;
		user-select: none;
	}

	.shape-picker-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-secondary);
	}

	.shape-picker-trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		background: var(--panel-bg, #ffffff);
		border: 1px solid var(--border);
		border-radius: 9px;
		padding: 0.4rem 0.65rem;
		color: var(--fg-primary);
		cursor: pointer;
		font-size: 0.82rem;
		font-weight: 600;
		transition: all 0.18s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.shape-picker-container.is-compact .shape-picker-trigger {
		padding: 0.3rem 0.5rem;
		font-size: 0.76rem;
		gap: 0.45rem;
	}

	.shape-picker-trigger:hover,
	.shape-picker-trigger.is-active {
		border-color: var(--border-hover);
		background: var(--bg-secondary);
	}

	.trigger-preview-box {
		width: 24px;
		height: 24px;
		min-width: 24px;
		border-radius: 5px;
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2px;
		color: var(--shape-color, #ffb327);
		border: 1px solid var(--border);
	}

	.shape-picker-container.is-compact .trigger-preview-box {
		width: 20px;
		height: 20px;
		min-width: 20px;
	}

	.trigger-svg-icon {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.trigger-shape-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 150px;
	}

	.shape-picker-container.is-compact .trigger-shape-name {
		max-width: 120px;
	}

	.trigger-chevron {
		color: var(--fg-muted, var(--fg-secondary));
		transition: transform 0.2s ease;
		margin-left: auto;
	}

	.trigger-chevron.is-rotated {
		transform: rotate(180deg);
	}

	/* Popover Dropdown */
	.shape-picker-popover {
		position: absolute;
		top: calc(100% + 6px);
		z-index: 150;
		width: 380px;
		max-width: min(380px, calc(100vw - 24px));
		box-sizing: border-box;
		background: #ffffff;
		border: 1px solid var(--border);
		border-radius: 14px;
		box-shadow:
			0 12px 32px rgba(0, 0, 0, 0.22),
			0 2px 8px rgba(0, 0, 0, 0.08);
		padding: 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		animation: popIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global([data-theme='dark']) .shape-picker-popover,
	:global(.dark) .shape-picker-popover {
		background: #18241c;
		border-color: var(--border-active, #44644d);
		box-shadow:
			0 14px 36px rgba(0, 0, 0, 0.6),
			0 2px 8px rgba(0, 0, 0, 0.3);
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: translateY(-6px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.shape-picker-popover.align--left {
		left: 0;
	}

	.shape-picker-popover.align--right {
		right: 0;
	}

	.popover-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid var(--border);
	}

	.header-title-meta {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.popover-title {
		margin: 0;
		font-size: 0.84rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.popover-count {
		font-size: 0.7rem;
		color: var(--fg-muted);
	}

	.popover-close-btn {
		background: transparent;
		border: none;
		color: var(--fg-secondary);
		font-size: 0.95rem;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
		border-radius: 6px;
		line-height: 1;
		transition: all 0.15s;
	}

	.popover-close-btn:hover {
		color: var(--fg-primary);
		background: var(--bg-secondary);
	}

	/* Category Filter Tabs */
	.category-tabs {
		display: flex;
		gap: 0.35rem;
		background: var(--bg-secondary);
		padding: 0.25rem;
		border-radius: 8px;
		border: 1px solid var(--border);
	}

	.cat-tab-btn {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--fg-secondary);
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.3rem 0.4rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
		text-align: center;
	}

	.cat-tab-btn:hover {
		color: var(--fg-primary);
	}

	.cat-tab-btn.is-active {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	/* Gallery Grid */
	.shapes-gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		max-height: 310px;
		overflow-y: auto;
		overflow-x: hidden;
		padding-right: 0.25rem;
		width: 100%;
		box-sizing: border-box;
	}

	.shapes-gallery-grid::-webkit-scrollbar {
		width: 5px;
	}

	.shapes-gallery-grid::-webkit-scrollbar-thumb {
		background: var(--border-hover, rgba(0, 0, 0, 0.2));
		border-radius: 4px;
	}

	.shape-tile-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		background: var(--panel-bg, #ffffff);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.45rem 0.35rem;
		cursor: pointer;
		transition: all 0.18s ease;
		color: var(--fg-primary);
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
	}

	:global([data-theme='dark']) .shape-tile-btn,
	:global(.dark) .shape-tile-btn {
		background: #202e24;
		border-color: rgba(255, 255, 255, 0.08);
		color: #d2e4d7;
	}

	.shape-tile-btn:hover {
		background: var(--bg-secondary);
		border-color: var(--brand-leaf, #598f3a);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .shape-tile-btn:hover,
	:global(.dark) .shape-tile-btn:hover {
		background: #27392c;
	}

	.shape-tile-btn.is-selected {
		border-color: var(--brand-leaf, #598f3a);
		background: rgba(89, 143, 58, 0.16);
		box-shadow: 0 0 0 1px var(--brand-leaf, #598f3a);
	}

	.tile-preview-stage {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: var(--bg-secondary);
		border-radius: 7px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
		color: var(--tile-color, #ffb327);
		box-sizing: border-box;
		border: 1px solid var(--border);
	}

	:global([data-theme='dark']) .tile-preview-stage,
	:global(.dark) .tile-preview-stage {
		background: rgba(0, 0, 0, 0.35);
		border-color: transparent;
	}

	.tile-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
		transition: transform 0.18s ease;
	}

	.shape-tile-btn:hover .tile-svg {
		transform: scale(1.06);
	}

	.selected-badge {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 18px;
		height: 18px;
		background: #598f3a;
		color: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.tile-name {
		font-size: 0.68rem;
		font-weight: 600;
		text-align: center;
		line-height: 1.15;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		max-width: 100%;
		display: block;
		color: var(--fg-primary);
	}
</style>
