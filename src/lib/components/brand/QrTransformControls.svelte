<script lang="ts">
	import { langStore } from '$lib/lang.svelte';
	import type { QrBgTransform } from '$lib/data/qrShowcase';

	interface Props {
		rotation: number;
		flipX: boolean;
		scale?: number;
		offsetX?: number;
		offsetY?: number;
		onchange: (transform: Partial<QrBgTransform>) => void;
		compact?: boolean;
		label?: string;
	}

	let {
		rotation,
		flipX,
		scale = 1.0,
		offsetX = 0,
		offsetY = 0,
		onchange,
		compact = false,
		label
	}: Props = $props();

	// Progressive disclosure: starts collapsed for cleaner UX, but expands on user toggle
	let isExpanded = $state<boolean>(false);

	function setRotation(newDeg: number) {
		const norm = ((Math.round(newDeg) % 360) + 360) % 360;
		onchange({ rotation: norm });
	}

	function toggleFlip() {
		onchange({ flipX: !flipX });
	}

	function setScale(newScale: number) {
		const clamped = Math.max(0.5, Math.min(1.5, Number(newScale.toFixed(2))));
		onchange({ scale: clamped });
	}

	function adjustScale(delta: number) {
		setScale(scale + delta);
	}

	function setOffsetX(val: number) {
		const clamped = Math.max(-120, Math.min(120, Math.round(val)));
		onchange({ offsetX: clamped });
	}

	function setOffsetY(val: number) {
		const clamped = Math.max(-120, Math.min(120, Math.round(val)));
		onchange({ offsetY: clamped });
	}

	function resetPosition() {
		onchange({ offsetX: 0, offsetY: 0 });
	}

	function resetAll() {
		onchange({
			rotation: 0,
			flipX: false,
			scale: 1.0,
			offsetX: 0,
			offsetY: 0
		});
	}

	const isModified = $derived(
		rotation !== 0 || flipX || scale !== 1.0 || offsetX !== 0 || offsetY !== 0
	);

	const isAdvancedModified = $derived(scale !== 1.0 || offsetX !== 0 || offsetY !== 0);
</script>

<div class="transform-controls-wrap" class:is-compact={compact}>
	{#if label}
		<div class="header-row">
			<span class="transform-label">{label}</span>
			{#if isModified}
				<button
					type="button"
					class="reset-micro-btn"
					onclick={resetAll}
					title={langStore.current === 'uk'
						? 'Скинути всі трансформації до початкових'
						: 'Reset all transforms to default'}
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
					</svg>
					<span>{langStore.current === 'uk' ? 'Скинути' : 'Reset'}</span>
				</button>
			{/if}
		</div>
	{/if}

	<!-- Section 1: Combined Angle Presets + Flip Toolbar -->
	<div class="control-section">
		<div class="preset-toolbar" role="group" aria-label="Кути повороту та дзеркало">
			<div class="angle-buttons-group">
				{#each [0, 90, 180, 270] as const as deg (deg)}
					<button
						type="button"
						class="angle-step-btn"
						class:is-active={rotation === deg}
						onclick={() => setRotation(deg)}
						title={langStore.current === 'uk' ? `Встановити кут ${deg}°` : `Set angle ${deg}°`}
					>
						{deg}°
					</button>
				{/each}
			</div>

			<!-- Unified Flip Button in the same row -->
			<button
				type="button"
				class="flip-btn"
				class:is-active={flipX}
				onclick={toggleFlip}
				title={langStore.current === 'uk'
					? 'Віддзеркалити форму горизонтально (Flip ↔)'
					: 'Mirror shape horizontally (Flip ↔)'}
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.3"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path>
					<path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
					<line x1="12" y1="2" x2="12" y2="22" stroke-dasharray="2 2"></line>
				</svg>
				<span class="flip-text">Flip ↔</span>
			</button>
		</div>

		<!-- Fine-tune Continuous Angle Slider Row -->
		<div class="slider-field">
			<input
				type="range"
				min="0"
				max="359"
				step="1"
				value={rotation}
				oninput={(e) => setRotation(Number((e.target as HTMLInputElement).value))}
				class="app-range-slider"
				aria-label={langStore.current === 'uk' ? 'Кут повороту підкладки' : 'Plaque rotation angle'}
			/>
			<span class="value-badge">{rotation}°</span>
		</div>
	</div>

	<!-- Section 2: Progressive Disclosure Toggle for Advanced Adjustments (Scale & Offset) -->
	<div class="advanced-wrapper">
		<button
			type="button"
			class="advanced-toggle-trigger"
			class:is-open={isExpanded}
			class:has-custom={isAdvancedModified}
			onclick={() => (isExpanded = !isExpanded)}
			aria-expanded={isExpanded}
			title={langStore.current === 'uk'
				? 'Натисніть для налаштування масштабу та зміщення'
				: 'Toggle scale and position controls'}
		>
			<div class="toggle-meta-left">
				<svg
					class="tune-icon"
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="3"></circle>
					<path
						d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
					></path>
				</svg>
				<span class="toggle-text">
					{langStore.current === 'uk' ? 'Масштаб / Зсув' : 'Scale / Shift'}
				</span>
			</div>

			<div class="toggle-meta-right">
				{#if isAdvancedModified}
					<span class="active-summary-pill" title="Активне індивідуальне налаштування">
						{#if scale !== 1.0 && (offsetX !== 0 || offsetY !== 0)}
							{Math.round(scale * 100)}% ({offsetX > 0 ? `+${offsetX}` : offsetX},{offsetY > 0
								? `+${offsetY}`
								: offsetY})
						{:else if scale !== 1.0}
							{Math.round(scale * 100)}%
						{:else}
							{offsetX > 0 ? `+${offsetX}` : offsetX},{offsetY > 0 ? `+${offsetY}` : offsetY}
						{/if}
					</span>
				{/if}
				<svg
					class="toggle-chevron"
					class:is-rotated={isExpanded}
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</button>

		<!-- Expanded Drawer: Full Width Scale and Axis Sliders -->
		{#if isExpanded}
			<div class="advanced-drawer">
				<!-- Scale Row -->
				<div class="drawer-field-block">
					<div class="field-meta-row">
						<span class="field-label-text">
							{langStore.current === 'uk' ? 'Масштаб:' : 'Scale:'}
						</span>
						<div class="quick-pills-cluster">
							<button
								type="button"
								class="quick-micro-pill"
								onclick={() => adjustScale(-0.05)}
								title="-5%"
							>
								-5%
							</button>
							<button
								type="button"
								class="quick-micro-pill"
								class:is-active={scale === 1.0}
								onclick={() => setScale(1.0)}
								title="100%"
							>
								100%
							</button>
							<button
								type="button"
								class="quick-micro-pill"
								onclick={() => adjustScale(+0.05)}
								title="+5%"
							>
								+5%
							</button>
						</div>
						<span class="value-badge">{Math.round(scale * 100)}%</span>
					</div>
					<div class="slider-field">
						<input
							type="range"
							min="0.5"
							max="1.5"
							step="0.01"
							value={scale}
							oninput={(e) => setScale(Number((e.target as HTMLInputElement).value))}
							class="app-range-slider"
							aria-label={langStore.current === 'uk' ? 'Масштаб підкладки' : 'Scale'}
						/>
					</div>
				</div>

				<!-- Position Offset Block: Full Width X and Y Sliders -->
				<div class="drawer-field-block position-drawer-block">
					<div class="field-meta-row">
						<span class="field-label-text">
							{langStore.current === 'uk' ? 'Зсув:' : 'Shift:'}
						</span>
						{#if offsetX !== 0 || offsetY !== 0}
							<button
								type="button"
								class="center-reset-btn"
								onclick={resetPosition}
								title={langStore.current === 'uk'
									? 'Скинути зміщення до центру (0, 0)'
									: 'Reset position to center'}
							>
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									aria-hidden="true"
								>
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="16"></line>
									<line x1="8" y1="12" x2="16" y2="12"></line>
								</svg>
								<span>{langStore.current === 'uk' ? 'В центр' : 'Center'}</span>
							</button>
						{/if}
					</div>

					<!-- Axis X Slider (Full Width) -->
					<div class="axis-control-row">
						<span class="axis-label-tag">X</span>
						<input
							type="range"
							min="-120"
							max="120"
							step="1"
							value={offsetX}
							oninput={(e) => setOffsetX(Number((e.target as HTMLInputElement).value))}
							class="app-range-slider"
							aria-label="Зсув по осі X"
						/>
						<span class="axis-num-readout">{offsetX > 0 ? `+${offsetX}` : offsetX}px</span>
					</div>

					<!-- Axis Y Slider (Full Width) -->
					<div class="axis-control-row">
						<span class="axis-label-tag">Y</span>
						<input
							type="range"
							min="-120"
							max="120"
							step="1"
							value={offsetY}
							oninput={(e) => setOffsetY(Number((e.target as HTMLInputElement).value))}
							class="app-range-slider"
							aria-label="Зсув по осі Y"
						/>
						<span class="axis-num-readout">{offsetY > 0 ? `+${offsetY}` : offsetY}px</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.transform-controls-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.6rem 0.65rem;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}

	.transform-controls-wrap.is-compact {
		padding: 0.5rem;
		gap: 0.4rem;
	}

	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.35rem;
		width: 100%;
		min-width: 0;
	}

	.transform-label {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--fg-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.reset-micro-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: rgba(255, 179, 39, 0.15);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: #925c00;
		font-size: 0.65rem;
		font-weight: 700;
		padding: 0.15rem 0.4rem;
		border-radius: 6px;
		cursor: pointer;
		line-height: 1;
		transition: all 0.15s ease;
		white-space: nowrap;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .reset-micro-btn,
	:global(.dark) .reset-micro-btn {
		background: rgba(255, 179, 39, 0.1);
		border-color: rgba(255, 179, 39, 0.25);
		color: #ffb327;
	}

	.reset-micro-btn:hover {
		background: rgba(255, 179, 39, 0.25);
		border-color: #ffb327;
	}

	.control-section {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	/* Preset Toolbar: angles + flip in one harmonious bar */
	.preset-toolbar {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		width: 100%;
		min-width: 0;
	}

	.angle-buttons-group {
		display: flex;
		flex: 1;
		min-width: 0;
		gap: 2px;
		background: var(--panel-bg, #ffffff);
		padding: 2px;
		border-radius: 7px;
		border: 1px solid var(--border);
	}

	:global([data-theme='dark']) .angle-buttons-group,
	:global(.dark) .angle-buttons-group {
		background: rgba(0, 0, 0, 0.28);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.angle-step-btn {
		flex: 1;
		min-width: 0;
		background: transparent;
		border: none;
		color: var(--fg-secondary);
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.22rem 0.2rem;
		border-radius: 5px;
		cursor: pointer;
		transition: all 0.15s ease;
		line-height: 1;
		text-align: center;
		white-space: nowrap;
	}

	.is-compact .angle-step-btn {
		padding: 0.2rem 0.15rem;
		font-size: 0.65rem;
	}

	.angle-step-btn:hover {
		color: var(--fg-primary);
		background: var(--bg-secondary);
	}

	.angle-step-btn.is-active {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
	}

	.flip-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: var(--panel-bg, #ffffff);
		border: 1px solid var(--border);
		border-radius: 7px;
		padding: 0.22rem 0.4rem;
		color: var(--fg-secondary);
		font-size: 0.7rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
		line-height: 1;
		white-space: nowrap;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .flip-btn,
	:global(.dark) .flip-btn {
		background: rgba(0, 0, 0, 0.28);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.is-compact .flip-btn {
		padding: 0.2rem 0.35rem;
		font-size: 0.65rem;
	}

	.flip-btn:hover {
		color: var(--fg-primary);
		border-color: var(--border-hover);
		background: var(--bg-secondary);
	}

	.flip-btn.is-active {
		background: #ffb327;
		color: #142418;
		border-color: #ffb327;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
		font-weight: 700;
	}

	/* Slider Row */
	.slider-field {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		width: 100%;
		min-width: 0;
	}

	.app-range-slider {
		flex: 1;
		min-width: 0;
		-webkit-appearance: none;
		appearance: none;
		height: 5px;
		background: var(--border, rgba(0, 0, 0, 0.15));
		border-radius: 3px;
		outline: none;
		cursor: pointer;
	}

	:global([data-theme='dark']) .app-range-slider,
	:global(.dark) .app-range-slider {
		background: rgba(0, 0, 0, 0.35);
	}

	.app-range-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffb327;
		cursor: pointer;
		border: 1.5px solid #142418;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
		transition: transform 0.1s ease;
	}

	.app-range-slider::-webkit-slider-thumb:hover {
		transform: scale(1.18);
	}

	.app-range-slider::-moz-range-thumb {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffb327;
		cursor: pointer;
		border: 1.5px solid #142418;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
	}

	.value-badge {
		font-family: var(--font-mono, monospace);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--fg-primary);
		min-width: 30px;
		text-align: right;
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* Progressive Disclosure Accordion for Scale & Offset */
	.advanced-wrapper {
		display: flex;
		flex-direction: column;
		margin-top: 0.15rem;
		width: 100%;
		min-width: 0;
	}

	.advanced-toggle-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.3rem;
		width: 100%;
		min-width: 0;
		overflow: hidden;
		background: var(--panel-bg, #ffffff);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.3rem 0.45rem;
		cursor: pointer;
		color: var(--fg-secondary);
		transition: all 0.15s ease;
		box-sizing: border-box;
	}

	:global([data-theme='dark']) .advanced-toggle-trigger,
	:global(.dark) .advanced-toggle-trigger {
		background: rgba(0, 0, 0, 0.22);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.advanced-toggle-trigger:hover {
		background: var(--bg-secondary);
		border-color: var(--border-hover);
		color: var(--fg-primary);
	}

	.advanced-toggle-trigger.has-custom {
		border-color: rgba(255, 179, 39, 0.45);
		background: rgba(255, 179, 39, 0.08);
	}

	.advanced-toggle-trigger.is-open {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-color: var(--border-hover);
		background: var(--bg-secondary);
	}

	.toggle-meta-left {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		min-width: 0;
		overflow: hidden;
	}

	.tune-icon {
		color: #925c00;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .tune-icon,
	:global(.dark) .tune-icon {
		color: #ffb327;
	}

	.toggle-text {
		font-size: 0.67rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.toggle-meta-right {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-shrink: 0;
		margin-left: auto;
	}

	.active-summary-pill {
		font-family: var(--font-mono, monospace);
		font-size: 0.58rem;
		font-weight: 700;
		background: rgba(255, 179, 39, 0.2);
		color: #925c00;
		border: 1px solid rgba(255, 179, 39, 0.35);
		padding: 1px 4px;
		border-radius: 4px;
		white-space: nowrap;
		line-height: 1.1;
	}

	:global([data-theme='dark']) .active-summary-pill,
	:global(.dark) .active-summary-pill {
		background: rgba(255, 179, 39, 0.15);
		color: #ffb327;
		border-color: transparent;
	}

	.toggle-chevron {
		color: var(--fg-muted, var(--fg-secondary));
		transition: transform 0.18s ease;
		flex-shrink: 0;
	}

	.toggle-chevron.is-rotated {
		transform: rotate(180deg);
	}

	/* Drawer Body */
	.advanced-drawer {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		background: var(--panel-bg, #ffffff);
		border: 1px solid var(--border);
		border-top: none;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		padding: 0.45rem 0.45rem 0.55rem 0.45rem;
		animation: drawerIn 0.16s ease-out;
		box-sizing: border-box;
		overflow: hidden;
		max-width: 100%;
	}

	:global([data-theme='dark']) .advanced-drawer,
	:global(.dark) .advanced-drawer {
		background: rgba(0, 0, 0, 0.32);
		border-color: rgba(255, 255, 255, 0.12);
	}

	@keyframes drawerIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.drawer-field-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
		min-width: 0;
	}

	.position-drawer-block {
		padding-top: 0.4rem;
		border-top: 1px dashed var(--border);
	}

	.field-meta-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
	}

	.field-label-text {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--fg-secondary);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.quick-pills-cluster {
		display: inline-flex;
		gap: 2px;
		flex-shrink: 0;
	}

	.quick-micro-pill {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--fg-secondary);
		font-size: 0.61rem;
		font-weight: 600;
		padding: 0.1rem 0.28rem;
		cursor: pointer;
		line-height: 1;
		transition: all 0.12s ease;
		white-space: nowrap;
	}

	.quick-micro-pill:hover {
		background: var(--panel-bg);
		border-color: var(--border-hover);
		color: var(--fg-primary);
	}

	.quick-micro-pill.is-active {
		background: var(--brand-leaf, #598f3a);
		border-color: var(--brand-leaf, #598f3a);
		color: #ffffff;
	}

	.center-reset-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		background: rgba(255, 179, 39, 0.15);
		border: 1px solid rgba(255, 179, 39, 0.35);
		border-radius: 4px;
		color: #925c00;
		font-size: 0.61rem;
		font-weight: 700;
		padding: 0.1rem 0.35rem;
		cursor: pointer;
		line-height: 1;
		transition: all 0.12s ease;
		white-space: nowrap;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .center-reset-btn,
	:global(.dark) .center-reset-btn {
		background: rgba(255, 179, 39, 0.12);
		border-color: rgba(255, 179, 39, 0.25);
		color: #ffb327;
	}

	.center-reset-btn:hover {
		background: rgba(255, 179, 39, 0.25);
		border-color: #ffb327;
	}

	/* Axis Full-Width Slider Rows */
	.axis-control-row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
	}

	.axis-label-tag {
		font-family: var(--font-mono, monospace);
		font-size: 0.68rem;
		font-weight: 800;
		color: #925c00;
		width: 12px;
		text-align: center;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .axis-label-tag,
	:global(.dark) .axis-label-tag {
		color: #ffb327;
	}

	.axis-num-readout {
		font-family: var(--font-mono, monospace);
		font-size: 0.63rem;
		font-weight: 600;
		color: var(--fg-secondary);
		min-width: 34px;
		text-align: right;
		white-space: nowrap;
		flex-shrink: 0;
	}
</style>
