import { el } from './dom.js';

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
      createHeaderButton({ icon: '↻', label: 'Новая игра', onClick: () => {} }),
      createHeaderButton({ icon: '🏆', label: 'Таблица лидеров', onClick: () => {} }),
    ]),
  ]);
}

document.body.prepend(
  el('div', { className: 'app' }, [
    createHeader(),
    el('main', { className: 'main' }),
  ]),
);
