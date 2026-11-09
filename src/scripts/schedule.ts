import { formatDateLong, formatTime } from '../lib/format';
import { upcoming, zoneOffset, type Recurring } from '../lib/hours';
import type { Locale } from '../lib/locale';

interface ScheduleConfig {
  locale: Locale;
  timeZone: string;
  days: number;
  limit: number | null;
  shareTitles: boolean;
  items: Recurring[];
}

/**
 * The build lists events from the day it ran. In the browser the list is redrawn
 * from today, in the casino's timezone, using the same row templates.
 */
export function renderSchedule(schedule: HTMLElement): void {
  const config = JSON.parse(schedule.dataset.schedule ?? '{}') as ScheduleConfig;
  const all = upcoming(config.items, new Date(), config.timeZone, config.days);
  const occurrences = config.limit ? all.slice(0, config.limit) : all;
  const key = occurrences.map((o) => `${o.date}T${o.time}${o.id}`).join();
  if (schedule.dataset.rendered === key) return;

  const dayTemplate = schedule.querySelector<HTMLTemplateElement>('template[data-day-template]');
  const target = schedule.querySelector<HTMLElement>('[data-days]');
  if (!dayTemplate || !target) return;

  const fragment = document.createDocumentFragment();
  const shared = new Set<string>();
  let rows: HTMLElement | null = null;
  let currentDate = '';

  for (const occurrence of occurrences) {
    if (occurrence.date !== currentDate) {
      currentDate = occurrence.date;
      const day = dayTemplate.content.firstElementChild?.cloneNode(true);
      if (!(day instanceof HTMLElement)) return;
      day.dataset.date = occurrence.date;
      day.dataset.month = occurrence.date.slice(0, 7);
      const label = day.querySelector('[data-field="date"]');
      if (label) label.textContent = formatDateLong(occurrence.date, config.locale);
      rows = day.querySelector('[data-rows]');
      fragment.append(day);
    }

    const template = schedule.querySelector<HTMLTemplateElement>(
      `template[data-row-template="${occurrence.id}"]`,
    );
    const row = template?.content.firstElementChild?.cloneNode(true);
    if (!(row instanceof HTMLElement) || !rows) continue;
    const time = row.querySelector<HTMLTimeElement>('[data-field="time"]');
    if (time) {
      const noon = new Date(`${occurrence.date}T12:00:00Z`);
      time.dateTime = `${occurrence.date}T${occurrence.time}${zoneOffset(noon, config.timeZone)}`;
      time.textContent = formatTime(occurrence.time, config.locale);
    }
    const title = row.querySelector<HTMLElement>('a');
    if (title && config.shareTitles && !shared.has(occurrence.id)) {
      title.style.viewTransitionName = `event-${occurrence.id}-title`;
      shared.add(occurrence.id);
    }
    rows.append(row);
  }

  target.replaceChildren(fragment);
  schedule.dataset.rendered = key;
  schedule.dispatchEvent(new CustomEvent('schedule:rendered', { bubbles: true }));
}
