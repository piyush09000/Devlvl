import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mock Data ──────────────────────────────────────
const MOCK_GUILDS = [
  {
    id: 1, name: 'Bug Hunters', tag: 'BH', emoji: '🛡️', rank: 1,
    members: 24, maxMembers: 30, xpThisWeek: 48_200, totalXP: 1_240_000,
    description: 'Elite developers hunting bugs across all worlds. Strict entry — must be Level 20+.',
    tags: ['Competitive', 'Active', 'Top 1'],
    color: 'from-indigo-600 to-blue-700',
    joined: true,
  },
  {
    id: 2, name: 'Algo Ninjas', tag: 'AN', emoji: '🥷', rank: 2,
    members: 18, maxMembers: 25, xpThisWeek: 41_800, totalXP: 980_000,
    description: 'Algorithms are our art. We solve LeetCode hard problems before breakfast.',
    tags: ['Hard Problems', 'Friendly'],
    color: 'from-purple-600 to-fuchsia-700',
    joined: false,
  },
  {
    id: 3, name: 'Recursion Lords', tag: 'RL', emoji: '♾️', rank: 3,
    members: 15, maxMembers: 20, xpThisWeek: 35_000, totalXP: 720_000,
    description: 'We solve problems by solving smaller versions of them. Join if you love trees.',
    tags: ['Trees', 'Graphs', 'DP'],
    color: 'from-emerald-600 to-teal-700',
    joined: false,
  },
];

const GUILD_MEMBERS = [
  { name: 'DevMaster_X', level: 25, role: 'Guild Master', xp: 8200, avatar: '🧙‍♂️', online: true },
  { name: 'ByteKnight', level: 28, role: 'Officer', xp: 7100, avatar: '⚔️', online: true },
  { name: 'Trinity_Dev', level: 22, role: 'Member', xp: 5400, avatar: '🌸', online: false },
  { name: 'NeoCode', level: 20, role: 'Member', xp: 4800, avatar: '🤖', online: true },
  { name: 'LoopBreaker', level: 19, role: 'Member', xp: 3200, avatar: '🔄', online: false },
];

const GUILD_FEED = [
  { user: 'ByteKnight', action: 'solved Hard: "Serialize Binary Tree"', xp: 500, time: '5m ago', icon: '⚔️' },
  { user: 'NeoCode', action: 'defeated the Recursion Dragon Boss', xp: 800, time: '1h ago', icon: '🐉' },
  { user: 'LoopBreaker', action: 'reached Battle Pass Tier 20', xp: 0, time: '2h ago', icon: '🎖️' },
  { user: 'Trinity_Dev', action: 'joined the guild', xp: 0, time: '3h ago', icon: '🛡️' },
];

type GuildTab = 'leaderboard' | 'members' | 'feed' | 'quests';

export default function Guilds() {
  const [view, setView] = useState<'browse' | 'guild'>('guild');
  const [activeTab, setActiveTab] = useState<GuildTab>('leaderboard');
  const [joinedGuild, setJoinedGuild] = useState(MOCK_GUILDS[0]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">🛡️ Guilds</h1>
          <p className="text-slate-400 text-sm mt-1">Join a squad. Climb together. Conquer the leaderboard.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('guild')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${view === 'guild' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            My Guild
          </button>
          <button
            onClick={() => setView('browse')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${view === 'browse' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Browse Guilds
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── BROWSE VIEW ── */}
        {view === 'browse' && (
          <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {MOCK_GUILDS.map((guild, i) => (
              <motion.div
                key={guild.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group"
              >
                <div className="p-6 flex gap-5">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guild.color} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                    {guild.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{guild.name}</h3>
                      <span className="text-xs font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">[{guild.tag}]</span>
                      <span className="text-xs font-bold text-amber-400">Rank #{guild.rank}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{guild.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {guild.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col justify-between">
                    <div className="text-sm text-slate-400">
                      <div className="font-bold text-white">{guild.members}/{guild.maxMembers}</div>
                      <div className="text-xs">members</div>
                    </div>
                    <div className="text-sm text-slate-400 mt-2">
                      <div className="font-bold text-indigo-400">{(guild.xpThisWeek / 1000).toFixed(1)}k</div>
                      <div className="text-xs">XP this week</div>
                    </div>
                    {guild.joined ? (
                      <span className="mt-3 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold">
                        ✓ Joined
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setJoinedGuild(guild); setView('guild'); }}
                        className="mt-3 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Request to Join
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── MY GUILD VIEW ── */}
        {view === 'guild' && (
          <motion.div key="guild" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Guild Hero Card */}
            <div className={`relative rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br ${joinedGuild.color} p-8`}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="text-6xl">{joinedGuild.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black text-white">{joinedGuild.name}</h2>
                    <span className="px-2 py-0.5 bg-black/30 text-white/80 rounded-full text-sm font-mono font-bold">[{joinedGuild.tag}]</span>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{joinedGuild.description}</p>
                  <div className="flex gap-6">
                    {[
                      { label: 'Rank', value: `#${joinedGuild.rank}` },
                      { label: 'Members', value: `${joinedGuild.members}/${joinedGuild.maxMembers}` },
                      { label: 'Weekly XP', value: `${(joinedGuild.xpThisWeek / 1000).toFixed(1)}k` },
                      { label: 'Total XP', value: `${(joinedGuild.totalXP / 1_000_000).toFixed(2)}M` },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="text-xl font-black text-white">{stat.value}</div>
                        <div className="text-xs text-white/60 font-bold uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
              {(['leaderboard', 'members', 'feed', 'quests'] as GuildTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all
                    ${activeTab === tab ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab === 'leaderboard' ? '🏆 Leaderboard' : tab === 'members' ? '👥 Members' : tab === 'feed' ? '📡 Feed' : '⚔️ Quests'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

                {/* LEADERBOARD */}
                {activeTab === 'leaderboard' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-white">Guild XP — This Week</span>
                      <span className="text-xs text-slate-500">Resets Sunday</span>
                    </div>
                    {GUILD_MEMBERS.map((m, i) => (
                      <div key={m.name} className={`flex items-center gap-4 px-5 py-4 border-b border-slate-800 last:border-0 ${i === 0 ? 'bg-amber-500/5' : ''}`}>
                        <div className={`w-7 text-center font-black text-sm ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                          {m.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{m.name}</span>
                            {m.online && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          </div>
                          <div className="text-xs text-slate-500">Lv.{m.level} • {m.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-indigo-400">{m.xp.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MEMBERS */}
                {activeTab === 'members' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GUILD_MEMBERS.map(m => (
                      <div key={m.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">{m.avatar}</div>
                          {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-xs text-slate-400">Lv.{m.level} • {m.role}</div>
                        </div>
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-medium transition-colors">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* FEED */}
                {activeTab === 'feed' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
                    {GUILD_FEED.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">
                            <span className="font-bold text-white">{item.user}</span> {item.action}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-slate-500">{item.time}</span>
                            {item.xp > 0 && <span className="text-[11px] font-bold text-amber-400">+{item.xp} XP</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* QUESTS */}
                {activeTab === 'quests' && (
                  <div className="space-y-3">
                    {[
                      { title: 'Guild Grind', desc: 'Members collectively solve 50 problems', progress: 34, target: 50, reward: '5,000 Guild XP', icon: '⚡' },
                      { title: 'Boss Rush', desc: 'Defeat 3 bosses as a guild this week', progress: 2, target: 3, reward: 'Rare Loot Box × 3', icon: '🐉' },
                      { title: 'Streak Masters', desc: '5 members maintain a 7-day streak', progress: 3, target: 5, reward: '10,000 Guild XP', icon: '🔥' },
                    ].map((q, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{q.icon}</span>
                          <div className="flex-1">
                            <div className="font-bold text-white">{q.title}</div>
                            <div className="text-xs text-slate-400">{q.desc}</div>
                          </div>
                          <span className="text-xs text-amber-400 font-bold">{q.reward}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-indigo-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(q.progress / q.target) * 100}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: i * 0.15 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-400 tabular-nums">{q.progress}/{q.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
