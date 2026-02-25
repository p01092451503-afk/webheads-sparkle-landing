import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function HeroFloatingVisual({ children }: { children: ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center"
      style={{ transform: "translateX(40%)" }}
    >
      {children}
    </motion.div>
  );
}
