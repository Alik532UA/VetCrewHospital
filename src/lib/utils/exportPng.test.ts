import { describe, expect, it } from 'vitest';
import {
	getStageBgColor,
	injectSvgBackground,
	STAGE_BG_COLORS
} from './exportPng';

describe('exportPng utility', () => {
	it('повертає коректні кольори для тем сцени та undefined для сітки/прозорого', () => {
		expect(getStageBgColor('checker')).toBeUndefined();
		expect(getStageBgColor(undefined)).toBeUndefined();
		expect(getStageBgColor('light')).toBe('#ffffff');
		expect(getStageBgColor('emerald')).toBe('#13371b');
		expect(getStageBgColor('dark')).toBe('#141716');
		expect(getStageBgColor('white')).toBe('#ffffff');
		expect(getStageBgColor('yellow')).toBe('#e8a700');
	});

	it('не модифікує SVG, якщо фон не задано або прозорий', () => {
		const svg = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>';
		expect(injectSvgBackground(svg, undefined)).toBe(svg);
		expect(injectSvgBackground(svg, 'transparent')).toBe(svg);
	});

	it('вставляє rect з точними координатами viewBox', () => {
		const svg = '<svg viewBox="0 0 970.62 970.62"><circle cx="485" cy="485" r="400"/></svg>';
		const result = injectSvgBackground(svg, '#13371b');
		expect(result).toContain('<rect id="stage-bg" x="0" y="0" width="970.62" height="970.62" fill="#13371b"/>');
		expect(result.indexOf('<rect id="stage-bg"')).toBeGreaterThan(result.indexOf('<svg'));
		expect(result.indexOf('<rect id="stage-bg"')).toBeLessThan(result.indexOf('<circle'));
	});

	it('вставляє rect з відносними розмірами 100%, якщо viewBox відсутній', () => {
		const svg = '<svg width="200" height="200"><path d="M0 0h10v10H0z"/></svg>';
		const result = injectSvgBackground(svg, '#ffffff');
		expect(result).toContain('<rect id="stage-bg" width="100%" height="100%" fill="#ffffff"/>');
	});

	it('оновлює колір існуючого stage-bg rect замість дублювання', () => {
		const svg = '<svg viewBox="0 0 50 50"><rect id="stage-bg" x="0" y="0" width="50" height="50" fill="#ffffff"/><path d="M0 0"/></svg>';
		const result = injectSvgBackground(svg, '#141716');
		expect(result).toContain('fill="#141716"');
		expect(result).not.toContain('fill="#ffffff"');
		expect(result.match(/id="stage-bg"/g)?.length).toBe(1);
	});
});
