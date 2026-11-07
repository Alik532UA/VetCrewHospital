<script lang="ts">
	import { langStore } from '$lib/lang.svelte';

	export type StageTheme =
		| 'checker'
		| 'light'
		| 'emerald'
		| 'dark'
		| 'white'
		| 'grey'
		| 'grass'
		| 'forest'
		| 'yellow'
		| 'gold'
		| 'black';

	interface Props {
		current?: string;
		label?: boolean;
		compact?: boolean;
		mode?: 'standard' | 'oracal';
	}

	let {
		current = $bindable('checker'),
		label = true,
		compact = false,
		mode = 'standard'
	}: Props = $props();

	interface StageThemeItem {
		id: string;
		labelUk: string;
		labelEn: string;
		titleUk: string;
		titleEn: string;
		hex?: string;
		border?: string;
		isGrid?: boolean;
	}

	const STANDARD_THEMES: StageThemeItem[] = [
		{
			id: 'checker',
			labelUk: 'Сітка',
			labelEn: 'Grid',
			titleUk: 'Сітка (прозоре тло)',
			titleEn: 'Transparent grid'
		},
		{
			id: 'light',
			labelUk: 'Світле',
			labelEn: 'Light',
			titleUk: 'Світле тло',
			titleEn: 'Light background'
		},
		{
			id: 'emerald',
			labelUk: 'Смарагд',
			labelEn: 'Emerald',
			titleUk: 'Фірмовий смарагд #13371B',
			titleEn: 'Brand Emerald #13371B'
		},
		{
			id: 'dark',
			labelUk: 'Темне',
			labelEn: 'Dark',
			titleUk: 'Темне тло',
			titleEn: 'Dark background'
		}
	];

	const ORACAL_THEMES: StageThemeItem[] = [
		{
			id: 'checker',
			labelUk: 'Сітка',
			labelEn: 'Grid',
			titleUk: 'Прозоре тло (шахівниця)',
			titleEn: 'Transparent grid',
			isGrid: true
		},
		{
			id: 'white',
			hex: '#FFFFFF',
			border: '#D1D5DB',
			labelUk: 'Білий',
			labelEn: 'White',
			titleUk: 'Світла біла стіна (#FFFFFF)',
			titleEn: 'White wall'
		},
		{
			id: 'grey',
			hex: '#E5E7EB',
			border: '#9CA3AF',
			labelUk: 'Сірий',
			labelEn: 'Grey',
			titleUk: 'Світло-сіра плитка (#E5E7EB)',
			titleEn: 'Light grey tile wall'
		},
		{
			id: 'dark',
			hex: '#181C19',
			border: '#374151',
			labelUk: 'Темний',
			labelEn: 'Dark',
			titleUk: 'Темна стіна (#181C19)',
			titleEn: 'Dark wall'
		},
		{
			id: 'grass',
			hex: '#00783F',
			border: '#005236',
			labelUk: '068M',
			labelEn: '068M',
			titleUk: 'ORACAL 068M Grass green (#00783F)',
			titleEn: 'ORACAL 068M Grass green'
		},
		{
			id: 'emerald',
			hex: '#003C24',
			border: '#002616',
			labelUk: '060M',
			labelEn: '060M',
			titleUk: 'ORACAL 060M Dark green (#003C24)',
			titleEn: 'ORACAL 060M Dark green'
		},
		{
			id: 'forest',
			hex: '#005236',
			border: '#003322',
			labelUk: '613M',
			labelEn: '613M',
			titleUk: 'ORACAL 613M Forest green (#005236)',
			titleEn: 'ORACAL 613M Forest green'
		},
		{
			id: 'yellow',
			hex: '#E8A700',
			border: '#B38100',
			labelUk: '019M',
			labelEn: '019M',
			titleUk: 'ORACAL 019M Signal yellow (#E8A700)',
			titleEn: 'ORACAL 019M Signal yellow'
		},
		{
			id: 'gold',
			hex: '#796532',
			border: '#5C4D26',
			labelUk: '091M',
			labelEn: '091M',
			titleUk: 'ORACAL 091M Gold metallic (#796532)',
			titleEn: 'ORACAL 091M Gold'
		},
		{
			id: 'black',
			hex: '#060607',
			border: '#2A2A2A',
			labelUk: '070M',
			labelEn: '070M',
			titleUk: 'ORACAL 070M Black (#060607)',
			titleEn: 'ORACAL 070M Black'
		}
	];

	let activeThemes = $derived(mode === 'oracal' ? ORACAL_THEMES : STANDARD_THEMES);
</script>

<div
	class="bg-switch-group"
	class:is-compact={compact}
	class:is-oracal-mode={mode === 'oracal'}
	role="group"
	aria-label={langStore.current === 'uk' ? 'Тло прев’ю' : 'Preview background'}
>
	{#if label}
		<span class="bg-switch-label">{langStore.current === 'uk' ? 'Тло прев’ю:' : 'Preview Bg:'}</span
		>
	{/if}

	<div class="bg-switch-track">
		{#each activeThemes as t (t.id)}
			<button
				type="button"
				class="theme-btn theme-{t.id}"
				class:is-active={current === t.id}
				onclick={() => (current = t.id)}
				title={langStore.current === 'uk' ? t.titleUk : t.titleEn}
				aria-label={langStore.current === 'uk' ? t.titleUk : t.titleEn}
				aria-pressed={current === t.id}
			>
				{#if ('isGrid' in t && t.isGrid) || t.id === 'checker'}
					<!-- Checker / Grid Icon -->
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
					</svg>
				{:else if mode === 'oracal' && t.hex}
					<!-- Oracal / Wall swatch circle -->
					<span
						class="swatch-circle"
						style:background-color={t.hex}
						style:border-color={t.border ?? 'rgba(0,0,0,0.2)'}
						aria-hidden="true"
					></span>
				{:else if t.id === 'light'}
					<!-- Sun / Light Icon -->
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
						/>
					</svg>
				{:else if t.id === 'emerald'}
					<!-- Emerald brand swatch circle -->
					<span class="swatch-emerald" aria-hidden="true"></span>
				{:else if t.id === 'dark'}
					<!-- Moon / Dark Icon -->
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.bg-switch-group {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: nowrap;
		white-space: nowrap;
	}

	.bg-switch-label {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-secondary);
		white-space: nowrap;
		letter-spacing: 0.02em;
	}

	.bg-switch-track {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		padding: 3px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 9px;
		flex-wrap: nowrap;
	}

	.theme-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 6px;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.15s ease;
		padding: 0;
		flex-shrink: 0;
	}

	.is-compact .theme-btn {
		width: 26px;
		height: 26px;
	}

	.theme-btn:hover {
		color: var(--fg-primary);
		background: var(--panel-bg);
		border-color: var(--border-hover);
	}

	.theme-btn.is-active {
		background: var(--brand-emerald, #13371b);
		color: #ffffff;
		border-color: var(--brand-emerald, #13371b);
		box-shadow: 0 2px 6px rgba(19, 55, 27, 0.25);
	}

	:global([data-theme='dark']) .theme-btn.is-active {
		background: var(--brand-gold, #ffb327);
		color: #101e14;
		border-color: var(--brand-gold, #ffb327);
		box-shadow: 0 2px 6px rgba(255, 179, 39, 0.25);
	}

	.swatch-emerald {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #13371b;
		border: 1.5px solid #598f3a;
		display: inline-block;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.swatch-circle {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid rgba(0, 0, 0, 0.2);
		display: inline-block;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
		transition: transform 0.12s ease;
	}

	.theme-btn:hover .swatch-circle {
		transform: scale(1.15);
	}

	.theme-btn.is-active .swatch-circle {
		transform: scale(1.1);
		box-shadow: 0 0 0 2px #00783f;
	}

	.is-oracal-mode .bg-switch-track {
		overflow-x: auto;
		max-width: 100%;
		scrollbar-width: none;
	}

	.is-oracal-mode .bg-switch-track::-webkit-scrollbar {
		display: none;
	}

	.theme-btn.is-active .swatch-emerald {
		border-color: #ffffff;
		box-shadow: 0 0 0 1px #ffffff;
	}

	:global([data-theme='dark']) .theme-btn.is-active .swatch-emerald {
		border-color: #101e14;
		box-shadow: 0 0 0 1px #101e14;
	}
</style>
