import Link from "next/link";

interface Game {
  title: string;
  description: string;
  logoUrl: string;
  link: string;
}

export default function GamesPage() {
  const games: Game[] = [
    {
      title: "Recycle Rush",
      description: "A fun recycling game",
      logoUrl: "/recycle-rush/recycle-rush-logo.png",
      link: "/games/recycle-rush",
    },
    {
      title: "Eco Strike",
      description: "An exciting environmental adventure",
      logoUrl: "/eco-strike/logo.png",
      link: "/games/eco-strike",
    },
    {
      title: "Eco Sprint",
      description: "Help plants grow and thrive",
      logoUrl: "/eco-sprint/logo.png",
      link: "/games/eco-sprint",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-blue-200 to-green-300">
      {/* Fun Header with Environmental Theme */}
      <div className="bg-gradient-to-r from-green-400 to-blue-400 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="mb-4">
            <span className="text-6xl">🌱</span>
            <span className="text-6xl mx-2">🎮</span>
            <span className="text-6xl">🌍</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Eco Games for Kids!
          </h1>
          <p className="text-xl text-white font-medium">
            Play games and save our planet! 🌟
          </p>
        </div>
      </div>

      {/* Games Section */}
      <div className="mx-auto px-4 py-12">
        <div className="flex flex-row gap-8 justify-center flex-wrap">
          {games.map((game) => (
            <div
              key={game.title}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-green-300 max-w-lg w-full"
            >
              {/* Colorful Header with Nature Elements */}
              <div className="bg-gradient-to-r from-green-400 via-blue-400 to-green-500 p-6 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-2xl animate-bounce">
                  🌳
                </div>
                <div className="absolute top-2 right-2 text-2xl animate-pulse">
                  ♻️
                </div>
                <div className="absolute bottom-2 left-4 text-xl animate-bounce delay-100">
                  🦋
                </div>
                <div className="absolute bottom-2 right-4 text-xl animate-pulse delay-200">
                  🌸
                </div>

                <div className="text-center relative z-10">
                  <img
                    src={game.logoUrl}
                    alt={`${game.title} logo`}
                    className="max-h-32 max-w-48 mx-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Game Content */}
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  {game.title}
                </h2>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {game.description}
                </p>

                {/* Fun Decorative Elements */}
                <div className="flex justify-center gap-4 mb-8">
                  <span className="text-3xl animate-spin-slow">🌍</span>
                  <span className="text-3xl animate-bounce">🎯</span>
                  <span className="text-3xl animate-pulse">⚡</span>
                </div>

                {/* Big Colorful Play Button */}
                <Link
                  href={game.link}
                  target="_blank"
                  className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-full text-2xl transform hover:scale-110 transition-all duration-300 shadow-2xl border-4 border-white"
                >
                  🎮 Let's Play! 🌟
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Fun Environmental Messages */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-300 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🌈</div>
            <h3 className="text-3xl font-bold text-green-700 mb-4">
              More Fun Coming Soon!
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              We're creating more awesome games to help you become an Earth
              Hero!
            </p>

            {/* Coming Soon Games Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl p-4 border-2 border-blue-300">
                <div className="text-4xl mb-2">🧮</div>
                <div className="text-lg font-bold text-blue-700">
                  Math Forest
                </div>
                <div className="text-sm text-blue-600">Count the trees!</div>
              </div>
              <div className="bg-gradient-to-b from-green-100 to-green-200 rounded-2xl p-4 border-2 border-green-300">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-lg font-bold text-green-700">
                  World Explorer
                </div>
                <div className="text-sm text-green-600">
                  Discover our planet!
                </div>
              </div>
              <div className="bg-gradient-to-b from-purple-100 to-purple-200 rounded-2xl p-4 border-2 border-purple-300">
                <div className="text-4xl mb-2">🔬</div>
                <div className="text-lg font-bold text-purple-700">
                  Nature Lab
                </div>
                <div className="text-sm text-purple-600">Science is fun!</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Footer */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="text-4xl mb-4">
            <span className="animate-pulse">🌱</span>
            <span className="animate-bounce mx-2">❤️</span>
            <span className="animate-pulse">🌍</span>
          </div>
          <p className="text-white text-xl font-medium">
            Play, Learn, and Save Our Beautiful Planet!
          </p>
          <p className="text-green-100 text-sm mt-2">
            Every game you play helps you become a nature superhero! 🦸‍♀️🦸‍♂️
          </p>
        </div>
      </div>
    </div>
  );
}
