# Prompt Studio

Веб-приложение для изучения промпт-инженерии, создания шаблонов промптов и публикации их в общем каталоге.

**Стек:** Next.js 16, React 19, TypeScript, Tailwind CSS, Mock REST API (Node.js), React Hook Form + Zod, Vitest, Playwright.

## Демо

- Локально: `http://localhost:3000`
- Mock API: `http://localhost:3001`
- Демо-аккаунт: `demo@example.com` / `demo123`

> После деплоя добавьте сюда ссылку на Vercel/Netlify.

## Функциональность

- **Обучение** — материалы по CoT, few-shot, role prompting, structured output
- **Каталог** — просмотр публичных шаблонов, лайки, детальная страница с подсветкой
- **Личный кабинет** — CRUD шаблонов, публикация/приватность
- **Авторизация** — вход и регистрация с валидацией форм
- **Редактор промптов** — подсветка синтаксиса (заголовки, переменные, JSON, XML, CAPS, MetaGlyph и др.)
- **Доступность** — skip-link, aria-атрибуты, семантическая разметка, focus-visible
- **Оптимизация** — dynamic import редактора и превью, optimizePackageImports

## Информационная архитектура

```
/                     — главная
/learn                — список тем
/learn/[slug]         — статья по теме
/catalog              — публичный каталог
/catalog/[id]         — просмотр шаблона
/login, /register     — авторизация
/dashboard            — личный кабинет
/dashboard/templates/new
/dashboard/templates/[id]/edit
```

## Быстрый старт

```bash
npm install
npm run dev:all
```

Или в двух терминалах:

```bash
npm run mock   # порт 3001
npm run dev    # порт 3000
```

Сборка:

```bash
npm run build
npm run start
```

## Тестирование

```bash
npm run test           # unit-тесты (Vitest)
npm run test:coverage  # покрытие
npm run test:e2e       # e2e (Playwright)
npx playwright install chromium
```

## Lighthouse

1. Запустите production-сборку: `npm run build && npm run start`
2. В другом терминале: `npm run mock`
3. Выполните аудит: `npm run lighthouse`
4. Отчёт сохранится в `docs/lighthouse-report.html`

Рекомендации для зелёных Web Vitals уже учтены: tree-shaking через Next.js, dynamic import тяжёлых компонентов, без лишних зависимостей.

## Структура проекта

```
mock/                 — Mock REST API
src/app/              — страницы (App Router)
src/components/       — UI-компоненты
src/context/          — контекст авторизации
src/lib/              — API-клиент, валидация
src/utils/            — подсветка синтаксиса
e2e/                  — Playwright-тесты
docs/                 — отчёты Lighthouse
```

## Этапы разработки

1. IA, репозиторий, навигация
2. Формы, валидация, редактор промптов
3. Unit + e2e тесты
4. Lighthouse-аудит
5. Доступность и финальная полировка
