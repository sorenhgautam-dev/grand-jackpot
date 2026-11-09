import { describe, expect, it } from 'vitest';
import { openStatus, upcoming, zonedParts, zoneOffset, type WeeklyHours } from './hours';

const allDay = [{ open: '00:00', close: '24:00' }];
const everyDay: WeeklyHours = [allDay, allDay, allDay, allDay, allDay, allDay, allDay];

const lateNight = [{ open: '12:00', close: '04:00' }];
// Closed on Sunday, open noon to 4:00 the next morning Monday to Saturday.
const lateHours: WeeklyHours = [
  [],
  lateNight,
  lateNight,
  lateNight,
  lateNight,
  lateNight,
  lateNight,
];

describe('zonedParts', () => {
  it('reads wall-clock time in Kathmandu, which is UTC+5:45', () => {
    // 18:15 UTC on Monday 9 November 2026 is midnight on Tuesday in Kathmandu.
    expect(zonedParts(new Date('2026-11-09T18:15:00Z'), 'Asia/Kathmandu')).toEqual({
      weekday: 2,
      minutes: 0,
      date: '2026-11-10',
    });
  });

  it('follows daylight saving changes', () => {
    // London moves from GMT to BST at 01:00 UTC on 29 March 2026.
    expect(zonedParts(new Date('2026-03-29T00:30:00Z'), 'Europe/London').minutes).toBe(30);
    expect(zonedParts(new Date('2026-03-29T01:30:00Z'), 'Europe/London').minutes).toBe(150);
  });
});

describe('openStatus', () => {
  it('reports a venue that never closes', () => {
    expect(openStatus(everyDay, new Date('2026-11-09T12:00:00Z'), 'Asia/Kathmandu')).toEqual({
      state: 'always',
    });
  });

  it('keeps a venue open past midnight on the previous day’s hours', () => {
    // Tuesday 01:00 in Kathmandu, still inside Monday's noon-to-4:00 opening.
    const now = new Date('2026-11-09T19:15:00Z');
    expect(openStatus(lateHours, now, 'Asia/Kathmandu')).toEqual({ state: 'open', until: 240 });
  });

  it('gives today’s opening time between closing and opening', () => {
    // Tuesday 05:00 in Kathmandu.
    const now = new Date('2026-11-09T23:15:00Z');
    expect(openStatus(lateHours, now, 'Asia/Kathmandu')).toEqual({
      state: 'opens',
      day: 'today',
      at: 720,
    });
  });

  it('runs Saturday’s hours into a closed Sunday', () => {
    // Sunday 03:00 in Kathmandu.
    const now = new Date('2026-11-14T21:15:00Z');
    expect(openStatus(lateHours, now, 'Asia/Kathmandu')).toEqual({ state: 'open', until: 240 });
  });

  it('points to tomorrow when today is closed', () => {
    // Sunday 05:00 in Kathmandu.
    const now = new Date('2026-11-14T23:15:00Z');
    expect(openStatus(lateHours, now, 'Asia/Kathmandu')).toEqual({
      state: 'opens',
      day: 'tomorrow',
      at: 720,
    });
  });

  it('names the weekday when the next opening is further away', () => {
    const weekdaysOnly: WeeklyHours = [[], [], [], [], [], lateNight, []];
    // Tuesday 10:00 in Kathmandu; next opening is Friday.
    const now = new Date('2026-11-10T04:15:00Z');
    expect(openStatus(weekdaysOnly, now, 'Asia/Kathmandu')).toEqual({
      state: 'opens',
      day: 5,
      at: 720,
    });
  });

  it('reports a venue with no hours as closed', () => {
    expect(openStatus([[], [], [], [], [], [], []], new Date(), 'Asia/Kathmandu')).toEqual({
      state: 'closed',
    });
  });

  it('handles a daylight saving jump inside opening hours', () => {
    const london: WeeklyHours = [
      [{ open: '12:00', close: '02:00' }],
      [],
      [],
      [],
      [],
      [],
      [{ open: '12:00', close: '02:00' }],
    ];
    // 00:30 GMT on Sunday 29 March: open on Saturday's hours.
    expect(openStatus(london, new Date('2026-03-29T00:30:00Z'), 'Europe/London')).toEqual({
      state: 'open',
      until: 120,
    });
    // An hour later the clocks read 02:30 BST, so the venue has closed.
    expect(openStatus(london, new Date('2026-03-29T01:30:00Z'), 'Europe/London')).toEqual({
      state: 'opens',
      day: 'today',
      at: 720,
    });
  });
});

describe('zoneOffset', () => {
  it('gives the offset for datetime attributes', () => {
    expect(zoneOffset(new Date('2026-11-09T12:00:00Z'), 'Asia/Kathmandu')).toBe('+05:45');
    expect(zoneOffset(new Date('2026-01-09T12:00:00Z'), 'Europe/London')).toBe('+00:00');
    expect(zoneOffset(new Date('2026-07-09T12:00:00Z'), 'Europe/London')).toBe('+01:00');
  });
});

describe('upcoming', () => {
  it('lists daily occurrences in order from now, in the venue’s timezone', () => {
    // 19:00 on Monday 9 November in Kathmandu.
    const now = new Date('2026-11-09T13:15:00Z');
    const list = upcoming(
      [
        { id: 'dance', times: ['19:00'] },
        { id: 'draw', times: ['20:00', '02:00'] },
      ],
      now,
      'Asia/Kathmandu',
      2,
    );
    expect(list.map((o) => `${o.date} ${o.time} ${o.id}`)).toEqual([
      '2026-11-09 19:00 dance',
      '2026-11-09 20:00 draw',
      '2026-11-10 02:00 draw',
      '2026-11-10 19:00 dance',
      '2026-11-10 20:00 draw',
    ]);
  });

  it('drops occurrences that have already started', () => {
    // 19:30 on Monday 9 November in Kathmandu.
    const now = new Date('2026-11-09T13:45:00Z');
    const list = upcoming([{ id: 'dance', times: ['19:00'] }], now, 'Asia/Kathmandu', 2);
    expect(list.map((o) => o.date)).toEqual(['2026-11-10']);
  });
});
