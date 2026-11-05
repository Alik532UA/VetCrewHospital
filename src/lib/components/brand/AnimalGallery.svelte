<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { downloadUrlAsPng } from '$lib/utils/exportPng';
	import { logService } from '$lib/services/logService.svelte';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import PngDownloadBtn from '$lib/components/brand/PngDownloadBtn.svelte';
	import type { PngResolution } from '$lib/data/pngResolutions';

	import { ANIMALS, type AnimalItem } from '$lib/data/animals';

	interface Props {
		customSelectedColor?: string | null;
	}

	let { customSelectedColor = $bindable(null) }: Props = $props();
	let animalColor = $derived(
		customSelectedColor ?? (themeStore.current === 'dark' ? '#93C84A' : '#13371B')
	);

	let stageTheme = $state<StageTheme>('checker');
	let searchQuery = $state('');
	let selectedCategory = $state<'all' | 'birds' | 'reptiles' | 'mammals' | 'exotics'>('all');
	let isDownloading = $state<string | null>(null);

	let filteredAnimals = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		return ANIMALS.filter((item) => {
			const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
			const matchesQuery =
				!q ||
				item.nameUk.toLowerCase().includes(q) ||
				item.nameEn.toLowerCase().includes(q) ||
				item.num.includes(q);
			return matchesCat && matchesQuery;
		});
	});

	async function downloadColoredSvg(e: MouseEvent, animal: AnimalItem) {
		e.preventDefault();
		isDownloading = animal.id;
		try {
			const res = await fetch(`${base}/brand/animals/${encodeURIComponent(animal.file)}`);
			let text = await res.text();

			// Inject color attribute
			if (text.includes('fill=')) {
				text = text.replace(/fill="[^"]*"/g, `fill="${animalColor}"`);
			} else {
				text = text.replace('<svg ', `<svg fill="${animalColor}" `);
			}

			const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${animal.num} - ${animal.nameUk} (${animalColor}).svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (err) {
			logService.error('brand', 'Download error', err);
		} finally {
			isDownloading = null;
		}
	}

	async function downloadColoredPng(animal: AnimalItem, res: PngResolution) {
		isDownloading = `${animal.id}-png`;
		try {
			await downloadUrlAsPng(
				`${base}/brand/animals/${encodeURIComponent(animal.file)}`,
				`${animal.num} - ${animal.nameUk} (${animalColor}, ${res.label}).png`,
				res.px,
				(svgText) => {
					if (svgText.includes('fill=')) {
						return svgText.replace(/fill="[^"]*"/g, `fill="${animalColor}"`);
					} else {
						return svgText.replace('<svg ', `<svg fill="${animalColor}" `);
					}
				}
			);
		} catch (err) {
			logService.error('brand', 'PNG download error', err);
		} finally {
			isDownloading = null;
		}
	}
</script>

<div class="animal-gallery-widget">
	<!-- Color Selector & Filters Toolbar -->
	<div class="gallery-controls-card">
		<div class="gallery-toolbar">
			<div class="stage-switcher-wrap">
				<StageBgSwitcher bind:current={stageTheme} />
			</div>
			<div class="category-chips">
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'all'}
					onclick={() => (selectedCategory = 'all')}
				>
					<span>{langStore.current === 'uk' ? 'Всі пацієнти' : 'All Species'}</span>
					<span class="chip-count">24</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'birds'}
					onclick={() => (selectedCategory = 'birds')}
				>
					<span>{langStore.current === 'uk' ? 'Птахи' : 'Birds'}</span>
					<span class="chip-count">6</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'reptiles'}
					onclick={() => (selectedCategory = 'reptiles')}
				>
					<span>{langStore.current === 'uk' ? 'Рептилії & Амфібії' : 'Reptiles & Amphibians'}</span>
					<span class="chip-count">6</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'mammals'}
					onclick={() => (selectedCategory = 'mammals')}
				>
					<span>{langStore.current === 'uk' ? 'Ссавці & Гризуни' : 'Mammals & Rodents'}</span>
					<span class="chip-count">8</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'exotics'}
					onclick={() => (selectedCategory = 'exotics')}
				>
					<span>{langStore.current === 'uk' ? 'Екзотичні & Примати' : 'Exotics & Primates'}</span>
					<span class="chip-count">4</span>
				</button>
			</div>

			<div class="search-wrap">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="search-icon"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					type="text"
					class="search-input"
					placeholder={langStore.current === 'uk' ? 'Пошук тварини...' : 'Search animal...'}
					bind:value={searchQuery}
				/>
				{#if searchQuery}
					<button
						type="button"
						class="clear-btn"
						onclick={() => (searchQuery = '')}
						aria-label="Clear"
					>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Grid of 24 Cards -->
	<div class="animals-grid">
		{#each filteredAnimals as a, index (a.id)}
			<div class="animal-card">
				<div class="card-badge">#{a.num}</div>

				<div class="icon-stage stage--{stageTheme}">
					<div
						class="animal-svg-mask"
						style:background-color={animalColor}
						style:--mask-url="url('{base}/brand/animals/{encodeURIComponent(a.file)}')"
						aria-hidden="true"
					></div>
				</div>

				<div class="card-meta">
					<span class="animal-name-primary">
						{langStore.current === 'uk' ? a.nameUk : a.nameEn}
					</span>
				</div>

				<div class="animal-card-actions">
					<button
						type="button"
						class="download-animal-btn"
						onclick={(e) => downloadColoredSvg(e, a)}
						disabled={isDownloading === a.id}
						title={langStore.current === 'uk'
							? `Завантажити SVG (${animalColor})`
							: `Download SVG (${animalColor})`}
					>
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>{isDownloading === a.id ? '...' : 'SVG'}</span>
					</button>

					<PngDownloadBtn
						onselect={(res) => downloadColoredPng(a, res)}
						isDownloading={isDownloading === `${a.id}-png`}
						size="compact"
						align={index % 6 >= 4 ? 'right' : index % 6 <= 1 ? 'left' : 'center'}
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.animal-gallery-widget {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	/* CONTROLS CARD */
	.gallery-controls-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.15rem 1.35rem;
		background: var(--bg-secondary);
		border-radius: 16px;
		border: 1px solid var(--border);
	}

	/* ROW 1: COLOR PICKER & STAGE */
	.color-picker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.color-picker-left {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.color-picker-right {
		display: flex;
		align-items: center;
	}

	.color-picker-label {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.label-title {
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.active-hex-badge {
		font-size: 0.76rem;
		font-family: monospace;
		font-weight: 700;
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--brand-leaf);
	}

	:global([data-theme='dark']) .active-hex-badge {
		color: var(--brand-gold);
	}

	.colors-palette-wrap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	/* ROW 2: TOOLBAR */
	.gallery-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.category-chips {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.75rem;
		border-radius: 20px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-chip:hover {
		border-color: var(--border-hover);
		color: var(--fg-primary);
	}

	.filter-chip.is-active {
		border-color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.14);
		color: var(--brand-leaf);
	}

	:global([data-theme='dark']) .filter-chip.is-active {
		border-color: var(--brand-gold);
		background: rgba(255, 179, 39, 0.15);
		color: var(--brand-gold);
	}

	.chip-count {
		font-size: 0.7rem;
		opacity: 0.75;
		background: var(--bg-secondary);
		padding: 1px 5px;
		border-radius: 8px;
		border: 1px solid var(--border);
	}

	.search-wrap {
		position: relative;
		display: flex;
		align-items: center;
		width: 220px;
		flex-shrink: 0;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		color: var(--fg-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.4rem 1.8rem 0.4rem 2.2rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--panel-bg);
		color: var(--fg-primary);
		font-size: 0.8rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		border-color: var(--brand-leaf);
	}

	:global([data-theme='dark']) .search-input:focus {
		border-color: var(--brand-gold);
	}

	.clear-btn {
		position: absolute;
		right: 0.6rem;
		background: none;
		border: none;
		color: var(--fg-muted);
		cursor: pointer;
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* GRID */
	.animals-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
		gap: 0.85rem;
	}

	.animal-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.85rem 0.75rem;
		border-radius: 14px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		transition: all 0.2s ease;
	}

	.animal-card:hover {
		transform: translateY(-2px);
		border-color: var(--border-hover);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
	}

	/* Elevate card when dropdown is open so subsequent grid items cannot overlay it */
	.animal-card:has(.png-dropdown-wrap.is-open),
	.animal-card:focus-within {
		z-index: 60;
	}

	.card-badge {
		position: absolute;
		top: 0.5rem;
		left: 0.6rem;
		font-size: 0.68rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--fg-muted);
	}

	.icon-stage {
		width: 84px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.35rem 0 0.5rem;
		border-radius: 12px;
		padding: 0.65rem;
		transition: transform 0.2s ease;
		border: 1px solid var(--border);
	}

	.animal-card:hover .icon-stage {
		transform: scale(1.05);
	}

	.animal-svg-mask {
		width: 100%;
		height: 100%;
		-webkit-mask-image: var(--mask-url);
		mask-image: var(--mask-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		transition: background-color 0.2s ease;
	}

	.card-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.55rem;
		min-width: 0;
		width: 100%;
	}

	.animal-name-primary {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}

	.animal-card-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem;
		width: 100%;
		margin-top: auto;
	}

	.download-animal-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		width: 100%;
		padding: 0.35rem 0.45rem;
		border-radius: 7px;
		font-size: 0.72rem;
		font-weight: 700;
		cursor: pointer;
		background: rgba(19, 55, 27, 0.08);
		border: 1px solid rgba(19, 55, 27, 0.22);
		color: var(--brand-emerald, #13371b);
		transition: all 0.15s ease;
		text-align: center;
		white-space: nowrap;
	}

	.download-animal-btn:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 2px 6px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .download-animal-btn,
	:global(.dark) .download-animal-btn {
		background: rgba(255, 179, 39, 0.12);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .download-animal-btn:hover:not(:disabled),
	:global(.dark) .download-animal-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 2px 8px rgba(255, 179, 39, 0.35);
	}

	.download-animal-btn:disabled {
		opacity: 0.55;
		cursor: wait;
	}

	@media (max-width: 768px) {
		.gallery-controls-card {
			padding: 1rem;
		}

		.color-picker-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.gallery-toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.search-wrap {
			width: 100%;
		}

		.animals-grid {
			grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
			gap: 0.65rem;
		}
	}
</style>
