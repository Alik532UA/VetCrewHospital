import { browser } from '$app/environment';

/**
 * Stage Theme background hex colors matching StageBgSwitcher and app.css
 */
export const STAGE_BG_COLORS: Record<string, string | undefined> = {
	checker: undefined,
	light: '#ffffff',
	emerald: '#13371b',
	dark: '#141716',
	white: '#ffffff',
	grey: '#e5e7eb',
	grass: '#00783f',
	forest: '#005236',
	yellow: '#e8a700',
	gold: '#796532',
	black: '#060607'
};

/**
 * Returns the hex background color for a given stage theme, or undefined for checker/transparent.
 */
export function getStageBgColor(theme: string | undefined): string | undefined {
	if (!theme || theme === 'checker') return undefined;
	return STAGE_BG_COLORS[theme] ?? undefined;
}

/**
 * Injects a background rect into the SVG so that the background is saved when exported.
 */
export function injectSvgBackground(svgText: string, bgColor: string | undefined): string {
	if (!bgColor || bgColor === 'transparent') return svgText;

	if (svgText.includes('id="stage-bg"')) {
		return svgText.replace(/<rect id="stage-bg"[^>]*\/>/i, (match) =>
			match.replace(/fill="[^"]*"/i, `fill="${bgColor}"`)
		);
	}

	const viewBoxMatch = svgText.match(
		/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i
	);

	let rectTag: string;
	if (
		viewBoxMatch &&
		viewBoxMatch[1] !== undefined &&
		viewBoxMatch[2] !== undefined &&
		viewBoxMatch[3] !== undefined &&
		viewBoxMatch[4] !== undefined
	) {
		const minX = viewBoxMatch[1];
		const minY = viewBoxMatch[2];
		const vbW = viewBoxMatch[3];
		const vbH = viewBoxMatch[4];
		rectTag = `<rect id="stage-bg" x="${minX}" y="${minY}" width="${vbW}" height="${vbH}" fill="${bgColor}"/>`;
	} else {
		rectTag = `<rect id="stage-bg" width="100%" height="100%" fill="${bgColor}"/>`;
	}

	const svgOpenTagMatch = svgText.match(/<svg\b[^>]*>/i);
	if (!svgOpenTagMatch || svgOpenTagMatch.index === undefined) {
		return svgText;
	}

	const insertPos = svgOpenTagMatch.index + svgOpenTagMatch[0].length;
	return svgText.slice(0, insertPos) + '\n  ' + rectTag + svgText.slice(insertPos);
}

/**
 * Triggers download of an SVG string as a file, optionally injecting background color.
 */
export function downloadSvgText(svgText: string, filename: string, bgColor?: string): void {
	if (!browser) return;
	const prepared = bgColor ? injectSvgBackground(svgText, bgColor) : svgText;
	const blob = new Blob([prepared], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Fetches an SVG from URL, optionally recolors and injects background, then downloads it.
 */
export async function downloadSvgUrl(
	url: string,
	filename: string,
	bgColor?: string,
	recolorFn?: (svgText: string) => string
): Promise<void> {
	if (!browser) return;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.statusText}`);
	let svgText = await res.text();
	if (recolorFn) {
		svgText = recolorFn(svgText);
	}
	downloadSvgText(svgText, filename, bgColor);
}

/**
 * Utility to convert SVG code or SVG files into crisp, high-resolution PNG images in the browser.
 */
export async function downloadSvgAsPng(
	svgText: string,
	filename: string,
	maxDimension: number = 2000,
	bgColor?: string
): Promise<void> {
	if (!browser) return;

	let preparedSvg = bgColor ? injectSvgBackground(svgText, bgColor) : svgText;

	// 1. Determine aspect ratio from viewBox or width/height
	let width = maxDimension;
	let height = maxDimension;

	const viewBoxMatch = preparedSvg.match(
		/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i
	);
	if (viewBoxMatch && viewBoxMatch[3] !== undefined && viewBoxMatch[4] !== undefined) {
		const vbW = parseFloat(viewBoxMatch[3]);
		const vbH = parseFloat(viewBoxMatch[4]);
		if (vbW > 0 && vbH > 0) {
			const aspect = vbW / vbH;
			if (aspect >= 1) {
				width = maxDimension;
				height = Math.round(maxDimension / aspect);
			} else {
				height = maxDimension;
				width = Math.round(maxDimension * aspect);
			}
		}
	} else {
		const widthMatch = preparedSvg.match(/width=["']\s*([-\d.]+)(?:px)?\s*["']/i);
		const heightMatch = preparedSvg.match(/height=["']\s*([-\d.]+)(?:px)?\s*["']/i);
		if (widthMatch && heightMatch && widthMatch[1] !== undefined && heightMatch[1] !== undefined) {
			const w = parseFloat(widthMatch[1]);
			const h = parseFloat(heightMatch[1]);
			if (w > 0 && h > 0) {
				const aspect = w / h;
				if (aspect >= 1) {
					width = maxDimension;
					height = Math.round(maxDimension / aspect);
				} else {
					height = maxDimension;
					width = Math.round(maxDimension * aspect);
				}
			}
		}
	}

	// 2. Ensure SVG root has explicit pixel dimensions matching output size
	if (/width=["'][^"']*["']/i.test(preparedSvg) && /height=["'][^"']*["']/i.test(preparedSvg)) {
		preparedSvg = preparedSvg
			.replace(/width=["'][^"']*["']/i, `width="${width}"`)
			.replace(/height=["'][^"']*["']/i, `height="${height}"`);
	} else {
		preparedSvg = preparedSvg.replace(/<svg\b/i, `<svg width="${width}" height="${height}" `);
	}

	// 3. Create blob URL and load into Image
	const svgBlob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
	const blobUrl = URL.createObjectURL(svgBlob);

	try {
		const img = new Image();
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error('Failed to load SVG for PNG conversion'));
			img.src = blobUrl;
		});

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Could not get 2d context');

		ctx.clearRect(0, 0, width, height);
		if (bgColor && bgColor !== 'transparent') {
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, width, height);
		}
		ctx.drawImage(img, 0, 0, width, height);

		await new Promise<void>((resolve, reject) => {
			canvas.toBlob((pngBlob) => {
				if (!pngBlob) {
					reject(new Error('Canvas toBlob failed'));
					return;
				}
				const pngUrl = URL.createObjectURL(pngBlob);
				const a = document.createElement('a');
				a.href = pngUrl;
				a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
				resolve();
			}, 'image/png');
		});
	} finally {
		URL.revokeObjectURL(blobUrl);
	}
}

export async function downloadUrlAsPng(
	url: string,
	filename: string,
	maxDimension: number = 2000,
	recolorFn?: (svgText: string) => string,
	bgColor?: string
): Promise<void> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.statusText}`);
	let svgText = await res.text();
	if (recolorFn) {
		svgText = recolorFn(svgText);
	}
	await downloadSvgAsPng(svgText, filename, maxDimension, bgColor);
}
