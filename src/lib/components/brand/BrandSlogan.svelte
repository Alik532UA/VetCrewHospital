<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { downloadSvgAsPng, downloadUrlAsPng } from '$lib/utils/exportPng';
	import type { StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';

	interface Props {
		stageTheme?: StageTheme;
	}

	let { stageTheme = 'checker' }: Props = $props();

	interface BrandColor {
		hex: string;
		name: string;
		textColor: string;
	}

	const brandColors: BrandColor[] = [
		{ hex: '#FFB327', name: 'Brand Gold', textColor: '#101e14' },
		{ hex: '#13371B', name: 'Deep Emerald', textColor: '#ffffff' },
		{ hex: '#598F3A', name: 'Leaf Green', textColor: '#ffffff' },
		{ hex: '#93C84A', name: 'Light Green', textColor: '#101e14' },
		{ hex: '#E5E5E5', name: 'Light Gray', textColor: '#101e14' },
		{ hex: '#262626', name: 'Dark Slate', textColor: '#ffffff' },
		{ hex: '#FFFFFF', name: 'Pure White', textColor: '#13371b' }
	];

	const BUTTERFLY_PATH_D =
		'M145.67,128.27c6.5-8.68,11.89-18.24,19.03-26.47,14.64-16.9,46.38-45.5,70.29-32.34,21.57,11.87,12.85,54.35,5.17,72.8-10.58,25.4-26.93,49.67-55.04,56.97-.63,6.11,2.1,10.89,1.59,17.59-.29,3.84-3.37,12.35-6.64,14.35-2.63,1.6-6.24.41-7.93,2.07-1.17,1.15-5.19,15.08-6.61,18.39-6.7,15.57-25.58,41.91-45.75,32.03-11.96-5.86-12.52-22.52-12.15-33.93.1-3.09,2.45-6.35-.45-8.43-18.62,9.62-42.88,17.49-64.05,16.01-58.05-4.04-25.68-72.76,12.06-85.03.64-.21,2.27.36,1.47-1.49-.41-.94-12.57-11.2-14.96-14.04-20.46-24.34-32.56-69.39-29.9-100.84,4.33-51.24,45.32-52.67,75.38-18.64,29.34,33.22,47,84.97,47.48,129.02l-3.08-.6c-15.61-36.43-31.12-82.64-59.84-110.96-6.37-6.28-22.93-20.67-30.51-10.39-8.45,11.46-2.9,53.1.72,67.16,5.54,21.46,12.66,36,28.7,51.3,2.59,2.47,11.15,7.62,11,11.03-.12,2.74-9.23,5.66-11.83,7.11-13.05,7.23-26.65,17.45-31.91,32.09-14.82,41.28,52.18,19.82,70.43,12.43,5.7-2.31,10.76-7.11,17.33-6.18,1.07,11.75-4.35,23.84-3,35.5,1.69,14.65,13.74,6.48,19.96,0,8.26-8.59,23.58-32.86,20.83-44.8-.68-2.96-3.7-4.87-3.83-9.24-.45-14.69,15.02-13.6,24.09-17.92,17.84-8.49,36.02-41.6,39.5-60.5,1.39-7.54,4.9-30.69-7.02-30.1-14.5.71-45.65,32.06-56.05,43.04-2.91,3.08-14.9,19.02-17.98,19.03-5.49-9.13-3.3-21.16-4.53-31.5-1.3-10.96-5.9-19.75-7.75-29.26-1.4-7.21,3.3-8.09,7.65-3.64,3.27,3.34,8.12,18.4,8.12,22.88v15.5Z';

	let butterflyColor = $state('#FFB327');

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

	function downloadButterflyPng() {
		const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 300" width="2000" height="2308">
  <title>Фірмовий метелик Vet Crew (${butterflyColor})</title>
  <path fill="${butterflyColor}" d="${BUTTERFLY_PATH_D}"/>
</svg>`;
		downloadSvgAsPng(svgCode, `vet-crew-butterfly-${butterflyColor.replace('#', '')}.png`, 2000);
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
			<h3 class="slogan-title">{langStore.current === 'uk' ? 'Фірмовий маніфест шпиталю' : 'Hospital Brand Manifesto'}</h3>

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
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'SVG (Вектор)' : 'Vector (SVG)'}</span>
				</a>

				<button
					type="button"
					class="download-brand-btn"
					onclick={() => downloadUrlAsPng(`${base}/brand/slogan/exotic-wild-special-important.svg`, 'vet-crew-slogan-values-2000px.png', 2000)}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'PNG (2000 px)' : 'PNG (2000 px)'}</span>
				</button>
			</div>
		</div>
	</div>

	<!-- 2. STANDALONE BUTTERFLY SYMBOL -->
	<div class="slogan-container">
		<div class="slogan-visual butterfly-visual stage--{stageTheme}">
			<!-- Live SVG Viewport: pure butterfly vector -->
			<svg
				viewBox="0 0 260 300"
				class="butterfly-svg-live"
				aria-label="Фірмовий метелик Vet Crew"
			>
				<path fill={butterflyColor} d={BUTTERFLY_PATH_D} />
			</svg>
		</div>

		<div class="slogan-details">
			<h3 class="slogan-title">{langStore.current === 'uk' ? 'Метелик Vet Crew (Butterfly)' : 'Vet Crew Butterfly Symbol'}</h3>

			<!-- Live Color Palette Switcher -->
			<div class="butterfly-color-bar">
				<span class="color-bar-label">{langStore.current === 'uk' ? 'Колір метелика:' : 'Butterfly Color:'}</span>
				<div class="swatches-row">
					{#each brandColors as c (c.hex)}
						<button
							type="button"
							class="color-pill-btn"
							class:is-active={butterflyColor.toUpperCase() === c.hex.toUpperCase()}
							style:background-color={c.hex}
							onclick={() => (butterflyColor = c.hex)}
							title="{c.name} ({c.hex})"
							aria-label="{c.name} ({c.hex})"
						>
							{#if butterflyColor.toUpperCase() === c.hex.toUpperCase()}
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="20 6 9 17 4 12"/>
								</svg>
							{/if}
						</button>
					{/each}

					<!-- Custom Color Picker -->
					<label
						class="color-pill-btn custom-picker-pill"
						class:is-active={!brandColors.some((c) => c.hex.toUpperCase() === butterflyColor.toUpperCase())}
						title={langStore.current === 'uk' ? 'Власний колір (палітра)' : 'Custom color'}
					>
						<input
							type="color"
							value={butterflyColor}
							oninput={(e) => (butterflyColor = (e.target as HTMLInputElement).value.toUpperCase())}
							aria-label="Custom color picker"
						/>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="picker-icon" aria-hidden="true">
							<circle cx="13.5" cy="6.5" r=".5" fill="#ffffff"/>
							<circle cx="17.5" cy="10.5" r=".5" fill="#ffffff"/>
							<circle cx="8.5" cy="7.5" r=".5" fill="#ffffff"/>
							<circle cx="6.5" cy="12.5" r=".5" fill="#ffffff"/>
							<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
						</svg>
					</label>

					<code class="active-hex-code">{butterflyColor}</code>
				</div>
			</div>

			<div class="slogan-actions">
				<button
					type="button"
					class="download-brand-btn"
					onclick={downloadCustomButterfly}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>
						{langStore.current === 'uk'
							? `SVG (${butterflyColor})`
							: `SVG (${butterflyColor})`}
					</span>
				</button>

				<button
					type="button"
					class="download-brand-btn"
					onclick={downloadButterflyPng}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'PNG (2000 px)' : 'PNG (2000 px)'}</span>
				</button>
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
		flex-wrap: wrap;
		align-items: center;
	}

	.download-brand-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.65rem 1.1rem;
		border-radius: 10px;
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border: 1px solid var(--brand-emerald, #13371b);
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.download-brand-btn:hover {
		background: var(--brand-leaf, #598f3a);
		border-color: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 4px 12px rgba(89, 143, 58, 0.25);
		transform: translateY(-1px);
	}

	:global(.dark) .download-brand-btn {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	:global(.dark) .download-brand-btn:hover {
		background: #ffa80a;
		border-color: #ffa80a;
		color: #101e14;
		box-shadow: 0 4px 12px rgba(255, 179, 39, 0.35);
	}

	.butterfly-color-bar {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.85rem 1rem;
		background: var(--panel-bg);
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	.color-bar-label {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-secondary);
	}

	.swatches-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.color-pill-btn {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 2px solid rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.18s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
		padding: 0;
	}

	:global([data-theme='dark']) .color-pill-btn {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.color-pill-btn:hover {
		transform: scale(1.15);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
	}

	.color-pill-btn.is-active {
		border-color: var(--brand-emerald, #13371b);
		transform: scale(1.15);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.45);
	}

	:global([data-theme='dark']) .color-pill-btn.is-active {
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 0 0 3px rgba(255, 179, 39, 0.45);
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
		background: conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FFA500 51deg, #FFFF00 102deg, #008000 153deg, #0000FF 204deg, #4B0082 255deg, #EE82EE 306deg, #FF0000 360deg);
		z-index: 0;
	}

	.custom-picker-pill input[type='color'] {
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
		pointer-events: none;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.65));
	}

	.active-hex-code {
		font-family: monospace;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		margin-left: 0.25rem;
	}

	@media (max-width: 768px) {
		.slogan-container {
			grid-template-columns: 1fr;
			padding: 1.25rem;
			gap: 1.5rem;
		}
	}
</style>
