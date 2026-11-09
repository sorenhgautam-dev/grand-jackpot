"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { PlaceholderArt, type ArtVariant } from "./ui/PlaceholderArt";

export type GalleryItem = { variant: ArtVariant; caption: string };

export function Lightbox({ items, index, onClose, onChange }: { items: GalleryItem[]; index: number | null; onClose: () => void; onChange: (i: number) => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index! + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index! - 1 + items.length) % items.length);
      if (e.key === "Tab") {
        // Small focus trap across the three controls.
        const f = Array.from(document.querySelectorAll<HTMLElement>("[data-lb-focus]"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button data-lb-focus ref={closeBtn} type="button" onClick={onClose} aria-label="Close image viewer" className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center border border-gold/50 text-gold-light transition-colors hover:bg-gold/15 sm:right-8 sm:top-8">
            <X aria-hidden />
          </button>
          <button data-lb-focus type="button" onClick={(e) => { e.stopPropagation(); onChange((index! - 1 + items.length) % items.length); }} aria-label="Previous image" className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-gold/50 bg-ink/60 text-gold-light transition-colors hover:bg-gold/15 sm:left-8">
            <ChevronLeft aria-hidden />
          </button>
          <button data-lb-focus type="button" onClick={(e) => { e.stopPropagation(); onChange((index! + 1) % items.length); }} aria-label="Next image" className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-gold/50 bg-ink/60 text-gold-light transition-colors hover:bg-gold/15 sm:right-8">
            <ChevronRight aria-hidden />
          </button>
          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative aspect-[4/5] max-h-[82vh] w-full max-w-[min(100%,64vh)] border border-gold/40 shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaceholderArt variant={items[index!].variant} />
            <figcaption className="absolute -bottom-9 left-0 right-0 text-center text-sm text-muted" aria-live="polite">
              {items[index!].caption} &middot; {index! + 1} / {items.length}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
