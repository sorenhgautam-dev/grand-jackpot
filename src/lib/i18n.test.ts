import { describe, expect, it } from 'vitest';
import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { formatList, formatPhone, formatTime, formatWeekday } from './format';
import { fill, localePath } from './i18n';

describe('fill', () => {
  it('replaces named placeholders and leaves unknown ones', () => {
    expect(fill('Open now, until {time}', { time: '4:00 am' })).toBe('Open now, until 4:00 am');
    expect(fill('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });
});

describe('localePath', () => {
  it('leaves English at the root and prefixes Hindi', () => {
    expect(localePath('en')).toBe('/');
    expect(localePath('en', 'gaming')).toBe('/gaming/');
    expect(localePath('hi')).toBe('/hi/');
    expect(localePath('hi', '/gaming/baccarat/')).toBe('/hi/gaming/baccarat/');
  });
});

describe('format', () => {
  it('writes times the Indian way in both languages', () => {
    expect(formatTime('19:00', 'en')).toBe('7:00 pm');
    expect(formatTime(120, 'en')).toBe('2:00 am');
    expect(formatTime('20:00', 'hi')).toMatch(/8:00/);
  });

  it('names weekdays from Sunday', () => {
    expect(formatWeekday(0, 'en')).toBe('Sunday');
    expect(formatWeekday(5, 'en')).toBe('Friday');
  });

  it('groups Nepali mobile numbers', () => {
    expect(formatPhone('+9779705055910')).toBe('+977 970 505 5910');
    expect(formatPhone('+15551234567')).toBe('+15551234567');
  });

  it('joins lists with the language’s conjunction', () => {
    expect(formatList(['8:00 pm', '2:00 am'], 'en')).toBe('8:00 pm and 2:00 am');
  });
});

describe('strings', () => {
  it('has a Hindi string for every English key', () => {
    const keys = (value: unknown, prefix = ''): string[] =>
      value && typeof value === 'object'
        ? Object.entries(value).flatMap(([key, inner]) => keys(inner, `${prefix}${key}.`))
        : [prefix];
    expect(keys(hi)).toEqual(keys(en));
  });
});
