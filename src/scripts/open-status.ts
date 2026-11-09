import { formatTime, formatWeekday } from '../lib/format';
import { openStatus, type WeeklyHours } from '../lib/hours';
import { fill, isLocale, type Locale } from '../lib/locale';

interface StatusConfig {
  locale: Locale;
  hours: WeeklyHours;
  timeZone: string;
  strings: {
    always: string;
    openUntil: string;
    opensToday: string;
    opensTomorrow: string;
    opensOn: string;
    closed: string;
  };
}

const MINUTE = 60_000;

function describe({ locale, hours, timeZone, strings }: StatusConfig, now: Date): [string, string] {
  const status = openStatus(hours, now, timeZone);
  switch (status.state) {
    case 'always':
      return ['open', strings.always];
    case 'open':
      return ['open', fill(strings.openUntil, { time: formatTime(status.until, locale) })];
    case 'closed':
      return ['closed', strings.closed];
    case 'opens': {
      const time = formatTime(status.at, locale);
      if (status.day === 'today') return ['closed', fill(strings.opensToday, { time })];
      if (status.day === 'tomorrow') return ['closed', fill(strings.opensTomorrow, { time })];
      return ['closed', fill(strings.opensOn, { day: formatWeekday(status.day, locale), time })];
    }
  }
}

function render(): void {
  const now = new Date();
  for (const element of document.querySelectorAll<HTMLElement>('[data-open-status]')) {
    const config = JSON.parse(element.dataset.config ?? '{}') as StatusConfig;
    if (!isLocale(config.locale)) continue;
    const live = element.querySelector<HTMLElement>('[data-live]');
    const fallback = element.querySelector<HTMLElement>('[data-fallback]');
    if (!live || !fallback) continue;
    const [state, text] = describe(config, now);
    live.textContent = text;
    element.dataset.state = state;
    live.hidden = false;
    fallback.hidden = true;
  }
}

render();
setTimeout(
  () => {
    render();
    setInterval(render, MINUTE);
  },
  MINUTE - (Date.now() % MINUTE),
);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') render();
});
