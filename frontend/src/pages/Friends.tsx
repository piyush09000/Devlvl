import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_FRIENDS = [
  { id: 1, name: 'ByteKnight', avatar: '⚔️', level: 28, status: 'online', activity: 'Solving "LRU Cache"', streak: 14, mutuals: 3 },
  { id: 2, name: 'Trinity_Dev', avatar: '🌸', level: 22, status: 'away', activity: 'In Guild Hall', streak: 7, mutuals: 5 },
  { id: 3, name: 'NeoCode', avatar: '🤖', level: 20, status: 'online', activity: 'Battle Pass grind', streak: 21, mutuals: 2 },
  { id: 4, name: 'Morpheus_JS', avatar: '😎', level: 35, status: 'offline', activity: 'Last seen 2h ago', streak: 0, mutuals: 1 },
  { id: 5, name: 'LoopBreaker', avatar: '🔄', level: 19, status: 'online', activity: 'PvP Arena', streak: 5, mutuals: 4 },
];

const PENDING_REQUESTS = [
  { id: 6, name: 'AlgoMaster', avatar: '🧠', level: 31, mutuals: 2, sent: false },
  { id: 7, name: 'RecursiveX', avatar: '♾️', level: 17, mutuals: 0, sent: true },
];

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  offline: 'bg-slate-600',
};

const STATUS_LABELS: Record<string, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

export default function Friends() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [findQuery, setFindQuery] = useState('');
  const [challengeTarget, setChallengeTarget] = useState<number | null>(null);

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const online = filtered.filter(f => f.status === 'online');
  const offline = filtered.filter(f => f.status !== 'online');

  const handleAccept = (id: number) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      setFriends(prev => [...prev, { ...req, status: 'offline', activity: 'Just joined!', streak: 0 }]);
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDecline = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">👥 Friends</h1>
          <p className="text-slate-400 text-sm mt-1">Code better together. Challenge your crew.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-slate-400">{online.length} online</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
        {[
          { id: 'friends', label: `👥 Friends (${friends.length})` },
          { id: 'requests', label: `📩 Requests ${requests.filter(r => !r.sent).length > 0 ? `(${requests.filter(r => !r.sent).length})` : ''}` },
          { id: 'find', label: '🔍 Find Players' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >

          {/* ── FRIENDS LIST ── */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              {/* Search */}
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search friends..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />

              {/* Online */}
              {online.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    🟢 Online — {online.length}
                  </div>
                  <div className="space-y-2">
                    {online.map((f, i) => (
                      <FriendCard key={f.id} friend={f} index={i} onChallenge={id => setChallengeTarget(id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Offline */}
              {offline.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    ⚫ Offline — {offline.length}
                  </div>
                  <div className="space-y-2 opacity-70">
                    {offline.map((f, i) => (
                      <FriendCard key={f.id} friend={f} index={i} onChallenge={id => setChallengeTarget(id)} />
                    ))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-4xl mb-3">🔍</div>
                  <p>No friends found matching "{search}"</p>
                </div>
              )}
            </div>
          )}

          {/* ── REQUESTS ── */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {requests.filter(r => !r.sent).length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Incoming</div>
                  <div className="space-y-2">
                    {requests.filter(r => !r.sent).map((req, i) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">{req.avatar}</div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{req.name}</div>
                          <div className="text-xs text-slate-400">Level {req.level} • {req.mutuals} mutual friends</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAccept(req.id)} className="px-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-colors">
                            Accept
                          </button>
                          <button onClick={() => handleDecline(req.id)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold transition-colors">
                            Decline
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {requests.filter(r => r.sent).length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sent</div>
                  <div className="space-y-2">
                    {requests.filter(r => r.sent).map((req, i) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">{req.avatar}</div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{req.name}</div>
                          <div className="text-xs text-slate-400">Level {req.level} • {req.mutuals} mutual friends</div>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full font-medium">Pending</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {requests.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-4xl mb-3">📭</div>
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          )}

          {/* ── FIND PLAYERS ── */}
          {activeTab === 'find' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  value={findQuery}
                  onChange={e => setFindQuery(e.target.value)}
                  placeholder="Search by username..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">Suggested based on your guild & activity</div>
              <div className="space-y-2">
                {[
                  { name: 'AlgoNinja_88', avatar: '🥷', level: 26, solved: 340, mutuals: 5 },
                  { name: 'PythonWitch', avatar: '🧙‍♀️', level: 33, solved: 512, mutuals: 3 },
                  { name: 'JSWarlord', avatar: '⚡', level: 21, solved: 178, mutuals: 2 },
                ].map((player, i) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">{player.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{player.name}</div>
                      <div className="text-xs text-slate-400">Lv.{player.level} • {player.solved} solved • {player.mutuals} mutuals</div>
                    </div>
                    <button className="px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-bold transition-all">
                      + Add Friend
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Challenge Modal */}
      <AnimatePresence>
        {challengeTarget !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setChallengeTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center max-w-sm w-full mx-4"
            >
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-xl font-black text-white mb-2">Send Challenge</h3>
              <p className="text-slate-400 text-sm mb-6">
                Challenge <span className="text-white font-bold">{friends.find(f => f.id === challengeTarget)?.name}</span> to a PvP coding battle!
              </p>
              <div className="space-y-2">
                {['Easy (5 min)', 'Medium (15 min)', 'Hard (30 min)'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setChallengeTarget(null)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-indigo-500 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Friend Card Sub-component ──
function FriendCard({
  friend,
  index,
  onChallenge,
}: {
  friend: typeof MOCK_FRIENDS[0];
  index: number;
  onChallenge: (id: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors group"
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
          {friend.avatar}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${STATUS_COLORS[friend.status]}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{friend.name}</span>
          <span className="text-xs text-slate-600">Lv.{friend.level}</span>
        </div>
        <div className="text-xs text-slate-500 truncate">{friend.activity}</div>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-[10px] font-bold ${STATUS_COLORS[friend.status].replace('bg-', 'text-')}`}>
            {STATUS_LABELS[friend.status]}
          </span>
          {friend.streak > 0 && (
            <span className="text-[10px] text-orange-400 font-bold">🔥 {friend.streak}d streak</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {friend.status === 'online' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChallenge(friend.id)}
            className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-bold transition-all"
          >
            ⚔️ Challenge
          </motion.button>
        )}
        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-medium transition-colors">
          View
        </button>
      </div>
    </motion.div>
  );
}
