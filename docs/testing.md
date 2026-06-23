# Тестирование

## Unit-тесты (Vitest)

```bash
npm run test:coverage
```

**Результат:** 87% statements, 90.6% lines (цель — 80%).

Покрыты:

- подсветка синтаксиса (`syntaxHighlighter`)
- валидация форм (`validators`)
- API-клиент (`api`)
- авторизация в localStorage (`auth-storage`)
- редактор, формы, навигация, карточки

## E2E (Playwright)

```bash
npx playwright install chromium
npm run test:e2e
```

Сценарии в `e2e/app.spec.ts`:

1. Главная и навигация
2. Каталог шаблонов
3. Вход и личный кабинет
4. Валидация формы создания шаблона

Mock API и Next.js поднимаются автоматически через `playwright.config.ts`.
