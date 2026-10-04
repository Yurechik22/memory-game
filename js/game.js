import { shuffle } from './shuffle.js';

/**
 * Игровая логика без привязки к DOM.
 * Интерфейс узнаёт об изменениях через колбэки onChange и onWin.
 *
 * @param {{
 *   symbols: {id: string}[],
 *   mismatchDelay?: number,
 *   onChange: (state: object) => void,
 *   onWin: (moves: number) => void,
 * }} options
 */
export function createGame({ symbols, mismatchDelay = 1000, onChange, onWin }) {
  let state = null;
  let hideTimerId = null;

  function buildDeck() {
    const pairs = symbols.flatMap((symbol) => [symbol, symbol]);
    return shuffle(pairs).map((symbol) => ({
      symbol,
      isOpen: false,
      isMatched: false,
    }));
  }

  function cancelHideTimer() {
    clearTimeout(hideTimerId);
    hideTimerId = null;
  }

  /** Новая игра: отменяет таймер, перемешивает колоду, обнуляет счётчики. */
  function start() {
    cancelHideTimer();
    state = {
      cards: buildDeck(),
      openIndexes: [],
      moves: 0,
      pairs: 0,
      totalPairs: symbols.length,
      isLocked: false,
      isFinished: false,
    };
    onChange(state);
  }

  function canFlip(card) {
    return Boolean(card) && !state.isFinished && !state.isLocked && !card.isOpen && !card.isMatched;
  }

  function hideMismatch() {
    hideTimerId = null;
    state.openIndexes.forEach((index) => {
      state.cards[index].isOpen = false;
    });
    state.openIndexes = [];
    state.isLocked = false;
    onChange(state);
  }

  function resolvePair() {
    state.moves += 1;
    const [first, second] = state.openIndexes.map((index) => state.cards[index]);

    if (first.symbol.id === second.symbol.id) {
      first.isMatched = true;
      second.isMatched = true;
      state.pairs += 1;
      state.openIndexes = [];
      state.isFinished = state.pairs === state.totalPairs;
      onChange(state);
      if (state.isFinished) onWin(state.moves);
      return;
    }

    state.isLocked = true;
    onChange(state);
    hideTimerId = setTimeout(hideMismatch, mismatchDelay);
  }

  /** Попытка открыть карточку по индексу. Недопустимые клики игнорируются. */
  function flip(index) {
    const card = state.cards[index];
    if (!canFlip(card)) return;

    card.isOpen = true;
    state.openIndexes.push(index);

    if (state.openIndexes.length === 2) {
      resolvePair();
    } else {
      onChange(state);
    }
  }

  return { start, flip };
}
