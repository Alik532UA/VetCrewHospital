<script lang="ts">
	import { browser } from '$app/environment';
	import { langStore } from '$lib/lang.svelte';
	import {
		PNG_RESOLUTIONS,
		DEFAULT_PNG_RESOLUTION,
		type PngResolution
	} from '$lib/data/pngResolutions';

	interface Props {
		onselect: (res: PngResolution) => Promise<void> | void;
		isDownloading?: boolean;
		selectedResId?: string;
		btnClass?: string;
		wrapClass?: string;
		title?: string;
		align?: 'center' | 'left' | 'right';
		size?: 'normal' | 'compact';
	}

	let {
		onselect,
		isDownloading = false,
		selectedResId = $bindable('1080p'),
		btnClass = '',
		wrapClass = '',
		title,
		align = 'center',
		size = 'normal'
	}: Props = $props();

	let isOpen = $state(false);
	let menuEl = $state<HTMLDivElement | null>(null);
	let autoAlign = $state<'center' | 'left' | 'right' | null>(null);
	let effectiveAlign = $derived(autoAlign ?? align);

	// Coordinate closing across all dropdown instances on the page
	const instanceId = Math.random().toString(36).slice(2, 9);
	const GLOBAL_PNG_EVENT = 'vetcrew:close-png-menus';

	let currentResolution = $derived(
		PNG_RESOLUTIONS.find((r) => r.id === selectedResId) ?? DEFAULT_PNG_RESOLUTION
	);

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();
		if (!isOpen) {
			window.dispatchEvent(new CustomEvent(GLOBAL_PNG_EVENT, { detail: { openId: instanceId } }));
			isOpen = true;
			autoAlign = null;
		} else {
			isOpen = false;
		}
	}

	function handleSelect(res: PngResolution) {
		selectedResId = res.id;
		isOpen = false;
		onselect(res);
	}

	// Smart edge detection to prevent clipping past window bounds
	$effect(() => {
		if (isOpen && menuEl) {
			const rect = menuEl.getBoundingClientRect();
			const rightMargin = window.innerWidth - rect.right;
			const leftMargin = rect.left;

			if (rightMargin < 12) {
				autoAlign = 'right';
			} else if (leftMargin < 12) {
				autoAlign = 'left';
			} else {
				autoAlign = null;
			}
		}
	});

	$effect(() => {
		if (!browser) return;

		const onDocClick = () => {
			if (isOpen) isOpen = false;
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) isOpen = false;
		};
		const onGlobalClose = (e: Event) => {
			const custom = e as CustomEvent<{ openId: string }>;
			if (custom.detail?.openId !== instanceId && isOpen) {
				isOpen = false;
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

	let defaultTitle = $derived(
		langStore.current === 'uk'
			? `Завантажити PNG (${currentResolution.label}, випадаючий список 480p - 2160p)`
			: `Download PNG (${currentResolution.label}, select 480p - 2160p)`
	);
</script>

<div
	class="png-dropdown-wrap align--{effectiveAlign} size--{size} {wrapClass}"
	class:is-open={isOpen}
>
	<button
		type="button"
		class="download-png-trigger size--{size} {btnClass}"
		onclick={toggleMenu}
		disabled={isDownloading}
		aria-expanded={isOpen}
		aria-haspopup="menu"
		title={title || defaultTitle}
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
			{isDownloading ? '...' : size === 'compact' ? 'PNG' : `PNG (${currentResolution.label})`}
		</span>
		<svg
			width="10"
			height="10"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			class="chevron-icon"
			class:is-flipped={isOpen}
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>

	{#if isOpen}
		<div
			bind:this={menuEl}
			class="png-menu-dropdown align--{effectiveAlign}"
			role="menu"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') isOpen = false;
			}}
		>
			<div class="png-menu-header">
				<span>
					{langStore.current === 'uk' ? 'Роздільна здатність PNG:' : 'PNG Resolution:'}
				</span>
			</div>
			{#each PNG_RESOLUTIONS as res (res.id)}
				<button
					type="button"
					role="menuitem"
					class="png-menu-item"
					class:is-selected={res.id === currentResolution.id}
					onclick={() => handleSelect(res)}
				>
					<span class="res-badge">{res.label}</span>
					<span class="res-desc">
						{langStore.current === 'uk' ? res.descriptionUk : res.descriptionEn}
					</span>
					{#if res.id === currentResolution.id}
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

<style>
	.png-dropdown-wrap {
		position: relative;
		display: inline-flex;
	}

	.png-dropdown-wrap.size--compact {
		width: 100%;
	}

	.png-dropdown-wrap.is-open {
		z-index: 90;
	}

	.download-png-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		min-width: 0;
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

	.download-png-trigger.size--compact {
		width: 100%;
		padding: 0.35rem 0.45rem;
		font-size: 0.72rem;
		border-radius: 7px;
		gap: 0.25rem;
	}

	.download-png-trigger:hover:not(:disabled) {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(19, 55, 27, 0.25);
	}

	.png-dropdown-wrap.is-open .download-png-trigger {
		background: var(--brand-emerald, #13371b);
		border-color: var(--brand-emerald, #13371b);
		color: #ffffff;
		transform: none !important;
		box-shadow: 0 2px 8px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .download-png-trigger,
	:global(.dark) .download-png-trigger {
		background: rgba(255, 179, 39, 0.12);
		border: 1px solid rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	:global([data-theme='dark']) .download-png-trigger:hover:not(:disabled),
	:global(.dark) .download-png-trigger:hover:not(:disabled) {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		box-shadow: 0 4px 14px rgba(255, 179, 39, 0.35);
	}

	:global([data-theme='dark']) .png-dropdown-wrap.is-open .download-png-trigger,
	:global(.dark) .png-dropdown-wrap.is-open .download-png-trigger {
		background: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		color: #101e14;
		transform: none !important;
		box-shadow: 0 2px 8px rgba(255, 179, 39, 0.35);
	}

	.download-png-trigger:disabled {
		opacity: 0.55;
		cursor: wait;
	}

	.chevron-icon {
		margin-left: 0.2rem;
		transition: transform 0.2s ease;
	}

	.chevron-icon.is-flipped {
		transform: rotate(180deg);
	}

	/* DROPDOWN POPOVER - 100% OPAQUE AND DIRECTLY ANCHORED WITHOUT AIR GAP */
	.png-menu-dropdown {
		position: absolute;
		bottom: calc(100% + 2px);
		left: 50%;
		transform: translateX(-50%);
		min-width: 220px;
		background: #ffffff;
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.45rem;
		box-shadow:
			0 12px 32px rgba(0, 0, 0, 0.25),
			0 2px 6px rgba(0, 0, 0, 0.08);
		z-index: 100;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.png-menu-dropdown.align--center {
		animation: popInCenter 0.15s ease-out;
	}

	.png-menu-dropdown.align--right,
	.png-menu-dropdown.align--left {
		animation: popInEdge 0.15s ease-out;
	}

	:global([data-theme='dark']) .png-menu-dropdown,
	:global(.dark) .png-menu-dropdown {
		background: #18221b;
		border-color: rgba(255, 255, 255, 0.16);
		box-shadow:
			0 12px 32px rgba(0, 0, 0, 0.5),
			0 2px 6px rgba(0, 0, 0, 0.3);
	}

	/* Anchor arrow pointing directly down to parent button - seamlessly connected with zero gap */
	.png-menu-dropdown::before {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid rgba(19, 55, 27, 0.25);
		pointer-events: none;
	}

	.png-menu-dropdown::after {
		content: '';
		position: absolute;
		top: calc(100% - 1px);
		left: 50%;
		transform: translateX(-50%);
		border-left: 7px solid transparent;
		border-right: 7px solid transparent;
		border-top: 7px solid #ffffff;
		pointer-events: none;
	}

	:global([data-theme='dark']) .png-menu-dropdown::before,
	:global(.dark) .png-menu-dropdown::before {
		border-top-color: rgba(255, 255, 255, 0.25);
	}

	:global([data-theme='dark']) .png-menu-dropdown::after,
	:global(.dark) .png-menu-dropdown::after {
		border-top-color: #18221b;
	}

	/* Alignment variants */
	.png-menu-dropdown.align--right {
		left: auto;
		right: 0;
		transform: none;
	}

	.png-menu-dropdown.align--right::before {
		left: auto;
		right: 20px;
		transform: none;
	}

	.png-menu-dropdown.align--right::after {
		left: auto;
		right: 21px;
		transform: none;
	}

	.png-menu-dropdown.align--left {
		left: 0;
		transform: none;
	}

	.png-menu-dropdown.align--left::before {
		left: 20px;
		transform: none;
	}

	.png-menu-dropdown.align--left::after {
		left: 21px;
		transform: none;
	}

	@keyframes popInCenter {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@keyframes popInEdge {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.png-menu-header {
		padding: 0.35rem 0.55rem 0.4rem;
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--fg-secondary);
		border-bottom: 1px solid var(--border);
		margin-bottom: 0.2rem;
	}

	.png-menu-item {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--fg-primary);
		font-size: 0.78rem;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
		width: 100%;
	}

	.png-menu-item:hover {
		background: rgba(19, 55, 27, 0.08);
	}

	:global([data-theme='dark']) .png-menu-item:hover,
	:global(.dark) .png-menu-item:hover {
		background: rgba(255, 179, 39, 0.12);
	}

	.png-menu-item.is-selected {
		background: rgba(19, 55, 27, 0.12);
		border-color: rgba(19, 55, 27, 0.25);
		font-weight: 700;
		color: var(--brand-emerald, #13371b);
	}

	:global([data-theme='dark']) .png-menu-item.is-selected,
	:global(.dark) .png-menu-item.is-selected {
		background: rgba(255, 179, 39, 0.15);
		border-color: rgba(255, 179, 39, 0.35);
		color: var(--brand-gold, #ffb327);
	}

	.res-badge {
		font-weight: 800;
		font-size: 0.74rem;
		padding: 0.15rem 0.4rem;
		border-radius: 5px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		font-family: monospace;
	}

	.res-desc {
		flex: 1;
		font-size: 0.74rem;
		color: var(--fg-secondary);
	}

	.check-icon {
		color: var(--brand-leaf, #598f3a);
		margin-left: auto;
	}

	:global([data-theme='dark']) .check-icon,
	:global(.dark) .check-icon {
		color: var(--brand-gold, #ffb327);
	}
</style>
