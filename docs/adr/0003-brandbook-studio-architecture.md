# ADR 0003: Brandbook Studio Architecture, Oracal 641 Mapping, and Vector Pipelines

## Контекст

Розділ брендбуку (`/brandbook`) у `VetCrewHospital` виріс у повноцінну інтерактивну дизайн-систему та виробничу студію для реальних фізичних носіїв ветеринарного госпіталю:
- Навігаційна стела (`DirectoryStele.svelte` та `directorySteleData.ts`).
- Таблички кабінетів (`DoorSignage.svelte` та `doorSignageData.ts`).
- Студія QR-кодів бренду (`QrShowcase.svelte`, `QrTransformControls.svelte`, `QrShapePicker.svelte`).
- Генератор брендових шпалер (`WallpaperStudio.svelte`).
- Каталог сертифікованих плівок Oracal 641 (`OracalColorPicker.svelte` та `oracal641Data.ts`).

Попередня документація проєкту фокусувалася переважно на головній сторінці госпіталю (2-стадійний скрол), залишаючи архітектурні інваріанти виробничої студії недокументованими для AI та розробників.

## Рішення

1. **Ізоляція даних та чистої бізнес-логіки (`src/lib/data/`):**
   - Усі фізичні константи (розміри в мм, кольорові коди Oracal, геометрія векторних швів, департаменти та стрілки) винесені в строго типізовані TypeScript-модулі (`directorySteleData.ts`, `doorSignageData.ts`, `oracal641Data.ts`).
   - Чисті функції розрахунку SVG (`generateSteleSvg`, `getSteleOuterPath`, `getSteleInnerPath`) відокремлені від стану компонентів Svelte, що забезпечує 100% покриття юніт-тестами (`directoryStele.test.ts`, `doorSignage.test.ts`, `qrShowcase.test.ts`).

2. **Векторний конвеєр експорту (`src/lib/utils/exportPng.ts`):**
   - Експорт для поліграфії та виробництва підтримує масштабовані роздільні здатності (1x, 2x, 4x, Print 300DPI) без втрати якості та без зовнішніх залежностей завдяки Canvas2D рендерингу SVG-джерел.

3. **Тестування безпеки (SECURITY-v10 & CSP-v10):**
   - Додано `src/security.test.ts` для верифікації чистоти ін'єкцій HTML у Svelte-компонентах та контролю ізоляції префікса сховища `vetcrewhospital_`.

## Статус

Прийнято та реалізовано (2026-11-09).

