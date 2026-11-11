/*
 * Marigold petals, thrown from a point on the screen: every click, and the wheel when it
 * lands. They are the petals of the garlands strung up for Tihar. This only places them;
 * styles/motion.css flies them and they remove themselves when they land.
 * Callers check for reduced motion first.
 */
const colours = ['#f2851d', '#f7a928', '#e0601b', '#f4c430'];

export function scatter(x: number, y: number, count = 8, reach = 40): void {
  const wedge = 360 / count;
  for (let index = 0; index < count; index += 1) {
    const petal = document.createElement('span');
    petal.className = 'click-petal';
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    petal.style.setProperty('--angle', `${wedge * index + Math.random() * wedge * 0.8}deg`);
    petal.style.setProperty('--reach', `${(reach * (0.7 + Math.random() * 0.6)).toFixed(1)}px`);
    petal.style.setProperty('--spin', `${Math.round(Math.random() * 360)}deg`);
    petal.style.setProperty('--petal', colours[index % colours.length] ?? '#f2851d');
    document.body.append(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}
