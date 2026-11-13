<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { downloadUrlAsPng } from '$lib/utils/exportPng';
	import { logService } from '$lib/services/logService.svelte';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import PngDownloadBtn from '$lib/components/brand/PngDownloadBtn.svelte';
	import type { PngResolution } from '$lib/data/pngResolutions';

	import {
		ANIMALS,
		type AnimalItem,
		type AnimalCategory,
		type AnimalIconStyle
	} from '$lib/data/animals';

	interface Props {
		customSelectedColor?: string | null;
	}

	let { customSelectedColor = $bindable(null) }: Props = $props();
	let animalColor = $derived(
		customSelectedColor ?? (themeStore.current === 'dark' ? '#93C84A' : '#13371B')
	);

	let iconStyle = $state<AnimalIconStyle>('solid');
	let stageTheme = $state<StageTheme>('checker');
	let searchQuery = $state('');
	let selectedCategory = $state<'all' | 'birds' | 'reptiles' | 'mammals' | 'exotics'>('all');
	let isDownloading = $state<string | null>(null);
	let activeModalAnimal = $state<AnimalItem | null>(null);

	function getIconUrl(animal: AnimalItem, style: AnimalIconStyle = iconStyle): string {
		const sub = style === 'linear' ? 'linear/' : '';
		return `${base}/brand/animals/${sub}${encodeURIComponent(animal.file)}`;
	}

	let currentAnimalIndex = $derived.by(() => {
		if (!activeModalAnimal) return -1;
		const list = filteredAnimals.length > 0 ? filteredAnimals : ANIMALS;
		return list.findIndex((a) => a.id === activeModalAnimal!.id);
	});

	let currentAnimalTotal = $derived.by(() => {
		return (filteredAnimals.length > 0 ? filteredAnimals : ANIMALS).length;
	});

	function openModal(animal: AnimalItem) {
		activeModalAnimal = animal;
	}

	function closeModal() {
		activeModalAnimal = null;
	}

	function nextAnimal() {
		if (!activeModalAnimal) return;
		const list = filteredAnimals.length > 0 ? filteredAnimals : ANIMALS;
		const idx = list.findIndex((a) => a.id === activeModalAnimal!.id);
		if (idx === -1) return;
		const nextIdx = (idx + 1) % list.length;
		activeModalAnimal = list[nextIdx] ?? null;
	}

	function prevAnimal() {
		if (!activeModalAnimal) return;
		const list = filteredAnimals.length > 0 ? filteredAnimals : ANIMALS;
		const idx = list.findIndex((a) => a.id === activeModalAnimal!.id);
		if (idx === -1) return;
		const prevIdx = (idx - 1 + list.length) % list.length;
		activeModalAnimal = list[prevIdx] ?? null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!activeModalAnimal) return;
		if (e.key === 'Escape') {
			closeModal();
		} else if (e.key === 'ArrowRight') {
			nextAnimal();
		} else if (e.key === 'ArrowLeft') {
			prevAnimal();
		}
	}

	function getCategoryLabel(cat: AnimalCategory): string {
		const uk = langStore.current === 'uk';
		switch (cat) {
			case 'birds':
				return uk ? 'Птахи' : 'Birds';
			case 'reptiles':
				return uk ? 'Рептилії & Амфібії' : 'Reptiles & Amphibians';
			case 'mammals':
				return uk ? 'Ссавці & Гризуни' : 'Mammals & Rodents';
			case 'exotics':
				return uk ? 'Екзотичні & Примати' : 'Exotics & Primates';
			default:
				return cat;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (activeModalAnimal) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
		return undefined;
	});

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
			const res = await fetch(getIconUrl(animal, iconStyle));
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
			const styleSuffix = iconStyle === 'linear' ? ' (linear)' : '';
			link.download = `${animal.num} - ${animal.nameUk}${styleSuffix} (${animalColor}).svg`;
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
			const styleSuffix = iconStyle === 'linear' ? ' (linear)' : '';
			await downloadUrlAsPng(
				getIconUrl(animal, iconStyle),
				`${animal.num} - ${animal.nameUk}${styleSuffix} (${animalColor}, ${res.label}).png`,
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

<svelte:window onkeydown={handleKeydown} />

<div class="animal-gallery-widget">
	<!-- Color Selector & Filters Toolbar -->
	<div class="gallery-controls-card">
		<div class="gallery-toolbar">
			<div class="toolbar-toggles-wrap">
				<div class="stage-switcher-wrap">
					<StageBgSwitcher bind:current={stageTheme} />
				</div>
				<div
					class="style-toggle-group"
					role="radiogroup"
					aria-label={langStore.current === 'uk' ? 'Стиль іконок' : 'Icon style'}
				>
					<button
						type="button"
						class="style-toggle-btn"
						class:is-active={iconStyle === 'solid'}
						onclick={() => (iconStyle = 'solid')}
						role="radio"
						aria-checked={iconStyle === 'solid'}
						title={langStore.current === 'uk' ? 'Суцільний силует' : 'Solid silhouette'}
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<circle cx="12" cy="12" r="9" />
						</svg>
						<span>{langStore.current === 'uk' ? 'Силует' : 'Solid'}</span>
					</button>
					<button
						type="button"
						class="style-toggle-btn"
						class:is-active={iconStyle === 'linear'}
						onclick={() => (iconStyle = 'linear')}
						role="radio"
						aria-checked={iconStyle === 'linear'}
						title={langStore.current === 'uk' ? 'Лінійний контур' : 'Linear outline'}
					>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="8" />
						</svg>
						<span>{langStore.current === 'uk' ? 'Контур' : 'Linear'}</span>
					</button>
				</div>
			</div>
			<div class="category-chips">
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'all'}
					onclick={() => (selectedCategory = 'all')}
				>
					<span>{langStore.current === 'uk' ? 'Всі пацієнти' : 'All Species'}</span>
					<span class="chip-count">{ANIMALS.length}</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'birds'}
					onclick={() => (selectedCategory = 'birds')}
				>
					<span>{langStore.current === 'uk' ? 'Птахи' : 'Birds'}</span>
					<span class="chip-count">{ANIMALS.filter((a) => a.category === 'birds').length}</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'reptiles'}
					onclick={() => (selectedCategory = 'reptiles')}
				>
					<span>{langStore.current === 'uk' ? 'Рептилії & Амфібії' : 'Reptiles & Amphibians'}</span>
					<span class="chip-count">{ANIMALS.filter((a) => a.category === 'reptiles').length}</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'mammals'}
					onclick={() => (selectedCategory = 'mammals')}
				>
					<span>{langStore.current === 'uk' ? 'Ссавці & Гризуни' : 'Mammals & Rodents'}</span>
					<span class="chip-count">{ANIMALS.filter((a) => a.category === 'mammals').length}</span>
				</button>
				<button
					type="button"
					class="filter-chip"
					class:is-active={selectedCategory === 'exotics'}
					onclick={() => (selectedCategory = 'exotics')}
				>
					<span>{langStore.current === 'uk' ? 'Екзотичні & Примати' : 'Exotics & Primates'}</span>
					<span class="chip-count">{ANIMALS.filter((a) => a.category === 'exotics').length}</span>
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

				<button
					type="button"
					class="animal-preview-btn"
					onclick={() => openModal(a)}
					title={langStore.current === 'uk'
						? `Відкрити ${a.nameUk} у великому розмірі`
						: `Preview ${a.nameEn} in full size`}
					aria-label={langStore.current === 'uk'
						? `Відкрити ${a.nameUk} у великому розмірі`
						: `Preview ${a.nameEn} in full size`}
				>
					<div class="icon-stage stage--{stageTheme}">
						<div
							class="animal-svg-mask"
							style:background-color={animalColor}
							style:--mask-url="url('{getIconUrl(a, iconStyle)}')"
							aria-hidden="true"
						></div>
						<span class="preview-zoom-pill" aria-hidden="true">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
								<line x1="11" y1="8" x2="11" y2="14"></line>
								<line x1="8" y1="11" x2="14" y2="11"></line>
							</svg>
							<span>{langStore.current === 'uk' ? 'Збільшити' : 'Zoom'}</span>
						</span>
					</div>

					<div class="card-meta">
						<span class="animal-name-primary">
							{langStore.current === 'uk' ? a.nameUk : a.nameEn}
						</span>
					</div>
				</button>

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

	<!-- LIGHTBOX MODAL (ALMOST FULLSCREEN PREVIEW) -->
	{#if activeModalAnimal}
		<div class="animal-lightbox-backdrop" role="presentation" onclick={closeModal}>
			<div
				class="animal-lightbox-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="animal-lightbox-title"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') closeModal();
				}}
			>
				<!-- LIGHTBOX HEADER -->
				<div class="lightbox-header">
					<div class="lightbox-title-wrap">
						<span class="lightbox-badge">#{activeModalAnimal.num}</span>
						<div class="lightbox-titles">
							<h3 id="animal-lightbox-title" class="lightbox-title">
								{langStore.current === 'uk' ? activeModalAnimal.nameUk : activeModalAnimal.nameEn}
								<span class="lightbox-subtitle">
									/ {langStore.current === 'uk'
										? activeModalAnimal.nameEn
										: activeModalAnimal.nameUk}
								</span>
							</h3>
							<span class="lightbox-category-tag">
								{getCategoryLabel(activeModalAnimal.category)}
							</span>
						</div>
					</div>

					<div class="lightbox-header-actions">
						<div class="lightbox-counter">
							{currentAnimalIndex + 1} / {currentAnimalTotal}
						</div>

						<div class="lightbox-style-switcher">
							<div
								class="style-toggle-group"
								role="radiogroup"
								aria-label={langStore.current === 'uk' ? 'Стиль іконок' : 'Icon style'}
							>
								<button
									type="button"
									class="style-toggle-btn"
									class:is-active={iconStyle === 'solid'}
									onclick={() => (iconStyle = 'solid')}
									role="radio"
									aria-checked={iconStyle === 'solid'}
									title={langStore.current === 'uk' ? 'Суцільний силует' : 'Solid silhouette'}
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<circle cx="12" cy="12" r="9" />
									</svg>
									<span>{langStore.current === 'uk' ? 'Силует' : 'Solid'}</span>
								</button>
								<button
									type="button"
									class="style-toggle-btn"
									class:is-active={iconStyle === 'linear'}
									onclick={() => (iconStyle = 'linear')}
									role="radio"
									aria-checked={iconStyle === 'linear'}
									title={langStore.current === 'uk' ? 'Лінійний контур' : 'Linear outline'}
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.2"
										aria-hidden="true"
									>
										<circle cx="12" cy="12" r="8" />
									</svg>
									<span>{langStore.current === 'uk' ? 'Контур' : 'Linear'}</span>
								</button>
							</div>
						</div>

						<div class="lightbox-stage-switcher">
							<StageBgSwitcher bind:current={stageTheme} />
						</div>

						<button
							type="button"
							class="lightbox-close-btn"
							onclick={closeModal}
							title={langStore.current === 'uk' ? 'Закрити (Esc)' : 'Close (Esc)'}
							aria-label={langStore.current === 'uk' ? 'Закрити перегляд' : 'Close preview'}
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
				</div>

				<!-- LIGHTBOX BODY / DISPLAY STAGE -->
				<div class="lightbox-body">
					<!-- Prev Button -->
					<button
						type="button"
						class="lightbox-nav-btn lightbox-nav-prev"
						onclick={prevAnimal}
						disabled={currentAnimalTotal <= 1}
						title={langStore.current === 'uk' ? 'Попередня тварина (←)' : 'Previous animal (←)'}
						aria-label={langStore.current === 'uk' ? 'Попередня тварина' : 'Previous animal'}
					>
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>

					<!-- Main Vector Stage -->
					<div class="lightbox-stage stage--{stageTheme}">
						<div
							class="lightbox-svg-mask"
							style:background-color={animalColor}
							style:--mask-url="url('{getIconUrl(activeModalAnimal, iconStyle)}')"
							role="img"
							aria-label="{activeModalAnimal.nameUk} SVG Graphic"
						></div>
					</div>

					<!-- Next Button -->
					<button
						type="button"
						class="lightbox-nav-btn lightbox-nav-next"
						onclick={nextAnimal}
						disabled={currentAnimalTotal <= 1}
						title={langStore.current === 'uk' ? 'Наступна тварина (→)' : 'Next animal (→)'}
						aria-label={langStore.current === 'uk' ? 'Наступна тварина' : 'Next animal'}
					>
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
				</div>

				<!-- LIGHTBOX FOOTER -->
				<div class="lightbox-footer">
					<div class="lightbox-file-meta">
						<span class="file-code-badge">
							{iconStyle === 'linear' ? `linear/${activeModalAnimal.file}` : activeModalAnimal.file}
						</span>
						<span class="color-indicator">
							<span class="color-dot" style:background-color={animalColor}></span>
							<span class="color-val">{animalColor}</span>
						</span>
					</div>

					<div class="lightbox-download-group">
						<button
							type="button"
							class="lightbox-download-svg-btn"
							onclick={(e) => downloadColoredSvg(e, activeModalAnimal!)}
							disabled={isDownloading === activeModalAnimal.id}
							title={langStore.current === 'uk'
								? `Завантажити SVG (${animalColor})`
								: `Download SVG (${animalColor})`}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								aria-hidden="true"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>{isDownloading === activeModalAnimal.id ? '...' : 'Завантажити SVG'}</span>
						</button>

						<PngDownloadBtn
							onselect={(res) => downloadColoredPng(activeModalAnimal!, res)}
							isDownloading={isDownloading === `${activeModalAnimal.id}-png`}
							size="compact"
							align="right"
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
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

	.toolbar-toggles-wrap {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	.style-toggle-group {
		display: inline-flex;
		align-items: center;
		padding: 3px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 999px;
		gap: 3px;
	}

	.style-toggle-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.75rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-secondary);
		background: transparent;
		border: none;
		border-radius: 999px;
		cursor: pointer;
		transition: all 0.18s ease;
		white-space: nowrap;
	}

	.style-toggle-btn:hover {
		color: var(--fg-primary);
	}

	.style-toggle-btn.is-active {
		background: var(--brand-leaf);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
	}

	:global([data-theme='dark']) .style-toggle-btn.is-active {
		background: var(--brand-gold);
		color: #13371b;
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
		z-index: 2;
		pointer-events: none;
	}

	/* CARD PREVIEW TRIGGER BUTTON */
	.animal-preview-btn {
		background: none;
		border: none;
		padding: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		text-align: center;
		outline: none;
		border-radius: 12px;
		transition: outline 0.15s ease;
	}

	.animal-preview-btn:focus-visible {
		outline: 2px solid var(--brand-gold);
		outline-offset: 4px;
	}

	.icon-stage {
		position: relative;
		width: 84px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.35rem 0 0.5rem;
		border-radius: 12px;
		padding: 0.65rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.animal-card:hover .icon-stage {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.preview-zoom-pill {
		position: absolute;
		bottom: 5px;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.18rem 0.45rem;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.68);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		color: #ffffff;
		font-size: 0.62rem;
		font-weight: 700;
		opacity: 0;
		transform: translateY(4px);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: none;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	.animal-card:hover .preview-zoom-pill {
		opacity: 1;
		transform: translateY(0);
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
		position: relative;
		z-index: 3;
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

	/* ==========================================================================
	   LIGHTBOX MODAL (ALMOST FULLSCREEN PREVIEW)
	   ========================================================================== */
	.animal-lightbox-backdrop {
		position: fixed;
		inset: 0;
		z-index: 10050;
		background: rgba(0, 0, 0, 0.82);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		animation: lightboxFade 0.2s ease;
	}

	@keyframes lightboxFade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animal-lightbox-dialog {
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 24px;
		width: 100%;
		max-width: 960px;
		height: min(88vh, 800px);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		animation: lightboxPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
		outline: none;
	}

	@keyframes lightboxPop {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.lightbox-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.4rem;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
		flex-shrink: 0;
	}

	.lightbox-title-wrap {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-width: 0;
	}

	.lightbox-badge {
		font-size: 0.88rem;
		font-family: monospace;
		font-weight: 800;
		padding: 0.25rem 0.6rem;
		border-radius: 8px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--brand-leaf);
	}

	:global([data-theme='dark']) .lightbox-badge {
		color: var(--brand-gold);
	}

	.lightbox-titles {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.lightbox-title {
		margin: 0;
		font-size: 1.18rem;
		font-weight: 800;
		color: var(--fg-primary);
		line-height: 1.2;
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lightbox-subtitle {
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--fg-muted);
	}

	.lightbox-category-tag {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--fg-secondary);
	}

	.lightbox-header-actions {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-shrink: 0;
	}

	.lightbox-counter {
		font-size: 0.76rem;
		font-weight: 700;
		font-family: monospace;
		color: var(--fg-muted);
		background: var(--panel-bg);
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		border: 1px solid var(--border);
	}

	.lightbox-close-btn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lightbox-close-btn:hover {
		color: var(--fg-primary);
		border-color: var(--border-hover);
		background: rgba(255, 60, 60, 0.14);
		transform: scale(1.05);
	}

	/* LIGHTBOX BODY */
	.lightbox-body {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem 4.75rem;
		min-height: 0;
		overflow: hidden;
	}

	.lightbox-stage {
		width: 100%;
		height: 100%;
		max-height: 520px;
		border-radius: 20px;
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem;
		box-shadow: inset 0 2px 14px rgba(0, 0, 0, 0.08);
		transition: background-color 0.2s ease;
		overflow: hidden;
	}

	.lightbox-svg-mask {
		width: 100%;
		height: 100%;
		max-width: 480px;
		max-height: 480px;
		-webkit-mask-image: var(--mask-url);
		mask-image: var(--mask-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		transition:
			background-color 0.2s ease,
			transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
	}

	.lightbox-nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: var(--fg-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);
		z-index: 5;
	}

	.lightbox-nav-btn:hover:not(:disabled) {
		transform: translateY(-50%) scale(1.1);
		border-color: var(--border-hover);
		color: var(--brand-leaf);
	}

	:global([data-theme='dark']) .lightbox-nav-btn:hover:not(:disabled) {
		color: var(--brand-gold);
	}

	.lightbox-nav-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.lightbox-nav-prev {
		left: 1.25rem;
	}

	.lightbox-nav-next {
		right: 1.25rem;
	}

	/* LIGHTBOX FOOTER */
	.lightbox-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.95rem 1.4rem;
		border-top: 1px solid var(--border);
		background: var(--bg-secondary);
		flex-shrink: 0;
		flex-wrap: wrap;
	}

	.lightbox-file-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.file-code-badge {
		font-size: 0.74rem;
		font-family: monospace;
		font-weight: 600;
		color: var(--fg-muted);
		background: var(--panel-bg);
		padding: 0.25rem 0.55rem;
		border-radius: 6px;
		border: 1px solid var(--border);
	}

	.color-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.74rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--fg-secondary);
	}

	.color-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.lightbox-download-group {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.lightbox-download-svg-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.95rem;
		border-radius: 9px;
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
		background: var(--brand-emerald, #13371b);
		border: 1px solid var(--brand-emerald, #13371b);
		color: #ffffff;
		transition: all 0.2s ease;
	}

	.lightbox-download-svg-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.35);
		filter: brightness(1.1);
	}

	:global([data-theme='dark']) .lightbox-download-svg-btn {
		background: rgba(255, 179, 39, 0.15);
		border-color: var(--brand-gold, #ffb327);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .lightbox-download-svg-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	.lightbox-download-svg-btn:disabled {
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

		.animal-lightbox-backdrop {
			padding: 0.5rem;
		}

		.animal-lightbox-dialog {
			height: 94vh;
			border-radius: 18px;
		}

		.lightbox-header {
			padding: 0.75rem 1rem;
		}

		.lightbox-stage-switcher {
			display: none;
		}

		.lightbox-body {
			padding: 0.75rem 0.5rem;
		}

		.lightbox-stage {
			padding: 1rem;
			max-height: none;
		}

		.lightbox-nav-btn {
			width: 40px;
			height: 40px;
		}

		.lightbox-nav-prev {
			left: 0.5rem;
		}

		.lightbox-nav-next {
			right: 0.5rem;
		}

		.lightbox-footer {
			padding: 0.75rem 1rem;
			flex-direction: column;
			align-items: stretch;
		}

		.lightbox-download-group {
			width: 100%;
			justify-content: stretch;
		}

		.lightbox-download-svg-btn {
			flex: 1;
			justify-content: center;
		}
	}
</style>
