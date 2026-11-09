/* Lazy photos stay transparent on their ground until decoded, then fade in. */
function reveal(image: HTMLImageElement): void {
  image.decode().then(
    () => (image.dataset.ready = ''),
    () => (image.dataset.ready = ''),
  );
}

for (const image of document.querySelectorAll<HTMLImageElement>('img[data-fade]')) {
  if (image.complete) reveal(image);
  else {
    image.addEventListener('load', () => reveal(image), { once: true });
    image.addEventListener('error', () => (image.dataset.ready = ''), { once: true });
  }
}
