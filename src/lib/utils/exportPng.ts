/**
 * Utility to convert SVG code or SVG files into crisp, high-resolution PNG images in the browser.
 */

export async function downloadSvgAsPng(
	svgText: string,
	filename: string,
	maxDimension: number = 2000
): Promise<void> {
	if (typeof window === 'undefined') return;

	// 1. Determine aspect ratio from viewBox or width/height
	let width = maxDimension;
	let height = maxDimension;

	const viewBoxMatch = svgText.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
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
		const widthMatch = svgText.match(/width=["']\s*([-\d.]+)(?:px)?\s*["']/i);
		const heightMatch = svgText.match(/height=["']\s*([-\d.]+)(?:px)?\s*["']/i);
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
	let preparedSvg = svgText;
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
	recolorFn?: (svgText: string) => string
): Promise<void> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.statusText}`);
	let svgText = await res.text();
	if (recolorFn) {
		svgText = recolorFn(svgText);
	}
	await downloadSvgAsPng(svgText, filename, maxDimension);
}

