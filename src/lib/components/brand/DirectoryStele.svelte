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
		STELE_ARROW_PATH,
		getSteleOuterPath,
		getSteleInnerPath,
		generateSteleSvg,
		formatSteleTitle,
		serializeSteleConfig,
		parseSteleConfig,
		generateSteleShareText,
		generateSteleShareUrl,
		ORACAL_641_PALETTE,
		ORACAL_CATEGORIES,
		STELE_ORACAL_PRESETS,
		getOracalColorByCode,
		type SteleConfig,
		type SteleTextCase,
		type SteleParsedConfig,
		type OracalColor,
		type OracalCategory,
		type SteleOracalPreset
	} from '$lib/data/directorySteleData';

	interface Props {
		customSelectedColor?: string | null;
	}

	let { customSelectedColor: _customSelectedColor = null }: Props = $props();

	// Physical dimension states (in millimeters)
	let width = $state<number>(420);
	const height = 800; // Standard stele height
	const cornerRadius = 22;

	// Outer border states (in millimeters)
	let borderThickness = $state<number>(7);
	let borderOffset = $state<number>(6);

	// Text casing ('uppercase' | 'titlecase')
	let textCase = $state<SteleTextCase>('uppercase');

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

	// Color scheme state using ORACAL® 641 Economy Cal (Matt)
	let activePresetId = $state<string>('photo-match');
	let bgOracal = $state<OracalColor>(getOracalColorByCode('068M') ?? ORACAL_641_PALETTE[41]!);
	let fgOracal = $state<OracalColor>(getOracalColorByCode('060M') ?? ORACAL_641_PALETTE[38]!);
	let borderOracal = $state<OracalColor>(getOracalColorByCode('060M') ?? ORACAL_641_PALETTE[38]!);
	let isBorderLinked = $state<boolean>(true);

	let customBg = $derived(bgOracal.hex);
	let customFg = $derived(fgOracal.hex);
	let activeBorderOracal = $derived(isBorderLinked ? fgOracal : borderOracal);
	let customBorder = $derived(activeBorderOracal.hex);

	// Palette picker state
	type ColorTarget = 'bg' | 'fg' | 'border';
	let activeColorTarget = $state<ColorTarget>('bg');
	let oracalSearchQuery = $state<string>('');
	let selectedCategory = $state<OracalCategory | 'all'>('all');
	let isSpecCopied = $state<boolean>(false);

	let filteredOracalColors = $derived(
		ORACAL_641_PALETTE.filter((c) => {
			const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
			if (!matchesCategory) return false;
			if (!oracalSearchQuery.trim()) return true;
			const q = oracalSearchQuery.toLowerCase().trim();
			return (
				c.code.toLowerCase().includes(q) ||
				c.nameEn.toLowerCase().includes(q) ||
				c.nameUk.toLowerCase().includes(q) ||
				c.hex.toLowerCase().includes(q)
			);
		})
	);

	function applyOracalColor(color: OracalColor) {
		activePresetId = 'custom';
		if (activeColorTarget === 'bg') {
			bgOracal = color;
		} else if (activeColorTarget === 'fg') {
			fgOracal = color;
			if (isBorderLinked) {
				borderOracal = color;
			}
		} else if (activeColorTarget === 'border') {
			borderOracal = color;
			isBorderLinked = false;
		}
	}

	function selectOracalPreset(preset: SteleOracalPreset) {
		activePresetId = preset.id;
		const bg = getOracalColorByCode(preset.bgCode);
		const fg = getOracalColorByCode(preset.fgCode);
		const b = getOracalColorByCode(preset.borderCode);
		if (bg) bgOracal = bg;
		if (fg) fgOracal = fg;
		if (b) borderOracal = b;
		isBorderLinked = preset.fgCode === preset.borderCode;
	}

	function invertColors() {
		activePresetId = 'custom';
		const temp = bgOracal;
		bgOracal = fgOracal;
		fgOracal = temp;
		if (!isBorderLinked) {
			borderOracal = temp;
		}
	}

	function copyOracalSpec() {
		const borderCode = isBorderLinked ? fgOracal.code : borderOracal.code;
		const borderName = isBorderLinked ? fgOracal.nameEn : borderOracal.nameEn;
		const borderUk = isBorderLinked ? fgOracal.nameUk : borderOracal.nameUk;
		const borderHex = isBorderLinked ? fgOracal.hex : borderOracal.hex;
		const text = `Специфікація плівок для виготовлення покажчика (Vet Crew Hospital):
• Серія матеріалу: ORACAL® 641 Economy Cal (Matt)
• Фон стели (основа): ${bgOracal.code} ${bgOracal.nameEn} (${bgOracal.nameUk}) — sRGB ${bgOracal.r} ${bgOracal.g} ${bgOracal.b} [${bgOracal.hex}]
• Графіка (текст, іконки, лінії): ${fgOracal.code} ${fgOracal.nameEn} (${fgOracal.nameUk}) — sRGB ${fgOracal.r} ${fgOracal.g} ${fgOracal.b} [${fgOracal.hex}]
• Зовнішня рамка: ${borderCode} ${borderName} (${borderUk}) [${borderHex}]
• Фізичні габарити: ${width} × 800 мм
• Товщина рамки: ${borderThickness} мм`;

		if (browser && navigator?.clipboard) {
			navigator.clipboard.writeText(text);
			isSpecCopied = true;
			setTimeout(() => {
				isSpecCopied = false;
			}, 2500);
		}
	}

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
	let innerPath = $derived(
		getSteleInnerPath(width, height, borderOffset, cornerRadius, borderThickness)
	);

	let topY = $derived(slantY + borderOffset + borderThickness + verticalPadding);
	let bottomY = $derived(height - borderOffset - borderThickness - verticalPadding);
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
		borderOffset,
		borderThickness,
		textCase,
		bgOracalCode: bgOracal.code,
		fgOracalCode: fgOracal.code,
		borderOracalCode: isBorderLinked ? fgOracal.code : borderOracal.code
	});

	// Download Handlers
	function downloadSvg() {
		try {
			const svgContent = generateSteleSvg(steleConfig);
			const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `VetCrew - Стела напрямків (${width}x${height}мм, Oracal ${bgOracal.code}+${fgOracal.code}).svg`;
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

	// Share & Import states
	let isConfigCopied = $state<boolean>(false);
	let isLinkCopied = $state<boolean>(false);
	let isImportModalOpen = $state<boolean>(false);
	let importInputText = $state<string>('');
	let importError = $state<string | null>(null);
	let importSuccess = $state<string | null>(null);

	// Generate serialized token derived from current state
	let currentToken = $derived(serializeSteleConfig(steleConfig, isBorderLinked));

	async function copyShareConfig() {
		if (!browser) return;
		try {
			const shareText = generateSteleShareText(steleConfig, currentToken);
			await navigator.clipboard.writeText(shareText);
			isConfigCopied = true;
			setTimeout(() => {
				isConfigCopied = false;
			}, 2500);
		} catch (err) {
			logService.warn('brand', 'Clipboard copy config failed', err);
		}
	}

	async function copyShareUrl() {
		if (!browser) return;
		try {
			const url = generateSteleShareUrl(currentToken);
			await navigator.clipboard.writeText(url);
			isLinkCopied = true;
			setTimeout(() => {
				isLinkCopied = false;
			}, 2500);
		} catch (err) {
			logService.warn('brand', 'Clipboard copy url failed', err);
		}
	}

	function openImportModal() {
		importInputText = '';
		importError = null;
		importSuccess = null;
		isImportModalOpen = true;
	}

	function closeImportModal() {
		isImportModalOpen = false;
		importInputText = '';
		importError = null;
		importSuccess = null;
	}

	async function pasteFromClipboard() {
		if (!browser || !navigator?.clipboard?.readText) return;
		try {
			const text = await navigator.clipboard.readText();
			if (text) {
				importInputText = text.trim();
				importError = null;
			}
		} catch (err) {
			logService.warn('brand', 'Clipboard read failed', err);
		}
	}

	function applyParsedConfig(data: SteleParsedConfig) {
		width = data.width;
		borderThickness = data.borderThickness;
		borderOffset = data.borderOffset;
		textCase = data.textCase;
		iconSize = data.iconSize;
		fontSize = data.fontSize;
		dividerThickness = data.dividerThickness;
		dividerInset = data.dividerInset;
		sidePadding = data.sidePadding;
		verticalPadding = data.verticalPadding;
		arrowAngle = data.arrowAngle;

		const bg = getOracalColorByCode(data.bgOracalCode);
		const fg = getOracalColorByCode(data.fgOracalCode);
		const bc = getOracalColorByCode(data.borderOracalCode);
		if (bg) bgOracal = bg;
		if (fg) fgOracal = fg;
		if (bc) borderOracal = bc;
		isBorderLinked = data.isBorderLinked;
		activePresetId = 'custom';
	}

	function applyImportedConfig() {
		if (!importInputText.trim()) {
			importError =
				langStore.current === 'uk'
					? 'Будь ласка, вставте скопійований код конфігурації.'
					: 'Please paste the configuration code.';
			return;
		}

		const result = parseSteleConfig(importInputText);
		if (!result.success) {
			importError =
				langStore.current === 'uk'
					? `Некоректний код конфігурації. Будь ласка, перевірте скопійований текст (${result.error}).`
					: `Invalid configuration code. Please verify the copied text (${result.error}).`;
			return;
		}

		applyParsedConfig(result.data);
		importError = null;
		importSuccess =
			langStore.current === 'uk'
				? 'Конфігурацію успішно застосовано!'
				: 'Configuration applied successfully!';
		setTimeout(() => {
			closeImportModal();
		}, 600);
	}

	// Auto-detect and parse token from URL on mount / navigation
	$effect(() => {
		if (!browser) return;
		try {
			let token: string | null = null;
			// 1. Check URL query parameters (?stele=...)
			const searchParams = new URLSearchParams(window.location.search);
			if (searchParams.has('stele')) {
				token = searchParams.get('stele');
			}
			// 2. Check hash query (#door-signs?stele=...)
			if (!token && window.location.hash.includes('stele=')) {
				const hashParts = window.location.hash.split('?');
				if (hashParts[1]) {
					const hashParams = new URLSearchParams(hashParts[1]);
					token = hashParams.get('stele');
				}
			}

			if (token) {
				const result = parseSteleConfig(token);
				if (result.success && result.data) {
					applyParsedConfig(result.data);
				}
			}
		} catch (err) {
			logService.warn('brand', 'Failed to parse stele token from URL', err);
		}
	});
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

			<!-- Share & Config Buttons -->
			<button
				type="button"
				class="action-btn copy-config-btn"
				class:is-copied={isConfigCopied}
				onclick={copyShareConfig}
				title={langStore.current === 'uk'
					? 'Скопіювати параметри та код конфігурації в буфер для відправки в месенджер'
					: 'Copy parameters & config code to clipboard'}
			>
				{#if isConfigCopied}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
					<span>{langStore.current === 'uk' ? 'Скопійовано!' : 'Copied!'}</span>
				{:else}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
					<span>{langStore.current === 'uk' ? 'Скопіювати конфіг' : 'Copy Config'}</span>
				{/if}
			</button>

			<button
				type="button"
				class="action-btn share-link-btn"
				class:is-copied={isLinkCopied}
				onclick={copyShareUrl}
				title={langStore.current === 'uk'
					? 'Скопіювати пряме посилання на макет з цими параметрами'
					: 'Copy direct share link with current parameters'}
			>
				{#if isLinkCopied}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
					<span>{langStore.current === 'uk' ? 'Лінк скопійовано!' : 'Link copied!'}</span>
				{:else}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
					</svg>
					<span>{langStore.current === 'uk' ? 'Посилання' : 'Share Link'}</span>
				{/if}
			</button>

			<button
				type="button"
				class="action-btn import-btn"
				onclick={openImportModal}
				title={langStore.current === 'uk'
					? 'Вставити та завантажити код конфігурації клієнта'
					: 'Paste and load client configuration code'}
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
					<polyline points="17 8 12 3 7 8"></polyline>
					<line x1="12" y1="3" x2="12" y2="15"></line>
				</svg>
				<span>{langStore.current === 'uk' ? 'Завантажити конфіг' : 'Load Config'}</span>
			</button>

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

				<!-- Text Case Toggle (UPPERCASE vs Titlecase) -->
				<div class="slider-field">
					<div class="field-info">
						<span class="field-label"
							>{langStore.current === 'uk' ? 'Регістр тексту:' : 'Text Case:'}</span
						>
					</div>
					<div class="case-toggle-group">
						<button
							type="button"
							class="case-btn"
							class:is-active={textCase === 'uppercase'}
							onclick={() => (textCase = 'uppercase')}
						>
							<span class="case-badge">АА</span>
							<span>{langStore.current === 'uk' ? 'ВСІ ВЕЛИКІ' : 'UPPERCASE'}</span>
						</button>
						<button
							type="button"
							class="case-btn"
							class:is-active={textCase === 'titlecase'}
							onclick={() => (textCase = 'titlecase')}
						>
							<span class="case-badge">Аа</span>
							<span>{langStore.current === 'uk' ? 'Перша велика' : 'Title Case'}</span>
						</button>
					</div>
				</div>
			</div>

			<!-- 3. Outer Border (Frame) -->
			<div class="control-card">
				<div class="card-title-row">
					<span class="card-section-title">
						{langStore.current === 'uk'
							? '3. Зовнішній бордер (Рамка покажчика)'
							: '3. Outer Border (Frame)'}
					</span>
					<span class="val-pill highlight">{borderThickness} мм</span>
				</div>

				<div class="border-preset-pills">
					<button
						type="button"
						class="preset-pill-btn"
						class:is-active={borderThickness === 7}
						onclick={() => (borderThickness = 7)}
					>
						<span>{langStore.current === 'uk' ? 'Товстий (7 мм)' : 'Thick (7 mm)'}</span>
					</button>
					<button
						type="button"
						class="preset-pill-btn"
						class:is-active={borderThickness === 10}
						onclick={() => (borderThickness = 10)}
					>
						<span>{langStore.current === 'uk' ? 'Масивний (10 мм)' : 'Heavy (10 mm)'}</span>
					</button>
					<button
						type="button"
						class="preset-pill-btn"
						class:is-active={borderThickness === 3}
						onclick={() => (borderThickness = 3)}
					>
						<span>{langStore.current === 'uk' ? 'Тонкий (3 мм)' : 'Thin (3 mm)'}</span>
					</button>
				</div>

				<!-- Border thickness slider -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-border-thickness-slider"
							>{langStore.current === 'uk' ? 'Товщина бордера:' : 'Border thickness:'}</label
						>
						<span class="val-pill">{borderThickness} мм</span>
					</div>
					<div class="range-with-input">
						<input
							id="stele-border-thickness-slider"
							type="range"
							min="2"
							max="18"
							step="0.5"
							bind:value={borderThickness}
							class="stele-slider"
							aria-label="Товщина зовнішнього бордера"
						/>
						<div class="num-box">
							<input
								type="number"
								min="2"
								max="18"
								step="0.5"
								bind:value={borderThickness}
								class="num-input"
								aria-label="Ввести товщину бордера"
							/>
							<span class="unit">мм</span>
						</div>
					</div>
				</div>

				<!-- Border offset slider -->
				<div class="slider-field">
					<div class="field-info">
						<label for="stele-border-offset-slider"
							>{langStore.current === 'uk' ? 'Відступ від краю (втяжка):' : 'Border inset:'}</label
						>
						<span class="val-pill">{borderOffset} мм</span>
					</div>
					<input
						id="stele-border-offset-slider"
						type="range"
						min="0"
						max="16"
						step="1"
						bind:value={borderOffset}
						class="stele-slider"
						aria-label="Відступ бордера від зовнішнього краю"
					/>
				</div>
			</div>

			<!-- 4. Dividers & Spacing -->
			<div class="control-card">
				<span class="card-section-title">
					{langStore.current === 'uk' ? '4. Лінії та відступи' : '4. Dividers & Spacing'}
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

			<!-- 5. Arrow Direction -->
			<div class="control-card">
				<div class="card-title-row">
					<span class="card-section-title">
						{langStore.current === 'uk' ? '5. Напрямок стрілок' : '5. Arrow Direction'}
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

			<!-- 6. ORACAL 641 Vinyl Film Palette -->
			<div class="control-card oracal-card">
				<div class="card-title-row">
					<div class="oracal-title-group">
						<span class="card-section-title">
							{langStore.current === 'uk'
								? '6. Палітра плівок ORACAL® 641 (Matt)'
								: '6. ORACAL® 641 Film Palette (Matt)'}
						</span>
						<span class="oracal-badge">Oracal 641</span>
					</div>
					<button
						type="button"
						class="invert-btn"
						onclick={invertColors}
						title={langStore.current === 'uk' ? 'Поміняти місцями фон і текст' : 'Invert colors'}
					>
						⇄ {langStore.current === 'uk' ? 'Інверсія' : 'Invert'}
					</button>
				</div>

				<p class="oracal-subtitle">
					{langStore.current === 'uk'
						? 'Фіксована палітра з 59 матових плівок серії 641 Economy Cal для плотерної порізки та виробництва покажчика.'
						: 'Fixed palette of 59 matte films from series 641 Economy Cal for plotter cutting.'}
				</p>

				<!-- Quick Oracal Presets -->
				<div class="section-micro-header">
					<span
						>{langStore.current === 'uk' ? 'Готові поєднання плівок:' : 'Curated Film Pairs:'}</span
					>
				</div>
				<div class="color-preset-pills">
					{#each STELE_ORACAL_PRESETS as p (p.id)}
						{@const bgCol = getOracalColorByCode(p.bgCode)}
						{@const fgCol = getOracalColorByCode(p.fgCode)}
						<button
							type="button"
							class="color-preset-btn"
							class:is-active={activePresetId === p.id}
							onclick={() => selectOracalPreset(p)}
							title={langStore.current === 'uk' ? p.descriptionUk : p.descriptionEn}
						>
							<span class="dual-dot">
								<span class="dot-bg" style:background-color={bgCol?.hex}></span>
								<span class="dot-fg" style:background-color={fgCol?.hex}></span>
							</span>
							<span class="preset-name">{langStore.current === 'uk' ? p.nameUk : p.nameEn}</span>
							<span class="oracal-code-hint">{p.bgCode}+{p.fgCode}</span>
						</button>
					{/each}
				</div>

				<!-- Target Component Selector (What are you changing?) -->
				<div class="section-micro-header">
					<span
						>{langStore.current === 'uk'
							? 'Вибір елемента для заміни плівки:'
							: 'Select element to customize:'}</span
					>
				</div>
				<div class="color-target-pills">
					<button
						type="button"
						class="target-pill"
						class:is-active={activeColorTarget === 'bg'}
						onclick={() => (activeColorTarget = 'bg')}
					>
						<span class="target-swatch" style:background-color={bgOracal.hex}></span>
						<div class="target-info">
							<span class="target-role"
								>{langStore.current === 'uk' ? 'Фон стели' : 'Base Film'}</span
							>
							<span class="target-code"
								>{bgOracal.code} • {langStore.current === 'uk'
									? bgOracal.nameUk
									: bgOracal.nameEn}</span
							>
						</div>
					</button>

					<button
						type="button"
						class="target-pill"
						class:is-active={activeColorTarget === 'fg'}
						onclick={() => (activeColorTarget = 'fg')}
					>
						<span class="target-swatch" style:background-color={fgOracal.hex}></span>
						<div class="target-info">
							<span class="target-role"
								>{langStore.current === 'uk' ? 'Текст/Іконки' : 'Graphics'}</span
							>
							<span class="target-code"
								>{fgOracal.code} • {langStore.current === 'uk'
									? fgOracal.nameUk
									: fgOracal.nameEn}</span
							>
						</div>
					</button>

					<button
						type="button"
						class="target-pill"
						class:is-active={activeColorTarget === 'border'}
						onclick={() => {
							activeColorTarget = 'border';
							isBorderLinked = false;
						}}
					>
						<span
							class="target-swatch"
							style:background-color={isBorderLinked ? fgOracal.hex : borderOracal.hex}
						></span>
						<div class="target-info">
							<span class="target-role"
								>{langStore.current === 'uk' ? 'Рамка (бордер)' : 'Border'}</span
							>
							<span class="target-code">
								{isBorderLinked ? fgOracal.code : borderOracal.code} • {isBorderLinked
									? langStore.current === 'uk'
										? fgOracal.nameUk
										: fgOracal.nameEn
									: langStore.current === 'uk'
										? borderOracal.nameUk
										: borderOracal.nameEn}
							</span>
						</div>
					</button>
				</div>

				{#if activeColorTarget === 'border'}
					<label class="border-link-checkbox">
						<input type="checkbox" bind:checked={isBorderLinked} />
						<span
							>{langStore.current === 'uk'
								? 'Синхронізувати колір рамки з текстом та іконками'
								: 'Sync border color with graphics'}</span
						>
					</label>
				{/if}

				<!-- Palette Search and Category Filters -->
				<div class="oracal-picker-box">
					<div class="picker-search-row">
						<input
							type="text"
							bind:value={oracalSearchQuery}
							placeholder={langStore.current === 'uk'
								? '🔍 Пошук плівки: 068, green, white, gold...'
								: '🔍 Search film: 068, green, white, gold...'}
							class="oracal-search-input"
						/>
						{#if oracalSearchQuery}
							<button
								type="button"
								class="clear-search-btn"
								onclick={() => (oracalSearchQuery = '')}
							>
								✕
							</button>
						{/if}
					</div>

					<div class="category-filter-scroll">
						{#each ORACAL_CATEGORIES as cat (cat.id)}
							<button
								type="button"
								class="cat-pill"
								class:is-active={selectedCategory === cat.id}
								onclick={() => (selectedCategory = cat.id)}
							>
								{langStore.current === 'uk' ? cat.nameUk : cat.nameEn}
							</button>
						{/each}
					</div>

					<!-- Color Swatches Grid -->
					<div class="oracal-swatches-grid" role="listbox" aria-label="Палітра плівок Oracal 641">
						{#each filteredOracalColors as c (c.code)}
							{@const isSelected =
								(activeColorTarget === 'bg' && bgOracal.code === c.code) ||
								(activeColorTarget === 'fg' && fgOracal.code === c.code) ||
								(activeColorTarget === 'border' &&
									(isBorderLinked ? fgOracal.code : borderOracal.code) === c.code)}
							<button
								type="button"
								class="oracal-swatch-chip"
								class:is-selected={isSelected}
								onclick={() => applyOracalColor(c)}
								title="{c.code} {c.nameEn} ({langStore.current === 'uk'
									? c.nameUk
									: ''}) • sRGB: {c.r}, {c.g}, {c.b}"
							>
								<span class="swatch-circle" style:background-color={c.hex}></span>
								<div class="swatch-label-wrap">
									<strong class="swatch-code">{c.code}</strong>
									<span class="swatch-name">{langStore.current === 'uk' ? c.nameUk : c.nameEn}</span
									>
								</div>
								{#if isSelected}
									<span class="swatch-check">✓</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>

				<!-- Live Specification & Copy Button -->
				<div class="oracal-spec-summary">
					<div class="spec-header">
						<span class="spec-title">
							📋 {langStore.current === 'uk'
								? 'Специфікація плівок для друкарні / плотера:'
								: 'Film Production Spec:'}
						</span>
						<button
							type="button"
							class="copy-spec-btn"
							class:is-copied={isSpecCopied}
							onclick={copyOracalSpec}
						>
							{#if isSpecCopied}
								✓ {langStore.current === 'uk' ? 'Скопійовано!' : 'Copied!'}
							{:else}
								📋 {langStore.current === 'uk' ? 'Скопіювати артикули' : 'Copy Spec'}
							{/if}
						</button>
					</div>
					<div class="spec-items">
						<div class="spec-row">
							<span class="spec-tag">{langStore.current === 'uk' ? 'Фон стели:' : 'Base:'}</span>
							<strong class="spec-val"
								>ORACAL® 641 {bgOracal.code} {bgOracal.nameEn} ({bgOracal.nameUk})</strong
							>
							<span class="spec-hex">{bgOracal.hex}</span>
						</div>
						<div class="spec-row">
							<span class="spec-tag">{langStore.current === 'uk' ? 'Графіка:' : 'Text/Icons:'}</span
							>
							<strong class="spec-val"
								>ORACAL® 641 {fgOracal.code} {fgOracal.nameEn} ({fgOracal.nameUk})</strong
							>
							<span class="spec-hex">{fgOracal.hex}</span>
						</div>
						<div class="spec-row">
							<span class="spec-tag">{langStore.current === 'uk' ? 'Рамка:' : 'Border:'}</span>
							<strong class="spec-val">
								ORACAL® 641 {activeBorderOracal.code}
								{activeBorderOracal.nameEn} ({activeBorderOracal.nameUk})
							</strong>
							<span class="spec-hex">{activeBorderOracal.hex}</span>
						</div>
					</div>
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
						style="overflow: visible;"
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
						<path
							d={innerPath}
							fill="none"
							stroke={customBorder}
							stroke-width={borderThickness}
							stroke-linejoin="round"
						/>

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
							{@const iconX = borderOffset + borderThickness + sidePadding}
							{@const iconY = cy - iconSize / 2}
							{@const textX = iconX + iconSize + 14}
							{@const arrowX = width - borderOffset - borderThickness - sidePadding - arrowSize}
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
										{formatSteleTitle(dep.line1, textCase)}
									</text>
									<text
										class="stele-text-render"
										x={textX}
										y={cy + fontSize * 0.95}
										fill={customFg}
										font-size="{fontSize}px"
									>
										{formatSteleTitle(dep.line2, textCase)}
									</text>
								{:else}
									<text
										class="stele-text-render"
										x={textX}
										y={cy + fontSize * 0.36}
										fill={customFg}
										font-size="{fontSize}px"
									>
										{formatSteleTitle(dep.titleUk, textCase)}
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
					<div class="stele-oracal-films-tag">
						<span class="film-pill">
							<span class="film-swatch" style:background-color={bgOracal.hex}></span>
							<span>{bgOracal.code} {bgOracal.nameEn}</span>
						</span>
						<span class="film-divider">+</span>
						<span class="film-pill">
							<span class="film-swatch" style:background-color={fgOracal.hex}></span>
							<span>{fgOracal.code} {fgOracal.nameEn}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- IMPORT CONFIGURATION MODAL -->
	{#if isImportModalOpen}
		<div class="stele-modal-backdrop" role="presentation" onclick={closeImportModal}>
			<div
				class="stele-modal-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="import-modal-title"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') closeImportModal();
				}}
			>
				<div class="modal-header">
					<div class="modal-title-group">
						<div class="modal-icon-badge">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="17 8 12 3 7 8"></polyline>
								<line x1="12" y1="3" x2="12" y2="15"></line>
							</svg>
						</div>
						<div>
							<h4 id="import-modal-title" class="modal-title">
								{langStore.current === 'uk'
									? 'Завантажити параметри макета'
									: 'Load Mockup Configuration'}
							</h4>
							<p class="modal-subtitle">
								{langStore.current === 'uk'
									? 'Вставте текст повідомлення з кодом (VCH1:...) або URL-посилання'
									: 'Paste the message text containing the config code (VCH1:...) or URL'}
							</p>
						</div>
					</div>
					<button
						type="button"
						class="modal-close-btn"
						onclick={closeImportModal}
						aria-label={langStore.current === 'uk' ? 'Закрити' : 'Close'}
					>
						✕
					</button>
				</div>

				<div class="modal-body">
					<div class="modal-input-wrap">
						<textarea
							class="modal-textarea"
							bind:value={importInputText}
							placeholder={langStore.current === 'uk'
								? 'Вставте сюди текст від клієнта (наприклад: "Макет стели Vet Crew... Код: VCH1:eyJ2...")'
								: 'Paste client message or config token here...'}
							rows="5"
							spellcheck="false"></textarea>
						<button
							type="button"
							class="modal-paste-btn"
							onclick={pasteFromClipboard}
							title={langStore.current === 'uk'
								? 'Вставити з буфера обміну'
								: 'Paste from clipboard'}
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
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
							<span>{langStore.current === 'uk' ? 'Вставити' : 'Paste'}</span>
						</button>
					</div>

					{#if importError}
						<div class="modal-alert modal-alert--error" role="alert">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
							<span>{importError}</span>
						</div>
					{/if}

					{#if importSuccess}
						<div class="modal-alert modal-alert--success" role="alert">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
							<span>{importSuccess}</span>
						</div>
					{/if}
				</div>

				<div class="modal-footer">
					<button type="button" class="btn-secondary" onclick={closeImportModal}>
						{langStore.current === 'uk' ? 'Скасувати' : 'Cancel'}
					</button>
					<button type="button" class="btn-primary" onclick={applyImportedConfig}>
						{langStore.current === 'uk' ? 'Застосувати параметри' : 'Apply Configuration'}
					</button>
				</div>
			</div>
		</div>
	{/if}
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

	.action-btn.copy-config-btn,
	.action-btn.share-link-btn,
	.action-btn.import-btn {
		background: var(--bg-secondary);
	}

	.action-btn.is-copied {
		background: #00783f !important;
		border-color: #00783f !important;
		color: #ffffff !important;
	}

	:global(.dark) .action-btn.is-copied {
		background: #00783f !important;
		border-color: #00783f !important;
		color: #ffffff !important;
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

	/* TEXT CASE TOGGLE */
	.case-toggle-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.case-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.45rem 0.6rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.case-btn:hover {
		border-color: #598f3a;
	}

	.case-btn.is-active {
		border-color: #598f3a;
		background: rgba(89, 143, 58, 0.14);
		color: #13371b;
		font-weight: 700;
	}

	:global(.dark) .case-btn.is-active {
		color: #93c84a;
		border-color: #93c84a;
		background: rgba(147, 200, 74, 0.15);
	}

	.case-badge {
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		background: var(--bg-primary);
		border: 1px solid var(--border);
	}

	/* BORDER PRESET PILLS */
	.border-preset-pills {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.preset-pill-btn {
		display: inline-flex;
		align-items: center;
		padding: 0.35rem 0.65rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		font-size: 0.78rem;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.preset-pill-btn:hover {
		border-color: #598f3a;
	}

	.preset-pill-btn.is-active {
		border-color: #598f3a;
		background: rgba(89, 143, 58, 0.14);
		font-weight: 700;
		color: #13371b;
	}

	:global(.dark) .preset-pill-btn.is-active {
		color: #93c84a;
		border-color: #93c84a;
		background: rgba(147, 200, 74, 0.15);
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

	/* STAGE COLUMN */
	.stele-stage-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		position: sticky;
		top: 1.5rem;
		align-self: start;
	}

	@media (max-width: 960px) {
		.stele-stage-column {
			position: static;
		}
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
		padding: 8px;
		box-sizing: border-box;
	}

	.stele-svg-render {
		width: 100%;
		height: auto;
		max-height: min(680px, calc(100vh - 12rem));
		display: block;
		overflow: visible;
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

	/* ORACAL 641 CONTROLS */
	.oracal-card {
		position: relative;
	}

	.oracal-title-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.oracal-badge {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.5rem;
		border-radius: 9999px;
		background: #00783f;
		color: #ffffff;
	}

	.oracal-subtitle {
		font-size: 0.78rem;
		color: var(--text-secondary);
		line-height: 1.4;
		margin: 0.25rem 0 0.75rem 0;
	}

	.section-micro-header {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
		margin-top: 0.75rem;
		margin-bottom: 0.35rem;
	}

	.dual-dot {
		display: inline-flex;
		align-items: center;
		position: relative;
		width: 22px;
		height: 14px;
	}

	.dot-bg,
	.dot-fg {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
		position: absolute;
	}

	.dot-bg {
		left: 0;
		z-index: 1;
	}

	.dot-fg {
		right: 0;
		z-index: 2;
	}

	.preset-name {
		font-size: 0.78rem;
		font-weight: 600;
	}

	.oracal-code-hint {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--text-secondary);
		background: rgba(0, 0, 0, 0.06);
		padding: 0.1rem 0.3rem;
		border-radius: 4px;
	}

	:global(.dark) .oracal-code-hint {
		background: rgba(255, 255, 255, 0.1);
	}

	/* TARGET ELEMENT SELECTOR */
	.color-target-pills {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.target-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.65rem;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
	}

	.target-pill:hover {
		border-color: #00783f;
	}

	.target-pill.is-active {
		border-color: #00783f;
		background: rgba(0, 120, 63, 0.08);
		box-shadow: 0 0 0 2px rgba(0, 120, 63, 0.25);
	}

	.target-swatch {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
	}

	.target-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.target-role {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.target-code {
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.border-link-checkbox {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
		cursor: pointer;
		margin-bottom: 0.75rem;
	}

	/* PALETTE PICKER BOX */
	.oracal-picker-box {
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--bg-primary);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.picker-search-row {
		position: relative;
		display: flex;
		align-items: center;
	}

	.oracal-search-input {
		width: 100%;
		padding: 0.45rem 2rem 0.45rem 0.75rem;
		font-size: 0.8rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.oracal-search-input:focus {
		outline: none;
		border-color: #00783f;
		box-shadow: 0 0 0 2px rgba(0, 120, 63, 0.2);
	}

	.clear-search-btn {
		position: absolute;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 0.75rem;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.25rem;
	}

	.category-filter-scroll {
		display: flex;
		gap: 0.35rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
		scrollbar-width: thin;
	}

	.cat-pill {
		padding: 0.25rem 0.55rem;
		border-radius: 9999px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-secondary);
		font-size: 0.7rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.cat-pill:hover {
		border-color: #00783f;
		color: var(--text-primary);
	}

	.cat-pill.is-active {
		background: #00783f;
		color: #ffffff;
		border-color: #00783f;
	}

	/* SWATCHES GRID */
	.oracal-swatches-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 0.4rem;
		max-height: 240px;
		overflow-y: auto;
		padding-right: 0.25rem;
		scrollbar-width: thin;
	}

	.oracal-swatch-chip {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.5rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		cursor: pointer;
		text-align: left;
		transition: all 0.12s ease;
		position: relative;
	}

	.oracal-swatch-chip:hover {
		border-color: #00783f;
		background: var(--bg-primary);
		transform: translateY(-1px);
	}

	.oracal-swatch-chip.is-selected {
		border-color: #00783f;
		background: rgba(0, 120, 63, 0.12);
		box-shadow: 0 0 0 2px #00783f;
	}

	.swatch-circle {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
	}

	.swatch-label-wrap {
		display: flex;
		flex-direction: column;
		min-width: 0;
		line-height: 1.15;
	}

	.swatch-code {
		font-size: 0.72rem;
		color: var(--text-primary);
	}

	.swatch-name {
		font-size: 0.65rem;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.swatch-check {
		margin-left: auto;
		color: #00783f;
		font-weight: 800;
		font-size: 0.75rem;
	}

	/* PRODUCTION SPEC BOX */
	.oracal-spec-summary {
		margin-top: 0.85rem;
		border: 1px dashed #00783f;
		border-radius: 10px;
		background: rgba(0, 120, 63, 0.04);
		padding: 0.75rem;
	}

	.spec-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.spec-title {
		font-size: 0.75rem;
		font-weight: 700;
		color: #00783f;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.copy-spec-btn {
		padding: 0.3rem 0.65rem;
		font-size: 0.72rem;
		font-weight: 600;
		border-radius: 6px;
		border: 1px solid #00783f;
		background: var(--bg-primary);
		color: #00783f;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.copy-spec-btn:hover {
		background: #00783f;
		color: #ffffff;
	}

	.copy-spec-btn.is-copied {
		background: #00783f;
		color: #ffffff;
	}

	.spec-items {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.spec-row {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		font-size: 0.76rem;
		flex-wrap: wrap;
	}

	.spec-tag {
		color: var(--text-secondary);
		min-width: 65px;
	}

	.spec-val {
		color: var(--text-primary);
		font-weight: 600;
	}

	.spec-hex {
		font-family: monospace;
		font-size: 0.7rem;
		color: var(--text-secondary);
		background: rgba(0, 0, 0, 0.05);
		padding: 0.1rem 0.3rem;
		border-radius: 4px;
	}

	:global(.dark) .spec-hex {
		background: rgba(255, 255, 255, 0.1);
	}

	.stele-oracal-films-tag {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.45rem;
	}

	.film-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.55rem;
		border-radius: 9999px;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--text-primary);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}

	.film-swatch {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.film-divider {
		font-weight: 700;
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	/* MODAL DIALOG */
	.stele-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
	}

	.stele-modal-dialog {
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 16px;
		width: 100%;
		max-width: 540px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes modalPop {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.modal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.25rem 0.75rem 1.25rem;
	}

	.modal-title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.modal-icon-badge {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(0, 120, 63, 0.12);
		color: #00783f;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.modal-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.modal-subtitle {
		margin: 0.15rem 0 0 0;
		font-size: 0.76rem;
		color: var(--text-secondary);
	}

	.modal-close-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 1.1rem;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
		border-radius: 6px;
		transition: color 0.15s ease;
	}

	.modal-close-btn:hover {
		color: var(--text-primary);
	}

	.modal-body {
		padding: 0.5rem 1.25rem 1.25rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.modal-input-wrap {
		position: relative;
	}

	.modal-textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem 4.5rem 0.75rem 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.78rem;
		line-height: 1.4;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--text-primary);
		resize: vertical;
		min-height: 110px;
	}

	.modal-textarea:focus {
		outline: none;
		border-color: #00783f;
		box-shadow: 0 0 0 2px rgba(0, 120, 63, 0.2);
	}

	.modal-paste-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.55rem;
		font-size: 0.72rem;
		font-weight: 600;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.modal-paste-btn:hover {
		border-color: #00783f;
		color: #00783f;
	}

	.modal-alert {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.85rem;
		border-radius: 8px;
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.modal-alert--error {
		background: rgba(239, 68, 68, 0.12);
		color: #ef4444;
		border: 1px solid rgba(239, 68, 68, 0.25);
	}

	.modal-alert--success {
		background: rgba(16, 185, 129, 0.12);
		color: #10b981;
		border: 1px solid rgba(16, 185, 129, 0.25);
	}

	.modal-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.65rem;
		padding: 0.85rem 1.25rem 1.25rem 1.25rem;
		border-top: 1px solid var(--border);
		background: var(--bg-secondary);
	}

	.btn-secondary {
		padding: 0.5rem 0.9rem;
		font-size: 0.82rem;
		font-weight: 600;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-secondary:hover {
		color: var(--text-primary);
		border-color: var(--text-secondary);
	}

	.btn-primary {
		padding: 0.5rem 1.1rem;
		font-size: 0.82rem;
		font-weight: 700;
		border-radius: 8px;
		border: 1px solid #00783f;
		background: #00783f;
		color: #ffffff;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary:hover {
		background: #006032;
		border-color: #006032;
	}
</style>
