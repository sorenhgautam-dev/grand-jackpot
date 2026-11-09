/* On the home page the header is clear over the hero and turns solid once the hero has scrolled away. */
const header = document.querySelector<HTMLElement>('[data-header]');
const hero = document.querySelector<HTMLElement>('[data-hero]');

if (header && hero) {
  const observer = new IntersectionObserver(
    ([entry]) => header.toggleAttribute('data-solid', !entry?.isIntersecting),
    { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
  );
  observer.observe(hero);
}
