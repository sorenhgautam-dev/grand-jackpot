/*
 * What's on filters: type and month chips over the dated list.
 * The chips only appear with JavaScript; without it the whole list shows.
 * Filtering runs inside a view transition where supported, so rows slide to their new places.
 */
import { formatMonth } from '../lib/format';
import { fill, isLocale, type Locale } from '../lib/locale';

const root = document.querySelector<HTMLElement>('[data-filters]');
const schedule = document.querySelector<HTMLElement>('[data-schedule]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (root && schedule && isLocale(root.dataset.locale)) init(root, schedule, root.dataset.locale);

function init(root: HTMLElement, schedule: HTMLElement, locale: Locale): void {
  const monthOptions = root.querySelector<HTMLElement>('[data-month-options]');
  const monthTemplate = root.querySelector<HTMLTemplateElement>('template[data-month-chip]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const empty = schedule.querySelector<HTMLElement>('[data-empty]');

  const selected = (name: string) =>
    root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? 'all';

  function renderMonths(): void {
    if (!monthOptions || !monthTemplate) return;
    const months = [
      ...new Set(
        [...schedule.querySelectorAll<HTMLElement>('[data-month]')].map(
          (day) => day.dataset.month ?? '',
        ),
      ),
    ];
    const previous = selected('month');
    monthOptions.querySelectorAll('[data-month-value]').forEach((chip) => chip.remove());
    for (const month of months) {
      const chip = monthTemplate.content.firstElementChild?.cloneNode(true);
      if (!(chip instanceof HTMLElement)) continue;
      const input = chip.querySelector('input');
      const label = chip.querySelector('label');
      if (!input || !label) continue;
      chip.dataset.monthValue = month;
      input.value = month;
      input.id = `month-${month}`;
      input.checked = month === previous;
      label.htmlFor = input.id;
      label.textContent = formatMonth(month, locale);
      monthOptions.append(chip);
    }
    if (!months.includes(previous)) {
      const all = monthOptions.querySelector<HTMLInputElement>('input[value="all"]');
      if (all) all.checked = true;
    }
    const fieldset = monthOptions.closest('fieldset');
    if (fieldset) fieldset.hidden = months.length < 2;
  }

  function apply(): void {
    const type = selected('type');
    const month = selected('month');
    let shown = 0;
    for (const day of schedule.querySelectorAll<HTMLElement>('[data-days] > [data-date]')) {
      const monthMatches = month === 'all' || day.dataset.month === month;
      let shownInDay = 0;
      for (const row of day.querySelectorAll<HTMLElement>('[data-type]')) {
        const show = monthMatches && (type === 'all' || row.dataset.type === type);
        row.hidden = !show;
        if (show) shownInDay += 1;
      }
      day.hidden = shownInDay === 0;
      shown += shownInDay;
    }
    if (empty) empty.hidden = shown > 0;
    if (count) count.textContent = fill(count.dataset.template ?? '', { n: shown });
  }

  /** Gives every row a temporary transition name so the list reflows smoothly. */
  function update(): void {
    if (!document.startViewTransition || reducedMotion.matches) {
      apply();
      return;
    }
    const named = [
      ...schedule.querySelectorAll<HTMLElement>('[data-days] [data-date], [data-type]'),
    ];
    named.forEach((element, index) => (element.style.viewTransitionName = `filter-${index}`));
    const transition = document.startViewTransition(apply);
    void transition.finished.finally(() =>
      named.forEach((element) => (element.style.viewTransitionName = '')),
    );
  }

  root.addEventListener('change', update);
  schedule.querySelector('[data-clear]')?.addEventListener('click', () => {
    root
      .querySelectorAll<HTMLInputElement>('input[value="all"]')
      .forEach((input) => (input.checked = true));
    update();
    root.querySelector<HTMLInputElement>('input[name="type"]')?.focus();
  });
  schedule.addEventListener('schedule:rendered', () => {
    renderMonths();
    apply();
  });

  renderMonths();
  apply();
}
