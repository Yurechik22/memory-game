import { el, plural } from './dom.js';
import { CARD_SYMBOLS } from './cards-data.js';
import { createGame } from './game.js';
import { createBoard } from './board.js';
import { createModal } from './modal.js';
import { addResult, loadResults, formatDate } from './leaderboard.js';

const MISMATCH_DELAY_MS = 1000;

const modal = createModal();

/* ---------- Счётчики ---------- */

function createStats() {
  const movesValue = el('span', { className: 'stats__value', text: '0' });
  const pairsValue = el('span', { className: 'stats__value', text: '0 из 8' });

  const element = el('div', { className: 'stats', attrs: { 'aria-live': 'polite' } }, [
    el('p', { className: 'stats__item' }, ['Ходы: ', movesValue]),
    el('p', { className: 'stats__item' }, ['Пары: ', pairsValue]),
  ]);

  function render({ moves, pairs, totalPairs }) {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${pairs} из ${totalPairs}`;
  }

  return { element, render };
}

/* ---------- Модальные окна ---------- */

function openWinModal(moves) {
  modal.open({
    title: 'Победа! 🎉',
    body: [
      el('p', { text: 'Вы нашли все пары.' }),
      el('p', { className: 'modal__result', text: `${moves} ${plural(moves, ['ход', 'хода', 'ходов'])}` }),
    ],
    actions: [
      { label: 'Новая игра', variant: 'primary', onClick: () => game.start() },
      { label: 'Закрыть' },
    ],
  });
}

function createLeaderboardTable(results) {
  const headRow = el('tr', {}, ['Место', 'Ходы', 'Дата'].map((text) => el('th', { text, attrs: { scope: 'col' } })));

  const rows = results.map((result, index) => el('tr', {}, [
    el('td', { text: String(index + 1) }),
    el('td', { text: String(result.moves) }),
    el('td', { text: formatDate(result.date) }),
  ]));

  return el('table', { className: 'leaderboard' }, [
    el('thead', {}, [headRow]),
    el('tbody', {}, rows),
  ]);
}

function openLeaderboardModal() {
  const results = loadResults();
  const body = results.length > 0
    ? [createLeaderboardTable(results)]
    : [el('p', { className: 'modal__empty', text: 'Пока нет результатов. Сыграйте первую партию!' })];

  modal.open({
    title: 'Таблица лидеров',
    body,
    actions: [{ label: 'Закрыть', variant: 'primary' }],
  });
}

/* ---------- Сборка приложения ---------- */

function createHeaderButton({ icon, label, onClick }) {
  return el('button', {
    className: 'button button--header',
    attrs: { type: 'button' },
    on: { click: onClick },
  }, [
    el('span', { className: 'button__icon', text: icon, attrs: { 'aria-hidden': 'true' } }),
    el('span', { text: label }),
  ]);
}

function createHeader() {
  return el('header', { className: 'header' }, [
    el('h1', { className: 'header__title', text: 'Memory' }),
    el('nav', { className: 'header__actions', attrs: { 'aria-label': 'Управление игрой' } }, [
      createHeaderButton({ icon: '↻', label: 'Новая игра', onClick: () => game.start() }),
      createHeaderButton({ icon: '🏆', label: 'Таблица лидеров', onClick: openLeaderboardModal }),
    ]),
  ]);
}

const stats = createStats();
const board = createBoard({
  size: CARD_SYMBOLS.length * 2,
  onCardClick: (index) => game.flip(index),
});

const game = createGame({
  symbols: CARD_SYMBOLS,
  mismatchDelay: MISMATCH_DELAY_MS,
  onChange: (state) => {
    stats.render(state);
    board.render(state);
  },
  onWin: (moves) => {
    addResult(moves);
    openWinModal(moves);
  },
});

document.body.prepend(
  el('div', { className: 'app' }, [
    createHeader(),
    el('main', { className: 'main' }, [stats.element, board.element]),
  ]),
);

game.start();
