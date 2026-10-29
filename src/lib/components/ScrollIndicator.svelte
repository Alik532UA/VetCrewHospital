<script lang="ts">
	import { langStore } from '../lang.svelte';

	interface Props {
		state: 1 | 2;
		ontoggle: () => void;
	}

	let { state, ontoggle }: Props = $props();
</script>

<div class="indicator-container">
	<!-- Right-side pagination track -->
	<div class="pagination-track" role="tablist" aria-label="Scroll States">
		<button
			type="button"
			class="pagination-dot"
			class:active={state === 1}
			onclick={() => {
				if (state !== 1) ontoggle();
			}}
			aria-label="State 1: Logo Hero"
		></button>
		<button
			type="button"
			class="pagination-dot"
			class:active={state === 2}
			onclick={() => {
				if (state !== 2) ontoggle();
			}}
			aria-label="State 2: Contacts"
		></button>
	</div>

	<!-- Bottom Cue Pill -->
	<button
		type="button"
		class="cue-pill"
		onclick={ontoggle}
		aria-label={state === 1 ? langStore.t('scroll_hint') : langStore.t('scroll_back')}
	>
		<span class="cue-text">
			{state === 1 ? langStore.t('scroll_hint') : langStore.t('scroll_back')}
		</span>
		<svg
			class="cue-icon"
			class:is-up={state === 2}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="6 9 12 15 18 9"/>
		</svg>
	</button>
</div>

<style>
	.indicator-container {
		position: fixed;
		pointer-events: none;
		z-index: 30;
	}

	/* Right-side dots */
	.pagination-track {
		position: fixed;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 0.5rem 0.35rem;
		border-radius: 9999px;
		background: var(--nav-bg);
		border: 1px solid var(--nav-border);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		pointer-events: auto;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
	}

	.pagination-dot {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
		background: var(--text-muted);
		opacity: 0.35;
		transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		cursor: pointer;
	}

	.pagination-dot:hover {
		opacity: 0.7;
		transform: scale(1.2);
	}

	.pagination-dot.active {
		height: 22px;
		opacity: 1;
		background: var(--brand-gold);
		box-shadow: 0 0 10px var(--brand-gold-glow);
	}

	/* Bottom Cue Pill */
	.cue-pill {
		position: fixed;
		bottom: 6.25rem;
		left: 50%;
		transform: translateX(-50%);
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		background: var(--nav-bg);
		border: 1px solid var(--nav-border);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		color: var(--text-secondary);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		animation: cueBounce 2.4s infinite ease-in-out;
	}

	.cue-pill:hover {
		color: var(--text-primary);
		border-color: var(--card-border-hover);
		transform: translateX(-50%) translateY(-2px);
	}

	.cue-icon {
		width: 14px;
		height: 14px;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.cue-icon.is-up {
		transform: rotate(180deg);
	}

	@keyframes cueBounce {
		0%, 100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(5px);
		}
	}

	@media (max-width: 600px) {
		.pagination-track {
			right: 0.75rem;
		}

		.cue-pill {
			bottom: 5.8rem;
			font-size: 0.72rem;
		}
	}
</style>

