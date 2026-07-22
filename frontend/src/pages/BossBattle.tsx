import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';

// Mock Boss Data
const BOSS_DATA = {
  id: 'syntax_sentinel',
  name: 'The Syntax Sentinel',
  world: 'Code Village',
  maxHp: 2000,
  questions: [
    { q: "What keyword is used to declare a variable that cannot be reassigned in JS?", options: ["let", "var", "const", "static"], answer: 2 },
    { q: "Which symbol is used for strict equality in JavaScript?", options: ["==", "=", "===", "=>"], answer: 2 },
    { q: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World')", "alert('Hello World')", "msgBox('Hello World')", "console.log('Hello World')"], answer: 1 },
    // Mocking a few for UI purposes
  ]
};

export default function BossBattle() {
  const { id: _id } = useParams();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS_DATA.maxHp);
  const [playerLives, setPlayerLives] = useState(3);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory' | 'defeat'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Auto-start battle after intro
  useEffect(() => {
    if (gameState === 'intro') {
      const t = setTimeout(() => setGameState('playing'), 3000);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || gameState !== 'playing') return;
    
    setSelectedAnswer(index);
    const isCorrect = index === BOSS_DATA.questions[currentQIndex].answer;
    
    setTimeout(() => {
      if (isCorrect) {
        const damage = Math.floor(BOSS_DATA.maxHp / BOSS_DATA.questions.length);
        setBossHp(prev => Math.max(0, prev - damage));
        
        if (currentQIndex === BOSS_DATA.questions.length - 1 || bossHp - damage <= 0) {
          setGameState('victory');
        } else {
          setCurrentQIndex(q => q + 1);
          setSelectedAnswer(null);
        }
      } else {
        setPlayerLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setGameState('defeat');
          else {
            setCurrentQIndex(q => q + 1);
            setSelectedAnswer(null);
          }
          return newLives;
        });
      }
    }, 1500);
  };

  const currentQ = BOSS_DATA.questions[currentQIndex] || BOSS_DATA.questions[0];

  return (
    <div className="h-[calc(100vh-100px)] bg-[#050505] rounded-3xl overflow-hidden border border-rose-900/50 relative flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-rose-950/50 to-transparent" />
      </div>

      {/* ── Intro Screen ── */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-rose-500 font-black tracking-[0.5em] uppercase text-sm mb-4">Boss Encounter</h3>
              <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(225,29,72,0.5)]">
                {BOSS_DATA.name}
              </h1>
              <p className="text-slate-400 mt-6 text-xl">Prepare yourself...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Game UI ── */}
      <div className="relative z-10 flex flex-col h-full p-8">
        
        {/* Top HUD: Boss Health & Player Lives */}
        <div className="flex justify-between items-start mb-12">
          {/* Player HUD */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex gap-2">
            {[1, 2, 3].map(life => (
              <motion.div 
                key={life}
                animate={{ scale: playerLives >= life ? [1, 1.2, 1] : 0.8, opacity: playerLives >= life ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-3xl filter drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]"
              >
                ❤️
              </motion.div>
            ))}
          </div>

          {/* Boss HUD */}
          <div className="w-1/2 max-w-xl text-center">
            <h2 className="text-2xl font-black text-rose-500 tracking-wider uppercase drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]">
              {BOSS_DATA.name}
            </h2>
            <div className="mt-2 h-4 w-full bg-slate-900 border-2 border-slate-800 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-700 to-rose-500"
                initial={{ width: '100%' }}
                animate={{ width: `${(bossHp / BOSS_DATA.maxHp) * 100}%` }}
                transition={{ duration: 0.5, type: 'spring' }}
              />
            </div>
            <div className="text-xs text-rose-400 font-bold mt-1 tracking-widest">{bossHp} / {BOSS_DATA.maxHp} HP</div>
          </div>
        </div>

        {/* Boss Avatar/Animation Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Floating Boss Graphic */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              filter: ['drop-shadow(0 0 20px rgba(225,29,72,0.3))', 'drop-shadow(0 0 40px rgba(225,29,72,0.6))', 'drop-shadow(0 0 20px rgba(225,29,72,0.3))']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[150px] relative z-10 select-none"
          >
            👾
          </motion.div>
        </div>

        {/* Question Panel */}
        {gameState === 'playing' && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 max-w-3xl mx-auto w-full shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Attack {currentQIndex + 1} of {BOSS_DATA.questions.length}
            </div>
            <h3 className="text-2xl font-bold text-white mb-8">{currentQ.q}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300";
                
                if (selectedAnswer !== null) {
                  if (idx === currentQ.answer) {
                    btnClass = "bg-emerald-900/50 border-emerald-500 text-emerald-400";
                  } else if (idx === selectedAnswer) {
                    btnClass = "bg-rose-900/50 border-rose-500 text-rose-400";
                  } else {
                    btnClass = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${btnClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── End Screens ── */}
      <AnimatePresence>
        {gameState === 'victory' && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-950/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="text-8xl mb-6">🏆</div>
              <h1 className="text-5xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] mb-4">BOSS DEFEATED!</h1>
              <p className="text-emerald-200 text-xl mb-8">You earned the Syntax Sentinel Badge & 500 XP.</p>
              <Link to="/worlds" className="px-8 py-4 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-colors">
                Return to Map
              </Link>
            </div>
          </motion.div>
        )}

        {gameState === 'defeat' && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-rose-950/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="text-8xl mb-6">💀</div>
              <h1 className="text-5xl font-black text-rose-500 drop-shadow-[0_0_20px_rgba(225,29,72,0.5)] mb-4">YOU DIED</h1>
              <p className="text-rose-200 text-xl mb-8">The Syntax Sentinel was too strong.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => window.location.reload()} className="px-8 py-4 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-500 transition-colors">
                  Try Again
                </button>
                <Link to="/worlds" className="px-8 py-4 bg-slate-800 text-white font-black rounded-xl hover:bg-slate-700 transition-colors">
                  Flee
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
