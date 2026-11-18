# VetCrewHospital — Gemini Assistant Guide

Головні правила проєкту зафіксовані в [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) та [AGENTS.md](AGENTS.md).

- Стек: SvelteKit 2 + Svelte 5 (Runes), TypeScript (strict + noUncheckedIndexedAccess), adapter-static.
- Хостинг: GitHub Pages (`https://vet-crew-hospital.org/`).
- Префікс сховища: `vetcrewhospital_`.
- Графік роботи клініки: суворо **Пн–Пт 10:00 – 18:00** (Сб–Нд вихідні). СУВОРО ЗАБОРОНЕНО писати «24/7» або «цілодобово».
- Логотип: офіційний векторний логотип містить написи «VET CREW» та «HOSPITAL» у власних кривих, а не окремим шрифтовим текстом.
- Вимоги перевірки: `npm run check && npm run test:unit && npm run audit:ci && npm run build`.
