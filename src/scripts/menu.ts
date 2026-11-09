/*
 * The menu is a native <dialog> opened by an invoker button (`commandfor`).
 * This module closes it from the backdrop and from its links, and opens it in
 * browsers that don't yet support invoker commands.
 */
const dialog = document.querySelector<HTMLDialogElement>('dialog[data-menu]');

if (dialog) {
  if (!('commandForElement' in HTMLButtonElement.prototype)) {
    for (const button of document.querySelectorAll<HTMLButtonElement>(
      `[commandfor="${dialog.id}"]`,
    )) {
      button.addEventListener('click', () => {
        if (button.getAttribute('command') === 'show-modal') dialog.showModal();
        else dialog.close();
      });
    }
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  for (const link of dialog.querySelectorAll('a')) {
    link.addEventListener('click', () => dialog.close());
  }

  window.addEventListener('pagehide', () => dialog.close());
}
