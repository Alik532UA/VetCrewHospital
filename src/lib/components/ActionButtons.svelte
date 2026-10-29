<script lang="ts">
	import { langStore } from '../lang.svelte';

	interface Props {
		expanded?: boolean;
		onExpandRequest?: () => void;
	}

	let { expanded = false, onExpandRequest }: Props = $props();

	let copiedPhone = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	function copyNumber(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText('+380775010101');
			copiedPhone = true;
			if (copyTimeout) clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copiedPhone = false;
			}, 2200);
		}
	}
</script>

<div class="actions-wrapper" class:is-expanded={expanded}>
	{#if !expanded}
		<!-- STATE 1: COMPACT DOCK -->
		<div class="dock-container" role="toolbar" aria-label="Quick Actions">
			<!-- Phone -->
			<a
				href="tel:+380775010101"
				class="dock-item dock-phone"
				aria-label="{langStore.t('btn_phone_label')}: +380775010101"
			>
				<div class="dock-icon-box">
					<svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
					</svg>
				</div>
				<span class="dock-label">{langStore.t('btn_phone_label')}</span>
			</a>

			<div class="dock-divider"></div>

			<!-- Instagram -->
			<a
				href="https://www.instagram.com/vet.crew.hospital"
				target="_blank"
				rel="noopener noreferrer"
				class="dock-item dock-insta"
				aria-label="Instagram: @vet.crew.hospital"
			>
				<div class="dock-icon-box">
					<svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
						<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
					</svg>
				</div>
				<span class="dock-label">{langStore.t('btn_instagram_label')}</span>
			</a>

			<div class="dock-divider"></div>

			<!-- Map -->
			<a
				href="https://maps.app.goo.gl/sTe5ePLTwwwQEZQz6"
				target="_blank"
				rel="noopener noreferrer"
				class="dock-item dock-map"
				aria-label="{langStore.t('btn_map_label')}: Google Maps"
			>
				<div class="dock-icon-box">
					<svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
						<circle cx="12" cy="10" r="3"/>
					</svg>
				</div>
				<span class="dock-label">{langStore.t('btn_map_label')}</span>
			</a>
		</div>
	{:else}
		<!-- STATE 2: EXPANDED PRIMARY CARDS -->
		<div class="cards-grid" role="region" aria-label="Emergency Contacts">
			<!-- 1. PHONE CARD -->
			<a href="tel:+380775010101" class="action-card card-phone">
				<div class="card-glow phone-glow"></div>
				<div class="card-icon-wrap phone-icon-wrap">
					<svg class="card-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
					</svg>
				</div>
				<div class="card-body">
					<div class="card-sub">{langStore.t('btn_phone_sub')}</div>
					<div class="card-title phone-number">{langStore.t('btn_phone_display')}</div>
					<div class="card-action-bar">
						<span class="btn-primary-action phone-btn-action">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
							{langStore.t('btn_phone_action')}
						</span>
						<button
							type="button"
							class="btn-copy"
							onclick={copyNumber}
							title={langStore.t('copy_phone')}
							aria-label={langStore.t('copy_phone')}
						>
							{#if copiedPhone}
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
								<span>{langStore.t('copied')}</span>
							{:else}
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
							{/if}
						</button>
					</div>
				</div>
			</a>

			<!-- 2. INSTAGRAM CARD -->
			<a
				href="https://www.instagram.com/vet.crew.hospital"
				target="_blank"
				rel="noopener noreferrer"
				class="action-card card-insta"
			>
				<div class="card-glow insta-glow"></div>
				<div class="card-icon-wrap insta-icon-wrap">
					<svg class="card-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
						<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
					</svg>
				</div>
				<div class="card-body">
					<div class="card-sub">{langStore.t('btn_instagram_label')}</div>
					<div class="card-title">{langStore.t('btn_instagram_sub')}</div>
					<div class="card-action-bar">
						<span class="btn-primary-action insta-btn-action">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
							{langStore.t('btn_instagram_action')}
						</span>
					</div>
				</div>
			</a>

			<!-- 3. MAP CARD -->
			<a
				href="https://maps.app.goo.gl/sTe5ePLTwwwQEZQz6"
				target="_blank"
				rel="noopener noreferrer"
				class="action-card card-map"
			>
				<div class="card-glow map-glow"></div>
				<div class="card-icon-wrap map-icon-wrap">
					<svg class="card-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
						<circle cx="12" cy="10" r="3"/>
					</svg>
				</div>
				<div class="card-body">
					<div class="card-sub">{langStore.t('btn_map_label')}</div>
					<div class="card-title">{langStore.t('btn_map_sub')}</div>
					<div class="card-action-bar">
						<span class="btn-primary-action map-btn-action">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
							{langStore.t('btn_map_action')}
						</span>
					</div>
				</div>
			</a>
		</div>
	{/if}
</div>

<style>
	.actions-wrapper {
		position: relative;
		width: 100%;
		max-width: 820px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		z-index: 40;
		transition: all 0.65s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* ==============================
	   STATE 1: COMPACT DOCK
	   ============================== */
	.dock-container {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		padding: 0.45rem 0.75rem;
		border-radius: 9999px;
		box-shadow: var(--card-shadow);
		animation: dockFadeIn 0.5s ease-out;
		transition: transform 0.3s ease, border-color 0.3s ease;
	}

	.dock-container:hover {
		border-color: var(--card-border-hover);
		transform: translateY(-2px);
	}

	.dock-divider {
		width: 1px;
		height: 24px;
		background: var(--card-border);
	}

	.dock-item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.85rem;
		border-radius: 9999px;
		text-decoration: none;
		color: var(--text-primary);
		transition: background 0.25s ease, transform 0.2s ease;
	}

	.dock-item:hover {
		background: var(--pill-hover);
		transform: scale(1.04);
	}

	.dock-icon-box {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.25s ease;
	}

	.dock-icon {
		width: 18px;
		height: 18px;
	}

	.dock-phone .dock-icon-box {
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
	}
	.dock-phone:hover .dock-icon-box {
		background: #22c55e;
		color: #ffffff;
		box-shadow: 0 0 16px var(--glow-phone);
	}

	.dock-insta .dock-icon-box {
		background: rgba(225, 48, 108, 0.15);
		color: #e1306c;
	}
	.dock-insta:hover .dock-icon-box {
		background: #e1306c;
		color: #ffffff;
		box-shadow: 0 0 16px var(--glow-insta);
	}

	.dock-map .dock-icon-box {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}
	.dock-map:hover .dock-icon-box {
		background: #3b82f6;
		color: #ffffff;
		box-shadow: 0 0 16px var(--glow-map);
	}

	.dock-label {
		font-size: 0.88rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	/* ==============================
	   STATE 2: EXPANDED CARDS
	   ============================== */
	.cards-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		padding: 0 1.25rem;
		animation: cardsSlideUp 0.65s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.action-card {
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 1.5rem;
		min-height: 200px;
		border-radius: 1.5rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		box-shadow: var(--card-shadow);
		text-decoration: none;
		color: var(--text-primary);
		transition:
			transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.4s ease,
			box-shadow 0.4s ease;
	}

	.action-card:hover {
		transform: translateY(-6px);
		border-color: var(--card-border-hover);
		box-shadow: 0 20px 48px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 179, 39, 0.15);
	}

	:global([data-theme='light']) .action-card:hover {
		box-shadow: 0 20px 45px -10px rgba(19, 55, 27, 0.18), 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	.card-glow {
		position: absolute;
		top: -40px;
		right: -40px;
		width: 140px;
		height: 140px;
		border-radius: 50%;
		filter: blur(45px);
		opacity: 0.35;
		pointer-events: none;
		transition: opacity 0.4s ease;
	}
	.action-card:hover .card-glow {
		opacity: 0.65;
	}

	.phone-glow {
		background: #22c55e;
	}
	.insta-glow {
		background: #e1306c;
	}
	.map-glow {
		background: #3b82f6;
	}

	.card-icon-wrap {
		width: 52px;
		height: 52px;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.25rem;
		transition: transform 0.35s ease;
	}
	.action-card:hover .card-icon-wrap {
		transform: scale(1.1);
	}

	.card-svg {
		width: 26px;
		height: 26px;
	}

	.phone-icon-wrap {
		background: rgba(34, 197, 94, 0.16);
		color: #22c55e;
	}
	.insta-icon-wrap {
		background: rgba(225, 48, 108, 0.16);
		color: #e1306c;
	}
	.map-icon-wrap {
		background: rgba(59, 130, 246, 0.16);
		color: #3b82f6;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.card-sub {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 700;
		color: var(--text-muted);
	}

	.card-title {
		font-size: 1.12rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		line-height: 1.3;
	}

	.phone-number {
		font-feature-settings: 'tnum';
		font-variant-numeric: tabular-nums;
	}

	.card-action-bar {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-primary-action {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.95rem;
		border-radius: 9999px;
		font-size: 0.82rem;
		font-weight: 700;
		transition: filter 0.25s ease, transform 0.2s ease;
	}
	.action-card:hover .btn-primary-action {
		transform: translateX(2px);
	}

	.phone-btn-action {
		background: #22c55e;
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
	}
	.insta-btn-action {
		background: #e1306c;
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(225, 48, 108, 0.3);
	}
	.map-btn-action {
		background: #3b82f6;
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
	}

	.btn-copy {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.5rem 0.65rem;
		border-radius: 9999px;
		background: var(--pill-bg);
		color: var(--text-secondary);
		border: 1px solid var(--card-border);
		font-size: 0.78rem;
		font-weight: 600;
		transition: background 0.2s ease, color 0.2s ease;
	}
	.btn-copy:hover {
		background: var(--pill-hover);
		color: var(--text-primary);
	}

	@keyframes dockFadeIn {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes cardsSlideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 820px) {
		.cards-grid {
			grid-template-columns: 1fr;
			gap: 0.9rem;
			max-width: 480px;
		}

		.action-card {
			padding: 1.15rem 1.25rem;
			min-height: auto;
		}

		.dock-label {
			display: none;
		}
		.dock-item {
			padding: 0.4rem;
		}
	}
</style>

