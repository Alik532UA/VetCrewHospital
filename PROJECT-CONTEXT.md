# Vet Crew Hospital — Project Context

## 1. Загальні відомості

- **Назва**: Vet Crew Hospital
- **Опис**: Офіційний інтерактивний веб-портал ветеринарного госпіталю Vet Crew (динамічне 3D лого, інтерактивні контакти невідкладної допомоги, двостадійний скрол-інтерфейс, підтримка темної та світлої тем, багатомовність UA/EN).
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

- **Single Ownership метаданих (SEO-v10 § 4.1 & § 4.4)**: `app.html` містить лише глобальні OG/Theming теги, а `<title>`, `<meta name="description">`, `canonical`, `og:url`, `og:title`, `og:description` керуються суворо на рівні сторінок через `<svelte:head>` у `src/routes/+page.svelte` та `src/routes/brandbook/+page.svelte`.
- **Файли індексації та AI-сумісності**:
  - `static/robots.txt`: дозволяє повну індексацію для всіх ботів та вказує шлях до `sitemap.xml`.
  - `static/sitemap.xml`: містить повні абсолютні посилання на головну сторінку та брендбук із пріоритетами й датами модифікації.
  - `static/llms.txt`: стандартизований маніфест вмісту сайту для AI пошукових агентів (контакти, посилання, опис структури).

## 7. Стандарти якості коду та CI/CD (CODE-QUALITY-v10 & CI-CD-AND-TOOLS-v10)

- **TypeScript Strictness (CODE-QUALITY-v10 § 1.1)**:
  - `"strict": true`
  - `"noUncheckedIndexedAccess": true` (захист від runtime помилок доступу до невизначених індексів масивів)
  - `"noImplicitReturns": true`
- **CI/CD Автоматизація**:
  - GitHub Actions Workflow (`.github/workflows/deploy.yml`) запускається при `push` та `pull_request` до гілки `main`.
  - Обов'язкові кроки перевірки: `npm run audit:ci` (перевірка вразливостей з порогами high/critical), `npm run check` (типізація Svelte/TypeScript), `npm run build` (статична генерація adapter-static).
