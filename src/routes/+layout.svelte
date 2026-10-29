<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/theme.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="app-root">
	<!-- Dynamic ambient glow background -->
	<div class="ambient-glow"></div>

	{@render children?.()}
</div>

<style>
	.app-root {
		position: relative;
		width: 100%;
		height: 100dvh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	:global(body:has(.brandbook-page)) .app-root {
		height: auto !important;
		min-height: 100vh !important;
		overflow: visible !important;
	}

	.ambient-glow {
		position: fixed;
		inset: 0;
		background-image: var(--bg-radial);
		pointer-events: none;
		z-index: 1;
		transition: background-image 0.15s ease-out;
	}
</style>

