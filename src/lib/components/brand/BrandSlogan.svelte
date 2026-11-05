<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { downloadSvgAsPng, downloadUrlAsPng } from '$lib/utils/exportPng';
	import type { StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import PngDownloadBtn from '$lib/components/brand/PngDownloadBtn.svelte';
	import type { PngResolution } from '$lib/data/pngResolutions';

	interface Props {
		stageTheme?: StageTheme;
		butterflyColor?: string;
	}

	let { stageTheme = 'checker', butterflyColor = $bindable('#FFB327') }: Props = $props();

	const BUTTERFLY_PATH_D =
		'M145.67,128.27c6.5-8.68,11.89-18.24,19.03-26.47,14.64-16.9,46.38-45.5,70.29-32.34,21.57,11.87,12.85,54.35,5.17,72.8-10.58,25.4-26.93,49.67-55.04,56.97-.63,6.11,2.1,10.89,1.59,17.59-.29,3.84-3.37,12.35-6.64,14.35-2.63,1.6-6.24.41-7.93,2.07-1.17,1.15-5.19,15.08-6.61,18.39-6.7,15.57-25.58,41.91-45.75,32.03-11.96-5.86-12.52-22.52-12.15-33.93.1-3.09,2.45-6.35-.45-8.43-18.62,9.62-42.88,17.49-64.05,16.01-58.05-4.04-25.68-72.76,12.06-85.03.64-.21,2.27.36,1.47-1.49-.41-.94-12.57-11.2-14.96-14.04-20.46-24.34-32.56-69.39-29.9-100.84,4.33-51.24,45.32-52.67,75.38-18.64,29.34,33.22,47,84.97,47.48,129.02l-3.08-.6c-15.61-36.43-31.12-82.64-59.84-110.96-6.37-6.28-22.93-20.67-30.51-10.39-8.45,11.46-2.9,53.1.72,67.16,5.54,21.46,12.66,36,28.7,51.3,2.59,2.47,11.15,7.62,11,11.03-.12,2.74-9.23,5.66-11.83,7.11-13.05,7.23-26.65,17.45-31.91,32.09-14.82,41.28,52.18,19.82,70.43,12.43,5.7-2.31,10.76-7.11,17.33-6.18,1.07,11.75-4.35,23.84-3,35.5,1.69,14.65,13.74,6.48,19.96,0,8.26-8.59,23.58-32.86,20.83-44.8-.68-2.96-3.7-4.87-3.83-9.24-.45-14.69,15.02-13.6,24.09-17.92,17.84-8.49,36.02-41.6,39.5-60.5,1.39-7.54,4.9-30.69-7.02-30.1-14.5.71-45.65,32.06-56.05,43.04-2.91,3.08-14.9,19.02-17.98,19.03-5.49-9.13-3.3-21.16-4.53-31.5-1.3-10.96-5.9-19.75-7.75-29.26-1.4-7.21,3.3-8.09,7.65-3.64,3.27,3.34,8.12,18.4,8.12,22.88v15.5Z';

	function downloadCustomButterfly() {
		const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 300" width="100%" height="100%">
  <title>Фірмовий метелик Vet Crew (${butterflyColor})</title>
  <path fill="${butterflyColor}" d="${BUTTERFLY_PATH_D}"/>
</svg>`;
		const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `vet-crew-butterfly-${butterflyColor.replace('#', '')}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function downloadButterflyPng(res: PngResolution) {
		const h = Math.round((res.px * 300) / 260);
		const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 300" width="${res.px}" height="${h}">
  <title>Фірмовий метелик Vet Crew (${butterflyColor})</title>
  <path fill="${butterflyColor}" d="${BUTTERFLY_PATH_D}"/>
</svg>`;
		downloadSvgAsPng(
			svgCode,
			`vet-crew-butterfly-${butterflyColor.replace('#', '')}-${res.label}.png`,
			res.px
		);
	}
</script>

<div class="slogan-showcase-stack">
	<!-- 1. FULL SLOGAN COMPOSITION -->
	<div class="slogan-container">
		<div class="slogan-visual stage--{stageTheme}">
			<img
				src="{base}/brand/slogan/exotic-wild-special-important.svg"
				alt="Екзотичні Дикі Особливі Важливі"
				class="slogan-svg-hero"
				loading="lazy"
			/>
		</div>

		<div class="slogan-details">
			<h3 class="slogan-title">
				{langStore.current === 'uk' ? 'Фірмовий маніфест шпиталю' : 'Hospital Brand Manifesto'}
			</h3>

			<div class="values-pills">
				{#if langStore.current === 'uk'}
					<span class="val-pill"><strong>Екзотичні</strong></span>
					<span class="val-pill"><strong>Дикі</strong></span>
					<span class="val-pill"><strong>Особливі</strong></span>
					<span class="val-pill"><strong>Важливі</strong></span>
				{:else}
					<span class="val-pill"><strong>Exotic</strong></span>
					<span class="val-pill"><strong>Wild</strong></span>
					<span class="val-pill"><strong>Special</strong></span>
					<span class="val-pill"><strong>Important</strong></span>
				{/if}
			</div>

			<div class="slogan-actions">
				<a
					href="{base}/brand/slogan/exotic-wild-special-important.svg"
					download="vet-crew-slogan-values.svg"
					class="download-brand-btn"
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'SVG (Вектор)' : 'Vector (SVG)'}</span>
				</a>

				<PngDownloadBtn
					onselect={(res) =>
						downloadUrlAsPng(
							`${base}/brand/slogan/exotic-wild-special-important.svg`,
							`vet-crew-slogan-values-${res.label}.png`,
							res.px
						)}
					btnClass="download-brand-btn"
				/>
			</div>
		</div>
	</div>

	<!-- 2. STANDALONE BUTTERFLY SYMBOL -->
	<div class="slogan-container">
		<div class="slogan-visual butterfly-visual stage--{stageTheme}">
			<!-- Live SVG Viewport: pure butterfly vector -->
			<svg viewBox="0 0 260 300" class="butterfly-svg-live" aria-label="Фірмовий метелик Vet Crew">
				<path fill={butterflyColor} d={BUTTERFLY_PATH_D} />
			</svg>
		</div>

		<div class="slogan-details">
			<h3 class="slogan-title">
				{langStore.current === 'uk' ? 'Метелик Vet Crew (Butterfly)' : 'Vet Crew Butterfly Symbol'}
			</h3>

			<div class="slogan-actions">
				<button type="button" class="download-brand-btn" onclick={downloadCustomButterfly}>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>SVG</span>
				</button>

				<PngDownloadBtn onselect={downloadButterflyPng} btnClass="download-brand-btn" />
			</div>
		</div>
	</div>
</div>

<style>
	.slogan-showcase-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	.slogan-container {
		display: grid;
		grid-template-columns: minmax(280px, 380px) 1fr;
		gap: 2rem;
		align-items: center;
		padding: 1.5rem;
		border-radius: 18px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		transition: all 0.25s ease;
	}

	.slogan-container:hover {
		border-color: var(--border-hover);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
	}

	.slogan-visual {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		border-radius: 14px;
		border: 1px solid var(--border);
		min-height: 240px;
		position: relative;
	}

	.slogan-svg-hero {
		width: 100%;
		max-width: 290px;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
		transition: transform 0.3s ease;
	}

	.slogan-container:hover .slogan-svg-hero {
		transform: scale(1.02);
	}

	.butterfly-visual {
		min-height: 240px;
	}

	.butterfly-svg-live {
		width: 140px;
		height: 160px;
		filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
		transition: transform 0.3s ease;
	}

	.slogan-container:hover .butterfly-svg-live {
		transform: scale(1.04);
	}

	.slogan-details {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.25rem;
	}

	.slogan-title {
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
	}

	.values-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.val-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		font-size: 0.82rem;
		color: var(--brand-emerald, #13371b);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
	}

	:global([data-theme='dark']) .val-pill {
		color: var(--brand-gold, #ffb327);
	}

	.slogan-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: nowrap;
		align-items: center;
	}

	.download-brand-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.55rem 0.85rem;
		border-radius: 8px;
		background: rgba(19, 55, 27, 0.08);
		border: 1px solid rgba(19, 55, 27, 0.22);
		color: var(--brand-emerald, #13371b);
		font-size: 0.76rem;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.18s ease;
		text-align: center;
		white-space: nowrap;
	}

	.download-brand-btn:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .download-brand-btn,
	:global(.dark) .download-brand-btn {
		background: rgba(255, 179, 39, 0.12);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .download-brand-btn:hover:not(:disabled),
	:global(.dark) .download-brand-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	.download-brand-btn:disabled {
		opacity: 0.55;
		cursor: wait;
	}

	@media (max-width: 768px) {
		.slogan-container {
			grid-template-columns: 1fr;
			padding: 1.25rem;
			gap: 1.5rem;
		}
	}
</style>
