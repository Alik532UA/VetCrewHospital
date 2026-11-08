<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { downloadSvgAsPng } from '$lib/utils/exportPng';
	import { logService } from '$lib/services/logService.svelte';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import PngDownloadBtn from '$lib/components/brand/PngDownloadBtn.svelte';
	import OracalColorPicker from '$lib/components/brand/OracalColorPicker.svelte';
	import QrShapePicker from '$lib/components/brand/QrShapePicker.svelte';
	import QrTransformControls from '$lib/components/brand/QrTransformControls.svelte';
	import type { PngResolution } from '$lib/data/pngResolutions';
	import {
		getOracalColorByCode,
		type OracalColor,
		ORACAL_641_PALETTE
	} from '$lib/data/oracal641Data';
	import { getQrBgShapeById } from '$lib/data/qrBackgroundShapes';

	import {
		REVIEW_FILES,
		WEBSITE_FILES,
		DEFAULT_QR_CONFIG,
		DEFAULT_BG_TRANSFORM,
		serializeQrConfig,
		parseQrConfig,
		generateQrShareText,
		generateQrShareUrl,
		buildQrSvg,
		type ReviewVariant,
		type WebsiteVariant,
		type ServiceId,
		type PlaqueId,
		type QrShowcaseConfig,
		type QrParsedConfig,
		type QrBgTransform
	} from '$lib/data/qrShowcase';

	// Signage mode: with background container vs transparent
	let withBg = $state(DEFAULT_QR_CONFIG.withBg);
	let stageTheme = $state<StageTheme>(DEFAULT_QR_CONFIG.stageTheme as StageTheme);

	// Default order of the 4 service mockups (reorderable with arrows)
	let serviceOrder = $state<ServiceId[]>([...DEFAULT_QR_CONFIG.serviceOrder]);

	// Subvariant selections
	let reviewVariant = $state<ReviewVariant>(DEFAULT_QR_CONFIG.reviewVariant);
	let websiteVariant = $state<WebsiteVariant>(DEFAULT_QR_CONFIG.websiteVariant);

	// Share & Import states
	let isConfigCopied = $state<boolean>(false);
	let isLinkCopied = $state<boolean>(false);
	let isImportModalOpen = $state<boolean>(false);
	let importInputText = $state<string>('');
	let importError = $state<string | null>(null);
	let importSuccess = $state<string | null>(null);

	// Color configurations (ORACAL 641)
	// Shared foreground color for text, icons, and QR codes across all plaques
	const defaultFg = getOracalColorByCode('060M') ?? ORACAL_641_PALETTE[0]!; // Dark green
	const defaultBgBackground =
		getOracalColorByCode(DEFAULT_QR_CONFIG.cardBgCodes.background) ?? defaultFg;
	const defaultBgReviews = getOracalColorByCode(DEFAULT_QR_CONFIG.cardBgCodes.reviews) ?? defaultFg;
	const defaultBgWebsite = getOracalColorByCode(DEFAULT_QR_CONFIG.cardBgCodes.website) ?? defaultFg;
	const defaultBgWifi = getOracalColorByCode(DEFAULT_QR_CONFIG.cardBgCodes.wifi) ?? defaultFg;
	const defaultBgInstagram =
		getOracalColorByCode(DEFAULT_QR_CONFIG.cardBgCodes.instagram) ?? defaultFg;

	let sharedFgColor = $state<OracalColor>(defaultFg);
	let syncFgColors = $state<boolean>(true); // "за замовчуванням міняти разом"

	// Individual background colors for each mockup + background container
	let cardBgColors = $state<Record<PlaqueId, OracalColor>>({
		background: defaultBgBackground,
		wifi: defaultBgWifi,
		instagram: defaultBgInstagram,
		reviews: defaultBgReviews,
		website: defaultBgWebsite
	});

	// Individual foreground colors (used when unlinked)
	let cardFgColors = $state<Record<ServiceId, OracalColor>>({
		wifi: defaultFg,
		instagram: defaultFg,
		reviews: defaultFg,
		website: defaultFg
	});

	// Background shapes & transformation states
	let syncBgShapes = $state<boolean>(DEFAULT_QR_CONFIG.syncBgShapes);

	let sharedBgTransform = $state<QrBgTransform>({
		...DEFAULT_BG_TRANSFORM
	});

	let cardBgTransforms = $state<Record<PlaqueId, QrBgTransform>>({
		background: { ...DEFAULT_BG_TRANSFORM },
		wifi: { ...DEFAULT_BG_TRANSFORM },
		instagram: { ...DEFAULT_BG_TRANSFORM },
		reviews: { ...DEFAULT_BG_TRANSFORM },
		website: { ...DEFAULT_BG_TRANSFORM }
	});

	// Sync transforms when syncBgShapes is active
	$effect(() => {
		if (syncBgShapes) {
			cardBgTransforms.background = { ...sharedBgTransform };
			cardBgTransforms.wifi = { ...sharedBgTransform };
			cardBgTransforms.instagram = { ...sharedBgTransform };
			cardBgTransforms.reviews = { ...sharedBgTransform };
			cardBgTransforms.website = { ...sharedBgTransform };
		}
	});

	function getTransformFor(id: PlaqueId): QrBgTransform {
		return syncBgShapes ? sharedBgTransform : (cardBgTransforms[id] ?? sharedBgTransform);
	}

	function setSharedTransform(t: Partial<QrBgTransform>) {
		sharedBgTransform = { ...sharedBgTransform, ...t };
		if (syncBgShapes) {
			cardBgTransforms.background = { ...sharedBgTransform };
			cardBgTransforms.wifi = { ...sharedBgTransform };
			cardBgTransforms.instagram = { ...sharedBgTransform };
			cardBgTransforms.reviews = { ...sharedBgTransform };
			cardBgTransforms.website = { ...sharedBgTransform };
		}
	}

	function setCardTransform(id: PlaqueId, t: Partial<QrBgTransform>) {
		const current = cardBgTransforms[id] ?? sharedBgTransform;
		cardBgTransforms[id] = { ...current, ...t };
		if (syncBgShapes) {
			sharedBgTransform = { ...cardBgTransforms[id] };
			cardBgTransforms.background = { ...sharedBgTransform };
			cardBgTransforms.wifi = { ...sharedBgTransform };
			cardBgTransforms.instagram = { ...sharedBgTransform };
			cardBgTransforms.reviews = { ...sharedBgTransform };
			cardBgTransforms.website = { ...sharedBgTransform };
		}
	}

	function applyShapeToAll(sourceTransform: QrBgTransform) {
		sharedBgTransform = { ...sourceTransform };
		cardBgTransforms.background = { ...sourceTransform };
		cardBgTransforms.wifi = { ...sourceTransform };
		cardBgTransforms.instagram = { ...sourceTransform };
		cardBgTransforms.reviews = { ...sourceTransform };
		cardBgTransforms.website = { ...sourceTransform };
	}

	// Derived current configuration token
	let qrConfig = $derived<QrShowcaseConfig>({
		serviceOrder,
		reviewVariant,
		websiteVariant,
		withBg,
		stageTheme,
		syncFgColors,
		sharedFgCode: sharedFgColor.code,
		cardBgCodes: {
			background: cardBgColors.background.code,
			wifi: cardBgColors.wifi.code,
			instagram: cardBgColors.instagram.code,
			reviews: cardBgColors.reviews.code,
			website: cardBgColors.website.code
		},
		cardFgCodes: {
			wifi: cardFgColors.wifi.code,
			instagram: cardFgColors.instagram.code,
			reviews: cardFgColors.reviews.code,
			website: cardFgColors.website.code
		},
		syncBgShapes,
		sharedBgTransform,
		cardBgTransforms
	});

	let currentToken = $derived(serializeQrConfig(qrConfig));

	async function copyShareConfig() {
		if (!browser) return;
		try {
			const shareText = generateQrShareText(qrConfig, currentToken);
			await navigator.clipboard.writeText(shareText);
			isConfigCopied = true;
			setTimeout(() => {
				isConfigCopied = false;
			}, 2500);
		} catch (err) {
			logService.warn('brand', 'Clipboard copy QR config failed', err);
		}
	}

	async function copyShareUrl() {
		if (!browser) return;
		try {
			const url = generateQrShareUrl(currentToken);
			await navigator.clipboard.writeText(url);
			isLinkCopied = true;
			setTimeout(() => {
				isLinkCopied = false;
			}, 2500);
		} catch (err) {
			logService.warn('brand', 'Clipboard copy QR url failed', err);
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

	function applyParsedConfig(data: QrParsedConfig) {
		serviceOrder = data.serviceOrder;
		reviewVariant = data.reviewVariant;
		websiteVariant = data.websiteVariant;
		withBg = data.withBg;
		stageTheme = data.stageTheme as StageTheme;
		syncFgColors = data.syncFgColors;

		const fg = getOracalColorByCode(data.sharedFgCode);
		if (fg) sharedFgColor = fg;

		const bgB = getOracalColorByCode(data.cardBgCodes.background);
		const bgW = getOracalColorByCode(data.cardBgCodes.wifi);
		const bgI = getOracalColorByCode(data.cardBgCodes.instagram);
		const bgR = getOracalColorByCode(data.cardBgCodes.reviews);
		const bgS = getOracalColorByCode(data.cardBgCodes.website);

		cardBgColors = {
			background: bgB ?? defaultBgBackground,
			wifi: bgW ?? defaultBgWifi,
			instagram: bgI ?? defaultBgInstagram,
			reviews: bgR ?? defaultBgReviews,
			website: bgS ?? defaultBgWebsite
		};

		const fgW = getOracalColorByCode(data.cardFgCodes.wifi);
		const fgI = getOracalColorByCode(data.cardFgCodes.instagram);
		const fgR = getOracalColorByCode(data.cardFgCodes.reviews);
		const fgS = getOracalColorByCode(data.cardFgCodes.website);

		cardFgColors = {
			wifi: fgW ?? defaultFg,
			instagram: fgI ?? defaultFg,
			reviews: fgR ?? defaultFg,
			website: fgS ?? defaultFg
		};

		syncBgShapes = data.syncBgShapes;
		sharedBgTransform = { ...data.sharedBgTransform };
		cardBgTransforms = {
			background: { ...data.cardBgTransforms.background },
			wifi: { ...data.cardBgTransforms.wifi },
			instagram: { ...data.cardBgTransforms.instagram },
			reviews: { ...data.cardBgTransforms.reviews },
			website: { ...data.cardBgTransforms.website }
		};
	}

	function applyImportedConfig() {
		if (!importInputText.trim()) {
			importError =
				langStore.current === 'uk'
					? 'Будь ласка, вставте скопійований код конфігурації.'
					: 'Please paste the configuration code.';
			return;
		}

		const result = parseQrConfig(importInputText);
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

	function resetToDefaults() {
		applyParsedConfig({
			serviceOrder: [...DEFAULT_QR_CONFIG.serviceOrder],
			reviewVariant: DEFAULT_QR_CONFIG.reviewVariant,
			websiteVariant: DEFAULT_QR_CONFIG.websiteVariant,
			withBg: DEFAULT_QR_CONFIG.withBg,
			stageTheme: DEFAULT_QR_CONFIG.stageTheme,
			syncFgColors: DEFAULT_QR_CONFIG.syncFgColors,
			sharedFgCode: DEFAULT_QR_CONFIG.sharedFgCode,
			cardBgCodes: { ...DEFAULT_QR_CONFIG.cardBgCodes },
			cardFgCodes: { ...DEFAULT_QR_CONFIG.cardFgCodes },
			syncBgShapes: DEFAULT_QR_CONFIG.syncBgShapes,
			sharedBgTransform: { ...DEFAULT_QR_CONFIG.sharedBgTransform },
			cardBgTransforms: {
				background: { ...DEFAULT_QR_CONFIG.cardBgTransforms.background },
				wifi: { ...DEFAULT_QR_CONFIG.cardBgTransforms.wifi },
				instagram: { ...DEFAULT_QR_CONFIG.cardBgTransforms.instagram },
				reviews: { ...DEFAULT_QR_CONFIG.cardBgTransforms.reviews },
				website: { ...DEFAULT_QR_CONFIG.cardBgTransforms.website }
			}
		});
	}

	// Auto-detect and parse token from URL on mount / navigation
	$effect(() => {
		if (!browser) return;
		try {
			let token: string | null = null;
			const searchParams = new URLSearchParams(window.location.search);
			if (searchParams.has('qr')) {
				token = searchParams.get('qr');
			}
			if (!token && window.location.hash.includes('qr=')) {
				const hashParts = window.location.hash.split('?');
				if (hashParts[1]) {
					const hashParams = new URLSearchParams(hashParts[1]);
					token = hashParams.get('qr');
				}
			}

			if (token) {
				const result = parseQrConfig(token);
				if (result.success && result.data) {
					applyParsedConfig(result.data);
				}
			}
		} catch (err) {
			logService.warn('brand', 'Failed to parse QR token from URL', err);
		}
	});

	// Sync foreground when sharedFgColor changes or syncFgColors is toggled on
	$effect(() => {
		if (syncFgColors) {
			cardFgColors.wifi = sharedFgColor;
			cardFgColors.instagram = sharedFgColor;
			cardFgColors.reviews = sharedFgColor;
			cardFgColors.website = sharedFgColor;
		}
	});

	function getFgFor(id: ServiceId): OracalColor {
		return syncFgColors ? sharedFgColor : (cardFgColors[id] ?? defaultFg);
	}

	function getBgFor(id: PlaqueId): OracalColor {
		return cardBgColors[id] ?? defaultBgBackground;
	}

	let bgContainer = $derived(getBgFor('background'));
	let tmplTransform = $derived(getTransformFor('background'));
	let tmplShape = $derived(getQrBgShapeById(tmplTransform.shapeId));
	let tmplFilename = $derived(
		`vet-crew-qr-plaque-background (${tmplShape.nameEn}, ${bgContainer.code}${tmplTransform.rotation !== 0 ? `, ${tmplTransform.rotation}deg` : ''}${tmplTransform.flipX ? ', flip' : ''}${tmplTransform.scale !== 1.0 ? `, ${Math.round(tmplTransform.scale * 100)}%` : ''})`
	);

	// Reordering logic for the 4 service mockups
	function moveService(index: number, delta: -1 | 1) {
		const target = index + delta;
		if (target < 0 || target >= serviceOrder.length) return;
		const next = [...serviceOrder];
		const current = next[index]!;
		const neighbor = next[target]!;
		next[index] = neighbor;
		next[target] = current;
		serviceOrder = next;
	}

	// Dynamic SVG caching and transformation (foreground inners without <svg> tags)
	let fgInners = $state<Record<string, string>>({});
	let isExporting = $state<string | null>(null);

	async function loadAllSvgs() {
		const fgFiles = [
			'wifi-nobg.svg',
			'instagram-nobg.svg',
			'vidhuk-nobg.svg',
			'google-reviews-nobg.svg',
			'reviews-nobg.svg',
			'website-nobg.svg',
			'website-v2-nobg.svg'
		];
		try {
			const results = await Promise.all(
				fgFiles.map(async (file) => {
					try {
						const res = await fetch(`${base}/brand/qr/${file}`);
						const text = await res.text();
						const inner = text
							.replace(/<svg[^>]*>/i, '')
							.replace(/<\/svg>/i, '')
							.trim();
						return [file, inner] as const;
					} catch {
						return [file, ''] as const;
					}
				})
			);
			const map: Record<string, string> = {};
			for (const [f, inner] of results) {
				map[f] = inner;
			}
			fgInners = map;
		} catch (err) {
			logService.error('brand', 'Failed loading QR foreground SVGs', err);
		}
	}

	$effect(() => {
		if (browser) {
			loadAllSvgs();
		}
	});

	function getActiveNobgFileFor(id: ServiceId): string {
		switch (id) {
			case 'wifi':
				return 'wifi-nobg.svg';
			case 'instagram':
				return 'instagram-nobg.svg';
			case 'reviews':
				return REVIEW_FILES[reviewVariant].nobg;
			case 'website':
				return WEBSITE_FILES[websiteVariant].nobg;
		}
	}

	function renderFullSvg(
		id: PlaqueId,
		activeFgFile: string | null,
		bg: OracalColor,
		fg: OracalColor,
		showBg: boolean,
		overrideTransform?: QrBgTransform
	): string {
		const transform = overrideTransform ?? getTransformFor(id);
		const shape = getQrBgShapeById(transform.shapeId);
		const innerSvg = activeFgFile ? (fgInners[activeFgFile] ?? '') : '';

		return buildQrSvg({
			foregroundInnerSvg: innerSvg,
			bgColorHex: bg.hex,
			fgColorHex: fg.hex,
			showBg,
			shapeD: shape.d,
			rotation: transform.rotation,
			flipX: transform.flipX,
			scale: transform.scale,
			offsetX: transform.offsetX,
			offsetY: transform.offsetY
		});
	}

	function getCardDataUri(
		id: PlaqueId,
		activeFgFile: string | null,
		bg: OracalColor,
		fg: OracalColor,
		showBg: boolean,
		overrideTransform?: QrBgTransform
	): string {
		const fullSvg = renderFullSvg(id, activeFgFile, bg, fg, showBg, overrideTransform);
		return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
	}

	function downloadCustomSvg(
		filename: string,
		id: PlaqueId,
		activeFgFile: string | null,
		bg: OracalColor,
		fg: OracalColor,
		showBg: boolean
	) {
		const fullSvg = renderFullSvg(id, activeFgFile, bg, fg, showBg);
		const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${filename}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	async function exportCustomPng(
		filename: string,
		id: PlaqueId,
		activeFgFile: string | null,
		bg: OracalColor,
		fg: OracalColor,
		showBg: boolean,
		res: PngResolution
	) {
		const fullSvg = renderFullSvg(id, activeFgFile, bg, fg, showBg);
		isExporting = filename;
		try {
			await downloadSvgAsPng(fullSvg, `${filename}-${res.label}.png`, res.px);
		} catch (err) {
			logService.error('brand', 'PNG export error', err);
		} finally {
			isExporting = null;
		}
	}
</script>

<div class="qr-showcase-widget">
	<!-- Top Controls Toolbar -->
	<div class="showcase-toolbar">
		<div class="toolbar-left-group">
			<div class="mode-meta">
				<span class="mode-label">
					{langStore.current === 'uk' ? 'Формат макета:' : 'Signage Format:'}
				</span>
			</div>

			<div class="toggle-pill-wrap">
				<button
					type="button"
					class="pill-btn"
					class:is-active={withBg}
					onclick={() => (withBg = true)}
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="pill-icon"
						aria-hidden="true"
					>
						<rect x="4" y="2.5" width="16" height="19" rx="3.5" />
					</svg>
					<span>
						{langStore.current === 'uk' ? 'З фірмовим контейнером' : 'With Background Plaque'}
					</span>
				</button>
				<button
					type="button"
					class="pill-btn"
					class:is-active={!withBg}
					onclick={() => (withBg = false)}
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
						<rect x="4" y="2.5" width="16" height="19" rx="3.5" />
					</svg>
					<span>
						{langStore.current === 'uk'
							? 'Чистий без фону (прозорий)'
							: 'Transparent (No Background)'}
					</span>
				</button>
			</div>
		</div>

		<!-- Quick Config Actions: Copy Config, Share Link, Load Config, Reset -->
		<div
			class="qr-quick-actions"
			role="toolbar"
			aria-label="Швидкі дії з конфігурацією QR-навігації"
		>
			<button
				type="button"
				class="action-btn copy-config-btn"
				class:is-copied={isConfigCopied}
				onclick={copyShareConfig}
				title={langStore.current === 'uk'
					? 'Скопіювати повну специфікацію та код конфігурації (VQR1:...)'
					: 'Copy full configuration spec and code token (VQR1:...)'}
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
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>{langStore.current === 'uk' ? 'Завантажити конфіг' : 'Load Config'}</span>
			</button>

			<button
				type="button"
				class="action-btn reset-btn"
				onclick={resetToDefaults}
				title={langStore.current === 'uk'
					? 'Скинути до стандартних налаштувань госпіталю'
					: 'Reset to hospital defaults'}
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
					<path d="M3 3v5h5"></path>
				</svg>
				<span>{langStore.current === 'uk' ? 'Скинути' : 'Reset'}</span>
			</button>
		</div>

		<!-- Shared Foreground Color Control -->
		<div class="toolbar-right-group">
			<div class="shared-color-control">
				<OracalColorPicker
					selectedColor={sharedFgColor}
					onselect={(c) => (sharedFgColor = c)}
					label={langStore.current === 'uk'
						? 'Колір графіки та QR (спільний):'
						: 'Shared Graphics & QR Color:'}
					align="right"
				/>
				<label
					class="sync-checkbox-label"
					title={langStore.current === 'uk'
						? 'Синхронізувати колір графіки на всіх 4 табличках'
						: 'Sync graphics color across all 4 plaques'}
				>
					<input type="checkbox" class="sync-checkbox" bind:checked={syncFgColors} />
					<span class="sync-text">
						{langStore.current === 'uk' ? 'Єдиний колір' : 'Linked'}
					</span>
				</label>
			</div>

			<StageBgSwitcher bind:current={stageTheme} />
		</div>
	</div>

	<!-- Master Shape & Rotation Toolbar (Visible when withBg is enabled) -->
	{#if withBg}
		<div class="shape-master-bar">
			<div class="shape-bar-left">
				<QrShapePicker
					selectedShapeId={sharedBgTransform.shapeId}
					onselect={(s) => setSharedTransform({ shapeId: s.id })}
					label={langStore.current === 'uk'
						? 'Загальна форма для всіх:'
						: 'Master Background Shape:'}
					colorHex={bgContainer.hex}
					align="left"
				/>

				<QrTransformControls
					rotation={sharedBgTransform.rotation}
					flipX={sharedBgTransform.flipX}
					scale={sharedBgTransform.scale}
					offsetX={sharedBgTransform.offsetX}
					offsetY={sharedBgTransform.offsetY}
					onchange={(t) => setSharedTransform(t)}
					label={langStore.current === 'uk' ? 'Поворот, масштаб, рух:' : 'Transform:'}
				/>
			</div>

			<div class="shape-bar-right">
				<button
					type="button"
					class="action-btn apply-all-btn"
					onclick={() => applyShapeToAll(sharedBgTransform)}
					title={langStore.current === 'uk'
						? 'Застосувати цю форму та кут до всіх 4 табличок'
						: 'Apply this shape & transform to all 4 plaques'}
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
					<span>{langStore.current === 'uk' ? 'Застосувати до всіх' : 'Apply to all'}</span>
				</button>

				<label
					class="sync-checkbox-label"
					title={langStore.current === 'uk'
						? 'Синхронізація: зміна форми в будь-якій табличці змінюватиме всі інші'
						: 'Link shapes: editing shape in any plaque syncs all others'}
				>
					<input type="checkbox" class="sync-checkbox" bind:checked={syncBgShapes} />
					<span class="sync-text">
						{langStore.current === 'uk' ? 'Синхронізувати форму' : 'Linked Shape'}
					</span>
				</label>
			</div>
		</div>
	{/if}

	<!-- 1. MASTER BACKGROUND TEMPLATE (Separated at the top) -->
	<div class="master-template-section">
		<div class="master-template-card">
			<div class="template-stage-wrap stage--{stageTheme}">
				<img
					src={getCardDataUri('background', null, bgContainer, sharedFgColor, true, tmplTransform)}
					alt={langStore.current === 'uk'
						? 'Фоновий контейнер (Шаблон)'
						: 'Plaque Background Template'}
					class="template-svg-render"
					loading="lazy"
				/>
			</div>

			<div class="template-info-wrap">
				<div class="template-header-row">
					<div class="template-title-meta">
						<span class="template-badge">
							{langStore.current === 'uk' ? 'Окремий шаблон' : 'Master Template'}
						</span>
						<h3 class="template-title">
							{langStore.current === 'uk'
								? 'Фоновий контейнер (Підкладка під плотер)'
								: 'Background Container (Plaque)'}
						</h3>
					</div>
					<span class="template-dims">800 × 800 px</span>
				</div>

				<p class="template-desc">
					{langStore.current === 'uk'
						? 'Базовий векторний контур фірмової підкладки госпіталю для різки на плотері з плівки ORACAL® 641 та монтажу на стіну чи двері.'
						: 'Master vector cut-contour of the hospital plaque for plotter cutting from ORACAL® 641 vinyl and mounting.'}
				</p>

				<div class="template-controls-row">
					<div class="color-control-inline">
						<OracalColorPicker
							selectedColor={bgContainer}
							onselect={(c) => (cardBgColors.background = c)}
							label={langStore.current === 'uk' ? 'Плівка підкладки:' : 'Plaque Film:'}
							align="left"
						/>

						{#if withBg}
							<QrShapePicker
								selectedShapeId={tmplTransform.shapeId}
								onselect={(s) => setCardTransform('background', { shapeId: s.id })}
								label={langStore.current === 'uk' ? 'Форма підкладки:' : 'Shape:'}
								colorHex={bgContainer.hex}
								compact
							/>
							<QrTransformControls
								rotation={tmplTransform.rotation}
								flipX={tmplTransform.flipX}
								scale={tmplTransform.scale}
								offsetX={tmplTransform.offsetX}
								offsetY={tmplTransform.offsetY}
								onchange={(t) => setCardTransform('background', t)}
								compact
								label={langStore.current === 'uk' ? 'Поворот, масштаб, рух:' : 'Transform:'}
							/>
						{/if}
					</div>

					<div class="template-actions">
						<button
							type="button"
							class="download-qr-btn svg-btn"
							onclick={() =>
								downloadCustomSvg(
									tmplFilename,
									'background',
									null,
									bgContainer,
									sharedFgColor,
									true
								)}
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
							<span>SVG</span>
						</button>

						<PngDownloadBtn
							onselect={(res) =>
								exportCustomPng(
									tmplFilename,
									'background',
									null,
									bgContainer,
									sharedFgColor,
									true,
									res
								)}
							isDownloading={isExporting === tmplFilename}
							btnClass="download-qr-btn"
							size="compact"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 2. FOUR SERVICE PLAQUES IN ONE ROW (Reorderable via arrows) -->
	<div class="services-block">
		<div class="services-header-row">
			<div class="services-title-wrap">
				<h3 class="services-heading">
					{langStore.current === 'uk' ? 'Таблички сервісів' : 'Service Plaques'}
				</h3>
				<span class="services-count-badge"
					>4 {langStore.current === 'uk' ? 'макети' : 'mockups'}</span
				>
			</div>
			<span class="reorder-tip">
				{langStore.current === 'uk'
					? 'Змінюйте порядок табличок у ряду за допомогою стрілок [←] та [→]'
					: 'Reorder plaques in the row using the [←] and [→] arrow buttons'}
			</span>
		</div>

		<div class="qr-services-grid">
			{#each serviceOrder as id, idx (id)}
				{@const bg = getBgFor(id)}
				{@const fg = getFgFor(id)}
				{@const activeNobgFile = getActiveNobgFileFor(id)}
				{@const cardTransform = getTransformFor(id)}
				{@const cardShape = getQrBgShapeById(cardTransform.shapeId)}
				{@const rotSuffix =
					withBg && cardTransform.rotation !== 0 ? `, ${cardTransform.rotation}deg` : ''}
				{@const flipSuffix = withBg && cardTransform.flipX ? ', flip' : ''}
				{@const scaleSuffix =
					withBg && cardTransform.scale !== 1.0
						? `, ${Math.round(cardTransform.scale * 100)}%`
						: ''}
				{@const offsetSuffix =
					withBg && (cardTransform.offsetX !== 0 || cardTransform.offsetY !== 0)
						? `, (${cardTransform.offsetX},${cardTransform.offsetY})`
						: ''}
				{@const cardFilename = `vet-crew-${id}${id === 'reviews' ? `-${reviewVariant}` : id === 'website' ? `-${websiteVariant}` : ''} (${cardShape.nameEn}, ${bg.code} + ${fg.code}${withBg ? `${rotSuffix}${flipSuffix}${scaleSuffix}${offsetSuffix}` : ', nobg'})`}

				<div class="qr-card service-card">
					<!-- Card Header with Title, Badge, and Reorder Arrows -->
					<div class="card-top-bar">
						<div class="title-and-badge">
							<span
								class="order-num-pill"
								title={langStore.current === 'uk'
									? `Позиція ${idx + 1} з 4`
									: `Position ${idx + 1} of 4`}
							>
								#{idx + 1}
							</span>
							<h4 class="service-title">
								{#if id === 'wifi'}
									Wi-Fi
								{:else if id === 'instagram'}
									Instagram
								{:else if id === 'reviews'}
									{langStore.current === 'uk' ? 'Відгуки' : 'Reviews'}
								{:else if id === 'website'}
									{langStore.current === 'uk' ? 'Офіційний сайт' : 'Website'}
								{/if}
							</h4>
						</div>

						<!-- Left / Right Reorder Controls -->
						<div class="reorder-buttons-group">
							<button
								type="button"
								class="reorder-arrow-btn"
								disabled={idx === 0}
								onclick={() => moveService(idx, -1)}
								title={langStore.current === 'uk' ? 'Перемістити ліворуч' : 'Move left'}
								aria-label={langStore.current === 'uk' ? 'Перемістити ліворуч' : 'Move left'}
							>
								←
							</button>
							<button
								type="button"
								class="reorder-arrow-btn"
								disabled={idx === serviceOrder.length - 1}
								onclick={() => moveService(idx, 1)}
								title={langStore.current === 'uk' ? 'Перемістити праворуч' : 'Move right'}
								aria-label={langStore.current === 'uk' ? 'Перемістити праворуч' : 'Move right'}
							>
								→
							</button>
						</div>
					</div>

					<!-- Visual Preview Stage -->
					<div class="qr-preview-stage stage--{stageTheme}" class:is-nobg={!withBg}>
						<img
							src={getCardDataUri(id, activeNobgFile, bg, fg, withBg, cardTransform)}
							alt={id}
							class="qr-svg-render"
							loading="lazy"
						/>
					</div>

					<!-- Card Meta & Color Pickers -->
					<div class="card-meta">
						<!-- Color Controls -->
						<div class="card-color-pickers">
							{#if withBg}
								<OracalColorPicker
									selectedColor={bg}
									onselect={(c) => (cardBgColors[id] = c)}
									label={langStore.current === 'uk' ? 'Плівка фону:' : 'Background Film:'}
									compact
									align={idx > 1 ? 'right' : 'left'}
								/>
							{/if}

							{#if !syncFgColors}
								<OracalColorPicker
									selectedColor={fg}
									onselect={(c) => (cardFgColors[id] = c)}
									label={langStore.current === 'uk' ? 'Плівка графіки/QR:' : 'Graphics Film:'}
									compact
									align={idx > 1 ? 'right' : 'left'}
								/>
							{/if}
						</div>

						<!-- Per-card Shape & Transform controls -->
						{#if withBg}
							<div class="card-shape-controls">
								<QrShapePicker
									selectedShapeId={cardTransform.shapeId}
									onselect={(s) => setCardTransform(id, { shapeId: s.id })}
									label={langStore.current === 'uk' ? 'Форма підкладки:' : 'Shape:'}
									colorHex={bg.hex}
									compact
									align={idx > 1 ? 'right' : 'left'}
								/>
								<QrTransformControls
									rotation={cardTransform.rotation}
									flipX={cardTransform.flipX}
									scale={cardTransform.scale}
									offsetX={cardTransform.offsetX}
									offsetY={cardTransform.offsetY}
									onchange={(t) => setCardTransform(id, t)}
									compact
									label={langStore.current === 'uk' ? 'Поворот, масштаб, рух:' : 'Transform:'}
								/>
							</div>
						{/if}

						<!-- Subvariants (for Reviews and Website) -->
						{#if id === 'reviews'}
							<div class="subvariant-section">
								<span class="subvariant-title">
									{langStore.current === 'uk' ? 'Варіант напису:' : 'Variant:'}
								</span>
								<div class="subvariant-pills">
									{#each ['vidhuk', 'google-reviews', 'reviews'] as const as v (v)}
										<button
											type="button"
											class="sub-pill"
											class:is-active={reviewVariant === v}
											onclick={() => (reviewVariant = v)}
										>
											{langStore.current === 'uk'
												? REVIEW_FILES[v].labelUk
												: REVIEW_FILES[v].labelEn}
										</button>
									{/each}
								</div>
							</div>
						{:else if id === 'website'}
							<div class="subvariant-section">
								<span class="subvariant-title">
									{langStore.current === 'uk' ? 'Версія іконки:' : 'Icon Version:'}
								</span>
								<div class="subvariant-pills">
									{#each ['v2', 'v1'] as const as v (v)}
										<button
											type="button"
											class="sub-pill"
											class:is-active={websiteVariant === v}
											onclick={() => (websiteVariant = v)}
										>
											{langStore.current === 'uk'
												? WEBSITE_FILES[v].labelUk
												: WEBSITE_FILES[v].labelEn}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<!-- Actions: SVG & PNG Downloads -->
					<div class="qr-actions">
						<button
							type="button"
							class="download-qr-btn svg-btn"
							onclick={() => downloadCustomSvg(cardFilename, id, activeNobgFile, bg, fg, withBg)}
							title="{langStore.current === 'uk'
								? 'Завантажити SVG'
								: 'Download SVG'}: {cardFilename}.svg"
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
							<span>SVG</span>
						</button>

						<PngDownloadBtn
							onselect={(res) =>
								exportCustomPng(cardFilename, id, activeNobgFile, bg, fg, withBg, res)}
							isDownloading={isExporting === cardFilename}
							btnClass="download-qr-btn"
							size="compact"
							align={idx >= 2 ? 'right' : 'left'}
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- IMPORT CONFIGURATION MODAL -->
	{#if isImportModalOpen}
		<div class="qr-modal-backdrop" role="presentation" onclick={closeImportModal}>
			<div
				class="qr-modal-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="qr-import-modal-title"
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
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
						</div>
						<div>
							<h4 id="qr-import-modal-title" class="modal-title">
								{langStore.current === 'uk'
									? 'Завантажити параметри QR-навігації'
									: 'Load QR Signage Configuration'}
							</h4>
							<p class="modal-subtitle">
								{langStore.current === 'uk'
									? 'Вставте текст повідомлення з кодом (VQR1:...) або URL-посилання'
									: 'Paste message text containing config code (VQR1:...) or URL'}
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
								? 'Вставте сюди текст або код від клієнта (наприклад: "Конфігурація QR-навігації... Код: VQR1:eyJ2...")'
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
	.qr-showcase-widget {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* TOP TOOLBAR */
	.showcase-toolbar {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.2rem;
		padding: 1.1rem 1.4rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
	}

	.showcase-toolbar:has(:global(.is-open)),
	.showcase-toolbar:has(:global(.picker-popover)),
	.showcase-toolbar:focus-within {
		z-index: 50;
	}

	.toolbar-left-group {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.toolbar-right-group {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.mode-meta {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.mode-label {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-primary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.toggle-pill-wrap {
		display: flex;
		gap: 0.4rem;
		background: var(--panel-bg);
		padding: 0.35rem;
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	.pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.95rem;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--fg-secondary);
		font-size: 0.84rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pill-btn:hover {
		color: var(--fg-primary);
		background: var(--bg-secondary);
	}

	.pill-btn.is-active {
		background: var(--panel-bg);
		color: var(--brand-emerald);
		border-color: var(--brand-leaf);
		box-shadow: 0 2px 8px rgba(89, 143, 58, 0.18);
	}

	:global(.dark) .pill-btn.is-active {
		color: var(--brand-gold);
		border-color: var(--brand-gold);
		box-shadow: 0 2px 8px rgba(255, 179, 39, 0.15);
	}

	.pill-icon {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
		opacity: 0.75;
		transition: all 0.15s ease;
	}

	.pill-btn.is-active .pill-icon {
		color: var(--brand-emerald, #13371b);
		opacity: 1;
	}

	:global(.dark) .pill-btn.is-active .pill-icon {
		color: var(--brand-gold, #ffb327);
	}

	/* QUICK CONFIG ACTIONS */
	.qr-quick-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.45rem 0.8rem;
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 9px;
		border: 1px solid var(--border);
		background: var(--bg-primary);
		color: var(--fg-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		user-select: none;
	}

	.action-btn:hover {
		background: var(--border);
		border-color: var(--fg-secondary);
	}

	.action-btn.copy-config-btn {
		background: rgba(89, 143, 58, 0.08);
		border-color: rgba(89, 143, 58, 0.28);
		color: var(--brand-emerald, #13371b);
	}

	:global(.dark) .action-btn.copy-config-btn {
		background: rgba(147, 200, 74, 0.12);
		border-color: rgba(147, 200, 74, 0.35);
		color: #93c84a;
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

	.action-btn.reset-btn {
		color: var(--fg-secondary);
	}

	.action-btn.reset-btn:hover {
		color: #e02424;
		border-color: rgba(224, 36, 36, 0.4);
		background: rgba(224, 36, 36, 0.08);
	}

	/* Shared Color Control */
	.shared-color-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.sync-checkbox-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.74rem;
		font-weight: 600;
		color: var(--fg-secondary);
		cursor: pointer;
		user-select: none;
	}

	.sync-checkbox {
		accent-color: var(--brand-emerald, #13371b);
		cursor: pointer;
	}

	:global(.dark) .sync-checkbox {
		accent-color: var(--brand-gold, #ffb327);
	}

	.sync-text {
		white-space: nowrap;
	}

	/* MASTER SHAPE & ROTATION BAR */
	.shape-master-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		flex-wrap: wrap;
		padding: 0.85rem 1.25rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 14px;
		position: relative;
	}

	.shape-master-bar:has(:global(.is-open)),
	.shape-master-bar:has(:global(.picker-popover)),
	.shape-master-bar:has(:global(.shape-picker-popover)),
	.shape-master-bar:focus-within {
		z-index: 55;
	}

	.shape-bar-left {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.shape-bar-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.apply-all-btn {
		background: rgba(89, 143, 58, 0.12);
		border-color: var(--brand-leaf, #598f3a);
		color: var(--brand-leaf, #598f3a);
		font-weight: 600;
	}

	.apply-all-btn:hover {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
	}

	.card-shape-controls {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding-top: 0.45rem;
		border-top: 1px dashed var(--border);
	}

	/* MASTER TEMPLATE SECTION */
	.master-template-section {
		display: flex;
		flex-direction: column;
	}

	.master-template-card {
		position: relative;
		display: flex;
		align-items: stretch;
		background: var(--panel-bg);
		border: 1px dashed var(--border-hover);
		border-radius: 18px;
		overflow: visible;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
		transition: all 0.25s ease;
	}

	.master-template-card:has(:global(.is-open)),
	.master-template-card:has(:global(.picker-popover)),
	.master-template-card:has(:global(.png-menu-dropdown)),
	.master-template-card:focus-within {
		z-index: 50;
	}

	.master-template-card:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
		border-color: var(--brand-leaf, #598f3a);
	}

	.template-stage-wrap {
		width: 240px;
		min-width: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-right: 1px solid var(--border);
		border-radius: 17px 0 0 17px;
	}

	.template-svg-render {
		max-width: 100%;
		max-height: 150px;
		width: auto;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
		transition: transform 0.25s ease;
	}

	.master-template-card:hover .template-svg-render {
		transform: scale(1.05);
	}

	.template-info-wrap {
		flex: 1;
		padding: 1.5rem 1.8rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
	}

	.template-header-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.template-title-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.template-badge {
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.22rem 0.55rem;
		border-radius: 6px;
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		border: 1px solid var(--border);
	}

	.template-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.template-dims {
		font-size: 0.76rem;
		font-family: monospace;
		font-weight: 800;
		color: var(--fg-secondary);
		background: var(--bg-secondary);
		padding: 0.25rem 0.55rem;
		border-radius: 6px;
		border: 1px solid var(--border);
	}

	.template-desc {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--fg-secondary);
		max-width: 780px;
	}

	.template-controls-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
		padding-top: 0.8rem;
		border-top: 1px solid var(--border);
	}

	.color-control-inline {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.template-actions {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	/* SERVICES SECTION & GRID */
	.services-block {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.services-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.services-title-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.services-heading {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--fg-primary);
		letter-spacing: -0.01em;
	}

	.services-count-badge {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
		background: rgba(89, 143, 58, 0.12);
		color: var(--brand-emerald);
	}

	:global(.dark) .services-count-badge {
		color: var(--brand-gold);
		background: rgba(255, 179, 39, 0.12);
	}

	.reorder-tip {
		font-size: 0.82rem;
		color: var(--fg-secondary);
	}

	/* 4 IN A ROW RESPONSIVE GRID */
	.qr-services-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.qr-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 18px;
		overflow: visible;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
	}

	/* Elevate card when color picker or PNG menu is open so subsequent grid items never overlay it */
	.qr-card:has(:global(.is-open)),
	.qr-card:has(:global(.picker-popover)),
	.qr-card:has(:global(.png-menu-dropdown)),
	.qr-card:focus-within {
		z-index: 60;
	}

	.qr-card:hover {
		transform: translateY(-3px);
		border-color: var(--border-hover);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
	}

	.qr-card:hover:has(:global(.is-open)),
	.qr-card:hover:has(:global(.picker-popover)),
	.qr-card:hover:has(:global(.png-menu-dropdown)),
	.qr-card:hover:focus-within {
		z-index: 60;
	}

	/* Card Top Bar (Title + Reorder Controls) */
	.card-top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.85rem 1rem 0.65rem;
		border-bottom: 1px solid var(--border);
	}

	.title-and-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.order-num-pill {
		font-size: 0.72rem;
		font-weight: 800;
		font-family: monospace;
		padding: 0.15rem 0.45rem;
		border-radius: 6px;
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		border: 1px solid var(--border);
		flex-shrink: 0;
	}

	.service-title {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--fg-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.reorder-buttons-group {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		background: var(--bg-secondary);
		padding: 0.2rem;
		border-radius: 7px;
		border: 1px solid var(--border);
		flex-shrink: 0;
	}

	.reorder-arrow-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: 1px solid transparent;
		border-radius: 5px;
		background: transparent;
		color: var(--fg-secondary);
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
		line-height: 1;
	}

	.reorder-arrow-btn:hover:not(:disabled) {
		background: var(--panel-bg);
		color: var(--fg-primary);
		border-color: var(--border-hover);
		transform: scale(1.08);
	}

	.reorder-arrow-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	/* PREVIEW STAGE */
	.qr-preview-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.75rem 1rem;
		background: var(--bg-secondary);
		min-height: 230px;
		border-bottom: 1px solid var(--border);
		position: relative;
	}

	.qr-preview-stage.is-nobg {
		background-image:
			linear-gradient(45deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.04) 75%);
		background-size: 16px 16px;
		background-position:
			0 0,
			0 8px,
			8px -8px,
			-8px 0px;
	}

	:global(.dark) .qr-preview-stage.is-nobg {
		background-image:
			linear-gradient(45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.04) 75%);
	}

	.qr-svg-render {
		max-width: 100%;
		max-height: 200px;
		width: auto;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.08));
		transition: transform 0.25s ease;
	}

	.qr-card:hover .qr-svg-render {
		transform: scale(1.04);
	}

	/* CARD META */
	.card-meta {
		padding: 1rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}

	.card-meta:has(:global(.is-open)),
	.card-meta:has(:global(.picker-popover)),
	.card-meta:focus-within {
		position: relative;
		z-index: 40;
	}

	.card-color-pickers {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-color-pickers :global(.oracal-picker-wrapper) {
		width: 100%;
	}

	.card-color-pickers :global(.oracal-picker-wrapper.is-open) {
		position: relative;
		z-index: 50;
	}

	/* SUBVARIANTS */
	.subvariant-section {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-top: 0.55rem;
		border-top: 1px solid var(--border);
	}

	.subvariant-title {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-secondary);
	}

	.subvariant-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.sub-pill {
		padding: 0.25rem 0.55rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		font-size: 0.72rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.16s ease;
	}

	.sub-pill:hover {
		color: var(--fg-primary);
		border-color: var(--border-hover);
	}

	.sub-pill.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
	}

	:global(.dark) .sub-pill.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
	}

	/* ACTIONS */
	.qr-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.45rem;
		padding: 0 0.85rem 0.95rem;
		min-width: 0;
		box-sizing: border-box;
	}

	.qr-actions:has(:global(.is-open)),
	.qr-actions:has(:global(.png-menu-dropdown)),
	.qr-actions:focus-within {
		position: relative;
		z-index: 45;
	}

	.qr-actions :global(.png-dropdown-wrap) {
		width: 100%;
		min-width: 0;
	}

	.download-qr-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
		padding: 0.48rem 0.5rem;
		border-radius: 8px;
		font-size: 0.74rem;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.18s ease;
		text-align: center;
		white-space: nowrap;
		background: rgba(19, 55, 27, 0.08);
		border: 1px solid rgba(19, 55, 27, 0.22);
		color: var(--brand-emerald, #13371b);
	}

	.download-qr-btn:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .download-qr-btn,
	:global(.dark) .download-qr-btn {
		background: rgba(255, 179, 39, 0.12);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .download-qr-btn:hover:not(:disabled),
	:global(.dark) .download-qr-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	/* MODAL DIALOG */
	.qr-modal-backdrop {
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

	.qr-modal-dialog {
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
		color: var(--fg-primary);
	}

	.modal-subtitle {
		margin: 0.15rem 0 0 0;
		font-size: 0.76rem;
		color: var(--fg-secondary);
	}

	.modal-close-btn {
		background: none;
		border: none;
		color: var(--fg-secondary);
		font-size: 1.1rem;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
		border-radius: 6px;
		transition: color 0.15s ease;
	}

	.modal-close-btn:hover {
		color: var(--fg-primary);
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
		color: var(--fg-primary);
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
		color: var(--fg-secondary);
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
		color: var(--fg-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-secondary:hover {
		color: var(--fg-primary);
		border-color: var(--fg-secondary);
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

	/* RESPONSIVE LAYOUT BREAKPOINTS */
	@media (max-width: 1200px) {
		.qr-services-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 820px) {
		.master-template-card {
			flex-direction: column;
		}

		.template-stage-wrap {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid var(--border);
			border-radius: 17px 17px 0 0;
		}

		.showcase-toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toolbar-left-group,
		.toolbar-right-group {
			justify-content: space-between;
		}

		.qr-quick-actions {
			justify-content: flex-start;
			width: 100%;
		}
	}

	@media (max-width: 600px) {
		.qr-services-grid {
			grid-template-columns: 1fr;
		}

		.toggle-pill-wrap {
			width: 100%;
		}

		.pill-btn {
			flex: 1;
			justify-content: center;
		}

		.toolbar-right-group {
			flex-direction: column;
			align-items: stretch;
		}

		.shared-color-control {
			justify-content: space-between;
		}

		.qr-quick-actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.4rem;
		}

		.action-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
