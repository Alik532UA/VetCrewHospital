<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

	interface QrItem {
		id: string;
		titleUk: string;
		titleEn: string;
		descUk: string;
		descEn: string;
		fileBg: string;
		fileNobg: string;
		color: string;
	}

	const QR_ITEMS: QrItem[] = [
		{
			id: 'wifi',
			titleUk: 'Гостьовий Wi-Fi',
			titleEn: 'Guest Wi-Fi',
			descUk: 'Підключення відвідувачів до швидкісної мережі в залі очікування',
			descEn: 'Visitor Wi-Fi connection in reception & waiting rooms',
			fileBg: 'wifi.svg',
			fileNobg: 'wifi-nobg.svg',
			color: '#38bdf8'
		},
		{
			id: 'google-reviews',
			titleUk: 'Google Відгуки',
			titleEn: 'Google Reviews',
			descUk: 'Прямий перехід на профіль шпиталю в Google Maps для відгуків',
			descEn: 'Direct QR to the hospital Google Maps profile & rating',
			fileBg: 'google-reviews.svg',
			fileNobg: 'google-reviews-nobg.svg',
			color: '#ffb327'
		},
		{
			id: 'instagram',
			titleUk: 'Instagram',
			titleEn: 'Instagram',
			descUk: 'Офіційна сторінка: порятунок тварин, реанімація та життя клініки',
			descEn: 'Official social media: daily patient updates & rescue stories',
			fileBg: 'instagram.svg',
			fileNobg: 'instagram-nobg.svg',
			color: '#e1306c'
		},
		{
			id: 'website',
			titleUk: 'Офіційний сайт',
			titleEn: 'Official Website',
			descUk: 'Цілодобовий онлайн-запис, контакти та повний перелік послуг',
			descEn: '24/7 emergency contact, appointment booking & directions',
			fileBg: 'website.svg',
			fileNobg: 'website-nobg.svg',
			color: '#598f3a'
		},
		{
			id: 'reviews',
			titleUk: 'Відгуки про лікарів',
			titleEn: 'Doctor Reviews',
			descUk: 'Форма зворотного зв\'язку та оцінки якості надання допомоги',
			descEn: 'Quality assessment and client feedback questionnaire',
			fileBg: 'reviews.svg',
			fileNobg: 'reviews-nobg.svg',
			color: '#ffb327'
		},
		{
			id: 'master-plaque',
			titleUk: 'Мастер-макет таблички',
			titleEn: 'Master Plaque Stand',
			descUk: 'Повний друкований макет акрилової стійки для рецепції',
			descEn: 'Complete acrylic counter signage template for hospital reception',
			fileBg: 'pj-qr.svg',
			fileNobg: 'pj-qr.svg',
			color: '#13371b'
		}
	];

	let withBg = $state(true);
</script>

<div class="qr-showcase-widget">
	<!-- Control Bar: Mode Toggle -->
	<div class="showcase-toolbar">
		<div class="mode-meta">
			<span class="mode-label">{langStore.current === 'uk' ? 'Формат відображення:' : 'Format:'}</span>
		</div>

		<div class="toggle-pill-wrap">
			<button
				type="button"
				class="pill-btn"
				class:is-active={withBg}
				onclick={() => (withBg = true)}
			>
				<span class="pill-glyph">■</span>
				<span>{langStore.current === 'uk' ? 'З фірмовим контейнером' : 'With Background Container'}</span>
			</button>
			<button
				type="button"
				class="pill-btn"
				class:is-active={!withBg}
				onclick={() => (withBg = false)}
			>
				<span class="pill-glyph">░</span>
				<span>{langStore.current === 'uk' ? 'Чистий без фону (прозорий)' : 'Transparent (No Background)'}</span>
			</button>
		</div>
	</div>

	<!-- Cards Grid -->
	<div class="qr-cards-grid">
		{#each QR_ITEMS as q (q.id)}
			{@const currentFile = withBg ? q.fileBg : q.fileNobg}
			<div class="qr-card">
				<div class="qr-preview-stage" class:is-nobg={!withBg}>
					<img
						src="{base}/brand/qr/{encodeURIComponent(currentFile)}"
						alt="{q.titleUk} ({q.titleEn})"
						class="qr-svg-render"
						loading="lazy"
					/>
				</div>

				<div class="qr-meta">
					<div class="qr-title-row">
						<span class="qr-title">{langStore.current === 'uk' ? q.titleUk : q.titleEn}</span>
						<span class="qr-badge" style="--accent: {q.color};">SVG</span>
					</div>
					<p class="qr-desc">{langStore.current === 'uk' ? q.descUk : q.descEn}</p>
				</div>

				<div class="qr-actions">
					<a
						href="{base}/brand/qr/{encodeURIComponent(currentFile)}"
						download="{currentFile}"
						class="download-qr-btn"
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
		{/each}
	</div>
</div>

<style>
	.qr-showcase-widget {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
	}

	.showcase-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.85rem 1.25rem;
		background: var(--bg-secondary);
		border-radius: 14px;
		border: 1px solid var(--border);
	}

	.mode-label {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--fg-secondary);
	}

	.toggle-pill-wrap {
		display: inline-flex;
		padding: 3px;
		background: var(--panel-bg);
		border-radius: 10px;
		border: 1px solid var(--border);
	}

	.pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.38rem 0.85rem;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
	}

	.pill-glyph {
		font-size: 0.8rem;
	}

	.pill-btn.is-active {
		background: var(--bg-secondary);
		color: var(--brand-leaf);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	/* GRID */
	.qr-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.25rem;
	}

	.qr-card {
		display: flex;
		flex-direction: column;
		border-radius: 16px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		padding: 1.25rem;
		transition: all 0.2s ease;
	}

	.qr-card:hover {
		transform: translateY(-2px);
		border-color: var(--border-hover);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
	}

	.qr-preview-stage {
		height: 200px;
		border-radius: 12px;
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		margin-bottom: 1rem;
		transition: background 0.2s ease;
	}

	.qr-preview-stage.is-nobg {
		background-color: var(--bg-secondary);
		background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.04) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.04) 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
	}

	.qr-svg-render {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08));
	}

	.qr-meta {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;
		margin-bottom: 1rem;
	}

	.qr-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.qr-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.qr-badge {
		font-size: 0.68rem;
		font-weight: 800;
		padding: 2px 6px;
		border-radius: 6px;
		background: rgba(89, 143, 58, 0.12);
		color: var(--brand-leaf);
	}

	.qr-desc {
		font-size: 0.78rem;
		line-height: 1.4;
		color: var(--fg-muted);
		margin: 0;
	}

	.qr-actions {
		display: flex;
		align-items: center;
	}

	.download-qr-btn {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.55rem 1rem;
		border-radius: 10px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.8rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.download-qr-btn:hover {
		background: var(--brand-leaf);
		color: #ffffff;
		border-color: var(--brand-leaf);
	}

	@media (max-width: 600px) {
		.showcase-toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toggle-pill-wrap {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		.pill-btn {
			justify-content: center;
			font-size: 0.74rem;
			padding: 0.45rem 0.3rem;
		}
	}
</style>

