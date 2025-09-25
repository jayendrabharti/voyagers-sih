"use client";

import { useState } from "react";

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(2);

  const faqs = [
    { id: 1, question: "What is this platform about?", answer: "" },
    {
      id: 2,
      question: "How long does it take to see results?",
      answer:
        "It depends on the campaign type and your business goals. While some paid ads can show results in days, organic strategies like SEO or content marketing may take a few months.",
    },
    { id: 3, question: "Is there a free trial available?", answer: "" },
    { id: 4, question: "How secure is the platform?", answer: "" },
  ];

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-start p-8 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      {/* Tag */}
      <div className="relative z-10">
        <div className="bg-yellow-300 w-25 mx-auto px-auto flex justifycontent-center border border-black text-black px-4 py-1 rounded-lg font-medium mb-6">
          FAQs
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 text-center mb-4">
          Frequently Asked Question
        </h1>

        {/* Paragraph */}
        <p className="text-black text-center max-w-2xl mb-10 text-xl" style={{ fontFamily: "poppines" }}>
          As we couldn't find anything on the market that checked those boxes,
          we decided to build our own recruiting software. Our tool is easy to
          set up.
        </p>
      </div>

      {/* FAQ List */}
      <div className="relative text-xl z-10 w-full max-w-3xl space-y-6" style={{ fontFamily: "poppines" }}>
        {faqs.map((faq, index) => (
          <div key={faq.id}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setOpen(open === faq.id ? null : faq.id)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-300">
                  {String(faq.id).padStart(2, "0")}
                </span>
                <span className="text-lg font-bold text-black">
                  {faq.question}
                </span>
              </div>
              
            </div>

            {faq.answer && open === faq.id && (
              <p className="mt-2 ml-14 text-black text-sm max-w-2xl">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="relative z-10 mt-12">
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          <span>View all</span>
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
