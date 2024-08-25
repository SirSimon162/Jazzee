"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaCheckCircle, FaGavel, FaDollarSign } from "react-icons/fa";

const steps = [
  {
    title: "Discover",
    description:
      "Browse a curated list of top-tier SaaS products across various categories.",
    icon: <FaSearch className="text-indigo-600 mb-4" />,
  },
  {
    title: "Select",
    description: "Choose vendors that best match your needs.",
    icon: <FaCheckCircle className="text-indigo-600 mb-4" />,
  },
  {
    title: "Negotiate",
    description:
      "Initiate a Dutch reverse auction and watch vendors compete to offer you the best price.",
    icon: <FaGavel className="text-indigo-600 mb-4" />,
  },
  {
    title: "Save",
    description:
      "Compare offers, select the best deal, and finalize your purchase.",
    icon: <FaDollarSign className="text-indigo-600 mb-4" />,
  },
];

const Works = () => {
  return (
    <div className="w-full mx-auto py-10 sm:py-20 px-4 bg-gradient-to-b from-indigo-100 to-blue-200 rounded-b-[20px] md:rounded-b-[100px]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-6xl font-bold text-center mb-8 text-black"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Simple, Transparent, and Buyer-Centric
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg text-center flex flex-col items-center justify-start"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="text-6xl">{step.icon}</p>
              <div className="text-xl sm:text-2xl font-bold mb-4 text-indigo-700">{`${step.title}`}</div>
              <p className="text-gray-700 max-w-[250px] text-lg">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Works;
