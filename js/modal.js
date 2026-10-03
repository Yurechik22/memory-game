import { el } from './dom.js';

let modalCount = 0;

/**
 * Переиспользуемое модальное окно на основе <dialog>.
 * Один экземпляр, содержимое передаётся при каждом открытии.
 *
 * Закрывается кнопкой действия, кликом по фону или клавишей Escape.
 * Пока окно открыто, фон неактивен (showModal делает его inert), прокрутка заблокирована.
 */
export function createModal() {
  modalCount += 1;
  const titleId = `modal-title-${modalCount}`;

  const content = el('div', { className: 'modal__content' });
  const dialog = el('dialog', { className: 'modal', attrs: { 'aria-labelledby': titleId } }, [
    content,
  ]);

  // Клик считается кликом по фону, только если и нажатие, и отпускание были на фоне —
  // так выделение текста мышью внутри окна случайно его не закроет.
  let pressedOnBackdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (pressedOnBackdrop && event.target === dialog) close();
    pressedOnBackdrop = false;
  });

  // Срабатывает при любом способе закрытия, в том числе по Escape.
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-scroll-locked');
    content.replaceChildren();
  });

  document.body.append(dialog);

  function createActionButton({ label, variant = 'secondary', onClick }) {
    return el('button', {
      className: `button button--${variant}`,
      text: label,
      attrs: { type: 'button' },
      on: {
        click: () => {
          close();
          onClick?.();
        },
      },
    });
  }

  /**
   * @param {{
   *   title: string,
   *   body: Node[],
   *   actions: {label: string, variant?: string, onClick?: () => void}[],
   * }} options
   */
  function open({ title, body, actions }) {
    if (dialog.open) dialog.close();

    content.replaceChildren(
      el('h2', { className: 'modal__title', text: title, attrs: { id: titleId } }),
      el('div', { className: 'modal__body' }, body),
      el('div', { className: 'modal__actions' }, actions.map(createActionButton)),
    );

    document.documentElement.classList.add('is-scroll-locked');
    dialog.showModal();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  return { open, close };
}
