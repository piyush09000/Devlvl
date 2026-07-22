import { useState } from 'react';

const MOCK_GLOBAL = [
  { rank: 1, username: 'neo', weekly_xp: 4500, avatar_url: null },
  { rank: 2, username: 'trinity', weekly_xp: 4200, avatar_url: null },
  { rank: 3, username: 'morpheus', weekly_xp: 3800, avatar_url: null },
  { rank: 4, username: 'dozer', weekly_xp: 3100, avatar_url: null },
  { rank: 5, username: 'tank', weekly_xp: 2900, avatar_url: null },
];

const MOCK_GUILD = [
  { rank: 1, username: 'neo', weekly_xp: 4500, avatar_url: null },
  { rank: 2, username: 'cipher', weekly_xp: 1500, avatar_url: null },
];

export default function Leaderboard() {
  const [tab, setTab] = useState<'global' | 'guild'>('global');
  
  const data = tab === 'global' ? MOCK_GLOBAL : MOCK_GUILD;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-slate-400 mt-1">Weekly XP rankings reset every Sunday.</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex">
          <button 
            onClick={() => setTab('global')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'global' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setTab('guild')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'guild' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            My Guild
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 w-20 text-center">Rank</th>
              <th className="px-6 py-4">Developer</th>
              <th className="px-6 py-4 text-right">Weekly XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.map((user) => (
              <tr key={user.username} className={`transition-colors hover:bg-slate-800/30 ${user.rank <= 3 ? 'bg-indigo-500/5' : ''}`}>
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto font-bold
                    ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 
                      user.rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/50' : 
                      user.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50' : 
                      'text-slate-500'}`}>
                    {user.rank}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-indigo-400 uppercase">
                    {user.username.charAt(0)}
                  </div>
                  {user.username}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-indigo-400">
                  {user.weekly_xp.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
