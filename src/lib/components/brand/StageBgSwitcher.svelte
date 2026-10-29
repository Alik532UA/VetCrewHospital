<script lang="ts">
	import { langStore } from '$lib/lang.svelte';

	export type StageTheme = 'checker' | 'light' | 'emerald' | 'dark';

	interface Props {
		current?: StageTheme;
		label?: boolean;
		compact?: boolean;
	}

	let { current = $bindable('checker'), label = true, compact = false }: Props = $props();

	const THEMES: { id: StageTheme; labelUk: string; labelEn: string; dotClass: string; titleUk: string; titleEn: string }[] = [
		{
			id: 'checker',
			labelUk: 'Сітка',
			labelEn: 'Grid',
			dotClass: 'dot-checker',
			titleUk: 'Шахматка (прозоре тло)',
			titleEn: 'Transparent checkerboard'
		},
		{
			id: 'light',
			labelUk: 'Світле',
			labelEn: 'Light',
			dotClass: 'dot-light',
			titleUk: 'Світле тло',
			titleEn: 'Light background'
		},
		{
			id: 'emerald',
			labelUk: 'Смарагд',
			labelEn: 'Emerald',
			dotClass: 'dot-emerald',
			titleUk: 'Фірмовий смарагд #13371B',
			titleEn: 'Brand Emerald #13371B'
		},
		{
			id: 'dark',
			labelUk: 'Темне',
			labelEn: 'Dark',
			dotClass: 'dot-dark',
			titleUk: 'Темне тло',
			titleEn: 'Dark background'
		}
	];
</script>

<div class="bg-switch-pill" class:is-compact={compact} role="group" aria-label={langStore.current === 'uk' ? 'Тло прев’ю' : 'Preview background'}>
	{#if label}
		<span class="bg-switch-label">{langStore.current === 'uk' ? 'Тло прев’ю:' : 'Preview Bg:'}</span>
	{/if}
	<div class="bg-switch-btns">
		{#each THEMES as t (t.id)}
			<button
				type="button"
				class="theme-btn"
				class:is-active={current === t.id}
				onclick={() => (current = t.id)}
				title={langStore.current === 'uk' ? t.titleUk : t.titleEn}
				aria-pressed={current === t.id}
			>
				<span class="color-dot {t.dotClass}"></span>
				<span>{langStore.current === 'uk' ? t.labelUk : t.labelEn}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.bg-switch-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		padding: 4px 6px 4px 12px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 9999px;
		flex-wrap: wrap;
	}

	.bg-switch-pill.is-compact {
		gap: 0.45rem;
		padding: 3px 5px 3px 10px;
	}

	.bg-switch-label {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg-muted);
		white-space: nowrap;
	}

	.bg-switch-btns {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		flex-wrap: wrap;
	}

	.theme-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.65rem;
		border-radius: 9999px;
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--fg-secondary);
		background: transparent;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.is-compact .theme-btn {
		padding: 0.25rem 0.5rem;
		font-size: 0.72rem;
	}

	.theme-btn:hover {
		color: var(--fg-primary);
		background: var(--panel-bg);
	}

	.theme-btn.is-active {
		background: var(--panel-bg);
		color: var(--fg-primary);
		border-color: var(--border-hover);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='light']) .theme-btn.is-active {
		background: #ffffff;
		color: #0c1c10;
		border-color: rgba(19, 55, 27, 0.25);
	}

	.color-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.dot-checker {
		background-image: 
			linear-gradient(45deg, #888 25%, transparent 25%),
			linear-gradient(-45deg, #888 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #888 75%),
			linear-gradient(-45deg, transparent 75%, #888 75%);
		background-size: 6px 6px;
		background-position: 0 0, 0 3px, 3px -3px, -3px 0px;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.dot-light {
		background: #ffffff;
		border: 1px solid #c4c7c5;
	}

	.dot-emerald {
		background: #13371b;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.dot-dark {
		background: #181c19;
		border: 1px solid #374151;
	}
</style>

