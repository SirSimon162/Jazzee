"use client";
import { useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { motion } from "framer-motion";

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-gradient-to-b from-white to-white sm:to-[rgba(255,255,255,0.7)] backdrop-blur-md w-full sm:w-[90%] fixed top-0 sm:top-4 z-50 shadow-md sm:rounded-full px-2"
    >
      <div className="mx-auto px-2 md:px-4 py-2 md:py-4 flex justify-between items-center">
        <motion.a
          href="/"
          className="flex items-center font-black text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Jazzee
        </motion.a>
        <div className="hidden md:flex items-center gap-x-10 font-medium">
          <motion.a
            to="/"
            className=" cursor-pointer  text-gray-900 hover:text-blue-700"
          >
            Home
          </motion.a>
          <motion.a
            href="#about"
            className=" text-gray-900 hover:text-blue-700"
          >
            About
          </motion.a>
          <motion.a href="#faq" className=" text-gray-900 hover:text-blue-700">
            FAQ
          </motion.a>
          <motion.a
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-full text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] font-semibold"
            href="/signup"
          >
            Sign In
          </motion.a>
        </div>
        <div className="md:hidden block">
          <Hamburger
            toggled={isMobileMenuOpen}
            toggle={setIsMobileMenuOpen}
            size={25}
            rounded
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            y: isMobileMenuOpen ? 0 : "-100%",
          }}
          transition={{ type: "spring", stiffness: 120 }}
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:hidden absolute top-[62px] left-0 right-0 z-30 h-screen flex flex-col items-center bg-white`}
        >
          <div className="flex flex-col items-center gap-y-9 pt-12 font-medium">
            <motion.a
              to="/"
              className="block cursor-pointer text-gray-900 hover:text-blue-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              Home
            </motion.a>
            <motion.a
              href="#about"
              className="block text-gray-900 hover:text-blue-700"
            >
              About
            </motion.a>
            <motion.a
              href="#faq"
              className="block text-gray-900 hover:text-blue-700"
            >
              FAQs
            </motion.a>
            <motion.button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-full text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] font-bold">
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default NavBar;
