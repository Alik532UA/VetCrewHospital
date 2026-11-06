<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import { logService } from '$lib/services/logService.svelte';
	import { downloadUrlAsPng } from '$lib/utils/exportPng';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import {
		PNG_RESOLUTIONS,
		DEFAULT_PNG_RESOLUTION,
		type PngResolution
	} from '$lib/data/pngResolutions';
	import {
		STELE_DEPARTMENTS,
		STELE_COLOR_PRESETS,
		STELE_ARROW_PATH,
		getSteleOuterPath,
		getSteleInnerPath,
		generateSteleSvg,
		type SteleConfig,
		type SteleColorPreset
	} from '$lib/data/directorySteleData';

	interface Props {
		customSelectedColor?: string | null;
	}

	let { customSelectedColor = null }: Props = $props();

	// Physical dimension states (in millimeters)
	let width = $state<number>(420);
	const height = 800; // Standard stele height
	const borderOffset = 10;
	const cornerRadius = 22;

	// Sizing states (in millimeters)
	let isSizeLinked = $state<boolean>(true);
	let iconSize = $state<number>(44);
	let fontSize = $state<number>(22);

	function onIconSizeChange(newVal: number) {
		iconSize = newVal;
		if (isSizeLinked) {
			fontSize = Math.max(14, Math.min(34, Math.round(newVal * 0.5)));
		}
	}

	function onFontSizeChange(newVal: number) {
		fontSize = newVal;
		if (isSizeLinked) {
			iconSize = Math.max(28, Math.min(65, Math.round(newVal * 2)));
		}
	}

	// Divider states (in millimeters)
	let dividerThickness = $state<number>(2.5);
	let dividerInset = $state<number>(24);

	// Padding states (in millimeters)
	let sidePadding = $state<number>(22);
	let verticalPadding = $state<number>(14);

	// Arrow direction (0° = Right, 180° = Left, etc.)
	const ARROW_SHORTCUTS = [
		{ deg: 0, labelUk: 'Праворуч', labelEn: 'Right', icon: '→' },
		{ deg: 45, labelUk: 'Вниз-праворуч', labelEn: 'Down-Right', icon: '↘' },
		{ deg: 90, labelUk: 'Вниз', labelEn: 'Down', icon: '↓' },
		{ deg: 180, labelUk: 'Ліворуч', labelEn: 'Left', icon: '←' },
		{ deg: 270, labelUk: 'Вгору', labelEn: 'Up', icon: '↑' }
	];
	let arrowAngle = $state<number>(0);

	// Color scheme state
	let activePresetId = $state<string>('classic-green');
	let customBg = $state<string>('#4E812D');
	let customFg = $state<string>('#13371B');
	let customBorder = $state<string>('#13371B');

	function selectPreset(preset: SteleColorPreset) {
		activePresetId = preset.id;
		customBg = preset.bg;
		customFg = preset.fg;
		customBorder = preset.border;
	}

	function applyPaletteColor(color: string) {
		activePresetId = 'palette';
		customBg = color;
		customFg = '#FFFFFF';
		customBorder = '#FFFFFF';
	}

	function invertColors() {
		const temp = customBg;
		customBg = customFg;
		customFg = temp;
		customBorder = customFg;
		activePresetId = 'custom';
	}

	// Sync with parent customSelectedColor if provided and preset is 'palette'
	$effect(() => {
		if (customSelectedColor) {
			if (activePresetId === 'palette') {
				customBg = customSelectedColor;
			}
		}
	});

	// Stage preview background
	let stageTheme = $state<StageTheme>('light');

	// PNG dropdown resolution state
	let currentResId = $state<string>('1080p');
	let currentResolution = $derived(
		PNG_RESOLUTIONS.find((r) => r.id === currentResId) ?? DEFAULT_PNG_RESOLUTION
	);
	let isPngMenuOpen = $state<boolean>(false);
	let isDownloading = $state<boolean>(false);
	const GLOBAL_PNG_EVENT = 'vetcrew:close-png-menus';

	function togglePngMenu(e: MouseEvent) {
		e.stopPropagation();
		if (!isPngMenuOpen) {
			window.dispatchEvent(new CustomEvent(GLOBAL_PNG_EVENT, { detail: { openId: 'stele-png' } }));
			isPngMenuOpen = true;
		} else {
			isPngMenuOpen = false;
		}
	}

	$effect(() => {
		if (!browser) return;
		const onDocClick = () => {
			if (isPngMenuOpen) isPngMenuOpen = false;
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isPngMenuOpen) isPngMenuOpen = false;
		};
		const onGlobalClose = (e: Event) => {
			const custom = e as CustomEvent<{ openId: string }>;
			if (custom.detail?.openId !== 'stele-png' && isPngMenuOpen) {
				isPngMenuOpen = false;
			}
		};

		window.addEventListener('click', onDocClick);
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener(GLOBAL_PNG_EVENT, onGlobalClose);
		return () => {
			window.removeEventListener('click', onDocClick);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener(GLOBAL_PNG_EVENT, onGlobalClose);
		};
	});

	// Calculated geometry values for live rendering
	let slantY = $derived(Math.round(width * 0.095));
	let outerPath = $derived(getSteleOuterPath(width, height, cornerRadius));
	let innerPath = $derived(getSteleInnerPath(width, height, borderOffset, cornerRadius));

	let topY = $derived(slantY + borderOffset + verticalPadding);
	let bottomY = $derived(height - borderOffset - verticalPadding);
	let availH = $derived(bottomY - topY);
	let rowH = $derived(availH / 7);

	let arrowSize = $derived(Math.max(16, Math.round(iconSize * 0.72)));
	let arrowScale = $derived(arrowSize / 24);
	let iconScale = $derived(iconSize / 1254);

	let steleConfig = $derived<SteleConfig>({
		width,
		height,
		iconSize,
		fontSize,
		dividerThickness,
		dividerInset,
		sidePadding,
		verticalPadding,
		arrowAngle,
		bgColor: customBg,
		fgColor: customFg,
		borderColor: customBorder,
		borderOffset
	});

	// Download Handlers
	function downloadSvg() {
		try {
			const svgContent = generateSteleSvg(steleConfig);
			const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `VetCrew - Стела напрямків (${width}x${height}мм, ${customBg}).svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (err) {
			logService.error('brand', 'Download Stele SVG failed', err);
		}
	}

	async function downloadPng(res: PngResolution = currentResolution) {
		isDownloading = true;
		isPngMenuOpen = false;
		try {
			const svgContent = generateSteleSvg(steleConfig);
			const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const filename = `VetCrew - Стела напрямків (${width}x${height}мм, ${res.label}).png`;

			await downloadUrlAsPng(url, filename, res.px, (text) => text);
			URL.revokeObjectURL(url);
		} catch (err) {
			logService.error('brand', 'Download Stele PNG failed', err);
		} finally {
			isDownloading = false;
		}
	}
</script>

<div class="directory-stele-widget" id="directory-stele">
	<!-- CARD HEADER -->
	<div class="stele-header">
		<div class="stele-badge-group">
			<span class="stele-badge">STELE</span>
			<div class="stele-titles">
				<h3 class="stele-name-uk">
					{langStore.current === 'uk'
						? 'Комплексний навігаційний покажчик (Стела напрямків)'
						: 'Wayfinding Directory Stele'}
				</h3>
				<span class="stele-name-en">
					{langStore.current === 'uk'
						? 'Інтерактивний макет у фізичних міліметрах (мм) для вибору ширини, розмірів шрифту, іконок та ліній'
						: 'Interactive physical-scale mockup (mm) for customizing board width, icon and font sizes, dividers and spacing'}
				</span>
			</div>
		</div>

		<!-- Top Quick Action: SVG / PNG Export -->
		<div class="stele-top-actions">
			<button
				type="button"
				class="action-btn svg-btn"
				onclick={downloadSvg}
				title={langStore.current === 'uk'
					? 'Завантажити векторний SVG у мм'
					: 'Download vector SVG'}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>SVG ({width}×{height} мм)</span>
			</button>

			<div class="png-dropdown-wrap" class:is-open={isPngMenuOpen}>
				<button
					type="button"
					class="action-btn png-btn"
					onclick={togglePngMenu}
					disabled={isDownloading}
					aria-expanded={isPngMenuOpen}
					aria-haspopup="menu"
					title={langStore.current === 'uk' ? 'Завантажити растровий PNG' : 'Download raster PNG'}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isDownloading ? '...' : `PNG (${currentResolution.label})`}</span>
					<svg
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						class="chevron-icon"
						class:is-flipped={isPngMenuOpen}
						aria-hidden="true"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</button>

				{#if isPngMenuOpen}
					<div
						class="png-menu-dropdown"
						role="menu"
						tabindex="-1"
						onclick={(e) => e.stopPropagation()}
						onkeydown={(e) => {
							if (e.key === 'Escape') isPngMenuOpen = false;
						}}
					>
						<div class="png-menu-header">
							<span>{langStore.current === 'uk' ? 'Роздільна здатність:' : 'Resolution:'}</span>
						</div>
						{#each PNG_RESOLUTIONS as res (res.id)}
							<button
								type="button"
								role="menuitem"
								class="png-menu-item"
								class:is-selected={res.id === currentResId}
								onclick={() => {
									currentResId = res.id;
									downloadPng(res);
								}}
							>
								<span class="res-badge">{res.label}</span>
								<span class="res-desc">
									{langStore.current === 'uk' ? res.descriptionUk : res.descriptionEn}
								</span>
								{#if res.id === currentResId}
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										class="check-icon"
										aria-hidden="true"
									>
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="stage-switcher-box">
				<StageBgSwitcher bind:current={stageTheme} />
			</div>
		</div>
	</div>

	<!-- TWO-COLUMN WORKSPACE: CONTROLS & LIVE STAGE -->
	<div class="stele-workspace">
		<!-- LEFT: INTERACTIVE PARAMETER CONTROLS -->
		<div class="stele-controls-sidebar">
			<!-- 1. Width & Presets -->
			<div class="control-card">
				<div class="card-title-row">
					<span class="card-section-title">
						{langStore.current === 'uk' ? '1. Ширина фону (Стели)' : '1. Board Width'}
					</span>
					<span class="val-pill highlight">{width} мм</span>
				</div>

				<div class="preset-buttons-row">
					<button
						type="button"
						class="preset-btn"
						class:is-active={width === 420}
						onclick={() => (width = 420)}
					>
						<strong>420 × 800 мм</strong>
						<span>{langStore.current === 'uk' ? 'Стандарт (як на фото)' : 'Standard'}</span>
					</button>

					<button
						type="button"
						class="preset-btn"
						class:is-active={width === 600}
						onclick={() => (width = 600)}
					>
						<strong>600 × 800 мм</strong>
						<span>{langStore.current === 'uk' ? 'Широкий покажчик' : 'Wide Board'}</span>
					</button>
				</div>

				<div class="slider-field">
					<div class="field-info">
						<label for="stele-width-slider"
							>{langStore.current === 'uk' ? 'Плавне регулювання ширини:' : 'Width range:'}</label
						>
						<span class="field-range">350 — 750 мм</span>
					</div>
					<div class="range-with-input">
						<input
							id="stele-width-slider"
							type="range"
							min="350"
							max="750"
							step="5"
							bind:value={width}
							class="stele-slider"
							aria-label="Ширина стели в міліметрах"
						/>
						<div class="num-box">
							<input
								type="number"
								min="350"
								max="750"
								step="5"
								bind:value={width}
								class="num-input"
								aria-label="Ввести ширину"
							/>
							<span class="unit">мм</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 2. Typography & Icon Sizing (Linked / Unlinked) -->
			<div class="control-card">
				<div class="card-title-row">
					<span class="card-section-title">
						{langStore.current === 'uk' ? '2. Розмір іконок та шрифту' : '2. Icons & Typography'}
					</span>

					<button
						type="button"
						class="link-toggle-btn"
						class:is-linked={isSizeLinked}
						onclick={() => (isSizeLinked = !isSizeLinked)}
						title={langStore.current === 'uk'
							? isSizeLinked
								? "Розміри зв'язано (масштабуються разом). Натисніть, щоб налаштовувати окремо."
								: "Розміри роздільні. Натисніть, щоб зв'язати їх пропорційно."
							: isSizeLinked
								? 'Sizes are linked. Click to adjust independently.'
								: 'Sizes are independent. Click to link.'}
					>
						{#if isSizeLinked}
							<svg
								width="13"
								height="13"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								aria-hidden="true"
							>
								<path
									d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
								></path>
							</svg>
							<span>{langStore.current === 'uk' ? "Зв'язано" : 'Linked'}</span>
						{:else}
							<svg
								width="13"
								height="13"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
								<path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
							</svg>
							<span>{langStore.current === 'uk' ? 'Окремо' : 'Separate'}</span>
						{/if}
					</button>
				</div>

				<!-- Icon Size Slider -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-icon-slider"
							>{langStore.current === 'uk' ? 'Розмір іконок:' : 'Icon Size:'}</label
						>
						<span class="val-pill">{iconSize} мм</span>
					</div>
					<input
						id="stele-icon-slider"
						type="range"
						min="28"
						max="65"
						step="1"
						value={iconSize}
						oninput={(e) => onIconSizeChange(parseInt((e.target as HTMLInputElement).value, 10))}
						class="stele-slider"
						aria-label="Розмір іконок в міліметрах"
					/>
				</div>

				<!-- Font Size Slider -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-font-slider"
							>{langStore.current === 'uk' ? 'Розмір шрифту:' : 'Font Size:'}</label
						>
						<span class="val-pill">{fontSize} мм</span>
					</div>
					<input
						id="stele-font-slider"
						type="range"
						min="14"
						max="34"
						step="1"
						value={fontSize}
						oninput={(e) => onFontSizeChange(parseInt((e.target as HTMLInputElement).value, 10))}
						class="stele-slider"
						aria-label="Розмір шрифту в міліметрах"
					/>
				</div>
			</div>

			<!-- 3. Dividers & Spacing -->
			<div class="control-card">
				<span class="card-section-title">
					{langStore.current === 'uk' ? '3. Лінії та відступи' : '3. Dividers & Spacing'}
				</span>

				<!-- Line thickness -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-thickness-slider"
							>{langStore.current === 'uk' ? 'Товщина лінії:' : 'Line thickness:'}</label
						>
						<span class="val-pill">{dividerThickness} мм</span>
					</div>
					<input
						id="stele-thickness-slider"
						type="range"
						min="1"
						max="6"
						step="0.5"
						bind:value={dividerThickness}
						class="stele-slider"
						aria-label="Товщина лінії в міліметрах"
					/>
				</div>

				<!-- Line insets from edges -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-inset-slider"
							>{langStore.current === 'uk' ? 'Втяжка лінії з боків:' : 'Divider inset:'}</label
						>
						<span class="val-pill">{dividerInset} мм</span>
					</div>
					<input
						id="stele-inset-slider"
						type="range"
						min="0"
						max="60"
						step="2"
						bind:value={dividerInset}
						class="stele-slider"
						aria-label="Втяжка лінії з боків"
					/>
				</div>

				<!-- Side padding -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-side-padding-slider"
							>{langStore.current === 'uk' ? 'Боковий відступ:' : 'Side padding:'}</label
						>
						<span class="val-pill">{sidePadding} мм</span>
					</div>
					<input
						id="stele-side-padding-slider"
						type="range"
						min="12"
						max="40"
						step="1"
						bind:value={sidePadding}
						class="stele-slider"
						aria-label="Боковий відступ"
					/>
				</div>
			</div>

			<!-- 4. Arrow Direction -->
			<div class="control-card">
				<div class="card-title-row">
					<span class="card-section-title">
						{langStore.current === 'uk' ? '4. Напрямок стрілок' : '4. Arrow Direction'}
					</span>
					<span class="val-pill">{arrowAngle}°</span>
				</div>

				<div class="arrow-pills-row">
					{#each ARROW_SHORTCUTS as s (s.deg)}
						<button
							type="button"
							class="arrow-dir-btn"
							class:is-active={arrowAngle === s.deg}
							onclick={() => (arrowAngle = s.deg)}
							title="{langStore.current === 'uk' ? s.labelUk : s.labelEn} ({s.deg}°)"
						>
							<span class="arrow-sym">{s.icon}</span>
							<span class="arrow-label">{langStore.current === 'uk' ? s.labelUk : s.labelEn}</span>
						</button>
					{/each}
				</div>

				<div class="custom-arrow-slider-row">
					<input
						type="range"
						min="0"
						max="360"
						step="5"
						bind:value={arrowAngle}
						class="stele-slider"
						aria-label="Кут стрілки"
					/>
				</div>
			</div>

			<!-- 5. Color Theme -->
			<div class="control-card">
				<div class="card-title-row">
					<span class="card-section-title">
						{langStore.current === 'uk' ? '5. Кольорова гама' : '5. Color Theme'}
					</span>
					<button
						type="button"
						class="invert-btn"
						onclick={invertColors}
						title={langStore.current === 'uk' ? 'Інвертувати кольори' : 'Invert colors'}
					>
						⇄ {langStore.current === 'uk' ? 'Інверсія' : 'Invert'}
					</button>
				</div>

				<div class="color-preset-pills">
					{#each STELE_COLOR_PRESETS as p (p.id)}
						<button
							type="button"
							class="color-preset-btn"
							class:is-active={activePresetId === p.id}
							onclick={() => selectPreset(p)}
						>
							<span class="dot" style:background-color={p.previewDot}></span>
							<span>{langStore.current === 'uk' ? p.nameUk : p.nameEn}</span>
						</button>
					{/each}

					{#if customSelectedColor}
						<button
							type="button"
							class="color-preset-btn"
							class:is-active={activePresetId === 'palette'}
							onclick={() => applyPaletteColor(customSelectedColor)}
						>
							<span class="dot" style:background-color={customSelectedColor}></span>
							<span>
								{langStore.current === 'uk'
									? `З палітри (${customSelectedColor})`
									: `Palette (${customSelectedColor})`}
							</span>
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- RIGHT: LIVE PREVIEW STAGE WITH INTERACTIVE SVG -->
		<div class="stele-stage-column">
			<div class="stele-preview-stage stage--{stageTheme}">
				<div class="stele-canvas-wrapper" style:max-width="{width * 0.95}px">
					<!-- Interactive SVG Mockup -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 {width} {height}"
						class="stele-svg-render"
						aria-label="Комплексний навігаційний покажчик Vet Crew Hospital"
					>
						<defs>
							<style>
								.stele-text-render {
									font-family:
										Montserrat,
										-apple-system,
										BlinkMacSystemFont,
										'Segoe UI',
										Roboto,
										sans-serif;
									font-weight: 700;
									text-anchor: start;
									letter-spacing: 0.02em;
								}
							</style>
						</defs>

						<!-- Outer Beveled Board -->
						<path d={outerPath} fill={customBg} />

						<!-- Inner Decorative Frame -->
						<path d={innerPath} fill="none" stroke={customBorder} stroke-width="2" />

						<!-- 6 Dividing Lines -->
						{#each Array(6) as _, i (i)}
							{@const lineY = topY + (i + 1) * rowH}
							<line
								x1={dividerInset}
								y1={lineY}
								x2={width - dividerInset}
								y2={lineY}
								stroke={customFg}
								stroke-width={dividerThickness}
								stroke-linecap="round"
							/>
						{/each}

						<!-- 7 Department Rows -->
						{#each STELE_DEPARTMENTS as dep, i (dep.id)}
							{@const cy = topY + (i + 0.5) * rowH}
							{@const iconX = borderOffset + sidePadding}
							{@const iconY = cy - iconSize / 2}
							{@const textX = iconX + iconSize + 14}
							{@const arrowX = width - borderOffset - sidePadding - arrowSize}
							{@const arrowY = cy - arrowSize / 2}

							<g id="preview-row-{dep.id}">
								<!-- Department Icon -->
								<g transform="translate({iconX}, {iconY}) scale({iconScale})">
									{#each dep.paths as p, pIdx (pIdx)}
										<path d={p} fill={customFg} />
									{/each}
								</g>

								<!-- Department Title -->
								{#if dep.twoLines && dep.line1 && dep.line2}
									<text
										class="stele-text-render"
										x={textX}
										y={cy - fontSize * 0.12}
										fill={customFg}
										font-size="{fontSize}px"
									>
										{dep.line1}
									</text>
									<text
										class="stele-text-render"
										x={textX}
										y={cy + fontSize * 0.95}
										fill={customFg}
										font-size="{fontSize}px"
									>
										{dep.line2}
									</text>
								{:else}
									<text
										class="stele-text-render"
										x={textX}
										y={cy + fontSize * 0.36}
										fill={customFg}
										font-size="{fontSize}px"
									>
										{dep.titleUk}
									</text>
								{/if}

								<!-- Directional Arrow -->
								<g
									transform="translate({arrowX}, {arrowY}) scale({arrowScale}) rotate({arrowAngle} 12 12)"
								>
									<path
										d={STELE_ARROW_PATH}
										fill="none"
										stroke={customFg}
										stroke-width="2.2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
							</g>
						{/each}
					</svg>
				</div>

				<!-- Physical Dimension Caption matching the reference photo -->
				<div class="stele-dimension-badge">
					<span class="dim-label">{width} × {height} мм</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.directory-stele-widget {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		border-radius: 20px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		padding: 1.5rem;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
	}

	/* HEADER */
	.stele-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		flex-wrap: wrap;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--border);
	}

	.stele-badge-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stele-badge {
		font-size: 0.8rem;
		font-weight: 800;
		color: #13371b;
		background: #93c84a;
		padding: 0.35rem 0.7rem;
		border-radius: 8px;
		letter-spacing: 0.05em;
	}

	.stele-titles {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.stele-name-uk {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.stele-name-en {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	/* TOP ACTIONS */
	.stele-top-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.55rem 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn:hover {
		background: var(--border);
		border-color: var(--text-secondary);
	}

	.action-btn.svg-btn {
		border-color: #598f3a;
		color: #13371b;
		background: rgba(89, 143, 58, 0.1);
	}

	:global(.dark) .action-btn.svg-btn {
		color: #93c84a;
		background: rgba(147, 200, 74, 0.12);
	}

	.action-btn.png-btn {
		position: relative;
	}

	.chevron-icon {
		transition: transform 0.2s ease;
	}

	.chevron-icon.is-flipped {
		transform: rotate(180deg);
	}

	/* PNG MENU DROPDOWN */
	.png-dropdown-wrap {
		position: relative;
	}

	.png-menu-dropdown {
		position: absolute;
		bottom: calc(100% + 8px);
		right: 0;
		min-width: 250px;
		background: #ffffff;
		border: 1px solid #c2d4bf;
		border-radius: 14px;
		padding: 0.5rem;
		box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	:global(.dark) .png-menu-dropdown {
		background: #1a291e;
		border-color: #2f4535;
		box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
	}

	.png-menu-header {
		padding: 0.35rem 0.6rem;
		font-size: 0.75rem;
		font-weight: 800;
		color: #4c6352;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}

	:global(.dark) .png-menu-header {
		color: #8fa896;
		border-bottom-color: rgba(255, 255, 255, 0.08);
	}

	.png-menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.6rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--text-primary);
		font-size: 0.85rem;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s ease;
	}

	.png-menu-item:hover {
		background: rgba(89, 143, 58, 0.1);
	}

	.png-menu-item.is-selected {
		background: rgba(89, 143, 58, 0.16);
		border-color: #598f3a;
		font-weight: 700;
	}

	.res-badge {
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.15rem 0.4rem;
		border-radius: 5px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
	}

	.res-desc {
		flex: 1;
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.check-icon {
		color: #598f3a;
	}

	/* WORKSPACE LAYOUT */
	.stele-workspace {
		display: grid;
		grid-template-columns: minmax(320px, 380px) 1fr;
		gap: 1.5rem;
		align-items: start;
	}

	@media (max-width: 960px) {
		.stele-workspace {
			grid-template-columns: 1fr;
		}
	}

	/* CONTROLS SIDEBAR */
	.stele-controls-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.control-card {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 1rem 1.15rem;
		border-radius: 14px;
		background: var(--bg-primary);
		border: 1px solid var(--border);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.card-section-title {
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.val-pill {
		font-size: 0.78rem;
		font-weight: 700;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--text-primary);
	}

	.val-pill.highlight {
		background: rgba(89, 143, 58, 0.12);
		border-color: #598f3a;
		color: #598f3a;
	}

	:global(.dark) .val-pill.highlight {
		color: #93c84a;
		border-color: #93c84a;
	}

	/* PRESET BUTTONS */
	.preset-buttons-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}

	.preset-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.65rem 0.5rem;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: center;
	}

	.preset-btn strong {
		font-size: 0.88rem;
	}

	.preset-btn span {
		font-size: 0.7rem;
		color: var(--text-secondary);
		margin-top: 0.15rem;
	}

	.preset-btn:hover {
		border-color: #598f3a;
	}

	.preset-btn.is-active {
		border-color: #598f3a;
		background: rgba(89, 143, 58, 0.14);
		font-weight: 700;
	}

	:global(.dark) .preset-btn.is-active {
		background: rgba(147, 200, 74, 0.15);
		border-color: #93c84a;
	}

	/* SLIDERS & FIELDS */
	.slider-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.field-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.field-range {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.range-with-input {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.stele-slider {
		flex: 1;
		accent-color: #598f3a;
		height: 6px;
		border-radius: 3px;
		cursor: pointer;
	}

	.num-box {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.2rem 0.45rem;
	}

	.num-input {
		width: 48px;
		border: none;
		background: transparent;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--text-primary);
		text-align: right;
		outline: none;
	}

	.unit {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	/* LINK BUTTON */
	.link-toggle-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.55rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.link-toggle-btn.is-linked {
		background: rgba(89, 143, 58, 0.14);
		border-color: #598f3a;
		color: #13371b;
	}

	:global(.dark) .link-toggle-btn.is-linked {
		color: #93c84a;
		border-color: #93c84a;
	}

	/* ARROW CONTROLS */
	.arrow-pills-row {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.arrow-dir-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.6rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		font-size: 0.8rem;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.arrow-dir-btn:hover {
		border-color: #598f3a;
	}

	.arrow-dir-btn.is-active {
		background: rgba(89, 143, 58, 0.14);
		border-color: #598f3a;
		font-weight: 700;
	}

	.arrow-sym {
		font-size: 1rem;
		line-height: 1;
	}

	/* COLOR PRESETS */
	.invert-btn {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
		cursor: pointer;
	}

	.color-preset-pills {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.color-preset-btn {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.color-preset-btn:hover {
		border-color: #598f3a;
	}

	.color-preset-btn.is-active {
		border-color: #598f3a;
		background: rgba(89, 143, 58, 0.14);
		font-weight: 700;
	}

	.color-preset-btn .dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	/* STAGE COLUMN */
	.stele-stage-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.stele-preview-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 580px;
		padding: 2.5rem 1.5rem 1.5rem 1.5rem;
		border-radius: 16px;
		border: 1px solid var(--border);
		position: relative;
		overflow: hidden;
		transition: background 0.2s ease;
	}

	.stage--checker {
		background-color: #f7f9f7;
		background-image:
			linear-gradient(45deg, #e9ece9 25%, transparent 25%),
			linear-gradient(-45deg, #e9ece9 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e9ece9 75%),
			linear-gradient(-45deg, transparent 75%, #e9ece9 75%);
		background-size: 20px 20px;
		background-position:
			0 0,
			0 10px,
			10px -10px,
			-10px 0;
	}

	:global(.dark) .stage--checker {
		background-color: #121a14;
		background-image:
			linear-gradient(45deg, #18231b 25%, transparent 25%),
			linear-gradient(-45deg, #18231b 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #18231b 75%),
			linear-gradient(-45deg, transparent 75%, #18231b 75%);
	}

	.stage--light {
		background-color: #f0f3ef;
	}

	.stage--dark {
		background-color: #111a13;
	}

	.stage--forest {
		background-color: #13371b;
	}

	/* CANVAS WRAPPER & SVG RENDER */
	.stele-canvas-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-height: 720px;
		transition: max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.16));
	}

	.stele-svg-render {
		width: 100%;
		height: auto;
		max-height: 680px;
		display: block;
	}

	/* DIMENSION BADGE (Red bold italic caption from reference photo) */
	.stele-dimension-badge {
		margin-top: 1.25rem;
		text-align: center;
	}

	.dim-label {
		font-family: Montserrat, sans-serif;
		font-style: italic;
		font-size: 1.4rem;
		font-weight: 800;
		color: #d32f2f;
		letter-spacing: 0.04em;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	:global(.dark) .dim-label {
		color: #ff5252;
	}
</style>
