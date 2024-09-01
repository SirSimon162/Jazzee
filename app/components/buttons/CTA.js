"use client";
import React from "react";
import { motion } from "framer-motion";

function CTA() {
  return (
    <motion.a
      className="p-[3px] relative"
      href="/marketplace"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg" />
      <div className="px-8 py-2 sm:px-16 sm:py-4 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent font-bold text-md sm:text-lg">
        Start Your Auction Now!
      </div>
    </motion.a>
  );
}

export default CTA;
