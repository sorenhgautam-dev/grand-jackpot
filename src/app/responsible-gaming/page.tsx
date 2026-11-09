import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/ui/Logo";
import { PlaceholderTag } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Responsible Gaming", description: `Responsible gaming and eligibility information for ${siteConfig.name}.` };

export default function ResponsibleGamingPage() {
  return (
    <>
      <header className="border-b border-gold/20 bg-ink">
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label="Grand Jackpot Casino — home"><Logo /></Link>
          <Link href="/" className="btn btn-ghost !py-2.5">Back to site</Link>
        </div>
      </header>
      <main id="main" className="container-x max-w-3xl py-20">
        <h1 className="font-display text-5xl text-ivory">Responsible Gaming</h1>
        <span className="gold-rule mt-6 block h-px w-24 !bg-gold/70" />
        <div className="mt-6"><PlaceholderTag>Draft — to be reviewed by the venue and legal counsel</PlaceholderTag></div>
        <div className="mt-8 space-y-6 leading-relaxed text-muted">
          <p>Gaming should be entertainment, never a way to make money or solve financial problems. We encourage every guest to play within their means and to take breaks.</p>
          <h2 className="font-display text-2xl text-gold-light">Eligibility &amp; entry</h2>
          <p>{siteConfig.eligibilityNotice}</p>
          <h2 className="font-display text-2xl text-gold-light">Playing safely</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Set a budget and a time limit before you start, and stick to them.</li>
            <li>Never chase losses or gamble with money you need for essentials.</li>
            <li>Avoid gambling when upset, stressed, or under the influence of alcohol.</li>
            <li>Speak to a member of staff if you would like to take a break or step away.</li>
          </ul>
          <h2 className="font-display text-2xl text-gold-light">Support</h2>
          <p>[Local support organisations and helpline details — to be supplied and verified by the venue.]</p>
          <p className="text-sm">This website provides information and enquiry forms only. It does not offer deposits, withdrawals, wagering or gambling accounts.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
