import adapter from '@sveltejs/adapter-static';

const rawBase = process.env.BASE_PATH ?? '';

if (rawBase !== '' && !/^\/[^/](?:.*[^/])?$/.test(rawBase)) {
	throw new Error(
		`BASE_PATH must be empty or start-but-not-end with "/", got ${JSON.stringify(rawBase)}.`
	);
}

const base = /** @type {'' | `/${string}`} */ (rawBase);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base,
			relative: false
		},
		prerender: {
			entries: ['*']
		}
	}
};

export default config;

