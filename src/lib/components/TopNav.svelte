<script lang="ts">
	import { themeStore } from '../theme.svelte';
	import { langStore } from '../lang.svelte';

	let isDark = $derived(themeStore.current === 'dark');
</script>

<header class="top-nav">
	<div class="nav-content">
		<!-- Left: 24/7 Status Badge -->
		<div class="status-badge" aria-label="Hospital Status">
			<span class="status-pulse">
				<span class="pulse-ring"></span>
				<span class="pulse-dot"></span>
			</span>
			<span class="status-text">{langStore.t('status_badge')}</span>
		</div>

		<!-- Right: Controls (Lang + Theme) -->
		<div class="controls-group">
			<!-- Language Toggle -->
			<button
				type="button"
				class="control-btn lang-btn"
				onclick={() => langStore.toggle()}
				title={langStore.t('lang_name') === 'UA' ? 'Switch to English' : 'Перемкнути на українську'}
				aria-label="Switch Language"
			>
				<span class="lang-text">{langStore.t('lang_name')}</span>
			</button>

			<!-- Theme Toggle -->
			<button
				type="button"
				class="control-btn theme-btn"
				onclick={() => themeStore.toggle()}
				title={langStore.t('theme_toggle')}
				aria-label={langStore.t('theme_toggle')}
			>
				{#if isDark}
					<!-- Sun icon for switching to light -->
					<svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="5"/>
						<line x1="12" y1="1" x2="12" y2="3"/>
						<line x1="12" y1="21" x2="12" y2="23"/>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
						<line x1="1" y1="12" x2="3" y2="12"/>
						<line x1="21" y1="12" x2="23" y2="12"/>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
					</svg>
				{:else}
					<!-- Moon icon for switching to dark -->
					<svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
					</svg>
				{/if}
			</button>
		</div>
	</div>
</header>

<style>
	.top-nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 50;
		padding: 1rem 1.5rem;
		pointer-events: none;
	}

	.nav-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.status-badge {
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.45rem 0.9rem;
		border-radius: 9999px;
		background: var(--nav-bg);
		border: 1px solid var(--nav-border);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.status-pulse {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 10px;
		height: 10px;
	}

	.pulse-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 8px #22c55e;
	}

	.pulse-ring {
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid #22c55e;
		opacity: 0.75;
		animation: statusRing 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
	}

	@keyframes statusRing {
		0% {
			transform: scale(0.6);
			opacity: 0.9;
		}
		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}

	.controls-group {
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--nav-bg);
		border: 1px solid var(--nav-border);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		padding: 0.35rem;
		border-radius: 9999px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.control-btn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-primary);
		background: transparent;
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.control-btn:hover {
		background: var(--pill-hover);
		transform: scale(1.06);
	}

	.lang-btn {
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.04em;
	}

	.control-icon {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 600px) {
		.top-nav {
			padding: 0.75rem 1rem;
		}

		.status-text {
			font-size: 0.75rem;
		}
	}
</style>

