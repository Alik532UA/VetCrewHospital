import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { COMPOSITE_PLAQUES, TEXT_PLAQUES, ICON_PLAQUES, SIGNAGE_BRAND_COLORS } from './doorSignage';
import { PNG_RESOLUTIONS } from './pngResolutions';
import {
	STELE_DEPARTMENTS,
	STELE_COLOR_PRESETS,
	getSteleOuterPath,
	getSteleInnerPath,
	generateSteleSvg,
	formatSteleTitle,
	ORACAL_641_PALETTE,
	STELE_ORACAL_PRESETS,
	getOracalColorByCode,
	serializeSteleConfig,
	parseSteleConfig,
	generateSteleShareText,
	generateSteleShareUrl,
	type SteleConfig
} from './directorySteleData';

describe('Door Signage & Navigation Elements Integrity', () => {
	it('defines consistent department plaques across formats', () => {
		expect(COMPOSITE_PLAQUES.length).toBeGreaterThanOrEqual(7);
		expect(TEXT_PLAQUES.length).toBeGreaterThanOrEqual(7);
		expect(ICON_PLAQUES.length).toBeGreaterThanOrEqual(8);
	});

	it('provides valid brand colors for door signage including black 000000', () => {
		expect(SIGNAGE_BRAND_COLORS.length).toBeGreaterThanOrEqual(7);
		const black = SIGNAGE_BRAND_COLORS.find((c) => c.hex === '#000000');
		expect(black).toBeDefined();
		expect(black?.name).toBe('Black');
		expect(black?.textColor).toBe('#ffffff');

		for (const color of SIGNAGE_BRAND_COLORS) {
			expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
			expect(color.name.trim()).not.toBe('');
		}
	});

	it('ensures navigation arrow master asset exists in static directory', () => {
		const arrowPath = path.resolve('static/brand/signage/arrow-right.svg');
		expect(fs.existsSync(arrowPath)).toBe(true);

		const content = fs.readFileSync(arrowPath, 'utf8');
		expect(content).toContain('viewBox="0 0 24 24"');
		expect(content).toContain('M6 12H18M18 12L13 7M18 12L13 17');
	});

	it('correctly transforms arrow SVG with dynamic color and rotation', () => {
		const arrowPath = path.resolve('static/brand/signage/arrow-right.svg');
		let svg = fs.readFileSync(arrowPath, 'utf8');

		const testColor = '#FFB327';
		svg = svg
			.replace(/fill:\s*#[0-9a-fA-F]{6}/gi, `fill: ${testColor}`)
			.replace(/fill="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `fill="${testColor}"`)
			.replace(/stroke:\s*#[0-9a-fA-F]{6}/gi, `stroke: ${testColor}`)
			.replace(/stroke="(?!(?:none))#[0-9a-fA-F]{6}"/gi, `stroke="${testColor}"`);

		expect(svg).toContain(`stroke="${testColor}"`);

		// Test rotation transform injection
		const angle = 90;
		const rotatedSvg = svg.replace(/<path\s+/i, `<path transform="rotate(${angle} 12 12)" `);
		expect(rotatedSvg).toContain('transform="rotate(90 12 12)"');
	});

	it('verifies DoorSignage removes redundant duplicate toolbars and binds color via runes', () => {
		const componentPath = path.resolve('src/lib/components/brand/DoorSignage.svelte');
		const code = fs.readFileSync(componentPath, 'utf8');

		// No redundant color toolbars or floating hacks
		expect(code).not.toContain('nav-arrow-toolbar');
		expect(code).not.toContain('floating-palette-bar');
		expect(code).not.toContain('SVG / PNG');

		// Arrow direction selector is integrated cleanly with 8 directions + custom angle
		expect(code).toContain('direction-pills-wrap');
		expect(code).toContain('ARROW_DIRECTIONS');
		expect(code).toContain('arrowAngle');
		expect(code).toContain('angle-slider');
		expect(code).toContain('angle-num-input');
		expect(code).toContain('$bindable');

		// Centered action buttons in card footer and arrow card
		expect(code).toContain('justify-content: center');
		expect(code).toContain('sign-card-footer');
		expect(code).toContain('arrow-actions');

		// PNG resolution dropdown: 480p, 720p, 1080p, 1440p, 2160p via PNG_RESOLUTIONS
		expect(code).toContain('PNG_RESOLUTIONS');
		expect(code).toContain('currentResId');
		expect(code).toContain('png-menu-dropdown');
	});

	it('verifies BrandColorNav component structure, multi-section support and sticky dock behavior', () => {
		const navPath = path.resolve('src/lib/components/brand/BrandColorNav.svelte');
		expect(fs.existsSync(navPath)).toBe(true);

		const code = fs.readFileSync(navPath, 'utf8');
		expect(code).toContain('brand-color-nav');
		expect(code).toContain('color-nav-list');
		expect(code).toContain('custom-picker-btn');
		expect(code).toContain('position: sticky');
		expect(code).toContain('is-visible');

		// Separates primary colors and monochromatic white/black with a divider
		expect(code).toContain('primaryColors');
		expect(code).toContain('monoColors');
		expect(code).toContain('#FFFFFF');
		expect(code).toContain('#000000');
		expect(code).toContain('is-white-btn');
		expect(code).toContain('is-black-btn');

		// Covers all 4 color customization sections
		expect(code).toContain('logo-studio');
		expect(code).toContain('slogan');
		expect(code).toContain('animals');
		expect(code).toContain('door-signs');
	});

	it('verifies Brandbook page implements balanced 3-column layout and brand palette excludes black', () => {
		const pagePath = path.resolve('src/routes/brandbook/+page.svelte');
		const code = fs.readFileSync(pagePath, 'utf8');

		expect(code).toContain('BrandColorNav');
		expect(code).toContain('grid-template-columns: 64px minmax(0, 1fr) 64px');
		expect(code).toContain('activeSection');
		expect(code).toContain('bind:customSelectedColor={activeSignColor}');
		expect(code).toContain('externalColor={activeLogoColor}');
		expect(code).toContain('onElementChange');
		expect(code).toContain('bind:butterflyColor={activeButterflyColor}');
		expect(code).toContain('bind:customSelectedColor={activeAnimalColor}');

		// Section 01 brand palette: Black 000000 must NOT be in the official colors array
		expect(code).not.toMatch(/name:\s*'Black',\s*textColor:\s*'#ffffff',\s*rgb:\s*'0, 0, 0'/);
	});

	it('verifies PngDownloadBtn component and unified PNG resolution dropdown across brandbook', () => {
		expect(PNG_RESOLUTIONS.map((r) => r.id)).toEqual(['480p', '720p', '1080p', '1440p', '2160p']);

		const btnPath = path.resolve('src/lib/components/brand/PngDownloadBtn.svelte');
		expect(fs.existsSync(btnPath)).toBe(true);

		const btnCode = fs.readFileSync(btnPath, 'utf8');
		// Opaque solid background (not transparent)
		expect(btnCode).toContain('background: #ffffff');
		expect(btnCode).toContain('background: #18221b');
		// Anchor arrow seamlessly connecting to trigger button
		expect(btnCode).toContain('.png-menu-dropdown::before');
		expect(btnCode).toContain('.png-menu-dropdown::after');
		expect(btnCode).toContain('border-top-color');

		// DoorSignage dropdown is solid and connected
		const doorCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/DoorSignage.svelte'),
			'utf8'
		);
		expect(doorCode).toContain('background: #ffffff');
		expect(doorCode).toContain('background: #18221b');
		expect(doorCode).toContain('.png-menu-dropdown::before');
		expect(doorCode).toContain('.png-menu-dropdown::after');

		// Verifies other brandbook sections integrate PngDownloadBtn
		const logoCode = fs.readFileSync(
			path.resolve('src/lib/components/LogoCustomizer.svelte'),
			'utf8'
		);
		expect(logoCode).toContain('PngDownloadBtn');

		const sloganCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/BrandSlogan.svelte'),
			'utf8'
		);
		expect(sloganCode).toContain('PngDownloadBtn');

		const animalCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/AnimalGallery.svelte'),
			'utf8'
		);
		expect(animalCode).toContain('PngDownloadBtn');
		expect(animalCode).toContain('size="compact"');
		expect(animalCode).toContain('.animal-card:has(.png-dropdown-wrap.is-open)');

		const qrCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/QrShowcase.svelte'),
			'utf8'
		);
		expect(qrCode).toContain('PngDownloadBtn');

		const photoCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/PhotoLogos.svelte'),
			'utf8'
		);
		expect(photoCode).toContain('PngDownloadBtn');

		const pageCode = fs.readFileSync(path.resolve('src/routes/brandbook/+page.svelte'), 'utf8');
		expect(pageCode).toContain('PngDownloadBtn');
	});

	it('validates Directory Wayfinding Stele data, geometry, and SVG generator integrity', () => {
		// 7 core departments in exact order from the reference mockup
		expect(STELE_DEPARTMENTS).toHaveLength(7);
		expect(STELE_DEPARTMENTS[0]?.id).toBe('reception');
		expect(STELE_DEPARTMENTS[0]?.titleUk).toBe('РЕЦЕПЦІЯ');
		expect(STELE_DEPARTMENTS[1]?.id).toBe('pet-shop');
		expect(STELE_DEPARTMENTS[1]?.titleUk).toBe('ЗООМАГАЗИН');
		expect(STELE_DEPARTMENTS[2]?.id).toBe('consultation');
		expect(STELE_DEPARTMENTS[2]?.titleUk).toBe('ОГЛЯДОВА');
		expect(STELE_DEPARTMENTS[2]?.twoLines).toBe(false);
		expect(STELE_DEPARTMENTS[3]?.id).toBe('procedures');
		expect(STELE_DEPARTMENTS[3]?.titleUk).toBe('ПРОЦЕДУРНА');
		expect(STELE_DEPARTMENTS[4]?.id).toBe('surgery');
		expect(STELE_DEPARTMENTS[4]?.titleUk).toBe('ОПЕРАЦІЙНА');
		expect(STELE_DEPARTMENTS[5]?.id).toBe('hospital');
		expect(STELE_DEPARTMENTS[5]?.titleUk).toBe('СТАЦІОНАР');
		expect(STELE_DEPARTMENTS[6]?.id).toBe('laboratory');
		expect(STELE_DEPARTMENTS[6]?.titleUk).toBe('ЛАБОРАТОРІЯ');

		for (const dep of STELE_DEPARTMENTS) {
			expect(dep.paths.length).toBeGreaterThan(0);
			for (const p of dep.paths) {
				expect(p.length).toBeGreaterThan(20);
			}
		}

		// Text case formatting helper
		expect(formatSteleTitle('ОГЛЯДОВА', 'titlecase')).toBe('Оглядова');
		expect(formatSteleTitle('ОГЛЯДОВА', 'uppercase')).toBe('ОГЛЯДОВА');
		expect(formatSteleTitle('РЕЦЕПЦІЯ', 'titlecase')).toBe('Рецепція');

		// Asymmetric slanted top outer contour
		const outer420 = getSteleOuterPath(420, 800, 22);
		expect(outer420).toContain('M 22 40'); // slantY for 420mm ~ 40
		expect(outer420).toContain('L 398 0');
		expect(outer420).toContain('L 420 778');
		expect(outer420).toContain('L 22 800');
		expect(outer420).toContain('L 0 62');

		const inner420 = getSteleInnerPath(420, 800, 10, 22);
		expect(inner420).toContain('M 22 50');

		// Inner border path with thickness compensation strictly stays inside [0, width] x [0, height]
		const innerFlush = getSteleInnerPath(420, 800, 0, 22, 7);
		expect(innerFlush).toContain('M 22 43.5'); // totalOffset = 3.5, slantY = 40 -> 43.5
		expect(innerFlush).not.toContain('-'); // No negative coordinates anywhere

		// Generator creates valid vector SVG with configurable thick outer border and title case
		const svg = generateSteleSvg({
			width: 420,
			height: 800,
			iconSize: 44,
			fontSize: 22,
			dividerThickness: 2.5,
			dividerInset: 24,
			sidePadding: 22,
			verticalPadding: 14,
			arrowAngle: 0,
			bgColor: '#4E812D',
			fgColor: '#13371B',
			borderColor: '#13371B',
			borderThickness: 7,
			textCase: 'titlecase'
		});

		expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
		expect(svg).toContain('viewBox="0 0 420 800"');
		expect(svg).toContain('width="420mm"');
		expect(svg).toContain('height="800mm"');
		expect(svg).toContain('stroke-width="7"');
		expect(svg).toContain('Рецепція');
		expect(svg).toContain('Оглядова');
		expect(svg).toContain('Лабораторія');

		// Color presets and dedicated ORACAL 641 palette
		expect(STELE_COLOR_PRESETS.length).toBeGreaterThanOrEqual(4);
		const classic = STELE_COLOR_PRESETS.find((p) => p.id === 'classic-green');
		expect(classic).toBeDefined();
		expect(classic?.bg).toBe('#00783F'); // 068M Grass green
		expect(classic?.fg).toBe('#003C24'); // 060M Dark green

		// ORACAL 641 Economy Cal (Matt) Fixed Palette
		expect(ORACAL_641_PALETTE.length).toBe(59);
		const grassGreen = getOracalColorByCode('068M');
		expect(grassGreen).toBeDefined();
		expect(grassGreen?.hex).toBe('#00783F');
		expect(grassGreen?.nameEn).toBe('Grass green');
		expect(grassGreen?.nameUk).toBe("Трав'яний зелений");

		const darkGreen = getOracalColorByCode('060M');
		expect(darkGreen).toBeDefined();
		expect(darkGreen?.hex).toBe('#003C24');

		const white = getOracalColorByCode('010M');
		expect(white).toBeDefined();
		expect(white?.hex).toBe('#E7EAEE');

		const gold = getOracalColorByCode('091M');
		expect(gold).toBeDefined();
		expect(gold?.hex).toBe('#796532');

		expect(STELE_ORACAL_PRESETS.length).toBeGreaterThanOrEqual(6);
	});

	it('verifies DirectoryStele component structure and integration in DoorSignage', () => {
		const steleComponentPath = path.resolve('src/lib/components/brand/DirectoryStele.svelte');
		expect(fs.existsSync(steleComponentPath)).toBe(true);

		const steleCode = fs.readFileSync(steleComponentPath, 'utf8');

		// Svelte 5 Runes state controls
		expect(steleCode).toContain('$state');
		expect(steleCode).toContain('$derived');
		expect(steleCode).toContain('$props');

		// 420 & 600 mm preset buttons
		expect(steleCode).toContain('420 × 800 мм');
		expect(steleCode).toContain('600 × 800 мм');
		expect(steleCode).toContain('width = 420');
		expect(steleCode).toContain('width = 600');

		// Sliders: width (350-750), icon size, font size, divider thickness & inset
		expect(steleCode).toContain('min="350"');
		expect(steleCode).toContain('max="750"');
		expect(steleCode).toContain('isSizeLinked');
		expect(steleCode).toContain('onIconSizeChange');
		expect(steleCode).toContain('onFontSizeChange');
		expect(steleCode).toContain('dividerThickness');
		expect(steleCode).toContain('dividerInset');

		// Text case toggle (UPPERCASE vs Titlecase)
		expect(steleCode).toContain('textCase');
		expect(steleCode).toContain('case-toggle-group');

		// Configurable outer border thickness and offset, with overflow protection
		expect(steleCode).toContain('borderThickness');
		expect(steleCode).toContain('borderOffset');
		expect(steleCode).toContain('border-preset-pills');
		expect(steleCode).toContain('overflow: visible');

		// Dedicated Oracal 641 Economy Cal palette controls
		expect(steleCode).toContain('ORACAL_641_PALETTE');
		expect(steleCode).toContain('STELE_ORACAL_PRESETS');
		expect(steleCode).toContain('oracal-card');
		expect(steleCode).toContain('copyOracalSpec');

		// Arrow direction selector & color inversion
		expect(steleCode).toContain('ARROW_SHORTCUTS');
		expect(steleCode).toContain('invertColors');

		// SVG & PNG downloads
		expect(steleCode).toContain('downloadSvg');
		expect(steleCode).toContain('downloadPng');
		expect(steleCode).toContain('PNG_RESOLUTIONS');

		// Integrated into DoorSignage
		const doorSignCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/DoorSignage.svelte'),
			'utf8'
		);
		expect(doorSignCode).toContain('DirectoryStele');
		expect(doorSignCode).toContain('<DirectoryStele');
	});

	it('supports full roundtrip serialization, URL generation, hybrid text, and validation', () => {
		const config: SteleConfig = {
			width: 480,
			height: 800,
			iconSize: 48,
			fontSize: 26,
			dividerThickness: 3.5,
			dividerInset: 20,
			sidePadding: 24,
			verticalPadding: 16,
			arrowAngle: 45,
			bgColor: '#00783F',
			fgColor: '#003C24',
			borderColor: '#003C24',
			borderThickness: 9,
			borderOffset: 5,
			textCase: 'titlecase',
			bgOracalCode: '068M',
			fgOracalCode: '060M',
			borderOracalCode: '060M'
		};

		// Serialization produces VCH1 token
		const token = serializeSteleConfig(config, true);
		expect(token.startsWith('VCH1:')).toBe(true);

		// Hybrid text contains friendly summary and the token
		const shareText = generateSteleShareText(config, token);
		expect(shareText).toContain('Макет стели Vet Crew Hospital (480 × 800 мм)');
		expect(shareText).toContain('068M');
		expect(shareText).toContain('060M');
		expect(shareText).toContain(token);

		// Share URL contains the token in query parameter
		const shareUrl = generateSteleShareUrl(token, 'https://vet-crew-hospital.org/brandbook');
		expect(shareUrl).toContain('stele=' + encodeURIComponent(token));

		// Parsing raw token
		const parseDirect = parseSteleConfig(token);
		expect(parseDirect.success).toBe(true);
		if (parseDirect.success) {
			expect(parseDirect.data.width).toBe(480);
			expect(parseDirect.data.iconSize).toBe(48);
			expect(parseDirect.data.fontSize).toBe(26);
			expect(parseDirect.data.dividerThickness).toBe(3.5);
			expect(parseDirect.data.dividerInset).toBe(20);
			expect(parseDirect.data.borderThickness).toBe(9);
			expect(parseDirect.data.borderOffset).toBe(5);
			expect(parseDirect.data.textCase).toBe('titlecase');
			expect(parseDirect.data.bgOracalCode).toBe('068M');
			expect(parseDirect.data.fgOracalCode).toBe('060M');
			expect(parseDirect.data.borderOracalCode).toBe('060M');
			expect(parseDirect.data.isBorderLinked).toBe(true);
		}

		// Parsing hybrid chat text
		const messyChat = `Привіт! Ось мої параметри для стели:
		${shareText}
		Чи можна замовити виготовлення?`;
		const parseChat = parseSteleConfig(messyChat);
		expect(parseChat.success).toBe(true);
		if (parseChat.success) {
			expect(parseChat.data.width).toBe(480);
			expect(parseChat.data.bgOracalCode).toBe('068M');
		}

		// Parsing direct URL
		const parseUrl = parseSteleConfig(shareUrl);
		expect(parseUrl.success).toBe(true);

		// Validation: Rejects invalid or out-of-range payloads
		const invalidWidth = parseSteleConfig(
			'VCH1:' + Buffer.from(JSON.stringify({ w: 9999 })).toString('base64')
		);
		expect(invalidWidth.success).toBe(false);

		const invalidColor = parseSteleConfig(
			'VCH1:' + Buffer.from(JSON.stringify({ w: 420, bg: '999NONEXISTENT' })).toString('base64')
		);
		expect(invalidColor.success).toBe(false);

		const garbage = parseSteleConfig('Just some random text without code');
		expect(garbage.success).toBe(false);
	});

	it('verifies DirectoryStele UI features: sticky preview, copy config, share link, and modal import', () => {
		const steleCode = fs.readFileSync(
			path.resolve('src/lib/components/brand/DirectoryStele.svelte'),
			'utf8'
		);

		// Sticky preview keeps stage in view while scrolling controls
		expect(steleCode).toContain('.stele-stage-column');
		expect(steleCode).toContain('position: sticky');
		expect(steleCode).toContain('top: 1.5rem');
		expect(steleCode).toContain('align-self: start');

		// Action buttons in top header
		expect(steleCode).toContain('copy-config-btn');
		expect(steleCode).toContain('share-link-btn');
		expect(steleCode).toContain('import-btn');
		expect(steleCode).toContain('copyShareConfig');
		expect(steleCode).toContain('copyShareUrl');
		expect(steleCode).toContain('openImportModal');

		// Import modal dialog with textarea, paste button, and validation
		expect(steleCode).toContain('stele-modal-dialog');
		expect(steleCode).toContain('modal-textarea');
		expect(steleCode).toContain('pasteFromClipboard');
		expect(steleCode).toContain('applyImportedConfig');
		expect(steleCode).toContain('modal-alert--error');
		expect(steleCode).toContain('modal-alert--success');
	});
});
