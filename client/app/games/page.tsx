"use client";
import LogoLoop, { LogoItem } from "@/components/LogoLoop";
import Image from "next/image";
import { ImPacman } from "react-icons/im";
import { FaTrophy } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { SiNintendo3Ds } from "react-icons/si";
import { SlBadge } from "react-icons/sl";
import Link from "next/link";

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
    <main className="flex flex-col justify-between h-full min-h-screen bg-[#141219]">
      {/* navbar */}
      <nav className="sticky top-0 bg-gradient-to-r from-green-400 to-sky-400 shadow-lg z-50 px-6 py-2 flex items-center justify-between">
        <Image
          src="/eco-play-logo-small.png"
          alt="ECO Play Logo"
          width={100}
          height={100}
          className="size-15"
        />
        <span
          className={`text-xl text-yellow-300 drop-shadow-[1px_1px_0px_black]`}
        >
          Games & Missions
        </span>

        <span
          className={`p-2 rounded-full aspect-square bg-zinc-500 bg-opacity-20 text-black font-bold`}
        >
          U
        </span>
      </nav>

      <div className="w-full overflow-x-auto overflow-y-hidden py-8">
        <div className="flex flex-row gap-6 px-6 min-w-max scroll-smooth snap-x snap-mandatory">
          {Games.map((game, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[320px] rounded-2xl shadow-2xl bg-gradient-to-b from-slate-700 to-slate-900 overflow-hidden border border-slate-600 snap-start origin-left"
            >
              {/* Game Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={game.thumbnailUrl ?? game.logoUrl}
                  alt={`${game.title} Logo`}
                  width={320}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 text-center space-y-4">
                {/* Title */}
                <h3 className={`text-2xl font-bold text-green-400 mb-4`}>
                  {game.title}
                </h3>

                {/* Description */}
                <p className="text-white text-xs leading-relaxed font-extralight">
                  {game.description}
                </p>

                {/* Tagline with game controller icons */}
                {game.tagline && (
                  <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs font-bold">
                    <IoGameController size={18} />
                    <span>{game.tagline}</span>
                    <IoGameController size={18} />
                  </div>
                )}

                {/* Play Button */}
                <Link
                  href={game.link}
                  className="inline-block w-full mt-6"
                  target="_blank"
                >
                  <button className="w-full bg-gradient-to-b from-orange-600 to-yellow-300 hover:from-yellow-300 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                    Play
                  </button>
                </Link>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-[320px] rounded-2xl shadow-2xl bg-gradient-to-b from-slate-700 to-slate-900 overflow-hidden border border-slate-600 flex flex-col items-center justify-center gap-4 snap-start">
            <span className="text-xl text-white ">More Games</span>
            <span className="text-sm text-zinc-400">Coming soon...</span>
          </div>
        </div>
      </div>

      {/* footer logo loop */}
      <div className="relative overflow-hidden py-4">
        <LogoLoop
          logos={FooterLogos}
          speed={80}
          direction="left"
          logoHeight={40}
          gap={40}
          fadeOut
        />
      </div>
    </main>
  );
}
