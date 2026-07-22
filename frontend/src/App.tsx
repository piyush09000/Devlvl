import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProblemList from './pages/ProblemList';
import ProblemEditor from './pages/ProblemEditor';
import Dashboard from './pages/Dashboard';
import WorldMap from './pages/WorldMap';
import Leaderboard from './pages/Leaderboard';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import BattlePass from './pages/BattlePass';
import BossBattle from './pages/BossBattle';
import LootBoxes from './pages/LootBoxes';
import Profile from './pages/Profile';
import PvPArena from './pages/PvPArena';
import Guilds from './pages/Guilds';
import Friends from './pages/Friends';
import AIMentor from './pages/AIMentor';
import FocusMode from './pages/FocusMode';
import Analytics from './pages/Analytics';
import Marketplace from './pages/Marketplace';
import AdminPanel from './pages/AdminPanel';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      {!isAuthPage && (
        <nav className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/dashboard" className="text-lg font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex-shrink-0">
              Devlvl
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-0.5 text-sm font-medium text-slate-400 overflow-x-auto no-scrollbar flex-1">
              <NavLink to="/dashboard">🏠</NavLink>
              <NavLink to="/worlds">🗺️ Map</NavLink>
              <NavLink to="/problems">⚔️ Arena</NavLink>
              <NavLink to="/pvp">🥊 PvP</NavLink>
              <NavLink to="/battlepass">★ Pass</NavLink>
              <NavLink to="/loot">📦 Stash</NavLink>
              <NavLink to="/guilds">🛡️ Guild</NavLink>
              <NavLink to="/friends">👥 Friends</NavLink>
              <NavLink to="/mentor">🧠 Mentor</NavLink>
              <NavLink to="/focus">🎯 Focus</NavLink>
              <NavLink to="/analytics">📊 Stats</NavLink>
              <NavLink to="/shop">🏪 Shop</NavLink>
              <NavLink to="/admin">🛡️ Admin</NavLink>
              <NavLink to="/leaderboard">🏆</NavLink>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Notif */}
              <div className="relative group">
                <button className="text-slate-400 hover:text-white transition-colors relative p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900" />
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="divide-y divide-slate-800/50 text-sm">
                    <div className="p-3">
                      <p className="font-bold text-rose-400 text-xs">🔥 Streak at Risk!</p>
                      <p className="text-slate-300 text-xs mt-0.5">Don't break your 7-day streak today!</p>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-indigo-400 text-xs">⚔️ Challenge Received</p>
                      <p className="text-slate-300 text-xs mt-0.5">ByteKnight wants a PvP battle!</p>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-amber-400 text-xs">🎖️ Battle Pass Tier Up!</p>
                      <p className="text-slate-300 text-xs mt-0.5">You reached Tier 15. Claim your reward!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DevCoins badge */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <span className="text-cyan-400 text-sm">💎</span>
                <span className="text-xs font-black text-cyan-300">1,850</span>
              </div>

              {/* Avatar */}
              <Link to="/profile" className="h-7 w-7 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-base hover:bg-indigo-500/30 transition-colors">
                🧙
              </Link>
            </div>
          </div>
        </nav>
      )}

      <main className={!isAuthPage ? "max-w-7xl mx-auto px-4 py-6 flex-1 flex flex-col w-full" : "flex-1 flex flex-col"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/worlds" element={<WorldMap />} />
          <Route path="/skills" element={<WorldMap />} />
          <Route path="/boss/:id" element={<BossBattle />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:id" element={<ProblemEditor />} />
          <Route path="/battlepass" element={<BattlePass />} />
          <Route path="/loot" element={<LootBoxes />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pvp" element={<PvPArena />} />
          <Route path="/arena" element={<PvPArena />} />
          <Route path="/guilds" element={<Guilds />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/mentor" element={<AIMentor />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/shop" element={<Marketplace />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}

// ── Active-aware nav link ──────────────────────────
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap text-xs
        ${isActive
          ? 'bg-indigo-500/20 text-white font-semibold'
          : 'hover:text-white hover:bg-slate-800/70'
        }`}
    >
      {children}
    </Link>
  );
}

export default App;
