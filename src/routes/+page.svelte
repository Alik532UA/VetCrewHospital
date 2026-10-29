<script lang="ts">
	import TopNav from '../lib/components/TopNav.svelte';
	import VetCrewLogo from '../lib/components/VetCrewLogo.svelte';
	import ActionButtons from '../lib/components/ActionButtons.svelte';
	import ScrollIndicator from '../lib/components/ScrollIndicator.svelte';
	import { langStore } from '../lib/lang.svelte';

	// 2 Scroll States:
	// 1 = Logo Hero & Docked Actions
	// 2 = Actions Focus & Compact Logo
	let scrollState = $state<1 | 2>(1);

	function toggleState() {
		scrollState = scrollState === 1 ? 2 : 1;
	}

	function setState(target: 1 | 2) {
		scrollState = target;
	}

	// Wheel, touch and key navigation
	$effect(() => {
		if (typeof window === 'undefined') return;

		let wheelAccumulator = 0;
		let lastStepTime = 0;
		let wheelClearTimer: ReturnType<typeof setTimeout> | null = null;

		function handleWheel(e: WheelEvent) {
			// Prevent default page scroll since this is an immersive viewport
			e.preventDefault();

			const now = performance.now();
			wheelAccumulator += e.deltaY;

			if (wheelClearTimer) clearTimeout(wheelClearTimer);
			wheelClearTimer = setTimeout(() => {
				wheelAccumulator = 0;
			}, 150);

			const STEP_COOLDOWN = 180;
			const THRESHOLD = 35;

			if (Math.abs(wheelAccumulator) >= THRESHOLD && now - lastStepTime >= STEP_COOLDOWN) {
				if (wheelAccumulator > 0 && scrollState === 1) {
					setState(2);
				} else if (wheelAccumulator < 0 && scrollState === 2) {
					setState(1);
				}
				lastStepTime = now;
				wheelAccumulator = 0;
			}
		}

		let touchStartY = 0;
		function handleTouchStart(e: TouchEvent) {
			if (e.touches && e.touches[0]) {
				touchStartY = e.touches[0].clientY;
			}
		}

		function handleTouchEnd(e: TouchEvent) {
			if (e.changedTouches && e.changedTouches[0]) {
				const touchEndY = e.changedTouches[0].clientY;
				const deltaY = touchStartY - touchEndY;
				if (deltaY > 38 && scrollState === 1) {
					setState(2);
				} else if (deltaY < -38 && scrollState === 2) {
					setState(1);
				}
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName?.toLowerCase();
			if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;

			if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
				if (scrollState === 1) {
					e.preventDefault();
					setState(2);
				}
			} else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
				if (scrollState === 2) {
					e.preventDefault();
					setState(1);
				}
			}
		}

		window.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('touchstart', handleTouchStart, { passive: true });
		window.addEventListener('touchend', handleTouchEnd, { passive: true });
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('touchstart', handleTouchStart);
			window.removeEventListener('touchend', handleTouchEnd);
			window.removeEventListener('keydown', handleKeyDown);
			if (wheelClearTimer) clearTimeout(wheelClearTimer);
		};
	});
</script>

<svelte:head>
	<title>{langStore.t('hospital_name')} — {langStore.t('emergency_tagline')}</title>
</svelte:head>

<main class="page-container" class:state-1={scrollState === 1} class:state-2={scrollState === 2}>
	<TopNav />

	<div class="content-stage">
		<!-- HERO SECTION (Logo & Title) -->
		<section class="hero-section" aria-label="Hospital Brand">
			<VetCrewLogo
				compact={scrollState === 2}
				onclick={() => {
					if (scrollState === 2) setState(1);
				}}
			/>

			<div class="brand-typography">
				<h1 class="brand-title">
					<span class="title-vet">VET</span>
					<span class="title-crew">CREW</span>
					<span class="title-hospital">HOSPITAL</span>
				</h1>
				<p class="brand-tagline">
					{langStore.t('emergency_tagline')}
				</p>
			</div>
		</section>

		<!-- ACTIONS SECTION -->
		<section class="actions-section" aria-label="Action Channels">
			<ActionButtons
				expanded={scrollState === 2}
				onExpandRequest={() => setState(2)}
			/>
		</section>
	</div>

	<!-- Scroll indicator and cues -->
	<ScrollIndicator state={scrollState} ontoggle={toggleState} />
</main>

<style>
	.page-container {
		position: relative;
		width: 100%;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4.5rem 1rem 2rem;
		overflow: hidden;
		transition: background-color 0.6s ease;
	}

	.content-stage {
		position: relative;
		width: 100%;
		max-width: 1040px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 10;
		transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* ==============================
	   HERO SECTION
	   ============================== */
	.hero-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		transition:
			transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.5s ease;
	}

	.brand-typography {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.35rem;
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.brand-title {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		font-size: clamp(1.4rem, 4vw, 2.2rem);
		font-weight: 900;
		letter-spacing: 0.05em;
		line-height: 1.1;
	}

	.title-vet {
		color: var(--brand-gold);
		text-shadow: 0 0 20px var(--brand-gold-glow);
	}

	.title-crew {
		color: var(--brand-gold);
		text-shadow: 0 0 20px var(--brand-gold-glow);
	}

	.title-hospital {
		color: var(--brand-leaf);
		font-weight: 700;
		font-size: 0.75em;
		letter-spacing: 0.12em;
	}

	.brand-tagline {
		font-size: clamp(0.85rem, 2vw, 1.05rem);
		font-weight: 500;
		color: var(--text-secondary);
		max-width: 480px;
		line-height: 1.4;
	}

	/* ==============================
	   ACTIONS SECTION
	   ============================== */
	.actions-section {
		width: 100%;
		display: flex;
		justify-content: center;
		transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* ==============================
	   STATE 1 STYLES (Hero Logo)
	   ============================== */
	.state-1 .content-stage {
		transform: translateY(-20px);
	}

	.state-1 .hero-section {
		transform: scale(1);
	}

	.state-1 .actions-section {
		position: fixed;
		bottom: 2rem;
		left: 0;
		right: 0;
	}

	/* ==============================
	   STATE 2 STYLES (Actions Focus)
	   ============================== */
	.state-2 .content-stage {
		justify-content: flex-start;
		padding-top: 1rem;
		gap: 1.5rem;
	}

	.state-2 .hero-section {
		transform: translateY(0);
		gap: 0.5rem;
	}

	.state-2 .brand-typography {
		transform: scale(0.88);
	}

	.state-2 .brand-tagline {
		display: none;
	}

	.state-2 .actions-section {
		position: relative;
		margin-top: 0.5rem;
	}

	@media (max-height: 720px) {
		.page-container {
			padding-top: 3.8rem;
		}

		.state-1 .content-stage {
			transform: translateY(-30px);
		}

		.state-2 .content-stage {
			padding-top: 0.5rem;
			gap: 0.75rem;
		}

		.brand-title {
			font-size: 1.25rem;
		}
	}
</style>

