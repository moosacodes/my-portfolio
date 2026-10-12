"use client";

import { motion, AnimatePresence } from "framer-motion";
import { APP_META, type AppId } from "@/lib/portfolio/data";
import { useWindows } from "@/lib/os/window-store";
import { AppContent } from "@/components/apps/AppContent";

export function MobileSheet() {
  const { mobileActive, closeApp, setMobileActive } = useWindows();
  const id = mobileActive;

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          key={id}
          role="dialog"
          aria-modal="true"
          aria-label={APP_META[id as AppId].title}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 36 }}
          className="absolute inset-x-0 bottom-0 top-10 z-40 flex flex-col bg-[var(--os-window)]"
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-3">
            <button
              type="button"
              onClick={() => {
                closeApp(id);
                setMobileActive(null);
              }}
              className="rounded-md px-2 py-1 text-sm text-zinc-400 hover:text-white"
              data-todd-safe
            >
              Close
            </button>
            <span className="font-display text-sm font-semibold text-white">
              {APP_META[id].title}
            </span>
            <span className="w-14" aria-hidden />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24">
            <AppContent id={id} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
