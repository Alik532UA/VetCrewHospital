<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { downloadUrlAsPng } from '$lib/utils/exportPng';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';

	type SignFormat = 'composite' | 'icon' | 'text';

	interface SignItem {
		id: string;
		num: string;
		titleUk: string;
		titleEn: string;
		file: string;
	}

	const COMPOSITE_PLAQUES: SignItem[] = [
		{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception Desk', file: 'reception.svg' },
		{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Vet Crew Shop', file: 'pet-shop.svg' },
		{ id: 'hospital', num: '03', titleUk: 'Стаціонар', titleEn: 'Inpatient Hospital', file: 'hospital.svg' },
		{ id: 'surgery', num: '04', titleUk: 'Операційна', titleEn: 'Surgery Room', file: 'surgery.svg' },
		{ id: 'procedures', num: '05', titleUk: 'Процедурна', titleEn: 'Procedure Room', file: 'procedures.svg' },
		{ id: 'consultation', num: '06', titleUk: 'Приймальний кабінет', titleEn: 'Examination Room', file: 'consultation.svg' },
		{ id: 'laboratory', num: '07', titleUk: 'Лабораторія', titleEn: 'Clinical Laboratory', file: 'laboratory.svg' }
	];

	const TEXT_PLAQUES: SignItem[] = [
		{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception Desk', file: 'reception.svg' },
		{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Vet Crew Shop', file: 'pet-shop.svg' },
		{ id: 'hospital', num: '03', titleUk: 'Стаціонар', titleEn: 'Inpatient Hospital', file: 'hospital.svg' },
		{ id: 'surgery', num: '04', titleUk: 'Операційна', titleEn: 'Surgery Room', file: 'surgery.svg' },
		{ id: 'procedures', num: '05', titleUk: 'Процедурна', titleEn: 'Procedure Room', file: 'procedures.svg' },
		{ id: 'consultation', num: '06', titleUk: 'Приймальний кабінет', titleEn: 'Examination Room', file: 'consultation.svg' },
		{ id: 'laboratory', num: '07', titleUk: 'Лабораторія', titleEn: 'Clinical Laboratory', file: 'laboratory.svg' }
	];

	const ICON_PLAQUES: SignItem[] = [
		{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception & Waiting', file: 'reception.svg' },
		{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Pet Shop & Gear', file: 'pet-shop.svg' },
		{ id: 'pharmacy', num: '03', titleUk: 'Ветеринарна аптека', titleEn: 'Veterinary Pharmacy', file: 'pharmacy.svg' },
		{ id: 'herpetology', num: '04', titleUk: 'Герпетологія (Рептилії)', titleEn: 'Herpetology Department', file: 'herpetology.svg' },
		{ id: 'ornithology', num: '05', titleUk: 'Орнітологія (Птахи)', titleEn: 'Ornithology Department', file: 'ornithology.svg' },
		{ id: 'surgery', num: '06', titleUk: 'Хірургічний блок', titleEn: 'Surgical Suite', file: 'surgery.svg' },
		{ id: 'hospital', num: '07', titleUk: 'Цілодобовий стаціонар', titleEn: '24/7 Inpatient Care', file: 'hospital.svg' },
		{ id: 'laboratory', num: '08', titleUk: 'Клінічна лабораторія', titleEn: 'Clinical Laboratory', file: 'laboratory.svg' }
	];

	const BRAND_COLORS = [
		{ hex: '#13371B', name: 'Dark Green', textColor: '#ffffff' },
		{ hex: '#598F3A', name: 'Main Green', textColor: '#ffffff' },
		{ hex: '#93C84A', name: 'Light Green', textColor: '#101e14' },
		{ hex: '#FFB327', name: 'Brand Gold', textColor: '#101e14' },
		{ hex: '#E5E5E5', name: 'Light Gray', textColor: '#101e14' },
		{ hex: '#262626', name: 'Dark Gray', textColor: '#ffffff' },
		{ hex: '#FFFFFF', name: 'Pure White', textColor: '#13371b' }
	];

	// Unified controls state
	let currentFormat = $state<SignFormat>('composite');
	let customSelectedColor = $state<string | null>(null);
	let signColor = $derived(
		customSelectedColor ?? (themeStore.current === 'dark' ? '#93C84A' : '#13371B')
	);
	let stageTheme = $state<StageTheme>('checker');
	let isDownloading = $state<string | null>(null);

	let currentList = $derived(
		currentFormat === 'composite'
			? COMPOSITE_PLAQUES
			: currentFormat === 'text'
			? TEXT_PLAQUES
			: ICON_PLAQUES
	);

	function getAssetUrl(item: SignItem): string {
		if (currentFormat === 'composite') {
			return `${base}/brand/signage/composite/${item.file}`;
		} else if (currentFormat === 'text') {
			return `${base}/brand/signage/text/${item.file}`;
		} else {
			// For icon, clean 13371B master icon
			return `${base}/brand/signage/icons/13371B/${item.file}`;
		}
	}

	async function downloadColoredSignSvg(e: MouseEvent, item: SignItem) {
		e.preventDefault();
		isDownloading = item.id;
		try {
			const url = getAssetUrl(item);
			const res = await fetch(url);
			let svgText = await res.text();

			// Replace color in style tag (fill: #13371b) and inline attributes
			svgText = svgText.replace(/fill:\s*#[0-9a-fA-F]{6}/g, `fill: ${signColor}`);
			svgText = svgText.replace(/fill="(?!(?:none))#[0-9a-fA-F]{6}"/g, `fill="${signColor}"`);

			const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
			const downloadUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			const formatLabel =
				currentFormat === 'composite' ? 'Іконка+Напис' : currentFormat === 'text' ? 'Тільки напис' : 'Іконка';
			link.download = `${item.num} - ${item.titleUk} (${formatLabel}, ${signColor}).svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(downloadUrl);
		} catch (err) {
			console.error('Download error:', err);
		} finally {
			isDownloading = null;
		}
	}

	async function downloadColoredSignPng(e: MouseEvent, item: SignItem) {
		e.preventDefault();
		isDownloading = `${item.id}-png`;
		try {
			const url = getAssetUrl(item);
			const formatLabel =
				currentFormat === 'composite' ? 'Іконка+Напис' : currentFormat === 'text' ? 'Тільки напис' : 'Іконка';
			await downloadUrlAsPng(
				url,
				`${item.num} - ${item.titleUk} (${formatLabel}, ${signColor}).png`,
				2000,
				(svgText) => {
					svgText = svgText.replace(/fill:\s*#[0-9a-fA-F]{6}/g, `fill: ${signColor}`);
					svgText = svgText.replace(/fill="(?!(?:none))#[0-9a-fA-F]{6}"/g, `fill="${signColor}"`);
					return svgText;
				}
			);
		} catch (err) {
			console.error('Download PNG error:', err);
		} finally {
			isDownloading = null;
		}
	}
</script>

<div class="door-signage-widget">
	<!-- UNIFIED CONTROL TOOLBAR -->
	<div class="unified-controls-panel">
		<!-- ROW 1: Format Selector -->
		<div class="control-row format-row">
			<div class="control-label-group">
				<span class="control-title">{langStore.current === 'uk' ? 'Формат навігації:' : 'Signage Layout:'}</span>
			</div>

			<div class="format-pill-tabs">
				<button
					type="button"
					class="format-tab-btn"
					class:is-active={currentFormat === 'composite'}
					onclick={() => (currentFormat = 'composite')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/>
						<path d="M2 20h20"/>
						<path d="M14 12v.01"/>
					</svg>
					<span>{langStore.current === 'uk' ? 'Іконка + напис' : 'Icon + Text'}</span>
				</button>
				<button
					type="button"
					class="format-tab-btn"
					class:is-active={currentFormat === 'icon'}
					onclick={() => (currentFormat = 'icon')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 6v4"/>
						<path d="M14 14h-4"/>
						<path d="M14 18h-4"/>
						<path d="M14 8h-4"/>
						<path d="M18 12h-4"/>
						<rect width="16" height="20" x="4" y="2" rx="2"/>
						<path d="M10 22v-4h4v4"/>
					</svg>
					<span>{langStore.current === 'uk' ? 'Тільки іконка' : 'Icon Only'}</span>
				</button>
				<button
					type="button"
					class="format-tab-btn"
					class:is-active={currentFormat === 'text'}
					onclick={() => (currentFormat = 'text')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="4 7 4 4 20 4 20 7"/>
						<line x1="9" x2="15" y1="20" y2="20"/>
						<line x1="12" x2="12" y1="4" y2="20"/>
					</svg>
					<span>{langStore.current === 'uk' ? 'Тільки напис' : 'Text Only'}</span>
				</button>
			</div>
		</div>

		<!-- ROW 2: Interactive Color Palette + Background Stage -->
		<div class="control-row styling-row">
			<!-- Color Picker (as in 24 Animals) -->
			<div class="color-picker-box">
				<div class="color-label-wrap">
					<span class="control-title">{langStore.current === 'uk' ? 'Колір табличок:' : 'Sign Color:'}</span>
					<code class="active-hex-badge">{signColor}</code>
				</div>

				<div class="colors-palette-wrap">
					{#each BRAND_COLORS as c (c.hex)}
						<button
							type="button"
							class="color-pill-btn"
							class:is-active={signColor.toUpperCase() === c.hex.toUpperCase()}
							style:background-color={c.hex}
							onclick={() => (customSelectedColor = c.hex)}
							title="{c.name} ({c.hex})"
							aria-label="{c.name} ({c.hex})"
						>
							{#if signColor.toUpperCase() === c.hex.toUpperCase()}
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<polyline points="20 6 9 17 4 12"/>
								</svg>
							{/if}
						</button>
					{/each}

					<!-- Custom HTML5 Color Picker -->
					<label
						class="color-pill-btn custom-picker-pill"
						class:is-active={!BRAND_COLORS.some((c) => c.hex.toUpperCase() === signColor.toUpperCase())}
						title={langStore.current === 'uk' ? 'Власний колір (палітра)' : 'Custom color'}
					>
						<input
							type="color"
							value={signColor}
							oninput={(e) => (customSelectedColor = (e.target as HTMLInputElement).value.toUpperCase())}
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
				</div>
			</div>

			<!-- Stage Background Switcher -->
			<StageBgSwitcher bind:current={stageTheme} />
		</div>
	</div>

	<!-- SIGNS GRID -->
	<div
		class="signage-grid"
		class:grid--composite={currentFormat === 'composite'}
		class:grid--text={currentFormat === 'text'}
		class:grid--icon={currentFormat === 'icon'}
	>
		{#each currentList as item (item.id)}
			{@const assetUrl = getAssetUrl(item)}
			<div class="sign-card" class:sign-card--icon={currentFormat === 'icon'}>
				<!-- Card Header -->
				<div class="sign-card-header">
					<span class="sign-num">#{item.num}</span>
					<div class="sign-titles">
						<span class="sign-name-uk">{item.titleUk}</span>
						<span class="sign-name-en">{item.titleEn}</span>
					</div>
				</div>

				<!-- Live Preview Stage with dynamic color mask -->
				<div
					class="sign-preview-stage stage--{stageTheme}"
					class:stage--compact={currentFormat === 'text'}
					class:stage--square={currentFormat === 'icon'}
				>
					<div
						class="sign-svg-mask"
						style:background-color={signColor}
						style:--mask-url="url('{assetUrl}')"
						aria-label="{item.titleUk}"
					></div>
				</div>

				<!-- Download Action Button with injected color -->
				<div class="sign-card-footer">
					<button
						type="button"
						class="download-sign-btn svg-btn"
						onclick={(e) => downloadColoredSignSvg(e, item)}
						disabled={isDownloading === item.id}
						title="{langStore.current === 'uk' ? `Завантажити SVG у кольорі ${signColor}` : `Download SVG in ${signColor}`}"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>
							{isDownloading === item.id
								? '...'
								: langStore.current === 'uk'
								? `SVG (${signColor})`
								: `SVG (${signColor})`}
						</span>
					</button>

					<button
						type="button"
						class="download-sign-btn png-btn"
						onclick={(e) => downloadColoredSignPng(e, item)}
						disabled={isDownloading === `${item.id}-png`}
						title="{langStore.current === 'uk' ? `Завантажити PNG (2000 px) у кольорі ${signColor}` : `Download PNG (2000 px) in ${signColor}`}"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>
							{isDownloading === `${item.id}-png`
								? '...'
								: 'PNG (2000 px)'}
						</span>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.door-signage-widget {
		display: flex;
		flex-direction: column;
		gap: 1.8rem;
		width: 100%;
	}

	/* UNIFIED CONTROLS PANEL */
	.unified-controls-panel {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		padding: 1.4rem;
		border-radius: 18px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
	}

	.control-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.2rem;
		flex-wrap: wrap;
	}

	.format-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-bottom: 1.1rem;
		border-bottom: 1px solid var(--border);
	}

	.format-group {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.control-label-group {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.control-title {
		font-size: 0.85rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-primary);
	}

	/* FORMAT TABS */
	.format-pill-tabs {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--panel-bg);
		padding: 0.35rem;
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	.format-tab-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--fg-secondary);
		font-size: 0.86rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.format-tab-btn:hover {
		color: var(--fg-primary);
		background: var(--bg-secondary);
	}

	.format-tab-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 2px 8px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .format-tab-btn.is-active,
	:global(.dark) .format-tab-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
		box-shadow: 0 2px 8px rgba(89, 143, 58, 0.25);
	}

	/* STYLING ROW: PALETTE + STAGE */
	.styling-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.2rem;
		flex-wrap: wrap;
	}

	.color-picker-box {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.color-label-wrap {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.active-hex-badge {
		font-family: monospace;
		font-size: 0.8rem;
		font-weight: 700;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		background: var(--panel-bg);
		color: var(--fg-primary);
		border: 1px solid var(--border);
	}

	.colors-palette-wrap {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.color-pill-btn {
		position: relative;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 2px solid rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	:global([data-theme='dark']) .color-pill-btn,
	:global(.dark) .color-pill-btn {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.color-pill-btn:hover {
		transform: scale(1.15);
	}

	.color-pill-btn.is-active {
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.45);
		transform: scale(1.15);
	}

	:global([data-theme='dark']) .color-pill-btn.is-active,
	:global(.dark) .color-pill-btn.is-active {
		border-color: var(--brand-gold);
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
		background: conic-gradient(from 0deg at 50% 50%, #FF0000 0deg, #FFA500 51deg, #FFFF00 102deg, #008000 153deg, #0000FF 204deg, #4B0082 255deg, #EE82EE 306deg, #FF0000 360deg);
		z-index: 0;
	}

	.custom-picker-pill input[type="color"] {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.picker-icon {
		position: relative;
		z-index: 1;
		font-size: 0.75rem;
		pointer-events: none;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.85));
	}

	/* SIGNS GRID */
	.signage-grid {
		display: grid;
		gap: 1.4rem;
	}

	.grid--composite,
	.grid--text {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.grid--icon {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	@media (max-width: 960px) {
		.grid--composite,
		.grid--text {
			grid-template-columns: 1fr;
		}

		.grid--icon {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 540px) {
		.grid--icon {
			grid-template-columns: 1fr;
		}
	}

	/* CARD */
	.sign-card {
		display: flex;
		flex-direction: column;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.25s ease;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
	}

	.sign-card:hover {
		border-color: var(--border-hover);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.07);
		transform: translateY(-2px);
	}

	.sign-card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
	}

	.sign-num {
		font-family: monospace;
		font-size: 0.76rem;
		font-weight: 800;
		color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.12);
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
	}

	.sign-titles {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		overflow: hidden;
	}

	.sign-name-uk {
		font-size: 1rem;
		font-weight: 800;
		color: var(--fg-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sign-name-en {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* PREVIEW STAGE */
	.sign-preview-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.8rem 1.4rem;
		min-height: 160px;
		position: relative;
		transition: background 0.25s ease;
	}

	.sign-preview-stage.stage--compact {
		min-height: 120px;
		padding: 1.2rem;
	}

	.sign-preview-stage.stage--square {
		min-height: 200px;
		padding: 2rem;
	}

	.stage--light {
		background: #ffffff;
	}

	.stage--emerald {
		background: #13371b;
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

	.sign-svg-mask {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 140px;
		-webkit-mask: var(--mask-url) no-repeat center / contain;
		mask: var(--mask-url) no-repeat center / contain;
		transition: background-color 0.2s ease, transform 0.2s ease;
	}

	.stage--square .sign-svg-mask {
		max-height: 160px;
	}

	.sign-card:hover .sign-svg-mask {
		transform: scale(1.03);
	}

	/* FOOTER ACTION */
	.sign-card-footer {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		padding: 0.85rem 1rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
		margin-top: auto;
	}

	.download-sign-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		width: 100%;
		padding: 0.55rem 0.5rem;
		border-radius: 8px;
		font-size: 0.76rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.18s ease;
		text-align: center;
		white-space: nowrap;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
	}

	.download-sign-btn:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.2);
	}

	:global([data-theme='dark']) .download-sign-btn:hover:not(:disabled),
	:global(.dark) .download-sign-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 12px rgba(255, 179, 39, 0.25);
	}

	.download-sign-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}
</style>
