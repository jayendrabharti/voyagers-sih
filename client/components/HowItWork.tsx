"use client";

import React, { useState } from "react";

export default function HowItWorks() {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent(current === 0 ? 2 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === 2 ? 0 : current + 1);
    };

    return (
        <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-400 to-blue-500">
            {/* Fixed Header */}
            <h1 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-black font-bold text-xl bg-yellow-400 px-4 py-2 rounded z-50">
                How It Works
            </h1>

            {/* Slides Container */}
            <div className="w-full h-full mx-auto mt-5 overflow-hidden relative">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {/* Slide 1 */}
                    <div className="min-w-full flex flex-col items-center justify-center pt-32 rounded-lg text-black space-y-6">
                        <span className="text-9xl">🧠</span>
                        <div className="w-full max-w-xl bg-yellow-400 border-2 border-black p-8 shadow-lg text-black space-y-4 font-mono">
                            <h2 className="text-2xl font-bold">AI Creates Modules</h2>
                            <p>
                                From real-world news, science reports &amp; government advisories.
                            </p>
                            <div className="text-5xl">🎮</div>
                        </div>
                    </div>

                    {/* Slide 2 */}
                    <div className="min-w-full flex flex-col items-center justify-center pt-32 rounded-lg text-black space-y-6">
                        <img
                            src="/studylogo.png"
                            alt="Study Illustration"
                            className="w-60 h-60 mb-6"
                        />
                        <div className="w-full max-w-2xl bg-yellow-400 border-4 border-black p-8 shadow-lg text-black flex flex-col items-start space-y-4">
                            <h2 className="text-3xl font-bold tracking-widest">
                                Students Learn &amp; Play
                            </h2>
                            <p>
                                Students explore modules, play quizzes, debates &amp; challenges.
                            </p>
                        </div>
                    </div>

                    {/* Slide 3 */}
                    <div className="min-w-full flex flex-col items-center justify-center pt-32 rounded-lg text-black space-y-6">
                        <div className="text-7xl">🏆</div>
                        <div className="w-full max-w-2xl bg-yellow-400 border-4 border-black p-8 shadow-lg text-black flex flex-col items-start space-y-4">
                            <h2 className="text-3xl font-bold tracking-widest">Earn & Impact</h2>
                            <p>
                                Collect streaks, badges & real-world rewards for students.
                            </p>
                            <div className="bg-white p-4 rounded-lg shadow-inner">
                                Custom content for Slide 3
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black text-4xl font-bold px-3 z-20"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-4xl font-bold px-3 z-20"
                >
                    ▶
                </button>
            </div>

            {/* Dots */}
            <div className="flex space-x-3 mt-6 justify-center">
                {[0, 1, 2].map((index) => (
                    <span
                        key={index}
                        className={`w-4 h-4 rounded-full ${
                            index === current ? "bg-black" : "bg-gray-400"
                        }`}
                    ></span>
                ))}
            </div>

            {/* CTA Button */}
            <button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded hover:scale-105 transition z-50">
                Explore a Module ▶
            </button>
        </section>
    );
}
