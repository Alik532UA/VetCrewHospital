<script lang="ts">
	import VetCrewLogo from '../lib/components/VetCrewLogo.svelte';
	import ContactLinks from '../lib/components/ContactLinks.svelte';
	import HiddenPanel from '../lib/components/HiddenPanel.svelte';
	import ScrollIndicator from '../lib/components/ScrollIndicator.svelte';
	import { langStore } from '../lib/lang.svelte';

	// 2 Scroll States (matching DeviantBlaze architecture):
	// 1: Standard default (centered logo, clean borderless buttons, labels on hover)
	// 2: Softly shifted up to expand contact details and reveal bottom tools panel
	let scrollState = $state<1 | 2>(1);

	function stepScroll(direction: number) {
		if (direction > 0) {
			scrollState = scrollState === 2 ? 1 : 2;
		} else {
			scrollState = scrollState === 1 ? 2 : 1;
		}
	}

	function goToState(state: 1 | 2) {
		scrollState = state;
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		let wheelAccumulator = 0;
		let lastStepTime = 0;
		let wheelClearTimer: ReturnType<typeof setTimeout> | null = null;

		function handleWheel(e: WheelEvent) {
			e.preventDefault();

			const now = performance.now();
			wheelAccumulator += e.deltaY;

			if (wheelClearTimer) clearTimeout(wheelClearTimer);
			wheelClearTimer = setTimeout(() => {
				wheelAccumulator = 0;
			}, 140);

			// Soft, responsive scroll matching DeviantBlaze:
			// Cooldown of 55ms allows fast successive notches,
			// threshold of 40 filters minor twitches and accumulates trackpad deltas.
			const STEP_COOLDOWN = 55;
			const THRESHOLD = 40;

			if (Math.abs(wheelAccumulator) >= THRESHOLD && now - lastStepTime >= STEP_COOLDOWN) {
				stepScroll(wheelAccumulator > 0 ? 1 : -1);
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
				if (Math.abs(deltaY) > 42) {
					stepScroll(deltaY > 0 ? 1 : -1);
				}
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName?.toLowerCase();
			if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;

			if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
				e.preventDefault();
				stepScroll(1);
			} else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
				e.preventDefault();
				stepScroll(-1);
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
	<title>{langStore.t('hospital_name')}</title>
</svelte:head>

<main class="page-container state-{scrollState}">
	<!-- Central Hero SVG Logo with dynamic cursor reactivity -->
	<section
		class="hero-center state-{scrollState}"
		aria-label="Vet Crew Hospital"
	>
		<VetCrewLogo />
	</section>

	<!-- Bottom Center Contact Channels: Phone, Instagram, Map -->
	<ContactLinks
		isExpanded={scrollState === 2}
		isShiftedUp={scrollState === 2}
	/>

	<!-- Hidden Actions Panel in State 2 (Theme, Lang, Fullscreen) -->
	<HiddenPanel isVisible={scrollState === 2} />

	<!-- 2-State Cyclic Scroll Indicator on Right Edge -->
	<ScrollIndicator
		state={scrollState}
		onGoToState={goToState}
	/>
</main>

<style>
	.page-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		user-select: none;
		-webkit-user-select: none;
	}

	/* Central Hero Logo Position based on Scroll States */
	.hero-center {
		position: relative;
		z-index: 10;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform;
	}

	/* State 1: Default standard position */
	.hero-center.state-1 {
		transform: translateY(0);
	}

	/* State 2: Softly shifts slightly up to give room to bottom channels & panel */
	.hero-center.state-2 {
		transform: translateY(-8vh);
	}

	@media (max-width: 640px) {
		.hero-center {
			padding-bottom: 4.5rem;
		}

		.hero-center.state-2 {
			transform: translateY(-6vh);
		}
	}
</style>
