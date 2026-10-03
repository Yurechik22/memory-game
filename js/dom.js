/**
 * Тонкая обёртка над document.createElement.
 * Позволяет описать элемент одной строкой: класс, текст, атрибуты, обработчики, дети.
 *
 * @param {string} tag
 * @param {{
 *   className?: string,
 *   text?: string,
 *   attrs?: Record<string, string>,
 *   on?: Record<string, EventListener>,
 * }} [options]
 * @param {(Node|string)[]} [children]
 * @returns {HTMLElement}
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  const { className, text, attrs, on } = options;

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;

  if (attrs) {
    Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));
  }

  if (on) {
    Object.entries(on).forEach(([event, handler]) => node.addEventListener(event, handler));
  }

  node.append(...children);
  return node;
}

/**
 * Русское склонение: plural(5, ['ход', 'хода', 'ходов']) → 'ходов'.
 */
export function plural(count, [one, few, many]) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
