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
          className="absolute inset-x-0 bottom-0 top-11 z-40 flex flex-col border-t border-white/10 bg-[#050805]"
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#070a07] px-4">
            <button
              type="button"
              onClick={() => {
                closeApp(id);
                setMobileActive(null);
              }}
              className="rounded-md px-1 py-1 text-[13px] text-white/40 hover:text-white"
              data-todd-safe
            >
              Close
            </button>
            <span className="font-display text-[14px] font-semibold tracking-[-0.02em] text-white">
              {APP_META[id].title}
            </span>
            <span className="w-12" aria-hidden />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#050805] p-5 pb-28">
            <AppContent id={id} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
