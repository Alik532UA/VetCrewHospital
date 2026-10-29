<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

	interface PhotoEmblem {
		id: string;
		num: string;
		titleUk: string;
		titleEn: string;
		descUk: string;
		descEn: string;
		previewFile: string;
		fullFile: string;
		speciesUk: string;
		speciesEn: string;
	}

	const EMBLEMS: PhotoEmblem[] = [
		{
			id: 'emblem-01',
			num: '01',
			titleUk: 'Фото-емблема — Варіант I (Хижаки та птахи)',
			titleEn: 'Photo Emblem — Edition I (Predators & Avian)',
			descUk: 'Спеціальна композиція з вмонтованими портретами врятованих хижих птахів та диких котів у подушечках лапки.',
			descEn: 'Artistic composite emblem incorporating rescued birds of prey and feline patients inside paw pads.',
			previewFile: '2026-09-19-01_v1.svg',
			fullFile: '2026-09-19-01_v1.svg',
			speciesUk: 'Сокіл, Сова, Дикий кіт, Лев',
			speciesEn: 'Falcon, Owl, Wild Cat, Lion'
		},
		{
			id: 'emblem-02',
			num: '02',
			titleUk: 'Фото-емблема — Варіант II (Дика природа)',
			titleEn: 'Photo Emblem — Edition II (Wild Kingdom)',
			descUk: 'Емблема з акцентом на африканську фауну, екзотичних ссавців та папуг у круглому медальйоні.',
			descEn: 'Emblem highlighting exotic wildlife, mammals and parrots within the circular badge.',
			previewFile: '2026-09-19-02_v1.svg',
			fullFile: '2026-09-19-02_v1.svg',
			speciesUk: 'Какаду, Леопард, Мавпа, Лисиця',
			speciesEn: 'Cockatoo, Leopard, Primate, Fox'
		},
		{
			id: 'emblem-03',
			num: '03',
			titleUk: 'Фото-емблема — Варіант III (Екзотичні види)',
			titleEn: 'Photo Emblem — Edition III (Exotic Species)',
			descUk: 'Гармонійне поєднання рідкісних рептилій, папуг ара та екзотичних підопічних шпиталю.',
			descEn: 'Harmonious composition featuring rare reptiles, macaws and exotic patients.',
			previewFile: '2026-09-19-03_v3.svg',
			fullFile: '2026-09-19-03_v3.svg',
			speciesUk: 'Ара, Хамелеон, Агама, Тхір',
			speciesEn: 'Macaw, Chameleon, Agama, Ferret'
		},
		{
			id: 'emblem-04',
			num: '04',
			titleUk: 'Фото-емблема — Варіант IV (Пацієнти Vet Crew)',
			titleEn: 'Photo Emblem — Edition IV (Vet Crew Patients)',
			descUk: 'Колаж реальних пацієнтів, реабілітованих лікарями шпиталю Vet Crew в Одесі.',
			descEn: 'Montage of real rescued animals rehabilitated by Vet Crew Hospital in Odesa.',
			previewFile: '2026-09-19-04_v1.svg',
			fullFile: '2026-09-19-04_v1.svg',
			speciesUk: 'Єнот, Сова, Яструб, Каракал',
			speciesEn: 'Raccoon, Owl, Hawk, Caracal'
		}
	];

	let stageTheme = $state<'emerald' | 'light' | 'dark' | 'checker'>('emerald');
</script>

<div class="photo-logos-widget">
	<div class="photo-logos-header">
		<div class="header-info">
			<span class="sub-badge">Master Vector Artwork • 5738×5738 px HQ</span>
			<p class="section-lead">
				{langStore.current === 'uk'
					? 'Ексклюзивні офіційні емблеми шпиталю з вмонтованими живими фотографіями диких пацієнтів у подушечках лапки. Використовуються на преміальних поліграфічних носіях, банерах, сувенірній продукції та стендах.'
					: 'Exclusive official hospital emblems featuring live photographic portraits of wild patients masked within the paw pads. Designed for high-end print, banners, merch, and exhibition stands.'}
			</p>
		</div>

		<!-- Global Stage Background Switcher -->
		<div class="bg-switch-pill">
			<span class="bg-switch-label">{langStore.current === 'uk' ? 'Тло прев’ю:' : 'Preview Bg:'}</span>
			<div class="bg-switch-btns">
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'emerald'}
					onclick={() => (stageTheme = 'emerald')}
					title="Фірмовий смарагд #13371B"
				>
					<span class="color-dot dot-emerald"></span>
					<span>Смарагд</span>
				</button>
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'light'}
					onclick={() => (stageTheme = 'light')}
					title="Світлий фон"
				>
					<span class="color-dot dot-light"></span>
					<span>Світле</span>
				</button>
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'dark'}
					onclick={() => (stageTheme = 'dark')}
					title="Темний графіт"
				>
					<span class="color-dot dot-dark"></span>
					<span>Темне</span>
				</button>
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'checker'}
					onclick={() => (stageTheme = 'checker')}
					title="Шахова прозорість"
				>
					<span class="color-dot dot-checker">🏁</span>
					<span>Сітка</span>
				</button>
			</div>
		</div>
	</div>

	<!-- 4 CARDS GRID -->
	<div class="emblems-grid">
		{#each EMBLEMS as item (item.id)}
			<div class="emblem-card">
				<div class="emblem-stage bg-{stageTheme}">
					<img
						src="{base}/brand/photo-emblems/preview/{item.previewFile}"
						alt="{item.titleUk}"
						class="emblem-img"
						loading="lazy"
					/>
				</div>

				<div class="emblem-card-body">
					<div class="emblem-meta-top">
						<span class="edition-tag">EDITION #{item.num}</span>
						<h3 class="emblem-card-title">{langStore.current === 'uk' ? item.titleUk : item.titleEn}</h3>
					</div>

					<p class="emblem-card-desc">
						{langStore.current === 'uk' ? item.descUk : item.descEn}
					</p>

					<div class="species-bar">
						<span class="species-label">{langStore.current === 'uk' ? 'Пацієнти у лапці:' : 'Featured Wildlife:'}</span>
						<span class="species-list">{langStore.current === 'uk' ? item.speciesUk : item.speciesEn}</span>
					</div>

					<div class="emblem-card-actions">
						<a
							href="{base}/brand/photo-emblems/{item.fullFile}"
							download="VetCrew-Animal-Emblem-v{item.num}.svg"
							class="download-hq-btn"
						>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>{langStore.current === 'uk' ? 'Завантажити Vector SVG (Print HQ • 2.5 MB)' : 'Download Print HQ SVG (2.5 MB)'}</span>
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.photo-logos-widget {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}

	.photo-logos-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.header-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 680px;
	}

	.sub-badge {
		font-size: 0.74rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--brand-leaf);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.section-lead {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--fg-secondary);
		margin: 0;
	}

	.bg-switch-pill {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 4px 6px 4px 12px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 9999px;
	}

	.bg-switch-label {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-muted);
	}

	.bg-switch-btns {
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}

	.theme-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.65rem;
		border-radius: 9999px;
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.theme-btn:hover {
		color: var(--fg-primary);
	}

	.theme-btn.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.color-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.dot-emerald { background: #13371B; }
	.dot-light { background: #FFFFFF; }
	.dot-dark { background: #1a1a1a; }
	.dot-checker { border: none; font-size: 0.7rem; line-height: 1; }

	/* GRID OF 4 EMBLEMS */
	.emblems-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
		gap: 1.75rem;
	}

	.emblem-card {
		display: flex;
		flex-direction: column;
		border-radius: 20px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		overflow: hidden;
		transition: all 0.25s ease;
	}

	.emblem-card:hover {
		transform: translateY(-3px);
		border-color: var(--border-hover);
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);
	}

	.emblem-stage {
		position: relative;
		width: 100%;
		min-height: 380px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.25rem;
		transition: background-color 0.25s ease;
	}

	.emblem-stage.bg-emerald {
		background: #13371B;
	}

	.emblem-stage.bg-light {
		background: #F8FAF8;
	}

	.emblem-stage.bg-dark {
		background: #0D1610;
	}

	.emblem-stage.bg-checker {
		background-color: #ffffff;
		background-image: linear-gradient(45deg, #e6ede6 25%, transparent 25%),
			linear-gradient(-45deg, #e6ede6 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e6ede6 75%),
			linear-gradient(-45deg, transparent 75%, #e6ede6 75%);
		background-size: 18px 18px;
		background-position: 0 0, 0 9px, 9px -9px, -9px 0px;
	}

	.emblem-img {
		width: 100%;
		max-width: 320px;
		height: auto;
		aspect-ratio: 1 / 1;
		object-fit: contain;
		filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
		transition: transform 0.3s ease;
	}

	.emblem-card:hover .emblem-img {
		transform: scale(1.03);
	}

	.emblem-card-body {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		padding: 1.5rem;
	}

	.emblem-meta-top {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.edition-tag {
		font-size: 0.72rem;
		font-family: monospace;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--brand-leaf);
	}

	.emblem-card-title {
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
	}

	.emblem-card-desc {
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--fg-secondary);
		margin: 0;
	}

	.species-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.85rem;
		border-radius: 10px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		font-size: 0.78rem;
	}

	.species-label {
		font-weight: 700;
		color: var(--fg-muted);
	}

	.species-list {
		font-weight: 700;
		color: var(--fg-primary);
	}

	.emblem-card-actions {
		padding-top: 0.5rem;
	}

	.download-hq-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		padding: 0.65rem 1rem;
		border-radius: 12px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.download-hq-btn:hover {
		background: var(--brand-leaf);
		color: #ffffff;
		border-color: var(--brand-leaf);
		box-shadow: 0 4px 14px rgba(89, 143, 58, 0.25);
		transform: translateY(-1px);
	}

	@media (max-width: 640px) {
		.emblems-grid {
			grid-template-columns: 1fr;
		}

		.emblem-stage {
			min-height: 280px;
			padding: 1.5rem;
		}
	}
</style>
