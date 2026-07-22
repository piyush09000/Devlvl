import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mock Data ──────────────────────────────────────
const MOCK_OPPONENT = {
  name: 'ByteKnight',
  level: 28,
  avatar: '🧙‍♂️',
  rating: 1840,
};

const ARENA_PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy' as const,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    starterCode: 'def two_sum(nums, target):\n    # Your code here\n    pass',
    timeLimit: 300, // seconds
  },
];

type GameState = 'lobby' | 'countdown' | 'playing' | 'result';

const DIFF_COLOR: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
};

export default function PvPArena() {
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(300);
  const [myCode, setMyCode] = useState(ARENA_PROBLEMS[0].starterCode);
  const [opponentProgress, setOpponentProgress] = useState(0); // 0-100
  const [myProgress, setMyProgress] = useState(0);
  const [winner, setWinner] = useState<'me' | 'opponent' | null>(null);
  const [searchingFor, setSearchingFor] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Matchmaking timer
  useEffect(() => {
    if (gameState === 'lobby') {
      const t = setInterval(() => setSearchingFor(s => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [gameState]);

  // Countdown to battle
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown <= 0) {
        setGameState('playing');
        return;
      }
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [gameState, countdown]);

  // Battle timer
  useEffect(() => {
    if (gameState === 'playing') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setWinner(myProgress > opponentProgress ? 'me' : 'opponent');
            setGameState('result');
            return 0;
          }
          return t - 1;
        });
        // Simulate opponent typing
        setOpponentProgress(p => Math.min(100, p + Math.random() * 1.8));
      }, 1000);
      return () => clearInterval(intervalRef.current!);
    }
  }, [gameState, myProgress, opponentProgress]);

  const handleSubmit = () => {
    setMyProgress(100);
    clearInterval(intervalRef.current!);
    setTimeout(() => {
      setWinner('me');
      setGameState('result');
    }, 400);
  };

  const handleFindMatch = () => {
    setSearchingFor(0);
    setGameState('countdown');
    setCountdown(3);
  };

  const handleRematch = () => {
    setGameState('lobby');
    setSearchingFor(0);
    setTimeLeft(300);
    setMyProgress(0);
    setOpponentProgress(0);
    setWinner(null);
    setMyCode(ARENA_PROBLEMS[0].starterCode);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const problem = ARENA_PROBLEMS[0];

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">⚔️ PvP Arena</h1>
          <p className="text-slate-400 text-sm mt-1">Race against real developers. Fastest correct solution wins.</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-amber-400">1,742</div>
          <div className="text-xs text-slate-500 font-bold uppercase">Your Rating</div>
        </div>
      </div>

      {/* ── LOBBY ── */}
      {gameState === 'lobby' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matchmaking Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-4xl">
                🥷
              </div>
              {/* Animated rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-2xl border border-indigo-500/40"
                  animate={{ scale: [1, 1 + i * 0.3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                />
              ))}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready for Battle?</h2>
            <p className="text-slate-400 text-sm mb-6">You'll be matched with a developer of similar skill. May the best coder win.</p>
            <div className="text-xs text-slate-500 mb-6 font-mono">
              🔍 {searchingFor}s — 284 players online
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFindMatch}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-black text-white text-lg shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all"
            >
              ⚔️ Find Match
            </motion.button>
          </div>

          {/* Recent Matches */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Recent Matches</h3>
            <div className="space-y-3">
              {[
                { opp: 'ByteKnight', result: 'WIN', ratingChange: '+18', problem: 'Two Sum', time: '2m 31s' },
                { opp: 'LoopBreaker', result: 'WIN', ratingChange: '+15', problem: 'Valid Parens', time: '4m 12s' },
                { opp: 'NullPointer', result: 'LOSS', ratingChange: '-12', problem: 'LRU Cache', time: '15m 00s' },
                { opp: 'RecursiveX', result: 'WIN', ratingChange: '+20', problem: 'Merge Sorted', time: '3m 44s' },
              ].map((match, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className={`w-12 h-6 rounded-lg flex items-center justify-center text-xs font-black
                    ${match.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {match.result}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">vs {match.opp}</div>
                    <div className="text-xs text-slate-500">{match.problem} • {match.time}</div>
                  </div>
                  <div className={`text-sm font-black ${match.ratingChange.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {match.ratingChange}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── COUNTDOWN ── */}
      <AnimatePresence>
        {gameState === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-slate-400 text-lg mb-4 font-semibold">Match found! vs <span className="text-white font-bold">{MOCK_OPPONENT.name}</span></div>
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-[120px] font-black text-white leading-none"
              >
                {countdown || '⚔️'}
              </motion.div>
              <div className="text-slate-400 mt-4">Get ready to code!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PLAYING ── */}
      {gameState === 'playing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Battle Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-6">
            {/* Me */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xl">🥷</div>
              <div>
                <div className="font-bold text-white text-sm">You</div>
                <div className="text-xs text-indigo-400">1,742 ⭐</div>
              </div>
            </div>

            {/* Timer */}
            <div className={`text-center px-6 py-2 rounded-xl border font-black text-2xl tabular-nums
              ${timeLeft < 60 ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-slate-700 text-white bg-slate-800'}`}>
              {formatTime(timeLeft)}
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="text-right">
                <div className="font-bold text-white text-sm">{MOCK_OPPONENT.name}</div>
                <div className="text-xs text-red-400">{MOCK_OPPONENT.rating} ⭐</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xl">
                {MOCK_OPPONENT.avatar}
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-medium">Your progress</div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${myProgress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-medium text-right">{MOCK_OPPONENT.name}'s progress</div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${opponentProgress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
          </div>

          {/* Problem + Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Problem Statement */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-white">{problem.title}</h2>
                <span className={`text-xs font-bold ${DIFF_COLOR[problem.difficulty]}`}>{problem.difficulty}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{problem.description}</p>
              <div className="space-y-2">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs">
                    <div className="text-slate-500 mb-1">Example {i + 1}</div>
                    <div className="text-slate-300"><span className="text-slate-500">Input:</span> {ex.input}</div>
                    <div className="text-slate-300"><span className="text-slate-500">Output:</span> {ex.output}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor (textarea fallback — Monaco not imported here to keep simple) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-slate-500 ml-2 font-mono">solution.py</span>
              </div>
              <textarea
                value={myCode}
                onChange={e => {
                  setMyCode(e.target.value);
                  setMyProgress(Math.min(95, myCode.length / 2));
                }}
                className="flex-1 bg-slate-950 text-slate-200 font-mono text-sm p-4 resize-none focus:outline-none min-h-[240px]"
                spellCheck={false}
              />
              <div className="p-3 border-t border-slate-800 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-colors text-sm"
                >
                  ✅ Submit Solution
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── RESULT ── */}
      <AnimatePresence>
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-12 text-center max-w-md w-full mx-4 shadow-2xl">
              <div className="text-7xl mb-4">{winner === 'me' ? '🏆' : '💀'}</div>
              <h2 className={`text-4xl font-black mb-2 ${winner === 'me' ? 'text-amber-400' : 'text-red-400'}`}>
                {winner === 'me' ? 'VICTORY!' : 'DEFEAT'}
              </h2>
              <p className="text-slate-400 mb-6">
                {winner === 'me'
                  ? `You solved it faster than ${MOCK_OPPONENT.name}!`
                  : `${MOCK_OPPONENT.name} was quicker this time...`}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className={`text-2xl font-black ${winner === 'me' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {winner === 'me' ? '+18' : '-12'}
                  </div>
                  <div className="text-xs text-slate-500 font-bold uppercase mt-1">Rating</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-black text-amber-400">{winner === 'me' ? '+250' : '+50'}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase mt-1">XP Earned</div>
                </div>
              </div>
              <button
                onClick={handleRematch}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-black text-white hover:opacity-90 transition-opacity"
              >
                ⚔️ Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
