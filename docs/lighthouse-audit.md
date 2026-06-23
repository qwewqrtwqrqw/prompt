# Lighthouse audit

## Как получить отчёт

```bash
npm run build
npm run start
# в другом терминале
npm run mock
npm run lighthouse
```

Отчёт: `docs/lighthouse-report.html`

## Оптимизации в проекте

- Dynamic import для `PromptEditor` и `PromptPreview`
- `experimental.optimizePackageImports` для react-hook-form и zod
- Минимальный набор зависимостей
- Семантическая HTML-разметка для Accessibility score

## Целевые метрики (Web Vitals)

| Метрика | Цель |
|---------|------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

После локального прогона зафиксируйте скриншот или HTML-отчёт и приложите к сдаче работы.
