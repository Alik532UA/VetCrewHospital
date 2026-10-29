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

	let searchQuery = $state('');
	let selectedCategory = $state<'all' | 'birds' | 'reptiles' | 'mammals' | 'exotics'>('all');

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
</script>

<div class="animal-gallery-widget">
	<!-- Filter & Search Toolbar -->
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
				<span>{langStore.current === 'uk' ? 'Рептилії та амфібії' : 'Reptiles & Frogs'}</span>
				<span class="chip-count">6</span>
			</button>
			<button
				type="button"
				class="filter-chip"
				class:is-active={selectedCategory === 'mammals'}
				onclick={() => (selectedCategory = 'mammals')}
			>
				<span>{langStore.current === 'uk' ? 'Дрібні ссавці' : 'Small Mammals'}</span>
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
				<button type="button" class="clear-btn" onclick={() => (searchQuery = '')} aria-label="Clear">✕</button>
			{/if}
		</div>
	</div>

	<!-- Grid of 24 Cards -->
	<div class="animals-grid">
		{#each filteredAnimals as a (a.id)}
			<div class="animal-card">
				<div class="card-badge">#{a.num}</div>

				<div class="icon-stage">
					<img
						src="{base}/brand/animals/{encodeURIComponent(a.file)}"
						alt="{a.nameUk} ({a.nameEn})"
						class="animal-svg-img"
						loading="lazy"
					/>
				</div>

				<div class="card-meta">
					<span class="animal-name-primary">
						{langStore.current === 'uk' ? a.nameUk : a.nameEn}
					</span>
					<span class="animal-name-secondary">
						{langStore.current === 'uk' ? a.nameEn : a.nameUk}
					</span>
				</div>

				<a
					href="{base}/brand/animals/{encodeURIComponent(a.file)}"
					download="{a.file}"
					class="download-animal-btn"
					title="{langStore.current === 'uk' ? 'Завантажити векторний SVG' : 'Download SVG'}"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>SVG</span>
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.animal-gallery-widget {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
	}

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
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.75rem;
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
		background: rgba(89, 143, 58, 0.12);
		color: var(--brand-leaf);
	}

	.chip-count {
		font-size: 0.72rem;
		opacity: 0.7;
		background: var(--panel-bg);
		padding: 1px 6px;
		border-radius: 10px;
		border: 1px solid var(--border);
	}

	.search-wrap {
		position: relative;
		display: flex;
		align-items: center;
		min-width: 240px;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		color: var(--fg-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.45rem 2rem 0.45rem 2.2rem;
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
		border-radius: 14px;
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
		border-radius: 12px;
		padding: 0.5rem;
		transition: transform 0.2s ease;
	}

	.animal-card:hover .icon-stage {
		transform: scale(1.05);
	}

	.animal-svg-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
	}

	:global([data-theme='dark']) .animal-svg-img {
		filter: invert(1) brightness(1.2) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
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
		padding: 0.28rem 0.65rem;
		border-radius: 8px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.74rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.download-animal-btn:hover {
		background: var(--brand-leaf);
		color: #ffffff;
		border-color: var(--brand-leaf);
	}

	@media (max-width: 600px) {
		.animals-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.search-wrap {
			width: 100%;
		}
	}
</style>
