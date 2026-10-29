/**
 * Підняття patch-версії (+0.0.1) та синхронізація `static/app-version.json` і `src/lib/config/version.ts`.
 * Відповідає моделі «бамп на коміт» (VERSIONING-v10 § 1).
 */
import { readFileSync, writeFileSync, existsSync, utimesSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const packageJsonPath = resolve(rootDir, 'package.json');
const staticVersionPath = resolve(rootDir, 'static/app-version.json');
const tsVersionPath = resolve(rootDir, 'src/lib/config/version.ts');
const viteConfigPath = resolve(rootDir, 'vite.config.ts');

const syncOnly = process.argv.includes('--sync-only');

const pkgBefore = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const previousVersion = pkgBefore.version;

if (!syncOnly) {
	execSync('npm version patch --no-git-tag-version', { cwd: rootDir, stdio: 'ignore' });
}

const pkgAfter = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const newVersion = pkgAfter.version;

// 1. static/app-version.json
writeFileSync(
	staticVersionPath,
	`${JSON.stringify({ version: newVersion }, null, '\t')}\n`
);

// 2. src/lib/config/version.ts
const tsContent = `/**
 * Single source of truth for runtime application version.
 * Complies with VERSIONING-v10 § 1 & § 2 and PROJECT-STRUCTURE-v10 § 4.1.
 */
export const APP_VERSION = '${newVersion}';
`;
writeFileSync(tsVersionPath, tsContent);

// 3. Оновлюємо timestamp vite.config.ts для HMR
if (existsSync(viteConfigPath)) {
	const now = new Date();
	try {
		utimesSync(viteConfigPath, now, now);
	} catch {
		// ігноруємо можливу помилку файлової системи
	}
}

// 4. Додаємо змінені файли в git stage
try {
	execSync('git add package.json package-lock.json static/app-version.json src/lib/config/version.ts', {
		cwd: rootDir,
		stdio: 'ignore'
	});
} catch {
	// ігноруємо, якщо виконується поза git
}

console.log(
	syncOnly
		? `[Version Bump] ${newVersion} — синхронізовано`
		: `[Version Bump] ${previousVersion} -> ${newVersion}`
);

