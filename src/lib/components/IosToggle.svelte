<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		checked?: boolean;
		label?: string;
		title?: string;
		disabled?: boolean;
		id?: string;
		size?: 'sm' | 'md';
		ariaLabel?: string;
		children?: Snippet;
		onchange?: (e: Event) => void;
	}

	let {
		checked = $bindable(false),
		label = '',
		title = '',
		disabled = false,
		id = undefined,
		size = 'md',
		ariaLabel = undefined,
		children,
		onchange
	}: Props = $props();
</script>

<label class="ios-toggle-label ios-toggle-label--{size}" {title} class:is-disabled={disabled}>
	<span class="ios-toggle ios-toggle--{size}">
		<input
			type="checkbox"
			role="switch"
			class="ios-toggle-input"
			{id}
			bind:checked
			{disabled}
			aria-label={ariaLabel || label || title}
			{onchange}
		/>
		<span class="ios-toggle-track" aria-hidden="true">
			<span class="ios-toggle-thumb"></span>
		</span>
	</span>
	{#if children}
		{@render children()}
	{:else if label}
		<span class="ios-toggle-text">{label}</span>
	{/if}
</label>

<style>
	.ios-toggle-label {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		cursor: pointer;
		user-select: none;
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--fg-secondary, #4a634e);
		line-height: 1.2;
		transition: color 0.15s ease;
	}

	.ios-toggle-label:hover {
		color: var(--fg-primary, #0c1c10);
	}

	.ios-toggle-label.is-disabled {
		opacity: 0.45;
		cursor: not-allowed;
		pointer-events: none;
	}

	.ios-toggle {
		position: relative;
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* Visually hidden accessible input */
	.ios-toggle-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
		pointer-events: none;
	}

	/* iOS Outer Pill Track */
	.ios-toggle-track {
		position: relative;
		display: block;
		width: 36px;
		height: 20px;
		border-radius: 9999px;
		background-color: rgba(120, 120, 128, 0.24);
		border: 1px solid rgba(0, 0, 0, 0.06);
		transition:
			background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.25s ease,
			box-shadow 0.2s ease;
	}

	:global([data-theme='dark']) .ios-toggle-track,
	:global(.dark) .ios-toggle-track {
		background-color: rgba(255, 255, 255, 0.16);
		border-color: rgba(255, 255, 255, 0.08);
	}

	/* iOS Inner Sliding Thumb (White Knob) */
	.ios-toggle-thumb {
		position: absolute;
		top: 1px;
		left: 1px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #ffffff;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.22),
			0 0 1px rgba(0, 0, 0, 0.15);
		transition:
			transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			width 0.15s ease;
	}

	/* Checked State: iOS Vibrant Green */
	.ios-toggle-input:checked + .ios-toggle-track {
		background-color: #34c759;
		border-color: rgba(0, 0, 0, 0.04);
	}

	:global([data-theme='dark']) .ios-toggle-input:checked + .ios-toggle-track,
	:global(.dark) .ios-toggle-input:checked + .ios-toggle-track {
		background-color: #30d158;
		border-color: rgba(48, 209, 88, 0.25);
	}

	.ios-toggle-input:checked + .ios-toggle-track .ios-toggle-thumb {
		transform: translateX(16px);
	}

	/* Interactive Pressed State (iOS thumb stretches slightly) */
	.ios-toggle-label:active .ios-toggle-thumb {
		width: 19px;
	}

	.ios-toggle-label:active .ios-toggle-input:checked + .ios-toggle-track .ios-toggle-thumb {
		transform: translateX(13px);
		width: 19px;
	}

	/* Focus Ring */
	.ios-toggle-input:focus-visible + .ios-toggle-track {
		outline: 2px solid #34c759;
		outline-offset: 2px;
		box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.35);
	}

	/* Size variations: sm (compact 30x18) */
	.ios-toggle-label--sm {
		font-size: 0.72rem;
		gap: 0.45rem;
	}

	.ios-toggle--sm .ios-toggle-track {
		width: 30px;
		height: 18px;
	}

	.ios-toggle--sm .ios-toggle-thumb {
		top: 1px;
		left: 1px;
		width: 14px;
		height: 14px;
	}

	.ios-toggle--sm .ios-toggle-input:checked + .ios-toggle-track .ios-toggle-thumb {
		transform: translateX(12px);
	}

	.ios-toggle-label--sm:active .ios-toggle-thumb {
		width: 16px;
	}

	.ios-toggle-label--sm:active .ios-toggle-input:checked + .ios-toggle-track .ios-toggle-thumb {
		transform: translateX(10px);
		width: 16px;
	}

	.ios-toggle-text {
		white-space: nowrap;
	}
</style>
