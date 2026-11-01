<script lang="ts">
	import { langStore } from '../lang.svelte';

	interface Props {
		isExpanded?: boolean;
		isShiftedUp?: boolean;
	}

	let { isExpanded = false, isShiftedUp = false }: Props = $props();

	const channels = [
		{
			id: 'phone',
			name: 'Phone',
			getUrl: () => 'tel:+380775010101',
			getName: () => langStore.t('btn_phone'),
			getSublabel: () => langStore.t('btn_phone_display'),
			brandColor: '#22c55e',
			brandGlow: 'rgba(34, 197, 94, 0.65)',
			svg: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`
		},
		{
			id: 'instagram',
			name: 'Instagram',
			getUrl: () => 'https://www.instagram.com/vet.crew.hospital',
			getName: () => langStore.t('btn_instagram'),
			getSublabel: () => langStore.t('btn_instagram_display'),
			brandColor: '#e1306c',
			brandGlow: 'rgba(225, 48, 108, 0.65)',
			svg: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`
		},
		{
			id: 'map',
			name: 'Map',
			getUrl: () => 'https://maps.app.goo.gl/sTe5ePLTwwwQEZQz6',
			getName: () => langStore.t('btn_map'),
			getSublabel: () => langStore.t('btn_map_display'),
			brandColor: '#3b82f6',
			brandGlow: 'rgba(59, 130, 246, 0.65)',
			svg: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`
		}
	];
</script>

<div class="contact-container" class:is-expanded={isExpanded} class:is-shifted-up={isShiftedUp}>
	<nav class="contact-links" aria-label="Hospital Contacts">
		{#each channels as item (item.id)}
			<a
				href={item.getUrl()}
				target={item.id === 'phone' ? undefined : '_blank'}
				rel={item.id === 'phone' ? undefined : 'noopener noreferrer'}
				class="link-item channel-{item.id}"
				style="--brand-color: {item.brandColor}; --brand-glow: {item.brandGlow};"
				aria-label={item.getName()}
			>
				<div class="icon-wrap">
					<svg
						class="contact-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<!-- svelte-ignore svelte/no-at-html-tags -->
						{@html item.svg}
					</svg>
				</div>
				<span class="link-sublabel">{item.getSublabel()}</span>
				<span class="tooltip">{item.getSublabel()}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	.contact-container {
		position: fixed;
		bottom: 2.25rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		transition:
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.contact-container.is-expanded {
		bottom: 2.75rem;
	}

	.contact-container.is-shifted-up {
		transform: translateX(-50%) translateY(-105px);
	}

	.contact-links {
		display: grid;
		grid-template-columns: repeat(3, 100px);
		justify-items: center;
		align-items: center;
		padding: 0.25rem 1rem;
		pointer-events: auto;
		transition: grid-template-columns 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.is-expanded .contact-links {
		grid-template-columns: repeat(3, 160px);
	}

	.link-item {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		text-decoration: none;
		outline: none;
	}

	.icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--fg-secondary);
		transition:
			transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			color 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Normal icon: 44px; Expanded: 88px */
	.contact-icon {
		width: 44px;
		height: 44px;
		display: block;
		transition:
			width 0.45s cubic-bezier(0.16, 1, 0.3, 1),
			height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.28s cubic-bezier(0.16, 1, 0.3, 1);
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
	}

	.is-expanded .contact-icon {
		width: 84px;
		height: 84px;
	}

	.link-sublabel {
		display: block;
		margin-top: 10px;
		font-size: 0.92rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--fg-primary);
		opacity: 0;
		max-height: 0;
		overflow: hidden;
		transform: translateY(6px);
		transition:
			opacity 0.4s ease,
			transform 0.4s ease,
			max-height 0.4s ease;
		pointer-events: none;
		white-space: nowrap;
	}

	.is-expanded .link-sublabel {
		opacity: 1;
		max-height: 28px;
		transform: translateY(0);
	}

	.is-expanded .tooltip {
		display: none;
	}

	/* On hover: color icon in its official brand color and add matching glowing aura */
	.link-item:hover .icon-wrap {
		color: var(--brand-color);
		transform: translateY(-4px) scale(1.14);
	}

	.link-item:hover .contact-icon {
		filter: drop-shadow(0 0 22px var(--brand-glow));
	}

	.link-item:focus-visible .icon-wrap {
		transform: scale(1.1);
		color: var(--brand-color);
	}

	.link-item:active .icon-wrap {
		transform: translateY(-1px) scale(1.02);
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 14px);
		padding: 5px 12px;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		white-space: nowrap;
		background: var(--bg-secondary);
		color: var(--fg-primary);
		border: 1px solid var(--border);
		border-radius: 6px;
		pointer-events: none;
		opacity: 0;
		transform: translateY(6px) scale(0.95);
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.link-item:hover .tooltip {
		opacity: 1;
		transform: translateY(0) scale(1);
		border-color: var(--brand-color);
	}

	@media (max-width: 768px), (pointer: coarse) {
		.contact-container {
			bottom: 1.45rem;
			max-width: calc(100vw - 1rem);
			box-sizing: border-box;
		}

		.contact-container.is-expanded {
			bottom: 1.85rem;
		}

		.contact-container.is-shifted-up {
			transform: translateX(-50%) translateY(-115px);
		}

		.contact-links {
			grid-template-columns: repeat(3, minmax(70px, 1fr));
			gap: 0;
			padding: 0.2rem 0.5rem;
		}

		.is-expanded .contact-links {
			grid-template-columns: repeat(3, minmax(88px, 1fr));
			gap: 0;
		}

		.link-item {
			padding: 4px 6px;
			flex-shrink: 0;
		}

		.icon-wrap {
			color: var(--fg-primary);
		}

		.contact-icon {
			width: 38px;
			height: 38px;
		}

		.is-expanded .contact-icon {
			width: 52px;
			height: 52px;
		}

		.link-sublabel {
			font-size: 0.74rem;
			margin-top: 6px;
			width: 100%;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.is-expanded .link-sublabel {
			font-size: 0.74rem;
			margin-top: 6px;
			max-height: 24px;
			width: 100%;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.tooltip {
			display: none;
		}
	}
</style>
