"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoMark } from "./ui/Logo";

const KEY = "gj-preloaded";

/** Short branded loader. Shown once per session; never blocks content for more than ~1.6s. */
export function Preloader() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen || reduce) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
    }, 1600);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading Grand Jackpot"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink bg-dhaka"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <LogoMark className="h-20 w-20" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.38em" }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="gold-text mt-6 font-display text-xl font-semibold"
          >
            GRAND JACKPOT
          </motion.p>
          <div className="mt-8 h-px w-48 overflow-hidden bg-gold/20">
            <motion.div className="h-full bg-gold" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.4, ease: "easeInOut" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
