import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to landing 3 sec baad
    setTimeout(() => {
      navigate("/landing");
    }, 3000);
  }, [navigate]);

  const text = "synthsia";
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <motion.h1
        className="font-sans text-7xl md:text-9xl font-extrabold"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400 drop-shadow-lg">
          {letters.map((letter, index) => (
            <motion.span variants={child} key={index}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </span>
      </motion.h1>
    </div>
  );
};

export default SplashScreen;
