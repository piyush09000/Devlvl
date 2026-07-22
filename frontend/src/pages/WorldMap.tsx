import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WORLD_MAP } from '../lib/constants';
import type { WorldNode } from '../lib/constants';

export default function WorldMap() {
  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(null);
  const [apiWorlds, setApiWorlds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/learning/worlds')
      .then(res => res.json())
      .then(data => {
        setApiWorlds(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch worlds:', err);
        setIsLoading(false);
      });
  }, []);

  const completedWorlds = ['code_village', 'loop_forest'];
  const unlockedWorlds = ['function_castle'];

  return (
    <div
      className="relative rounded-3xl border border-slate-800 bg-[#0a0a0a] overflow-hidden"
      style={{ minHeight: 'calc(100vh - 120px)' }}
    >
      {/* Ambient glow that changes with selected node */}
      <AnimatePresence>
        <motion.div
          key={selectedNode?.id || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: selectedNode
              ? `radial-gradient(ellipse at 50% 30%, ${selectedNode.color} 0%, transparent 65%)`
              : 'radial-gradient(ellipse at 50% 30%, #4f46e5 0%, transparent 65%)',
          }}
        />
      </AnimatePresence>

      {/* Scrollable map area */}
      <div className="relative z-10 overflow-y-auto px-6 py-16" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-white mb-2">🗺️ World Map</h1>
          <p className="text-slate-400">Choose your next adventure. Each world unlocks new powers.</p>
        </div>

        {/* Spine + Nodes */}
        <div className="relative flex flex-col items-center gap-16 max-w-2xl mx-auto">

          {/* Dashed spine line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-700 -z-10 -translate-x-px" />

          {isLoading ? (
            <div className="text-slate-400 py-20">Loading Worlds...</div>
          ) : (apiWorlds.length > 0 ? apiWorlds : WORLD_MAP).map((apiNode, index) => {
            // Find styling from constants fallback
            const styleNode = WORLD_MAP.find(w => w.id === apiNode.slug) || WORLD_MAP.find(w => w.id === apiNode.id) || WORLD_MAP[0];
            
            const node = {
              id: apiNode.slug || apiNode.id,
              name: apiNode.name,
              icon: apiNode.icon || styleNode.icon,
              tier: apiNode.tier || styleNode.tier,
              description: apiNode.description || styleNode.description,
              color: styleNode.color,
              gradient: styleNode.gradient,
              challengeCount: styleNode.challengeCount,
              bossName: styleNode.bossName
            };

            const isCompleted = completedWorlds.includes(node.id);
            const isUnlocked = isCompleted || unlockedWorlds.includes(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={node.id}
                className={`relative flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Horizontal connector */}
                <div
                  className={`absolute top-1/2 w-16 h-0.5 -translate-y-px
                    ${isLeft ? 'left-[calc(50%-4rem)]' : 'right-[calc(50%-4rem)]'}
                    ${isUnlocked ? 'bg-indigo-500' : 'bg-slate-800'}`}
                />

                {/* Node card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`relative cursor-pointer select-none w-56
                    ${isLeft ? 'mr-[calc(50%+2rem)]' : 'ml-[calc(50%+2rem)]'}`}
                  onMouseEnter={() => setSelectedNode(node)}
                  onMouseLeave={() => setSelectedNode(null)}
                >
                  <div
                    className={`rounded-2xl border-2 p-4 flex items-center gap-4 transition-all duration-300
                      ${isCompleted
                        ? 'bg-slate-900 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                        : isUnlocked
                          ? 'bg-slate-900 border-slate-600 hover:border-slate-400'
                          : 'bg-slate-950 border-slate-800 opacity-50 grayscale'
                      }
                      ${isSelected ? 'scale-[1.02]' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-800 flex-shrink-0">
                      {node.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{node.name}</div>
                      <div className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: node.color }}>
                        Tier {node.tier}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{node.challengeCount} challenges</div>
                    </div>
                    {isCompleted && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                    )}
                    {!isUnlocked && (
                      <div className="ml-auto text-slate-600 flex-shrink-0">🔒</div>
                    )}
                  </div>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-30 w-64 p-5 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl top-full mt-3
                          ${isLeft ? 'left-0' : 'right-0'}`}
                      >
                        <h3 className="text-lg font-bold text-white mb-1">{node.name}</h3>
                        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: node.color }}>
                          Tier {node.tier} • {node.challengeCount} Challenges
                        </div>
                        <p className="text-sm text-slate-300 mb-4">{node.description}</p>
                        {isUnlocked ? (
                          <Link
                            to={`/problems?world=${node.id}`}
                            className="block w-full py-2 text-center rounded-lg bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors"
                          >
                            {isCompleted ? 'Revisit World' : 'Enter World'}
                          </Link>
                        ) : (
                          <div className="w-full py-2 text-center rounded-lg bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed">
                            🔒 Locked — Complete previous world
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
