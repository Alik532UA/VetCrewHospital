<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { downloadUrlAsPng } from '$lib/utils/exportPng';
	import StageBgSwitcher, { type StageTheme } from '$lib/components/brand/StageBgSwitcher.svelte';

	// Global format toggle: with background container vs transparent without background
	let withBg = $state(true);
	let stageTheme = $state<StageTheme>('checker');

	// Subvariant selections
	type ReviewVariant = 'vidhuk' | 'google-reviews' | 'reviews';
	let reviewVariant = $state<ReviewVariant>('vidhuk');

	type WebsiteVariant = 'v2' | 'v1';
	let websiteVariant = $state<WebsiteVariant>('v2');

	const REVIEW_FILES: Record<ReviewVariant, { bg: string; nobg: string; labelUk: string; labelEn: string }> = {
		vidhuk: {
			bg: 'vidhuk.svg',
			nobg: 'vidhuk-nobg.svg',
			labelUk: 'Відгуки (UA)',
			labelEn: 'Reviews (UA)'
		},
		'google-reviews': {
			bg: 'google-reviews.svg',
			nobg: 'google-reviews-nobg.svg',
			labelUk: 'Google Reviews',
			labelEn: 'Google Reviews'
		},
		reviews: {
			bg: 'reviews.svg',
			nobg: 'reviews-nobg.svg',
			labelUk: 'Reviews',
			labelEn: 'Reviews'
		}
	};

	const WEBSITE_FILES: Record<WebsiteVariant, { bg: string; nobg: string; labelUk: string; labelEn: string }> = {
		v2: {
			bg: 'website-v2.svg',
			nobg: 'website-v2-nobg.svg',
			labelUk: 'Валентина',
			labelEn: 'Valentyna'
		},
		v1: {
			bg: 'website.svg',
			nobg: 'website-nobg.svg',
			labelUk: 'Алік',
			labelEn: 'Alik'
		}
	};

	let activeReviewFile = $derived(withBg ? REVIEW_FILES[reviewVariant].bg : REVIEW_FILES[reviewVariant].nobg);
	let activeWebsiteFile = $derived(withBg ? WEBSITE_FILES[websiteVariant].bg : WEBSITE_FILES[websiteVariant].nobg);
	let wifiFile = $derived(withBg ? 'wifi.svg' : 'wifi-nobg.svg');
	let igFile = $derived(withBg ? 'instagram.svg' : 'instagram-nobg.svg');

	let isExporting = $state<string | null>(null);

	async function exportQrPng(relativeFile: string, baseFilename: string) {
		isExporting = relativeFile;
		try {
			await downloadUrlAsPng(`${base}/brand/qr/${relativeFile}`, `${baseFilename}-2000px.png`, 2000);
		} catch (err) {
			console.error('PNG export failed', err);
		} finally {
			isExporting = null;
		}
	}
</script>

<div class="qr-showcase-widget">
	<!-- Control Bar: Mode Toggle -->
	<div class="showcase-toolbar">
		<div class="mode-meta">
			<span class="mode-label">{langStore.current === 'uk' ? 'Формат макета:' : 'Signage Format:'}</span>
			<span class="mode-desc">
				{langStore.current === 'uk'
					? 'Оберіть повнорозмірний акриловий контейнер або прозорий векторний QR-код без тла.'
					: 'Select full acrylic container or clean transparent vector QR artwork.'}
			</span>
		</div>

		<div class="toolbar-actions">
			<div class="toggle-pill-wrap">
				<button
					type="button"
					class="pill-btn"
					class:is-active={withBg}
					onclick={() => (withBg = true)}
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" class="pill-icon" aria-hidden="true">
						<rect x="4" y="2.5" width="16" height="19" rx="3.5"/>
					</svg>
					<span>{langStore.current === 'uk' ? 'З фірмовим контейнером' : 'With Background Plaque'}</span>
				</button>
				<button
					type="button"
					class="pill-btn"
					class:is-active={!withBg}
					onclick={() => (withBg = false)}
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="3.5 2.5" stroke-linecap="round" class="pill-icon" aria-hidden="true">
						<rect x="4" y="2.5" width="16" height="19" rx="3.5"/>
					</svg>
					<span>{langStore.current === 'uk' ? 'Чистий без фону (прозорий)' : 'Transparent (No Background)'}</span>
				</button>
			</div>

			<StageBgSwitcher bind:current={stageTheme} />
		</div>
	</div>

	<!-- Cards Grid -->
	<div class="qr-cards-grid">
		<!-- 1. Master Background Plaque Template -->
		<div class="qr-card template-card">
			<div class="qr-preview-stage stage--{stageTheme}">
				<img
					src="{base}/brand/qr/background.svg"
					alt="Фоновий контейнер (Підкладка)"
					class="qr-svg-render"
					loading="lazy"
				/>
			</div>

			<div class="qr-meta">
				<div class="qr-title-row">
					<h3 class="qr-title">{langStore.current === 'uk' ? 'Фоновий контейнер' : 'Plaque Background'}</h3>
					<span class="qr-badge badge--neutral">{langStore.current === 'uk' ? 'Шаблон' : 'Template'}</span>
				</div>
				<p class="qr-desc">
					{langStore.current === 'uk'
						? 'Чистий фірмовий векторний шаблон підкладки для друку акрилових стійок або верстки нових QR-табличок.'
						: 'Blank branded plaque container template for acrylic stand manufacturing or laying out new QR signs.'}
				</p>
			</div>

			<div class="qr-actions">
				<a
					href="{base}/brand/qr/background.svg"
					download="vet-crew-qr-plaque-background.svg"
					class="download-qr-btn svg-btn"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'SVG (Вектор)' : 'Vector (SVG)'}</span>
				</a>
				<button
					type="button"
					class="download-qr-btn png-btn"
					onclick={() => exportQrPng('background.svg', 'vet-crew-qr-plaque-background')}
					disabled={isExporting === 'background.svg'}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isExporting === 'background.svg' ? '...' : 'PNG (2000 px)'}</span>
				</button>
			</div>
		</div>

		<!-- 2. Wi-Fi Signage -->
		<div class="qr-card">
			<div class="qr-preview-stage stage--{stageTheme}" class:is-nobg={!withBg}>
				<img
					src="{base}/brand/qr/{wifiFile}"
					alt="Wi-Fi"
					class="qr-svg-render"
					loading="lazy"
				/>
			</div>

			<div class="qr-meta">
				<div class="qr-title-row">
					<h3 class="qr-title">Wi-Fi</h3>
					<span class="qr-badge badge--wifi">Wi-Fi</span>
				</div>
				<p class="qr-desc">
					{langStore.current === 'uk'
						? 'Миттєве підключення відвідувачів до швидкісної бездротової мережі в рецепції та зоні очікування.'
						: 'Instant visitor Wi-Fi network connection for reception desks and waiting areas.'}
				</p>
			</div>

			<div class="qr-actions">
				<a
					href="{base}/brand/qr/{wifiFile}"
					download="vet-crew-wifi{withBg ? '' : '-nobg'}.svg"
					class="download-qr-btn svg-btn"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'SVG (Вектор)' : 'Vector (SVG)'}</span>
				</a>
				<button
					type="button"
					class="download-qr-btn png-btn"
					onclick={() => exportQrPng(wifiFile, `vet-crew-wifi${withBg ? '' : '-nobg'}`)}
					disabled={isExporting === wifiFile}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isExporting === wifiFile ? '...' : 'PNG (2000 px)'}</span>
				</button>
			</div>
		</div>

		<!-- 3. Instagram Signage -->
		<div class="qr-card">
			<div class="qr-preview-stage stage--{stageTheme}" class:is-nobg={!withBg}>
				<img
					src="{base}/brand/qr/{igFile}"
					alt="Instagram"
					class="qr-svg-render"
					loading="lazy"
				/>
			</div>

			<div class="qr-meta">
				<div class="qr-title-row">
					<h3 class="qr-title">Instagram</h3>
					<span class="qr-badge badge--ig">Social</span>
				</div>
				<p class="qr-desc">
					{langStore.current === 'uk'
						? 'Офіційна сторінка клініки: щоденні історії порятунку диких пацієнтів, новини шпиталю та фотозвіти.'
						: 'Official clinic Instagram: daily exotic wildlife rescues, patient recoveries, and news.'}
				</p>
			</div>

			<div class="qr-actions">
				<a
					href="{base}/brand/qr/{igFile}"
					download="vet-crew-instagram{withBg ? '' : '-nobg'}.svg"
					class="download-qr-btn svg-btn"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{langStore.current === 'uk' ? 'SVG (Вектор)' : 'Vector (SVG)'}</span>
				</a>
				<button
					type="button"
					class="download-qr-btn png-btn"
					onclick={() => exportQrPng(igFile, `vet-crew-instagram${withBg ? '' : '-nobg'}`)}
					disabled={isExporting === igFile}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isExporting === igFile ? '...' : 'PNG (2000 px)'}</span>
				</button>
			</div>
		</div>

		<!-- 4. Google Reviews Signage (Master Card with 3 subvariants) -->
		<div class="qr-card">
			<div class="qr-preview-stage stage--{stageTheme}" class:is-nobg={!withBg}>
				<img
					src="{base}/brand/qr/{activeReviewFile}"
					alt="Google Reviews"
					class="qr-svg-render"
					loading="lazy"
				/>
			</div>

			<div class="qr-meta">
				<div class="qr-title-row">
					<h3 class="qr-title">{langStore.current === 'uk' ? 'Відгуки' : 'Reviews'}</h3>
					<span class="qr-badge badge--reviews">Google Maps</span>
				</div>
				<p class="qr-desc">
					{langStore.current === 'uk'
						? 'Пряме посилання на картку Vet Crew Hospital у Google Maps для оцінки та відгуків клієнтів (єдиний QR-код у 3 мовних варіантах).'
						: 'Direct QR code to Vet Crew Hospital on Google Maps for ratings and client reviews (identical QR code across 3 lettering variants).'}
				</p>

				<!-- Subvariant Switcher -->
				<div class="subvariant-section">
					<span class="subvariant-title">{langStore.current === 'uk' ? 'Варіант напису:' : 'Variant:'}</span>
					<div class="subvariant-pills">
						{#each (['vidhuk', 'google-reviews', 'reviews'] as const) as v}
							<button
								type="button"
								class="sub-pill"
								class:is-active={reviewVariant === v}
								onclick={() => (reviewVariant = v)}
							>
								{langStore.current === 'uk' ? REVIEW_FILES[v].labelUk : REVIEW_FILES[v].labelEn}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="qr-actions">
				<a
					href="{base}/brand/qr/{activeReviewFile}"
					download="vet-crew-{reviewVariant}{withBg ? '' : '-nobg'}.svg"
					class="download-qr-btn svg-btn"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>
						{langStore.current === 'uk'
							? `SVG (${REVIEW_FILES[reviewVariant].labelUk})`
							: `SVG (${REVIEW_FILES[reviewVariant].labelEn})`}
					</span>
				</a>
				<button
					type="button"
					class="download-qr-btn png-btn"
					onclick={() => exportQrPng(activeReviewFile, `vet-crew-${reviewVariant}${withBg ? '' : '-nobg'}`)}
					disabled={isExporting === activeReviewFile}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isExporting === activeReviewFile ? '...' : 'PNG (2000 px)'}</span>
				</button>
			</div>
		</div>

		<!-- 5. Official Website Signage (Master Card with v2 / v1 subvariants) -->
		<div class="qr-card">
			<div class="qr-preview-stage stage--{stageTheme}" class:is-nobg={!withBg}>
				<img
					src="{base}/brand/qr/{activeWebsiteFile}"
					alt="Офіційний сайт"
					class="qr-svg-render"
					loading="lazy"
				/>
			</div>

			<div class="qr-meta">
				<div class="qr-title-row">
					<h3 class="qr-title">{langStore.current === 'uk' ? 'Офіційний сайт' : 'Official Website'}</h3>
					<span class="qr-badge badge--web">Web</span>
				</div>
				<p class="qr-desc">
					{langStore.current === 'uk'
						? 'Цілодобовий онлайн-запис, контакти чергових лікарів, графік прийому та повний перелік медичних послуг.'
						: '24/7 online appointment booking, emergency contacts, on-call schedules, and medical service directory.'}
				</p>

				<!-- Subvariant Switcher -->
				<div class="subvariant-section">
					<span class="subvariant-title">{langStore.current === 'uk' ? 'Версія іконки:' : 'Icon Version:'}</span>
					<div class="subvariant-pills">
						{#each (['v2', 'v1'] as const) as v}
							<button
								type="button"
								class="sub-pill"
								class:is-active={websiteVariant === v}
								onclick={() => (websiteVariant = v)}
							>
								{langStore.current === 'uk' ? WEBSITE_FILES[v].labelUk : WEBSITE_FILES[v].labelEn}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="qr-actions">
				<a
					href="{base}/brand/qr/{activeWebsiteFile}"
					download="vet-crew-website-{websiteVariant === 'v2' ? 'valentyna' : 'alik'}{withBg ? '' : '-nobg'}.svg"
					class="download-qr-btn svg-btn"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>
						{langStore.current === 'uk'
							? `SVG (${WEBSITE_FILES[websiteVariant].labelUk})`
							: `SVG (${WEBSITE_FILES[websiteVariant].labelEn})`}
					</span>
				</a>
				<button
					type="button"
					class="download-qr-btn png-btn"
					onclick={() => exportQrPng(activeWebsiteFile, `vet-crew-website-${websiteVariant === 'v2' ? 'valentyna' : 'alik'}${withBg ? '' : '-nobg'}`)}
					disabled={isExporting === activeWebsiteFile}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					<span>{isExporting === activeWebsiteFile ? '...' : 'PNG (2000 px)'}</span>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.qr-showcase-widget {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.showcase-toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.4rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
	}

	.mode-meta {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.mode-label {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--fg-primary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mode-desc {
		font-size: 0.85rem;
		color: var(--fg-secondary);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.toggle-pill-wrap {
		display: flex;
		gap: 0.4rem;
		background: var(--panel-bg);
		padding: 0.35rem;
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	.pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.95rem;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--fg-secondary);
		font-size: 0.84rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pill-btn:hover {
		color: var(--fg-primary);
		background: var(--bg-secondary);
	}

	.pill-btn.is-active {
		background: var(--panel-bg);
		color: var(--brand-emerald);
		border-color: var(--brand-leaf);
		box-shadow: 0 2px 8px rgba(89, 143, 58, 0.18);
	}

	:global(.dark) .pill-btn.is-active {
		color: var(--brand-gold);
		border-color: var(--brand-gold);
		box-shadow: 0 2px 8px rgba(255, 179, 39, 0.15);
	}

	.pill-icon {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
		opacity: 0.75;
		transition: all 0.15s ease;
	}

	.pill-btn.is-active .pill-icon {
		color: var(--brand-emerald, #13371b);
		opacity: 1;
	}

	:global(.dark) .pill-btn.is-active .pill-icon {
		color: var(--brand-gold, #ffb327);
	}

	/* CARDS GRID */
	.qr-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.4rem;
	}

	.qr-card {
		display: flex;
		flex-direction: column;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 18px;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
	}

	.qr-card:hover {
		transform: translateY(-3px);
		border-color: var(--border-hover);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
	}

	.qr-card.template-card {
		border-style: dashed;
		border-color: var(--border-hover);
		background: linear-gradient(180deg, var(--panel-bg) 0%, var(--bg-secondary) 100%);
	}

	/* PREVIEW STAGE */
	.qr-preview-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
		background: var(--bg-secondary);
		min-height: 270px;
		border-bottom: 1px solid var(--border);
		position: relative;
	}

	.qr-preview-stage.is-nobg {
		background-image: 
			linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.04) 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
	}

	:global(.dark) .qr-preview-stage.is-nobg {
		background-image: 
			linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.04) 75%);
	}

	.qr-svg-render {
		max-width: 100%;
		max-height: 230px;
		width: auto;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.08));
		transition: transform 0.25s ease;
	}

	.qr-card:hover .qr-svg-render {
		transform: scale(1.03);
	}

	/* META INFO */
	.qr-meta {
		padding: 1.25rem 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		flex: 1;
	}

	.qr-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.qr-title {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--fg-primary);
		letter-spacing: -0.01em;
	}

	.qr-badge {
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.22rem 0.55rem;
		border-radius: 6px;
		background: rgba(89, 143, 58, 0.12);
		color: var(--brand-emerald);
	}

	:global(.dark) .qr-badge {
		color: var(--brand-gold);
		background: rgba(255, 179, 39, 0.12);
	}

	.qr-badge.badge--wifi {
		background: rgba(56, 189, 248, 0.15);
		color: #0284c7;
	}

	:global(.dark) .qr-badge.badge--wifi {
		background: rgba(56, 189, 248, 0.2);
		color: #38bdf8;
	}

	.qr-badge.badge--ig {
		background: rgba(225, 48, 108, 0.15);
		color: #e1306c;
	}

	.qr-badge.badge--reviews {
		background: rgba(255, 179, 39, 0.18);
		color: #b45309;
	}

	:global(.dark) .qr-badge.badge--reviews {
		color: #ffb327;
	}

	.qr-badge.badge--web {
		background: rgba(89, 143, 58, 0.16);
		color: #598f3a;
	}

	.qr-badge.badge--neutral {
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		border: 1px solid var(--border);
	}

	.qr-desc {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.45;
		color: var(--fg-secondary);
	}

	/* SUBVARIANT SECTION */
	.subvariant-section {
		margin-top: 0.35rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding-top: 0.65rem;
		border-top: 1px solid var(--border);
	}

	.subvariant-title {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--fg-muted, var(--fg-secondary));
	}

	.subvariant-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.sub-pill {
		padding: 0.32rem 0.65rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		font-size: 0.76rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.16s ease;
	}

	.sub-pill:hover {
		color: var(--fg-primary);
		border-color: var(--border-hover);
	}

	.sub-pill.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 2px 6px rgba(19, 55, 27, 0.25);
	}

	:global(.dark) .sub-pill.is-active {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 2px 6px rgba(255, 179, 39, 0.25);
	}

	/* ACTIONS */
	.qr-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		padding: 0 1.4rem 1.4rem;
	}

	.download-qr-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		width: 100%;
		padding: 0.65rem 0.85rem;
		border-radius: 10px;
		font-size: 0.8rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
		text-align: center;
	}

	.download-qr-btn.svg-btn {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border: 1px solid var(--brand-emerald, #13371b);
	}

	.download-qr-btn.svg-btn:hover:not(:disabled) {
		background: var(--brand-leaf, #598f3a);
		border-color: var(--brand-leaf, #598f3a);
		color: #ffffff;
		box-shadow: 0 4px 12px rgba(89, 143, 58, 0.25);
		transform: translateY(-1px);
	}

	:global(.dark) .download-qr-btn.svg-btn {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	:global(.dark) .download-qr-btn.svg-btn:hover:not(:disabled) {
		background: #ffa80a;
		border-color: #ffa80a;
		color: #101e14;
	}

	.download-qr-btn.png-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-primary);
	}

	.download-qr-btn.png-btn:hover:not(:disabled) {
		background: var(--panel-bg);
		border-color: var(--border-hover);
		color: var(--brand-leaf, #598f3a);
		transform: translateY(-1px);
	}

	:global(.dark) .download-qr-btn.png-btn:hover:not(:disabled) {
		color: var(--brand-gold, #ffb327);
	}

	.download-qr-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	@media (max-width: 640px) {
		.showcase-toolbar {
			flex-direction: column;
			align-items: flex-start;
		}

		.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.toggle-pill-wrap {
			width: 100%;
		}

		.pill-btn {
			flex: 1;
			justify-content: center;
		}

		.qr-cards-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
