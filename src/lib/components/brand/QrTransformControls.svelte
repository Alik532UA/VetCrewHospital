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

	function stepMove(dx: number, dy: number) {
		setOffsetX(offsetX + dx);
		setOffsetY(offsetY + dy);
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
					title={langStore.current === 'uk' ? 'Скинути всі трансформації' : 'Reset all transforms'}
				>
					{langStore.current === 'uk' ? 'Скинути' : 'Reset'}
				</button>
			{/if}
		</div>
	{/if}

	<!-- Section 1: Rotation and Flip -->
	<div class="control-section">
		<div class="transform-actions-row">
			<!-- Quick Angle Step Buttons -->
			<div class="angle-buttons-group" role="group" aria-label="Кути повороту підкладки">
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

			<!-- Horizontal Flip Button -->
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
					<path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path>
					<path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
					<line x1="12" y1="2" x2="12" y2="22" stroke-dasharray="2 2"></line>
				</svg>
				<span class="flip-text">Flip ↔</span>
			</button>
		</div>

		<!-- Fine-tune Angle Slider Row -->
		<div class="slider-row angle-slider-row">
			<input
				type="range"
				min="0"
				max="359"
				step="1"
				value={rotation}
				oninput={(e) => setRotation(Number((e.target as HTMLInputElement).value))}
				class="custom-slider"
				aria-label={langStore.current === 'uk' ? 'Кут повороту підкладки' : 'Plaque rotation angle'}
			/>
			<span class="slider-indicator">{rotation}°</span>
		</div>
	</div>

	<!-- Section 2: Scale Control -->
	<div class="control-section sub-control-block">
		<div class="sub-label-row">
			<span class="sub-label">
				{langStore.current === 'uk' ? 'Масштаб:' : 'Scale:'}
			</span>
			<div class="scale-quick-actions">
				<button type="button" class="micro-step-btn" onclick={() => adjustScale(-0.1)} title="-10%">
					-10%
				</button>
				<button
					type="button"
					class="micro-step-btn"
					class:is-active={scale === 1.0}
					onclick={() => setScale(1.0)}
					title="100%"
				>
					100%
				</button>
				<button type="button" class="micro-step-btn" onclick={() => adjustScale(+0.1)} title="+10%">
					+10%
				</button>
			</div>
			<span class="slider-indicator">{Math.round(scale * 100)}%</span>
		</div>
		<div class="slider-row">
			<input
				type="range"
				min="0.5"
				max="1.5"
				step="0.01"
				value={scale}
				oninput={(e) => setScale(Number((e.target as HTMLInputElement).value))}
				class="custom-slider"
				aria-label={langStore.current === 'uk' ? 'Масштаб підкладки' : 'Scale'}
			/>
		</div>
	</div>

	<!-- Section 3: Position Shift (Рухати / Offset) Control -->
	<div class="control-section sub-control-block">
		<div class="sub-label-row">
			<span class="sub-label">
				{langStore.current === 'uk' ? 'Позиція (рухати):' : 'Position shift:'}
			</span>
			{#if offsetX !== 0 || offsetY !== 0}
				<button
					type="button"
					class="reset-micro-btn"
					onclick={resetPosition}
					title={langStore.current === 'uk' ? 'Скинути по центру' : 'Reset to center'}
				>
					{langStore.current === 'uk' ? 'По центру' : 'Center'}
				</button>
			{/if}
			<span class="slider-indicator offset-badge">
				X: {offsetX > 0 ? `+${offsetX}` : offsetX} Y: {offsetY > 0 ? `+${offsetY}` : offsetY}
			</span>
		</div>

		<div class="position-tools-row">
			<!-- Mini D-pad for quick nudge -->
			<div class="dpad-cluster" role="group" aria-label="Стрілки зсуву підкладки">
				<button
					type="button"
					class="dpad-btn dpad-up"
					onclick={() => stepMove(0, -10)}
					title={langStore.current === 'uk' ? 'Вгору (10px)' : 'Up (10px)'}
					aria-label="Вгору"
				>
					▲
				</button>
				<div class="dpad-mid-row">
					<button
						type="button"
						class="dpad-btn dpad-left"
						onclick={() => stepMove(-10, 0)}
						title={langStore.current === 'uk' ? 'Вліво (10px)' : 'Left (10px)'}
						aria-label="Вліво"
					>
						◄
					</button>
					<button
						type="button"
						class="dpad-btn dpad-center"
						onclick={resetPosition}
						title={langStore.current === 'uk' ? 'По центру' : 'Center'}
						aria-label="По центру"
					>
						•
					</button>
					<button
						type="button"
						class="dpad-btn dpad-right"
						onclick={() => stepMove(10, 0)}
						title={langStore.current === 'uk' ? 'Вправо (10px)' : 'Right (10px)'}
						aria-label="Вправо"
					>
						►
					</button>
				</div>
				<button
					type="button"
					class="dpad-btn dpad-down"
					onclick={() => stepMove(0, 10)}
					title={langStore.current === 'uk' ? 'Вниз (10px)' : 'Down (10px)'}
					aria-label="Вниз"
				>
					▼
				</button>
			</div>

			<!-- Direct Sliders for X and Y fine control -->
			<div class="offset-sliders-stack">
				<div class="axis-slider-row">
					<span class="axis-label">X:</span>
					<input
						type="range"
						min="-100"
						max="100"
						step="1"
						value={offsetX}
						oninput={(e) => setOffsetX(Number((e.target as HTMLInputElement).value))}
						class="custom-slider"
						aria-label="Зсув по горизонталі (X)"
					/>
				</div>
				<div class="axis-slider-row">
					<span class="axis-label">Y:</span>
					<input
						type="range"
						min="-100"
						max="100"
						step="1"
						value={offsetY}
						oninput={(e) => setOffsetY(Number((e.target as HTMLInputElement).value))}
						class="custom-slider"
						aria-label="Зсув по вертикалі (Y)"
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.transform-controls-wrap {
		display: inline-flex;
		flex-direction: column;
		gap: 0.4rem;
		user-select: none;
		width: 100%;
	}

	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.transform-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted-fg, #8ba994);
	}

	.reset-micro-btn {
		background: transparent;
		border: none;
		color: #e5a93c;
		font-size: 0.68rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0 0.25rem;
		text-decoration: underline;
		transition: opacity 0.15s ease;
	}

	.reset-micro-btn:hover {
		opacity: 0.8;
	}

	.control-section {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.transform-actions-row {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.angle-buttons-group {
		display: inline-flex;
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: 8px;
		padding: 2px;
		gap: 2px;
	}

	.angle-step-btn {
		background: transparent;
		border: none;
		color: var(--muted-fg, #8ba994);
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.3rem 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
		line-height: 1;
	}

	.is-compact .angle-step-btn {
		padding: 0.22rem 0.38rem;
		font-size: 0.68rem;
	}

	.angle-step-btn:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.08);
	}

	.angle-step-btn.is-active {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.flip-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: 8px;
		padding: 0.3rem 0.6rem;
		color: var(--muted-fg, #8ba994);
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
		line-height: 1;
	}

	.is-compact .flip-btn {
		padding: 0.22rem 0.45rem;
		font-size: 0.68rem;
	}

	.flip-btn:hover {
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.25);
	}

	.flip-btn.is-active {
		background: #ffb327;
		color: #1a2e1f;
		border-color: #ffb327;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.custom-slider {
		flex: 1;
		-webkit-appearance: none;
		appearance: none;
		height: 5px;
		background: rgba(0, 0, 0, 0.35);
		border-radius: 3px;
		outline: none;
		cursor: pointer;
	}

	.custom-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffb327;
		cursor: pointer;
		border: 1.5px solid #1a2e1f;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
		transition: transform 0.1s ease;
	}

	.custom-slider::-webkit-slider-thumb:hover {
		transform: scale(1.18);
	}

	.custom-slider::-moz-range-thumb {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffb327;
		cursor: pointer;
		border: 1.5px solid #1a2e1f;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	}

	.slider-indicator {
		font-family: var(--font-mono, monospace);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--fg-secondary, #b6d3be);
		min-width: 32px;
		text-align: right;
	}

	.offset-badge {
		min-width: 65px;
		font-size: 0.65rem;
	}

	/* ADVANCED CONTROLS (Scale & Offset) */
	.sub-control-block {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-top: 0.45rem;
		border-top: 1px dashed rgba(255, 255, 255, 0.09);
	}

	.is-compact .sub-control-block {
		gap: 0.25rem;
		padding-top: 0.35rem;
	}

	.sub-label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
	}

	.sub-label {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--muted-fg, #8ba994);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.scale-quick-actions {
		display: inline-flex;
		gap: 2px;
	}

	.micro-step-btn {
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		color: var(--muted-fg, #8ba994);
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.15rem 0.35rem;
		cursor: pointer;
		line-height: 1;
		transition: all 0.15s ease;
	}

	.is-compact .micro-step-btn {
		padding: 0.12rem 0.28rem;
		font-size: 0.62rem;
	}

	.micro-step-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
	}

	.micro-step-btn.is-active {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
	}

	/* POSITION CONTROLS */
	.position-tools-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.is-compact .position-tools-row {
		gap: 0.5rem;
	}

	.dpad-cluster {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		background: rgba(0, 0, 0, 0.3);
		padding: 2px;
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.dpad-mid-row {
		display: flex;
		align-items: center;
		gap: 1px;
	}

	.dpad-btn {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: var(--fg-secondary, #b6d3be);
		font-size: 0.6rem;
		cursor: pointer;
		border-radius: 3px;
		transition: background 0.12s ease;
		line-height: 1;
		padding: 0;
	}

	.is-compact .dpad-btn {
		width: 18px;
		height: 18px;
		font-size: 0.55rem;
	}

	.dpad-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #ffffff;
	}

	.dpad-center {
		font-size: 0.75rem;
		color: #ffb327;
	}

	.offset-sliders-stack {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.axis-slider-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.axis-label {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--muted-fg, #8ba994);
		width: 12px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-2px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
