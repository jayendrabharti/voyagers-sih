"use client";

import React, { useState } from "react";

const categories = [
  "All",
  "Climate",
  "Weather",
  "Energy",
  "Biodiversity",
  "Pollution",
  "Sustainability",
  "Global Environmental",
];

const modules = [
  {
    title: "Floods & Droughts Explained",
    description: "Why too much or too little rain changes lives?",
    duration: "15 min",
    chapters: 3,
    missions: 2,
    image: "/1aa88a99fa3b9fa85a2c53c38088a1dc.jpg",
    category: "Climate",
  },
  {
    title: "Solar Energy Basics",
    description: "How solar power is changing the world.",
    duration: "12 min",
    chapters: 2,
    missions: 1,
    image: "/1aa88a99fa3b9fa85a2c53c38088a1dc.jpg",
    category: "Energy",
  },
  {
    title: "Biodiversity Matters",
    description: "Why protecting species is important.",
    duration: "10 min",
    chapters: 2,
    missions: 2,
    image: "/1aa88a99fa3b9fa85a2c53c38088a1dc.jpg",
    category: "Biodiversity",
  },
  {
    title: "Pollution Solutions",
    description: "Ways to reduce pollution in daily life.",
    duration: "8 min",
    chapters: 1,
    missions: 1,
    image: "/1aa88a99fa3b9fa85a2c53c38088a1dc.jpg",
    category: "Pollution",
  },
  {
    title: "Sustainability Steps",
    description: "Simple actions for a greener future.",
    duration: "14 min",
    chapters: 3,
    missions: 2,
    image: "/1aa88a99fa3b9fa85a2c53c38088a1dc.jpg",
    category: "Sustainability",
  },
];

export default function ExploreModule() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(0);

  // Filter modules by category
  const filteredModules =
    activeCategory === "All"
      ? modules
      : modules.filter((mod) => mod.category === activeCategory);

  // Pagination
  const cardsPerPage = 4;
  const totalPages = Math.ceil(filteredModules.length / cardsPerPage);

  // Current visible set
  const visibleModules = filteredModules.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  );

  // Reset page when category changes
  React.useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="min-h-screen text-black font-mono z-9"
        style={{
            backgroundImage: "url('/1aa88a99fa3b9fa85a2c53c38088a1dc.jpg')", 
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            }}
    >
     {/* Dark overlay (below content) */}
     <div className="absolute inset-0 bg-black/50 z-0"></div>
     
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-2 relative">
        <h1
          className="bg-yellow-400 px-8 py-3 rounded text-3xl font-bold tracking-widest"
          style={{ fontFamily: "monospace" }}
        >
          Explore Modules
        </h1>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-yellow-400 px-8 py-4 rounded-lg mx-auto w-fit mt-8 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold text-lg transition ${
              activeCategory === cat
                ? "bg-black text-yellow-400"
                : "bg-yellow-400 text-black"
            }`}
            style={{ fontFamily: "monospace" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Module Cards */}
      <div className="relative w-full flex items-center justify-center">
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className={`absolute left-0 z-10 top-1/2 -translate-y-1/2 bg-yellow-400 text-black rounded-full p-3 shadow-lg font-bold text-2xl transition ${
            page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-300"
          }`}
        >
          &#8592;
        </button>

        {/* Cards Row */}
        <div className="flex flex-row gap-8 px-8 w-full justify-center transition-all duration-700 ease-in-out min-h-[400px]">
          {visibleModules.map((mod, idx) => (
            <div
              key={idx}
              className="w-80 min-w-80 rounded-3xl overflow-hidden bg-yellow-400 shadow-lg flex flex-col flex-shrink-0"
            >
              <img
                src={mod.image}
                alt={mod.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6 flex flex-col justify-between h-full">
                <h2
                  className="text-xl font-bold mb-2 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  {mod.title}
                </h2>
                <p className="mb-4 text-black text-base">{mod.description}</p>
                <div className="mb-4 text-xs text-black space-y-1">
                  <div>🕒 Duration - {mod.duration}</div>
                  <div>📚 Chapters - {mod.chapters}</div>
                  <div>🎯 Missions - {mod.missions}</div>
                </div>
                <button
                  className="bg-black text-yellow-400 px-5 py-2 rounded-full font-bold text-base flex items-center gap-2 w-fit"
                  style={{ fontFamily: "monospace" }}
                >
                  Start Module <span>&#9654;</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className={`absolute right-0 z-10 top-1/2 -translate-y-1/2 bg-yellow-400 text-black rounded-full p-3 shadow-lg font-bold text-2xl transition ${
            page >= totalPages - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-yellow-300"
          }`}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
