import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Reward = { type: string; value: string; icon: string; rarity: 'common' | 'rare' | 'epic' | 'legendary' };

export default function LootBoxes() {
  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);

  const rarityColors = {
    common: 'from-slate-400 to-slate-500',
    rare: 'from-blue-400 to-indigo-500',
    epic: 'from-fuchsia-400 to-purple-600',
    legendary: 'from-amber-300 to-orange-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
  };

  const handleOpen = () => {
    setOpening(true);
    setReward(null);
    
    // Simulate API call and animation delay
    setTimeout(() => {
      const mockReward: Reward = Math.random() > 0.8 
        ? { type: 'pet', value: 'Legendary AI Robot', icon: '🤖', rarity: 'legendary' }
        : { type: 'coins', value: '500 DevCoins', icon: '💎', rarity: 'epic' };
        
      setReward(mockReward);
    }, 2500);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center relative overflow-hidden bg-[#050505] rounded-3xl border border-slate-800">
      
      {/* Background Particles (static for now) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wIDQwLjVoNDBWMGh4IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30" />

      <h1 className="absolute top-12 text-3xl font-black text-white uppercase tracking-widest z-10">
        Loot Stash
      </h1>
      
      <div className="absolute top-12 right-12 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 z-10">
        <span className="text-xl">📦</span>
        <div className="text-sm font-bold text-slate-300">3 Available</div>
      </div>

      <AnimatePresence mode="wait">
        {!opening && !reward && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center z-10"
          >
            {/* Loot Box Graphic */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-64 h-64 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl border-4 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)] flex items-center justify-center relative group cursor-pointer"
              onClick={handleOpen}
            >
              <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-8xl drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">📦</span>
            </motion.div>
            
            <button 
              onClick={handleOpen}
              className="mt-12 px-12 py-4 bg-white text-black font-black text-xl rounded-xl hover:bg-slate-200 hover:scale-105 transition-all"
            >
              OPEN BOX
            </button>
          </motion.div>
        )}

        {opening && !reward && (
          <motion.div 
            key="opening"
            className="flex flex-col items-center z-10"
          >
            <motion.div 
              animate={{ 
                rotate: [0, -10, 10, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.5, 0],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(2)', 'brightness(3)']
              }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="text-8xl"
            >
              📦
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-xl font-bold text-indigo-400 animate-pulse uppercase tracking-widest"
            >
              Unlocking...
            </motion.div>
          </motion.div>
        )}

        {reward && (
          <motion.div 
            key="reward"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-10"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm font-black uppercase tracking-[0.5em] mb-4 text-transparent bg-clip-text bg-gradient-to-r ${rarityColors[reward.rarity]}`}
              >
                {reward.rarity} REWARD
              </motion.div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-64 h-64 rounded-full flex items-center justify-center text-8xl relative`}
            >
              {/* Glow */}
              <div className={`absolute inset-0 rounded-full blur-[60px] opacity-50 bg-gradient-to-br ${rarityColors[reward.rarity]}`} />
              
              <span className="relative z-10">{reward.icon}</span>
            </motion.div>
            
            <h2 className="text-4xl font-black text-white mt-8 mb-12 drop-shadow-lg">{reward.value}</h2>
            
            <button 
              onClick={() => { setOpening(false); setReward(null); }}
              className="px-12 py-4 bg-slate-900 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Claim & Return
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
