<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import { downloadSvgText, downloadSvgAsPng, getStageBgColor } from '$lib/utils/exportPng';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';
	import PngDownloadBtn from '$lib/components/brand/PngDownloadBtn.svelte';
	import {
		CARD_DIMENSIONS,
		CARD_INFO,
		generateCardSvg,
		EMBLEM_VARIANTS,
		type CardFormat,
		type CardMaterial,
		type CardSide,
		type FrostedInk,
		type SolidTheme,
		type EmblemVariantId
	} from '$lib/data/businessCardData';

	// Studio States
	let material = $state<CardMaterial>('frosted');
	let format = $state<CardFormat>('standard');
	let side = $state<CardSide>('front');
	let frostedInk = $state<FrostedInk>('dark');
	let solidTheme = $state<SolidTheme>('dark');
	let emblemVariant = $state<EmblemVariantId>('01');
	let showBleed = $state<boolean>(false);
	let stageTheme = $state<StageTheme>('checker');
	let copiedPhone = $state<boolean>(false);

	// Derived dimension & aspect ratio
	let currentDim = $derived(CARD_DIMENSIONS[format]);

	// In double-sided mode, side can be front or back.
	// In frosted or single-sided mode, side is always 'back' (which holds the full contact grid).
	let effectiveSide = $derived.by<CardSide>(() => {
		if (material === 'double') return side;
		return 'back';
	});

	// Generated SVG string (1:1 source for preview & export)
	let activeSvg = $derived(
		generateCardSvg({
			format,
			material,
			side: effectiveSide,
			frostedInk,
			solidTheme,
			emblemVariant,
			showBleed,
			lang: langStore.current
		})
	);

	// Safe SVG Data URI for crisp vector rendering in preview
	let svgDataUrl = $derived.by(() => {
		const encoded = encodeURIComponent(activeSvg);
		return `data:image/svg+xml;charset=utf-8,${encoded}`;
	});

	// Filename generator
	function getExportFilename(ext: 'svg' | 'png', resLabel?: string): string {
		const matName = material === 'frosted' ? 'frosted-acrylic' : material;
		const sideName = material === 'double' ? `-${side}` : '';
		const inkName = material === 'frosted' ? `-${frostedInk}-ink` : `-${solidTheme}`;
		const emblemPart = `-emblem-${emblemVariant}`;
		const resPart = resLabel ? `-${resLabel}` : '';
		return `vet-crew-card-${matName}${inkName}${emblemPart}-${format}${sideName}${resPart}.${ext}`;
	}

	async function downloadCurrentSvg() {
		const filename = getExportFilename('svg');
		downloadSvgText(activeSvg, filename);
	}

	async function downloadCurrentPng(res: { px: number; label: string }) {
		const filename = getExportFilename('png', res.label);
		// For frosted acrylic, we keep transparent background if stage is checker
		const bg =
			material === 'frosted' && stageTheme === 'checker' ? undefined : getStageBgColor(stageTheme);
		await downloadSvgAsPng(activeSvg, filename, res.px, bg);
	}

	async function copyPhone() {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(CARD_INFO.phoneTel);
			copiedPhone = true;
			setTimeout(() => {
				copiedPhone = false;
			}, 2000);
		} catch {
			// ignore clipboard write rejection
		}
	}
</script>

<div class="card-studio-wrapper">
	<!-- TOP CONTROLS TOOLBAR -->
	<div class="studio-toolbar">
		<!-- Material Presets -->
		<div class="toolbar-group">
			<span class="group-label">
				{langStore.current === 'uk' ? 'Матеріал візитки:' : 'Card Material:'}
			</span>
			<div class="pill-tabs" role="tablist">
				<button
					type="button"
					class="pill-tab"
					class:active={material === 'frosted'}
					onclick={() => {
						material = 'frosted';
						stageTheme = 'checker'; // Best for showing transparent acrylic
					}}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="3" y="3" width="18" height="18" rx="3" />
						<path d="M3 9h18M9 21V9" stroke-dasharray="2,2" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Прозорий пластик' : 'Frosted Acrylic'}</span>
				</button>
				<button
					type="button"
					class="pill-tab"
					class:active={material === 'double'}
					onclick={() => (material = 'double')}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="2" y="5" width="20" height="14" rx="2" />
						<path d="M12 5v14" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Двостороння' : 'Double-Sided'}</span>
				</button>
				<button
					type="button"
					class="pill-tab"
					class:active={material === 'single'}
					onclick={() => (material = 'single')}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="2" y="5" width="20" height="14" rx="2" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Одностороння' : 'Single-Sided'}</span>
				</button>
			</div>
		</div>

		<!-- Physical Dimensions -->
		<div class="toolbar-group">
			<span class="group-label">
				{langStore.current === 'uk' ? 'Розмір:' : 'Size:'}
			</span>
			<div class="pill-tabs">
				<button
					type="button"
					class="pill-tab"
					class:active={format === 'standard'}
					onclick={() => (format = 'standard')}
					title="90 × 50 mm (UA Standard)"
				>
					<span>90 × 50 мм</span>
				</button>
				<button
					type="button"
					class="pill-tab"
					class:active={format === 'euro'}
					onclick={() => (format = 'euro')}
					title="85 × 55 mm (Euro Format)"
				>
					<span>85 × 55 мм</span>
				</button>
			</div>
		</div>

		<!-- Color / Ink Selection -->
		<div class="toolbar-group">
			<span class="group-label">
				{material === 'frosted'
					? langStore.current === 'uk'
						? 'Шовкодрук / чорнило:'
						: 'Ink Color:'
					: langStore.current === 'uk'
						? 'Колір основи:'
						: 'Card Theme:'}
			</span>
			{#if material === 'frosted'}
				<div class="pill-tabs">
					<button
						type="button"
						class="pill-tab ink-tab"
						class:active={frostedInk === 'dark'}
						onclick={() => (frostedInk = 'dark')}
					>
						<span class="ink-dot" style="background: #13371B;"></span>
						<span>{langStore.current === 'uk' ? 'Смарагд (#13371B)' : 'Emerald'}</span>
					</button>
					<button
						type="button"
						class="pill-tab ink-tab"
						class:active={frostedInk === 'white'}
						onclick={() => (frostedInk = 'white')}
					>
						<span class="ink-dot" style="background: #FFFFFF; border: 1px solid #ccc;"></span>
						<span>{langStore.current === 'uk' ? 'Білий (#FFFFFF)' : 'White'}</span>
					</button>
					<button
						type="button"
						class="pill-tab ink-tab"
						class:active={frostedInk === 'brand'}
						onclick={() => (frostedInk = 'brand')}
					>
						<span
							class="ink-dot"
							style="background: linear-gradient(135deg, #13371B 50%, #FFB327 50%); border: 1px solid #ccc;"
						></span>
						<span>{langStore.current === 'uk' ? 'Фірмовий' : 'Brand Colors'}</span>
					</button>
				</div>
			{:else}
				<div class="pill-tabs">
					<button
						type="button"
						class="pill-tab ink-tab"
						class:active={solidTheme === 'dark'}
						onclick={() => (solidTheme = 'dark')}
					>
						<span class="ink-dot" style="background: #13371B;"></span>
						<span>{langStore.current === 'uk' ? 'Темна' : 'Dark'}</span>
					</button>
					<button
						type="button"
						class="pill-tab ink-tab"
						class:active={solidTheme === 'light'}
						onclick={() => (solidTheme = 'light')}
					>
						<span class="ink-dot" style="background: #FFFFFF; border: 1px solid #ccc;"></span>
						<span>{langStore.current === 'uk' ? 'Світла' : 'Light'}</span>
					</button>
				</div>
			{/if}
		</div>

		<!-- Emblem Animals Variant Selection -->
		<div class="toolbar-group">
			<span class="group-label">
				{langStore.current === 'uk' ? 'Логотип (тварини):' : 'Emblem Animals:'}
			</span>
			<div class="pill-tabs" role="tablist">
				{#each EMBLEM_VARIANTS as variant (variant.id)}
					<button
						type="button"
						class="pill-tab"
						class:active={emblemVariant === variant.id}
						onclick={() => (emblemVariant = variant.id)}
					>
						<span>{variant.num} {langStore.current === 'uk' ? variant.nameUk : variant.nameEn}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<!-- Bleed Guide Toggle -->
		<div class="toolbar-group toolbar-group--bleed">
			<label class="bleed-toggle-label">
				<input type="checkbox" bind:checked={showBleed} />
				<span>{langStore.current === 'uk' ? 'Мітки вильотів (Bleed)' : 'Bleed Margins'}</span>
			</label>
		</div>

		<!-- Stage Switcher -->
		<div class="toolbar-group toolbar-group--stage">
			<StageBgSwitcher bind:current={stageTheme} compact={true} />
		</div>
	</div>

	<!-- SUB-HEADER FOR DOUBLE-SIDED: SIDE SWITCHER TABS -->
	{#if material === 'double'}
		<div class="side-selector-bar">
			<div class="side-switch-btn-wrap">
				<button
					type="button"
					class="side-btn"
					class:active={side === 'front'}
					onclick={() => (side = 'front')}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M12 6v6l4 2" />
					</svg>
					<span
						>{langStore.current === 'uk' ? 'Лицьова сторона (Бренд)' : 'Front Side (Brand)'}</span
					>
				</button>
				<button
					type="button"
					class="side-btn"
					class:active={side === 'back'}
					onclick={() => (side = 'back')}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
					</svg>
					<span
						>{langStore.current === 'uk'
							? 'Зворотна сторона (Контакти & QR)'
							: 'Back Side (Contacts & QR)'}</span
					>
				</button>
			</div>
			<span class="side-hint">
				{langStore.current === 'uk'
					? side === 'front'
						? 'Лицьова: лаконічний фірмовий логотип та слоган'
						: 'Зворот: телефон +380 77 501 01 01, QR-код Telegram та адреса'
					: side === 'front'
						? 'Front: Minimalist hospital logo & brand slogan'
						: 'Back: Emergency phone, Telegram QR code, and address'}
			</span>
		</div>
	{/if}

	<!-- INTERACTIVE STAGE PREVIEW -->
	<div class="preview-stage stage--{stageTheme}">
		<!-- Decorative stage label -->
		<div class="stage-tag">
			<span>{currentDim.nameUk}</span>
			{#if material === 'frosted'}
				<span class="tag-badge frosted-badge">
					{langStore.current === 'uk' ? 'Прозорий акрил' : 'Frosted Plastic'}
				</span>
			{/if}
		</div>

		<!-- Physical card mockup container -->
		<div
			class="card-mockup-outer"
			class:is-frosted={material === 'frosted'}
			class:is-white-ink={material === 'frosted' && frostedInk === 'white'}
			style="aspect-ratio: {currentDim.aspectRatio};"
		>
			<!-- Frosted Glare Layer (Acrylic Light Sheen) -->
			{#if material === 'frosted'}
				<div class="frosted-glare" aria-hidden="true"></div>
				<div class="frosted-stack-accent" aria-hidden="true"></div>
			{/if}

			<!-- Vector SVG Layer -->
			<img src={svgDataUrl} alt="{CARD_INFO.clinicName} Business Card" class="card-svg-render" />
		</div>
	</div>

	<!-- BOTTOM ACTIONS & METADATA -->
	<div class="studio-bottom-bar">
		<div class="card-meta-info">
			<div class="meta-row">
				<span class="meta-label">{langStore.current === 'uk' ? 'Телефон:' : 'Phone:'}</span>
				<button
					type="button"
					class="meta-phone-btn"
					onclick={copyPhone}
					title={langStore.current === 'uk' ? 'Натисніть щоб скопіювати' : 'Click to copy'}
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
						/>
					</svg>
					<span>{CARD_INFO.phoneDisplay}</span>
					{#if copiedPhone}
						<span class="copied-badge"
							>{langStore.current === 'uk' ? 'Скопійовано!' : 'Copied!'}</span
						>
					{/if}
				</button>
			</div>
			<div class="meta-row meta-row--hours">
				<span class="meta-label">{langStore.current === 'uk' ? 'Графік:' : 'Hours:'}</span>
				<span class="hours-badge">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					<span>{langStore.current === 'uk' ? CARD_INFO.scheduleUk : CARD_INFO.scheduleEn}</span>
				</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">Telegram:</span>
				<a
					href="https://t.me/VetCrewHospital"
					target="_blank"
					rel="noopener noreferrer"
					class="meta-link"
				>
					<span>@VetCrewHospital</span>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
						/>
					</svg>
				</a>
			</div>
		</div>

		<!-- Download Export Buttons -->
		<div class="studio-export-actions">
			<button
				type="button"
				class="export-btn svg-export-btn"
				onclick={downloadCurrentSvg}
				title={langStore.current === 'uk'
					? 'Завантажити векторний SVG для друкарні'
					: 'Download Print Vector SVG'}
			>
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>{langStore.current === 'uk' ? 'Векторний SVG' : 'Vector (SVG)'}</span>
			</button>

			<PngDownloadBtn
				onselect={downloadCurrentPng}
				btnClass="export-btn png-export-btn"
				title={langStore.current === 'uk'
					? 'Експорт PNG (поліграфічна роздільність 300 DPI / 4K)'
					: 'Export PNG (Print 300 DPI / 4K)'}
			/>
		</div>
	</div>
</div>

<style>
	.card-studio-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		container-type: inline-size;
	}

	/* TOOLBAR */
	.studio-toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.85rem 1.25rem;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 12px;
		padding: 0.85rem 1.15rem;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		box-sizing: border-box;
	}

	:global([data-theme='dark']) .studio-toolbar {
		background: rgba(25, 30, 27, 0.7);
		border-color: rgba(147, 200, 74, 0.15);
	}

	.toolbar-group {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.group-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-text-muted, #6b7280);
		white-space: nowrap;
	}

	.pill-tabs {
		display: inline-flex;
		align-items: center;
		background: var(--color-surface-variant, #f3f4f6);
		border-radius: 8px;
		padding: 3px;
		gap: 3px;
	}

	:global([data-theme='dark']) .pill-tabs {
		background: rgba(0, 0, 0, 0.35);
	}

	.pill-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 600;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--color-text-muted, #4b5563);
		cursor: pointer;
		transition: all 0.18s ease;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .pill-tab {
		color: #9ca3af;
	}

	.pill-tab:hover {
		color: var(--color-text-primary, #111827);
	}

	:global([data-theme='dark']) .pill-tab:hover {
		color: #ffffff;
	}

	.pill-tab.active {
		background: var(--color-surface, #ffffff);
		color: #13371b;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .pill-tab.active {
		background: #1e3a24;
		color: #93c84a;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.ink-dot {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.bleed-toggle-label {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--color-text-muted, #4b5563);
		cursor: pointer;
		user-select: none;
	}

	.bleed-toggle-label input[type='checkbox'] {
		cursor: pointer;
		accent-color: #13371b;
	}

	/* SIDE SELECTOR BAR */
	.side-selector-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0.5rem 0.85rem;
		background: rgba(19, 55, 27, 0.05);
		border: 1px dashed rgba(19, 55, 27, 0.2);
		border-radius: 10px;
	}

	:global([data-theme='dark']) .side-selector-bar {
		background: rgba(147, 200, 74, 0.05);
		border-color: rgba(147, 200, 74, 0.2);
	}

	.side-switch-btn-wrap {
		display: inline-flex;
		gap: 0.5rem;
	}

	.side-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.85rem;
		border-radius: 6px;
		border: 1px solid var(--color-border, #d1d5db);
		background: var(--color-surface, #ffffff);
		color: var(--color-text-muted, #4b5563);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	:global([data-theme='dark']) .side-btn {
		background: #141716;
		border-color: #374151;
		color: #9ca3af;
	}

	.side-btn.active {
		border-color: #13371b;
		background: #13371b;
		color: #ffffff;
	}

	:global([data-theme='dark']) .side-btn.active {
		border-color: #93c84a;
		background: #93c84a;
		color: #101e14;
	}

	.side-hint {
		font-size: 0.8rem;
		color: var(--color-text-muted, #6b7280);
	}

	/* PREVIEW STAGE */
	.preview-stage {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 420px;
		padding: 2.5rem 1.5rem;
		border-radius: 16px;
		overflow: hidden;
		transition: background 0.3s ease;
	}

	/* Stage theme backgrounds matching global app patterns */
	.preview-stage.stage--checker {
		background-color: #f1f5f9;
		background-image:
			linear-gradient(45deg, #cbd5e1 25%, transparent 25%),
			linear-gradient(-45deg, #cbd5e1 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #cbd5e1 75%),
			linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);
		background-size: 32px 32px;
		background-position:
			0 0,
			0 16px,
			16px -16px,
			-16px 0px;
	}

	:global([data-theme='dark']) .preview-stage.stage--checker {
		background-color: #141815;
		background-image:
			linear-gradient(45deg, #242c26 25%, transparent 25%),
			linear-gradient(-45deg, #242c26 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #242c26 75%),
			linear-gradient(-45deg, transparent 75%, #242c26 75%);
	}

	.preview-stage.stage--dark {
		background: #141716;
	}

	.preview-stage.stage--light {
		background: #f9fafb;
	}

	.preview-stage.stage--emerald {
		background: #13371b;
	}

	.stage-tag {
		position: absolute;
		top: 1rem;
		left: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: #4b5563;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(8px);
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='dark']) .stage-tag {
		background: rgba(0, 0, 0, 0.65);
		color: #9ca3af;
	}

	.tag-badge {
		font-size: 0.7rem;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-weight: 700;
		text-transform: uppercase;
	}

	.frosted-badge {
		background: #e0f2fe;
		color: #0369a1;
	}

	:global([data-theme='dark']) .frosted-badge {
		background: rgba(14, 165, 233, 0.2);
		color: #38bdf8;
	}

	/* CARD MOCKUP CONTAINER */
	.card-mockup-outer {
		position: relative;
		width: 100%;
		max-width: 580px;
		border-radius: 12px;
		box-shadow:
			0 20px 45px -10px rgba(0, 0, 0, 0.35),
			0 10px 20px -5px rgba(0, 0, 0, 0.2),
			0 0 1px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
		overflow: hidden;
	}

	.card-mockup-outer:hover {
		transform: translateY(-4px) scale(1.01);
		box-shadow:
			0 26px 55px -10px rgba(0, 0, 0, 0.4),
			0 12px 25px -5px rgba(0, 0, 0, 0.25);
	}

	/* Frosted Acrylic Glass Physics */
	.card-mockup-outer.is-frosted {
		background: rgba(255, 255, 255, 0.28);
		backdrop-filter: blur(8px) saturate(135%);
		-webkit-backdrop-filter: blur(8px) saturate(135%);
		border: 1.5px solid rgba(255, 255, 255, 0.65);
		box-shadow:
			0 28px 60px -12px rgba(0, 0, 0, 0.28),
			0 12px 24px -6px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px 0 rgba(255, 255, 255, 0.85),
			inset 0 -1px 2px 0 rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='dark']) .card-mockup-outer.is-frosted {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.4);
		box-shadow:
			0 28px 60px -12px rgba(0, 0, 0, 0.5),
			0 12px 24px -6px rgba(0, 0, 0, 0.3),
			inset 0 1px 2px 0 rgba(255, 255, 255, 0.4),
			inset 0 -1px 2px 0 rgba(0, 0, 0, 0.2);
	}

	.card-mockup-outer.is-frosted.is-white-ink {
		background: rgba(20, 32, 24, 0.35);
		border-color: rgba(255, 255, 255, 0.65);
	}

	.frosted-stack-accent {
		position: absolute;
		inset: 0;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.04);
		pointer-events: none;
		z-index: 0;
	}

	.card-mockup-outer.is-frosted.is-white-ink {
		background: rgba(20, 30, 24, 0.25);
		border-color: rgba(255, 255, 255, 0.6);
	}

	/* Diagonal light sheen reflection on glass */
	.frosted-glare {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.4) 0%,
			rgba(255, 255, 255, 0.1) 40%,
			transparent 60%,
			rgba(255, 255, 255, 0.15) 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	.card-svg-render {
		position: relative;
		z-index: 2;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
	}

	/* BOTTOM BAR */
	.studio-bottom-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 0.9rem 1.25rem;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 12px;
	}

	:global([data-theme='dark']) .studio-bottom-bar {
		background: rgba(25, 30, 27, 0.7);
		border-color: rgba(147, 200, 74, 0.15);
	}

	.card-meta-info {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.meta-row {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.85rem;
	}

	.meta-label {
		font-weight: 600;
		color: var(--color-text-muted, #6b7280);
	}

	.meta-phone-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		background: transparent;
		border: 1px solid transparent;
		padding: 0.2rem 0.45rem;
		border-radius: 6px;
		font-size: 0.88rem;
		font-weight: 700;
		color: #13371b;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	:global([data-theme='dark']) .meta-phone-btn {
		color: #93c84a;
	}

	.meta-phone-btn:hover {
		background: rgba(19, 55, 27, 0.08);
		border-color: rgba(19, 55, 27, 0.2);
	}

	:global([data-theme='dark']) .meta-phone-btn:hover {
		background: rgba(147, 200, 74, 0.1);
		border-color: rgba(147, 200, 74, 0.3);
	}

	.copied-badge {
		font-size: 0.7rem;
		background: #10b981;
		color: #ffffff;
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		font-weight: 600;
	}

	.hours-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.82rem;
		font-weight: 700;
		color: #13371b;
		background: rgba(19, 55, 27, 0.07);
		border: 1px solid rgba(19, 55, 27, 0.18);
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
	}

	:global([data-theme='dark']) .hours-badge {
		color: #93c84a;
		background: rgba(147, 200, 74, 0.08);
		border-color: rgba(147, 200, 74, 0.25);
	}

	.meta-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: #0284c7;
		font-weight: 600;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	:global([data-theme='dark']) .meta-link {
		color: #38bdf8;
	}

	.meta-link:hover {
		text-decoration: underline;
	}

	.studio-export-actions {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
	}

	.export-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.55rem 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.18s ease;
	}

	.svg-export-btn {
		background: var(--color-surface-variant, #f3f4f6);
		color: var(--color-text-primary, #111827);
		border: 1px solid var(--color-border, #d1d5db);
	}

	:global([data-theme='dark']) .svg-export-btn {
		background: #1e2420;
		border-color: #374151;
		color: #f3f4f6;
	}

	.svg-export-btn:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
	}

	:global([data-theme='dark']) .svg-export-btn:hover {
		background: #2a332d;
		border-color: #93c84a;
	}

	@media (max-width: 768px) {
		.studio-toolbar {
			flex-direction: column;
			align-items: flex-start;
		}

		.card-mockup-outer {
			max-width: 100%;
		}

		.studio-bottom-bar {
			flex-direction: column;
			align-items: flex-start;
		}

		.studio-export-actions {
			width: 100%;
			justify-content: stretch;
		}

		.export-btn {
			flex: 1;
			justify-content: center;
		}
	}

	@container (max-width: 768px) {
		.studio-toolbar {
			flex-direction: column;
			align-items: flex-start;
		}

		.card-mockup-outer {
			max-width: 100%;
		}

		.studio-bottom-bar {
			flex-direction: column;
			align-items: flex-start;
		}

		.studio-export-actions {
			width: 100%;
			justify-content: stretch;
		}

		.export-btn {
			flex: 1;
			justify-content: center;
		}
	}
</style>
