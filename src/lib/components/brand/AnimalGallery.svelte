<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

	interface AnimalItem {
		id: string;
		num: string;
		nameUk: string;
		nameEn: string;
		file: string;
		category: 'birds' | 'reptiles' | 'mammals' | 'exotics';
	}

	const ANIMALS: AnimalItem[] = [
		{ id: 'parrot', num: '01', nameUk: 'Папуга', nameEn: 'Parrot', file: '01 - parrot.svg', category: 'birds' },
		{ id: 'cockatoo', num: '02', nameUk: 'Какаду', nameEn: 'Cockatoo', file: '02 - cockatoo.svg', category: 'birds' },
		{ id: 'cockatiel', num: '03', nameUk: 'Корела', nameEn: 'Cockatiel', file: '03 - cockatiel.svg', category: 'birds' },
		{ id: 'falcon', num: '04', nameUk: 'Сокіл', nameEn: 'Falcon', file: '04 - falcon.svg', category: 'birds' },
		{ id: 'hawk', num: '05', nameUk: 'Яструб', nameEn: 'Hawk', file: '05 - hawk.svg', category: 'birds' },
		{ id: 'owl', num: '06', nameUk: 'Сова', nameEn: 'Owl', file: '06 - owl.svg', category: 'birds' },
		{ id: 'snake', num: '07', nameUk: 'Змія', nameEn: 'Snake', file: '07 - snake.svg', category: 'reptiles' },
		{ id: 'turtle', num: '08', nameUk: 'Черепаха', nameEn: 'Turtle', file: '08 - turtle.svg', category: 'reptiles' },
		{ id: 'bearded-dragon', num: '09', nameUk: 'Бородата агама', nameEn: 'Bearded Dragon', file: '09 - bearded dragon.svg', category: 'reptiles' },
		{ id: 'gecko', num: '10', nameUk: 'Гекон', nameEn: 'Gecko', file: '10 - gecko.svg', category: 'reptiles' },
		{ id: 'chameleon', num: '11', nameUk: 'Хамелеон', nameEn: 'Chameleon', file: '11 - chameleon.svg', category: 'reptiles' },
		{ id: 'frog', num: '12', nameUk: 'Деревна жаба', nameEn: 'Tree Frog', file: '12 - frog.svg', category: 'reptiles' },
		{ id: 'chinchilla', num: '13', nameUk: 'Шиншила', nameEn: 'Chinchilla', file: '13 - chinchilla.svg', category: 'mammals' },
		{ id: 'rat', num: '14', nameUk: 'Декоративний щур', nameEn: 'Rat', file: '14 - rat.svg', category: 'mammals' },
		{ id: 'mouse', num: '15', nameUk: 'Миша', nameEn: 'Mouse', file: '15 - mouse.svg', category: 'mammals' },
		{ id: 'guinea-pig', num: '16', nameUk: 'Морська свинка', nameEn: 'Guinea Pig', file: '16 - guinea pig.svg', category: 'mammals' },
		{ id: 'rabbit', num: '17', nameUk: 'Кролик', nameEn: 'Rabbit', file: '17 - rabbit.svg', category: 'mammals' },
		{ id: 'squirrel', num: '18', nameUk: 'Білка', nameEn: 'Squirrel', file: '18 - squirrel.svg', category: 'mammals' },
		{ id: 'ferret', num: '19', nameUk: 'Тхір', nameEn: 'Ferret', file: '19 - ferret.svg', category: 'mammals' },
		{ id: 'hedgehog', num: '20', nameUk: 'Їжак', nameEn: 'Hedgehog', file: '20 - hedgehog.svg', category: 'mammals' },
		{ id: 'angelfish', num: '21', nameUk: 'Скалярія', nameEn: 'Angelfish', file: '21 - angelfish.svg', category: 'exotics' },
		{ id: 'snail', num: '22', nameUk: 'Гігантський равлик', nameEn: 'Giant Snail', file: '22 - snail.svg', category: 'exotics' },
		{ id: 'monkey', num: '23', nameUk: 'Мавпа', nameEn: 'Monkey', file: '23 - monkey.svg', category: 'exotics' },
		{ id: 'chimpanzee', num: '24', nameUk: 'Шимпанзе', nameEn: 'Chimpanzee', file: '24 - chimpanzee.svg', category: 'exotics' }
	];

	const brandColors = [
		{ hex: '#13371B', name: 'Dark Green', textColor: '#ffffff' },
		{ hex: '#598F3A', name: 'Main Green', textColor: '#ffffff' },
		{ hex: '#93C84A', name: 'Light Green', textColor: '#101e14' },
		{ hex: '#FFB327', name: 'Yellow', textColor: '#101e14' },
		{ hex: '#E5E5E5', name: 'Light Gray', textColor: '#101e14' },
		{ hex: '#262626', name: 'Dark Gray', textColor: '#ffffff' },
		{ hex: '#FFFFFF', name: 'White', textColor: '#13371b' }
	];

	// Default color is #13371B as requested
	let animalColor = $state<string>('#13371B');
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
			console.error('Download error:', err);
		} finally {
			isDownloading = null;
		}
	}
</script>

<div class="animal-gallery-widget">
	<!-- Color Selector & Filters Toolbar -->
	<div class="gallery-controls-card">
		<!-- 1. Color Picker Row -->
		<div class="color-picker-row">
			<div class="color-picker-label">
				<span class="label-title">{langStore.current === 'uk' ? 'Колір іконок:' : 'Icon Color:'}</span>
				<code class="active-hex-badge">{animalColor}</code>
			</div>

			<div class="colors-palette-wrap">
				{#each brandColors as c (c.hex)}
					<button
						type="button"
						class="color-pill-btn"
						class:is-active={animalColor.toUpperCase() === c.hex.toUpperCase()}
						style:background-color={c.hex}
						onclick={() => (animalColor = c.hex)}
						title="{c.name} ({c.hex})"
						aria-label="{c.name} ({c.hex})"
					>
						{#if animalColor.toUpperCase() === c.hex.toUpperCase()}
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<polyline points="20 6 9 17 4 12"/>
							</svg>
						{/if}
					</button>
				{/each}

				<!-- Custom color picker -->
				<label
					class="color-pill-btn custom-picker-pill"
					class:is-active={!brandColors.some((c) => c.hex.toUpperCase() === animalColor.toUpperCase())}
					title={langStore.current === 'uk' ? 'Кастомний колір (палітра)' : 'Custom color'}
				>
					<input
						type="color"
						value={animalColor}
						oninput={(e) => (animalColor = (e.target as HTMLInputElement).value.toUpperCase())}
						aria-label="Custom color picker"
					/>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="picker-icon" aria-hidden="true">
						<circle cx="13.5" cy="6.5" r=".5" fill="#ffffff"/>
						<circle cx="17.5" cy="10.5" r=".5" fill="#ffffff"/>
						<circle cx="8.5" cy="7.5" r=".5" fill="#ffffff"/>
						<circle cx="6.5" cy="12.5" r=".5" fill="#ffffff"/>
						<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
					</svg>
				</label>
			</div>
		</div>

		<!-- 2. Filter & Search Toolbar -->
		<div class="gallery-toolbar">
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
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
					<circle cx="11" cy="11" r="8"/>
					<line x1="21" y1="21" x2="16.65" y2="16.65"/>
				</svg>
				<input
					type="text"
					class="search-input"
					placeholder={langStore.current === 'uk' ? 'Пошук тварини (напр. папуга, агама)...' : 'Search animal...'}
					bind:value={searchQuery}
				/>
				{#if searchQuery}
					<button type="button" class="clear-btn" onclick={() => (searchQuery = '')} aria-label="Clear">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Grid of 24 Cards -->
	<div class="animals-grid">
		{#each filteredAnimals as a (a.id)}
			<div class="animal-card">
				<div class="card-badge">#{a.num}</div>

				<div class="icon-stage">
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
					<span class="animal-name-secondary">
						{langStore.current === 'uk' ? a.nameEn : a.nameUk}
					</span>
				</div>

				<button
					type="button"
					class="download-animal-btn"
					onclick={(e) => downloadColoredSvg(e, a)}
					disabled={isDownloading === a.id}
					title="{langStore.current === 'uk' ? 'Завантажити векторний SVG у вибраному кольорі' : 'Download SVG in selected color'}"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isDownloading === a.id ? '...' : 'SVG'}</span>
				</button>
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

	.gallery-controls-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.25rem 1.5rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 18px;
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}

	/* COLOR PICKER ROW */
	.color-picker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border);
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
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--brand-leaf);
	}

	.colors-palette-wrap {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		flex-wrap: wrap;
	}

	.color-pill-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.18s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.color-pill-btn:hover {
		transform: scale(1.15);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
	}

	.color-pill-btn.is-active {
		border-color: var(--fg-primary);
		transform: scale(1.18);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.35);
	}

	.custom-picker-pill {
		position: relative;
		border-radius: 50%;
		overflow: hidden;
		isolation: isolate;
		-webkit-mask-image: -webkit-radial-gradient(white, black);
		mask-image: radial-gradient(circle, #fff 100%, #000 100%);
		background: transparent;
	}

	.custom-picker-pill::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		clip-path: circle(50% at 50% 50%);
		background: conic-gradient(from 180deg at 50% 50%, #FFB327 0deg, #93C84A 72deg, #598F3A 144deg, #13371B 216deg, #FFB327 360deg);
		z-index: 0;
	}

	.custom-picker-pill input[type="color"] {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
		z-index: 2;
	}

	.picker-icon {
		position: relative;
		z-index: 1;
		font-size: 0.9rem;
		pointer-events: none;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.65));
	}

	/* TOOLBAR */
	.gallery-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.category-chips {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.38rem 0.8rem;
		border-radius: 20px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.8rem;
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

	:global(.dark) .filter-chip.is-active {
		border-color: var(--brand-gold);
		background: rgba(255, 179, 39, 0.15);
		color: var(--brand-gold);
	}

	.chip-count {
		font-size: 0.72rem;
		opacity: 0.75;
		background: var(--panel-bg);
		padding: 1px 6px;
		border-radius: 10px;
		border: 1px solid var(--border);
	}

	.search-wrap {
		position: relative;
		display: flex;
		align-items: center;
		min-width: 260px;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		color: var(--fg-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.48rem 2rem 0.48rem 2.25rem;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--panel-bg);
		color: var(--fg-primary);
		font-size: 0.82rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		border-color: var(--brand-leaf);
	}

	.clear-btn {
		position: absolute;
		right: 0.6rem;
		background: none;
		border: none;
		color: var(--fg-muted);
		cursor: pointer;
		font-size: 0.8rem;
	}

	/* GRID */
	.animals-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.85rem;
	}

	.animal-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 0.85rem;
		border-radius: 16px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		transition: all 0.2s ease;
		text-align: center;
	}

	.animal-card:hover {
		transform: translateY(-2px);
		border-color: var(--border-hover);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
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
		margin: 0.35rem 0 0.65rem;
		background: var(--bg-secondary);
		border-radius: 14px;
		padding: 0.65rem;
		transition: transform 0.2s ease;
	}

	.animal-card:hover .icon-stage {
		transform: scale(1.06);
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
		flex-direction: column;
		gap: 0.15rem;
		margin-bottom: 0.75rem;
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
	}

	.animal-name-secondary {
		font-size: 0.7rem;
		color: var(--fg-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.download-animal-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.32rem 0.75rem;
		border-radius: 8px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.74rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.download-animal-btn:hover:not(:disabled) {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
		transform: scale(1.04);
	}

	:global(.dark) .download-animal-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	.download-animal-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	@media (max-width: 600px) {
		.animals-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.color-picker-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.search-wrap {
			width: 100%;
		}
	}
</style>
