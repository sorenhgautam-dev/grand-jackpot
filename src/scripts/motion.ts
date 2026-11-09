/*
 * Pointer-driven motion for mice and trackpads: the chip cursor, buttons that lean toward
 * the pointer, photographs that tilt under it, and scenes (the hero, the packages felt)
 * that follow it in depth. Touch screens get none of this. Reduced motion keeps the cursor
 * but drops its lag, the tilt, the pull and the depth.
 */
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function token(element: Element, name: string, fallback: number): number {
  const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

function cursor(): void {
  const root = document.createElement('div');
  root.className = 'cursor';
  root.setAttribute('aria-hidden', 'true');
  const lag = document.createElement('div');
  lag.className = 'cursor-lag';
  lag.innerHTML = '<span class="cursor-ring"></span>';
  const pin = document.createElement('div');
  pin.className = 'cursor-pin';
  pin.innerHTML = '<span class="cursor-dot"></span>';
  root.append(lag, pin);
  document.body.append(root);
  document.documentElement.dataset.cursor = '';

  let x = 0;
  let y = 0;
  let lagX = 0;
  let lagY = 0;
  let frame = 0;

  const follow = (): void => {
    lagX += (x - lagX) * 0.2;
    lagY += (y - lagY) * 0.2;
    lag.style.transform = `translate3d(${lagX}px, ${lagY}px, 0)`;
    frame = Math.abs(x - lagX) + Math.abs(y - lagY) > 0.2 ? requestAnimationFrame(follow) : 0;
  };

  addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      pin.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!('visible' in root.dataset) || reduce.matches) {
        lagX = x;
        lagY = y;
        lag.style.transform = pin.style.transform;
      } else if (!frame) frame = requestAnimationFrame(follow);
      root.dataset.visible = '';

      const target = event.target instanceof Element ? event.target : null;
      root.dataset.state = target?.closest(
        'textarea, select, input:not([type="radio"], [type="checkbox"])',
      )
        ? 'text'
        : target?.closest('a, button, label, summary, [data-cursor-link]')
          ? 'link'
          : '';
    },
    { passive: true },
  );

  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) delete root.dataset.visible;
  });
  addEventListener('pointerdown', () => (root.dataset.down = ''));
  addEventListener('pointerup', () => delete root.dataset.down);
}

/** A photograph that tilts toward the pointer, lit where the pointer is. */
function tilt(element: HTMLElement): void {
  const zone = element.closest<HTMLElement>('[data-tilt-zone]') ?? element;
  const max = token(element, '--tilt-max', 7);

  zone.addEventListener('pointermove', (event) => {
    const box = element.getBoundingClientRect();
    const across = clamp((event.clientX - box.left) / box.width);
    const down = clamp((event.clientY - box.top) / box.height);
    element.style.setProperty('--ry', `${(across - 0.5) * 2 * max}deg`);
    element.style.setProperty('--rx', `${(0.5 - down) * 2 * max}deg`);
    element.style.setProperty('--gx', `${across * 100}%`);
    element.style.setProperty('--gy', `${down * 100}%`);
    element.dataset.tilting = '';
  });

  zone.addEventListener('pointerleave', () => {
    for (const name of ['--rx', '--ry', '--gx', '--gy']) element.style.removeProperty(name);
    delete element.dataset.tilting;
  });
}

/** A button that leans toward the pointer. */
function magnet(element: HTMLElement): void {
  const pull = token(element, '--magnet', 0.28);
  let box = element.getBoundingClientRect();

  element.addEventListener('pointerenter', () => {
    element.style.translate = '';
    box = element.getBoundingClientRect();
  });
  element.addEventListener('pointermove', (event) => {
    const dx = (event.clientX - (box.left + box.width / 2)) * pull;
    const dy = (event.clientY - (box.top + box.height / 2)) * pull;
    element.style.translate = `${dx}px ${dy}px`;
  });
  element.addEventListener('pointerleave', () => (element.style.translate = ''));
}

/** A scene that knows where the pointer is: --mx and --my run from -1 to 1. */
function scene(element: HTMLElement): void {
  element.addEventListener('pointermove', (event) => {
    const box = element.getBoundingClientRect();
    const across = (event.clientX - box.left) / box.width;
    const down = (event.clientY - box.top) / box.height;
    element.style.setProperty('--mx', ((across - 0.5) * 2).toFixed(3));
    element.style.setProperty('--my', ((down - 0.5) * 2).toFixed(3));
    element.style.setProperty('--px', `${(across * 100).toFixed(2)}%`);
    element.style.setProperty('--py', `${(down * 100).toFixed(2)}%`);
    element.dataset.pointing = '';
  });
  element.addEventListener('pointerleave', () => {
    element.style.setProperty('--mx', '0');
    element.style.setProperty('--my', '0');
    delete element.dataset.pointing;
  });
}

if (fine.matches) {
  cursor();
  if (!reduce.matches) {
    for (const element of document.querySelectorAll<HTMLElement>('[data-tilt]')) tilt(element);
    for (const element of document.querySelectorAll<HTMLElement>('.button, [data-magnetic]')) {
      magnet(element);
    }
    for (const element of document.querySelectorAll<HTMLElement>('[data-pointer]')) scene(element);
  }
}
