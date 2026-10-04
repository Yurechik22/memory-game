# Memory — игра «Найди пары»

16 карточек, 8 пар. Найдите все пары за наименьшее число ходов.

## Запуск

Скрипты подключены как ES-модули, поэтому `index.html` нельзя открыть двойным кликом (`file://`).
Запустите локальный сервер, например расширение **Live Server** в VS Code или:

```bash
npx serve .
```

Для сдачи можно опубликовать на GitHub Pages.

## Структура

```
index.html          — пустой <body>, только <script type="module">
css/style.css       — стили
js/main.js          — сборка интерфейса: хедер, счётчики, поле, модальные окна
js/game.js          — игровая логика (без DOM): ходы, пары, блокировка, таймер
js/board.js         — компонент игрового поля и карточек
js/modal.js         — один переиспользуемый компонент модального окна (<dialog>)
js/leaderboard.js   — сохранение результатов в localStorage, сортировка, формат даты
js/shuffle.js       — перемешивание Фишера–Йетса
js/cards-data.js    — набор изображений (эмодзи Unicode, лицензия не требуется)
js/dom.js           — хелпер el() над document.createElement, склонение слов
```

Вся разметка создаётся через `document.createElement`; `innerHTML`, `outerHTML`,
`insertAdjacentHTML`, `document.write`, `DOMParser`, `alert/confirm/prompt` не используются.
