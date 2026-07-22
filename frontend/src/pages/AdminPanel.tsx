import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mock Data ──────────────────────────────────────
const STATS = {
  totalUsers: 12450,
  activeToday: 3120,
  problemsSolved: 145020,
  totalGuilds: 432,
  revenue: 12450, // $
};

const USERS = [
  { id: 1, name: 'DevMaster_X', email: 'dev@x.com', role: 'admin', level: 42, status: 'active', joined: '2025-01-12' },
  { id: 2, name: 'ByteKnight', email: 'byte@knight.com', role: 'user', level: 28, status: 'active', joined: '2025-02-14' },
  { id: 3, name: 'Trinity_Dev', email: 'trin@matrix.com', role: 'moderator', level: 22, status: 'active', joined: '2025-03-01' },
  { id: 4, name: 'SpamBot99', email: 'spam@bot.com', role: 'user', level: 2, status: 'banned', joined: '2025-06-15' },
];

const PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', world: 'Code Village', submissions: 45000, passRate: 85 },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', world: 'Code Village', submissions: 38000, passRate: 72 },
  { id: 3, title: 'LRU Cache', difficulty: 'Hard', world: 'Function Castle', submissions: 12000, passRate: 24 },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'problems' | 'settings'>('dashboard');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🛡️ Admin Command Center
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase">Restricted Access</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage the Devlvl universe.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'users', label: '👥 Users' },
          { id: 'problems', label: '📝 Problems' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Total Users', value: STATS.totalUsers.toLocaleString(), color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Active Today', value: STATS.activeToday.toLocaleString(), color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Problems Solved', value: STATS.problemsSolved.toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: 'Total Guilds', value: STATS.totalGuilds.toLocaleString(), color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                  { label: 'Revenue (MTD)', value: `$${STATS.revenue.toLocaleString()}`, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${stat.bg}`}>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">System Health</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'API Server', status: 'Online', ms: '12ms' },
                      { label: 'Code Execution Engine', status: 'Online', ms: '45ms' },
                      { label: 'PostgreSQL Database', status: 'Online', ms: '8ms' },
                      { label: 'Redis Cache', status: 'Online', ms: '2ms' },
                    ].map(sys => (
                      <div key={sys.label} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-sm font-semibold text-white">{sys.label}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-emerald-400">{sys.status}</span>
                          <span className="text-slate-500">{sys.ms}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Recent Alerts</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
                      <span className="text-lg">🚨</span>
                      <div>
                        <div className="font-bold">High Load on Execution Engine</div>
                        <div className="text-xs opacity-80 mt-0.5">Spike in submissions detected. Auto-scaling triggered.</div>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-start gap-3">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <div className="font-bold">Unusual Activity Detected</div>
                        <div className="text-xs opacity-80 mt-0.5">User 'SpamBot99' submitted 500 solutions in 1 minute. Account auto-banned.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <input 
                  placeholder="Search users by name, email, or ID..." 
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white w-72 focus:outline-none focus:border-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm">
                  + Invite Admin
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Level</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Joined</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {USERS.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase
                          ${u.role === 'admin' ? 'bg-rose-500/20 text-rose-400' : u.role === 'moderator' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}
                        `}>{u.role}</span>
                      </td>
                      <td className="p-4 font-mono">{u.level}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border
                          ${u.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}
                        `}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{u.joined}</td>
                      <td className="p-4 text-right">
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs px-2">Edit</button>
                        <button className="text-rose-400 hover:text-rose-300 font-medium text-xs px-2">Ban</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PROBLEMS TAB */}
          {activeTab === 'problems' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-end">
                <button className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm">
                  + Create Problem
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">World</th>
                    <th className="p-4 font-semibold">Difficulty</th>
                    <th className="p-4 font-semibold">Submissions</th>
                    <th className="p-4 font-semibold">Pass Rate</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {PROBLEMS.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-white">{p.title}</td>
                      <td className="p-4 text-indigo-400">{p.world}</td>
                      <td className="p-4">
                        <span className={`font-bold ${p.difficulty === 'Easy' ? 'text-emerald-400' : p.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{p.submissions.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                            <div className={`h-full ${p.passRate >= 70 ? 'bg-emerald-500' : p.passRate >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p.passRate}%` }} />
                          </div>
                          <span className="text-xs font-mono">{p.passRate}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs px-2">Edit</button>
                        <button className="text-amber-400 hover:text-amber-300 font-medium text-xs px-2">Hide</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-2">Global Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Maintenance Mode</div>
                    <div className="text-sm text-slate-400 mt-1">Prevent non-admin users from accessing the platform.</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-slate-700 relative transition-colors">
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">New User Registration</div>
                    <div className="text-sm text-slate-400 mt-1">Allow new developers to create accounts.</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-indigo-500 relative transition-colors">
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Global Double XP</div>
                    <div className="text-sm text-slate-400 mt-1">Grant 2x XP for all problem submissions.</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-slate-700 relative transition-colors">
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-rose-400 text-lg">Danger Zone</h3>
                <div className="flex items-center justify-between p-4 bg-slate-950 border border-rose-500/30 rounded-xl">
                  <div>
                    <div className="font-bold text-white">Purge Inactive Users</div>
                    <div className="text-xs text-slate-400 mt-1">Delete users who haven't logged in for 365 days.</div>
                  </div>
                  <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-lg transition-colors">
                    Purge Users
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
