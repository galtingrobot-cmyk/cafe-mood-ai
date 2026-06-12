"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImage({ 
  src, 
  alt, 
  speed = 0.5,
  className = "" 
}: { 
  src: string; 
  alt: string; 
  speed?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 30}%`, `${speed * 30}%`]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img 
        style={{ y, scale: 1.2 + speed * 0.2 }} 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover origin-center" 
      />
    </div>
  );
}
