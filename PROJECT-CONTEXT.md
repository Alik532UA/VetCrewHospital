# Vet Crew Hospital — Project Context

## 1. Загальні відомості

- **Назва**: Vet Crew Hospital
- **Опис**: Офіційний інтерактивний веб-портал ветеринарного госпіталю Vet Crew (динамічне 3D лого, інтерактивні контакти ветеринарного госпіталю, двостадійний скрол-інтерфейс, підтримка темної та світлої тем, багатомовність UA/EN).
- **Стек**: SvelteKit 2 + Svelte 5 (Runes), TypeScript, adapter-static, Lucide Svelte, CSS Variables.
- **Хостинг**: GitHub Pages (`https://alik532ua.github.io/VetCrewHospital/`).
- **Гілка деплою**: `main`.

## 2. Конфігурація адресації та базового шляху (SEO-v10 § 1.2)

- **SITE_ORIGIN**: `https://alik532ua.github.io`
- **SITE_BASE**: `/VetCrewHospital` (у production-збірці; порожній рядок у локальній розробці)
- **paths.relative**: `false` (гарантує абсолютні шляхи при гідрації)

## 3. Реєстр префіксів сховища (STORAGE-NAMESPACE-v10 § 1)

Сайт розміщено на спільному домені `alik532ua.github.io`, тому всі ключі веб-сховища мають суворий унікальний префікс.

| Поле                      | Значення                 |
| ------------------------- | ------------------------ |
| **PROJECT_PREFIX**        | `vetcrewhospital_`       |
| **STORAGE_PREFIX (prod)** | `vetcrewhospital_`       |
| **STORAGE_PREFIX (dev)**  | `vetcrewhospital-dev_`   |

### Реєстр ключів сховища

| Ключ (без префікса) | Повний ключ у сховищі    | Призначення                | Дозволені значення   |
| ------------------- | ------------------------ | -------------------------- | -------------------- |
| `theme`             | `vetcrewhospital_theme`  | Тема оформлення інтерфейсу | `'dark'`, `'light'`  |
| `lang`              | `vetcrewhospital_lang`   | Мова інтерфейсу            | `'uk'`, `'en'`       |

## 4. Контактні канали

1. **Телефон**: `+380 77 501 01 01` (`tel:+380775010101`)
2. **Instagram**: `https://www.instagram.com/vet.crew.hospital`
3. **Карта (Google Maps)**: `https://maps.app.goo.gl/sTe5ePLTwwwQEZQz6`

## 5. Двостадійний скрол-інтерфейс

- **Стан 1 (State 1: Hero Logo)**: Центральний акцент на динамічному 3D логотипі з відстеженням миші та гіроскопа, компактний док дій внизу.
- **Стан 2 (State 2: Actions Focus)**: Логотип плавно зменшується й підіймається вгору, відкриваючи великі інтерактивні картки дій (дзвінок, інстаграм, навігація на мапі).

## 6. Пошукова оптимізація та метадані (SEO-v10)

- **Single Ownership метаданих (SEO-v10 § 4.1 & § 4.4)**: `app.html` містить лише глобальні OG/Theming теги, а `<title>`, `<meta name="description">`, `canonical`, `og:url`, `og:title`, `og:description` керуються суворо на рівні сторінки `src/routes/+page.svelte`.
- **Захист внутрішнього брендбука від індексації**:
  - `src/routes/brandbook/+page.svelte` містить `<meta name="robots" content="noindex, nofollow" />`.
  - `static/robots.txt` блокує сканування шляхів `/brandbook` та `/VetCrewHospital/brandbook`.
  - `static/sitemap.xml` містить виключно публічну головну сторінку госпіталю.
- **Файли індексації та AI-сумісності**:
  - `static/robots.txt`: керує правами ботів та вказує шлях до `sitemap.xml`.
  - `static/sitemap.xml`: індексує виключно публічний головний портал госпіталю.
  - `static/llms.txt`: стандартизований маніфест вмісту сайту для AI пошукових агентів (реальні контакти, посилання, послуги без згадки 24/7).

- **Структуровані дані Schema.org (SEO-v10 § 3 & SECURITY-v10 § 5.3)**:
  - Головна сторінка розмічена схемою типу `VeterinaryCare` (назва, телефон, гео-координати, адреса, посилання на соцмережі).
  - Вставка здійснюється через компонент `src/lib/components/JsonLd.svelte` та функцію `jsonLdScript()` (`src/lib/security/jsonLd.ts`), що екранує небезпечні символи (`<`, `>`, `&`, Unicode-розділювачі) для запобігання XSS.

## 7. Стандарти якості коду та CI/CD (CODE-QUALITY-v10 & CI-CD-AND-TOOLS-v10)

- **TypeScript Strictness (CODE-QUALITY-v10 § 1.1)**:
  - `"strict": true`
  - `"noUncheckedIndexedAccess": true` (захист від runtime помилок доступу до невизначених індексів масивів)
  - `"noImplicitReturns": true`
- **CI/CD Автоматизація**:
  - GitHub Actions Workflow (`.github/workflows/deploy.yml`) запускається при `push` та `pull_request` до гілки `main`.
  - Обов'язкові кроки перевірки: `npm run audit:ci` (перевірка вразливостей з порогами high/critical), `npm run check` (типізація Svelte/TypeScript), `npm run build` (статична генерація adapter-static).

## 8. Обробка помилок (ERROR-HANDLING-v10 § 2.2)

- **Фірмова сторінка помилок (`src/routes/+error.svelte`)**:
  - Відображає статуси 404 та неочікувані помилки у фірмовому стилі Vet Crew.
  - Повна підтримка темної та світлої тем (`themeStore`) та двомовності UA/EN (`langStore`).
  - Містить пряму кнопку повернення на головну сторінку та блок контактів клініки з номером `+380 77 501 01 01`, щоб користувач не втратив зв'язок з клінікою.

## 9. Доступність (ACCESSIBILITY-v10 § 7)

- **Підтримка `prefers-reduced-motion`**:
  - У `src/lib/components/VetCrewLogo.svelte` цикл 3D-нахилу автоматично зупиняє розгойдування та динамічні зміщення елементів при ввімкненні системного налаштування зниження руху.
  - У `src/app.css` визначено глобальні правила мінімізації тривалості анімацій і переходів для користувачів із чутливим вестибулярним апаратом.
## 10. Мобільна PWA інтеграція (PWA-v10)

- **Маніфест (`static/manifest.webmanifest`)**:
  - Містить метадані встановлюваного веб-додатка (`name`, `short_name: "Vet Crew"`, `theme_color: "#598f3a"`, `background_color: "#070e09"`, векторні іконки з підтримкою маскування).
  - У `src/app.html` підключено теги `manifest`, `apple-touch-icon`, `apple-mobile-web-app-capable` та `apple-mobile-web-app-title`.

## 11. Доступність фокусу (ACCESSIBILITY-v10 § 3)

- **Кільця фокусування (`:focus-visible`)**:
  - У `src/app.css` визначено видимий висококонтрастний золотий контур (`outline: 2px solid var(--brand-gold); outline-offset: 3px`) для всіх кнопок і посилань при навігації з клавіатури (WCAG 2.2 AA).

## 12. Версіонування застосунку (VERSIONING-v10 § 1–3)

- **Джерело версії (`src/lib/version.ts`)**:
  - Константа `APP_VERSION` (`0.1.0`) експортується для клієнтського коду та відображається у висувній системній панелі (`HiddenPanel.svelte`).