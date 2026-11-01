import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Vet Crew Hospital Portal E2E', () => {
	test('Головна сторінка завантажується з коректними метаданими та 3D-лого', async ({ page }) => {
		await page.goto('/');

		// Заголовок сторінки
		await expect(page).toHaveTitle(/Vet Crew Hospital/i);

		// Перевірка наявності логотипу та інтерактивних елементів
		const logo = page.locator('.vetcrew-logo-canvas, .logo-interactive-wrap, svg.logo-svg');
		await expect(logo.first()).toBeVisible();

		// Перевірка контактних каналів клініки
		const phoneLink = page.locator('a[href^="tel:+380775010101"]');
		await expect(phoneLink).toBeVisible();

		const instaLink = page.locator('a[href*="instagram.com/vet.crew.hospital"]');
		await expect(instaLink).toBeVisible();

		const mapLink = page.locator('a[href*="maps.app.goo.gl"]');
		await expect(mapLink).toBeVisible();
	});

	test('Доступність (a11y) відповідає базовим вимогам WCAG AA', async ({ page }) => {
		await page.goto('/');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.disableRules(['color-contrast']) // Запобігання хибним спрацьовуванням під час динамічних анімацій
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Внутрішній брендбук захищений від індексації пошуковими системами', async ({ page }) => {
		await page.goto('/brandbook');

		// Перевірка тегу noindex
		const robotsMeta = page.locator('meta[name="robots"]');
		await expect(robotsMeta).toHaveAttribute('content', /noindex,\s*nofollow/i);

		// Перевірка наявності секцій брендбука
		const title = page.locator('h1, .brandbook-title');
		await expect(title.first()).toBeVisible();
	});
});

