import { el } from './dom.js';

/**
 * Игровое поле: создаёт кнопки-карточки один раз и обновляет их по состоянию игры.
 *
 * @param {{ size: number, onCardClick: (index: number) => void }} options
 */
export function createBoard({ size, onCardClick }) {
  const cards = Array.from({ length: size }, (_, index) => createCard(index));
  const element = el('section', { className: 'board', attrs: { 'aria-label': 'Игровое поле' } }, cards.map((card) => card.button));

  function createCard(index) {
    const face = el('span', { className: 'card__face', attrs: { 'aria-hidden': 'true' } });
    const back = el('span', { className: 'card__back', attrs: { 'aria-hidden': 'true' } });
    const inner = el('span', { className: 'card__inner' }, [back, face]);
    const button = el('button', {
      className: 'card',
      attrs: { type: 'button' },
      on: { click: () => onCardClick(index) },
    }, [inner]);

    // Картинку убираем, когда карточка закончила поворачиваться рубашкой вверх:
    // закрытая карточка не хранит своё изображение в разметке.
    inner.addEventListener('transitionend', () => {
      if (!button.classList.contains('is-open')) face.textContent = '';
    });

    return { button, face };
  }

  function renderCard({ button, face }, cardState, index) {
    const isVisible = cardState.isOpen || cardState.isMatched;
    const position = index + 1;

    button.classList.toggle('is-open', isVisible);
    button.classList.toggle('is-matched', cardState.isMatched);

    if (isVisible) {
      face.textContent = cardState.symbol.emoji;
      face.style.setProperty('--card-color', cardState.symbol.color);
      button.setAttribute('aria-label', `Карточка ${position}: ${cardState.symbol.name}`);
    } else {
      button.setAttribute('aria-label', `Карточка ${position}, закрыта`);
    }

    if (cardState.isMatched) {
      button.setAttribute('aria-disabled', 'true');
    } else {
      button.removeAttribute('aria-disabled');
    }
  }

  function render(state) {
    element.classList.toggle('is-locked', state.isLocked || state.isFinished);
    state.cards.forEach((cardState, index) => renderCard(cards[index], cardState, index));
  }

  return { element, render };
}
