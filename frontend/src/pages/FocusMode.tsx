import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FocusPhase = 'setup' | 'session' | 'break' | 'done';

const AMBIENCES = [
  { id: 'lofi', name: 'Lo-fi Beats', emoji: '🎵', description: 'Chill hip-hop vibes' },
  { id: 'rain', name: 'Rain Sounds', emoji: '🌧️', description: 'Soft rainfall' },
  { id: 'forest', name: 'Forest', emoji: '🌲', description: 'Birds & wind' },
  { id: 'none', name: 'Silence', emoji: '🔇', description: 'Pure focus' },
];

const PRESETS = [
  { label: 'Pomodoro', work: 25, rest: 5 },
  { label: 'Deep Work', work: 90, rest: 20 },
  { label: 'Quick Sprint', work: 15, rest: 3 },
];

export default function FocusMode() {
  const [phase, setPhase] = useState<FocusPhase>('setup');
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedAmbience, setSelectedAmbience] = useState(AMBIENCES[0]);
  const [completedToday, setCompletedToday] = useState(3);
  const [goal, setGoal] = useState('Solve Two Sum using a hash map approach');
  const [distractions, setDistractions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = phase === 'session' ? workMinutes * 60 : breakMinutes * 60;
  const progress = 1 - timeLeft / totalTime;
  const circumference = 2 * Math.PI * 110;

  useEffect(() => {
    if (phase === 'session' || phase === 'break') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            if (phase === 'session') {
              setSessionCount(c => c + 1);
              setCompletedToday(c => c + 1);
              setPhase('break');
              setTimeLeft(breakMinutes * 60);
            } else {
              setPhase('done');
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current!);
    }
  }, [phase, breakMinutes]);

  const startSession = () => {
    setTimeLeft(workMinutes * 60);
    setPhase('session');
  };

  const skipBreak = () => {
    setPhase('done');
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setPhase('setup');
    setTimeLeft(workMinutes * 60);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">🎯 Focus Mode</h1>
          <p className="text-slate-400 text-sm mt-0.5">Deep work sessions with Pomodoro timing. No distractions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xl font-black text-amber-400">{completedToday}</div>
            <div className="text-[10px] uppercase text-slate-500 font-bold">Sessions Today</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-indigo-400">{sessionCount}</div>
            <div className="text-[10px] uppercase text-slate-500 font-bold">This Run</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

        {/* ── Timer Panel ── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">

            {/* SETUP */}
            {phase === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 h-full flex flex-col"
              >
                <h2 className="font-bold text-white mb-6">Configure Your Session</h2>

                {/* Goal Input */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Session Goal</label>
                  <input
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    placeholder="What will you work on?"
                  />
                </div>

                {/* Presets */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Quick Presets</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map(p => (
                      <button key={p.label}
                        onClick={() => { setWorkMinutes(p.work); setBreakMinutes(p.rest); }}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all
                          ${workMinutes === p.work ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                      >
                        <div>{p.label}</div>
                        <div className="text-xs font-normal opacity-70">{p.work}m / {p.rest}m</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom sliders */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { label: 'Work Time', value: workMinutes, set: setWorkMinutes, min: 5, max: 120, color: 'indigo' },
                    { label: 'Break Time', value: breakMinutes, set: setBreakMinutes, min: 1, max: 30, color: 'emerald' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</label>
                        <span className="text-sm font-black text-white">{s.value}m</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} value={s.value}
                        onChange={e => s.set(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={startSession}
                  className="mt-auto w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-black text-white text-lg shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all"
                >
                  🎯 Start Focus Session
                </motion.button>
              </motion.div>
            )}

            {/* SESSION / BREAK */}
            {(phase === 'session' || phase === 'break') && (
              <motion.div key="timer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className={`rounded-3xl border p-8 h-full flex flex-col items-center justify-center relative overflow-hidden
                  ${phase === 'break' ? 'bg-emerald-950/30 border-emerald-800/30' : 'bg-slate-900 border-slate-800'}`}
              >
                {/* Background pulse */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl ${phase === 'break' ? 'bg-emerald-500/5' : 'bg-indigo-500/5'}`}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="text-sm font-bold uppercase tracking-wider mb-6 relative z-10"
                  style={{ color: phase === 'break' ? '#34d399' : '#818cf8' }}>
                  {phase === 'break' ? '☕ Break Time' : '🔥 Focus Session'}
                </div>

                {/* SVG Ring Timer */}
                <div className="relative mb-6 z-10">
                  <svg width="260" height="260" className="-rotate-90">
                    <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <motion.circle
                      cx="130" cy="130" r="110" fill="none"
                      stroke={phase === 'break' ? '#34d399' : '#6366f1'}
                      strokeWidth="12" strokeLinecap="round"
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset: circumference * (1 - progress) }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-black text-white tabular-nums">{formatTime(timeLeft)}</div>
                    <div className="text-sm text-slate-500 mt-1">{Math.round(progress * 100)}% done</div>
                  </div>
                </div>

                {/* Goal reminder */}
                <div className="px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-slate-400 text-center mb-6 z-10 max-w-xs">
                  🎯 <span className="text-slate-200">{goal}</span>
                </div>

                <div className="flex gap-3 z-10">
                  <button onClick={reset}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-colors">
                    ✕ End
                  </button>
                  {phase === 'break' && (
                    <button onClick={skipBreak}
                      className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold text-sm transition-colors">
                      ⏭ Skip Break
                    </button>
                  )}
                  <button onClick={() => setDistractions(d => d + 1)}
                    className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-colors">
                    😵 Distracted
                  </button>
                </div>
              </motion.div>
            )}

            {/* DONE */}
            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center"
              >
                <motion.div className="text-7xl mb-4" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>🏆</motion.div>
                <h2 className="text-3xl font-black text-white mb-2">Session Complete!</h2>
                <p className="text-slate-400 mb-8">You stayed focused for <span className="text-white font-bold">{workMinutes} minutes</span>. That's {Math.round(workMinutes * 2.5)} XP earned!</p>
                <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-xs">
                  <div className="bg-slate-950 rounded-xl p-4">
                    <div className="text-xl font-black text-amber-400">{Math.round(workMinutes * 2.5)}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">XP</div>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-4">
                    <div className="text-xl font-black text-red-400">{distractions}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">Breaks</div>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-4">
                    <div className="text-xl font-black text-indigo-400">{sessionCount + 1}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">Sessions</div>
                  </div>
                </div>
                <button onClick={() => { setPhase('setup'); setDistractions(0); }}
                  className="w-full max-w-xs py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-black text-white hover:opacity-90 transition-opacity">
                  🎯 Start Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Panel ── */}
        <div className="space-y-4">
          {/* Ambience */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🎵 Ambience</h3>
            <div className="space-y-2">
              {AMBIENCES.map(a => (
                <button key={a.id} onClick={() => setSelectedAmbience(a)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
                    ${selectedAmbience.id === a.id ? 'bg-indigo-500/20 border border-indigo-500/40' : 'hover:bg-slate-800 border border-transparent'}`}
                >
                  <span className="text-xl">{a.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{a.name}</div>
                    <div className="text-xs text-slate-500">{a.description}</div>
                  </div>
                  {selectedAmbience.id === a.id && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Heatmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">📅 Weekly Focus</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {['M','T','W','T','F','S','S'].map((day, i) => {
                const intensity = [3, 2, 4, 1, 2, 0, 3][i];
                return (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-slate-600 mb-1">{day}</div>
                    <div className={`w-full aspect-square rounded-md ${
                      intensity === 0 ? 'bg-slate-800' :
                      intensity === 1 ? 'bg-indigo-900' :
                      intensity === 2 ? 'bg-indigo-700' :
                      intensity === 3 ? 'bg-indigo-500' : 'bg-indigo-400'
                    }`} title={`${intensity} sessions`} />
                    <div className="text-[9px] text-slate-600 mt-1">{intensity}×</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-slate-500 text-center">15 sessions this week • 6.2h focused</div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-indigo-400 mb-2">💡 Focus Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Close all unrelated tabs before starting. Your brain takes <strong className="text-slate-200">23 minutes</strong> to fully recover from a distraction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
