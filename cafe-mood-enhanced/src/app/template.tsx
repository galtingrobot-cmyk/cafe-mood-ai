"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CoffeeCupLoader = dynamic(() => import("@/components/CoffeeCupLoader"), {
  ssr: false,
  loading: () => <div className="w-[200px] h-[220px]" />,
});

const TIPS = [
  "Racikan terbaik butuh waktu ☕",
  "Memilih biji kopi terbaik untukmu...",
  "Sedikit sabar, kopi sedang diseduh 🫶",
  "AI Barista kami siap menemanimu!",
];

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 1800);
    const doneTimer = setTimeout(() => setIsLoading(false), 900);
    return () => { clearInterval(tipTimer); clearTimeout(doneTimer); };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-col items-center justify-center min-h-[60vh] select-none"
        >
          {/* Ambient glow behind cup */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-48 h-48 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, #c8a97e55, transparent 70%)" }}
            />
            <CoffeeCupLoader />
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-2xl font-bold font-serif text-amber-800 tracking-wide"
          >
            Kopi Mood
          </motion.h2>

          {/* Rotating tip */}
          <div className="mt-2 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-amber-600/80 text-center"
              >
                {TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Animated dots loader bar */}
          <div className="mt-5 flex gap-1.5">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-amber-600"
                animate={{ scaleY: [1, 2.2, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
