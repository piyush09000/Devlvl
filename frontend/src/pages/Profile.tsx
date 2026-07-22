import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { LEVEL_TITLES, XP_PER_LEVEL, DEVELOPER_CLASSES } from '../lib/constants';

const MOCK_BADGES = [
  { id: 1, icon: '🔥', name: 'Week Warrior', desc: '7-day streak', rarity: 'rare', unlocked: true },
  { id: 2, icon: '⚡', name: 'Speed Demon', desc: 'Solved in < 2 min', rarity: 'epic', unlocked: true },
  { id: 3, icon: '🧠', name: 'Big Brain', desc: '10 hard problems', rarity: 'legendary', unlocked: true },
  { id: 4, icon: '🛡️', name: 'Guild Protector', desc: 'Top guild contributor', rarity: 'rare', unlocked: true },
  { id: 5, icon: '👑', name: 'Hall of Fame', desc: 'Reached Leaderboard #1', rarity: 'legendary', unlocked: false },
  { id: 6, icon: '🌙', name: 'Night Owl', desc: '10 problems after midnight', rarity: 'uncommon', unlocked: false },
  { id: 7, icon: '🚀', name: 'Rocket Launch', desc: 'First submission', rarity: 'common', unlocked: true },
  { id: 8, icon: '🎯', name: 'Sharpshooter', desc: 'No wrong answers', rarity: 'epic', unlocked: false },
];

const MOCK_ACTIVITY = [
  { date: 'Today', action: 'Solved "Two Sum"', detail: '+150 XP', icon: '✅', color: 'text-emerald-400' },
  { date: 'Yesterday', action: 'Defeated Syntax Sentinel Boss', detail: '+500 XP', icon: '⚔️', color: 'text-red-400' },
  { date: '3 days ago', action: 'Reached Tier 15 on Battle Pass', detail: '🔥 Skin Unlocked', icon: '🎖️', color: 'text-amber-400' },
  { date: '5 days ago', action: 'Joined "Bug Hunters" Guild', detail: 'Social', icon: '🛡️', color: 'text-indigo-400' },
  { date: '1 week ago', action: 'Hit 7-day streak', detail: 'Badge Earned', icon: '🔥', color: 'text-orange-400' },
];

const MOCK_SOLVED = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', time: '1:42', xp: 150 },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', time: '3:15', xp: 150 },
  { id: 3, title: 'Merge Intervals', difficulty: 'Medium', time: '12:30', xp: 300 },
  { id: 4, title: 'LRU Cache', difficulty: 'Hard', time: '28:45', xp: 500 },
];

const RARITY_COLORS: Record<string, string> = {
  common: 'border-slate-600 text-slate-400',
  uncommon: 'border-emerald-500/50 text-emerald-400',
  rare: 'border-blue-500/50 text-blue-400',
  epic: 'border-fuchsia-500/50 text-fuchsia-400',
  legendary: 'border-amber-500/50 text-amber-400',
};

const RARITY_GLOW: Record<string, string> = {
  common: '',
  uncommon: 'shadow-[0_0_12px_rgba(52,211,153,0.3)]',
  rare: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
  epic: 'shadow-[0_0_12px_rgba(217,70,239,0.4)]',
  legendary: 'shadow-[0_0_16px_rgba(245,158,11,0.5)]',
};

const DIFF_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

type Tab = 'overview' | 'badges' | 'activity' | 'solved';

export default function Profile() {
  const { level, xp, currentStreak, devCoins } = useGameStore();
  const nextLevelXP = XP_PER_LEVEL(level + 1);
  const progressPercent = Math.min(100, Math.round((xp / nextLevelXP) * 100));

  const titleKeys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  const currentTitle = LEVEL_TITLES[titleKeys.find(k => level >= k) || 1];

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [equippedPet] = useState('🤖');

  const devClass = DEVELOPER_CLASSES[0]; // Mock: Wizard

  return (
    <div className="space-y-6 pb-12">
      {/* ── Profile Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900"
      >
        {/* Banner */}
        <div className="h-44 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.3) 0%, transparent 50%)'
            }}
          />
          {/* Edit Banner Button */}
          <button className="absolute top-3 right-3 px-3 py-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/10 hover:bg-black/50 transition-colors">
            ✏️ Edit Profile
          </button>
        </div>

        {/* Avatar Row */}
        <div className="px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-slate-900 flex items-center justify-center text-5xl shadow-2xl">
                {devClass.avatar}
              </div>
              {/* Pet on shoulder */}
              <div className="absolute -top-2 -right-3 text-2xl animate-bounce">{equippedPet}</div>
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>

            <div className="flex-1 pt-14 sm:pt-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-white">DevMaster_X</h1>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
                  {currentTitle}
                </span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                  {devClass.name}
                </span>
              </div>
              <p className="text-slate-400 text-sm">Full-stack developer by day, leetcode grinder by night. 🚀</p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 sm:ml-auto">
              {[
                { label: 'Level', value: level, color: 'text-indigo-400' },
                { label: 'Streak', value: `${currentStreak}🔥`, color: 'text-orange-400' },
                { label: 'DevCoins', value: `${devCoins}💎`, color: 'text-cyan-400' },
                { label: 'Solved', value: MOCK_SOLVED.length, color: 'text-emerald-400' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>{xp.toLocaleString()} XP</span>
              <span>Level {level + 1} → {nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-800 px-8 flex gap-1">
          {(['overview', 'badges', 'activity', 'solved'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold capitalize relative transition-colors
                ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="profile-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Card */}
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">📊 Combat Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Problems Solved', value: '142', icon: '✅', color: 'bg-emerald-500/10 text-emerald-400' },
                    { label: 'Accuracy Rate', value: '87%', icon: '🎯', color: 'bg-blue-500/10 text-blue-400' },
                    { label: 'Avg Solve Time', value: '8:32', icon: '⏱️', color: 'bg-purple-500/10 text-purple-400' },
                    { label: 'Bosses Defeated', value: '4', icon: '⚔️', color: 'bg-red-500/10 text-red-400' },
                    { label: 'Global Rank', value: '#342', icon: '🏆', color: 'bg-amber-500/10 text-amber-400' },
                    { label: 'Guild Rank', value: '#3', icon: '🛡️', color: 'bg-indigo-500/10 text-indigo-400' },
                  ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-xl p-4 flex items-center gap-3`}>
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="text-xl font-black">{s.value}</div>
                        <div className="text-xs opacity-70 font-medium">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pet & Class Info */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Developer Class</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{devClass.avatar}</div>
                    <div>
                      <div className="font-bold text-white">{devClass.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{devClass.bonus}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Active Pet</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">{equippedPet}</div>
                    <div>
                      <div className="font-bold text-white">AI Robot</div>
                      <div className="text-xs text-slate-400 mt-1">+5% XP on correct answers</div>
                      <div className="text-xs text-amber-400 font-bold mt-1">★ Legendary</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Current Guild</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🛡️</div>
                    <div>
                      <div className="font-bold text-white">Bug Hunters</div>
                      <div className="text-xs text-indigo-400 mt-0.5">Rank #3 globally</div>
                    </div>
                  </div>
                  <Link to="/guilds" className="mt-3 block text-center py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                    View Guild →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* BADGES TAB */}
          {activeTab === 'badges' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white">🏅 Badges ({MOCK_BADGES.filter(b => b.unlocked).length}/{MOCK_BADGES.length} Earned)</h2>
                <span className="text-xs text-slate-400">Hover a badge for details</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {MOCK_BADGES.map(badge => (
                  <motion.div
                    key={badge.id}
                    whileHover={badge.unlocked ? { scale: 1.05 } : {}}
                    className={`group relative p-5 rounded-2xl border-2 flex flex-col items-center gap-3 text-center transition-all duration-200
                      ${badge.unlocked
                        ? `${RARITY_COLORS[badge.rarity]} ${RARITY_GLOW[badge.rarity]} bg-slate-950`
                        : 'border-slate-800 bg-slate-950 opacity-40 grayscale'
                      }`}
                  >
                    <div className="text-4xl">{badge.icon}</div>
                    <div>
                      <div className="font-bold text-white text-sm">{badge.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{badge.desc}</div>
                      <div className={`text-[10px] font-black uppercase mt-2 ${RARITY_COLORS[badge.rarity].split(' ')[1]}`}>
                        {badge.rarity}
                      </div>
                    </div>
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-6">⚡ Recent Activity</h2>
              <div className="space-y-1">
                {MOCK_ACTIVITY.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{act.action}</div>
                      <div className="text-xs text-slate-500">{act.date}</div>
                    </div>
                    <div className={`text-sm font-bold ${act.color}`}>{act.detail}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SOLVED TAB */}
          {activeTab === 'solved' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white">✅ Solved Problems</h2>
                <div className="flex gap-2 text-xs">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <span key={d} className={`px-2 py-1 rounded-full border ${DIFF_COLORS[d]} font-bold`}>{d}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {MOCK_SOLVED.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      ✓
                    </div>
                    <Link to={`/problems/${p.id}`} className="flex-1 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {p.title}
                    </Link>
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${DIFF_COLORS[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">⏱ {p.time}</span>
                    <span className="text-xs font-bold text-amber-400">+{p.xp} XP</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
