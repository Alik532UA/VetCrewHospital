<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { langStore } from '$lib/lang.svelte';
	import { themeStore } from '$lib/theme.svelte';
	import { logService } from '$lib/services/logService.svelte';
	import logoPaths from '$lib/assets/logo-paths.json';
	import vetcrewLogoPaths from '$lib/assets/vetcrew-logo-paths.json';
	import { ANIMALS, type AnimalItem } from '$lib/data/animals';

	interface ColorOption {
		hex: string;
		name: string;
		textColor: string;
		rgb?: string;
	}

	interface Props {
		brandColors: ColorOption[];
	}

	let { brandColors }: Props = $props();

	type DeviceType = 'pc' | 'phone';
	type Resolution = 'fhd' | '2k' | '4k';
	type SymbolType = 'vetcrew' | 'hospital' | 'butterfly' | 'animal';
	type BadgeShape = 'none' | 'circle' | 'square';

	// Device and Resolution state
	let device = $state<DeviceType>('pc');
	let resolution = $state<Resolution>('4k');
	let symbolType = $state<SymbolType>('vetcrew');
	let badgeShape = $state<BadgeShape>('none');
	let logoScale = $state<number>(38); // 15% to 75%

	// Color states (Option B: Full detailed palette)
	let bgWallpaperColor = $state<string>('#262626');
	let badgeBgColor = $state<string>('#13371B');
	let pawToesColor = $state<string>('#93C84A');
	let pawPadColor = $state<string>('#93C84A');
	let vetCrewColor = $state<string>('#93C84A');
	let hospitalColor = $state<string>('#598F3A');
	let butterflyColor = $state<string>('#FFB327');
	let animalColor = $state<string>('#93C84A');

	// Animal state
	let selectedAnimalId = $state<string>('owl');
	let animalCategory = $state<'all' | 'birds' | 'reptiles' | 'mammals' | 'exotics'>('all');
	let animalSearch = $state<string>('');
	let animalSvgCache = $state<Record<string, string>>({});
	let isAnimalPickerOpen = $state<boolean>(false);

	// Export state
	let isExporting = $state<boolean>(false);
	let exportSuccess = $state<boolean>(false);

	const BUTTERFLY_PATH_D =
		'M145.67,128.27c6.5-8.68,11.89-18.24,19.03-26.47,14.64-16.9,46.38-45.5,70.29-32.34,21.57,11.87,12.85,54.35,5.17,72.8-10.58,25.4-26.93,49.67-55.04,56.97-.63,6.11,2.1,10.89,1.59,17.59-.29,3.84-3.37,12.35-6.64,14.35-2.63,1.6-6.24.41-7.93,2.07-1.17,1.15-5.19,15.08-6.61,18.39-6.7,15.57-25.58,41.91-45.75,32.03-11.96-5.86-12.52-22.52-12.15-33.93.1-3.09,2.45-6.35-.45-8.43-18.62,9.62-42.88,17.49-64.05,16.01-58.05-4.04-25.68-72.76,12.06-85.03.64-.21,2.27.36,1.47-1.49-.41-.94-12.57-11.2-14.96-14.04-20.46-24.34-32.56-69.39-29.9-100.84,4.33-51.24,45.32-52.67,75.38-18.64,29.34,33.22,47,84.97,47.48,129.02l-3.08-.6c-15.61-36.43-31.12-82.64-59.84-110.96-6.37-6.28-22.93-20.67-30.51-10.39-8.45,11.46-2.9,53.1.72,67.16,5.54,21.46,12.66,36,28.7,51.3,2.59,2.47,11.15,7.62,11,11.03-.12,2.74-9.23,5.66-11.83,7.11-13.05,7.23-26.65,17.45-31.91,32.09-14.82,41.28,52.18,19.82,70.43,12.43,5.7-2.31,10.76-7.11,17.33-6.18,1.07,11.75-4.35,23.84-3,35.5,1.69,14.65,13.74,6.48,19.96,0,8.26-8.59,23.58-32.86,20.83-44.8-.68-2.96-3.7-4.87-3.83-9.24-.45-14.69,15.02-13.6,24.09-17.92,17.84-8.49,36.02-41.6,39.5-60.5,1.39-7.54,4.9-30.69-7.02-30.1-14.5.71-45.65,32.06-56.05,43.04-2.91,3.08-14.9,19.02-17.98,19.03-5.49-9.13-3.3-21.16-4.53-31.5-1.3-10.96-5.9-19.75-7.75-29.26-1.4-7.21,3.3-8.09,7.65-3.64,3.27,3.34,8.12,18.4,8.12,22.88v15.5Z';

	// One-click presets (matching user screenshot & roles)
	interface WallpaperPreset {
		id: string;
		nameUk: string;
		nameEn: string;
		descUk: string;
		descEn: string;
		bg: string;
		toes: string;
		pad: string;
		vetCrew: string;
		hospital: string;
		butterfly: string;
		animal: string;
		badge: BadgeShape;
		badgeBg: string;
	}

	const PRESETS: WallpaperPreset[] = [
		{
			id: 'admin-graphite',
			nameUk: 'Адміністратор (Графіт)',
			nameEn: 'Administrator (Graphite)',
			descUk: 'Стильний темний графіт з весняним лаймом',
			descEn: 'Dark graphite with spring lime',
			bg: '#262626',
			toes: '#93C84A',
			pad: '#93C84A',
			vetCrew: '#93C84A',
			hospital: '#93C84A',
			butterfly: '#93C84A',
			animal: '#93C84A',
			badge: 'none',
			badgeBg: '#13371B'
		},
		{
			id: 'hospital-valentyna',
			nameUk: 'Валентина (Смарагд)',
			nameEn: 'Valentyna (Emerald)',
			descUk: 'Фірмовий зелений фон з чистим білим знаком',
			descEn: 'Brand green with pure white emblem',
			bg: '#598F3A',
			toes: '#FFFFFF',
			pad: '#FFFFFF',
			vetCrew: '#FFFFFF',
			hospital: '#FFFFFF',
			butterfly: '#FFFFFF',
			animal: '#FFFFFF',
			badge: 'none',
			badgeBg: '#13371B'
		},
		{
			id: 'accountant-gold',
			nameUk: 'Бухгалтер (Золото)',
			nameEn: 'Accountant (Gold)',
			descUk: 'Теплий золотий бурштин з контрастним темним лого',
			descEn: 'Warm amber gold with dark emblem',
			bg: '#FFB327',
			toes: '#262626',
			pad: '#262626',
			vetCrew: '#262626',
			hospital: '#262626',
			butterfly: '#262626',
			animal: '#262626',
			badge: 'none',
			badgeBg: '#13371B'
		},
		{
			id: 'canonical-deep',
			nameUk: 'Глибокий ліс (Канон)',
			nameEn: 'Deep Forest (Canonical)',
			descUk: 'Темно-зелений фон, біла лапа та золотий напис',
			descEn: 'Dark green with white paw & gold lettering',
			bg: '#13371B',
			toes: '#FFFFFF',
			pad: '#FFFFFF',
			vetCrew: '#FFB327',
			hospital: '#598F3A',
			butterfly: '#FFB327',
			animal: '#FFB327',
			badge: 'none',
			badgeBg: '#598F3A'
		},
		{
			id: 'light-minimal',
			nameUk: 'Світлий мінімалізм',
			nameEn: 'Light Minimal',
			descUk: 'Легкий чистий фон зі смарагдовим акцентом',
			descEn: 'Light background with emerald accents',
			bg: '#E5E5E5',
			toes: '#13371B',
			pad: '#13371B',
			vetCrew: '#13371B',
			hospital: '#598F3A',
			butterfly: '#598F3A',
			animal: '#13371B',
			badge: 'none',
			badgeBg: '#FFFFFF'
		},
		{
			id: 'night-stealth',
			nameUk: 'Нічний монохром',
			nameEn: 'Night Stealth',
			descUk: 'Ультратемний нічний інтерфейс із золотим неоном',
			descEn: 'Stealth dark background with warm gold',
			bg: '#0A130C',
			toes: '#FFB327',
			pad: '#FFB327',
			vetCrew: '#FFB327',
			hospital: '#FFB327',
			butterfly: '#FFB327',
			animal: '#FFB327',
			badge: 'none',
			badgeBg: '#13371B'
		}
	];

	function applyPreset(p: WallpaperPreset) {
		bgWallpaperColor = p.bg;
		pawToesColor = p.toes;
		pawPadColor = p.pad;
		vetCrewColor = p.vetCrew;
		hospitalColor = p.hospital;
		butterflyColor = p.butterfly;
		animalColor = p.animal;
		badgeShape = p.badge;
		badgeBgColor = p.badgeBg;
	}

	// Dimensions based on device and resolution
	const RESOLUTIONS = {
		pc: {
			fhd: { width: 1920, height: 1080, label: 'FHD (1920 × 1080)' },
			'2k': { width: 2560, height: 1440, label: '2K QHD (2560 × 1440)' },
			'4k': { width: 3840, height: 2160, label: '4K UHD (3840 × 2160)' }
		},
		phone: {
			fhd: { width: 1080, height: 1920, label: 'FHD (1080 × 1920)' },
			'2k': { width: 1440, height: 2560, label: '2K QHD (1440 × 2560)' },
			'4k': { width: 2160, height: 3840, label: '4K UHD (2160 × 3840)' }
		}
	} as const;

	let currentDimensions = $derived(RESOLUTIONS[device][resolution]);

	// Filtered animals list
	let filteredAnimals = $derived.by(() => {
		const q = animalSearch.trim().toLowerCase();
		return ANIMALS.filter((item) => {
			const matchesCat = animalCategory === 'all' || item.category === animalCategory;
			const matchesQuery =
				!q ||
				item.nameUk.toLowerCase().includes(q) ||
				item.nameEn.toLowerCase().includes(q) ||
				item.num.includes(q);
			return matchesCat && matchesQuery;
		});
	});

	let selectedAnimal = $derived(
		ANIMALS.find((a) => a.id === selectedAnimalId) ?? ANIMALS[0]!
	);

	// Fetch animal SVG content on demand and cache it
	$effect(() => {
		if (!browser || symbolType !== 'animal') return;
		const animal = selectedAnimal;
		if (animalSvgCache[animal.id]) return;

		fetch(`${base}/brand/animals/${encodeURIComponent(animal.file)}`)
			.then((res) => (res.ok ? res.text() : ''))
			.then((text) => {
				if (!text) return;
				// Extract inner content of svg
				const inner = text
					.replace(/<\?xml[\s\S]*?\?>/i, '')
					.replace(/<!--[\s\S]*?-->/g, '')
					.replace(/<svg[^>]*>/i, '')
					.replace(/<\/svg>/i, '')
					.replace(/fill="[^"]*"/gi, '');
				animalSvgCache = { ...animalSvgCache, [animal.id]: inner };
			})
			.catch((e) => logService.warn('brand', 'Failed to fetch animal SVG', e));
	});

	// Compute vector content and transformation for wallpaper
	let wallpaperSvgString = $derived.by(() => {
		const { width: W, height: H } = currentDimensions;
		const minSide = Math.min(W, H);
		const targetSize = (minSide * logoScale) / 100;

		let badgeSvg = '';
		if (badgeShape === 'circle') {
			const badgeRadius = targetSize * 0.55;
			badgeSvg = `<circle cx="${W / 2}" cy="${H / 2}" r="${badgeRadius}" fill="${badgeBgColor}"/>`;
		} else if (badgeShape === 'square') {
			const badgeSize = targetSize * 1.1;
			const bx = (W - badgeSize) / 2;
			const by = (H - badgeSize) / 2;
			const rx = badgeSize * 0.12;
			badgeSvg = `<rect x="${bx}" y="${by}" width="${badgeSize}" height="${badgeSize}" rx="${rx}" fill="${badgeBgColor}"/>`;
		}

		let symbolContent = '';

		if (symbolType === 'hospital') {
			const k = targetSize / 970.62;
			const tx = (W - targetSize) / 2;
			const ty = (H - targetSize) / 2;

			symbolContent = `
			<g id="wallpaper-symbol" transform="translate(${tx}, ${ty}) scale(${k})">
				<g id="logo-content" transform="translate(0, 6.15)">
					<g id="paw-toes" fill="${pawToesColor}">
						<path d="${logoPaths['paw-toe-right'].d}"/>
						<path d="${logoPaths['paw-toe-center-right'].d}"/>
						<path d="${logoPaths['paw-toe-center-left'].d}"/>
						<path d="${logoPaths['paw-toe-left'].d}"/>
					</g>
					<path id="paw-pad" fill="${pawPadColor}" d="${logoPaths['paw-pad'].d}"/>
					<path id="text-vet-crew" fill="${vetCrewColor}" d="${logoPaths['text-vet-crew'].d}"/>
					<path id="text-hospital" fill="${hospitalColor}" d="${logoPaths['text-hospital'].d}"/>
				</g>
			</g>`;
		} else if (symbolType === 'vetcrew') {
			const k = targetSize / 4096;
			const tx = (W - targetSize) / 2;
			const ty = (H - targetSize) / 2;

			symbolContent = `
			<g id="wallpaper-symbol" transform="translate(${tx}, ${ty}) scale(${k})">
				<g id="vet-crew-content">
					<g id="paw-toes" fill="${pawToesColor}">
						<path fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-left']}"/>
						<path fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-center-left']}"/>
						<path fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-center-right']}"/>
						<path fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-toe-right']}"/>
					</g>
					<path id="paw-pad" fill="${pawPadColor}" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['paw-pad']}"/>
					<path id="text-vet-crew" fill="${vetCrewColor}" fill-rule="evenodd" d="${vetcrewLogoPaths.paths['text-vet-crew']}"/>
				</g>
			</g>`;
		} else if (symbolType === 'butterfly') {
			const k = targetSize / 300;
			const bW = 260 * k;
			const bH = 300 * k;
			const tx = (W - bW) / 2;
			const ty = (H - bH) / 2;

			symbolContent = `
			<g id="wallpaper-symbol" transform="translate(${tx}, ${ty}) scale(${k})">
				<path fill="${butterflyColor}" d="${BUTTERFLY_PATH_D}"/>
			</g>`;
		} else if (symbolType === 'animal') {
			const k = targetSize / 2048;
			const tx = (W - targetSize) / 2;
			const ty = (H - targetSize) / 2;
			const inner = animalSvgCache[selectedAnimal.id] ?? '';

			symbolContent = `
			<g id="wallpaper-symbol" transform="translate(${tx}, ${ty}) scale(${k})" fill="${animalColor}">
				${inner}
			</g>`;
		}

		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
	<title>Vet Crew Wallpaper</title>
	<rect x="0" y="0" width="${W}" height="${H}" fill="${bgWallpaperColor}"/>
	${badgeSvg}
	${symbolContent}
</svg>`;
	});

	// Filename generator per Question 4 Option A
	let currentFilename = $derived.by(() => {
		let symbolPrefix = 'vet-crew';
		if (symbolType === 'hospital') symbolPrefix = 'vet-crew-hospital';
		else if (symbolType === 'butterfly') symbolPrefix = 'vet-crew-butterfly';
		else if (symbolType === 'animal') symbolPrefix = `vet-crew-${selectedAnimal.id}`;

		return `${symbolPrefix}-wallpaper-${device}-${resolution}.png`;
	});

	// Download SVG file
	function downloadSvg() {
		const blob = new Blob([wallpaperSvgString], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = currentFilename.replace('.png', '.svg');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// High resolution PNG download via Canvas (FHD, 2K, 4K)
	async function downloadPng() {
		if (!browser) return;
		isExporting = true;
		exportSuccess = false;

		try {
			const { width: W, height: H } = currentDimensions;
			const canvas = document.createElement('canvas');
			canvas.width = W;
			canvas.height = H;
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Could not create Canvas 2D context');

			// Fill solid background
			ctx.fillStyle = bgWallpaperColor;
			ctx.fillRect(0, 0, W, H);

			const svgBlob = new Blob([wallpaperSvgString], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(svgBlob);
			const img = new Image();

			await new Promise<void>((resolve, reject) => {
				img.onload = () => {
					ctx.drawImage(img, 0, 0, W, H);
					URL.revokeObjectURL(url);
					resolve();
				};
				img.onerror = (e) => {
					URL.revokeObjectURL(url);
					reject(e);
				};
				img.src = url;
			});

			canvas.toBlob((pngBlob) => {
				if (!pngBlob) return;
				const pngUrl = URL.createObjectURL(pngBlob);
				const link = document.createElement('a');
				link.href = pngUrl;
				link.download = currentFilename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
				exportSuccess = true;
				setTimeout(() => (exportSuccess = false), 3000);
			}, 'image/png');
		} catch (err) {
			logService.error('brand', 'Wallpaper export failed', err);
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="wallpaper-studio">
	<!-- 1. TOP CONTROL BAR: Device & Resolution & Symbol -->
	<div class="studio-header-card">
		<!-- Device Segmented Control -->
		<div class="control-group">
			<span class="control-label">{langStore.current === 'uk' ? 'Пристрій та формат:' : 'Device & Format:'}</span>
			<div class="pill-group" role="tablist">
				<button
					type="button"
					role="tab"
					class="pill-btn"
					class:is-active={device === 'pc'}
					onclick={() => (device = 'pc')}
				>
					<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect width="20" height="14" x="2" y="3" rx="2"/>
						<line x1="8" x2="16" y1="21" y2="21"/>
						<line x1="12" x2="12" y1="17" y2="21"/>
					</svg>
					<span>ПК / Монітор (16:9)</span>
				</button>

				<button
					type="button"
					role="tab"
					class="pill-btn"
					class:is-active={device === 'phone'}
					onclick={() => (device = 'phone')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect width="14" height="20" x="5" y="2" rx="3"/>
						<line x1="12" x2="12.01" y1="18" y2="18"/>
					</svg>
					<span>Смартфон (9:16)</span>
				</button>
			</div>
		</div>

		<!-- Resolution Selector -->
		<div class="control-group">
			<span class="control-label">{langStore.current === 'uk' ? 'Роздільна здатність:' : 'Resolution:'}</span>
			<div class="pill-group">
				<button
					type="button"
					class="pill-btn"
					class:is-active={resolution === 'fhd'}
					onclick={() => (resolution = 'fhd')}
				>
					<span>FHD</span>
					<span class="pill-sub">{device === 'pc' ? '1080p' : '1080×1920'}</span>
				</button>

				<button
					type="button"
					class="pill-btn"
					class:is-active={resolution === '2k'}
					onclick={() => (resolution = '2k')}
				>
					<span>2K QHD</span>
					<span class="pill-sub">{device === 'pc' ? '1440p' : '1440×2560'}</span>
				</button>

				<button
					type="button"
					class="pill-btn highlight-gold"
					class:is-active={resolution === '4k'}
					onclick={() => (resolution = '4k')}
				>
					<span>4K Ultra HD</span>
					<span class="pill-sub">{device === 'pc' ? '2160p' : '2160×3840'}</span>
				</button>
			</div>
		</div>

		<!-- Symbol Type Selector -->
		<div class="control-group">
			<span class="control-label">{langStore.current === 'uk' ? 'Символ на шпалерах:' : 'Emblem on Wallpaper:'}</span>
			<div class="pill-group wrap-pills">
				<button
					type="button"
					class="pill-btn"
					class:is-active={symbolType === 'vetcrew'}
					onclick={() => (symbolType = 'vetcrew')}
				>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<circle cx="4.5" cy="9.5" r="2.2"/>
						<circle cx="9.2" cy="5.5" r="2.2"/>
						<circle cx="14.8" cy="5.5" r="2.2"/>
						<circle cx="19.5" cy="9.5" r="2.2"/>
						<path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.49-1.68-1.15-4.04-1.15-5.72 0-.88.6-1.61 1.47-2.48 2.49-1.22 1.43-2.16 3.16-1.44 4.88.75 1.78 2.71 2.26 4.3 1.95.8-.16 1.63-.69 2.48-.69s1.69.53 2.48.69c1.59.31 3.55-.17 4.3-1.95.72-1.72-.22-3.45-1.44-4.88z"/>
					</svg>
					<span>Vet Crew</span>
				</button>

				<button
					type="button"
					class="pill-btn"
					class:is-active={symbolType === 'hospital'}
					onclick={() => (symbolType = 'hospital')}
				>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
						<path d="M12 9v4"/>
						<path d="M10 11h4"/>
					</svg>
					<span>Vet Crew Hospital</span>
				</button>

				<button
					type="button"
					class="pill-btn"
					class:is-active={symbolType === 'butterfly'}
					onclick={() => (symbolType = 'butterfly')}
				>
					<svg width="15" height="15" viewBox="0 0 260 300" fill="currentColor" aria-hidden="true">
						<path d={BUTTERFLY_PATH_D} />
					</svg>
					<span>{langStore.current === 'uk' ? 'Метелик' : 'Butterfly'}</span>
				</button>

				<button
					type="button"
					class="pill-btn"
					class:is-active={symbolType === 'animal'}
					onclick={() => (symbolType = 'animal')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="11" cy="4" r="2"/>
						<circle cx="18" cy="8" r="2"/>
						<circle cx="20" cy="16" r="2"/>
						<path d="M9 10a5 5 0 0 1 5 5v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4a5 5 0 0 1 5-5z"/>
					</svg>
					<span>{langStore.current === 'uk' ? `Тварина: ${selectedAnimal.nameUk}` : `Animal: ${selectedAnimal.nameEn}`}</span>
				</button>
			</div>
		</div>

		<!-- Animal Selection Drawer/Bar (visible when animal symbol is selected) -->
		{#if symbolType === 'animal'}
			<div class="animal-picker-panel">
				<div class="animal-filter-row">
					<div class="cat-pills">
						<button
							type="button"
							class="cat-chip"
							class:is-active={animalCategory === 'all'}
							onclick={() => (animalCategory = 'all')}
						>
							{langStore.current === 'uk' ? 'Усі (24)' : 'All (24)'}
						</button>
						<button
							type="button"
							class="cat-chip"
							class:is-active={animalCategory === 'birds'}
							onclick={() => (animalCategory = 'birds')}
						>
							{langStore.current === 'uk' ? 'Птахи' : 'Birds'}
						</button>
						<button
							type="button"
							class="cat-chip"
							class:is-active={animalCategory === 'reptiles'}
							onclick={() => (animalCategory = 'reptiles')}
						>
							{langStore.current === 'uk' ? 'Рептилії' : 'Reptiles'}
						</button>
						<button
							type="button"
							class="cat-chip"
							class:is-active={animalCategory === 'mammals'}
							onclick={() => (animalCategory = 'mammals')}
						>
							{langStore.current === 'uk' ? 'Ссавці' : 'Mammals'}
						</button>
						<button
							type="button"
							class="cat-chip"
							class:is-active={animalCategory === 'exotics'}
							onclick={() => (animalCategory = 'exotics')}
						>
							{langStore.current === 'uk' ? 'Екзотичні' : 'Exotics'}
						</button>
					</div>

					<input
						type="search"
						class="animal-search-input"
						placeholder={langStore.current === 'uk' ? 'Пошук тварини...' : 'Search animal...'}
						bind:value={animalSearch}
					/>
				</div>

				<div class="animal-chips-grid">
					{#each filteredAnimals as a (a.id)}
						<button
							type="button"
							class="animal-chip-btn"
							class:is-selected={selectedAnimalId === a.id}
							onclick={() => (selectedAnimalId = a.id)}
						>
							<span class="chip-num">{a.num}</span>
							<span class="chip-name">{langStore.current === 'uk' ? a.nameUk : a.nameEn}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- 2. QUICK ONE-CLICK PRESETS -->
	<div class="presets-bar">
		<span class="presets-title">{langStore.current === 'uk' ? 'Швидкі пресети ролей:' : 'Quick Role Presets:'}</span>
		<div class="presets-scroll">
			{#each PRESETS as p (p.id)}
				<button
					type="button"
					class="role-preset-btn"
					onclick={() => applyPreset(p)}
					title={langStore.current === 'uk' ? p.descUk : p.descEn}
				>
					<span class="preset-dot" style="background-color: {p.bg}; border-color: {p.toes};"></span>
					<span class="preset-name">{langStore.current === 'uk' ? p.nameUk : p.nameEn}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- 3. MAIN WORKSPACE: PREVIEW (LEFT) + DETAILED PALETTE (RIGHT) -->
	<div class="workspace-grid">
		<!-- LEFT: INTERACTIVE DEVICE PREVIEW -->
		<div class="preview-column">
			<div class="preview-wrapper">
				<div class="device-bezel" class:is-pc={device === 'pc'} class:is-phone={device === 'phone'}>
					{#if device === 'pc'}
						<div class="pc-topbar">
							<span class="pc-cam"></span>
						</div>
					{:else}
						<div class="phone-dynamic-island">
							<span class="phone-camera"></span>
						</div>
					{/if}

					<!-- REAL-TIME SCALABLE VECTOR CANVAS PREVIEW -->
					<div
						class="screen-canvas"
						style:aspect-ratio={device === 'pc' ? '16 / 9' : '9 / 16'}
					>
						<!-- Safe SVG embedding for crisp GPU preview -->
						{@html wallpaperSvgString}
					</div>

					{#if device === 'pc'}
						<div class="pc-stand-hint"></div>
					{/if}
				</div>
			</div>

			<!-- Scale slider bar below preview -->
			<div class="scale-bar">
				<div class="scale-label-row">
					<span class="scale-title">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="11" cy="11" r="8"/>
							<line x1="21" x2="16.65" y1="21" y2="16.65"/>
							<line x1="11" x2="11" y1="8" y2="14"/>
							<line x1="8" x2="14" y1="11" y2="11"/>
						</svg>
						<span>{langStore.current === 'uk' ? 'Розмір символу на екрані:' : 'Emblem Scale on Screen:'}</span>
					</span>
					<span class="scale-val-badge">{logoScale}%</span>
				</div>

				<div class="scale-controls">
					<input
						type="range"
						min="15"
						max="75"
						step="1"
						class="scale-range"
						bind:value={logoScale}
						aria-label={langStore.current === 'uk' ? 'Розмір логотипу' : 'Emblem scale'}
					/>
					<div class="scale-quick-chips">
						<button type="button" class="scale-chip" class:is-active={logoScale === 25} onclick={() => (logoScale = 25)}>25% (Міні)</button>
						<button type="button" class="scale-chip" class:is-active={logoScale === 38} onclick={() => (logoScale = 38)}>38% (Баланс)</button>
						<button type="button" class="scale-chip" class:is-active={logoScale === 55} onclick={() => (logoScale = 55)}>55% (Акцент)</button>
					</div>
				</div>
			</div>

			<!-- Shape / Badge options -->
			<div class="badge-option-bar">
				<span class="badge-opt-label">{langStore.current === 'uk' ? 'Форма підкладки:' : 'Emblem Badge:'}</span>
				<div class="pill-group">
					<button
						type="button"
						class="pill-btn"
						class:is-active={badgeShape === 'none'}
						onclick={() => (badgeShape = 'none')}
					>
						<span>{langStore.current === 'uk' ? 'Без плашки' : 'None'}</span>
					</button>
					<button
						type="button"
						class="pill-btn"
						class:is-active={badgeShape === 'circle'}
						onclick={() => (badgeShape = 'circle')}
					>
						<span>{langStore.current === 'uk' ? 'Кругла' : 'Circle'}</span>
					</button>
					<button
						type="button"
						class="pill-btn"
						class:is-active={badgeShape === 'square'}
						onclick={() => (badgeShape = 'square')}
					>
						<span>{langStore.current === 'uk' ? 'Квадрат' : 'Square'}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- RIGHT: DETAILED PALETTE ACCORDION / PANELS (QUESTION 3 - OPTION B) -->
		<div class="palette-column">
			<h3 class="palette-panel-title">
				{langStore.current === 'uk' ? 'Детальне налаштування кольорів' : 'Detailed Color Palette'}
			</h3>

			<!-- 1. Background Color -->
			<div class="color-section-box">
				<div class="color-header">
					<span class="color-target-name">{langStore.current === 'uk' ? '1. Колір тла шпалер' : '1. Wallpaper Background'}</span>
					<span class="current-hex-tag" style="background-color: {bgWallpaperColor};">{bgWallpaperColor}</span>
				</div>
				<div class="swatches-grid">
					{#each brandColors as c (c.hex)}
						<button
							type="button"
							class="swatch-btn"
							class:is-selected={bgWallpaperColor.toLowerCase() === c.hex.toLowerCase()}
							style="background-color: {c.hex};"
							onclick={() => (bgWallpaperColor = c.hex)}
							title="{c.name} ({c.hex})"
						>
							{#if bgWallpaperColor.toLowerCase() === c.hex.toLowerCase()}
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							{/if}
						</button>
					{/each}
					<label class="custom-color-picker-label" title={langStore.current === 'uk' ? 'Власний колір' : 'Custom Color'}>
						<input type="color" bind:value={bgWallpaperColor} class="native-color-input" />
						<span class="picker-icon">🎨</span>
					</label>
				</div>
			</div>

			<!-- 2. Optional Badge Background Color (if badgeShape !== 'none') -->
			{#if badgeShape !== 'none'}
				<div class="color-section-box">
					<div class="color-header">
						<span class="color-target-name">{langStore.current === 'uk' ? '2. Колір підкладки знака' : '2. Badge Background'}</span>
						<span class="current-hex-tag" style="background-color: {badgeBgColor};">{badgeBgColor}</span>
					</div>
					<div class="swatches-grid">
						{#each brandColors as c (c.hex)}
							<button
								type="button"
								class="swatch-btn"
								class:is-selected={badgeBgColor.toLowerCase() === c.hex.toLowerCase()}
								style="background-color: {c.hex};"
								onclick={() => (badgeBgColor = c.hex)}
								title="{c.name} ({c.hex})"
							>
								{#if badgeBgColor.toLowerCase() === c.hex.toLowerCase()}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
						<label class="custom-color-picker-label" title={langStore.current === 'uk' ? 'Власний колір' : 'Custom Color'}>
							<input type="color" bind:value={badgeBgColor} class="native-color-input" />
							<span class="picker-icon">🎨</span>
						</label>
					</div>
				</div>
			{/if}

			<!-- 3. If Hospital or Core Vet Crew Logo: Detailed Elements -->
			{#if symbolType === 'hospital' || symbolType === 'vetcrew'}
				<!-- Paw Toes -->
				<div class="color-section-box">
					<div class="color-header">
						<span class="color-target-name">{langStore.current === 'uk' ? 'Пальці лапи (4 елементи)' : 'Paw Toes (4 toes)'}</span>
						<span class="current-hex-tag" style="background-color: {pawToesColor};">{pawToesColor}</span>
					</div>
					<div class="swatches-grid">
						{#each brandColors as c (c.hex)}
							<button
								type="button"
								class="swatch-btn"
								class:is-selected={pawToesColor.toLowerCase() === c.hex.toLowerCase()}
								style="background-color: {c.hex};"
								onclick={() => (pawToesColor = c.hex)}
								title="{c.name} ({c.hex})"
							>
								{#if pawToesColor.toLowerCase() === c.hex.toLowerCase()}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
						<label class="custom-color-picker-label">
							<input type="color" bind:value={pawToesColor} class="native-color-input" />
							<span class="picker-icon">🎨</span>
						</label>
					</div>
				</div>

				<!-- Paw Pad -->
				<div class="color-section-box">
					<div class="color-header">
						<span class="color-target-name">{langStore.current === 'uk' ? 'Подушечка лапи' : 'Paw Center Pad'}</span>
						<span class="current-hex-tag" style="background-color: {pawPadColor};">{pawPadColor}</span>
					</div>
					<div class="swatches-grid">
						{#each brandColors as c (c.hex)}
							<button
								type="button"
								class="swatch-btn"
								class:is-selected={pawPadColor.toLowerCase() === c.hex.toLowerCase()}
								style="background-color: {c.hex};"
								onclick={() => (pawPadColor = c.hex)}
								title="{c.name} ({c.hex})"
							>
								{#if pawPadColor.toLowerCase() === c.hex.toLowerCase()}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
						<label class="custom-color-picker-label">
							<input type="color" bind:value={pawPadColor} class="native-color-input" />
							<span class="picker-icon">🎨</span>
						</label>
					</div>
				</div>

				<!-- Text VET CREW -->
				<div class="color-section-box">
					<div class="color-header">
						<span class="color-target-name">{langStore.current === 'uk' ? 'Напис «VET CREW»' : 'Text «VET CREW»'}</span>
						<span class="current-hex-tag" style="background-color: {vetCrewColor};">{vetCrewColor}</span>
					</div>
					<div class="swatches-grid">
						{#each brandColors as c (c.hex)}
							<button
								type="button"
								class="swatch-btn"
								class:is-selected={vetCrewColor.toLowerCase() === c.hex.toLowerCase()}
								style="background-color: {c.hex};"
								onclick={() => (vetCrewColor = c.hex)}
								title="{c.name} ({c.hex})"
							>
								{#if vetCrewColor.toLowerCase() === c.hex.toLowerCase()}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
						<label class="custom-color-picker-label">
							<input type="color" bind:value={vetCrewColor} class="native-color-input" />
							<span class="picker-icon">🎨</span>
						</label>
					</div>
				</div>

				<!-- Text HOSPITAL (if Hospital variant) -->
				{#if symbolType === 'hospital'}
					<div class="color-section-box">
						<div class="color-header">
							<span class="color-target-name">{langStore.current === 'uk' ? 'Напис «HOSPITAL»' : 'Text «HOSPITAL»'}</span>
							<span class="current-hex-tag" style="background-color: {hospitalColor};">{hospitalColor}</span>
						</div>
						<div class="swatches-grid">
							{#each brandColors as c (c.hex)}
								<button
									type="button"
									class="swatch-btn"
									class:is-selected={hospitalColor.toLowerCase() === c.hex.toLowerCase()}
									style="background-color: {c.hex};"
									onclick={() => (hospitalColor = c.hex)}
									title="{c.name} ({c.hex})"
								>
									{#if hospitalColor.toLowerCase() === c.hex.toLowerCase()}
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									{/if}
								</button>
							{/each}
							<label class="custom-color-picker-label">
								<input type="color" bind:value={hospitalColor} class="native-color-input" />
								<span class="picker-icon">🎨</span>
							</label>
						</div>
					</div>
				{/if}
			{:else if symbolType === 'butterfly'}
				<!-- Butterfly Color -->
				<div class="color-section-box">
					<div class="color-header">
						<span class="color-target-name">{langStore.current === 'uk' ? 'Колір метелика' : 'Butterfly Color'}</span>
						<span class="current-hex-tag" style="background-color: {butterflyColor};">{butterflyColor}</span>
					</div>
					<div class="swatches-grid">
						{#each brandColors as c (c.hex)}
							<button
								type="button"
								class="swatch-btn"
								class:is-selected={butterflyColor.toLowerCase() === c.hex.toLowerCase()}
								style="background-color: {c.hex};"
								onclick={() => (butterflyColor = c.hex)}
								title="{c.name} ({c.hex})"
							>
								{#if butterflyColor.toLowerCase() === c.hex.toLowerCase()}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
						<label class="custom-color-picker-label">
							<input type="color" bind:value={butterflyColor} class="native-color-input" />
							<span class="picker-icon">🎨</span>
						</label>
					</div>
				</div>
			{:else if symbolType === 'animal'}
				<!-- Animal Color -->
				<div class="color-section-box">
					<div class="color-header">
						<span class="color-target-name">{langStore.current === 'uk' ? `Колір тварини (${selectedAnimal.nameUk})` : `Animal Color (${selectedAnimal.nameEn})`}</span>
						<span class="current-hex-tag" style="background-color: {animalColor};">{animalColor}</span>
					</div>
					<div class="swatches-grid">
						{#each brandColors as c (c.hex)}
							<button
								type="button"
								class="swatch-btn"
								class:is-selected={animalColor.toLowerCase() === c.hex.toLowerCase()}
								style="background-color: {c.hex};"
								onclick={() => (animalColor = c.hex)}
								title="{c.name} ({c.hex})"
							>
								{#if animalColor.toLowerCase() === c.hex.toLowerCase()}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textColor} stroke-width="3.5">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								{/if}
							</button>
						{/each}
						<label class="custom-color-picker-label">
							<input type="color" bind:value={animalColor} class="native-color-input" />
							<span class="picker-icon">🎨</span>
						</label>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- 4. BOTTOM ACTION & DOWNLOAD BAR -->
	<div class="download-action-bar">
		<div class="file-summary">
			<div class="summary-icon">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
					<polyline points="7 10 12 15 17 10"/>
					<line x1="12" x2="12" y1="15" y2="3"/>
				</svg>
			</div>
			<div class="summary-meta">
				<span class="file-target-name">{currentFilename}</span>
				<span class="file-dimensions-tag">
					{currentDimensions.label} • {device === 'pc' ? '16:9 Desktop' : '9:16 Mobile'} • {resolution.toUpperCase()}
				</span>
			</div>
		</div>

		<div class="action-buttons">
			<button
				type="button"
				class="export-btn btn-secondary"
				onclick={downloadSvg}
				title={langStore.current === 'uk' ? 'Завантажити векторний файл SVG' : 'Download vector SVG file'}
			>
				<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
					<polyline points="14 2 14 8 20 8"/>
				</svg>
				<span>SVG (Вектор)</span>
			</button>

			<button
				type="button"
				class="export-btn btn-primary"
				disabled={isExporting}
				onclick={downloadPng}
			>
				{#if isExporting}
					<span class="spinner-dot"></span>
					<span>{langStore.current === 'uk' ? 'Генерація PNG...' : 'Rendering PNG...'}</span>
				{:else if exportSuccess}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
					<span>{langStore.current === 'uk' ? 'Завантажено!' : 'Downloaded!'}</span>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
						<polyline points="7 10 12 15 17 10"/>
						<line x1="12" x2="12" y1="15" y2="3"/>
					</svg>
					<span>{langStore.current === 'uk' ? `Завантажити PNG (${resolution.toUpperCase()})` : `Download PNG (${resolution.toUpperCase()})`}</span>
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.wallpaper-studio {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	/* STUDIO HEADER */
	.studio-header-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 1.25rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-label {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--fg-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.pill-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.wrap-pills {
		flex-wrap: wrap;
	}

	.pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.5rem 0.95rem;
		border-radius: 10px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg);
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.18s ease;
	}

	.pill-btn:hover {
		border-color: var(--brand-leaf);
		color: var(--brand-leaf);
		transform: translateY(-1px);
	}

	.pill-btn.is-active {
		background: var(--brand-leaf);
		border-color: var(--brand-leaf);
		color: #ffffff;
		box-shadow: 0 4px 12px rgba(89, 143, 58, 0.3);
	}

	.pill-btn.highlight-gold.is-active {
		background: #ffb327;
		border-color: #ffb327;
		color: #101e14;
		box-shadow: 0 4px 12px rgba(255, 179, 39, 0.35);
	}

	.pill-sub {
		font-size: 0.72rem;
		opacity: 0.85;
		margin-left: 2px;
	}

	/* ANIMAL PICKER PANEL */
	.animal-picker-panel {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1rem;
		margin-top: 0.25rem;
	}

	.animal-filter-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cat-pills {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.cat-chip {
		padding: 0.3rem 0.65rem;
		border-radius: 8px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.cat-chip:hover,
	.cat-chip.is-active {
		background: var(--brand-leaf);
		border-color: var(--brand-leaf);
		color: #ffffff;
	}

	.animal-search-input {
		padding: 0.35rem 0.75rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		color: var(--fg);
		font-size: 0.82rem;
		width: 180px;
	}

	.animal-chips-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 0.45rem;
		max-height: 180px;
		overflow-y: auto;
		padding-right: 4px;
	}

	.animal-chip-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.6rem;
		border-radius: 8px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		color: var(--fg);
		font-size: 0.78rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
	}

	.animal-chip-btn:hover {
		border-color: var(--brand-leaf);
		color: var(--brand-leaf);
	}

	.animal-chip-btn.is-selected {
		background: rgba(89, 143, 58, 0.15);
		border-color: var(--brand-leaf);
		color: var(--brand-leaf);
		font-weight: 700;
	}

	.chip-num {
		font-size: 0.7rem;
		opacity: 0.6;
		font-family: monospace;
	}

	/* PRESETS BAR */
	.presets-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.75rem 1rem;
	}

	.presets-title {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--fg-secondary);
		white-space: nowrap;
	}

	.presets-scroll {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		flex: 1 1 auto;
	}

	.role-preset-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.8rem;
		border-radius: 9px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg);
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.role-preset-btn:hover {
		border-color: var(--brand-gold);
		transform: translateY(-1px);
	}

	.preset-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid;
		display: inline-block;
	}

	/* WORKSPACE GRID */
	.workspace-grid {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 1.5rem;
		align-items: start;
	}

	/* PREVIEW COLUMN */
	.preview-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preview-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--checker-bg, #0d1710);
		border: 1px solid var(--border);
		border-radius: 18px;
		padding: 2rem;
		min-height: 440px;
		position: relative;
		overflow: hidden;
	}

	/* DEVICE BEZEL */
	.device-bezel {
		position: relative;
		background: #181c19;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.device-bezel.is-pc {
		width: 100%;
		max-width: 580px;
		border-radius: 12px;
		padding: 8px 8px 12px 8px;
	}

	.pc-topbar {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 10px;
	}

	.pc-cam {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #333d36;
	}

	.pc-stand-hint {
		width: 120px;
		height: 10px;
		background: linear-gradient(180deg, #2a332c 0%, #151a16 100%);
		align-self: center;
		margin-top: 4px;
		border-radius: 0 0 6px 6px;
	}

	.device-bezel.is-phone {
		width: 250px;
		border-radius: 36px;
		padding: 10px;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px #2d3830;
	}

	.phone-dynamic-island {
		position: absolute;
		top: 14px;
		left: 50%;
		transform: translateX(-50%);
		width: 65px;
		height: 16px;
		background: #000000;
		border-radius: 10px;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 8px;
	}

	.phone-camera {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #112217;
	}

	.screen-canvas {
		width: 100%;
		overflow: hidden;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.device-bezel.is-phone .screen-canvas {
		border-radius: 28px;
	}

	.screen-canvas :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	/* SCALE BAR */
	.scale-bar {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.9rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.scale-label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.scale-title {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--fg);
	}

	.scale-val-badge {
		background: var(--panel-bg);
		border: 1px solid var(--border);
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--brand-leaf);
	}

	.scale-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.scale-range {
		flex: 1;
		accent-color: var(--brand-leaf);
		cursor: pointer;
	}

	.scale-quick-chips {
		display: flex;
		gap: 0.35rem;
	}

	.scale-chip {
		padding: 0.25rem 0.55rem;
		border-radius: 6px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg-secondary);
		font-size: 0.72rem;
		font-weight: 600;
		cursor: pointer;
	}

	.scale-chip:hover,
	.scale-chip.is-active {
		background: var(--brand-leaf);
		border-color: var(--brand-leaf);
		color: #ffffff;
	}

	.badge-option-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0.75rem 1.1rem;
	}

	.badge-opt-label {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--fg-secondary);
	}

	/* PALETTE COLUMN */
	.palette-column {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 1.25rem;
	}

	.palette-panel-title {
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--fg);
		margin: 0 0 0.35rem 0;
	}

	.color-section-box {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.65rem 0.85rem;
	}

	.color-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.color-target-name {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--fg);
	}

	.current-hex-tag {
		font-size: 0.7rem;
		font-weight: 800;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		color: #ffffff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
		font-family: monospace;
	}

	.swatches-grid {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.swatch-btn {
		width: 26px;
		height: 26px;
		border-radius: 6px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.12s ease;
		padding: 0;
	}

	.swatch-btn:hover {
		transform: scale(1.15);
	}

	.swatch-btn.is-selected {
		box-shadow: 0 0 0 2px var(--brand-gold);
		transform: scale(1.1);
	}

	.custom-color-picker-label {
		position: relative;
		width: 26px;
		height: 26px;
		border-radius: 6px;
		border: 1px dashed var(--border-hover);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 0.8rem;
	}

	.native-color-input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	/* DOWNLOAD ACTION BAR */
	.download-action-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 1rem 1.25rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.file-summary {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.summary-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--brand-leaf);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.summary-meta {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.file-target-name {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--fg);
		font-family: monospace;
	}

	.file-dimensions-tag {
		font-size: 0.75rem;
		color: var(--fg-secondary);
	}

	.action-buttons {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	.export-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.65rem 1.2rem;
		border-radius: 10px;
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.18s ease;
	}

	.btn-secondary {
		background: var(--panel-bg);
		border: 1px solid var(--border);
		color: var(--fg);
	}

	.btn-secondary:hover {
		border-color: var(--brand-leaf);
		color: var(--brand-leaf);
	}

	.btn-primary {
		background: var(--brand-leaf);
		border: 1px solid var(--brand-leaf);
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(89, 143, 58, 0.35);
	}

	.btn-primary:hover:not(:disabled) {
		background: #4b7b31;
		transform: translateY(-1px);
		box-shadow: 0 6px 18px rgba(89, 143, 58, 0.45);
	}

	.btn-primary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner-dot {
		width: 14px;
		height: 14px;
		border: 2px solid #ffffff;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* RESPONSIVE */
	@media (max-width: 960px) {
		.workspace-grid {
			grid-template-columns: 1fr;
		}

		.download-action-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.action-buttons {
			flex-direction: column;
		}

		.export-btn {
			justify-content: center;
			width: 100%;
		}
	}

	@media (max-width: 640px) {
		.presets-bar {
			align-items: flex-start;
		}

		.presets-title {
			width: 100%;
			margin-bottom: 0.15rem;
		}
	}
</style>

