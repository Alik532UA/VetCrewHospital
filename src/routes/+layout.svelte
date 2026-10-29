<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/theme.svelte';
	import { langStore } from '$lib/lang.svelte';
	import ServiceBadge from '$lib/components/ServiceBadge.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	// CODE-QUALITY § 5.3: сигнал гідратації — лише в браузері після монтування
	$effect(() => {
		document.documentElement.dataset.hydrated = '';
	});
</script>

<a href="#main-content" class="skip-link">{langStore.t('skip_to_content')}</a>

<div class="app-root">
	<!-- Dynamic ambient glow background -->
	<div class="ambient-glow"></div>

	{@render children?.()}

	<ServiceBadge />
</div>

<style>
	.skip-link {
		position: fixed;
		top: -9999px;
		left: 16px;
		z-index: 10001;
		padding: 8px 16px;
		background: var(--panel-bg, #1a1a1a);
		color: var(--text-primary, #ffffff);
		border: 2px solid var(--accent, #93C84A);
		border-radius: 8px;
		font-weight: 700;
		font-size: 0.85rem;
		text-decoration: none;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		transition: top 0.2s ease;
	}

	.skip-link:focus {
		top: 16px;
	}

	.app-root {
		position: relative;
		width: 100%;
		height: 100dvh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	:global(body:has(.brandbook-page)) .app-root,
	:global(body:has(.error-page-container)) .app-root {
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
