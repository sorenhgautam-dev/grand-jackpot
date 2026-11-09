import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "./ui/Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-gold/25 bg-ink pb-28 pt-16 sm:pb-16">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-wider2 text-gold-light">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <a href={`/${n.href}`} className="text-ivory/80 transition-colors hover:text-gold-light">{n.label}</a>
              </li>
            ))}
            <li>
              <Link href="/responsible-gaming" className="text-ivory/80 transition-colors hover:text-gold-light">Responsible Gaming</Link>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-wider2 text-gold-light">Visit</h2>
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">{siteConfig.contact.address}</p>
          <p className="text-sm text-muted">{siteConfig.contact.location}</p>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-gold/15 pt-6 text-xs leading-relaxed text-muted">
        <p>{siteConfig.eligibilityNotice}</p>
        <p className="mt-3">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved. This website is for information and enquiries only. No real-money play takes place on this site.</p>
      </div>
    </footer>
  );
}
