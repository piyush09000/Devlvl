import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ── Types ─────────────────────────────────────────
type MessageRole = 'user' | 'mentor';
interface Message {
  id: number;
  role: MessageRole;
  content: string;
  timestamp: Date;
  thinking?: boolean;
}

// ── Mock AI responses ─────────────────────────────
// Moved to backend

const SUGGESTED_QUESTIONS = [
  "Give me a hint without spoiling it",
  "What's the time complexity?",
  "I'm completely stuck, help me",
  "Explain the approach",
  "Review my code for bugs",
];

const MENTOR_PERSONAS = [
  { id: 'sage', name: 'The Code Sage', emoji: '🧙‍♂️', style: 'Wise & Patient', color: 'from-indigo-600 to-purple-700' },
  { id: 'ninja', name: 'Algorithm Ninja', emoji: '🥷', style: 'Blunt & Fast', color: 'from-slate-700 to-slate-900' },
  { id: 'robot', name: 'AI-3000', emoji: '🤖', style: 'Precise & Analytical', color: 'from-cyan-700 to-blue-800' },
];

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'mentor',
      content: "Greetings, developer! ⚡ I am your **AI Mentor**. I've analyzed your coding patterns and noticed you're working on Two Sum.\n\nAsk me anything — hints, complexity analysis, code review, or just tell me where you're stuck!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(MENTOR_PERSONAS[0]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    
    try {
      const res = await axios.post('/api/ai/ask', { message: text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'mentor',
        content: res.data.content,
        timestamp: new Date()
      }]);
    } catch (err) {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'mentor',
        content: "Oops! My neural pathways seem to be jammed. Please try again later.",
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🧠 AI Mentor
            <span className="text-xs font-normal px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">Online</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Your personal coding sensei. Ask anything.</p>
        </div>

        {/* Persona Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(p => !p)}
            className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-lg`}>
              {selectedPersona.emoji}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white">{selectedPersona.name}</div>
              <div className="text-xs text-slate-500">{selectedPersona.style}</div>
            </div>
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          <AnimatePresence>
            {showPersonaMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-20 w-64"
              >
                {MENTOR_PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPersona(p); setShowPersonaMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left
                      ${selectedPersona.id === p.id ? 'bg-slate-800' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl`}>{p.emoji}</div>
                    <div>
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.style}</div>
                    </div>
                    {selectedPersona.id === p.id && <div className="ml-auto text-indigo-400">✓</div>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Context Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">📄</div>
        <div className="flex-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Problem</span>
          <p className="text-sm font-semibold text-white">Two Sum — Easy</p>
        </div>
        <div className="text-xs text-slate-500 text-right">
          <div className="font-mono">⏱ 04:32</div>
          <div>3 attempts</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0
              ${msg.role === 'mentor'
                ? `bg-gradient-to-br ${selectedPersona.color}`
                : 'bg-indigo-500/20 border border-indigo-500/30'}`}
            >
              {msg.role === 'mentor' ? selectedPersona.emoji : '🥷'}
            </div>

            {/* Bubble */}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${msg.role === 'mentor'
                ? 'bg-slate-900 border border-slate-800 text-slate-200'
                : 'bg-indigo-500 text-white ml-auto'}`}
            >
              {/* Simple markdown-lite: bold */}
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {line.split(/(\*\*.*?\*\*|`.*?`)/g).map((seg, j) => {
                    if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={j}>{seg.slice(2, -2)}</strong>;
                    if (seg.startsWith('`') && seg.endsWith('`')) return <code key={j} className="bg-black/30 px-1 rounded font-mono text-xs">{seg.slice(1, -1)}</code>;
                    return seg;
                  })}
                </p>
              ))}
              <div className={`text-[10px] mt-2 ${msg.role === 'mentor' ? 'text-slate-600' : 'text-indigo-200'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Thinking indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-lg flex-shrink-0`}>
                {selectedPersona.emoji}
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 bg-slate-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0 no-scrollbar">
        {SUGGESTED_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={isThinking}
            className="flex-shrink-0 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-300 text-slate-400 rounded-full text-xs font-medium transition-colors disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder={`Ask ${selectedPersona.name}...`}
          disabled={isThinking}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors disabled:opacity-50"
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => sendMessage(input)}
          disabled={isThinking || !input.trim()}
          className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ➤
        </motion.button>
      </div>
    </div>
  );
}
