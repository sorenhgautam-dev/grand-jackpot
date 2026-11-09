/*
 * Gallery lightbox on a native <dialog>. The photo grows out of its thumbnail and
 * returns to it on close. Arrow keys and swipes move between photos.
 * Without JavaScript, each thumbnail is a plain link to the full photo.
 */
import { fill } from '../lib/locale';

const SWIPE_DISTANCE = 48;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const rootStyle = () => getComputedStyle(document.documentElement);
/** A length or duration token as a number of px or ms. */
const num = (token: string) => Number.parseFloat(rootStyle().getPropertyValue(token)) || 0;
const ease = (token: string) => rootStyle().getPropertyValue(token).trim() || 'linear';

function inView(rect: DOMRect): boolean {
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
}

function setup(gallery: HTMLElement): void {
  const links = [...gallery.querySelectorAll<HTMLAnchorElement>('a[data-index]')];
  const dialog = gallery.querySelector<HTMLDialogElement>('dialog[data-lightbox]');
  const image = dialog?.querySelector<HTMLImageElement>('[data-image]');
  const stage = dialog?.querySelector<HTMLElement>('[data-stage]');
  const count = dialog?.querySelector<HTMLElement>('[data-count]');
  if (!dialog || !image || !stage || !count || links.length === 0) return;
  wire({ links, dialog, image, stage, count });
}

interface Parts {
  links: HTMLAnchorElement[];
  dialog: HTMLDialogElement;
  image: HTMLImageElement;
  stage: HTMLElement;
  count: HTMLElement;
}

function wire({ links, dialog, image, stage, count }: Parts): void {
  let index = 0;
  let closing = false;

  const thumbRect = (at: number) =>
    (links[at]?.querySelector('img') ?? links[at])?.getBoundingClientRect() ?? new DOMRect();

  /** The transform that places the open photo exactly over a rectangle on the page. */
  const transformTo = (rect: DOMRect) => {
    const target = image.getBoundingClientRect();
    return `translate(${rect.left - target.left}px, ${rect.top - target.top}px) scale(${rect.width / target.width}, ${rect.height / target.height})`;
  };

  async function show(at: number): Promise<void> {
    const link = links[at];
    if (!link) return;
    index = at;
    image.src = link.href;
    image.width = Number(link.dataset.width);
    image.height = Number(link.dataset.height);
    image.alt = link.dataset.alt ?? '';
    count.textContent = fill(count.dataset.template ?? '', {
      n: at + 1,
      total: count.dataset.total ?? links.length,
    });
    await image.decode().catch(() => undefined);
  }

  async function open(at: number): Promise<void> {
    await show(at);
    dialog.showModal();
    const from = thumbRect(at);
    if (reducedMotion.matches || !inView(from)) return;
    image.animate([{ transform: transformTo(from) }, { transform: 'none' }], {
      duration: num('--dur-dialog'),
      easing: ease('--ease-out'),
    });
  }

  async function close(): Promise<void> {
    if (closing) return;
    closing = true;
    const to = thumbRect(index);
    if (!reducedMotion.matches && inView(to)) {
      const animation = image.animate([{ transform: 'none' }, { transform: transformTo(to) }], {
        duration: num('--dur-dialog-exit'),
        easing: ease('--ease-in'),
        fill: 'forwards',
      });
      await animation.finished.catch(() => undefined);
      dialog.close();
      animation.cancel();
    } else {
      dialog.close();
    }
    links[index]?.focus();
    closing = false;
  }

  async function step(direction: 1 | -1, fromOffset = 0): Promise<void> {
    await show((index + direction + links.length) % links.length);
    if (reducedMotion.matches) return;
    const start = fromOffset || direction * num('--slide-travel');
    image.animate([{ transform: `translateX(${start}px)` }, { transform: 'none' }], {
      duration: num('--dur-base'),
      easing: ease('--ease-out'),
    });
  }

  links.forEach((link, at) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      void open(at);
    }),
  );

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    void close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') void step(1);
    if (event.key === 'ArrowLeft') void step(-1);
  });

  dialog.querySelector('[data-close]')?.addEventListener('click', () => void close());
  for (const button of dialog.querySelectorAll<HTMLButtonElement>('[data-step]')) {
    button.addEventListener('click', () => void step(button.dataset.step === '-1' ? -1 : 1));
  }

  let startX: number | null = null;
  let moved = 0;

  stage.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    moved = 0;
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener('pointermove', (event) => {
    if (startX === null) return;
    moved = event.clientX - startX;
    image.style.transform = `translateX(${moved}px)`;
  });

  stage.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    startX = null;
    image.style.transform = '';
    if (Math.abs(moved) >= SWIPE_DISTANCE) {
      void step(moved < 0 ? 1 : -1, -moved);
      return;
    }
    if (moved !== 0 && !reducedMotion.matches) {
      image.animate([{ transform: `translateX(${moved}px)` }, { transform: 'none' }], {
        duration: num('--dur-base'),
        easing: ease('--ease-out'),
      });
      return;
    }
    if (event.target === stage) void close();
  });
}

for (const gallery of document.querySelectorAll<HTMLElement>('[data-gallery]')) setup(gallery);
