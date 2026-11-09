/** Signature element: a tiered pagoda roofline flanked by gold rules. */
export function PagodaDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-5 ${className}`} aria-hidden="true">
      <span className="gold-rule h-px w-full max-w-[220px]" />
      <svg viewBox="0 0 64 30" className="h-6 w-14 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 2v4" />
        <path d="M22 11c4-.8 7-3 10-6 3 3 6 5.200 10 6" />
        <path d="M16 18c6-.8 12-4 16-8 4 4 10 7.200 16 8" />
        <path d="M10 25c8-.8 16-5 22-11 6 6 14 10.200 22 11" />
        <path d="M18 28h28" />
      </svg>
      <span className="gold-rule h-px w-full max-w-[220px]" />
    </div>
  );
}
