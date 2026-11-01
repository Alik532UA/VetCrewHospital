# Vet Crew Hospital — Project Context

## 1. Загальні відомості

- **Назва**: Vet Crew Hospital
- **Опис**: Офіційний інтерактивний веб-портал ветеринарного госпіталю Vet Crew (динамічне 3D лого, інтерактивні контакти ветеринарного госпіталю, двостадійний скрол-інтерфейс, підтримка темної та світлої тем, багатомовність UA/EN).
- **Стек**: SvelteKit 2 + Svelte 5 (Runes), TypeScript, adapter-static, Lucide Svelte, CSS Variables.
- **Хостинг**: GitHub Pages (власний домен `https://vet-crew-hospital.org/`).
- **Гілка деплою**: `main`.

## 2. Конфігурація адресації та базового шляху (SEO-v10 § 1.2, CUSTOM-DOMAIN-v10)

| Поле                  | Значення                                                    |
| --------------------- | ----------------------------------------------------------- |
| Основна адреса        | https://vet-crew-hospital.org/                              |
| Переадресована адреса | https://alik532ua.github.io/VetCrewHospital/ (301 redirect) |

- **SITE_ORIGIN**: `https://vet-crew-hospital.org`
- **SITE_BASE**: `''` (порожній рядок — сайт розташовано у корені власного домену)
- **paths.relative**: `false` (гарантує абсолютні шляхи при гідрації)

## 3. Реєстр префіксів сховища (STORAGE-NAMESPACE-v10 § 1)

Сайт розміщено на власному домені `vet-crew-hospital.org`, усі ключі веб-сховища мають суворий унікальний префікс.

| Поле                      | Значення               |
| ------------------------- | ---------------------- |
| **PROJECT_PREFIX**        | `vetcrewhospital_`     |
| **STORAGE_PREFIX (prod)** | `vetcrewhospital_`     |
| **STORAGE_PREFIX (dev)**  | `vetcrewhospital-dev_` |

### Реєстр ключів сховища

| Ключ (без префікса) | Повний ключ у сховищі   | Призначення                | Дозволені значення  |
| ------------------- | ----------------------- | -------------------------- | ------------------- |
| `theme`             | `vetcrewhospital_theme` | Тема оформлення інтерфейсу | `'dark'`, `'light'` |
| `lang`              | `vetcrewhospital_lang`  | Мова інтерфейсу            | `'uk'`, `'en'`      |

## 4. Контактні канали

1. **Телефон**: `+380 77 501 01 01` (`tel:+380775010101`)
2. **Instagram**: `https://www.instagram.com/vet.crew.hospital`
3. **Карта (Google Maps)**: `https://maps.app.goo.gl/sTe5ePLTwwwQEZQz6`

## 5. Двостадійний скрол-інтерфейс

- **Стан 1 (State 1: Hero Logo)**: Центральний акцент на динамічному 3D логотипі з відстеженням миші та гіроскопа, компактний док дій внизу.
- **Стан 2 (State 2: Actions Focus)**: Логотип плавно зменшується й підіймається вгору, відкриваючи великі інтерактивні картки дій (дзвінок, інстаграм, навігація на мапі).

## 6. Пошукова оптимізація та безпека (SEO-v10 & SECURITY-v10 § 6.3.1)

- **Single Ownership метаданих (SEO-v10 § 4.1 & § 4.4)**: `app.html` містить лише глобальні OG/Theming теги, а `<title>`, `<meta name="description">`, `canonical`, `og:url`, `og:title`, `og:description` керуються суворо на рівні сторінки `src/routes/+page.svelte`.
- **Захист внутрішнього брендбука від індексації**:
  - `src/routes/brandbook/+page.svelte` містить `<meta name="robots" content="noindex, nofollow" />`.
  - `static/robots.txt` блокує сканування шляхів `/brandbook` та `/brandbook/`.
  - `static/sitemap.xml` містить виключно публічну головну сторінку госпіталю.
- **Файли індексації та AI-сумісності**:
  - `static/robots.txt`: керує правами ботів та вказує шлях до `sitemap.xml`.
  - `static/sitemap.xml`: індексує виключно публічний головний портал госпіталю.
  - `static/llms.txt`: стандартизований маніфест вмісту сайту для AI пошукових агентів (реальні контакти, посилання, послуги без згадки 24/7).
- **Структуровані дані Schema.org (SEO-v10 § 3 & SECURITY-v10 § 5.3)**:
  - Головна сторінка розмічена схемою типу `VeterinaryCare` (назва, телефон, гео-координати, адреса, посилання на соцмережі).
  - Вставка здійснюється через компонент `src/lib/components/JsonLd.svelte` та функцію `jsonLdScript()` (`src/lib/security/jsonLd.ts`), що екранує небезпечні символи (`<`, `>`, `&`, Unicode-розділювачі) для запобігання XSS.
- **Content-Security-Policy (CSP) sha256-хешування (SECURITY-v10 § 6.3.1)**:
  - `svelte.config.js` автоматично обчислює SHA-256 хеші для всіх інлайн-скриптів у `src/app.html` із нормалізацією CRLF -> LF для сумісності з розбором HTML у браузері.
  - Інваріант перевіряється юніт-тестом `src/csp-hash.test.ts`.

## 7. Стандарти якості коду та CI/CD (CODE-QUALITY-v10 & CI-CD-AND-TOOLS-v10)

- **TypeScript Strictness (CODE-QUALITY-v10 § 1.1)**:
  - `"strict": true`
  - `"noUncheckedIndexedAccess": true` (захист від runtime помилок доступу до невизначених індексів масивів)
  - `"noImplicitReturns": true`
- **Лінтинг та форматування (CODE-QUALITY-v10 § 1.2)**:
  - ESLint 9+ Flat Config (`eslint.config.js`) із плагінами `typescript-eslint`, `eslint-plugin-svelte`, `eslint-config-prettier`.
  - Prettier (`.prettierrc`) із підтримкою форматування синтаксису Svelte 5 (`prettier-plugin-svelte`).
  - Команди перевірки: `npm run lint` (`lint:format` + `lint:code`), `npm run format`.
- **Архітектурні рішення (ADR)**:
  - `docs/adr/0001-two-stage-scroll-and-3d-logo.md` (фізика 3D-лого, стани скролу, prefers-reduced-motion).
  - `docs/adr/0002-brandbook-and-wallpaper-studio.md` (внутрішній брендбук, захист від ботів, 4K Canvas студія).
- **CI/CD Автоматизація**:
  - GitHub Actions Workflow (`.github/workflows/deploy.yml`) запускається при `push` та `pull_request` до гілки `main`.
  - Розділені завдання найменших привілеїв: `build` (`permissions: contents: read`) та `deploy` (`permissions: pages: write, id-token: write`).
  - Обов'язкові кроки перевірки: `npm run audit:ci`, `npm run check`, `npm run lint`, `npm run test:unit`, `npm run build`.
  - Автоматичне оновлення залежностей через Dependabot (`.github/dependabot.yml`).
- **Тестування та надійність**:
  - Юніт-тести Vitest (`npm run test:unit`): 13 файлів, 74 тести (перевірка CSP, доменів, сховища, hotkeys, logService).
  - End-to-end та доступність: Playwright (`playwright.config.ts`, `tests/hospital.spec.ts`) з інтеграцією `@axe-core/playwright` для верифікації WCAG 2.2 AA.

## 8. Обробка помилок та Error Boundaries (ERROR-HANDLING-v10 § 2.2)

- **Клієнтський обробник помилок (`src/hooks.client.ts`)**:
  - Перехоплює неперехоплені клієнтські помилки роутингу, завантаження модулів і рендеру.
  - Логує контекст помилки через `logService.error('app', 'Unhandled client error', { message, status, route })` для збору у діагностичний звіт.
  - Реалізує автоматичне перезавантаження на свіжу сторінку при виявленні застарілих/зниклих чанків (`chunkMissing` + `reloadOnce`).
- **Межа рендеру помилок Svelte 5 (`<svelte:boundary>`)**:
  - Усі сторінки в `src/routes/+layout.svelte` огорнуті в `<svelte:boundary>`.
  - У разі виникнення помилки рендеру показується компонент `src/lib/components/ErrorFallback.svelte` із кнопкою «Спробувати знову» та посиланням на головну, запобігаючи білому екрану смерті.
- **Фірмова сторінка помилок (`src/routes/+error.svelte`)**:
  - Відображає статуси 404 та неочікувані помилки у фірмовому стилі Vet Crew.
  - Повна підтримка темної та світлої тем (`themeStore`) та двомовності UA/EN (`langStore`).
  - Містить пряму кнопку повернення на головну сторінку та блок контактів клініки з номером `+380 77 501 01 01`.

## 9. Доступність (ACCESSIBILITY-v10 § 7)

- **Підтримка `prefers-reduced-motion`**:
  - У `src/lib/components/VetCrewLogo.svelte` цикл 3D-нахилу автоматично зупиняє розгойдування та динамічні зміщення елементів при ввімкненні системного налаштування зниження руху.
  - У `src/app.css` визначено глобальні правила мінімізації тривалості анімацій і переходів для користувачів із чутливим вестибулярним апаратом.

## 10. Мобільна PWA інтеграція (PWA-v10)

- **Маніфест (`static/manifest.webmanifest`)**:
  - Містить метадані встановлюваного веб-додатка (`name`, `short_name: "Vet Crew"`, `theme_color: "#598f3a"`, `background_color: "#070e09"`, векторні іконки з підтримкою маскування).
  - У `src/app.html` підключено теги `manifest`, `apple-touch-icon`, `mobile-web-app-capable`, `apple-mobile-web-app-capable` та `apple-mobile-web-app-title`.

## 11. Доступність фокусу (ACCESSIBILITY-v10 § 3)

- **Кільця фокусування (`:focus-visible`)**:
  - У `src/app.css` визначено видимий висококонтрастний золотий контур (`outline: 2px solid var(--brand-gold); outline-offset: 3px`) для всіх кнопок і посилань при навігації з клавіатури (WCAG 2.2 AA).

## 12. Версіонування та Stale-Build захист (VERSIONING-v10 § 1–6)

- **Модель «бамп на коміт»**:
  - `scripts/bump-version.mjs` піднімає patch-версію `+0.0.1` на чистому Node ESM без дочірніх процесів `npm`, синхронізуючи `package.json`, `package-lock.json`, `static/app-version.json` та `src/lib/config/version.ts`.
  - `.husky/pre-commit` автоматично викликає бамп перед створенням коміту (або `--sync-only` при ручному піднятті minor/major).
- **Stale-Build Recovery**:
  - `version: { pollInterval: 60000 }` у `svelte.config.js` періодично опитує сервер про наявність нової версії.
  - `beforeNavigate` у `src/routes/+layout.svelte` переводить перехід на свіже завантаження (`freshLoad` із `cache: 'reload'`), якщо на сервері вже є новий деплой.
  - `src/lib/utils/staleBuild.ts` надає функції `chunkMissing`, `freshLoad` та `reloadOnce` із захистом від зациклення через `sessionStore`.
  - Інваріант перевіряється юніт-тестом `src/stale-build.test.ts`.

## 13. Міжпроєктна екосистема Vet Crew (I18N-v10 § 3)

- **Таблиця споріднених сайтів (`src/lib/siblings.ts`)**:
  - Містить реєстр 9 взаємопов'язаних веб-додатків (`VetCrewEmergency`, `vetcrewgames`, `vetcrewhospital`, `digitalworkshop`, `cv`, `mindstep`, `slovko`, `as5`, `teatralo4ka`).
  - Утиліти `resolveSiblingLocale` та `siblingUrl` гарантують, що перехід між сайтами передає обрану мову користувача (`UK`/`EN`) у сегменті шляху або `?lang=` параметрі.
  - Контролер `src/lib/controllers/lang.svelte.ts` читає `?lang=` з URL при першому візиті та зберігає його у безпечне сховище.
  - Інваріант перевіряється юніт-тестом `src/lib/siblings.test.ts`.

## 14. Організація структури коду (PROJECT-STRUCTURE-v10 § 4.1 & § 7)

- **Канонічний розподіл `src/lib/`**:
  - `src/lib/controllers/`: реактивні класи стану на базі Svelte 5 Runes (`lang.svelte.ts`, `theme.svelte.ts`).
  - `src/lib/config/`: системні константи та налаштування середовища (`version.ts`).
  - `src/lib/data/`: статичні масиви даних, реєстри та дизайн-пресети (`typography.ts`, `doorSignage.ts`, `animals.ts`, `qrShowcase.ts`), що винесені з компонентів для збереження чистоти шаблонів.
  - `src/lib/security/`: безпека даних та екранування (`jsonLd.ts`).
  - `src/lib/services/`: нереактивні сервіси та адаптери (`storage.ts`, `fullscreen.ts`, `logService.svelte.ts`).
  - `src/lib/utils/`: чисті допоміжні функції (`exportPng.ts`, `staleBuild.ts`).
  - `src/lib/siblings.ts`: навігація між сайтами екосистеми.
