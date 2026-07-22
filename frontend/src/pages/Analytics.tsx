import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import axios from 'axios';

// ── Mock Data ──────────────────────────────────────
const WEEKLY_XP = [120, 340, 280, 490, 620, 180, 750];
const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_XP = Math.max(...WEEKLY_XP);

const DIFFICULTY_DIST = [
  { label: 'Easy', count: 82, color: '#34d399', pct: 58 },
  { label: 'Medium', count: 47, color: '#f59e0b', pct: 33 },
  { label: 'Hard', count: 13, color: '#f87171', pct: 9 },
];

const TOPIC_MASTERY = [
  { topic: 'Arrays & Hashing', score: 92, solved: 28 },
  { topic: 'Two Pointers', score: 78, solved: 14 },
  { topic: 'Sliding Window', score: 65, solved: 9 },
  { topic: 'Trees', score: 55, solved: 18 },
  { topic: 'Dynamic Programming', score: 38, solved: 6 },
  { topic: 'Graphs', score: 22, solved: 3 },
];

const STREAK_HEATMAP = Array.from({ length: 91 }, (_, i) => ({
  day: i,
  activity: Math.random() > 0.35 ? Math.ceil(Math.random() * 4) : 0,
}));

const MONTHLY_SOLVED = [8, 15, 12, 22, 18, 30, 25, 14, 28, 35, 20, 42];
const MONTHLY_LABELS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const MAX_SOLVED = Math.max(...MONTHLY_SOLVED);

export default function Analytics() {
  const { level, xp, currentStreak } = useGameStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/analytics/overview', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setAnalyticsData(res.data))
    .catch(err => console.error('Failed to load analytics', err));
  }, []);

  const solvedCount = analyticsData?.solved_count || 142;
  const weeklyXpChart = analyticsData?.weekly_xp_chart || WEEKLY_XP;
  const totalWeeklyXp = analyticsData?.total_weekly_xp || 2650;
  const maxWeeklyXp = Math.max(...weeklyXpChart, 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">📊 Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Your coding journey, visualized.</p>
        </div>
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {(['week', 'month', 'all'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all
                ${period === p ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Top KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Problems Solved', value: solvedCount.toString(), delta: 'Keep going!', icon: '✅', color: 'emerald' },
          { label: 'Current Streak', value: `${currentStreak}🔥`, delta: 'Best: 21 days', icon: '🔥', color: 'orange' },
          { label: 'Total XP', value: xp.toLocaleString(), delta: `Level ${level}`, icon: '⭐', color: 'indigo' },
          { label: 'Weekly XP', value: totalWeeklyXp.toLocaleString(), delta: '+3% vs last week', icon: '📈', color: 'blue' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className="text-2xl mb-3">{kpi.icon}</div>
            <div className="text-2xl font-black text-white">{kpi.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">{kpi.label}</div>
            <div className="text-xs text-emerald-400 mt-2 font-medium">{kpi.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* XP Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">⭐ Daily XP Earned (This Week)</h3>
          <div className="flex items-end gap-2 h-40">
            {weeklyXpChart.map((xpVal: number, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 relative cursor-default"
                  style={{ height: 0 }}
                  animate={{ height: `${(xpVal / maxWeeklyXp) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {xpVal} XP
                  </div>
                </motion.div>
                <span className="text-[10px] text-slate-500 font-medium">{WEEKLY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Solved Line-style bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">📈 Monthly Problems Solved</h3>
          <div className="flex items-end gap-1.5 h-40">
            {MONTHLY_SOLVED.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <motion.div
                  className="w-full rounded-t bg-gradient-to-t from-emerald-700 to-emerald-400 cursor-default"
                  style={{ height: 0 }}
                  animate={{ height: `${(val / MAX_SOLVED) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {val}
                  </div>
                </motion.div>
                <span className="text-[9px] text-slate-600 font-medium">{MONTHLY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lower Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Difficulty Distribution Donut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">🥧 Difficulty Breakdown</h3>
          {/* Fake donut via stacked rings */}
          <div className="relative w-36 h-36 mx-auto mb-5">
            <svg width="144" height="144" className="-rotate-90">
              {(() => {
                let cumulative = 0;
                return DIFFICULTY_DIST.map(d => {
                  const r = 55;
                  const circ = 2 * Math.PI * r;
                  const dash = (d.pct / 100) * circ;
                  const offset = (cumulative / 100) * circ;
                  cumulative += d.pct;
                  return (
                    <motion.circle key={d.label} cx="72" cy="72" r={r} fill="none"
                      stroke={d.color} strokeWidth="22" strokeLinecap="butt"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={-offset}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-black text-white">142</div>
                <div className="text-[10px] text-slate-500">total</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {DIFFICULTY_DIST.map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="text-sm text-slate-300 flex-1">{d.label}</span>
                <span className="text-sm font-bold text-white">{d.count}</span>
                <span className="text-xs text-slate-500">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:col-span-2">
          <h3 className="font-bold text-white mb-5">🧠 Topic Mastery</h3>
          <div className="space-y-4">
            {TOPIC_MASTERY.map((t, i) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-300">{t.topic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{t.solved} solved</span>
                    <span className={`text-sm font-bold ${
                      t.score >= 80 ? 'text-emerald-400' : t.score >= 60 ? 'text-amber-400' : t.score >= 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>{t.score}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      t.score >= 80 ? 'bg-emerald-500' : t.score >= 60 ? 'bg-amber-500' : t.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${t.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity Heatmap ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">📅 Activity Heatmap (Last 91 Days)</h3>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span>Less</span>
            {['bg-slate-800', 'bg-indigo-900', 'bg-indigo-700', 'bg-indigo-500', 'bg-indigo-300'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}>
          {STREAK_HEATMAP.map((d) => (
            <div key={d.day}
              title={`Day ${d.day + 1}: ${d.activity} problems`}
              className={`aspect-square rounded-sm cursor-default transition-transform hover:scale-125 ${
                d.activity === 0 ? 'bg-slate-800' :
                d.activity === 1 ? 'bg-indigo-900' :
                d.activity === 2 ? 'bg-indigo-700' :
                d.activity === 3 ? 'bg-indigo-500' : 'bg-indigo-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
