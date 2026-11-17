import { test, expect } from '@playwright/test';

/**
 * FLUID-SIZING-v10 § 9 — the narrow end of the site, measured in browser.
 */
const PAGES = ['/', '/brandbook'];

const SIZES = [
	{ width: 320, height: 450, label: 'small phone' },
	{ width: 360, height: 500, label: 'short screen' },
	{ width: 740, height: 380, label: 'phone in landscape' },
	{ width: 1280, height: 800, label: 'desktop' }
];

test.describe('the narrow end (FLUID-SIZING-v10)', () => {
	for (const { width, height, label } of SIZES) {
		test(`${width}×${height} (${label}) never scrolls sideways`, async ({ page }) => {
			await page.setViewportSize({ width, height });

			const offenders: string[] = [];
			for (const path of PAGES) {
				await page.goto(path);
				await page.waitForLoadState('domcontentloaded');

				const measured = await page.evaluate(() => ({
					scrollWidth: document.documentElement.scrollWidth,
					viewport: window.innerWidth
				}));

				const over = measured.scrollWidth - measured.viewport;
				if (over > 1) {
					offenders.push(`${path}: ${measured.scrollWidth}px in ${measured.viewport}px window (${over}px over)`);
				}
			}

			expect(offenders, `the page travels sideways:\n${offenders.join('\n')}`).toEqual([]);
		});
	}

	for (const { width, height, label } of SIZES) {
		test(`${width}×${height} (${label}) keeps header and main actions reachable`, async ({ page }) => {
			await page.setViewportSize({ width, height });
			await page.goto('/');
			await page.waitForLoadState('domcontentloaded');

			const controls = page.locator('header a, header button, .contact-links a').filter({ visible: true });
			const count = await controls.count();
			expect(count).toBeGreaterThan(0);

			const out: string[] = [];
			for (let i = 0; i < count; i++) {
				const box = await controls.nth(i).boundingBox();
				if (!box) continue;
				if (box.x < -1 || box.x + box.width > width + 1) {
					const html = await controls.nth(i).evaluate((n) => n.outerHTML.slice(0, 70));
					out.push(`${Math.round(box.x)}…${Math.round(box.x + box.width)} of ${width}: ${html}`);
				}
			}

			expect(out, `outside the window and unreachable:\n${out.join('\n')}`).toEqual([]);
		});
	}
});
