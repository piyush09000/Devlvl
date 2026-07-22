import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemEditor() {
  const { id: _id } = useParams();
  const [code, setCode] = useState('function twoSum(nums, target) {\n  \n}');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [showXP, setShowXP] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleRun = () => {
    setStatus('running');
    setTimeout(() => {
      setOutput('Test cases passed! ✨');
      setStatus('success');
      setShowXP(true);
      setTimeout(() => setShowXP(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6 relative">
      
      {/* ── XP Reward Animation Overlay ── */}
      <AnimatePresence>
        {showXP && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, scale: 1.5, y: -150 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center"
          >
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-t from-amber-500 to-yellow-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)] filter">
              +150 XP
            </div>
            <div className="mt-4 px-6 py-2 bg-emerald-500 text-white font-bold rounded-full text-lg shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              Level Up! 🚀
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Left Panel: Problem Description ── */}
      <div className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 overflow-y-auto custom-scrollbar relative shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        {/* Glow effect based on difficulty */}
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Link to="/worlds" className="text-slate-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700">
              ←
            </Link>
            <h1 className="text-2xl font-bold">Two Sum</h1>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
              Easy
            </span>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20 flex items-center gap-1">
              🏆 +150 XP
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none relative z-10">
          <p className="text-slate-300 leading-relaxed">
            Given an array of integers <code>nums</code> and an integer <code>target</code>, 
            return indices of the two numbers such that they add up to <code>target</code>.
          </p>
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 my-6">
            <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Example 1</h3>
            <pre className="text-slate-300 font-mono text-sm">
              Input: nums = [2,7,11,15], target = 9{'\n'}
              Output: [0,1]{'\n'}
              Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
            </pre>
          </div>
        </div>

        {/* Hint System */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <button 
            onClick={() => setHintsUsed(h => h + 1)}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors"
          >
            💡 Need a hint? <span className="text-slate-500">(-20 DevCoins)</span>
          </button>
          {hintsUsed > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-200 text-sm"
            >
              Hint 1: A brute force solution is O(n²), but can you do it in one pass using a Hash Map?
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Right Panel: Editor & Output ── */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Editor Area */}
        <div className="flex-[2] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
          <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <select className="bg-transparent text-sm text-slate-300 font-medium focus:outline-none cursor-pointer">
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              {/* Timer */}
              <div className="font-mono text-slate-400 flex items-center gap-2">
                ⏱️ {formatTime(timeElapsed)}
              </div>
              <button 
                className="text-slate-400 hover:text-white transition-colors"
                onClick={() => setCode('function twoSum(nums, target) {\n  \n}')}
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-2">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 1.6,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true
              }}
            />
          </div>
        </div>

        {/* Output Area & Controls */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-bold text-slate-300">Console</h3>
            <div className="flex gap-3">
              <button 
                className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                onClick={() => setOutput('Compiling...')}
              >
                Run Code
              </button>
              <button 
                className={`px-8 py-2.5 text-white font-bold rounded-xl transition-all shadow-lg
                  ${status === 'running' ? 'bg-indigo-500/50 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 border border-indigo-500'}`}
                onClick={handleRun}
                disabled={status === 'running'}
              >
                {status === 'running' ? 'Executing...' : 'Submit'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-[#0a0a0a] rounded-xl p-4 font-mono text-sm overflow-auto border border-slate-800/50 shadow-inner">
            {status === 'idle' && <span className="text-slate-600">Run your code to see output here.</span>}
            {status === 'running' && <span className="text-indigo-400 animate-pulse">{'>'} Compiling & testing...</span>}
            {status === 'success' && (
              <div className="space-y-2">
                <div className="text-emerald-400 font-bold">{output}</div>
                <div className="text-slate-400 text-xs mt-4 border-t border-slate-800 pt-2">
                  Runtime: 54ms (Beats 82%)<br/>
                  Memory: 42.1 MB (Beats 65%)
                </div>
              </div>
            )}
            {status === 'error' && <span className="text-rose-400">{output}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
