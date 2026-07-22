import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ── Mock Data ──────────────────────────────────────
const SHOP_ITEMS = [
  // Avatars
  { id: 1, category: 'avatars', name: 'Cyber Samurai', emoji: '🥷', rarity: 'epic', price: 800, devCoinPrice: null, owned: false, new: true },
  { id: 2, category: 'avatars', name: 'Dragon Mage', emoji: '🐉', rarity: 'legendary', price: null, devCoinPrice: 2500, owned: false, new: false },
  { id: 3, category: 'avatars', name: 'Space Hacker', emoji: '👾', rarity: 'rare', price: 400, devCoinPrice: null, owned: true, new: false },
  { id: 4, category: 'avatars', name: 'Neon Witch', emoji: '🧙‍♀️', rarity: 'epic', price: 700, devCoinPrice: null, owned: false, new: false },
  // Pets
  { id: 5, category: 'pets', name: 'AI Robot', emoji: '🤖', rarity: 'legendary', price: null, devCoinPrice: 3000, owned: true, new: false },
  { id: 6, category: 'pets', name: 'Code Serpent', emoji: '🐍', rarity: 'epic', price: 900, devCoinPrice: null, owned: false, new: true },
  { id: 7, category: 'pets', name: 'Debug Bunny', emoji: '🐰', rarity: 'rare', price: 350, devCoinPrice: null, owned: false, new: false },
  { id: 8, category: 'pets', name: 'Matrix Cat', emoji: '😸', rarity: 'uncommon', price: 200, devCoinPrice: null, owned: false, new: false },
  // Titles
  { id: 9, category: 'titles', name: 'The Unbugable', emoji: '🛡️', rarity: 'legendary', price: null, devCoinPrice: 4000, owned: false, new: false },
  { id: 10, category: 'titles', name: 'Stack Sorcerer', emoji: '📚', rarity: 'epic', price: 600, devCoinPrice: null, owned: false, new: true },
  { id: 11, category: 'titles', name: 'Loop Slayer', emoji: '🔄', rarity: 'rare', price: 300, devCoinPrice: null, owned: false, new: false },
  // Boosts
  { id: 12, category: 'boosts', name: 'XP Surge (24h)', emoji: '⚡', rarity: 'common', price: 100, devCoinPrice: null, owned: false, new: false },
  { id: 13, category: 'boosts', name: 'Hint Shield', emoji: '🛡️', rarity: 'uncommon', price: 150, devCoinPrice: null, owned: false, new: false },
  { id: 14, category: 'boosts', name: 'Streak Freeze', emoji: '🧊', rarity: 'rare', price: 250, devCoinPrice: null, owned: false, new: false },
];

const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🏪' },
  { id: 'avatars', label: 'Avatars', emoji: '🎭' },
  { id: 'pets', label: 'Pets', emoji: '🐾' },
  { id: 'titles', label: 'Titles', emoji: '📛' },
  { id: 'boosts', label: 'Boosts', emoji: '⚡' },
];

const RARITY_CONFIG: Record<string, { label: string; color: string; glow: string; bg: string }> = {
  common:    { label: 'Common',    color: 'text-slate-400',   glow: '',                              bg: 'border-slate-700' },
  uncommon:  { label: 'Uncommon',  color: 'text-emerald-400', glow: 'shadow-[0_0_12px_rgba(52,211,153,0.25)]', bg: 'border-emerald-500/30' },
  rare:      { label: 'Rare',      color: 'text-blue-400',    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]', bg: 'border-blue-500/30' },
  epic:      { label: 'Epic',      color: 'text-fuchsia-400', glow: 'shadow-[0_0_16px_rgba(217,70,239,0.35)]', bg: 'border-fuchsia-500/30' },
  legendary: { label: 'Legendary', color: 'text-amber-400',   glow: 'shadow-[0_0_20px_rgba(245,158,11,0.45)]', bg: 'border-amber-500/30' },
};

export default function Marketplace() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'price' | 'rarity' | 'new'>('new');
  const [preview, setPreview] = useState<any | null>(null);
  const [inventory, setInventory] = useState<number[]>([]);
  const [devCoins, setDevCoins] = useState(1850);
  const [toast, setToast] = useState<string | null>(null);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch items from API
    axios.get('/api/marketplace/items')
      .then(res => {
        setShopItems(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch store items:', err);
        // Fallback to local items if API fails (for demo purposes)
        setShopItems(SHOP_ITEMS);
        setIsLoading(false);
      });
      
    // Fetch user profile for devCoins and inventory
    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setDevCoins(res.data.dev_coins || 0);
      // In a real app we'd fetch actual inventory
    })
    .catch(err => console.error(err));
  }, []);

  const filtered = shopItems
    .filter(item => category === 'all' || item.category === category)
    .sort((a, b) => {
      if (sort === 'new') return (b.new ? 1 : 0) - (a.new ? 1 : 0);
      if (sort === 'price') return (a.price ?? a.devCoinPrice ?? 0) - (b.price ?? b.devCoinPrice ?? 0);
      const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
    });

  const handleBuy = async (item: any) => {
    const cost = item.devCoinPrice ?? item.price ?? 0;
    if (item.devCoinPrice && devCoins < cost) {
      setToast('❌ Not enough DevCoins!');
      setTimeout(() => setToast(null), 2500);
      return;
    }
    
    try {
      const res = await axios.post('/api/marketplace/buy', { item_id: item.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDevCoins(res.data.dev_coins);
      setInventory(prev => [...prev, item.id]);
      setPreview(null);
      setToast(`✅ ${item.name} added to your collection!`);
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast('❌ ' + (err.response?.data?.error || 'Failed to purchase item'));
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">🏪 Marketplace</h1>
          <p className="text-slate-400 text-sm mt-0.5">Spend your DevCoins. Look legendary doing it.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl">
            <span className="text-cyan-400 font-black text-lg">💎</span>
            <span className="font-black text-white">{devCoins.toLocaleString()}</span>
            <span className="text-xs text-slate-500">DevCoins</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border
              ${category === cat.id
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}

        <div className="ml-auto flex-shrink-0 flex items-center gap-2 pl-4">
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="new">Newest</option>
            <option value="rarity">Rarity</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Item Grid */}
      {isLoading ? (
        <div className="text-center text-slate-400 py-12">Loading store...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item, i) => {
            const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG['common'];
            const owned = inventory.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => setPreview(item)}
                className={`relative bg-slate-900 border-2 rounded-2xl p-5 cursor-pointer flex flex-col items-center text-center transition-all duration-200
                  ${rarity.bg} ${rarity.glow} ${owned ? 'opacity-60' : ''}`}
              >
                {item.new && !owned && (
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">NEW</div>
                )}
                {owned && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">OWNED</div>
                )}
  
                <div className="text-4xl mb-3">{item.emoji}</div>
                <div className="font-bold text-white text-sm mb-1">{item.name}</div>
                <div className={`text-[10px] font-black uppercase mb-3 ${rarity.color}`}>{rarity.label}</div>
  
                <div className="mt-auto">
                  {owned ? (
                    <div className="text-xs text-emerald-400 font-bold">In Collection ✓</div>
                  ) : item.devCoinPrice ? (
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-cyan-400 font-black">💎</span>
                      <span className="text-white font-black">{item.devCoinPrice.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-amber-400 font-black">★</span>
                      <span className="text-white font-black">{item.price}</span>
                      <span className="text-[10px] text-slate-500">BP</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Item Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 30 }}
              onClick={e => e.stopPropagation()}
              className={`bg-slate-900 border-2 ${RARITY_CONFIG[preview.rarity].bg} ${RARITY_CONFIG[preview.rarity].glow}
                rounded-3xl p-8 max-w-sm w-full text-center`}
            >
              <motion.div className="text-7xl mb-4" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                {preview.emoji}
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-1">{preview.name}</h2>
              <div className={`text-sm font-black uppercase mb-2 ${RARITY_CONFIG[preview.rarity].color}`}>
                {RARITY_CONFIG[preview.rarity].label} • {preview.category}
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Add this to your collection and equip it from your Profile page.
              </p>

              {inventory.includes(preview.id) ? (
                <div className="py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
                  ✓ Already in your collection
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="py-3 bg-slate-800 rounded-xl">
                    {preview.devCoinPrice ? (
                      <div className="text-xl font-black text-white">💎 {preview.devCoinPrice.toLocaleString()} DevCoins</div>
                    ) : (
                      <div className="text-xl font-black text-white">★ {preview.price} Battle Pass Points</div>
                    )}
                  </div>
                  <button onClick={() => handleBuy(preview)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-black text-white hover:opacity-90 transition-opacity">
                    🛒 Purchase
                  </button>
                  <button onClick={() => setPreview(null)}
                    className="w-full py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors">
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className="fixed bottom-8 left-1/2 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
