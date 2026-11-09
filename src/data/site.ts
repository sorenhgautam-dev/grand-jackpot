import type { WeeklyHours } from '../lib/hours';

const allDay = [{ open: '00:00', close: '24:00' }];

/**
 * Facts about the casino. Each one comes from the client's current site
 * (mkstudio1.my.canva.site/dahts3xixa4-grandjackpotcasino) or from the client directly.
 * `null` means the client hasn't supplied it yet; the interface writes around it.
 */
export const site = {
  name: 'Grand Jackpot Casino',
  hotel: 'Grand Hotel Kathmandu',
  address: {
    street: 'Soaltee Mode, Red Cross Marg 13',
    locality: 'Kathmandu',
    country: 'Nepal',
    countryCode: 'NP',
  },
  mapsQuery: 'Grand Jackpot Casino, Grand Hotel, Soaltee Mode, Kathmandu',
  timezone: 'Asia/Kathmandu',
  /** The client confirmed the casino is open around the clock. Index 0 is Sunday. */
  hours: [allDay, allDay, allDay, allDay, allDay, allDay, allDay] satisfies WeeklyHours,
  phones: ['+9779705055910', '+9779705055903'],
  email: null,
  entry: {
    foreignPassportRequired: true,
    free: true,
    minimumAge: null,
    entryCouponInr: 1000,
  },
  dressCode: null,
  regulator: null,
  licence: null,
  helplines: [],
  social: [],
  services: {
    freeParking: true,
    freeWifi: true,
    hotelPickup: true,
    airportTransfer: true,
  },
  people: {
    managingDirector: 'Rajan Bhujel',
    generalManager: 'Mahendra Poudel',
  },
} as const;

export type Site = typeof site;

/** Opens the visitor's maps app on the casino. */
export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
