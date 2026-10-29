<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

	interface EmblemItem {
		id: string;
		num: string;
		svgFile: string;
		pngFile: string;
	}

	const EMBLEMS: EmblemItem[] = [
		{
			id: 'emblem-01',
			num: '01',
			svgFile: 'emblem-animals-01.svg',
			pngFile: 'emblem-animals-01.png'
		},
		{
			id: 'emblem-02',
			num: '02',
			svgFile: 'emblem-animals-02.svg',
			pngFile: 'emblem-animals-02.png'
		},
		{
			id: 'emblem-03',
			num: '03',
			svgFile: 'emblem-animals-03.svg',
			pngFile: 'emblem-animals-03.png'
		},
		{
			id: 'emblem-04',
			num: '04',
			svgFile: 'emblem-animals-04.svg',
			pngFile: 'emblem-animals-04.png'
		}
	];

	let stageTheme = $state<'light' | 'emerald' | 'dark' | 'checker'>('light');
</script>

<div class="photo-logos-widget">
	<div class="photo-logos-header">
		<div class="header-info">
			<span class="sub-badge">Pure Vector Artwork • Clean SVG & HQ PNG</span>
			<p class="section-lead">
				{langStore.current === 'uk'
					? 'Офіційні векторні композиції емблеми шпиталю з силуетами тварин. Чиста векторна графіка без растрових нашарувань — оптимізована для якісного масштабування та друку будь-якого формату.'
					: 'Official Vet Crew Hospital vector emblems featuring wildlife silhouettes. Pure vector artwork with no raster bloat, fully scalable for high-resolution print and digital media.'}
			</p>
		</div>

		<!-- Global Stage Background Switcher -->
		<div class="bg-switch-pill">
			<span class="bg-switch-label">{langStore.current === 'uk' ? 'Тло прев’ю:' : 'Preview Bg:'}</span>
			<div class="bg-switch-btns">
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'light'}
					onclick={() => (stageTheme = 'light')}
					title="Світле тло"
				>
					<span class="color-dot dot-light"></span>
					<span>{langStore.current === 'uk' ? 'Світле' : 'Light'}</span>
				</button>
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'emerald'}
					onclick={() => (stageTheme = 'emerald')}
					title="Фірмовий смарагд #13371B"
				>
					<span class="color-dot dot-emerald"></span>
					<span>{langStore.current === 'uk' ? 'Смарагд' : 'Emerald'}</span>
				</button>
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'dark'}
					onclick={() => (stageTheme = 'dark')}
					title="Темне тло"
				>
					<span class="color-dot dot-dark"></span>
					<span>{langStore.current === 'uk' ? 'Темне' : 'Dark'}</span>
				</button>
				<button
					type="button"
					class="theme-btn"
					class:is-active={stageTheme === 'checker'}
					onclick={() => (stageTheme = 'checker')}
					title="Шахматка (прозоре тло)"
				>
					<span class="color-dot dot-checker"></span>
					<span>{langStore.current === 'uk' ? 'Сітка' : 'Grid'}</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Emblem Cards Grid -->
	<div class="emblems-grid">
		{#each EMBLEMS as item (item.id)}
			<div class="emblem-card">
				<div class="emblem-preview-stage stage--{stageTheme}">
					<img
						src="{base}/brand/emblems/{item.svgFile}"
						alt="Емблема шпиталю з тваринами (Варіант {item.num})"
						class="emblem-svg-render"
						loading="lazy"
					/>
				</div>

				<div class="emblem-card-body">
					<div class="emblem-card-header">
						<span class="edition-num">EDITION #{item.num}</span>
						<h3 class="emblem-card-title">
							{langStore.current === 'uk' ? `Варіант ${item.num}` : `Option ${item.num}`}
						</h3>
					</div>

					<!-- Two dedicated download buttons for SVG and PNG -->
					<div class="emblem-card-actions">
						<a
							href="{base}/brand/emblems/{item.svgFile}"
							download="vet-crew-emblem-{item.num}.svg"
							class="download-btn svg-btn"
						>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>{langStore.current === 'uk' ? 'Завантажити SVG (Вектор)' : 'Download Vector (SVG)'}</span>
						</a>

						<a
							href="{base}/brand/emblems/{item.pngFile}"
							download="vet-crew-emblem-{item.num}.png"
							class="download-btn png-btn"
						>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>{langStore.current === 'uk' ? 'Завантажити PNG (2000 px)' : 'Download PNG (2000 px)'}</span>
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
		gap: 1.8rem;
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
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.theme-btn:hover {
		color: var(--fg-primary);
		background: var(--panel-bg);
	}

	.theme-btn.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		border-color: var(--border-hover);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.color-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.dot-emerald {
		background: #13371b;
	}

	.dot-light {
		background: #ffffff;
		border: 1px solid #d1d5db;
	}

	.dot-dark {
		background: #181c19;
		border: 1px solid #374151;
	}

	.dot-checker {
		background-image: 
			linear-gradient(45deg, #bbb 25%, transparent 25%),
			linear-gradient(-45deg, #bbb 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #bbb 75%),
			linear-gradient(-45deg, transparent 75%, #bbb 75%);
		background-size: 6px 6px;
		background-position: 0 0, 0 3px, 3px -3px, -3px 0px;
	}

	/* GRID */
	.emblems-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.8rem;
	}

	@media (max-width: 900px) {
		.emblems-grid {
			grid-template-columns: 1fr;
		}
	}

	.emblem-card {
		display: flex;
		flex-direction: column;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 1.5rem;
		overflow: hidden;
		transition: all 0.3s ease;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
	}

	.emblem-card:hover {
		border-color: var(--border-hover);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	/* STAGE */
	.emblem-preview-stage {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.2rem;
		min-height: 380px;
		border-bottom: 1px solid var(--border);
		transition: background 0.3s ease;
	}

	.stage--emerald {
		background: #13371b;
	}

	.stage--light {
		background: #ffffff;
	}

	.stage--dark {
		background: #141716;
	}

	.stage--checker {
		background-color: #fafafa;
		background-image: 
			linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
	}

	:global(.dark) .stage--checker {
		background-color: #121513;
		background-image: 
			linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%);
	}

	.emblem-svg-render {
		max-width: 92%;
		max-height: 340px;
		width: auto;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.12));
		transition: transform 0.3s ease;
	}

	.emblem-card:hover .emblem-svg-render {
		transform: scale(1.03);
	}

	/* BODY */
	.emblem-card-body {
		padding: 1.4rem 1.6rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		background: var(--panel-bg);
		flex: 1;
	}

	.emblem-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.edition-num {
		font-family: monospace;
		font-size: 0.76rem;
		font-weight: 800;
		color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.12);
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
	}

	.emblem-card-title {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
	}

	/* ACTIONS: SVG + PNG BUTTONS */
	.emblem-card-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-top: auto;
	}

	@media (max-width: 520px) {
		.emblem-card-actions {
			grid-template-columns: 1fr;
		}
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		font-size: 0.84rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
		text-align: center;
	}

	.svg-btn {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border: 1px solid var(--brand-emerald, #13371b);
	}

	.svg-btn:hover {
		background: var(--brand-leaf, #598f3a);
		border-color: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(89, 143, 58, 0.25);
		transform: translateY(-1px);
	}

	:global(.dark) .svg-btn {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	:global(.dark) .svg-btn:hover {
		background: #ffa80a;
		border-color: #ffa80a;
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	.png-btn {
		background: var(--bg-secondary);
		color: var(--fg-primary);
		border: 1px solid var(--border);
	}

	.png-btn:hover {
		background: var(--panel-bg);
		border-color: var(--border-hover);
		color: var(--brand-leaf);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
		transform: translateY(-1px);
	}

	:global(.dark) .png-btn:hover {
		color: var(--brand-gold);
		border-color: var(--brand-gold);
	}
</style>
