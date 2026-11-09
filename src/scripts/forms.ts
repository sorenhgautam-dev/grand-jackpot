/*
 * Preview forms: inline errors when a field loses focus, a linked summary on submit,
 * and a confirmation in place of the form. Nothing is sent anywhere.
 */
import { site } from '../data/site';
import { zonedParts } from '../lib/hours';
import { fill } from '../lib/locale';

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type Messages = Record<
  | 'valueMissing'
  | 'selectMissing'
  | 'typeMismatchEmail'
  | 'patternMismatchPhone'
  | 'rangeUnderflow'
  | 'rangeOverflow'
  | 'dateUnderflow'
  | 'tooShort',
  string
>;

function messageFor(control: Control, messages: Messages): string {
  const { validity } = control;
  const field = control.dataset.fieldName ?? '';
  if (validity.valueMissing) {
    return fill(
      control instanceof HTMLSelectElement ? messages.selectMissing : messages.valueMissing,
      { field },
    );
  }
  if (validity.typeMismatch) return messages.typeMismatchEmail;
  if (validity.patternMismatch) return messages.patternMismatchPhone;
  if (validity.rangeUnderflow) {
    return control.type === 'date'
      ? messages.dateUnderflow
      : fill(messages.rangeUnderflow, { min: control.getAttribute('min') ?? '' });
  }
  if (validity.rangeOverflow)
    return fill(messages.rangeOverflow, { max: control.getAttribute('max') ?? '' });
  if (validity.tooShort)
    return fill(messages.tooShort, { min: control.getAttribute('minlength') ?? '' });
  return control.validationMessage;
}

function showError(control: Control, messages: Messages): boolean {
  const error = document.getElementById(control.dataset.errorId ?? '');
  const valid = control.checkValidity();
  const describedBy = new Set(
    (control.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean),
  );
  if (error) {
    error.textContent = valid ? '' : messageFor(control, messages);
    error.hidden = valid;
    if (valid) describedBy.delete(error.id);
    else describedBy.add(error.id);
  }
  control.setAttribute('aria-invalid', String(!valid));
  if (describedBy.size > 0) control.setAttribute('aria-describedby', [...describedBy].join(' '));
  else control.removeAttribute('aria-describedby');
  return valid;
}

function setup(wrapper: HTMLElement): void {
  const form = wrapper.querySelector('form');
  const summary = wrapper.querySelector<HTMLElement>('[data-summary]');
  const summaryTitle = wrapper.querySelector<HTMLElement>('[data-summary-title]');
  const summaryList = wrapper.querySelector<HTMLElement>('[data-summary-list]');
  const sentTemplate = wrapper.querySelector<HTMLTemplateElement>('template[data-sent]');
  if (!form || !summary || !summaryTitle || !summaryList || !sentTemplate) return;

  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;
  const controls = [...form.querySelectorAll<Control>('input, textarea, select')];
  form.noValidate = true;

  const today = zonedParts(new Date(), site.timezone).date;
  for (const control of controls) {
    if (control.type === 'date') control.setAttribute('min', today);
    let touched = false;
    control.addEventListener('blur', () => {
      if (control.value !== '' || touched) {
        touched = true;
        showError(control, messages);
      }
    });
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') showError(control, messages);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = controls.filter((control) => !showError(control, messages));
    if (invalid.length > 0) {
      summaryTitle.textContent =
        invalid.length === 1
          ? (form.dataset.summaryOne ?? '')
          : fill(form.dataset.summaryMany ?? '', { n: invalid.length });
      summaryList.replaceChildren(
        ...invalid.map((control) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${control.id}`;
          link.textContent = messageFor(control, messages);
          link.addEventListener('click', (click) => {
            click.preventDefault();
            control.focus();
          });
          item.append(link);
          return item;
        }),
      );
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;
    const value = (id: string | undefined) =>
      controls.find((control) => control.id === id)?.value.trim() ?? '';
    const sent = sentTemplate.content.firstElementChild?.cloneNode(true);
    if (!(sent instanceof HTMLElement)) return;
    for (const [selector, values] of [
      ['[data-sent-title]', { name: value(form.dataset.nameField) }],
      ['[data-sent-text]', { email: value(form.dataset.emailField) }],
    ] as const) {
      const element = sent.querySelector<HTMLElement>(selector);
      if (element) element.textContent = fill(element.dataset.template ?? '', values);
    }
    sent.querySelector('[data-again]')?.addEventListener('click', () => {
      form.reset();
      controls.forEach((control) => {
        control.removeAttribute('aria-invalid');
        const error = document.getElementById(control.dataset.errorId ?? '');
        if (error) error.hidden = true;
      });
      sent.replaceWith(form);
      controls[0]?.focus();
    });
    form.replaceWith(sent);
    sent.focus();
  });

  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    `a[data-choose][href="#${form.id}"]`,
  )) {
    link.addEventListener('click', () => {
      const select = form.querySelector<HTMLSelectElement>('select');
      if (select && link.dataset.choose) select.value = link.dataset.choose;
    });
  }
}

for (const wrapper of document.querySelectorAll<HTMLElement>('[data-preview-form]')) setup(wrapper);
