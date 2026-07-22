import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SkillNode {
  id: number;
  title: string;
  tier: number;
  prerequisites: number[];
  completion_threshold: number;
}

interface Progress {
  problems_solved: number;
  is_completed: boolean;
}

// Group nodes by tier for simple vertical rendering
const mockFetchSkills = () => {
  return new Promise<{ nodes: SkillNode[], progress: Record<number, Progress> }>(resolve => {
    setTimeout(() => {
      resolve({
        nodes: [
          { id: 1, title: "Arrays & Hashing", tier: 1, prerequisites: [], completion_threshold: 3 },
          { id: 2, title: "Two Pointers", tier: 2, prerequisites: [1], completion_threshold: 3 },
          { id: 3, title: "Sliding Window", tier: 2, prerequisites: [1], completion_threshold: 3 },
          { id: 4, title: "Stack", tier: 2, prerequisites: [1], completion_threshold: 2 },
          { id: 5, title: "Binary Search", tier: 3, prerequisites: [2], completion_threshold: 3 },
          { id: 6, title: "Linked List", tier: 3, prerequisites: [2], completion_threshold: 3 },
        ],
        progress: {
          1: { problems_solved: 3, is_completed: true },
          2: { problems_solved: 1, is_completed: false }
        }
      });
    }, 500);
  });
};

export default function SkillTree() {
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [progress, setProgress] = useState<Record<number, Progress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockFetchSkills().then(data => {
      setNodes(data.nodes);
      setProgress(data.progress);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const tiers = Array.from(new Set(nodes.map(n => n.tier))).sort((a, b) => a - b);

  const isUnlocked = (node: SkillNode) => {
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every(preId => progress[preId]?.is_completed);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Tree</h1>
        <p className="text-slate-400 mt-1">Master topics to unlock advanced challenges.</p>
      </div>

      <div className="flex flex-col items-center gap-16 relative">
        {/* Simple connecting line in the background (mock) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-800 -z-10 -translate-x-1/2" />

        {tiers.map(tier => {
          const tierNodes = nodes.filter(n => n.tier === tier);
          return (
            <div key={tier} className="w-full relative flex flex-col items-center">
              <div className="absolute -left-4 -top-6 text-sm font-bold text-slate-600 uppercase tracking-widest">
                Tier {tier}
              </div>
              <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
                {tierNodes.map(node => {
                  const unlocked = isUnlocked(node);
                  const nodeProgress = progress[node.id] || { problems_solved: 0, is_completed: false };
                  const completed = nodeProgress.is_completed;
                  
                  return (
                    <div 
                      key={node.id} 
                      className={`relative w-48 p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center text-center group
                        ${completed 
                          ? 'bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-400' 
                          : unlocked 
                            ? 'bg-slate-900 border-slate-700 hover:border-slate-500 cursor-pointer' 
                            : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'}`}
                    >
                      {/* Node Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-lg
                        ${completed ? 'bg-indigo-500 text-white' : unlocked ? 'bg-slate-800 text-slate-300' : 'bg-slate-800 text-slate-500'}`}>
                        {completed ? '✓' : unlocked ? '!' : '🔒'}
                      </div>
                      
                      <h3 className={`font-bold text-sm mb-1 ${completed ? 'text-indigo-300' : unlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                        {node.title}
                      </h3>
                      
                      <div className="w-full mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">{nodeProgress.problems_solved}/{node.completion_threshold}</span>
                          <span className="text-slate-500">{Math.round((nodeProgress.problems_solved/node.completion_threshold)*100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${completed ? 'bg-indigo-500' : 'bg-slate-400'}`}
                            style={{ width: `${Math.min(100, (nodeProgress.problems_solved/node.completion_threshold)*100)}%` }}
                          />
                        </div>
                      </div>
                      
                      {unlocked && !completed && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/problems?topic=${node.id}`} className="px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
                            Practice
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
