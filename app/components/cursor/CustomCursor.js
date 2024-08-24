"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMousePosition } from "./useMousePosition";

const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const cursorX = useMotionValue(x);
  const cursorY = useMotionValue(y);
  const springConfig = { damping: 20, stiffness: 100 };

  const springX1 = useSpring(cursorX, springConfig);
  const springY1 = useSpring(cursorY, springConfig);
  useEffect(() => {
    cursorX.set(x);
    cursorY.set(y);
  }, [x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
      style={{ translateX: springX1, translateY: springY1 }}
      transition={{ duration: 0.15 }}
    />
  );
};

export default CustomCursor;
