import type { Strings } from '../i18n/en';

type NavKey = keyof Strings['nav'];

export interface NavItem {
  key: NavKey;
  path: string;
}

/** The four sections in the header. */
export const primaryNav: readonly NavItem[] = [
  { key: 'gaming', path: '/gaming/' },
  { key: 'dining', path: '/dining/' },
  { key: 'whatsOn', path: '/whats-on/' },
  { key: 'packages', path: '/packages/' },
];

/** Every page, for the menu and the footer. */
export const secondaryNav: readonly NavItem[] = [
  { key: 'visit', path: '/visit/' },
  { key: 'about', path: '/about/' },
  { key: 'responsible', path: '/responsible-gaming/' },
  { key: 'contact', path: '/contact/' },
  { key: 'privacy', path: '/privacy/' },
];
