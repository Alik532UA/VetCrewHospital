import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { COMPOSITE_PLAQUES, TEXT_PLAQUES, ICON_PLAQUES, SIGNAGE_BRAND_COLORS } from './doorSignage';

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

		// PNG resolution dropdown: 480p, 720p, 1080p, 1440p, 2160p
		expect(code).toContain('PNG_RESOLUTIONS');
		expect(code).toContain("'480p'");
		expect(code).toContain("'720p'");
		expect(code).toContain("'1080p'");
		expect(code).toContain("'1440p'");
		expect(code).toContain("'2160p'");
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
});
