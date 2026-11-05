<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { downloadUrlAsPng } from '$lib/utils/exportPng';
	import { logService } from '$lib/services/logService.svelte';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';

	import {
		COMPOSITE_PLAQUES,
		TEXT_PLAQUES,
		ICON_PLAQUES,
		type SignFormat,
		type SignItem
	} from '$lib/data/doorSignage';

	// Unified controls state
	let currentFormat = $state<SignFormat>('composite');
	interface Props {
		customSelectedColor?: string | null;
	}

	let { customSelectedColor = $bindable(null) }: Props = $props();
	let signColor = $derived(
		customSelectedColor ?? (themeStore.current === 'dark' ? '#93C84A' : '#13371B')
	);
	let stageTheme = $state<StageTheme>('checker');
	let isDownloading = $state<string | null>(null);

	// Navigation Arrow direction state (0 to 360 degrees)
	export const ARROW_DIRECTIONS: { deg: number; labelUk: string; labelEn: string; icon: string }[] =
		[
			{ deg: 0, labelUk: 'Праворуч', labelEn: 'Right', icon: '→' },
			{ deg: 45, labelUk: 'Вниз-праворуч', labelEn: 'Down-Right', icon: '↘' },
			{ deg: 90, labelUk: 'Вниз', labelEn: 'Down', icon: '↓' },
			{ deg: 135, labelUk: 'Вниз-ліворуч', labelEn: 'Down-Left', icon: '↙' },
			{ deg: 180, labelUk: 'Ліворуч', labelEn: 'Left', icon: '←' },
			{ deg: 225, labelUk: 'Вгору-ліворуч', labelEn: 'Up-Left', icon: '↖' },
			{ deg: 270, labelUk: 'Вгору', labelEn: 'Up', icon: '↑' },
			{ deg: 315, labelUk: 'Вгору-праворуч', labelEn: 'Up-Right', icon: '↗' }
		];

	let arrowAngle = $state<number>(0);
	let currentArrowDir = $derived(ARROW_DIRECTIONS.find((d) => d.deg === arrowAngle));

	// PNG Resolution options (480p, 720p, 1080p, 1440p, 2160p)
	export interface PngResolution {
		id: string;
		label: string;
		px: number;
		descriptionUk: string;
		descriptionEn: string;
	}

	export const PNG_RESOLUTIONS: PngResolution[] = [
		{
			id: '480p',
			label: '480p',
			px: 480,
			descriptionUk: 'Компактний (480 px)',
			descriptionEn: 'Compact (480 px)'
		},
		{
			id: '720p',
			label: '720p',
			px: 720,
			descriptionUk: 'HD (720 px)',
			descriptionEn: 'HD (720 px)'
		},
		{
			id: '1080p',
			label: '1080p',
			px: 1080,
			descriptionUk: 'Full HD (1080 px)',
			descriptionEn: 'Full HD (1080 px)'
		},
		{
			id: '1440p',
			label: '1440p',
			px: 1440,
			descriptionUk: '2K QHD (1440 px)',
			descriptionEn: '2K QHD (1440 px)'
		},
		{
			id: '2160p',
			label: '2160p',
			px: 2160,
			descriptionUk: '4K UHD (2160 px)',
			descriptionEn: '4K UHD (2160 px)'
		}
	];

	let currentResId = $state<string>('1080p');
	let currentResolution = $derived(
		PNG_RESOLUTIONS.find((r) => r.id === currentResId) ?? PNG_RESOLUTIONS[2]!
	);
	let openPngMenuId = $state<string | null>(null);

	function togglePngMenu(id: string, e: MouseEvent) {
		e.stopPropagation();
		openPngMenuId = openPngMenuId === id ? null : id;
	}

	$effect(() => {
		if (!browser) return;
		if (openPngMenuId === null) return;

		const onDocClick = () => {
			openPngMenuId = null;
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') openPngMenuId = null;
		};

		window.addEventListener('click', onDocClick);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('click', onDocClick);
			window.removeEventListener('keydown', onKeyDown);
		};
	});

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
				currentFormat === 'composite'
					? 'Іконка+Напис'
					: currentFormat === 'text'
						? 'Тільки напис'
						: 'Іконка';
			link.download = `${item.num} - ${item.titleUk} (${formatLabel}, ${signColor}).svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(downloadUrl);
		} catch (err) {
			logService.error('brand', 'Download error', err);
		} finally {
			isDownloading = null;
		}
	}

	async function downloadColoredSignPng(item: SignItem, res: PngResolution = currentResolution) {
		isDownloading = `${item.id}-png-${res.id}`;
		try {
			const url = getAssetUrl(item);
			const formatLabel =
				currentFormat === 'composite'
					? 'Іконка+Напис'
					: currentFormat === 'text'
						? 'Тільки напис'
						: 'Іконка';
			await downloadUrlAsPng(
				url,
				`${item.num} - ${item.titleUk} (${formatLabel}, ${signColor}, ${res.label}).png`,
				res.px,
				(svgText) => {
					svgText = svgText.replace(/fill:\s*#[0-9a-fA-F]{6}/gi, `fill: ${signColor}`);
					svgText = svgText.replace(/fill="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `fill="${signColor}"`);
					return svgText;
				}
			);
		} catch (err) {
			logService.error('brand', 'Download PNG error', err);
		} finally {
			isDownloading = null;
			openPngMenuId = null;
		}
	}

	async function downloadArrowSvg(e: MouseEvent) {
		e.preventDefault();
		isDownloading = 'arrow-svg';
		try {
			const url = `${base}/brand/signage/arrow-right.svg`;
			const res = await fetch(url);
			let svgText = await res.text();

			svgText = svgText
				.replace(/fill:\s*#[0-9a-fA-F]{6}/gi, `fill: ${signColor}`)
				.replace(/fill="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `fill="${signColor}"`)
				.replace(/stroke:\s*#[0-9a-fA-F]{6}/gi, `stroke: ${signColor}`)
				.replace(/stroke="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `stroke="${signColor}"`);

			if (arrowAngle !== 0) {
				svgText = svgText.replace(/<path\s+/i, `<path transform="rotate(${arrowAngle} 12 12)" `);
			}

			const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
			const downloadUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			const dirLabel = currentArrowDir
				? langStore.current === 'uk'
					? currentArrowDir.labelUk
					: currentArrowDir.labelEn
				: `${arrowAngle}°`;
			link.download = `${langStore.current === 'uk' ? 'Навігаційна стрілка' : 'Directional Arrow'} (${dirLabel}, ${signColor}).svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(downloadUrl);
		} catch (err) {
			logService.error('brand', 'Download Arrow SVG error', err);
		} finally {
			isDownloading = null;
		}
	}

	async function downloadArrowPng(res: PngResolution = currentResolution) {
		isDownloading = `arrow-png-${res.id}`;
		try {
			const url = `${base}/brand/signage/arrow-right.svg`;
			const dirLabel = currentArrowDir
				? langStore.current === 'uk'
					? currentArrowDir.labelUk
					: currentArrowDir.labelEn
				: `${arrowAngle}°`;
			const filename = `${langStore.current === 'uk' ? 'Навігаційна стрілка' : 'Directional Arrow'} (${dirLabel}, ${signColor}, ${res.label}).png`;
			await downloadUrlAsPng(url, filename, res.px, (svgText) => {
				svgText = svgText
					.replace(/fill:\s*#[0-9a-fA-F]{6}/gi, `fill: ${signColor}`)
					.replace(/fill="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `fill="${signColor}"`)
					.replace(/stroke:\s*#[0-9a-fA-F]{6}/gi, `stroke: ${signColor}`)
					.replace(/stroke="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `stroke="${signColor}"`);
				if (arrowAngle !== 0) {
					svgText = svgText.replace(/<path\s+/i, `<path transform="rotate(${arrowAngle} 12 12)" `);
				}
				return svgText;
			});
		} catch (err) {
			logService.error('brand', 'Download Arrow PNG error', err);
		} finally {
			isDownloading = null;
			openPngMenuId = null;
		}
	}
</script>

<div class="door-signage-widget">
	<!-- UNIFIED CONTROL TOOLBAR -->

	<div class="unified-controls-panel">
		<!-- Unified Controls: Format Selector & Stage Background Switcher -->
		<div class="control-row format-row">
			<div class="control-label-group">
				<span class="control-title"
					>{langStore.current === 'uk' ? 'Формат навігації:' : 'Signage Layout:'}</span
				>
			</div>

			<div class="format-pill-tabs">
				<button
					type="button"
					class="format-tab-btn"
					class:is-active={currentFormat === 'composite'}
					onclick={() => (currentFormat = 'composite')}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						<circle cx="9" cy="9" r="2" />
						<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Іконка + Напис' : 'Icon + Text'}</span>
				</button>

				<button
					type="button"
					class="format-tab-btn"
					class:is-active={currentFormat === 'icon'}
					onclick={() => (currentFormat = 'icon')}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m10 15 5-3-5-3v6Z" fill="currentColor" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Тільки іконка' : 'Icon Only'}</span>
				</button>

				<button
					type="button"
					class="format-tab-btn"
					class:is-active={currentFormat === 'text'}
					onclick={() => (currentFormat = 'text')}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="4 7 4 4 20 4 20 7" />
						<line x1="9" x2="15" y1="20" y2="20" />
						<line x1="12" x2="12" y1="4" y2="20" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Тільки напис' : 'Text Only'}</span>
				</button>
			</div>

			<div
				class="res-switcher-wrap"
				title={langStore.current === 'uk' ? 'Роздільна здатність PNG' : 'PNG Resolution'}
			>
				<span class="res-switcher-title">{langStore.current === 'uk' ? 'PNG якість:' : 'PNG:'}</span
				>
				<div class="res-pills">
					{#each PNG_RESOLUTIONS as res (res.id)}
						<button
							type="button"
							class="res-pill-btn"
							class:is-active={currentResId === res.id}
							onclick={() => (currentResId = res.id)}
							title="{res.label} ({langStore.current === 'uk'
								? res.descriptionUk
								: res.descriptionEn})"
						>
							{res.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="stage-switcher-wrap">
				<StageBgSwitcher bind:current={stageTheme} />
			</div>
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
						aria-label={item.titleUk}
					></div>
				</div>

				<!-- Download Action Buttons (SVG and PNG with dropdown) -->
				<div class="sign-card-footer">
					<button
						type="button"
						class="download-sign-btn svg-btn"
						onclick={(e) => downloadColoredSignSvg(e, item)}
						disabled={isDownloading === item.id}
						title={langStore.current === 'uk'
							? `Завантажити SVG у кольорі ${signColor}`
							: `Download SVG in ${signColor}`}
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
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>
							{isDownloading === item.id ? '...' : 'SVG'}
						</span>
					</button>

					<div class="png-dropdown-wrap">
						<button
							type="button"
							class="download-sign-btn png-btn"
							onclick={(e) => togglePngMenu(item.id, e)}
							disabled={isDownloading?.startsWith(`${item.id}-png`)}
							aria-expanded={openPngMenuId === item.id}
							aria-haspopup="menu"
							title={langStore.current === 'uk'
								? `Завантажити PNG (випадаючий список 480p - 2160p)`
								: `Download PNG (select 480p - 2160p)`}
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
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>
								{isDownloading?.startsWith(`${item.id}-png`)
									? '...'
									: `PNG (${currentResolution.label})`}
							</span>
							<svg
								width="10"
								height="10"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								class="chevron-icon"
								class:is-flipped={openPngMenuId === item.id}
								aria-hidden="true"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>

						{#if openPngMenuId === item.id}
							<div
								class="png-menu-dropdown"
								role="menu"
								tabindex="-1"
								onclick={(e) => e.stopPropagation()}
								onkeydown={(e) => {
									if (e.key === 'Escape') openPngMenuId = null;
								}}
							>
								<div class="png-menu-header">
									<span
										>{langStore.current === 'uk'
											? 'Роздільна здатність PNG:'
											: 'PNG Resolution:'}</span
									>
								</div>
								{#each PNG_RESOLUTIONS as res (res.id)}
									<button
										type="button"
										role="menuitem"
										class="png-menu-item"
										class:is-selected={res.id === currentResId}
										onclick={() => {
											currentResId = res.id;
											downloadColoredSignPng(item, res);
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
				</div>
			</div>
		{/each}
	</div>
	<!-- SEPARATE ADDITIONAL ELEMENT: DIRECTIONAL NAVIGATION ARROW -->
	<div class="nav-arrow-block">
		<div class="nav-arrow-card">
			<div class="nav-arrow-header">
				<div class="nav-arrow-badge-group">
					<span class="sign-num">NAV</span>
					<div class="sign-titles">
						<span class="sign-name-uk">
							{langStore.current === 'uk'
								? 'Навігаційна стрілка (Покажчик напрямку)'
								: 'Directional Navigation Arrow'}
						</span>
						<span class="sign-name-en">
							{langStore.current === 'uk'
								? 'Додатковий універсальний елемент для коридорної навігації та вказівників'
								: 'Standalone corridor & wayfinding pointer for hospital navigation'}
						</span>
					</div>
				</div>

				<!-- 8 Directions + Custom Angle Controls in Header -->
				<div class="direction-pills-wrap">
					<div class="direction-pills">
						{#each ARROW_DIRECTIONS as d (d.deg)}
							<button
								type="button"
								class="dir-pill-btn"
								class:is-active={arrowAngle === d.deg}
								onclick={() => (arrowAngle = d.deg)}
								title="{langStore.current === 'uk' ? d.labelUk : d.labelEn} ({d.deg}°)"
							>
								<span class="dir-arrow-symbol">{d.icon}</span>
								<span class="dir-pill-text"
									>{langStore.current === 'uk' ? d.labelUk : d.labelEn}</span
								>
							</button>
						{/each}
					</div>

					<div
						class="custom-angle-wrap"
						title={langStore.current === 'uk'
							? 'Власний кут обертання (0° - 360°)'
							: 'Custom rotation angle (0° - 360°)'}
					>
						<label for="arrow-angle-input" class="angle-label"
							>{langStore.current === 'uk' ? 'Кут:' : 'Angle:'}</label
						>
						<div class="angle-input-box">
							<input
								id="arrow-angle-input"
								type="number"
								min="0"
								max="360"
								step="1"
								value={arrowAngle}
								oninput={(e) => {
									const n = parseInt((e.target as HTMLInputElement).value, 10);
									arrowAngle = isNaN(n) ? 0 : ((n % 360) + 360) % 360;
								}}
								class="angle-num-input"
								aria-label={langStore.current === 'uk'
									? 'Кут повороту в градусах'
									: 'Angle in degrees'}
							/>
							<span class="deg-sym">°</span>
						</div>
						<input
							type="range"
							min="0"
							max="360"
							step="1"
							value={arrowAngle}
							oninput={(e) => {
								arrowAngle = parseInt((e.target as HTMLInputElement).value, 10) || 0;
							}}
							class="angle-slider"
							aria-label={langStore.current === 'uk' ? 'Повзунок кута повороту' : 'Angle slider'}
						/>
					</div>
				</div>
			</div>

			<div class="nav-arrow-stage-wrap">
				<div
					class="sign-preview-stage stage--{stageTheme} arrow-preview-stage"
					aria-label={langStore.current === 'uk' ? 'Навігаційна стрілка' : 'Directional Arrow'}
				>
					<div
						class="arrow-svg-mask"
						style:background-color={signColor}
						style:--mask-url="url('{base}/brand/signage/arrow-right.svg')"
						style:transform="rotate({arrowAngle}deg)"
					></div>
				</div>
			</div>

			<div class="nav-arrow-footer">
				<div class="arrow-actions">
					<button
						type="button"
						class="download-sign-btn svg-btn"
						onclick={downloadArrowSvg}
						disabled={isDownloading === 'arrow-svg'}
						title={langStore.current === 'uk'
							? `Завантажити стрілку у SVG (${signColor})`
							: `Download arrow SVG (${signColor})`}
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
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>
							{isDownloading === 'arrow-svg' ? '...' : 'SVG'}
						</span>
					</button>

					<div class="png-dropdown-wrap">
						<button
							type="button"
							class="download-sign-btn png-btn"
							onclick={(e) => togglePngMenu('arrow', e)}
							disabled={isDownloading?.startsWith('arrow-png')}
							aria-expanded={openPngMenuId === 'arrow'}
							aria-haspopup="menu"
							title={langStore.current === 'uk'
								? `Завантажити стрілку у PNG (випадаючий список 480p - 2160p)`
								: `Download arrow PNG (select 480p - 2160p)`}
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
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>
								{isDownloading?.startsWith('arrow-png')
									? '...'
									: `PNG (${currentResolution.label})`}
							</span>
							<svg
								width="10"
								height="10"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								class="chevron-icon"
								class:is-flipped={openPngMenuId === 'arrow'}
								aria-hidden="true"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>

						{#if openPngMenuId === 'arrow'}
							<div
								class="png-menu-dropdown"
								role="menu"
								tabindex="-1"
								onclick={(e) => e.stopPropagation()}
								onkeydown={(e) => {
									if (e.key === 'Escape') openPngMenuId = null;
								}}
							>
								<div class="png-menu-header">
									<span
										>{langStore.current === 'uk'
											? 'Роздільна здатність PNG:'
											: 'PNG Resolution:'}</span
									>
								</div>
								{#each PNG_RESOLUTIONS as res (res.id)}
									<button
										type="button"
										role="menuitem"
										class="png-menu-item"
										class:is-selected={res.id === currentResId}
										onclick={() => {
											currentResId = res.id;
											downloadArrowPng(res);
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
				</div>
			</div>
		</div>
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
			linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.05) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.05) 75%);
		background-size: 16px 16px;
		background-position:
			0 0,
			0 8px,
			8px -8px,
			-8px 0px;
	}

	:global(.dark) .stage--checker {
		background-color: #121513;
		background-image:
			linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
	}

	.sign-svg-mask {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 140px;
		-webkit-mask: var(--mask-url) no-repeat center / contain;
		mask: var(--mask-url) no-repeat center / contain;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
	}

	.stage--square .sign-svg-mask {
		max-height: 160px;
	}

	.sign-card:hover .sign-svg-mask {
		transform: scale(1.03);
	}

	/* PNG RESOLUTION SWITCHER */
	.res-switcher-wrap {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		flex-wrap: wrap;
	}

	.res-switcher-title {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--fg-secondary);
		white-space: nowrap;
	}

	.res-pills {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 3px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 10px;
	}

	.res-pill-btn {
		padding: 0.35rem 0.6rem;
		border-radius: 7px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--fg-secondary);
		font-size: 0.76rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.res-pill-btn:hover {
		color: var(--fg-primary);
	}

	.res-pill-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
	}

	:global([data-theme='dark']) .res-pill-btn.is-active,
	:global(.dark) .res-pill-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
	}

	/* FOOTER ACTION - CENTERED BUTTONS */
	.sign-card-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
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
		min-width: 110px;
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

	.download-sign-btn:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .download-sign-btn,
	:global(.dark) .download-sign-btn {
		background: rgba(255, 179, 39, 0.12);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .download-sign-btn:hover:not(:disabled),
	:global(.dark) .download-sign-btn:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	.download-sign-btn:disabled {
		opacity: 0.55;
		cursor: wait;
	}

	/* PNG DROPDOWN COMPONENT */
	.png-dropdown-wrap {
		position: relative;
		display: inline-flex;
	}

	.png-dropdown-wrap .download-sign-btn {
		min-width: 125px;
	}

	.chevron-icon {
		margin-left: 0.2rem;
		transition: transform 0.2s ease;
	}

	.chevron-icon.is-flipped {
		transform: rotate(180deg);
	}

	.png-menu-dropdown {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		min-width: 220px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.45rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
		z-index: 60;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		animation: popIn 0.15s ease-out;
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.png-menu-header {
		padding: 0.25rem 0.5rem 0.35rem;
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--fg-secondary);
		border-bottom: 1px solid var(--border);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.png-menu-item {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.45rem 0.65rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--fg-primary);
		font-size: 0.78rem;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
		width: 100%;
	}

	.png-menu-item:hover {
		background: var(--bg-secondary);
		border-color: var(--border-hover);
		color: var(--brand-leaf, #598f3a);
	}

	:global([data-theme='dark']) .png-menu-item:hover,
	:global(.dark) .png-menu-item:hover {
		color: var(--brand-gold, #ffb327);
	}

	.png-menu-item.is-selected {
		background: rgba(89, 143, 58, 0.12);
		border-color: var(--brand-leaf, #598f3a);
		font-weight: 700;
		color: var(--brand-emerald, #13371b);
	}

	:global([data-theme='dark']) .png-menu-item.is-selected,
	:global(.dark) .png-menu-item.is-selected {
		background: rgba(255, 179, 39, 0.14);
		border-color: var(--brand-gold, #ffb327);
		color: var(--brand-gold, #ffb327);
	}

	.res-badge {
		font-weight: 800;
		font-family: monospace;
		font-size: 0.78rem;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
	}

	.res-desc {
		flex: 1;
		font-size: 0.74rem;
		color: var(--fg-secondary);
		white-space: nowrap;
	}

	.check-icon {
		color: var(--brand-leaf, #598f3a);
	}

	:global([data-theme='dark']) .check-icon,
	:global(.dark) .check-icon {
		color: var(--brand-gold, #ffb327);
	}

	/* SEPARATE ADDITIONAL ELEMENT: NAVIGATION ARROW */
	.nav-arrow-block {
		margin-top: 0.5rem;
		width: 100%;
	}

	.nav-arrow-card {
		display: flex;
		flex-direction: column;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.25s ease;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
	}

	.nav-arrow-card:hover {
		border-color: var(--border-hover);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.07);
	}

	.nav-arrow-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.4rem;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
		flex-wrap: wrap;
	}

	.nav-arrow-badge-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.direction-pills-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.direction-pills {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 3px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		flex-wrap: wrap;
	}

	.dir-pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.55rem;
		border-radius: 7px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--fg-secondary);
		font-size: 0.76rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.dir-pill-btn:hover {
		color: var(--fg-primary);
		background: var(--bg-secondary);
	}

	.dir-pill-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 2px 6px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .dir-pill-btn.is-active,
	:global(.dark) .dir-pill-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
		box-shadow: 0 2px 6px rgba(89, 143, 58, 0.25);
	}

	.dir-arrow-symbol {
		font-size: 0.95rem;
		line-height: 1;
	}

	.dir-pill-text {
		font-size: 0.75rem;
	}

	.custom-angle-wrap {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.25rem 0.6rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 10px;
	}

	.angle-label {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-secondary);
		white-space: nowrap;
	}

	.angle-input-box {
		display: inline-flex;
		align-items: center;
		position: relative;
	}

	.angle-num-input {
		width: 48px;
		height: 28px;
		padding: 0 12px 0 6px;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-primary);
		font-size: 0.8rem;
		font-weight: 700;
		font-family: monospace;
		text-align: right;
		outline: none;
	}

	.angle-num-input:focus {
		border-color: var(--brand-leaf, #598f3a);
	}

	:global([data-theme='dark']) .angle-num-input:focus,
	:global(.dark) .angle-num-input:focus {
		border-color: var(--brand-gold, #ffb327);
	}

	.deg-sym {
		position: absolute;
		right: 4px;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--fg-secondary);
		pointer-events: none;
	}

	.angle-slider {
		width: 70px;
		height: 4px;
		accent-color: var(--brand-leaf, #598f3a);
		cursor: pointer;
	}

	:global([data-theme='dark']) .angle-slider,
	:global(.dark) .angle-slider {
		accent-color: var(--brand-gold, #ffb327);
	}

	.nav-arrow-stage-wrap {
		width: 100%;
	}

	.arrow-preview-stage {
		min-height: 220px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.arrow-svg-mask {
		width: 120px;
		height: 120px;
		-webkit-mask: var(--mask-url) no-repeat center / contain;
		mask: var(--mask-url) no-repeat center / contain;
		transition:
			background-color 0.2s ease,
			transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* CENTERED BUTTONS IN ARROW FOOTER */
	.nav-arrow-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.9rem 1.4rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border);
	}

	.arrow-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
		width: 100%;
		max-width: 360px;
		margin: 0 auto;
	}

	.arrow-actions .download-sign-btn {
		min-width: 125px;
	}

	@media (max-width: 720px) {
		.nav-arrow-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.direction-pills-wrap {
			width: 100%;
			flex-direction: column;
			align-items: stretch;
		}

		.direction-pills {
			width: 100%;
			justify-content: space-between;
		}

		.dir-pill-btn {
			flex: 1;
			justify-content: center;
			padding: 0.35rem 0.3rem;
			font-size: 0.72rem;
		}

		.custom-angle-wrap {
			width: 100%;
			justify-content: space-between;
		}

		.angle-slider {
			flex: 1;
		}

		.sign-card-footer {
			flex-direction: column;
			align-items: stretch;
		}

		.sign-card-footer .download-sign-btn,
		.png-dropdown-wrap {
			width: 100%;
		}

		.nav-arrow-footer {
			flex-direction: column;
			align-items: stretch;
		}

		.arrow-actions {
			flex-direction: column;
			width: 100%;
		}
	}
</style>
