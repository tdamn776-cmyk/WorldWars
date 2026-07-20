import React, { useState } from 'react';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';
import CHESTS, { rollChest } from '../utils/chestData';
import { RARITY } from '../utils/constants';
import { Package, LockOpen, ArrowLeft } from 'lucide-react';

export default function ShopScreen() {
  const { bp, spendBp, addBp, addXp, unlockTank } = usePlayerStore();
  const { setScreen } = useGameStore();

  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState(null);

  const handleBuyChest = (chest) => {
    if (spendBp(chest.cost)) {
      setOpening(true);
      const result = rollChest(chest);
      
      setTimeout(() => {
        setOpening(false);
        setReward(result);
        
        if (result.type === 'bp') addBp(result.amount);
        if (result.type === 'xp') addXp(result.amount);
        if (result.type === 'tank') {
          import('../utils/tankData').then(module => {
            const TANKS = module.default;
            const rarityTanks = TANKS.filter(t => t.rarity === result.rarity);
            if (rarityTanks.length > 0) {
              const randomTank = rarityTanks[Math.floor(Math.random() * rarityTanks.length)];
              unlockTank(randomTank.id);
              setReward({ ...result, tankName: randomTank.name });
            }
          });
        }
      }, 1500);
    }
  };

  const closeReward = () => setReward(null);

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#050508', color: 'white', overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 25px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setScreen('mainMenu')} style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} /> BACK
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffa500', fontWeight: 'bold', fontSize: '18px' }}>
          <img src="/icons/currency-bp.png" alt="BP" style={{ width: '24px' }} />
          {bp.toLocaleString()}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ width: '100%', textAlign: 'center', margin: '20px 0' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white' }}>SUPPLY CRATES</h1>
          <p style={{ color: '#888' }}>Open crates to unlock rare tanks and BP.</p>
        </div>

        {CHESTS.map(chest => (
          <div key={chest.id} style={{
            width: '280px', background: 'rgba(25,25,35,0.8)', border: `2px solid ${chest.color}`, borderRadius: '16px',
            padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            boxShadow: `0 0 20px ${chest.glow}`, position: 'relative', overflow: 'hidden'
          }}>
            <h2 style={{ color: chest.color, fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', textTransform: 'uppercase' }}>{chest.name}</h2>
            <div style={{ width: '120px', height: '120px', background: `radial-gradient(circle, ${chest.glow} 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Package size={60} color={chest.color} />
            </div>
            <button
              onClick={() => handleBuyChest(chest)} disabled={bp < chest.cost || opening}
              style={{
                width: '100%', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px',
                background: bp >= chest.cost ? 'var(--color-accent-gold)' : '#333', color: bp >= chest.cost ? '#000' : '#666',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: bp >= chest.cost && !opening ? 'pointer' : 'not-allowed'
              }}
            >
              <img src="/icons/currency-bp.png" alt="BP" style={{ width: '20px', filter: bp >= chest.cost ? 'none' : 'grayscale(1)' }} />
              {chest.cost.toLocaleString()}
            </button>
          </div>
        ))}
      </div>

      {opening && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="animate-pulse" style={{ filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.8))' }}><LockOpen size={100} color="white" /></div>
          <h2 style={{ color: 'white', marginTop: '20px', fontFamily: 'var(--font-display)' }}>DECRYPTING...</h2>
        </div>
      )}

      {reward && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="animate-slide-up" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--color-accent-gold)', fontFamily: 'var(--font-display)', marginBottom: '30px', fontSize: '40px' }}>REWARD ACQUIRED!</h1>
            
            {reward.type === 'bp' && (
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <img src="/icons/currency-bp.png" alt="BP" style={{ width: '40px' }} /> +{reward.amount.toLocaleString()} BP
              </div>
            )}

            {reward.type === 'tank' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '24px', color: RARITY[reward.rarity].color, fontWeight: 'bold', marginBottom: '10px' }}>NEW TANK UNLOCKED!</div>
                <div style={{ fontSize: '48px', color: 'white', fontFamily: 'var(--font-display)' }}>{reward.tankName?.toUpperCase()}</div>
              </div>
            )}

            <button onClick={closeReward} style={{ marginTop: '50px', padding: '15px 40px', background: 'white', color: 'black', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold' }}>COLLECT</button>
          </div>
        </div>
      )}
    </div>
  );
}
