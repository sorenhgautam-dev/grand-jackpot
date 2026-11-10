/*
 * Reveals for everyone who hasn't asked for reduced motion, and a cursor for mice and trackpads.
 * See styles/motion.css: this script only marks elements; CSS does the moving.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** What reveals, and how. Photos that are a page's main image load eagerly and stay put. */
const targets: [selector: string, kind: 'heading' | 'photo' | 'item'][] = [
  ['main h2', 'heading'],
  ['main .photo[data-ratio]:not([data-priority], .stage)', 'photo'],
  ['main [data-stagger] > *', 'item'],
];

function reveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.in = '';
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  for (const [selector, kind] of targets) {
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      if (element.dataset.reveal) continue;
      element.dataset.reveal = kind;
      if (kind === 'item') {
        const index = [...(element.parentElement?.children ?? [])].indexOf(element);
        element.style.setProperty('--delay', `calc(${Math.min(index, 8)} * var(--stagger-item))`);
      }
      observer.observe(element);
    }
  }
}

function cursor(): void {
  const root = document.createElement('div');
  root.className = 'cursor';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<span class="cursor-dot"></span>';
  document.body.append(root);
  document.documentElement.dataset.cursor = '';

  let x = 0;
  let y = 0;
  let shownX = 0;
  let shownY = 0;
  let frame = 0;

  const follow = (): void => {
    shownX += (x - shownX) * 0.35;
    shownY += (y - shownY) * 0.35;
    root.style.transform = `translate3d(${shownX}px, ${shownY}px, 0)`;
    frame = Math.abs(x - shownX) + Math.abs(y - shownY) > 0.2 ? requestAnimationFrame(follow) : 0;
  };

  addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (!('visible' in root.dataset) || reduce) {
        shownX = x;
        shownY = y;
        root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      } else if (!frame) frame = requestAnimationFrame(follow);
      root.dataset.visible = '';

      const target = event.target instanceof Element ? event.target : null;
      root.dataset.state = target?.closest(
        'textarea, select, input:not([type="radio"], [type="checkbox"])',
      )
        ? 'text'
        : target?.closest('a, button, label, summary, [data-link-zone]')
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

if (!reduce && 'IntersectionObserver' in window) reveal();
if (fine) cursor();

// A module, so its names stay its own.
export {};
