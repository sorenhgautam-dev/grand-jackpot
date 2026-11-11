/*
 * Reveals for everyone who hasn't asked for reduced motion.
 * See styles/motion.css: this script only marks elements; CSS does the moving.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** What reveals, and how. Photos that are a page's main image load eagerly and stay put. */
const targets: [selector: string, kind: 'heading' | 'photo' | 'item' | 'draw'][] = [
  ['main h2', 'heading'],
  ['main .photo[data-ratio]:not([data-priority], .stage)', 'photo'],
  ['main [data-stagger] > *', 'item'],
  ['[data-draw]', 'draw'],
];

function reveal(): void {
  /*
   * Chrome measures only the visible part of an observed element, and a clipped heading or
   * photograph has none until it is revealed. So clipped kinds are watched through their
   * parent, which is never clipped, and revealed when the parent comes into view.
   */
  const waiting = new Map<Element, HTMLElement[]>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const element of waiting.get(entry.target) ?? []) element.dataset.in = '';
        waiting.delete(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  const watch = (element: HTMLElement, through: Element): void => {
    const list = waiting.get(through);
    if (list) list.push(element);
    else {
      waiting.set(through, [element]);
      observer.observe(through);
    }
  };

  for (const [selector, kind] of targets) {
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      if (element.dataset.reveal) continue;
      element.dataset.reveal = kind;
      if (kind === 'item') {
        const index = [...(element.parentElement?.children ?? [])].indexOf(element);
        element.style.setProperty('--delay', `calc(${Math.min(index, 8)} * var(--stagger-item))`);
        watch(element, element);
      } else {
        watch(element, element.parentElement ?? element);
      }
    }
  }
}

/** Every tap or click on something that does something throws a chip-edge ring from that point. */
function clicks(): void {
  addEventListener(
    'pointerdown',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target?.closest('a, button, label, summary')) return;
      const ring = document.createElement('span');
      ring.className = 'click-chip';
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      document.body.append(ring);
      ring.addEventListener('animationend', () => ring.remove());
    },
    { passive: true },
  );
}

if (!reduce && 'IntersectionObserver' in window) reveal();
if (!reduce) clicks();

// A module, so its names stay its own.
export {};
