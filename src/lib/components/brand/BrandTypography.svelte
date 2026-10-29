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
			weights: 'Variable 100–900',
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

	const SIZES: number[] = [20, 28, 36, 48, 64];

	const PRESETS = [
		{
			labelUk: 'Заголовок',
			labelEn: 'Headline',
			textUk: 'VET CREW HOSPITAL — Цілодобова турбота',
			textEn: 'VET CREW HOSPITAL — 24/7 Animal Care'
		},
		{
			labelUk: 'Панграма (А–Я)',
			labelEn: 'Pangram',
			textUk: 'Жебракують філософи при ґанку церковнім, ввічливо благаючи дещицю коштів.',
			textEn: 'The quick brown fox jumps over the lazy dog.'
		},
		{
			labelUk: 'Слоган',
			labelEn: 'Slogan',
			textUk: 'Екзотичні. Дикі. Особливі. Важливі.',
			textEn: 'Exotic. Wild. Special. Important.'
		},
		{
			labelUk: 'Цифри та знаки',
			labelEn: 'Numbers & Info',
			textUk: '0123456789 — +380 (44) 123-45-67 · vetcrew.org @ 24/7',
			textEn: '0123456789 — +1 (800) 555-0199 · vetcrew.org @ 24/7'
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
			<div
				class="font-specimen-card"
				class:is-highlighted={activeTesterFont === f.id}
				role="button"
				tabindex="0"
				onclick={() => (activeTesterFont = f.id)}
				onkeydown={(e) => e.key === 'Enter' && (activeTesterFont = f.id)}
			>
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
						onclick={(e) => {
							e.stopPropagation();
							activeTesterFont = f.id;
						}}
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
							<circle cx="12" cy="12" r="3"/>
						</svg>
						<span>{langStore.current === 'uk' ? 'Спробувати в тестері' : 'Test in Playground'}</span>
					</button>

					<a
						href="{base}/fonts/{f.file}"
						download="{f.file}"
						class="download-font-btn"
						title="{langStore.current === 'uk' ? 'Завантажити шрифт (.ttf)' : 'Download font (.ttf)'}"
						onclick={(e) => e.stopPropagation()}
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
						<span class="tab-font-indicator" style:font-family="var(--ff-{f.id}, '{f.fontFamily}', sans-serif)">Aa</span>
						<span>{f.name}</span>
					</button>
				{/each}
			</div>

			<div class="tester-controls">
				<div class="size-presets">
					{#each SIZES as s}
						<button
							type="button"
							class="size-preset-btn"
							class:is-active={fontSize === s}
							onclick={() => (fontSize = s)}
						>
							{s}
						</button>
					{/each}
				</div>

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

		<!-- PRESET SAMPLES -->
		<div class="tester-presets-bar">
			<span class="presets-label">{langStore.current === 'uk' ? 'Швидкі зразки:' : 'Quick samples:'}</span>
			<div class="preset-chips">
				{#each PRESETS as p}
					<button
						type="button"
						class="preset-chip"
						onclick={() => (customText = langStore.current === 'uk' ? p.textUk : p.textEn)}
					>
						{langStore.current === 'uk' ? p.labelUk : p.labelEn}
					</button>
				{/each}
				{#if customText.trim()}
					<button
						type="button"
						class="clear-text-btn"
						onclick={() => (customText = '')}
						title={langStore.current === 'uk' ? 'Скинути текст' : 'Reset text'}
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
						<span>{langStore.current === 'uk' ? 'Скинути' : 'Reset'}</span>
					</button>
				{/if}
			</div>
		</div>

		<div class="tester-input-wrap">
			<input
				type="text"
				bind:value={customText}
				placeholder={langStore.current === 'uk' ? 'Введіть власний текст для тестування...' : 'Type custom text here to preview...'}
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
		border: 1.5px solid var(--border);
		border-radius: 18px;
		cursor: pointer;
		transition: all 0.22s ease;
		position: relative;
		outline: none;
	}

	.font-specimen-card:hover {
		border-color: var(--brand-leaf, #598f3a);
		transform: translateY(-2px);
		box-shadow: 0 10px 28px rgba(89, 143, 58, 0.12);
	}

	.font-specimen-card.is-highlighted {
		border-color: var(--brand-leaf, #598f3a);
		box-shadow: 0 0 0 1px var(--brand-leaf, #598f3a), 0 10px 28px rgba(89, 143, 58, 0.14);
	}

	:global([data-theme='dark']) .font-specimen-card:hover {
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 10px 28px rgba(255, 179, 39, 0.12);
	}

	:global([data-theme='dark']) .font-specimen-card.is-highlighted {
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 0 0 1px var(--brand-gold, #ffb327), 0 10px 28px rgba(255, 179, 39, 0.15);
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
		gap: 0.25rem;
		min-height: 2.8rem;
	}

	.specimen-category {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-leaf, #598f3a);
		line-height: 1.25;
	}

	:global([data-theme='dark']) .specimen-category {
		color: var(--brand-gold, #ffb327);
	}

	.specimen-name {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
		line-height: 1.2;
	}

	.specimen-weights {
		font-size: 0.72rem;
		font-family: var(--font-sans, inherit);
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		padding: 0.22rem 0.65rem;
		border-radius: 999px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		white-space: nowrap;
		flex-shrink: 0;
		letter-spacing: 0.02em;
		transition: all 0.2s ease;
	}

	.font-specimen-card.is-highlighted .specimen-weights {
		border-color: var(--brand-leaf, #598f3a);
		color: var(--brand-leaf, #598f3a);
	}

	:global([data-theme='dark']) .font-specimen-card.is-highlighted .specimen-weights {
		border-color: var(--brand-gold, #ffb327);
		color: var(--brand-gold, #ffb327);
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
		gap: 0.35rem;
		font-size: 0.76rem;
		letter-spacing: 0.02em;
		line-height: 1.4;
		color: var(--fg-secondary);
		padding: 0.75rem 0.85rem;
		background: var(--panel-bg);
		border-radius: 10px;
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.specimen-charset span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	:global([data-theme='dark']) .specimen-charset {
		color: rgba(255, 255, 255, 0.75);
		background: rgba(0, 0, 0, 0.2);
		border-color: rgba(255, 255, 255, 0.08);
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
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: var(--panel-bg);
		border: 1px solid var(--border);
		cursor: pointer;
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		transition: all 0.18s ease;
	}

	.test-font-btn:hover {
		color: var(--brand-leaf, #598f3a);
		border-color: var(--brand-leaf, #598f3a);
		background: rgba(89, 143, 58, 0.08);
		transform: translateY(-1px);
	}

	.test-font-btn.is-active {
		background: var(--brand-leaf, #598f3a);
		color: #ffffff;
		border-color: var(--brand-leaf, #598f3a);
		box-shadow: 0 2px 6px rgba(89, 143, 58, 0.25);
	}

	:global([data-theme='dark']) .test-font-btn:hover {
		color: var(--brand-gold, #ffb327);
		border-color: var(--brand-gold, #ffb327);
		background: rgba(255, 179, 39, 0.08);
	}

	:global([data-theme='dark']) .test-font-btn.is-active {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 2px 6px rgba(255, 179, 39, 0.25);
	}

	.download-font-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.85rem;
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
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .download-font-btn:hover,
	:global(.dark) .download-font-btn:hover {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
	}

	/* INTERACTIVE TYPE TESTER */
	.type-tester-box {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		padding: 1.5rem;
		background: var(--panel-bg);
		border: 1.5px solid var(--border);
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
		gap: 0.35rem;
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
		padding: 0.45rem 0.85rem;
		border-radius: 9px;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tester-tab:hover {
		color: var(--fg-primary);
	}

	.tester-tab.is-active {
		background: var(--panel-bg);
		color: var(--brand-leaf, #598f3a);
		border-color: var(--border);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='dark']) .tester-tab.is-active {
		background: var(--bg-primary);
		color: var(--brand-gold, #ffb327);
		border-color: rgba(255, 179, 39, 0.35);
	}

	.tab-font-indicator {
		font-size: 1rem;
		line-height: 1;
		color: var(--brand-leaf, #598f3a);
	}

	:global([data-theme='dark']) .tab-font-indicator {
		color: var(--brand-gold, #ffb327);
	}

	.tester-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.size-presets {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		padding: 2px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.size-preset-btn {
		font-size: 0.72rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: var(--fg-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.size-preset-btn:hover {
		color: var(--fg-primary);
	}

	.size-preset-btn.is-active {
		background: var(--panel-bg);
		color: var(--brand-leaf, #598f3a);
		font-weight: 800;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='dark']) .size-preset-btn.is-active {
		color: var(--brand-gold, #ffb327);
	}

	.size-slider-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.slider-label {
		font-size: 0.82rem;
		font-family: var(--font-sans, inherit);
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		color: var(--fg-secondary);
		min-width: 42px;
		text-align: right;
	}

	.size-range-input {
		accent-color: var(--brand-leaf, #598f3a);
		cursor: pointer;
		width: 110px;
	}

	:global([data-theme='dark']) .size-range-input {
		accent-color: var(--brand-gold, #ffb327);
	}

	/* PRESET CHIPS BAR */
	.tester-presets-bar {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	.presets-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--fg-muted);
		white-space: nowrap;
	}

	.preset-chips {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.preset-chip {
		font-size: 0.74rem;
		font-weight: 600;
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.preset-chip:hover {
		border-color: var(--brand-leaf, #598f3a);
		color: var(--fg-primary);
		background: var(--panel-bg);
	}

	:global([data-theme='dark']) .preset-chip:hover {
		border-color: var(--brand-gold, #ffb327);
	}

	.clear-text-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.72rem;
		font-weight: 700;
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		border: 1px dashed var(--border);
		background: transparent;
		color: var(--fg-muted);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.clear-text-btn:hover {
		color: #ef4444;
		border-color: #ef4444;
	}

	/* TEXT INPUT */
	.tester-input-wrap {
		width: 100%;
	}

	.tester-text-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		border: 1.5px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg-primary);
		font-size: 0.95rem;
		font-weight: 500;
		outline: none;
		transition: all 0.2s ease;
	}

	.tester-text-input:focus {
		border-color: var(--brand-leaf, #598f3a);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.2);
		background: var(--panel-bg);
	}

	:global([data-theme='dark']) .tester-text-input:focus {
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 0 0 3px rgba(255, 179, 39, 0.2);
	}

	/* PREVIEW STAGE */
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
