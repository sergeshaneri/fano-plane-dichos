# Модель А × Плоскость Фано

Интерактивная визуализация 7 дихотомий и 8 функций соционики через
плоскость Фано `PG(2,2)` и матрицу Адамара.

7 дихотомий соответствуют 7 точкам плоскости Фано — ненулевым векторам
элементарной абелевой группы `(Z/2)³`. Произведение двух дихотомий
вычисляется как побитовый XOR их индексов и всегда даёт третью точку,
лежащую с ними на одной прямой.

## Стек

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

## Сборка и деплой

```bash
npm run build      # сборка в dist/
npm run preview    # локальный просмотр продакшен-сборки
npm run deploy     # публикация в gh-pages
npm run lint       # tsc --noEmit
```

Сайт публикуется на GitHub Pages: <https://sergeshaneri.github.io/fano-plane-dichos/>
