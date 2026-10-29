<script lang="ts">
	import { base } from '$app/paths';
	import { resolve } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import LogoCustomizer from '$lib/components/LogoCustomizer.svelte';
	import BrandToc from '$lib/components/brand/BrandToc.svelte';
	import BrandSlogan from '$lib/components/brand/BrandSlogan.svelte';
	import AnimalGallery from '$lib/components/brand/AnimalGallery.svelte';
	import QrShowcase from '$lib/components/brand/QrShowcase.svelte';
	import BrandTypography from '$lib/components/brand/BrandTypography.svelte';
	import DoorSignage from '$lib/components/brand/DoorSignage.svelte';
	import PhotoLogos from '$lib/components/brand/PhotoLogos.svelte';

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
	<meta name="description" content="Офіційний гайдлайн та брендбук Vet Crew Hospital: колірна палітра, логотип, іконки тварин, QR-навігація, слоган та правила візуальної ідентичності." />
</svelte:head>

<div class="brandbook-page">
	<div class="brandbook-container">
		<!-- HEADER -->
		<header class="brandbook-header">
			<div class="top-nav-bar">
				<a href={resolve('/')} class="back-link">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					<span>{langStore.current === 'uk' ? 'На головну' : 'Back to Home'}</span>
				</a>

				<div class="header-actions">
					<!-- Theme Toggle Button -->
					<button
						type="button"
						class="header-action-btn theme-switch-btn"
						onclick={() => themeStore.toggle()}
						aria-label={themeStore.current === 'dark' ? (langStore.current === 'uk' ? 'Увімкнути світлу тему' : 'Switch to Light Mode') : (langStore.current === 'uk' ? 'Увімкнути темну тему' : 'Switch to Dark Mode')}
						title={themeStore.current === 'dark' ? (langStore.current === 'uk' ? 'Увімкнути світлу тему' : 'Switch to Light Mode') : (langStore.current === 'uk' ? 'Увімкнути темну тему' : 'Switch to Dark Mode')}
					>
						{#if themeStore.current === 'dark'}
							<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<circle cx="12" cy="12" r="4"/>
								<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
							</svg>
							<span>{langStore.current === 'uk' ? 'Світла тема' : 'Light'}</span>
						{:else}
							<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
							</svg>
							<span>{langStore.current === 'uk' ? 'Темна тема' : 'Dark'}</span>
						{/if}
					</button>

					<!-- Language Toggle Button -->
					<button
						type="button"
						class="header-action-btn lang-switch-btn"
						onclick={() => langStore.toggle()}
						aria-label={langStore.current === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
						title={langStore.current === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10"/>
							<line x1="2" y1="12" x2="22" y2="12"/>
							<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
						</svg>
						<span>{langStore.current === 'uk' ? 'UA' : 'EN'}</span>
					</button>
				</div>
			</div>

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
						? 'Константи візуального стилю, сертифікована колірна палітра, анатомія інтерактивного логотипа, фірмова іконографіка 24 тварин, QR-навігація та суббренди.'
						: 'Visual identity constants, certified brand color palette, interactive logo studio, 24 animal icons, QR signage and sub-brand assets.'}
				</p>
			</div>
		</header>

		<!-- MAIN 2-COLUMN LAYOUT WITH STICKY TOC -->
		<div class="brandbook-layout">
			<!-- STICKY SIDE NAVIGATION (TOC) -->
			<BrandToc />

			<!-- SECTIONS STACK -->
			<div class="brandbook-sections">
				<!-- SECTION 01: COLOR PALETTE -->
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

				<!-- SECTION 02: LOGO ANATOMY & STUDIO -->
				<section class="guide-card" id="logo-studio">
					<div class="card-head">
						<span class="step-num">02</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Логотип та генератор кольорів' : 'Logo & Color Studio'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Налаштовуйте кольори для кожної частини логотипу або виберіть готовий шаблон, вибирайте форму (коло, суцільний квадрат, прозоре тло) та завантажуйте векторний SVG чи PNG (2x).'
									: 'Customize colors for each logo element, choose background shape (circle badge, solid canvas, transparent) and export ready SVG or PNG (2x).'}
							</p>
						</div>
					</div>

					<LogoCustomizer brandColors={colors} />
				</section>

				<!-- SECTION 03: UKRAINIAN NAMING & SUB-BRANDS -->
				<section class="guide-card" id="naming">
					<div class="card-head">
						<span class="step-num">03</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Офіційна назва та суббренди' : 'Official Naming & Sub-brands'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Офіційне векторне накреслення назви шпиталю українською мовою та брендинг фірмового магазину Vet Crew Shop.'
									: 'Official Ukrainian lettering wordmark and Vet Crew Shop sub-brand visual identity.'}
							</p>
						</div>
					</div>

					<div class="naming-grid">
						<!-- Ukrainian Wordmark -->
						<div class="branding-card">
							<div class="branding-preview-stage">
								<img
									src="{base}/brand/naming/vet-crew-hospital-ua.svg"
									alt="ВЕТ КРЮ ХОСПІТАЛ"
									class="branding-svg-img"
								/>
							</div>
							<div class="branding-info">
								<div class="branding-badge">UA LETTERING</div>
								<h3 class="branding-title">{langStore.current === 'uk' ? 'Назва українською' : 'Ukrainian Wordmark'}</h3>
								<p class="branding-text">
									{langStore.current === 'uk'
										? 'Адаптоване накреслення «ВЕТ КРЮ ХОСПІТАЛ» для внутрішнього ринку, вивісок, бланкової документації та офіційної кореспонденції.'
										: 'Localized Ukrainian hospital title for domestic signage, legal paperwork, and medical reports.'}
								</p>
								<a
									href="{base}/brand/naming/vet-crew-hospital-ua.svg"
									download="vet-crew-hospital-ua.svg"
									class="download-brand-btn"
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
										<polyline points="7 10 12 15 17 10"></polyline>
										<line x1="12" y1="15" x2="12" y2="3"></line>
									</svg>
									<span>{langStore.current === 'uk' ? 'Завантажити SVG' : 'Download SVG'}</span>
								</a>
							</div>
						</div>

						<!-- Sub-brand: Shop -->
						<div class="branding-card">
							<div class="branding-preview-stage">
								<img
									src="{base}/brand/subbrands/vet-crew-shop.svg"
									alt="VET CREW SHOP"
									class="branding-svg-img"
								/>
							</div>
							<div class="branding-info">
								<div class="branding-badge shop-badge">SUB-BRAND</div>
								<h3 class="branding-title">VET CREW SHOP</h3>
								<p class="branding-text">
									{langStore.current === 'uk'
										? 'Офіційний логотип магазину спеціалізованих зоотоварів, кормів преміум-класу, кліток, тераріумів та медичного мерчу.'
										: 'Official emblem for veterinary pet-store, medical merchandise, exotic feeds, and professional care gear.'}
								</p>
								<a
									href="{base}/brand/subbrands/vet-crew-shop.svg"
									download="vet-crew-shop.svg"
									class="download-brand-btn"
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
										<polyline points="7 10 12 15 17 10"></polyline>
										<line x1="12" y1="15" x2="12" y2="3"></line>
									</svg>
									<span>{langStore.current === 'uk' ? 'Завантажити SVG' : 'Download SVG'}</span>
								</a>
							</div>
						</div>
					</div>
				</section>

				<!-- SECTION 04: BRAND SLOGAN & MISSION -->
				<section class="guide-card" id="slogan">
					<div class="card-head">
						<span class="step-num">04</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Фірмовий слоган та цінності' : 'Brand Slogan & Values'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Ключовий маніфест шпиталю «Екзотичні • Дикі • Особливі • Важливі» та окремий графічний символ Метелика.'
									: 'The hospital mission manifesto "Exotic • Wild • Special • Important" and standalone Butterfly brand symbol.'}
							</p>
						</div>
					</div>

					<BrandSlogan />
				</section>

				<!-- SECTION 05: ANIMAL ICONOGRAPHY (24) -->
				<section class="guide-card" id="animals">
					<div class="card-head">
						<span class="step-num">05</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Фірмова іконографіка (24 тварини)' : 'Animal Iconography (24 Species)'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Канонічний набір векторних силуетів пацієнтів шпиталю. Доступні для маркування відділень, медичних карток, навігації сайту та друку.'
									: 'Official icon set representing species treated at Vet Crew. Available for clinical charts, signage, and merchandise.'}
							</p>
						</div>
					</div>

					<AnimalGallery />
				</section>

				<!-- SECTION 06: QR SIGNAGE & SERVICING -->
				<section class="guide-card" id="qr">
					<div class="card-head">
						<span class="step-num">06</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'QR-навігація та таблички сервісів' : 'QR Signage & Service Plaques'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Готові векторні таблички швидкого доступу для рецепції, зони очікування та цифрових носіїв. Перемикайте варіант із фірмовим контейнером або чистий без фону.'
									: 'Ready-to-print vector plaques for clinic counters and digital screens. Toggle with background container or pure transparent.'}
							</p>
						</div>
					</div>

					<QrShowcase />
				</section>

				<!-- SECTION 07: TYPOGRAPHY -->
				<section class="guide-card" id="typography">
					<div class="card-head">
						<span class="step-num">07</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Типографіка' : 'Typography'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Офіційні гарнітури шпиталю: InGlobal Bold (логотип), Montserrat (навігація та поліграфія) та Permanent Marker (рукописні акценти) з інтерактивним тестером.'
									: 'Official hospital typefaces: InGlobal Bold, Montserrat, and Permanent Marker with an interactive specimen playground.'}
							</p>
						</div>
					</div>

					<BrandTypography />
				</section>

				<!-- SECTION 08: CLINIC & DOOR SIGNAGE -->
				<section class="guide-card" id="door-signs">
					<div class="card-head">
						<span class="step-num">08</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Дверні таблички та навігація відділень' : 'Door Signage & Department Navigation'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Повна система внутрішньої фізичної навігації госпіталю на вул. Майстровій: таблички на двері кабінетів (композитні й текстові) та медичні піктограми відділень у 7 фірмових кольорах.'
									: 'Complete interior hospital wayfinding system: door plaques (composite & text) and department pictograms in 7 brand colors.'}
							</p>
						</div>
					</div>

					<DoorSignage />
				</section>

				<!-- SECTION 09: PHOTO EMBLEMS -->
				<section class="guide-card" id="photo-logos">
					<div class="card-head">
						<span class="step-num">09</span>
						<div>
							<h2 class="card-title">{langStore.current === 'uk' ? 'Емблема шпиталю з тваринами' : 'Hospital Emblems with Animals'}</h2>
							<p class="card-desc">
								{langStore.current === 'uk'
									? 'Офіційні векторні композиції емблеми шпиталю з силуетами тварин та повною назвою Центру лікування. Чиста оптимізована векторна графіка для друку та цифрових носіїв.'
									: 'Official hospital emblem vector compositions featuring wildlife silhouettes and full clinical lettering. Pure optimized vector artwork for print and digital media.'}
							</p>
						</div>
					</div>

					<PhotoLogos />
				</section>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body:has(.brandbook-page)) {
		overflow: visible !important;
		height: auto !important;
		min-height: 100% !important;
		user-select: text !important;
		-webkit-user-select: text !important;
	}

	.brandbook-page {
		min-height: 100vh;
		padding: 2.5rem 1.5rem 6rem;
		position: relative;
		z-index: 10;
	}

	.brandbook-container {
		max-width: 1180px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		min-width: 0;
	}

	.brandbook-header {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-left: calc(64px + 2rem);
		transition: padding 0.2s ease;
	}

	.top-nav-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		flex-wrap: wrap;
	}

	.header-actions {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}

	.header-action-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.42rem 0.95rem;
		border-radius: 9999px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		transition: all 0.2s ease;
	}

	.header-action-btn:hover {
		border-color: var(--border-hover);
		color: var(--brand-leaf);
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='dark']) .header-action-btn:hover,
	:global(.dark) .header-action-btn:hover {
		color: var(--brand-gold);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
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
		max-width: 780px;
		line-height: 1.6;
	}

	/* 2-COLUMN BRANDBOOK LAYOUT */
	.brandbook-layout {
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
		min-width: 0;
	}

	.brandbook-sections {
		display: flex;
		flex-direction: column;
		gap: 2.75rem;
		min-width: 0;
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
		scroll-margin-top: 2rem;
		min-width: 0;
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

	/* SECTION 03: NAMING & SUB-BRANDS */
	.naming-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.branding-card {
		display: flex;
		flex-direction: column;
		border-radius: 1.25rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.branding-card:hover {
		border-color: var(--border-hover);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
	}

	.branding-preview-stage {
		height: 180px;
		background: var(--panel-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.branding-svg-img {
		max-width: 90%;
		max-height: 90%;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
	}

	:global([data-theme='dark']) .branding-svg-img {
		filter: brightness(1.2) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
	}

	.branding-info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		flex: 1;
	}

	.branding-badge {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.12);
		padding: 3px 8px;
		border-radius: 6px;
		width: fit-content;
		letter-spacing: 0.04em;
	}

	.branding-badge.shop-badge {
		color: #ffb327;
		background: rgba(255, 179, 39, 0.15);
	}

	.branding-title {
		font-size: 1.2rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
	}

	.branding-text {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--fg-secondary);
		margin: 0 0 auto;
	}

	.download-brand-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.55rem 1rem;
		border-radius: 10px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
		margin-top: 0.75rem;
		transition: all 0.2s ease;
	}

	.download-brand-btn:hover {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
	}

	:global(.dark) .download-brand-btn:hover {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	/* RESPONSIVE */
	@media (max-width: 900px) {
		.brandbook-page {
			padding: 1.5rem 1rem calc(4.5rem + 50px);
		}

		.brandbook-header {
			padding-left: 0;
		}

		.brandbook-layout {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
		}

		.brandbook-sections {
			gap: 1.75rem;
		}

		.guide-card {
			padding: 1.5rem;
			border-radius: 1.25rem;
			gap: 1.5rem;
		}

		.palette-grid {
			grid-template-columns: 1fr;
		}

		.naming-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
