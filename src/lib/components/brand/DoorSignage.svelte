<script lang="ts">
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';

	interface RoomPlaque {
		id: string;
		num: string;
		titleUk: string;
		titleEn: string;
		textSvg: string;
		compSvg: string;
	}

	const ROOM_PLAQUES: RoomPlaque[] = [
		{ id: 'reception', num: '01', titleUk: 'Рецепція', titleEn: 'Reception', textSvg: 'reception.svg', compSvg: 'reception.svg' },
		{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин', titleEn: 'Pet Shop', textSvg: 'pet-shop.svg', compSvg: 'pet-shop.svg' },
		{ id: 'hospital', num: '03', titleUk: 'Стаціонар', titleEn: 'Inpatient Hospital', textSvg: 'hospital.svg', compSvg: 'hospital.svg' },
		{ id: 'surgery', num: '04', titleUk: 'Операційна', titleEn: 'Surgery Room', textSvg: 'surgery.svg', compSvg: 'surgery.svg' },
		{ id: 'procedures', num: '05', titleUk: 'Процедурна', titleEn: 'Procedure Room', textSvg: 'procedures.svg', compSvg: 'procedures.svg' },
		{ id: 'consultation', num: '06', titleUk: 'Приймальний кабінет', titleEn: 'Examination Room', textSvg: 'consultation.svg', compSvg: 'consultation.svg' },
		{ id: 'laboratory', num: '07', titleUk: 'Лабораторія', titleEn: 'Laboratory', textSvg: 'laboratory.svg', compSvg: 'laboratory.svg' }
	];

	interface DeptIcon {
		id: string;
		num: string;
		titleUk: string;
		titleEn: string;
		descUk: string;
		descEn: string;
	}

	const DEPT_ICONS: DeptIcon[] = [
		{ id: 'reception', num: '01', titleUk: 'Рецепція та зона очікування', titleEn: 'Reception & Waiting', descUk: 'Стійка первинної реєстрації пацієнтів та оформлення картки.', descEn: 'Primary patient registration desk.' },
		{ id: 'pet-shop', num: '02', titleUk: 'Зоомагазин та амуніція', titleEn: 'Pet Shop & Gear', descUk: 'Спеціалізовані корми, вітаміни та аксесуари для екзотів.', descEn: 'Specialized feeds and accessories.' },
		{ id: 'pharmacy', num: '03', titleUk: 'Ветеринарна аптека', titleEn: 'Veterinary Pharmacy', descUk: 'Ліцензовані медикаменти, вакцини та лікувальні препарати.', descEn: 'Certified pharmaceuticals and vaccines.' },
		{ id: 'herpetology', num: '04', titleUk: 'Герпетологія (Рептилії)', titleEn: 'Herpetology Department', descUk: 'Спеціалізоване терапевтичне відділення лікування змій, ящірок та черепах.', descEn: 'Reptile and amphibian medicine.' },
		{ id: 'ornithology', num: '05', titleUk: 'Орнітологія (Птахи)', titleEn: 'Ornithology Department', descUk: 'Діагностика та лікування папуг, хижих птахів і водоплавних.', descEn: 'Avian clinical care and surgery.' },
		{ id: 'surgery', num: '06', titleUk: 'Хірургічний блок', titleEn: 'Surgical Suite', descUk: 'Стерильні операційні зали, газовий наркоз, мікрохірургія.', descEn: 'Sterile surgery and micro-procedures.' },
		{ id: 'hospital', num: '07', titleUk: 'Цілодобовий стаціонар', titleEn: '24/7 Inpatient Care', descUk: 'Кисневі бокси, інфузомати та цілодобовий моніторинг пацієнтів.', descEn: '24/7 oxygen therapy and hospitalization.' },
		{ id: 'laboratory', num: '08', titleUk: 'Клінічна лабораторія', titleEn: 'Clinical Laboratory', descUk: 'Експрес-аналізи крові, мікроскопія, біохімія за 20 хвилин.', descEn: 'On-site express biochemical diagnostics.' }
	];

	const SIGN_COLORS = [
		{ hex: '13371B', name: 'Dark Green', textColor: '#ffffff' },
		{ hex: '598F3A', name: 'Main Green', textColor: '#ffffff' },
		{ hex: '93C84A', name: 'Light Green', textColor: '#101e14' },
		{ hex: 'FFB327', name: 'Yellow', textColor: '#101e14' },
		{ hex: 'E5E5E5', name: 'Light Gray', textColor: '#101e14' },
		{ hex: '262626', name: 'Dark Gray', textColor: '#ffffff' },
		{ hex: '000000', name: 'Black', textColor: '#ffffff' }
	];

	let signageTab = $state<'plaques' | 'icons'>('plaques');
	let plaqueStyle = $state<'composite' | 'text'>('composite');
	let activeDept = $state<string>('reception');
	let activeColor = $state<string>('13371B');
	let stageBg = $state<'light' | 'dark' | 'checker'>('light');

	let selectedDeptObj = $derived(DEPT_ICONS.find((d) => d.id === activeDept) ?? DEPT_ICONS[0]);
</script>

<div class="door-signage-widget">
	<!-- MAIN MODE TOGGLE (Кабінетні таблички / Піктограми) -->
	<div class="signage-mode-header">
		<div class="mode-tabs">
			<button
				type="button"
				class="mode-tab-btn"
				class:is-active={signageTab === 'plaques'}
				onclick={() => (signageTab = 'plaques')}
			>
				<span class="mode-icon">🚪</span>
				<span>{langStore.current === 'uk' ? 'Дверні таблички кабінетів (7)' : 'Door Plaques (7)'}</span>
			</button>
			<button
				type="button"
				class="mode-tab-btn"
				class:is-active={signageTab === 'icons'}
				onclick={() => (signageTab = 'icons')}
			>
				<span class="mode-icon">🏥</span>
				<span>{langStore.current === 'uk' ? 'Піктограми відділень (8 × 7 кольорів)' : 'Department Icons (8 × 7 Colors)'}</span>
			</button>
		</div>

		{#if signageTab === 'plaques'}
			<!-- Sub-toggle: Composite vs Text Only -->
			<div class="plaque-subtoggle">
				<span class="subtoggle-label">{langStore.current === 'uk' ? 'Формат таблички:' : 'Plaque Layout:'}</span>
				<div class="pill-group">
					<button
						type="button"
						class="sub-pill"
						class:is-active={plaqueStyle === 'composite'}
						onclick={() => (plaqueStyle = 'composite')}
					>
						<span>{langStore.current === 'uk' ? 'Напис + Іконка' : 'Text + Icon'}</span>
					</button>
					<button
						type="button"
						class="sub-pill"
						class:is-active={plaqueStyle === 'text'}
						onclick={() => (plaqueStyle = 'text')}
					>
						<span>{langStore.current === 'uk' ? 'Тільки напис' : 'Text Only'}</span>
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- TAB 1: DOOR PLAQUES -->
	{#if signageTab === 'plaques'}
		<div class="plaques-grid">
			{#each ROOM_PLAQUES as p (p.id)}
				<div class="plaque-card">
					<div class="plaque-card-header">
						<span class="room-num">#{p.num}</span>
						<span class="room-title">{langStore.current === 'uk' ? p.titleUk : p.titleEn}</span>
					</div>

					<div class="plaque-preview-stage">
						<img
							src="{base}/brand/signage/{plaqueStyle}/{p.id}.svg"
							alt="{p.titleUk}"
							class="plaque-img"
							loading="lazy"
						/>
					</div>

					<div class="plaque-card-footer">
						<span class="file-dim">Vector SVG • Print HQ</span>
						<a
							href="{base}/brand/signage/{plaqueStyle}/{p.id}.svg"
							download="{p.titleUk} {plaqueStyle === 'composite' ? '+ icon' : ''}.svg"
							class="download-sign-btn"
							title="{langStore.current === 'uk' ? 'Завантажити векторний SVG для плотерної порізки чи друку' : 'Download SVG'}"
						>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>SVG</span>
						</a>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- TAB 2: DEPARTMENT ICONS IN 7 PALETTES -->
		<div class="dept-icons-studio">
			<!-- Controls: Department Chips & Color Palette -->
			<div class="dept-controls-bar">
				<!-- Department Chips -->
				<div class="dept-selector-wrap">
					<span class="bar-label">{langStore.current === 'uk' ? 'Оберіть відділення:' : 'Select Department:'}</span>
					<div class="dept-chips-list">
						{#each DEPT_ICONS as d (d.id)}
							<button
								type="button"
								class="dept-chip"
								class:is-active={activeDept === d.id}
								onclick={() => (activeDept = d.id)}
							>
								<span class="dept-num">#{d.num}</span>
								<span>{langStore.current === 'uk' ? d.titleUk : d.titleEn}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Color Palette Selector -->
				<div class="color-selector-wrap">
					<div class="color-label-row">
						<span class="bar-label">{langStore.current === 'uk' ? 'Колір піктограми:' : 'Icon Color:'}</span>
						<code class="hex-badge">#{activeColor}</code>
					</div>

					<div class="color-dots-row">
						{#each SIGN_COLORS as c (c.hex)}
							<button
								type="button"
								class="sign-color-dot"
								class:is-active={activeColor === c.hex}
								style:background-color="#{c.hex}"
								onclick={() => (activeColor = c.hex)}
								title="{c.name} (#{c.hex})"
								aria-label="{c.name}"
							>
								{#if activeColor === c.hex}
									<span class="dot-check" style:color={c.textColor}>✓</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Live Department Icon Stage Showcase -->
			<div class="dept-showcase-box">
				<div class="showcase-stage bg-{stageBg}">
					<!-- Background style switchers in corner -->
					<div class="stage-bg-toggles">
						<button
							type="button"
							class="bg-btn"
							class:is-active={stageBg === 'light'}
							onclick={() => (stageBg = 'light')}
							title="Світле тло"
						>
							☀️
						</button>
						<button
							type="button"
							class="bg-btn"
							class:is-active={stageBg === 'dark'}
							onclick={() => (stageBg = 'dark')}
							title="Темне тло"
						>
							🌙
						</button>
						<button
							type="button"
							class="bg-btn"
							class:is-active={stageBg === 'checker'}
							onclick={() => (stageBg = 'checker')}
							title="Шахове тло (прозорість)"
						>
							🏁
						</button>
					</div>

					<img
						src="{base}/brand/signage/icons/{activeColor}/{activeDept}.svg"
						alt="{selectedDeptObj.titleUk}"
						class="showcase-icon-img"
					/>
				</div>

				<div class="showcase-info">
					<div class="showcase-meta">
						<div class="showcase-titles">
							<span class="dept-badge">#{selectedDeptObj.num} • {langStore.current === 'uk' ? 'Офіційна піктограма' : 'Official Pictogram'}</span>
							<h3 class="showcase-heading">
								{langStore.current === 'uk' ? selectedDeptObj.titleUk : selectedDeptObj.titleEn}
							</h3>
						</div>
						<p class="showcase-desc">
							{langStore.current === 'uk' ? selectedDeptObj.descUk : selectedDeptObj.descEn}
						</p>
					</div>

					<div class="showcase-download-zone">
						<div class="color-spec-pill">
							<span class="swatch-indicator" style:background-color="#{activeColor}"></span>
							<span class="spec-name">Колір: #{activeColor}</span>
						</div>

						<a
							href="{base}/brand/signage/icons/{activeColor}/{activeDept}.svg"
							download="{selectedDeptObj.num} - {selectedDeptObj.titleUk} (#{activeColor}).svg"
							class="download-dept-btn"
						>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							<span>{langStore.current === 'uk' ? 'Завантажити SVG піктограми' : 'Download Pictogram SVG'}</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.door-signage-widget {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		width: 100%;
	}

	.signage-mode-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding-bottom: 0.5rem;
	}

	.mode-tabs {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 4px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 14px;
	}

	.mode-tab-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 10px;
		font-size: 0.86rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.mode-tab-btn.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
	}

	.mode-icon {
		font-size: 1rem;
	}

	.plaque-subtoggle {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.subtoggle-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--fg-muted);
	}

	.pill-group {
		display: inline-flex;
		padding: 3px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 10px;
	}

	.sub-pill {
		padding: 0.35rem 0.75rem;
		border-radius: 7px;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sub-pill.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	/* PLAQUES GRID */
	.plaques-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.plaque-card {
		display: flex;
		flex-direction: column;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 18px;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.plaque-card:hover {
		transform: translateY(-2px);
		border-color: var(--border-hover);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
	}

	.plaque-card-header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.85rem 1.15rem;
		border-bottom: 1px solid var(--border);
	}

	.room-num {
		font-size: 0.72rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.1);
		padding: 2px 6px;
		border-radius: 6px;
	}

	.room-title {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.plaque-preview-stage {
		min-height: 140px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: var(--panel-bg);
	}

	.plaque-img {
		max-width: 100%;
		max-height: 100px;
		object-fit: contain;
		filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.06));
	}

	.plaque-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.15rem;
		border-top: 1px solid var(--border);
	}

	.file-dim {
		font-size: 0.72rem;
		color: var(--fg-muted);
	}

	.download-sign-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.32rem 0.75rem;
		border-radius: 8px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-primary);
		font-size: 0.76rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.download-sign-btn:hover {
		background: var(--brand-leaf);
		color: #ffffff;
		border-color: var(--brand-leaf);
		transform: scale(1.04);
	}

	/* DEPT ICONS STUDIO */
	.dept-icons-studio {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.dept-controls-bar {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.25rem 1.5rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 18px;
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}

	.bar-label {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--fg-secondary);
	}

	.dept-selector-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.dept-chips-list {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.dept-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.38rem 0.75rem;
		border-radius: 20px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.dept-chip:hover {
		border-color: var(--border-hover);
		color: var(--fg-primary);
	}

	.dept-chip.is-active {
		border-color: var(--brand-leaf);
		background: rgba(89, 143, 58, 0.14);
		color: var(--brand-leaf);
	}

	.dept-num {
		font-size: 0.7rem;
		font-family: monospace;
		opacity: 0.75;
	}

	.color-selector-wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding-top: 0.85rem;
		border-top: 1px solid var(--border);
	}

	.color-label-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.hex-badge {
		font-size: 0.78rem;
		font-family: monospace;
		font-weight: 700;
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--brand-leaf);
	}

	.color-dots-row {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.sign-color-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
	}

	.sign-color-dot:hover {
		transform: scale(1.15);
	}

	.sign-color-dot.is-active {
		border-color: var(--fg-primary);
		transform: scale(1.18);
		box-shadow: 0 0 0 3px rgba(89, 143, 58, 0.35);
	}

	.dot-check {
		font-size: 0.82rem;
		font-weight: 900;
		line-height: 1;
	}

	/* SHOWCASE BOX */
	.dept-showcase-box {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		align-items: center;
		padding: 2rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 20px;
	}

	.showcase-stage {
		position: relative;
		width: 100%;
		height: 240px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		border: 1px solid var(--border);
		transition: background 0.2s ease;
	}

	.showcase-stage.bg-light {
		background: #ffffff;
	}

	.showcase-stage.bg-dark {
		background: #101e14;
	}

	.showcase-stage.bg-checker {
		background-color: #ffffff;
		background-image: linear-gradient(45deg, #e6ede6 25%, transparent 25%),
			linear-gradient(-45deg, #e6ede6 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e6ede6 75%),
			linear-gradient(-45deg, transparent 75%, #e6ede6 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
	}

	.stage-bg-toggles {
		position: absolute;
		top: 0.65rem;
		right: 0.65rem;
		display: inline-flex;
		gap: 3px;
		padding: 2px;
		background: rgba(0, 0, 0, 0.35);
		border-radius: 8px;
		backdrop-filter: blur(8px);
	}

	.bg-btn {
		font-size: 0.72rem;
		padding: 3px 6px;
		border-radius: 5px;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.15s ease;
	}

	.bg-btn:hover,
	.bg-btn.is-active {
		opacity: 1;
		background: rgba(255, 255, 255, 0.25);
	}

	.showcase-icon-img {
		max-width: 100%;
		max-height: 140px;
		object-fit: contain;
		filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
	}

	.showcase-info {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.showcase-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.dept-badge {
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--brand-leaf);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.showcase-heading {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--fg-primary);
		margin: 0;
	}

	.showcase-desc {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--fg-secondary);
		margin: 0;
		max-width: 580px;
	}

	.showcase-download-zone {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.color-spec-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.85rem;
		border-radius: 10px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
	}

	.swatch-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.spec-name {
		font-size: 0.78rem;
		font-family: monospace;
		font-weight: 700;
		color: var(--fg-primary);
	}

	.download-dept-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1.15rem;
		border-radius: 10px;
		background: var(--brand-leaf);
		color: #ffffff;
		font-size: 0.84rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.18s ease;
		box-shadow: 0 4px 14px rgba(89, 143, 58, 0.25);
	}

	.download-dept-btn:hover {
		transform: scale(1.04);
		box-shadow: 0 6px 20px rgba(89, 143, 58, 0.35);
	}

	@media (max-width: 768px) {
		.dept-showcase-box {
			grid-template-columns: 1fr;
		}

		.showcase-stage {
			height: 200px;
		}
	}
</style>
