import Image from "next/image";

export default function WhyThisPlatform() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-green-500 via-green-400 to-blue-500 flex flex-col items-center p-8">
      {/* Top heading */}
      <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-wide font-[pixel]">
        Why This Platform?
      </h1>

      {/* Subheading */}
      <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-12">
        Because learning about the Earth should be fun
      </h2>

      {/* Card Section */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
        {/* Card 1 */}
        <div className="flex flex-col bg-yellow-400 rounded-2xl shadow-lg p-6 w-full md:w-1/3 h-96">
        <div className="w-full h-40 relative mb-4">
            <Image
              src="/earth.png"
              alt="Pencils in holder"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-black font-bold text-lg mb-2">AI-Curated Modules</h3>
            <p className="text-black text-sm">
              Fresh content from real-world environmental news.
            </p>
          </div>
          <div className="flex justify-between mt-4 text-black text-lg">
            <span>★</span>
            <span>🎁</span>
            <span>👑</span>
            <span>🛡</span>
            <span>🚩</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col bg-yellow-400 rounded-2xl shadow-lg p-6 w-full md:w-1/3 h-96">
          <div className="w-full h-40 relative mb-4">
            <Image
              src="/earth.png"
              alt="Pencils in holder"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h3 className="text-black font-bold text-lg mb-2">Gamified Challenges</h3>
          <p className="text-black text-sm mb-4">
            Multiplayer modes, quizzes, debates.
          </p>
          <div className="flex justify-between mt-auto text-black text-lg">
            <span>★</span>
            <span>🎁</span>
            <span>👑</span>
            <span>🛡</span>
            <span>🚩</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col bg-yellow-400 rounded-2xl shadow-lg p-6 w-full md:w-1/3 h-96">
          <div className="w-full h-40 relative mb-4">
            <Image
              src="/earth.png"
              alt="Writing on notebook"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h3 className="text-black font-bold text-lg mb-2">Rewards & Streaks</h3>
          <p className="text-black text-sm mb-4">
            Badges, XP, and streaks to keep learning fun.
          </p>
          <div className="flex justify-between mt-auto text-black text-lg">
            <span>★</span>
            <span>🎁</span>
            <span>👑</span>
            <span>🛡</span>
            <span>🚩</span>
          </div>
        </div>
      </div>
    </div>
  );
}
