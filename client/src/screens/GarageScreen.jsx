import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';
import TANKS, { getTankById } from '../utils/tankData';
import Tank from '../game/Tank';
import { RARITY } from '../utils/constants';
import { Diamond, Check, Lock, Play, ChevronLeft, ChevronRight, Crosshair, Plus } from 'lucide-react';

const RARITY_ORDER = ['COMMON', 'RARE', 'SUPER_RARE', 'EPIC', 'MYTHIC', 'LEGENDARY', 'ULTIMATE'];

export default function GarageScreen() {
  const { bp, level, ownedTanks, selectedTankId, selectTank, unlockTank, spendBp } = usePlayerStore();
  const { setScreen } = useGameStore();

  const sortedTanks = useMemo(() =>
    [...TANKS].sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)),
  []);

  const [previewIndex, setPreviewIndex] = useState(() =>
    sortedTanks.findIndex(t => t.id === selectedTankId) || 0
  );

  const previewTank = sortedTanks[previewIndex];
  const isOwned = ownedTanks.includes(previewTank.id);
  const isSelected = selectedTankId === previewTank.id;
  const canUnlock = level >= previewTank.unlockLevel;
  const canAfford = bp >= previewTank.cost;

  const handleAction = () => {
    if (isSelected) return;
    if (isOwned) {
      selectTank(previewTank.id);
    } else if (canUnlock && canAfford) {
      if (spendBp(previewTank.cost)) {
        unlockTank(previewTank.id);
        selectTank(previewTank.id);
      }
    }
  };

  const goNext = () => setPreviewIndex(i => Math.min(i + 1, sortedTanks.length - 1));
  const goPrev = () => setPreviewIndex(i => Math.max(i - 1, 0));

  const rarityColor = RARITY[previewTank.rarity]?.color || '#aaa';

  const statBars = [
    { label: 'ARMOR', value: previewTank.stats.defense, max: 100, color: '#e74c3c', gradient: 'linear-gradient(90deg, #e74c3c, #ff6b6b)' },
    { label: 'GUN', value: previewTank.stats.attack, max: 1000, color: '#2ecc71', gradient: 'linear-gradient(90deg, #f39c12, #e67e22, #e74c3c)' },
    { label: 'ENGINE', value: previewTank.stats.speed, max: 15, color: '#3498db', gradient: 'linear-gradient(90deg, #3498db, #2ecc71)' },
  ];

  const visibleTanks = useMemo(() => {
    const start = Math.max(0, previewIndex - 1);
    const end = Math.min(sortedTanks.length, previewIndex + 3);
    return sortedTanks.slice(start, end).map((t, i) => ({ ...t, realIndex: start + i }));
  }, [previewIndex, sortedTanks]);

  return (
    <div style={{
      width: '100%', height: '100%', background: 'linear-gradient(180deg, #2a3a5a 0%, #4a5a7a 50%, #6a6a6a 100%)',
      display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-heading)', position: 'relative', overflow: 'hidden'
    }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 15px',
        background: 'rgba(0,0,0,0.3)', borderBottom: '2px solid rgba(255,255,255,0.1)', zIndex: 20
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <Diamond size={14} color="#45aaf2" />
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>0</span>
            <Plus size={14} color="#4cff4c" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <img src="/icons/currency-bp.png" alt="BP" style={{ width: '16px' }} />
            <span style={{ color: '#ffc850', fontWeight: 'bold', fontSize: '14px' }}>{bp.toLocaleString()}</span>
            <Plus size={14} color="#4cff4c" />
          </div>
        </div>
        
        {/* Tank selector cards */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {visibleTanks.map((t) => {
            const tOwned = ownedTanks.includes(t.id);
            const tRarityColor = RARITY[t.rarity]?.color || '#aaa';
            const isActive = t.realIndex === previewIndex;
            return (
              <button
                key={t.id} onClick={() => setPreviewIndex(t.realIndex)}
                style={{
                  width: '55px', height: '55px', background: isActive ? tRarityColor : 'rgba(0,0,0,0.4)',
                  borderRadius: '10px', border: isActive ? '3px solid white' : `2px solid ${tRarityColor}40`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', opacity: tOwned ? 1 : 0.6, transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: isActive ? '#000' : '#fff', textTransform: 'uppercase' }}>
                  {t.name.substring(0, 5)}
                </span>
                {isActive && tOwned && (
                  <div style={{ position: 'absolute', top: -5, right: -5 }}><Check size={16} color="#000" /></div>
                )}
                {!tOwned && (
                  <div style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,0.8)', borderRadius: '3px', padding: '2px' }}>
                    <Lock size={10} color="white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <button onClick={() => setScreen('mainMenu')} style={{
          width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff4444, #cc0000)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(255,0,0,0.4)'
        }}><span style={{color:'white', fontWeight:'bold'}}>✕</span></button>
      </div>

      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        <div style={{ width: '240px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10 }}>
          <div style={{
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)', padding: '8px 15px', borderRadius: '8px',
            textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '900', color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.3)'
          }}>{previewTank.name.toUpperCase()}</div>

          <div style={{ background: `linear-gradient(135deg, ${rarityColor}30, ${rarityColor}10)`, border: `2px solid ${rarityColor}`, borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '10px', color: rarityColor, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>
              {previewTank.rarity.replace('_', ' ')} • {previewTank.class}
            </div>
            <div style={{ width: '80px', height: '60px', background: `radial-gradient(circle, ${rarityColor}40, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
              <Crosshair size={36} color="white" />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>LEVEL 1</div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', marginTop: '5px' }}>
              <div style={{ width: '16%', height: '100%', background: '#4cff4c', borderRadius: '3px' }} />
            </div>
          </div>

          {statBars.map((stat) => (
            <div key={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                <span>{stat.label}</span>
              </div>
              <div style={{ width: '100%', height: '14px', background: 'rgba(0,0,0,0.5)', borderRadius: '7px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${(stat.value / stat.max) * 100}%`, height: '100%', background: stat.gradient, borderRadius: '7px' }} />
              </div>
            </div>
          ))}

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {isOwned ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>LEVEL UP</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px' }} />
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#ffc850' }}>10</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleAction}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>{!canUnlock ? `UNLOCKS AT LVL ${previewTank.unlockLevel}` : 'AVAILABLE'}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px' }} />
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: canAfford ? '#ffc850' : '#ff4444' }}>{previewTank.cost.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(100,120,140,0.3) 60%, #6a6a6a 100%)', pointerEvents: 'none', zIndex: 0 }} />
          <Canvas shadows camera={{ position: [5, 2.5, 5], fov: 40 }} style={{ zIndex: 1 }}>
            <Suspense fallback={null}>
              <Stage environment="warehouse" intensity={0.6} adjustCamera={false}>
                <Tank tankId={previewTank.id} />
              </Stage>
              <OrbitControls autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 5} minDistance={4} maxDistance={8} enablePan={false} />
            </Suspense>
          </Canvas>

          <button onClick={goPrev} disabled={previewIndex === 0} style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            width: '50px', height: '50px', borderRadius: '50%', background: previewIndex === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)',
            zIndex: 10, border: '2px solid rgba(255,255,255,0.2)', cursor: previewIndex === 0 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems:'center'
          }}>
            <ChevronLeft size={30} color="white" />
          </button>
          <button onClick={goNext} disabled={previewIndex === sortedTanks.length - 1} style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            width: '50px', height: '50px', borderRadius: '50%', background: previewIndex === sortedTanks.length - 1 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)',
            zIndex: 10, border: '2px solid rgba(255,255,255,0.2)', cursor: previewIndex === sortedTanks.length - 1 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems:'center'
          }}>
            <ChevronRight size={30} color="white" />
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div style={{
        padding: '10px 15px', background: 'rgba(0,0,0,0.4)', borderTop: '2px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20
      }}>
        <div style={{ fontSize: '14px', color: '#aaa' }}>Tank {previewIndex + 1} / {sortedTanks.length}</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => { if (isOwned) { selectTank(previewTank.id); setScreen('battle'); }}}
            style={{
              width: '60px', height: '60px', background: isOwned ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 'rgba(255,255,255,0.1)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isOwned ? '3px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.1)',
              boxShadow: isOwned ? '0 4px 20px rgba(255,0,0,0.4)' : 'none', cursor: isOwned ? 'pointer' : 'not-allowed'
            }}
          >
            <Play size={28} color={isOwned ? "white" : "#555"} fill={isOwned ? "white" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
