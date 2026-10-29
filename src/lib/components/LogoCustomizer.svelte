<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import logoPaths from '$lib/assets/logo-paths.json';

	interface ColorOption {
		hex: string;
		name: string;
		textColor: string;
	}

	interface Props {
		brandColors: ColorOption[];
	}

	let { brandColors }: Props = $props();

	type BgShape = 'circle' | 'solid' | 'transparent';

	// Presets
	const PRESETS = [
		{
			id: 'canonical',
			nameUk: 'Канонічний',
			nameEn: 'Canonical',
			bgShape: 'circle' as BgShape,
			bgCircle: '#13371B',
			paw: '#FFFFFF',
			vetCrew: '#FFB327',
			hospital: '#598F3A'
		},
		{
			id: 'solid-emerald',
			nameUk: 'Суцільний смарагд',
			nameEn: 'Solid Emerald',
			bgShape: 'solid' as BgShape,
			bgCircle: '#13371B',
			paw: '#FFFFFF',
			vetCrew: '#FFB327',
			hospital: '#598F3A'
		},
		{
			id: 'transparent-gold',
			nameUk: 'Без тла (Золотий)',
			nameEn: 'Transparent (Gold)',
			bgShape: 'transparent' as BgShape,
			bgCircle: '#13371B',
			paw: '#13371B',
			vetCrew: '#FFB327',
			hospital: '#598F3A'
		},
		{
			id: 'light-theme',
			nameUk: 'Світла емблема',
			nameEn: 'Light Emblem',
			bgShape: 'circle' as BgShape,
			bgCircle: '#598F3A',
			paw: '#FFB327',
			vetCrew: '#E5E5E5',
			hospital: '#FFB327'
		},
		{
			id: 'monochrome-white',
			nameUk: 'Монохром (Білий)',
			nameEn: 'Monochrome (White)',
			bgShape: 'transparent' as BgShape,
			bgCircle: '#13371B',
			paw: '#FFFFFF',
			vetCrew: '#FFFFFF',
			hospital: '#FFFFFF'
		},
		{
			id: 'monochrome-dark',
			nameUk: 'Монохром (Темний)',
			nameEn: 'Monochrome (Dark)',
			bgShape: 'transparent' as BgShape,
			bgCircle: '#13371B',
			paw: '#262626',
			vetCrew: '#262626',
			hospital: '#262626'
		}
	];

	// Active configuration state
	let bgShape = $state<BgShape>('circle');
	let bgCircleColor = $state('#13371B');
	let pawColor = $state('#FFFFFF');
	let vetCrewColor = $state('#FFB327');
	let hospitalColor = $state('#598F3A');

	// Active group for color palette selection
	type TargetGroup = 'bgCircle' | 'paw' | 'vetCrew' | 'hospital';
	let activeGroup = $state<TargetGroup>('bgCircle');

	// Preview checkerboard background toggle
	let previewGrid = $state<'subtle' | 'dark' | 'light'>('subtle');

	function applyPreset(p: (typeof PRESETS)[0]) {
		bgShape = p.bgShape;
		bgCircleColor = p.bgCircle;
		pawColor = p.paw;
		vetCrewColor = p.vetCrew;
		hospitalColor = p.hospital;
	}

	function getCurrentColor(group: TargetGroup): string {
		switch (group) {
			case 'bgCircle':
				return bgCircleColor;
			case 'paw':
				return pawColor;
			case 'vetCrew':
				return vetCrewColor;
			case 'hospital':
				return hospitalColor;
		}
	}

	function setCurrentColor(group: TargetGroup, hex: string) {
		switch (group) {
			case 'bgCircle':
				bgCircleColor = hex;
				break;
			case 'paw':
				pawColor = hex;
				break;
			case 'vetCrew':
				vetCrewColor = hex;
				break;
			case 'hospital':
				hospitalColor = hex;
				break;
		}
	}

	// Dynamic SVG string generation for download and canvas export
	let svgString = $derived.by(() => {
		const bgElement =
			bgShape === 'circle'
				? `<circle id="bg-circle" cx="485.31" cy="485.31" r="461.76" fill="${bgCircleColor}"/>`
				: bgShape === 'solid'
				? `<rect id="bg-solid" x="0" y="0" width="970.62" height="970.62" fill="${bgCircleColor}"/>`
				: '';

		return `<svg id="vet-crew-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 970.62 970.62" width="970.62" height="970.62">
  <title>Vet Crew Hospital Logo</title>
  ${bgElement}
  <g id="logo-content" transform="translate(0, 6.15)">
    <g id="paw" fill="${pawColor}">
      <path id="paw-toe-right" d="${logoPaths['paw-toe-right'].d}"/>
      <path id="paw-toe-center-right" d="${logoPaths['paw-toe-center-right'].d}"/>
      <path id="paw-toe-center-left" d="${logoPaths['paw-toe-center-left'].d}"/>
      <path id="paw-toe-left" d="${logoPaths['paw-toe-left'].d}"/>
      <path id="paw-pad" d="${logoPaths['paw-pad'].d}"/>
    </g>
    <path id="text-vet-crew" fill="${vetCrewColor}" d="${logoPaths['text-vet-crew'].d}"/>
    <path id="text-hospital" fill="${hospitalColor}" d="${logoPaths['text-hospital'].d}"/>
  </g>
</svg>`;
	});

	function downloadSvg() {
		const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		const suffix = bgShape === 'circle' ? 'badge' : bgShape === 'solid' ? 'solid' : 'transparent';
		link.download = `VetCrewHospital-${suffix}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	let isExportingPng = $state(false);

	async function downloadPng() {
		if (typeof window === 'undefined') return;
		isExportingPng = true;

		try {
			const size = 1940; // High resolution 2x
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			if (bgShape === 'solid') {
				ctx.fillStyle = bgCircleColor;
				ctx.fillRect(0, 0, size, size);
			}

			const img = new Image();
			const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(svgBlob);

			await new Promise<void>((resolve, reject) => {
				img.onload = () => {
					ctx.drawImage(img, 0, 0, size, size);
					URL.revokeObjectURL(url);
					resolve();
				};
				img.onerror = reject;
				img.src = url;
			});

			canvas.toBlob((pngBlob) => {
				if (!pngBlob) return;
				const pngUrl = URL.createObjectURL(pngBlob);
				const link = document.createElement('a');
				link.href = pngUrl;
				const suffix = bgShape === 'circle' ? 'badge' : bgShape === 'solid' ? 'solid' : 'transparent';
				link.download = `VetCrewHospital-${suffix}-2x.png`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(pngUrl);
			}, 'image/png');
		} catch (e) {
			console.error('PNG export failed', e);
		} finally {
			isExportingPng = false;
		}
	}

	function isCustomColor(hex: string): boolean {
		const norm = hex.toLowerCase();
		return !brandColors.some((c) => c.hex.toLowerCase() === norm) && norm !== '#ffffff';
	}
</script>

<div class="logo-customizer">
	<!-- Top: Presets Toolbar -->
	<div class="presets-bar">
		<span class="bar-label">{langStore.current === 'uk' ? 'Швидкі шаблони:' : 'Presets:'}</span>
		<div class="presets-list">
			{#each PRESETS as p (p.id)}
				{@const isActive =
					bgShape === p.bgShape &&
					(p.bgShape === 'transparent' || bgCircleColor.toLowerCase() === p.bgCircle.toLowerCase()) &&
					pawColor.toLowerCase() === p.paw.toLowerCase() &&
					vetCrewColor.toLowerCase() === p.vetCrew.toLowerCase() &&
					hospitalColor.toLowerCase() === p.hospital.toLowerCase()}
				<button
					type="button"
					class="preset-chip"
					class:is-active={isActive}
					onclick={() => applyPreset(p)}
				>
					<span
						class="preset-dot"
						class:preset-dot--solid={p.bgShape === 'solid'}
						style:background-color={p.bgShape !== 'transparent' ? p.bgCircle : p.paw}
					></span>
					<span>{langStore.current === 'uk' ? p.nameUk : p.nameEn}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Main Workspace: Stage Preview + Control Panel -->
	<div class="customizer-workspace">
		<!-- Left: Visual Preview Stage -->
		<div class="preview-stage-wrap">
			<div class="stage-toolbar">
				<div class="grid-toggles">
					<span class="toolbar-sublabel">{langStore.current === 'uk' ? 'Тло прев\'ю:' : 'Stage:'}</span>
					<button
						type="button"
						class="grid-btn"
						class:is-active={previewGrid === 'subtle'}
						onclick={() => (previewGrid = 'subtle')}
						title={langStore.current === 'uk' ? 'Прозоре тло (сітка)' : 'Transparent checkerboard'}
						aria-label={langStore.current === 'uk' ? 'Прозоре тло (сітка)' : 'Transparent checkerboard'}
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect width="18" height="18" x="3" y="3" rx="2"/>
							<path d="M3 12h18M12 3v18"/>
						</svg>
					</button>
					<button
						type="button"
						class="grid-btn grid-btn--light"
						class:is-active={previewGrid === 'light'}
						onclick={() => (previewGrid = 'light')}
						title={langStore.current === 'uk' ? 'Світле тло' : 'Light background'}
						aria-label={langStore.current === 'uk' ? 'Світле тло' : 'Light background'}
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="4"/>
							<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
						</svg>
					</button>
					<button
						type="button"
						class="grid-btn grid-btn--dark"
						class:is-active={previewGrid === 'dark'}
						onclick={() => (previewGrid = 'dark')}
						title={langStore.current === 'uk' ? 'Темне тло' : 'Dark background'}
						aria-label={langStore.current === 'uk' ? 'Темне тло' : 'Dark background'}
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
						</svg>
					</button>
				</div>

				<div class="download-group">
					<button type="button" class="action-dl-btn" onclick={downloadSvg}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>SVG</span>
					</button>
					<button type="button" class="action-dl-btn primary" onclick={downloadPng} disabled={isExportingPng}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>{isExportingPng ? '...' : 'PNG (2x)'}</span>
					</button>
				</div>
			</div>

			<!-- Live SVG Viewport -->
			<div class="stage-viewport" class:grid--subtle={previewGrid === 'subtle'} class:grid--dark={previewGrid === 'dark'} class:grid--light={previewGrid === 'light'}>
				<svg
					id="interactive-custom-logo"
					viewBox="0 0 970.62 970.62"
					class="custom-svg-render"
					width="280"
					height="280"
				>
					{#if bgShape === 'circle'}
						<circle
							id="live-bg-circle"
							cx="485.31"
							cy="485.31"
							r="461.76"
							fill={bgCircleColor}
						/>
					{:else if bgShape === 'solid'}
						<rect
							id="live-bg-solid"
							x="0"
							y="0"
							width="970.62"
							height="970.62"
							rx="36"
							fill={bgCircleColor}
						/>
					{/if}

					<g id="live-logo-content" transform="translate(0, 6.15)">
						<g id="live-paw" fill={pawColor}>
							<path id="live-paw-toe-right" d={logoPaths['paw-toe-right'].d} />
							<path id="live-paw-toe-center-right" d={logoPaths['paw-toe-center-right'].d} />
							<path id="live-paw-toe-center-left" d={logoPaths['paw-toe-center-left'].d} />
							<path id="live-paw-toe-left" d={logoPaths['paw-toe-left'].d} />
							<path id="live-paw-pad" d={logoPaths['paw-pad'].d} />
						</g>
						<path id="live-text-vet-crew" fill={vetCrewColor} d={logoPaths['text-vet-crew'].d} />
						<path id="live-text-hospital" fill={hospitalColor} d={logoPaths['text-hospital'].d} />
					</g>
				</svg>
			</div>
		</div>

		<!-- Right: Element & Color Controls -->
		<div class="controls-panel">
			<!-- 1. Background Shape 3-Way Selector -->
			<div class="control-row bg-toggle-row">
				<div class="row-meta">
					<span class="control-title">{langStore.current === 'uk' ? 'Форма підкладки:' : 'Background Style:'}</span>
				</div>
				<div class="toggle-pill-wrap">
					<button
						type="button"
						class="pill-btn"
						class:is-active={bgShape === 'circle'}
						onclick={() => {
							bgShape = 'circle';
							activeGroup = 'bgCircle';
						}}
						title={langStore.current === 'uk' ? 'Канонічна кругла емблема' : 'Round emblem badge'}
					>
						<span class="pill-glyph">●</span>
						<span>{langStore.current === 'uk' ? 'Кругла' : 'Circle'}</span>
					</button>
					<button
						type="button"
						class="pill-btn"
						class:is-active={bgShape === 'solid'}
						onclick={() => {
							bgShape = 'solid';
							activeGroup = 'bgCircle';
						}}
						title={langStore.current === 'uk' ? 'Суцільна заливка артборду' : 'Full solid canvas fill'}
					>
						<span class="pill-glyph">■</span>
						<span>{langStore.current === 'uk' ? 'Суцільна' : 'Solid'}</span>
					</button>
					<button
						type="button"
						class="pill-btn"
						class:is-active={bgShape === 'transparent'}
						onclick={() => (bgShape = 'transparent')}
						title={langStore.current === 'uk' ? 'Без підкладки (прозорий фон)' : 'Transparent without fill'}
					>
						<span class="pill-glyph">◌</span>
						<span>{langStore.current === 'uk' ? 'Без фону' : 'No Fill'}</span>
					</button>
				</div>
			</div>

			<!-- 2. Target Element Selector Tabs -->
			<div class="element-tabs">
				<button
					type="button"
					class="element-tab"
					class:is-selected={activeGroup === 'bgCircle'}
					class:is-disabled={bgShape === 'transparent'}
					onclick={() => {
						if (bgShape === 'transparent') bgShape = 'circle';
						activeGroup = 'bgCircle';
					}}
				>
					<span
						class="tab-indicator"
						class:tab-indicator--solid={bgShape === 'solid'}
						style:background-color={bgShape !== 'transparent' ? bgCircleColor : 'transparent'}
					></span>
					<div class="tab-text">
						<span class="tab-name">
							{langStore.current === 'uk'
								? (bgShape === 'solid' ? 'Суцільний фон' : 'Коло основи')
								: (bgShape === 'solid' ? 'Solid Fill' : 'Base Circle')}
						</span>
						<code class="tab-hex">
							{bgShape !== 'transparent' ? bgCircleColor : (langStore.current === 'uk' ? 'Прозоре' : 'None')}
						</code>
					</div>
				</button>

				<button
					type="button"
					class="element-tab"
					class:is-selected={activeGroup === 'paw'}
					onclick={() => (activeGroup = 'paw')}
				>
					<span class="tab-indicator" style:background-color={pawColor}></span>
					<div class="tab-text">
						<span class="tab-name">{langStore.current === 'uk' ? 'Лапка' : 'Paw Print'}</span>
						<code class="tab-hex">{pawColor}</code>
					</div>
				</button>

				<button
					type="button"
					class="element-tab"
					class:is-selected={activeGroup === 'vetCrew'}
					onclick={() => (activeGroup = 'vetCrew')}
				>
					<span class="tab-indicator" style:background-color={vetCrewColor}></span>
					<div class="tab-text">
						<span class="tab-name">VET CREW</span>
						<code class="tab-hex">{vetCrewColor}</code>
					</div>
				</button>

				<button
					type="button"
					class="element-tab"
					class:is-selected={activeGroup === 'hospital'}
					onclick={() => (activeGroup = 'hospital')}
				>
					<span class="tab-indicator" style:background-color={hospitalColor}></span>
					<div class="tab-text">
						<span class="tab-name">HOSPITAL</span>
						<code class="tab-hex">{hospitalColor}</code>
					</div>
				</button>
			</div>

			<!-- 3. Color Picker Area for Selected Element -->
			<div class="color-palette-selector">
				<div class="palette-header">
					<span class="palette-title">
						{langStore.current === 'uk' ? 'Виберіть колір для:' : 'Choose color for:'}
						<strong>
							{#if activeGroup === 'bgCircle'}
								{langStore.current === 'uk'
									? (bgShape === 'solid' ? 'Суцільного фону' : 'Кола основи')
									: (bgShape === 'solid' ? 'Solid Background' : 'Circle Base')}
							{:else if activeGroup === 'paw'}
								{langStore.current === 'uk' ? 'Лапки' : 'Paw Print'}
							{:else if activeGroup === 'vetCrew'}
								«VET CREW»
							{:else if activeGroup === 'hospital'}
								«HOSPITAL»
							{/if}
						</strong>
					</span>
				</div>

				<div class="swatches-grid">
					{#each brandColors as c (c.hex)}
						<button
							type="button"
							class="color-swatch-btn"
							class:is-active={getCurrentColor(activeGroup).toLowerCase() === c.hex.toLowerCase()}
							style:background-color={c.hex}
							style:color={c.textColor}
							onclick={() => setCurrentColor(activeGroup, c.hex)}
							title="{c.name} ({c.hex})"
						>
							<span class="swatch-name">{c.name}</span>
							<code class="swatch-code">{c.hex}</code>
						</button>
					{/each}

					<!-- Special White swatch for quick access -->
					<button
						type="button"
						class="color-swatch-btn"
						class:is-active={getCurrentColor(activeGroup).toLowerCase() === '#ffffff'}
						style:background-color="#ffffff"
						style:color="#13371b"
						onclick={() => setCurrentColor(activeGroup, '#FFFFFF')}
						title="White (#FFFFFF)"
					>
						<span class="swatch-name">White</span>
						<code class="swatch-code">#FFFFFF</code>
					</button>

					<!-- Custom Color Picker -->
					<label
						class="color-swatch-btn custom-picker-btn"
						class:is-active={isCustomColor(getCurrentColor(activeGroup))}
						title={langStore.current === 'uk' ? 'Кастомний колір (палітра)' : 'Custom color picker'}
					>
						<input
							type="color"
							value={getCurrentColor(activeGroup)}
							oninput={(e) => setCurrentColor(activeGroup, (e.target as HTMLInputElement).value.toUpperCase())}
						/>
						<span class="swatch-name">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block; vertical-align:-2px; margin-right:4px;">
								<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
								<circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
								<circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
								<circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
								<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
							</svg>
							{langStore.current === 'uk' ? 'Кастом' : 'Custom'}
						</span>
						<code class="swatch-code">{getCurrentColor(activeGroup)}</code>
					</label>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.logo-customizer {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	/* PRESETS BAR */
	.presets-bar {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-wrap: wrap;
		padding: 0.85rem 1.25rem;
		background: var(--bg-secondary);
		border-radius: 14px;
		border: 1px solid var(--border);
	}

	.bar-label {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.presets-list {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.preset-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.75rem;
		border-radius: 20px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.preset-chip:hover {
		border-color: var(--brand-leaf);
		transform: translateY(-1px);
	}

	.preset-chip.is-active {
		border-color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.12);
		color: var(--brand-leaf);
	}

	.preset-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.preset-dot--solid {
		border-radius: 2px;
	}

	/* WORKSPACE */
	.customizer-workspace {
		display: grid;
		grid-template-columns: 360px 1fr;
		gap: 1.75rem;
		align-items: start;
	}

	/* LEFT STAGE */
	.preview-stage-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 1.25rem;
		padding: 1.25rem;
	}

	.stage-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.grid-toggles {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.toolbar-sublabel {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--fg-muted);
		margin-right: 0.2rem;
	}

	.grid-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.grid-btn.is-active {
		border-color: var(--brand-leaf);
		background: var(--brand-leaf);
		color: #ffffff;
	}

	.download-group {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.action-dl-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.65rem;
		border-radius: 8px;
		background: var(--border);
		color: var(--fg-primary);
		font-size: 0.76rem;
		font-weight: 700;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.action-dl-btn:hover {
		background: var(--panel-bg);
		border-color: var(--border-hover);
	}

	.action-dl-btn.primary {
		background: var(--brand-leaf);
		color: #ffffff;
	}

	.action-dl-btn.primary:hover {
		background: #46732c;
	}

	.stage-viewport {
		height: 320px;
		border-radius: 14px;
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: background 0.25s ease;
	}

	.stage-viewport.grid--subtle {
		background-color: var(--bg-secondary);
		background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.04) 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}

	.stage-viewport.grid--light {
		background: #ffffff;
	}

	.stage-viewport.grid--dark {
		background: #101511;
	}

	.custom-svg-render {
		max-width: 90%;
		max-height: 90%;
		filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.12));
		transition: transform 0.2s ease;
	}

	/* RIGHT CONTROLS PANEL */
	.controls-panel {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 1.25rem;
		padding: 1.5rem;
	}

	/* TOGGLE ROW */
	.control-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--border);
	}

	.row-meta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.control-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.toggle-pill-wrap {
		display: inline-flex;
		align-items: center;
		padding: 3px;
		background: var(--bg-secondary);
		border-radius: 10px;
		border: 1px solid var(--border);
		flex-shrink: 0;
	}

	.pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.15s ease;
	}

	.pill-glyph {
		font-size: 0.75rem;
		line-height: 1;
		opacity: 0.85;
	}

	.pill-btn.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.pill-btn.is-active .pill-glyph {
		color: var(--brand-leaf);
		opacity: 1;
	}

	/* ELEMENT TABS */
	.element-tabs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.65rem;
	}

	.element-tab {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.65rem 0.85rem;
		border-radius: 12px;
		background: var(--bg-secondary);
		border: 2px solid transparent;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.element-tab.is-selected {
		border-color: var(--brand-leaf);
		background: var(--panel-bg);
		box-shadow: 0 4px 16px rgba(89, 143, 58, 0.12);
	}

	.element-tab.is-disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.tab-indicator {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1.5px solid rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
		transition: border-radius 0.2s ease;
	}

	.tab-indicator--solid {
		border-radius: 4px;
	}

	.tab-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.tab-name {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tab-hex {
		font-size: 0.7rem;
		color: var(--fg-muted);
		font-family: monospace;
	}

	/* COLOR PALETTE SELECTOR */
	.color-palette-selector {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding-top: 0.5rem;
	}

	.palette-header {
		font-size: 0.86rem;
		color: var(--fg-secondary);
	}

	.palette-header strong {
		color: var(--fg-primary);
	}

	.swatches-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.65rem;
	}

	.color-swatch-btn {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.65rem;
		height: 64px;
		border-radius: 10px;
		border: 2px solid rgba(0, 0, 0, 0.1);
		cursor: pointer;
		position: relative;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
	}

	.color-swatch-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
	}

	.color-swatch-btn.is-active {
		border-color: #ffb327;
		box-shadow: 0 0 0 2px var(--panel-bg), 0 0 0 4px #ffb327;
		transform: scale(1.02);
	}

	.swatch-name {
		font-size: 0.72rem;
		font-weight: 700;
		text-align: left;
		line-height: 1.1;
	}

	.swatch-code {
		font-family: monospace;
		font-size: 0.68rem;
		opacity: 0.85;
		text-align: left;
	}

	/* Custom Picker Button */
	.custom-picker-btn {
		background: conic-gradient(from 180deg at 50% 50%, #FFB327 0deg, #93C84A 72deg, #598F3A 144deg, #13371B 216deg, #FFB327 360deg);
		color: #ffffff;
		cursor: pointer;
		overflow: hidden;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
	}

	.custom-picker-btn input[type='color'] {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	@media (max-width: 900px) {
		.customizer-workspace {
			grid-template-columns: 1fr;
		}

		.element-tabs {
			grid-template-columns: repeat(2, 1fr);
		}

		.swatches-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.control-row.bg-toggle-row {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.toggle-pill-wrap {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			width: 100%;
		}

		.pill-btn {
			padding: 0.45rem 0.25rem;
			font-size: 0.72rem;
			justify-content: center;
			text-align: center;
			gap: 0.2rem;
		}
	}
</style>

