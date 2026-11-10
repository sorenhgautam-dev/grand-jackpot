/* On the home page the header is clear over the hero at the very top, and turns solid as soon
   as the page scrolls, so the hero's words never slide under the logo and links. */
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
