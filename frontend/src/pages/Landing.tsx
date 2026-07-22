import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[60%] right-[10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="absolute bottom-[-10%] left-[40%] w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 60% 80% at 50% 50%, black 20%, transparent 100%)'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-300">Season Zero is live. Join the Beta.</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight"
        >
          Level up your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
            Developer Skills
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-xl md:text-2xl text-slate-400 max-w-3xl mb-12"
        >
          Devlvl is the world's most engaging gamified coding platform. 
          Choose your class, conquer algorithmic boss fights, earn loot, and climb the global leaderboards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/signup" className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Start Your Journey
          </Link>
          <Link to="/dashboard" className="px-8 py-4 bg-slate-900 border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">
            Enter Dashboard (Demo)
          </Link>
        </motion.div>
        
        {/* Mock UI Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="mx-auto text-xs font-mono text-slate-500">devlvl.io/play</div>
          </div>
          <div className="p-8 aspect-[16/9] relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden group">
            {/* Holographic glowing orb effect representing the "game" */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-1000" />
            <div className="relative z-10 text-center">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-4 tracking-widest uppercase filter drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                Boss Fight
              </div>
              <p className="text-slate-300 font-mono">The Recursive Hydra awaits...</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
