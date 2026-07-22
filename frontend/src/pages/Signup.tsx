import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DEVELOPER_CLASSES, PRESET_AVATARS } from '../lib/constants';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatarId: null as number | null,
    developerClass: null as string | null,
  });
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    // In Phase 3, we just mock the completion and go to dashboard
    console.log("Mock Registration Complete:", formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden text-slate-100">
      {/* Animated BG */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl min-h-[600px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-8 md:p-12 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold mb-2">Create your character</h1>
                  <p className="text-slate-400">Join the ultimate coding RPG.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. CodeNinja99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!formData.username || !formData.email || !formData.password}
                  className="mt-8 w-full bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* STEP 2: Choose Avatar */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col w-full"
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold mb-2">Select your Avatar</h1>
                  <p className="text-slate-400">How will you be known in the realm?</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto w-full">
                  {PRESET_AVATARS.map(avatar => (
                    <div 
                      key={avatar.id}
                      onClick={() => setFormData({...formData, avatarId: avatar.id})}
                      className={`cursor-pointer rounded-2xl p-6 text-center border-2 transition-all duration-300 transform hover:scale-105
                        ${formData.avatarId === avatar.id 
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}
                    >
                      <div className="text-5xl mb-3">{avatar.emoji}</div>
                      <div className={`font-medium text-sm ${formData.avatarId === avatar.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                        {avatar.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 flex justify-between max-w-2xl mx-auto w-full">
                  <button onClick={handleBack} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.avatarId}
                    className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Choose Class */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col h-full"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Choose your Class</h1>
                  <p className="text-slate-400">This determines your primary skill tree and starting title.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pb-4 px-2 custom-scrollbar">
                  {DEVELOPER_CLASSES.map(cls => (
                    <div 
                      key={cls.id}
                      onClick={() => setFormData({...formData, developerClass: cls.id})}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 relative overflow-hidden group
                        ${formData.developerClass === cls.id 
                          ? `border-[${cls.color}] shadow-lg` 
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}
                      style={{ 
                        borderColor: formData.developerClass === cls.id ? cls.color : '',
                        boxShadow: formData.developerClass === cls.id ? `0 0 20px ${cls.color}40` : ''
                      }}
                    >
                      {/* Active Gradient Background */}
                      {formData.developerClass === cls.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${cls.gradient} opacity-10`} />
                      )}
                      
                      <div className="relative z-10">
                        <div className="text-4xl mb-4 bg-slate-950 w-16 h-16 rounded-xl flex items-center justify-center shadow-inner border border-slate-800 group-hover:scale-110 transition-transform">
                          {cls.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{cls.name}</h3>
                        <p className="text-xs font-medium mb-3" style={{ color: cls.color }}>{cls.tagline}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{cls.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 flex justify-between border-t border-slate-800">
                  <button onClick={handleBack} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!formData.developerClass}
                    className="px-10 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-indigo-400 hover:to-fuchsia-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:shadow-none"
                  >
                    Enter the Realm
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
