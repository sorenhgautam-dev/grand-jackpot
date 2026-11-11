/* "Coming up": names the next event on the floor and counts down to it, a second at a time. */
import { upcoming, zoneOffset, type Recurring } from '../lib/hours';

interface Config {
  items: Recurring[];
  timeZone: string;
  titles: Record<string, string>;
}

const pad = (value: number): string => String(value).padStart(2, '0');

for (const element of document.querySelectorAll<HTMLElement>('[data-next]')) {
  const { items, timeZone, titles } = JSON.parse(element.dataset.next ?? '{}') as Config;
  const name = element.querySelector<HTMLElement>('[data-name]');
  const clock = element.querySelector<HTMLElement>('[data-clock]');
  if (!name || !clock || !items?.length) continue;

  const tick = (): void => {
    const now = new Date();
    const [next] = upcoming(items, now, timeZone, 2);
    if (!next) return;
    const at = new Date(`${next.date}T${next.time}:00${zoneOffset(now, timeZone)}`);
    const seconds = Math.max(0, Math.floor((at.getTime() - now.getTime()) / 1000));
    name.textContent = titles[next.id] ?? '';
    clock.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
    element.hidden = false;
  };

  tick();
  setInterval(tick, 1000);
}
