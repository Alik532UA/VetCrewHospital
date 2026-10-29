<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';

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

	let stageTheme = $state<StageTheme>('checker');
</script>

<div class="photo-logos-widget">
	<div class="photo-logos-header">
		<!-- Global Stage Background Switcher -->
		<StageBgSwitcher bind:current={stageTheme} />
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
		align-items: center;
		justify-content: flex-end;
		gap: 1.5rem;
		flex-wrap: wrap;
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

	.download-btn {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border: 1px solid var(--brand-emerald, #13371b);
	}

	.download-btn:hover {
		background: var(--brand-leaf, #598f3a);
		border-color: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(89, 143, 58, 0.25);
		transform: translateY(-1px);
	}

	:global(.dark) .download-btn {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	:global(.dark) .download-btn:hover {
		background: #ffa80a;
		border-color: #ffa80a;
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	:global(.dark) .png-btn:hover {
		color: var(--brand-gold);
		border-color: var(--brand-gold);
	}
</style>
