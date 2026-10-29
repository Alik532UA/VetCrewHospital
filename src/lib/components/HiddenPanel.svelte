<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { themeStore } from '../theme.svelte';
	import { langStore } from '../lang.svelte';
	import { canFullscreen, toggleFullscreen, isFullscreenActive } from '../services/fullscreen';
	import { APP_VERSION } from '../version';
	import { logService } from '../services/logService.svelte';
	import { debugMode } from '../debug/debugMode.svelte';

	interface Props {
		isVisible?: boolean;
	}

	let { isVisible = false }: Props = $props();

	let isSupported = $state(true);
	let isFullscreen = $state(false);
	let isDark = $derived(themeStore.current === 'dark');

	let copied = $state(false);
	let fallbackReport = $state<string | null>(null);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const urlDebug = $derived(browser && page.url.searchParams.get('debug') === '1');
	const panelVisible = $derived(isVisible || urlDebug || debugMode.enabled);
	const errors = $derived(logService.errorCount);

	$effect(() => () => clearTimeout(copyTimer));

	async function copyReport() {
		const report = logService.getReport();
		try {
			await navigator.clipboard.writeText(report);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 2000);
		} catch (error) {
			logService.warn('ui', 'Clipboard write failed, showing report inline', error);
			fallbackReport = report;
		}
	}

	$effect(() => {
		if (typeof document === 'undefined') return;

		isSupported = canFullscreen();
		isFullscreen = isFullscreenActive();

		function onFsChange() {
			isFullscreen = isFullscreenActive();
		}

		document.addEventListener('fullscreenchange', onFsChange);
		document.addEventListener('webkitfullscreenchange', onFsChange);
		return () => {
			document.removeEventListener('fullscreenchange', onFsChange);
			document.removeEventListener('webkitfullscreenchange', onFsChange);
		};
	});
</script>

<nav
	class="hidden-panel-wrapper"
	class:is-visible={panelVisible}
	aria-label="Додаткові налаштування"
	aria-hidden={!panelVisible}
>
	<div class="hidden-panel-content">
		<!-- 1. ТЕМА -->
		<button
			type="button"
			class="action-item"
			onclick={() => themeStore.toggle()}
			aria-label="{langStore.t('theme_btn')} ({isDark ? 'Dark' : 'Light'})"
			title="{langStore.t('theme_btn')}"
		>
			<span class="action-icon-box">
				{#if isDark}
					<!-- Sun icon -->
					<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="4"/>
						<line x1="12" y1="2" x2="12" y2="4"/>
						<line x1="12" y1="20" x2="12" y2="22"/>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
						<line x1="2" y1="12" x2="4" y2="12"/>
						<line x1="20" y1="12" x2="22" y2="12"/>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
					</svg>
				{:else}
					<!-- Moon icon -->
					<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
					</svg>
				{/if}
			</span>
			<span class="action-title">{langStore.t('theme_btn')}</span>
		</button>

		<!-- 2. МОВА -->
		<button
			type="button"
			class="action-item lang-toggle-item"
			onclick={() => langStore.toggle()}
			aria-label="Language: {langStore.t('lang_name')}"
			title="{langStore.t('lang_btn')}"
		>
			<span class="action-icon-box">
				<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"/>
					<line x1="2" y1="12" x2="22" y2="12"/>
					<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
				</svg>
			</span>
			<span class="action-title">{langStore.t('lang_name')}</span>
		</button>

		<!-- 3. ПОВНИЙ ЕКРАН (якщо підтримується) -->
		{#if isSupported}
			<button
				type="button"
				class="action-item fullscreen-item"
				onclick={toggleFullscreen}
				aria-label={isFullscreen ? langStore.t('fullscreen_exit') : langStore.t('fullscreen')}
				title={isFullscreen ? langStore.t('fullscreen_exit') : langStore.t('fullscreen')}
			>
				<span class="action-icon-box">
					{#if isFullscreen}
						<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
						</svg>
					{:else}
						<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
						</svg>
					{/if}
				</span>
				<span class="action-title">{isFullscreen ? langStore.t('fullscreen_exit') : langStore.t('fullscreen')}</span>
			</button>
		{/if}

		<!-- 4. ДІАГНОСТИЧНИЙ ЗВІТ / ВЕРСІЯ -->
		<button
			type="button"
			class="action-item version-btn"
			class:has-errors={errors > 0}
			class:copied
			onclick={copyReport}
			aria-label="Діагностика: v{APP_VERSION}"
			title="Скопіювати діагностичний звіт (v{APP_VERSION})"
		>
			<span class="action-icon-box">
				{#if copied}
					<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12"/>
					</svg>
				{:else if errors > 0}
					<span class="error-badge">{errors > 99 ? '99+' : errors}</span>
				{:else}
					<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
					</svg>
				{/if}
			</span>
			<span class="action-title">{copied ? 'Copied' : `v${APP_VERSION}`}</span>
		</button>
	</div>

	{#if fallbackReport}
		<textarea class="service-report-fallback" readonly value={fallbackReport}></textarea>
	{/if}
</nav>

<style>
	.hidden-panel-wrapper {
		position: fixed;
		bottom: 1.5rem;
		left: 0;
		right: 0;
		z-index: 25;
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: none;
		opacity: 0;
		transform: translateY(40px) scale(0.96);
		transition:
			transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hidden-panel-wrapper.is-visible {
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.hidden-panel-content {
		display: grid;
		grid-template-columns: repeat(4, 78px);
		justify-items: center;
		align-items: center;
		padding: 0.65rem 1.2rem;
		background: var(--panel-bg);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid var(--panel-border);
		border-radius: 9999px;
		box-shadow: var(--panel-shadow);
	}

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 0.35rem;
		padding: 0.45rem 0.5rem;
		border-radius: 14px;
		background: transparent;
		border: 1px solid transparent;
		color: var(--text-secondary);
		cursor: pointer;
		font-family: inherit;
		transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
		-webkit-user-select: none;
	}

	.action-item:hover {
		color: var(--text-primary);
		background: rgba(19, 55, 27, 0.08);
		border-color: var(--border-hover);
		transform: translateY(-2px);
	}

	:global([data-theme='dark']) .action-item:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.action-icon-box {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.action-item:hover .action-icon-box {
		transform: scale(1.14);
	}

	.action-icon {
		width: 22px;
		height: 22px;
		color: currentColor;
		display: block;
	}

	.action-title {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		white-space: nowrap;
		line-height: 1;
		transition: color 0.25s ease;
	}

	.error-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 4px;
		border-radius: 9px;
		background: #dc2626;
		color: #ffffff;
		font-size: 0.65rem;
		font-weight: 700;
		line-height: 1;
	}

	.version-btn.has-errors {
		color: #ef4444;
	}

	.version-btn.copied {
		color: #22c55e;
	}

	.service-report-fallback {
		margin-top: 0.5rem;
		width: min(90vw, 500px);
		height: 120px;
		background: var(--panel-bg);
		color: var(--text-primary);
		border: 1px solid var(--panel-border);
		border-radius: 12px;
		padding: 0.5rem;
		font-family: monospace;
		font-size: 0.7rem;
		box-shadow: var(--panel-shadow);
	}

	@media (max-width: 640px) {
		.hidden-panel-wrapper {
			bottom: 0.85rem;
			padding: 0 0.5rem;
			box-sizing: border-box;
		}

		.hidden-panel-content {
			grid-template-columns: repeat(4, minmax(54px, 1fr));
			gap: 0.25rem;
			padding: 0.45rem 0.65rem;
		}

		.action-item {
			padding: 0.3rem 0.35rem;
		}

		.action-icon-box {
			width: 26px;
			height: 26px;
		}

		.action-icon {
			width: 18px;
			height: 18px;
		}

		.action-title {
			font-size: 0.65rem;
		}
	}
</style>
