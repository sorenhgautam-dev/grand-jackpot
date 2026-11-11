/* The header turns solid, and folds its row of links away, as soon as the page scrolls. Over the
   home hero it is clear until then, so the photograph shows through. */
const header = document.querySelector<HTMLElement>('[data-header]');

if (header) {
  let frame = 0;
  const update = (): void => {
    frame = 0;
    header.toggleAttribute('data-solid', scrollY > 8);
  };
  addEventListener('scroll', () => (frame ||= requestAnimationFrame(update)), { passive: true });
  update();
}
