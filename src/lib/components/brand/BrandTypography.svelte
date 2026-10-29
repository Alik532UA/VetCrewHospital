<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

	type FontId = 'inglobal' | 'montserrat' | 'permanent';

	interface FontInfo {
		id: FontId;
		name: string;
		fontFamily: string;
		categoryUk: string;
		categoryEn: string;
		descUk: string;
		descEn: string;
		weights: string;
		file: string;
		sampleHead: string;
	}

	const FONTS: FontInfo[] = [
		{
			id: 'inglobal',
			name: 'InGlobal Bold',
			fontFamily: 'InGlobal',
			categoryUk: 'Фірмовий дисплейний гротеск',
			categoryEn: 'Brand Display Grotesque',
			descUk: 'Ексклюзивний акцидентний шрифт назви «VET CREW HOSPITAL» із характерними геометричними скошеними кутами та сильною енергетикою.',
			descEn: 'Exclusive display typeface of the "VET CREW HOSPITAL" wordmark with sharp aerodynamic terminals.',
			weights: 'Bold 700',
			file: 'inglobalb.ttf',
			sampleHead: 'VET CREW HOSPITAL 24/7'
		},
		{
			id: 'montserrat',
			name: 'Montserrat Variable',
			fontFamily: 'Montserrat',
			categoryUk: 'Корпоративна робоча гарнітура',
			categoryEn: 'Primary Corporate Typeface',
			descUk: 'Універсальний геометричний гротеск для навігації, документації, інформаційних табличок, веб-інтерфейсів та поліграфії.',
			descEn: 'Clean geometric sans-serif for medical forms, navigational signs, web UI, and patient identity tags.',
			weights: 'Variable 100 — 900 + Italic',
			file: 'Montserrat-VariableFont_wght.ttf',
			sampleHead: 'Турбота про кожне дике та екзотичне життя'
		},
		{
			id: 'permanent',
			name: 'Permanent Marker',
			fontFamily: 'Permanent Marker',
			categoryUk: 'Акцентний рукописний шрифт',
			categoryEn: 'Friendly Accent Marker Script',
			descUk: 'Живий теплий почерк для персональних нотаток лікарів, історій порятунку пацієнтів, наліпок та соцмереж.',
			descEn: 'Warm hand-drawn marker font for rescue stories, doctor personal notes, stickers, and awareness campaigns.',
			weights: 'Regular 400',
			file: 'PermanentMarker-Regular.ttf',
			sampleHead: 'Exotic. Wild. Special. Important!'
		}
	];

	let activeTesterFont = $state<FontId>('inglobal');
	let fontSize = $state<number>(36);
	let customText = $state<string>('');

	let activeFontObj = $derived(FONTS.find((f) => f.id === activeTesterFont) ?? FONTS[0]);

	let defaultText = $derived(
		langStore.current === 'uk'
			? 'Vet Crew Hospital — Цілодобова допомога екзотичним та диким тваринам'
			: 'Vet Crew Hospital — 24/7 Care for Exotic, Wild and Companion Animals'
	);

	let displayTestText = $derived(customText.trim() ? customText : defaultText);
</script>

<div class="typography-widget">
	<!-- 3 FONT CARDS -->
	<div class="fonts-cards-grid">
		{#each FONTS as f (f.id)}
			<div class="font-specimen-card" class:is-highlighted={activeTesterFont === f.id}>
				<div class="specimen-header">
					<div class="specimen-titles">
						<span class="specimen-category">{langStore.current === 'uk' ? f.categoryUk : f.categoryEn}</span>
						<h3 class="specimen-name">{f.name}</h3>
					</div>
					<span class="specimen-weights">{f.weights}</span>
				</div>

				<div class="specimen-hero-sample" style:font-family="var(--ff-{f.id}, '{f.fontFamily}', sans-serif)">
					{f.sampleHead}
				</div>

				<div class="specimen-charset" style:font-family="var(--ff-{f.id}, '{f.fontFamily}', sans-serif)">
					<span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
					<span>АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ</span>
					<span>0123456789 & # % ? ! @</span>
				</div>

				<div class="specimen-actions">
					<button
						type="button"
						class="test-font-btn"
						class:is-active={activeTesterFont === f.id}
						onclick={() => (activeTesterFont = f.id)}
					>
						<span>{langStore.current === 'uk' ? 'Спробувати в тестері' : 'Test in Playground'}</span>
					</button>

					<a
						href="{base}/fonts/{f.file}"
						download="{f.file}"
						class="download-font-btn"
						title="{langStore.current === 'uk' ? 'Завантажити шрифт (.ttf)' : 'Download font (.ttf)'}"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						<span>TTF</span>
					</a>
				</div>
			</div>
		{/each}
	</div>

	<!-- INTERACTIVE TYPE TESTER -->
	<div class="type-tester-box">
		<div class="tester-toolbar">
			<div class="tester-font-tabs">
				{#each FONTS as f (f.id)}
					<button
						type="button"
						class="tester-tab"
						class:is-active={activeTesterFont === f.id}
						onclick={() => (activeTesterFont = f.id)}
					>
						<span class="tab-font-indicator" style:font-family="var(--ff-{f.id}, '{f.fontFamily}')">Aa</span>
						<span>{f.name}</span>
					</button>
				{/each}
			</div>

			<div class="tester-controls">
				<label class="size-slider-wrap">
					<span class="slider-label">{fontSize}px</span>
					<input
						type="range"
						min="16"
						max="72"
						step="2"
						bind:value={fontSize}
						class="size-range-input"
						aria-label="Font size"
					/>
				</label>
			</div>
		</div>

		<div class="tester-input-wrap">
			<input
				type="text"
				bind:value={customText}
				placeholder={defaultText}
				class="tester-text-input"
				aria-label="Type tester custom text"
			/>
		</div>

		<div
			class="tester-preview-stage"
			style:font-family="var(--ff-{activeFontObj.id}, '{activeFontObj.fontFamily}', sans-serif)"
			style:font-size="{fontSize}px"
		>
			{displayTestText}
		</div>
	</div>
</div>

<style>
	.typography-widget {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}

	/* FONT CARDS */
	.fonts-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.font-specimen-card {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 18px;
		transition: all 0.25s ease;
	}

	.font-specimen-card:hover,
	.font-specimen-card.is-highlighted {
		border-color: var(--brand-leaf);
		box-shadow: 0 10px 28px rgba(89, 143, 58, 0.1);
	}

	.specimen-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.specimen-titles {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.specimen-category {
		font-size: 0.74rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-leaf);
	}

	.specimen-name {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
	}

	.specimen-weights {
		font-size: 0.74rem;
		font-family: monospace;
		font-weight: 700;
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		white-space: nowrap;
	}

	.specimen-hero-sample {
		font-size: 1.6rem;
		line-height: 1.25;
		color: var(--fg-primary);
		min-height: 4rem;
		display: flex;
		align-items: center;
	}

	.specimen-charset {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
		color: var(--fg-muted);
		word-break: break-all;
		padding: 0.75rem 0.85rem;
		background: var(--panel-bg);
		border-radius: 10px;
		border: 1px solid var(--border);
	}

	.specimen-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: auto;
		padding-top: 0.5rem;
	}

	.test-font-btn {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--brand-leaf);
		background: transparent;
		cursor: pointer;
		padding: 0.4rem 0.75rem;
		border-radius: 8px;
		transition: all 0.15s ease;
		border: 1px solid transparent;
	}

	.test-font-btn:hover,
	.test-font-btn.is-active {
		background: rgba(89, 143, 58, 0.12);
		border-color: rgba(89, 143, 58, 0.3);
	}

	.download-font-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.85rem;
		border-radius: 8px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.78rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.18s ease;
	}

	.download-font-btn:hover {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
		transform: scale(1.04);
	}

	:global(.dark) .download-font-btn:hover {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	/* INTERACTIVE TYPE TESTER */
	.type-tester-box {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 18px;
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}

	.tester-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.tester-font-tabs {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 3px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		flex-wrap: wrap;
	}

	.tester-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.85rem;
		border-radius: 9px;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tester-tab.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.tab-font-indicator {
		font-size: 1rem;
		line-height: 1;
		color: var(--brand-leaf);
	}

	.tester-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.size-slider-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.slider-label {
		font-size: 0.82rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--fg-secondary);
		min-width: 42px;
		text-align: right;
	}

	.size-range-input {
		accent-color: var(--brand-leaf);
		cursor: pointer;
		width: 120px;
	}

	.tester-input-wrap {
		width: 100%;
	}

	.tester-text-input {
		width: 100%;
		padding: 0.65rem 1rem;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-primary);
		font-size: 0.95rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.tester-text-input:focus {
		border-color: var(--brand-leaf);
	}

	.tester-preview-stage {
		min-height: 110px;
		display: flex;
		align-items: center;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
		border: 1px solid var(--border);
		color: var(--fg-primary);
		line-height: 1.35;
		word-break: break-word;
		transition: font-size 0.1s ease;
	}
</style>
