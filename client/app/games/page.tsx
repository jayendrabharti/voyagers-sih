"use client";
import LogoLoop, { LogoItem } from "@/components/LogoLoop";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImPacman } from "react-icons/im";
import { FaTrophy } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { SiNintendo3Ds } from "react-icons/si";
import { SlBadge } from "react-icons/sl";
import Link from "next/link";
import { useRef, useState } from "react";
import UserButton from "@/components/UserButton";

interface Game {
  title: string;
  description: string;
  logoUrl: string;
  link: string;
  thumbnailUrl?: string;
  tagline?: string;
}

const Games: Game[] = [
  {
    title: "Recycle Rush",
    description: "Sort waste fast! Each correct pick = +10 points. ",
    logoUrl: "/recycle-rush/recycle-rush-logo.png",
    thumbnailUrl: "/recycle-rush/thumbnail.jpg",
    link: "/games/recycle-rush",
    tagline: "Play quicker, score higher!",
  },
  {
    title: "Eco Strike",
    description:
      "1v1 quiz battle! Correct answers = strike. Lose health, lose the game.",
    logoUrl: "/eco-strike/logo.png",
    thumbnailUrl: "/eco-strike/thumbnail.jpg",
    link: "/games/eco-strike",
    tagline: "Strike. Survive. Win.",
  },
  {
    title: "Eco Sprint",
    description:
      "Race your rival in a rapid-fire eco-quiz. Fastest brain wins the sprint!",
    logoUrl: "/eco-sprint/logo.png",
    thumbnailUrl: "/eco-sprint/thumbnail.jpg",
    link: "/games/eco-sprint",
    tagline: "Think Fast. Answer Faster.",
  },
];

const FooterLogos: LogoItem[] = [
  { node: <ImPacman color="#F5DA27" /> },
  { node: <FaTrophy color="#F5DA27" /> },
  { node: <IoGameController color="#F5DA27" /> },
  { node: <SiNintendo3Ds color="#F5DA27" /> },
  { node: <SlBadge color="#F5DA27" /> },
];

export default function GamesPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-between h-full min-h-screen bg-[#141219]"
    >
      {/* navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="sticky top-0 bg-gradient-to-r from-green-400 to-sky-400 shadow-lg z-50 px-6 py-2 flex items-center justify-between"
      >
        <Link href="/home">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/eco-play-logo-small.png"
              alt="ECO Play Logo"
              width={100}
              height={100}
              className="size-15"
            />
          </motion.div>
        </Link>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.4,
            type: "spring" as const,
            stiffness: 200,
          }}
          className={`text-xl text-yellow-300 drop-shadow-[1px_1px_0px_black]`}
        >
          Games & Missions
        </motion.span>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <UserButton />
        </motion.div>
      </motion.nav>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="w-full overflow-x-auto overflow-y-hidden py-8"
      >
        <motion.div className="flex flex-row gap-6 px-6 min-w-max scroll-smooth snap-x snap-mandatory">
          {Games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1 + index * 0.2,
                type: "spring" as const,
                stiffness: 100,
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="flex-shrink-0 w-[320px] rounded-2xl shadow-2xl bg-gradient-to-b from-slate-700 to-slate-900 overflow-hidden border border-slate-600 snap-start origin-left"
            >
              {/* Game Thumbnail */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative h-48 overflow-hidden"
              >
                <Image
                  src={game.thumbnailUrl ?? game.logoUrl}
                  alt={`${game.title} Logo`}
                  width={320}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Card Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
                className="p-6 text-center space-y-4"
              >
                {/* Title */}
                <motion.h3
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.2 }}
                  className={`text-2xl font-bold text-green-400 mb-4`}
                >
                  {game.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.6 + index * 0.2 }}
                  className="text-white text-xs leading-relaxed font-extralight"
                >
                  {game.description}
                </motion.p>

                {/* Tagline with game controller icons */}
                {game.tagline && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.8 + index * 0.2,
                      type: "spring" as const,
                    }}
                    className="flex items-center justify-center gap-2 text-yellow-400 text-xs font-bold"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <IoGameController size={18} />
                    </motion.div>
                    <span>{game.tagline}</span>
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <IoGameController size={18} />
                    </motion.div>
                  </motion.div>
                )}

                {/* Play Button */}
                <Link
                  href={game.link}
                  className="inline-block w-full mt-6"
                  target="_blank"
                >
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 2 + index * 0.2 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(251, 191, 36, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-b from-orange-600 to-yellow-300 hover:from-yellow-300 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                  >
                    Play
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 2.5,
              type: "spring" as const,
              stiffness: 100,
            }}
            whileHover={{
              y: -5,
              transition: { duration: 0.3 },
            }}
            className="flex-shrink-0 w-[320px] rounded-2xl shadow-2xl bg-gradient-to-b from-slate-700 to-slate-900 overflow-hidden border border-slate-600 flex flex-col items-center justify-center gap-4 snap-start"
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl text-white"
            >
              More Games
            </motion.span>
            <span className="text-sm text-zinc-400">Coming soon...</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* footer logo loop */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 3 }}
        className="relative overflow-hidden py-4"
      >
        <LogoLoop
          logos={FooterLogos}
          speed={80}
          direction="left"
          logoHeight={40}
          gap={40}
          fadeOut
        />
      </motion.div>
    </motion.main>
  );
}
