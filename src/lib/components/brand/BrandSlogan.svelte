<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

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
	let stageTheme = $state<'subtle' | 'dark' | 'light'>('subtle');

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
</script>

<div class="slogan-showcase-stack">
	<!-- 1. FULL SLOGAN COMPOSITION -->
	<div class="slogan-container">
		<div class="slogan-visual">
			<img
				src="{base}/brand/slogan/exotic-wild-special-important.svg"
				alt="Екзотичні Дикі Особливі Важливі"
				class="slogan-svg-hero"
				loading="lazy"
			/>
		</div>

		<div class="slogan-details">
			<div class="values-pills">
				<span class="val-pill">
					<strong>Екзотичні</strong>
					<span>(Exotic)</span>
				</span>
				<span class="val-pill">
					<strong>Дикі</strong>
					<span>(Wild)</span>
				</span>
				<span class="val-pill">
					<strong>Особливі</strong>
					<span>(Special)</span>
				</span>
				<span class="val-pill">
					<strong>Важливі</strong>
					<span>(Important)</span>
				</span>
			</div>

			<p class="slogan-philosophy">
				{langStore.current === 'uk'
					? 'Кожен пацієнт шпиталю — від папуги чи черепахи до сокола чи лева — отримує рівноцінну турботу, найсучасніше реанімаційне обладнання та безкомпромісну любов лікарів.'
					: 'Every patient, whether a parrot, reptile, predator, or rescue animal, receives equal care, state-of-the-art diagnostics, and unwavering devotion.'}
			</p>

			<a
				href="{base}/brand/slogan/exotic-wild-special-important.svg"
				download="vet-crew-slogan-values.svg"
				class="download-brand-btn primary"
			>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>{langStore.current === 'uk' ? 'Завантажити повну емблему слогану (SVG)' : 'Download Slogan Emblem SVG'}</span>
			</a>
		</div>
	</div>

	<!-- 2. STANDALONE BUTTERFLY SYMBOL (Pure vector without background or stroke) -->
	<div class="slogan-container butterfly-box">
		<div class="slogan-visual butterfly-visual" class:grid--subtle={stageTheme === 'subtle'} class:grid--dark={stageTheme === 'dark'} class:grid--light={stageTheme === 'light'}>
			<div class="butterfly-stage-toolbar">
				<button
					type="button"
					class="stage-btn"
					class:is-active={stageTheme === 'subtle'}
					onclick={() => (stageTheme = 'subtle')}
					title={langStore.current === 'uk' ? "Прозоре тло (сітка)" : "Checkerboard"}
					aria-label={langStore.current === 'uk' ? "Прозоре тло (сітка)" : "Checkerboard"}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect width="18" height="18" x="3" y="3" rx="2"/>
						<path d="M3 12h18M12 3v18"/>
					</svg>
				</button>
				<button
					type="button"
					class="stage-btn"
					class:is-active={stageTheme === 'light'}
					onclick={() => (stageTheme = 'light')}
					title={langStore.current === 'uk' ? "Світле тло" : "Light background"}
					aria-label={langStore.current === 'uk' ? "Світле тло" : "Light background"}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="4"/>
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
					</svg>
				</button>
				<button
					type="button"
					class="stage-btn"
					class:is-active={stageTheme === 'dark'}
					onclick={() => (stageTheme = 'dark')}
					title={langStore.current === 'uk' ? "Темне тло" : "Dark background"}
					aria-label={langStore.current === 'uk' ? "Темне тло" : "Dark background"}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
					</svg>
				</button>
			</div>

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
			<div class="butterfly-meta-head">
				<span class="sub-badge">{langStore.current === 'uk' ? 'Фірмовий графічний знак' : 'Official Brand Symbol'}</span>
				<h3 class="butterfly-title">{langStore.current === 'uk' ? 'Метелик Vet Crew (Butterfly)' : 'Vet Crew Butterfly Symbol'}</h3>
			</div>

			<p class="slogan-philosophy">
				{langStore.current === 'uk'
					? 'Чистий контурний знак без зайвих фонів та обводок. Символізує легкість, відродження та турботу про тендітне життя. Використовується на медичній уніформі, мерчі, бейджах та сувенірній продукції.'
					: 'Clean standalone butterfly glyph free of backgrounds and strokes. Embodies fragile wildlife protection, grace, and rebirth. Used across merchandise, medical uniforms, and hospital badges.'}
			</p>

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
					<label class="color-pill-btn custom-picker-pill" title={langStore.current === 'uk' ? 'Кастомний колір' : 'Custom color'}>
						<input
							type="color"
							value={butterflyColor}
							oninput={(e) => (butterflyColor = (e.target as HTMLInputElement).value.toUpperCase())}
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

					<code class="active-hex-code">{butterflyColor}</code>
				</div>
			</div>

			<button
				type="button"
				class="download-brand-btn"
				onclick={downloadCustomButterfly}
			>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>
					{langStore.current === 'uk'
						? `Завантажити метелик у кольорі ${butterflyColor} (SVG)`
						: `Download Butterfly in ${butterflyColor} (SVG)`}
				</span>
			</button>
		</div>
	</div>
</div>

<style>
	.slogan-showcase-stack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.slogan-container {
		display: grid;
		grid-template-columns: minmax(280px, 420px) 1fr;
		gap: 2.2rem;
		align-items: center;
		padding: 2rem;
		border-radius: 20px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		transition: all 0.3s ease;
	}

	.slogan-container:hover {
		border-color: var(--border-hover);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
	}

	.slogan-visual {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem;
		border-radius: 16px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
		min-height: 280px;
		position: relative;
	}

	.slogan-svg-hero {
		width: 100%;
		max-width: 320px;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.1));
		transition: transform 0.3s ease;
	}

	.slogan-container:hover .slogan-svg-hero {
		transform: scale(1.02);
	}

	.slogan-details {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.values-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.val-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		font-size: 0.85rem;
		color: var(--fg-primary);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
	}

	.val-pill strong {
		color: var(--brand-emerald);
	}

	:global(.dark) .val-pill strong {
		color: var(--brand-gold);
	}

	.val-pill span {
		color: var(--fg-secondary);
		font-size: 0.76rem;
	}

	.slogan-philosophy {
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--fg-secondary);
		margin: 0;
	}

	.download-brand-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.8rem 1.4rem;
		border-radius: 10px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		width: fit-content;
		cursor: pointer;
	}

	.download-brand-btn:hover {
		background: var(--brand-emerald);
		color: #ffffff;
		border-color: var(--brand-emerald);
		box-shadow: 0 4px 14px rgba(19, 55, 27, 0.2);
	}

	:global(.dark) .download-brand-btn:hover {
		background: var(--brand-gold);
		color: #101e14;
		border-color: var(--brand-gold);
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.2);
	}

	.download-brand-btn.primary {
		background: var(--brand-emerald);
		color: #ffffff;
		border-color: var(--brand-emerald);
	}

	.download-brand-btn.primary:hover {
		background: var(--brand-leaf);
		border-color: var(--brand-leaf);
	}

	/* BUTTERFLY SECTION */
	.butterfly-box {
		border-left: 4px solid var(--brand-gold);
	}

	.butterfly-visual {
		background: var(--panel-bg);
		min-height: 280px;
		position: relative;
		overflow: hidden;
	}

	.butterfly-visual.grid--subtle {
		background-image: 
			linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.04) 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
	}

	:global(.dark) .butterfly-visual.grid--subtle {
		background-image: 
			linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.04) 75%);
	}

	.butterfly-visual.grid--light {
		background: #ffffff !important;
	}

	.butterfly-visual.grid--dark {
		background: #141716 !important;
	}

	.butterfly-stage-toolbar {
		position: absolute;
		top: 0.8rem;
		right: 0.8rem;
		display: flex;
		gap: 0.3rem;
		background: rgba(0, 0, 0, 0.05);
		padding: 0.25rem;
		border-radius: 8px;
		z-index: 5;
	}

	:global(.dark) .butterfly-stage-toolbar {
		background: rgba(255, 255, 255, 0.1);
	}

	.stage-btn {
		width: 26px;
		height: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		border: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		font-size: 0.75rem;
		transition: all 0.15s ease;
	}

	.stage-btn.is-active {
		background: var(--panel-bg);
		border-color: var(--border);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
	}

	.butterfly-svg-live {
		width: 100%;
		max-width: 220px;
		height: auto;
		max-height: 220px;
		filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.12));
		transition: transform 0.3s ease;
	}

	.slogan-container:hover .butterfly-svg-live {
		transform: scale(1.06);
	}

	.butterfly-meta-head {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.sub-badge {
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #b45309;
		background: rgba(255, 179, 39, 0.15);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		width: fit-content;
	}

	:global(.dark) .sub-badge {
		color: #ffb327;
	}

	.butterfly-title {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	/* COLOR SELECTOR BAR */
	.butterfly-color-bar {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.9rem 1.1rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 12px;
	}

	.color-bar-label {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-secondary);
	}

	.swatches-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.color-pill-btn {
		position: relative;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		padding: 0;
	}

	:global(.dark) .color-pill-btn {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.color-pill-btn:hover {
		transform: scale(1.15);
	}

	.color-pill-btn.is-active {
		border-color: var(--brand-emerald);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.35);
		transform: scale(1.1);
	}

	:global(.dark) .color-pill-btn.is-active {
		border-color: var(--brand-gold);
		box-shadow: 0 0 0 3px rgba(255, 179, 39, 0.35);
	}

	.custom-picker-pill {
		background: conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
		overflow: hidden;
	}

	.custom-picker-pill input[type="color"] {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}

	.picker-icon {
		font-size: 0.75rem;
		pointer-events: none;
		filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6));
	}

	.active-hex-code {
		font-family: monospace;
		font-size: 0.85rem;
		font-weight: 700;
		padding: 0.25rem 0.55rem;
		border-radius: 6px;
		background: var(--bg-secondary);
		color: var(--fg-primary);
		border: 1px solid var(--border);
		margin-left: 0.4rem;
	}

	@media (max-width: 860px) {
		.slogan-container {
			grid-template-columns: 1fr;
		}

		.download-brand-btn {
			width: 100%;
		}
	}
</style>
