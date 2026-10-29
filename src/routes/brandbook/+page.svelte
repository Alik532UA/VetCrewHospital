<script lang="ts">
	import { base } from '$app/paths';
	import { resolve } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import LogoCustomizer from '$lib/components/LogoCustomizer.svelte';

	let copiedVal = $state<string | null>(null);

	const colors = [
		{
			hex: '#93C84A',
			name: 'light Green',
			textColor: '#101e14',
			rgb: '147, 200, 74'
		},
		{
			hex: '#598F3A',
			name: 'main Green',
			textColor: '#ffffff',
			rgb: '89, 143, 58'
		},
		{
			hex: '#13371B',
			name: 'dark Green',
			textColor: '#ffffff',
			rgb: '19, 55, 27'
		},
		{
			hex: '#E5E5E5',
			name: 'Light',
			textColor: '#101e14',
			rgb: '229, 229, 229'
		},
		{
			hex: '#FFB327',
			name: 'yellow',
			textColor: '#101e14',
			rgb: '255, 179, 39'
		},
		{
			hex: '#262626',
			name: 'Dark',
			textColor: '#ffffff',
			rgb: '38, 38, 38'
		}
	];

	async function copyToClipboard(val: string) {
		try {
			await navigator.clipboard.writeText(val);
			copiedVal = val;
			setTimeout(() => {
				if (copiedVal === val) copiedVal = null;
			}, 2000);
		} catch {}
	}
</script>

<svelte:head>
	<title>{langStore.current === 'uk' ? 'Брендбук — Vet Crew Hospital' : 'BrandBook — Vet Crew Hospital'}</title>
	<meta name="description" content="Офіційний гайдлайн та брендбук Vet Crew Hospital: колірна палітра, логотип, типографіка та правила візуальної ідентичності." />
</svelte:head>

<div class="brandbook-page">
	<div class="brandbook-container">
		<!-- HEADER -->
		<header class="brandbook-header">
			<a href={resolve('/')} class="back-link">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="19" y1="12" x2="5" y2="12"></line>
					<polyline points="12 19 5 12 12 5"></polyline>
				</svg>
				<span>{langStore.current === 'uk' ? 'На головну' : 'Back to Home'}</span>
			</a>

			<div class="header-titles">
				<div class="header-badge">
					<span class="badge-dot"></span>
					<span>{langStore.current === 'uk' ? 'Офіційний гайдлайн айдентики' : 'Official Visual Identity Guidelines'}</span>
				</div>
				<h1 class="main-title">
					{langStore.current === 'uk' ? 'Брендбук Vet Crew Hospital' : 'Vet Crew Hospital BrandBook'}
				</h1>
				<p class="main-lead">
					{langStore.current === 'uk'
						? 'Константи візуального стилю, сертифікована колірна палітра, анатомія інтерактивного логотипа та правила використання фірмових елементів.'
						: 'Visual identity constants, certified brand color palette, interactive logo anatomy and usage rules.'}
				</p>
			</div>
		</header>

		<!-- SECTION 1: COLOR PALETTE -->
		<section class="guide-card" id="palette">
			<div class="card-head">
				<span class="step-num">01</span>
				<div>
					<h2 class="card-title">{langStore.current === 'uk' ? 'Фірмова колірна палітра' : 'Brand Color Palette'}</h2>
					<p class="card-desc">
						{langStore.current === 'uk'
							? '6 канонічних відтінків бренду Vet Crew. Натисніть на код для швидкого копіювання.'
							: '6 canonical brand shades of Vet Crew. Click on any code to copy.'}
					</p>
				</div>
			</div>

			<div class="palette-grid">
				{#each colors as c (c.hex)}
					<div class="color-tile" style="--tile-bg: {c.hex}; --tile-fg: {c.textColor};">
						<div class="tile-swatch">
							<span class="tile-hex">{c.hex}</span>
							<span class="tile-tag">{c.name}</span>
						</div>
						<div class="tile-info">
							<div class="copy-actions">
								<button
									type="button"
									class="copy-btn"
									class:is-copied={copiedVal === c.hex}
									onclick={() => copyToClipboard(c.hex)}
								>
									<span>{copiedVal === c.hex ? (langStore.current === 'uk' ? 'Скопійовано!' : 'Copied!') : c.hex}</span>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										{#if copiedVal === c.hex}
											<polyline points="20 6 9 17 4 12"></polyline>
										{:else}
											<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
											<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
										{/if}
									</svg>
								</button>

								<button
									type="button"
									class="copy-btn secondary"
									class:is-copied={copiedVal === `rgb(${c.rgb})`}
									onclick={() => copyToClipboard(`rgb(${c.rgb})`)}
								>
									<span>{copiedVal === `rgb(${c.rgb})` ? 'RGB OK' : `RGB: ${c.rgb}`}</span>
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- SECTION 2: LOGO ANATOMY & CUSTOMIZER -->
		<section class="guide-card" id="logo-anatomy">
			<div class="card-head">
				<span class="step-num">02</span>
				<div>
					<h2 class="card-title">{langStore.current === 'uk' ? 'Логотип та генератор кольорів' : 'Logo & Color Studio'}</h2>
					<p class="card-desc">
						{langStore.current === 'uk'
							? 'Налаштовуйте кольори для кожної частини логотипу або виберіть готовий шаблон, тестуйте на різному тлі та завантажуйте готовий векторний SVG чи PNG.'
							: 'Customize colors for each logo element or pick a preset, test on light/dark stage and export ready SVG or PNG.'}
					</p>
				</div>
			</div>

			<LogoCustomizer brandColors={colors} />
		</section>

		<!-- SECTION 3: TYPOGRAPHY -->
		<section class="guide-card" id="typography">
			<div class="card-head">
				<span class="step-num">03</span>
				<div>
					<h2 class="card-title">{langStore.current === 'uk' ? 'Типографіка' : 'Typography'}</h2>
					<p class="card-desc">
						{langStore.current === 'uk'
							? 'Основна гарнітура інтерфейсу — Plus Jakarta Sans із гуманістичним геометричним накресленням.'
							: 'Primary UI typography is Plus Jakarta Sans with geometric balance and humanist readability.'}
					</p>
				</div>
			</div>

			<div class="type-samples">
				<div class="type-item">
					<div class="type-meta">Plus Jakarta Sans — Bold 700 / 800</div>
					<div class="type-demo bold-demo">Vet Crew Hospital 24/7</div>
				</div>
				<div class="type-item">
					<div class="type-meta">Plus Jakarta Sans — Medium 500 / 600</div>
					<div class="type-demo medium-demo">Цілодобова невідкладна ветеринарна допомога та турбота про улюбленців</div>
				</div>
				<div class="type-item">
					<div class="type-meta">Plus Jakarta Sans — Regular 400</div>
					<div class="type-demo regular-demo">Абсолютна безпека, сучасні методи діагностики, хірургія та терапія. Одеса, вул. Майстрова, 4.</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	:global(body:has(.brandbook-page)) {
		overflow-y: auto !important;
		height: auto !important;
		min-height: 100% !important;
		user-select: text !important;
		-webkit-user-select: text !important;
	}

	.brandbook-page {
		min-height: 100vh;
		padding: 2.5rem 1.5rem 5rem;
		position: relative;
		z-index: 10;
	}

	.brandbook-container {
		max-width: 1080px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.brandbook-header {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--fg-secondary);
		text-decoration: none;
		padding: 0.4rem 0.85rem;
		border-radius: 9999px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		width: fit-content;
		backdrop-filter: blur(12px);
		transition: all 0.25s ease;
	}

	.back-link:hover {
		color: var(--fg-primary);
		border-color: var(--border-hover);
		transform: translateX(-3px);
	}

	.header-titles {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.header-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--brand-leaf);
	}

	.badge-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--brand-leaf);
	}

	.main-title {
		font-size: clamp(1.8rem, 4vw, 2.75rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--fg-primary);
		line-height: 1.2;
	}

	.main-lead {
		font-size: 1.05rem;
		color: var(--fg-secondary);
		max-width: 720px;
		line-height: 1.6;
	}

	/* CARDS */
	.guide-card {
		background: var(--panel-bg);
		border: 1px solid var(--panel-border);
		border-radius: 1.75rem;
		padding: 2.25rem;
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		box-shadow: var(--panel-shadow);
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
	}

	.step-num {
		font-size: 1.75rem;
		font-weight: 900;
		font-family: monospace;
		color: var(--brand-leaf);
		line-height: 1;
		padding-top: 0.2rem;
	}

	.card-title {
		font-size: 1.4rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--fg-primary);
	}

	.card-desc {
		font-size: 0.92rem;
		color: var(--fg-secondary);
		margin-top: 0.25rem;
	}

	/* PALETTE GRID */
	.palette-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}

	.color-tile {
		border-radius: 1.25rem;
		overflow: hidden;
		border: 1px solid var(--border);
		background: var(--panel-bg);
		display: flex;
		flex-direction: column;
		transition: transform 0.25s ease, box-shadow 0.25s ease;
	}

	.color-tile:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
	}

	.tile-swatch {
		height: 130px;
		background-color: var(--tile-bg);
		color: var(--tile-fg);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.tile-hex {
		font-family: monospace;
		font-weight: 800;
		font-size: 1.25rem;
		letter-spacing: 0.04em;
	}

	.tile-tag {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		opacity: 0.85;
	}

	.tile-info {
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.copy-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.copy-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.65rem;
		border-radius: 8px;
		background: var(--border);
		color: var(--fg-primary);
		font-family: monospace;
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.copy-btn:hover {
		border-color: var(--border-hover);
		background: var(--panel-bg);
	}

	.copy-btn.is-copied {
		background: var(--brand-leaf);
		color: #ffffff;
	}

	.copy-btn.secondary {
		font-weight: 500;
		font-size: 0.72rem;
		color: var(--fg-secondary);
	}

	@media (max-width: 860px) {
		.palette-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
