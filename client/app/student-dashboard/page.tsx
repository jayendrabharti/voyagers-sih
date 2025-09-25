import Image from "next/image";
import { Search, Bell, MessageCircle, User, Home, Grid, FileText, Flag, Trophy, Settings, Award, Star, Shield, Calendar, Play } from "lucide-react";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-600 via-green-500 to-blue-500 text-gray-800" style={{ fontFamily: "poppines" }}>
      {/* Sidebar */}
      <aside className="w-72 bg-green-900 text-white px-4 py-6 flex-shrink-0">
        <div className="text-sm font-semibold mb-6">Menu</div>
        <nav className="space-y-2">
          <NavItem icon={<Home size={18} />} label="Overview" active />
          <NavItem icon={<Grid size={18} />} label="Modules" />
          <NavItem icon={<FileText size={18} />} label="Assignments" />
          <NavItem icon={<Flag size={18} />} label="Missions" />
          <NavItem icon={<Trophy size={18} />} label="LeaderBoard" />
          <NavItem icon={<MessageCircle size={18} />} label="Messages" badge="2" />
          <NavItem icon={<Award size={18} />} label="Certificates" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8H9L12 2Z" fill="white" />
                <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" fill="white" opacity="0.12" />
              </svg>
            </div>
            <div className="text-white font-bold text-lg">ECO Play</div>
          </div>

          <div className="flex-1 mx-6">
            <h1 className="text-white text-2xl font-bold text-center">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-[420px] max-w-xs">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"><Search size={16} /></div>
              <input placeholder="Search Across Modules, Assignments, Missions, etc..." className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 placeholder-gray-500 focus:outline-none" />
            </div>

            <button className="relative bg-transparent p-2 rounded-full text-white hover:opacity-90">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-black rounded-full px-1">3</span>
            </button>

            <button className="bg-transparent p-2 rounded-full text-white">
              <MessageCircle size={18} />
            </button>

            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image src="/images/avatar.jpg" alt="avatar" width={36} height={36} className="object-cover" />
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Central column */}
            <main className="col-span-8">
              {/* Continue Learning */}
              <section className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
                <p className="text-sm text-gray-600 mb-4">Pick up where you left off</p>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  <LearningCard title="Solar System Adventure" progress={40} lessons={[1,2,3,4,5]} timeLeft="0:50 mins left" />
                  <LearningCard title="Ocean Ecology" progress={65} lessons={[1,2,3,4]} timeLeft="1:10 hrs left" />
                </div>
              </section>

              {/* Recommended Modules */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900">Recommended Modules</h2>
                <div className="text-sm text-gray-600 mb-4">Modules picked for you</div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  <RecommendedCard title="Forest and Rain" author="Dr. Ayesha" duration="2h 30m (10 Levels)" reward="+500 XP" rating={4.8} players={320} />
                  <RecommendedCard title="Wetlands Wonders" author="Dr. Kumar" duration="1h 20m (6 Levels)" reward="+250 XP" rating={4.6} players={120} />
                </div>
              </section>
            </main>

            {/* Right-hand stats panel */}
            <aside className="col-span-4 space-y-4 sticky top-6">
              {/* Student Profile Card */}
              <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-xl p-4 text-white shadow">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                    <Image src="/images/student.jpg" alt="student" width={64} height={64} className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Ajay Sharma</div>
                    <div className="text-xs opacity-90">Student • 8,979 Points</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                  </div>
                  <div className="text-xs mt-2">45% Profile Completed</div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <StatBox label="Streaks" value="54" icon={<Star size={18} />} />
                  <StatBox label="Missions" value="98" icon={<Shield size={18} />} />
                  <StatBox label="Rank" value="02" icon={<Trophy size={18} />} />
                </div>
              </div>

              {/* Weekly Streak */}
              <div className="bg-green-800 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-semibold"> <Calendar size={16} /> Weekly Streak</div>
                  <div className="text-xs">Sep 2025</div>
                </div>
                <div className="flex gap-2">
                  {renderWeekDays()}
                </div>
              </div>

              {/* Course Progress Row */}
              <div className="flex gap-3">
                <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                  <div className="font-semibold">3 Courses In Progress</div>
                  <div className="text-xs mt-1">Keep up the momentum</div>
                </div>
                <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                  <div className="font-semibold">13 Courses Completed</div>
                  <div className="text-xs mt-1">Great job!</div>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-white rounded-xl p-3">
                <div className="font-semibold mb-2">Badges</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center">★</div>
                  <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center">★</div>
                  <div className="w-12 h-12 rounded-full bg-indigo-300 flex items-center justify-center">★</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------------- Helper components ---------------------- */

function NavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${active ? 'bg-yellow-400 text-black' : 'hover:bg-green-800/60'}`}>
      <div className="flex items-center gap-3">
        <div className="opacity-95">{icon}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      {badge && <div className="bg-yellow-400 text-black rounded-full px-2 text-xs">{badge}</div>}
    </div>
  );
}

function LearningCard({ title, progress, lessons, timeLeft }: { title: string; progress: number; lessons: number[]; timeLeft: string }) {
  return (
    <div className="min-w-[320px] bg-purple-600 text-white rounded-xl p-4 flex flex-col shadow-lg">
      <div className="font-semibold text-lg mb-2">{title}</div>
      <div className="text-xs mb-3">{lessons.length}/5 lessons</div>
      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden mb-2">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-xs opacity-90 mb-4">{timeLeft} • Keep going to Unlock Solar Badge</div>
      <div className="mt-auto">
        <button className="w-full py-2 rounded-md bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2">
          <Play size={14} /> Continue Module
        </button>
      </div>
    </div>
  );
}

function RecommendedCard({ title, author, duration, reward, rating, players }: { title: string; author: string; duration: string; reward: string; rating: number; players: number }) {
  return (
    <div className="min-w-[380px] bg-white rounded-xl shadow p-0 overflow-hidden">
      <div className="relative h-44">
        <Image src="/images/foliage.jpg" alt="foliage" fill className="object-cover" />
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">7:09</div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">30:00</div>
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm text-gray-500">By - {author}</div>
        <div className="text-sm text-gray-600 mt-2">Duration: {duration}</div>
        <div className="text-sm text-gray-600">Reward: {reward}</div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-400 font-semibold">★ Unlock Forest Explorer</div>
            <div className="text-sm text-gray-500">{rating} ({players} players)</div>
          </div>
          <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold">Start Now</button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/20 rounded-md p-3">
      <div className="text-sm opacity-90">{label}</div>
      <div className="flex items-center gap-2 font-bold text-lg">{icon} <span>{value}</span></div>
    </div>
  );
}

function renderWeekDays() {
  const days = [20,21,22,23,24,25,26];
  return days.map((d, i) => (
    <div key={i} className={`w-9 h-9 rounded ${i < 4 ? 'bg-purple-500' : 'bg-white text-gray-800'} flex items-center justify-center font-semibold`}>
      <div className="text-xs">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div>
      <div className="text-sm">{d}</div>
    </div>
  ));
}
