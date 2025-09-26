"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BotComponent from "./bot";

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Load user from localStorage when page mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Handle dashboard navigation
  const handleDashboardRedirect = () => {
    if (!user || !user.isLoggedIn) {
      alert("Please sign in first!");
      router.push("/auth-model");
      return;
    }

    if (user.role === "teacher") {
      router.push("/teacher-dashboard");
    } else {
      router.push("/student-dashboard");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex h-screen w-full flex-col items-center justify-center bg-cover bg-center px-4 text-center md:px-6"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
      }}
    >
      {/* Hero content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10"
      >
        {/* Heading box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="mb-10 inline-flex max-w-[950px] items-center justify-center rounded-4xl border border-black bg-yellow-300 px-2 py-2 shadow-[0_6px_0_#000] md:px-4 md:py-6"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base leading-snug text-black md:text-xl lg:text-3xl"
          >
            Learn. Play. Save the Planet.
          </motion.h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mb-10 max-w-2xl text-xs leading-relaxed text-white/95 md:text-sm lg:mb-20"
        >
          A Gamified platform that turns environmental education into fun
          challenges
        </motion.p>

        {/* Dashboard Button (Role-Based) */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 },
          }}
          whileTap={{
            scale: 0.95,
            y: 0,
            transition: { duration: 0.1 },
          }}
          onClick={handleDashboardRedirect}
          className="inline-flex items-center gap-4 rounded-full border-4 border-black bg-yellow-300 px-8 py-4 text-black shadow-[0_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          <span className="text-sm md:text-base">
            {user?.role === "teacher"
              ? "Teacher Dashboard"
              : user?.role === "student"
              ? "Student Dashboard"
              : "Go to Dashboard"}
          </span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-yellow-300"
            >
              <path d="M4 12a1 1 0 001 1h10.586l-3.293 3.293a1 1 0 101.414 1.414l5.003-5.003a1 1 0 000-1.414l-5.003-5.003a1 1 0 10-1.414 1.414L15.586 11H5a1 1 0 00-1 1z" />
            </svg>
          </motion.span>
        </motion.button>
      </motion.div>

      <BotComponent />
    </motion.section>
  );
}
