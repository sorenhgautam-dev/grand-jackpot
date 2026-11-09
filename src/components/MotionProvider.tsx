"use client";

import { MotionConfig } from "framer-motion";

/** Respects the OS "reduce motion" setting globally (transforms are disabled, fades remain). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
