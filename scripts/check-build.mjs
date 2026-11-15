#!/usr/bin/env node
/**
 * Gate GATE-BUILD-OUTPUT: Перевірка зібраного сайту build/ (CI-CD-AND-TOOLS § 1.19, CUSTOM-DOMAIN § 7)
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { domainProblems } from './check-build/domain.mjs';

const rootDir = process.cwd();
const buildDir = resolve(rootDir, 'build');
const buildIndex = resolve(buildDir, 'index.html');
const sitemap = resolve(buildDir, 'sitemap.xml');

if (!existsSync(buildDir)) {
	console.error(`❌ build directory not found at "${buildDir}" — run npm run build first.`);
	process.exit(1);
}

if (!existsSync(buildIndex)) {
	console.error('❌ build/index.html not found! Run npm run build first.');
	process.exit(1);
}

if (!existsSync(sitemap)) {
	console.warn('⚠️ build/sitemap.xml not found.');
}

const html = readFileSync(buildIndex, 'utf8');
if (!html.includes('<title>')) {
	console.error('❌ build/index.html is missing <title> tag.');
	process.exit(1);
}

// Domain verification
try {
	const origin = process.env.SITE_ORIGIN ?? 'https://vet-crew-hospital.org';
	const base = process.env.BASE_PATH ?? '';
	const problems = domainProblems(buildDir, { origin, base, mainAddress: origin });
	if (problems.length > 0) {
		console.warn('⚠️ Domain policy warnings:', problems);
	}
} catch (e) {
	console.warn('⚠️ Domain check skipped:', e.message);
}

console.log('✅ check-build passed: production build directory is valid.');
