import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { XP_PER_LEVEL, LEVEL_TITLES } from '../lib/constants';

const MOCK_QUESTS = [
  { id: 1, title: 'Warmup', description: 'Solve 1 Easy problem', progress: 1, target: 1, completed: true, xp: 50 },
  { id: 2, title: 'Consistency', description: 'Solve without using hints', progress: 0, target: 1, completed: false, xp: 100 },
];

export default function Dashboard() {
  const { level, xp, currentStreak, devCoins } = useGameStore();
  const nextLevelXP = XP_PER_LEVEL(level + 1);
  const progressPercent = Math.min(100, Math.round((xp / nextLevelXP) * 100));
  
  // Get title for current level
  const titleKeys = Object.keys(LEVEL_TITLES).map(Number).sort((a,b) => b-a);
  const currentTitle = LEVEL_TITLES[titleKeys.find(k => level >= k) || 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Hero / Stats Section ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Level Card */}
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/20 transition-colors duration-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="60" className="stroke-slate-800" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="64" cy="64" r="60" 
                  className="stroke-indigo-500" 
                  strokeWidth="8" fill="none" strokeLinecap="round"
                  strokeDasharray={377}
                  initial={{ strokeDashoffset: 377 }}
                  animate={{ strokeDashoffset: 377 - (377 * progressPercent) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{level}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Level</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-1">Welcome back, {currentTitle}</h2>
              <p className="text-slate-400 mb-6">You need {nextLevelXP - xp} XP to reach Level {level + 1}.</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-slate-950 rounded-xl px-4 py-2 border border-slate-800 flex items-center gap-3">
                  <span className="text-xl">🔥</span>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Streak</div>
                    <div className="text-lg font-bold text-orange-400">{currentStreak} Days</div>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-xl px-4 py-2 border border-slate-800 flex items-center gap-3">
                  <span className="text-xl">💎</span>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">DevCoins</div>
                    <div className="text-lg font-bold text-cyan-400">{devCoins}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning Card */}
        <div className="md:col-span-4 bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 flex flex-col relative overflow-hidden group cursor-pointer hover:border-indigo-500/40 transition-colors">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000')] bg-cover opacity-10 group-hover:scale-105 transition-transform duration-700" />
          <div className="relative z-10 flex-1 flex flex-col">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Continue Quest</span>
            <h3 className="text-2xl font-bold text-white mb-2">Loop Forest</h3>
            <p className="text-sm text-indigo-200/70 mb-6">Defeat the Infinite Iterator to unlock the Function Castle.</p>
            
            <Link to="/worlds" className="mt-auto inline-flex items-center justify-center w-full bg-white text-slate-950 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
              Continue Journey ➔           </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Lower Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Daily Quests */}
        <motion.div variants={itemVariants} className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Daily Quests</h2>
              <p className="text-sm text-slate-400">Reset in 4h 12m</p>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold">
              1 / 3 Completed
            </span>
          </div>
          
          <div className="space-y-3">
            {MOCK_QUESTS.map(quest => (
              <div key={quest.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 
                  ${quest.completed ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                  {quest.completed ? '✓' : '🎯'}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${quest.completed ? 'text-emerald-400' : 'text-slate-200'}`}>{quest.title}</h3>
                  <p className="text-sm text-slate-400">{quest.description}</p>
                  
                  {/* Quest Progress Bar */}
                  <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${quest.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div className="text-right pl-4 border-l border-slate-800">
                  <div className="text-sm font-black text-amber-400">+{quest.xp}</div>
                  <div className="text-[10px] font-bold text-amber-400/70 uppercase">XP</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Side Panel (Guild/Activity) */}
        <motion.div variants={itemVariants} className="md:col-span-4 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span>🛡️</span> Guild Activity
            </h2>
            <div className="space-y-4">
              {[
                { user: 'neo', action: 'defeated the Syntax Sentinel', time: '10m ago' },
                { user: 'trinity', action: 'reached Level 42', time: '1h ago' },
                { user: 'morpheus', action: 'unlocked Graph Galaxy', time: '3h ago' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {activity.user[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-300">
                      <span className="font-bold text-white">{activity.user}</span> {activity.action}
                    </p>
                    <span className="text-[10px] text-slate-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
              View Guild
            </button>
          </div>
          
        </motion.div>

      </div>
    </motion.div>
  );
}
