<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import logoPaths from '$lib/assets/logo-paths.json';
	import vetcrewLogoPaths from '$lib/assets/vetcrew-logo-paths.json';
	import { logService } from '$lib/services/logService.svelte';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import PngDownloadBtn from '$lib/components/brand/PngDownloadBtn.svelte';
	import { DEFAULT_PNG_RESOLUTION, type PngResolution } from '$lib/data/pngResolutions';

	interface ColorOption {
		hex: string;
		name: string;
		textColor: string;
	}

	interface Props {
		brandColors?: ColorOption[];
		externalColor?: string;
		onElementChange?: (name: string, color: string) => void;
	}

	let { brandColors: _brandColors = [], externalColor, onElementChange }: Props = $props();

	type LogoVariant = 'hospital' | 'vetcrew';
	type BgShape = 'circle' | 'solid' | 'transparent';

	// Active logo variant state
	let activeVariant = $state<LogoVariant>('hospital');

	// Presets for Hospital Logo
	const PRESETS_HOSPITAL = [
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

	// Presets for Core VetCrew Logo (without Hospital)
	const PRESETS_VETCREW = [
		{
			id: 'canonical',
			nameUk: 'Канонічний',
			nameEn: 'Canonical',
			bgShape: 'circle' as BgShape,
			bgCircle: '#13371B',
			paw: '#FFFFFF',
			vetCrew: '#FFB327'
		},
		{
			id: 'solid-emerald',
			nameUk: 'Суцільний смарагд',
			nameEn: 'Solid Emerald',
			bgShape: 'solid' as BgShape,
			bgCircle: '#13371B',
			paw: '#FFFFFF',
			vetCrew: '#FFB327'
		},
		{
			id: 'transparent-gold',
			nameUk: 'Без тла (Золотий)',
			nameEn: 'Transparent (Gold)',
			bgShape: 'transparent' as BgShape,
			bgCircle: '#13371B',
			paw: '#13371B',
			vetCrew: '#FFB327'
		},
		{
			id: 'light-theme',
			nameUk: 'Світла емблема',
			nameEn: 'Light Emblem',
			bgShape: 'circle' as BgShape,
			bgCircle: '#598F3A',
			paw: '#FFB327',
			vetCrew: '#E5E5E5'
		},
		{
			id: 'monochrome-white',
			nameUk: 'Монохром (Білий)',
			nameEn: 'Monochrome (White)',
			bgShape: 'transparent' as BgShape,
			bgCircle: '#13371B',
			paw: '#FFFFFF',
			vetCrew: '#FFFFFF'
		},
		{
			id: 'monochrome-dark',
			nameUk: 'Монохром (Темний)',
			nameEn: 'Monochrome (Dark)',
			bgShape: 'transparent' as BgShape,
			bgCircle: '#13371B',
			paw: '#262626',
			vetCrew: '#262626'
		}
	];

	// Active configuration state
	let bgShape = $state<BgShape>('circle');
	let bgCircleColor = $state('#13371B');
	let pawColor = $state('#FFFFFF');
	let vetCrewColor = $state('#FFB327');
	let hospitalColor = $state('#598F3A');

	let currentPresets = $derived(activeVariant === 'hospital' ? PRESETS_HOSPITAL : PRESETS_VETCREW);

	// Active group for color palette selection
	type TargetGroup = 'bgCircle' | 'paw' | 'vetCrew' | 'hospital';
	let activeGroup = $state<TargetGroup>('bgCircle');

	// Preview background switcher (defaults to transparent checkerboard)
	let previewGrid = $state<StageTheme>('checker');

	function getGroupName(group: TargetGroup): string {
		switch (group) {
			case 'bgCircle':
				return bgShape === 'solid'
					? langStore.current === 'uk'
						? 'Суцільний фон'
						: 'Solid Background'
					: langStore.current === 'uk'
						? 'Коло основи'
						: 'Circle Base';
			case 'paw':
				return langStore.current === 'uk' ? 'Лапка' : 'Paw Print';
			case 'vetCrew':
				return '«VET CREW»';
			case 'hospital':
				return '«HOSPITAL»';
		}
	}

	function notifyElementChange() {
		onElementChange?.(getGroupName(activeGroup), getCurrentColor(activeGroup));
	}

	function selectGroup(group: TargetGroup) {
		activeGroup = group;
		notifyElementChange();
	}

	function setVariant(v: LogoVariant) {
		activeVariant = v;
		if (v === 'vetcrew' && activeGroup === 'hospital') {
			activeGroup = 'paw';
		}
		notifyElementChange();
	}

	function setShape(shape: BgShape) {
		bgShape = shape;
		if (shape === 'transparent' && activeGroup === 'bgCircle') {
			activeGroup = 'paw';
		}
		notifyElementChange();
	}

	function applyPreset(p: (typeof PRESETS_HOSPITAL)[0] | (typeof PRESETS_VETCREW)[0]) {
		bgShape = p.bgShape;
		bgCircleColor = p.bgCircle;
		pawColor = p.paw;
		vetCrewColor = p.vetCrew;
		if ('hospital' in p) {
			hospitalColor = p.hospital;
		}
		notifyElementChange();
	}

	function isPresetActive(p: (typeof PRESETS_HOSPITAL)[0] | (typeof PRESETS_VETCREW)[0]): boolean {
		if (bgShape !== p.bgShape) return false;
		if (p.bgShape !== 'transparent' && bgCircleColor.toLowerCase() !== p.bgCircle.toLowerCase())
			return false;
		if (pawColor.toLowerCase() !== p.paw.toLowerCase()) return false;
		if (vetCrewColor.toLowerCase() !== p.vetCrew.toLowerCase()) return false;
		if (activeVariant === 'hospital' && 'hospital' in p) {
			if (hospitalColor.toLowerCase() !== p.hospital.toLowerCase()) return false;
		}
		return true;
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

	let lastAppliedExternal = $state<string | null>(null);

	$effect(() => {
		if (
			externalColor &&
			externalColor !== lastAppliedExternal &&
			externalColor.toUpperCase() !== getCurrentColor(activeGroup).toUpperCase()
		) {
			lastAppliedExternal = externalColor;
			setCurrentColor(activeGroup, externalColor);
		}
	});

	$effect(() => {
		notifyElementChange();
	});

	// Dynamic SVG string generation for download and canvas export
	let svgString = $derived.by(() => {
		if (activeVariant === 'hospital') {
			const bgElement =
				bgShape === 'circle'
					? `<circle id="bg-circle" cx="485.31" cy="485.31" r="461.76" fill="${bgCircleColor}"/>`
					: bgShape === 'solid'
						? `<rect id="bg-solid" x="0" y="0" width="970.62" height="970.62" rx="36" fill="${bgCircleColor}"/>`
						: '';

			return `<svg id="vet-crew-hospital-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 970.62 970.62" width="970.62" height="970.62">
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
		} else {
			const bgElement =
				bgShape === 'circle'
					? `<circle id="bg-circle" cx="2048" cy="2048" r="1948.6" fill="${bgCircleColor}"/>`
					: bgShape === 'solid'
						? `<rect id="bg-solid" x="0" y="0" width="4096" height="4096" rx="152" fill="${bgCircleColor}"/>`
						: '';

			return `<svg id="vet-crew-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4096 4096" width="4096" height="4096">
  <title>Vet Crew Logo</title>
  ${bgElement}
  <g id="vet-crew-content">
    <g id="paw" fill="${pawColor}">
      <path id="paw-toe-left" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-left']}"/>
      <path id="paw-toe-center-left" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-center-left']}"/>
      <path id="paw-toe-center-right" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-center-right']}"/>
      <path id="paw-toe-right" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-right']}"/>
      <path id="paw-pad" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-pad']}"/>
    </g>
    <path id="text-vet-crew" fill-rule="evenodd" fill="${vetCrewColor}" d="${vetcrewLogoPaths.paths['text-vet-crew']}"/>
  </g>
</svg>`;
		}
	});

	function downloadSvg() {
		const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		const prefix = activeVariant === 'hospital' ? 'VetCrewHospital' : 'VetCrew';
		const suffix = bgShape === 'circle' ? 'badge' : bgShape === 'solid' ? 'solid' : 'transparent';
		link.download = `${prefix}-${suffix}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	let isExportingPng = $state(false);

	async function downloadPng(res: PngResolution = DEFAULT_PNG_RESOLUTION) {
		if (!browser) return;
		isExportingPng = true;

		try {
			const size = res.px;
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
				const prefix = activeVariant === 'hospital' ? 'VetCrewHospital' : 'VetCrew';
				const suffix =
					bgShape === 'circle' ? 'badge' : bgShape === 'solid' ? 'solid' : 'transparent';
				link.download = `${prefix}-${suffix}-${res.label}.png`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(pngUrl);
			}, 'image/png');
		} catch (e) {
			logService.error('brand', 'PNG export failed', e);
		} finally {
			isExportingPng = false;
		}
	}
</script>

<div class="logo-customizer">
	<!-- 0. Brand Logo Variant Switcher -->
	<div class="variant-bar">
		<div class="variant-meta">
			<span class="variant-label"
				>{langStore.current === 'uk' ? 'Версія логотипу:' : 'Logo Version:'}</span
			>
		</div>
		<div
			class="variant-toggle-pills"
			role="tablist"
			aria-label={langStore.current === 'uk' ? 'Вибір логотипу' : 'Choose Logo Variant'}
		>
			<button
				type="button"
				role="tab"
				aria-selected={activeVariant === 'hospital'}
				class="variant-pill"
				class:is-active={activeVariant === 'hospital'}
				onclick={() => setVariant('hospital')}
			>
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path
						d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
					/>
					<path d="M12 9v4" />
					<path d="M10 11h4" />
				</svg>
				<span>Vet Crew Hospital</span>
				<span class="variant-badge">{langStore.current === 'uk' ? 'Шпиталь' : 'Hospital'}</span>
			</button>

			<button
				type="button"
				role="tab"
				aria-selected={activeVariant === 'vetcrew'}
				class="variant-pill"
				class:is-active={activeVariant === 'vetcrew'}
				onclick={() => setVariant('vetcrew')}
			>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 10.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-5.5-1c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm11 0c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm-8.8 6.5c-.75-.62-1.7-1-2.7-1-2.21 0-4 1.79-4 4 0 2.5 3 5 7 5 1.15 0 2.18-.32 3-.88-.82-.56-1.85-.88-3-.88-.28 0-.55.03-.82.08-.34-.73-.48-1.55-.48-2.32 0-1.53.5-2.88 1-4zm10.6 0c.5 1.12 1 2.47 1 4 0 .77-.14 1.59-.48 2.32-.27-.05-.54-.08-.82-.08-1.15 0-2.18.32-3 .88 4 0 7-2.5 7-5 0-2.21-1.79-4-4-4-1 0-1.95.38-2.7 1z"
					/>
				</svg>
				<span>{langStore.current === 'uk' ? 'Vet Crew (Основний)' : 'Vet Crew (Primary)'}</span>
				<span class="variant-badge">{langStore.current === 'uk' ? 'Бренд' : 'Brand'}</span>
			</button>
		</div>
	</div>

	<!-- Top: Presets Toolbar -->
	<div class="presets-bar">
		<span class="bar-label">{langStore.current === 'uk' ? 'Швидкі шаблони:' : 'Presets:'}</span>
		<div class="presets-list">
			{#each currentPresets as p (p.id)}
				{@const isActive = isPresetActive(p)}
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
				<StageBgSwitcher bind:current={previewGrid} />
			</div>

			<!-- Live SVG Viewport -->
			<div class="stage-viewport stage--{previewGrid}">
				{#if activeVariant === 'hospital'}
					<svg
						id="interactive-custom-logo-hospital"
						viewBox="0 0 970.62 970.62"
						class="custom-svg-render"
						width="280"
						height="280"
					>
						{#if bgShape === 'circle'}
							<circle id="live-bg-circle" cx="485.31" cy="485.31" r="461.76" fill={bgCircleColor} />
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
				{:else}
					<svg
						id="interactive-custom-logo-vetcrew"
						viewBox="0 0 4096 4096"
						class="custom-svg-render"
						width="280"
						height="280"
					>
						{#if bgShape === 'circle'}
							<circle id="live-bg-circle-vc" cx="2048" cy="2048" r="1948.6" fill={bgCircleColor} />
						{:else if bgShape === 'solid'}
							<rect
								id="live-bg-solid-vc"
								x="0"
								y="0"
								width="4096"
								height="4096"
								rx="152"
								fill={bgCircleColor}
							/>
						{/if}

						<g id="live-vetcrew-content">
							<g id="live-paw-vc" fill={pawColor}>
								<path
									id="live-paw-toe-left-vc"
									fill-rule="evenodd"
									d={vetcrewLogoPaths.paths['paw-toe-left']}
								/>
								<path
									id="live-paw-toe-center-left-vc"
									fill-rule="evenodd"
									d={vetcrewLogoPaths.paths['paw-toe-center-left']}
								/>
								<path
									id="live-paw-toe-center-right-vc"
									fill-rule="evenodd"
									d={vetcrewLogoPaths.paths['paw-toe-center-right']}
								/>
								<path
									id="live-paw-toe-right-vc"
									fill-rule="evenodd"
									d={vetcrewLogoPaths.paths['paw-toe-right']}
								/>
								<path
									id="live-paw-pad-vc"
									fill-rule="evenodd"
									d={vetcrewLogoPaths.paths['paw-pad']}
								/>
							</g>
							<path
								id="live-text-vet-crew-vc"
								fill-rule="evenodd"
								fill={vetCrewColor}
								d={vetcrewLogoPaths.paths['text-vet-crew']}
							/>
						</g>
					</svg>
				{/if}
			</div>

			<!-- Bottom Download Action Buttons -->
			<div class="stage-actions">
				<button
					type="button"
					class="action-dl-btn svg-btn"
					onclick={downloadSvg}
					title={langStore.current === 'uk' ? 'Завантажити векторний SVG' : 'Download SVG'}
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
				</button>

				<PngDownloadBtn
					onselect={downloadPng}
					isDownloading={isExportingPng}
					btnClass="action-dl-btn"
				/>
			</div>
		</div>

		<!-- Right: Element & Color Controls -->
		<div class="controls-panel">
			<!-- 1. Background Shape 3-Way Selector -->
			<div class="control-row bg-toggle-row">
				<div class="row-meta">
					<span class="control-title"
						>{langStore.current === 'uk' ? 'Форма підкладки:' : 'Background Style:'}</span
					>
				</div>
				<div class="toggle-pill-wrap">
					<button
						type="button"
						class="pill-btn"
						class:is-active={bgShape === 'circle'}
						onclick={() => {
							setShape('circle');
							selectGroup('bgCircle');
						}}
						title={langStore.current === 'uk' ? 'Канонічна кругла емблема' : 'Round emblem badge'}
					>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="pill-icon"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="9" />
						</svg>
						<span>{langStore.current === 'uk' ? 'Кругла' : 'Circle'}</span>
					</button>
					<button
						type="button"
						class="pill-btn"
						class:is-active={bgShape === 'solid'}
						onclick={() => {
							setShape('solid');
							selectGroup('bgCircle');
						}}
						title={langStore.current === 'uk'
							? 'Суцільна заливка артборду'
							: 'Full solid canvas fill'}
					>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="pill-icon"
							aria-hidden="true"
						>
							<rect x="3" y="3" width="18" height="18" rx="4" />
						</svg>
						<span>{langStore.current === 'uk' ? 'Суцільна' : 'Solid'}</span>
					</button>
					<button
						type="button"
						class="pill-btn"
						class:is-active={bgShape === 'transparent'}
						onclick={() => setShape('transparent')}
						title={langStore.current === 'uk'
							? 'Без підкладки (прозорий фон)'
							: 'Transparent without fill'}
					>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-dasharray="3.5 2.5"
							stroke-linecap="round"
							class="pill-icon"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="8.75" />
						</svg>
						<span>{langStore.current === 'uk' ? 'Без фону' : 'No Fill'}</span>
					</button>
				</div>
			</div>

			<!-- 2. Target Element Selector Tabs -->
			<div class="element-tabs" class:element-tabs--three={activeVariant === 'vetcrew'}>
				<button
					type="button"
					class="element-tab"
					class:is-selected={activeGroup === 'bgCircle'}
					class:is-disabled={bgShape === 'transparent'}
					onclick={() => {
						if (bgShape === 'transparent') setShape('circle');
						selectGroup('bgCircle');
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
								? bgShape === 'solid'
									? 'Суцільний фон'
									: 'Коло основи'
								: bgShape === 'solid'
									? 'Solid Fill'
									: 'Base Circle'}
						</span>
						<code class="tab-hex">
							{bgShape !== 'transparent'
								? bgCircleColor
								: langStore.current === 'uk'
									? 'Прозоре'
									: 'None'}
						</code>
					</div>
				</button>

				<button
					type="button"
					class="element-tab"
					class:is-selected={activeGroup === 'paw'}
					onclick={() => selectGroup('paw')}
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
					onclick={() => selectGroup('vetCrew')}
				>
					<span class="tab-indicator" style:background-color={vetCrewColor}></span>
					<div class="tab-text">
						<span class="tab-name">VET CREW</span>
						<code class="tab-hex">{vetCrewColor}</code>
					</div>
				</button>

				{#if activeVariant === 'hospital'}
					<button
						type="button"
						class="element-tab"
						class:is-selected={activeGroup === 'hospital'}
						onclick={() => selectGroup('hospital')}
					>
						<span class="tab-indicator" style:background-color={hospitalColor}></span>
						<div class="tab-text">
							<span class="tab-name">HOSPITAL</span>
							<code class="tab-hex">{hospitalColor}</code>
						</div>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.logo-customizer {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
	}

	/* VARIANT SWITCHER BAR */
	.variant-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1.25rem;
		background: var(--bg-secondary);
		border-radius: 14px;
		border: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.variant-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.variant-label {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.variant-toggle-pills {
		display: inline-flex;
		align-items: center;
		padding: 4px;
		background: var(--panel-bg);
		border-radius: 12px;
		border: 1px solid var(--border);
		gap: 4px;
		flex-wrap: wrap;
	}

	.variant-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.95rem;
		border-radius: 9px;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.variant-pill:hover {
		color: var(--fg-primary);
		background: rgba(89, 143, 58, 0.08);
	}

	.variant-pill.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 2px 8px rgba(19, 55, 27, 0.22);
	}

	:global(.dark) .variant-pill.is-active {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 2px 8px rgba(255, 179, 39, 0.25);
	}

	.variant-badge {
		font-size: 0.68rem;
		padding: 0.12rem 0.4rem;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.08);
		color: inherit;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.variant-pill.is-active .variant-badge {
		background: rgba(255, 255, 255, 0.22);
	}

	:global(.dark) .variant-pill.is-active .variant-badge {
		background: rgba(16, 30, 20, 0.18);
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
		justify-content: flex-start;
		gap: 0.5rem;
	}

	.stage-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.65rem;
		margin-top: 0.25rem;
	}

	.action-dl-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.55rem 0.85rem;
		border-radius: 8px;
		font-size: 0.76rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.18s ease;
		text-align: center;
		white-space: nowrap;
		background: rgba(19, 55, 27, 0.08);
		border: 1px solid rgba(19, 55, 27, 0.22);
		color: var(--brand-emerald, #13371b);
	}

	.action-dl-btn:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .action-dl-btn,
	:global(.dark) .action-dl-btn {
		background: rgba(255, 179, 39, 0.12);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .action-dl-btn:hover:not(:disabled),
	:global(.dark) .action-dl-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	.action-dl-btn:disabled {
		opacity: 0.55;
		cursor: wait;
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

	.pill-icon {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
		opacity: 0.75;
		transition: all 0.15s ease;
	}

	.pill-btn.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.pill-btn.is-active .pill-icon {
		color: var(--brand-emerald, #13371b);
		opacity: 1;
	}

	:global(.dark) .pill-btn.is-active .pill-icon {
		color: var(--brand-gold, #ffb327);
	}

	/* ELEMENT TABS */
	.element-tabs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.65rem;
		transition: grid-template-columns 0.2s ease;
	}

	.element-tabs--three {
		grid-template-columns: repeat(3, 1fr);
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

	@media (max-width: 900px) {
		.customizer-workspace {
			grid-template-columns: 1fr;
		}

		.element-tabs {
			grid-template-columns: repeat(2, 1fr);
		}

		.element-tabs--three {
			grid-template-columns: repeat(3, 1fr);
		}

		.swatches-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.variant-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.variant-toggle-pills {
			display: grid;
			grid-template-columns: 1fr 1fr;
			width: 100%;
		}

		.variant-pill {
			justify-content: center;
			padding: 0.45rem 0.5rem;
			font-size: 0.75rem;
		}

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

		.element-tabs--three {
			grid-template-columns: 1fr;
		}
	}
</style>
