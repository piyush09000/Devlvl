import { useState } from 'react';
import { motion } from 'framer-motion';

// Mock data
const SEASON_DATA = {
  name: "Season Zero: Bug Apocalypse",
  daysLeft: 42,
  userTier: 14,
  userXP: 850,
  xpRequired: 1000,
  isPremium: false,
};

const TIERS = Array.from({ length: 50 }, (_, i) => {
  const tier = i + 1;
  const isPremiumOnly = tier % 5 !== 0; // Free rewards every 5 levels
  return {
    tier,
    freeReward: isPremiumOnly ? null : { type: 'coins', value: 100 * tier, icon: '💎' },
    premiumReward: { type: tier % 10 === 0 ? 'skin' : 'coins', value: tier * 200, icon: tier % 10 === 0 ? '🔥' : '💎', name: tier % 10 === 0 ? 'Epic Skin' : 'Premium Coins' }
  };
});

export default function BattlePass() {
  const [_purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 relative flex flex-col">
      {/* ── Season Hero Banner ── */}
      <div className="relative h-64 bg-slate-900 border-b border-slate-800 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618367588411-d9a90fefa881?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/80 to-transparent" />
        
        <div className="relative z-10 h-full p-8 flex flex-col justify-between max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Live Event
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{SEASON_DATA.daysLeft}</div>
              <div className="text-xs text-rose-400 uppercase font-bold tracking-widest">Days Left</div>
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {SEASON_DATA.name}
            </h1>
            <p className="text-slate-300">Complete daily quests and challenges to unlock exclusive seasonal rewards.</p>
          </div>
        </div>
      </div>

      {/* ── Progress & Upgrade Bar ── */}
      <div className="bg-slate-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 flex-shrink-0">
        <div className="flex-1 w-full max-w-2xl flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-black text-rose-400">{SEASON_DATA.userTier}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Tier</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>{SEASON_DATA.userXP} XP</span>
              <span>{SEASON_DATA.xpRequired} XP to Tier {SEASON_DATA.userTier + 1}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(SEASON_DATA.userXP / SEASON_DATA.xpRequired) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
        
        {!SEASON_DATA.isPremium && (
          <button 
            onClick={() => setPurchaseModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform"
          >
            Upgrade Pass
          </button>
        )}
      </div>

      {/* ── Tier Track (Horizontal Scroll) ── */}
      <div className="flex-1 overflow-x-auto custom-scrollbar p-8 flex items-center gap-4 bg-[#0a0a0a]">
        {TIERS.map((tierData) => {
          const isUnlocked = tierData.tier <= SEASON_DATA.userTier;
          const isCurrent = tierData.tier === SEASON_DATA.userTier;
          
          return (
            <div key={tierData.tier} className={`flex flex-col gap-2 flex-shrink-0 w-32 opacity-100 ${!isUnlocked && 'opacity-60 grayscale hover:grayscale-0 transition-all'}`}>
              
              {/* Premium Reward Slot */}
              <div className={`h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 relative overflow-hidden group
                ${isUnlocked && SEASON_DATA.isPremium ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900'}`}>
                {tierData.premiumReward.name && (
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-50" />
                )}
                <div className="text-4xl mb-2 relative z-10 group-hover:scale-110 transition-transform">
                  {tierData.premiumReward.icon}
                </div>
                <div className="text-xs font-bold text-center text-amber-400 relative z-10">
                  {tierData.premiumReward.name || `${tierData.premiumReward.value} Coins`}
                </div>
                
                {isUnlocked && SEASON_DATA.isPremium && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded">Claim</button>
                  </div>
                )}
              </div>

              {/* Tier Divider line */}
              <div className="h-8 flex items-center justify-center relative">
                <div className="absolute w-full h-1 bg-slate-800 -z-10" />
                {isUnlocked && <div className="absolute w-full h-1 bg-rose-500 -z-10 right-1/2" />}
                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center text-xs font-black z-10
                  ${isCurrent ? 'bg-rose-500 border-rose-950 text-white scale-125' : 
                    isUnlocked ? 'bg-rose-500 border-slate-950 text-white' : 'bg-slate-800 border-slate-950 text-slate-500'}`}>
                  {tierData.tier}
                </div>
              </div>

              {/* Free Reward Slot */}
              <div className={`h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 relative overflow-hidden group
                ${isUnlocked && tierData.freeReward ? 'border-slate-400 bg-slate-800' : 'border-slate-800 bg-slate-900/50'}`}>
                {tierData.freeReward ? (
                  <>
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{tierData.freeReward.icon}</div>
                    <div className="text-xs font-bold text-slate-300">{tierData.freeReward.value} Coins</div>
                    {isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1 bg-white text-black text-xs font-bold rounded">Claim</button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-slate-700 text-xs font-bold uppercase tracking-widest text-center">Premium Only</div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
