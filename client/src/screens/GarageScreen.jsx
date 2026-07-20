import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';
import TANKS, { getTankById } from '../utils/tankData';
import Tank from '../game/Tank';
import { RARITY } from '../utils/constants';

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

  // Visible tank cards (show 3 at a time around current)
  const visibleTanks = useMemo(() => {
    const start = Math.max(0, previewIndex - 1);
    const end = Math.min(sortedTanks.length, previewIndex + 3);
    return sortedTanks.slice(start, end).map((t, i) => ({ ...t, realIndex: start + i }));
  }, [previewIndex, sortedTanks]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #2a3a5a 0%, #4a5a7a 50%, #6a6a6a 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-heading)',
      position: 'relative', overflow: 'hidden'
    }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 15px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '14px' }}>💎</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>0</span>
            <span style={{ color: '#4cff4c', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <img src="/icons/currency-bp.png" alt="BP" style={{ width: '16px' }} />
            <span style={{ color: '#ffc850', fontWeight: 'bold', fontSize: '14px' }}>{bp.toLocaleString()}</span>
            <span style={{ color: '#4cff4c', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
        </div>
        
        {/* Tank selector cards at top */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {visibleTanks.map((t) => {
            const tOwned = ownedTanks.includes(t.id);
            const tRarityColor = RARITY[t.rarity]?.color || '#aaa';
            const isActive = t.realIndex === previewIndex;
            return (
              <button
                key={t.id}
                onClick={() => setPreviewIndex(t.realIndex)}
                style={{
                  width: '55px', height: '55px',
                  background: isActive ? tRarityColor : 'rgba(0,0,0,0.4)',
                  borderRadius: '10px',
                  border: isActive ? '3px solid white' : `2px solid ${tRarityColor}40`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  opacity: tOwned ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: isActive ? '#000' : '#fff', textTransform: 'uppercase' }}>
                  {t.name.substring(0, 5)}
                </span>
                {isActive && tOwned && (
                  <span style={{ position: 'absolute', top: -5, right: -5, fontSize: '14px' }}>✅</span>
                )}
                {!tOwned && (
                  <div style={{
                    position: 'absolute', bottom: 2, right: 2,
                    background: 'rgba(0,0,0,0.8)', borderRadius: '3px', padding: '1px 3px', fontSize: '8px'
                  }}>🔒</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setScreen('mainMenu')}
          style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #ff4444, #cc0000)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 'bold', color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 2px 8px rgba(255,0,0,0.4)'
          }}
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>

        {/* Left Panel — Tank Info */}
        <div style={{
          width: '240px', padding: '15px',
          display: 'flex', flexDirection: 'column', gap: '12px',
          zIndex: 10
        }}>
          {/* Tank Name Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            padding: '8px 15px', borderRadius: '8px',
            textAlign: 'center', fontFamily: 'var(--font-display)',
            fontSize: '16px', fontWeight: '900', color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {previewTank.name.toUpperCase()}
          </div>

          {/* Tank Card */}
          <div style={{
            background: `linear-gradient(135deg, ${rarityColor}30, ${rarityColor}10)`,
            border: `2px solid ${rarityColor}`,
            borderRadius: '12px',
            padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <div style={{ fontSize: '10px', color: rarityColor, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>
              {previewTank.rarity.replace('_', ' ')} • {previewTank.class}
            </div>
            <div style={{
              width: '80px', height: '60px',
              background: `radial-gradient(circle, ${rarityColor}40, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', marginBottom: '5px'
            }}>
              🔫
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              LEVEL 1
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', marginTop: '5px' }}>
              <div style={{ width: '16%', height: '100%', background: '#4cff4c', borderRadius: '3px' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#aaa', marginTop: '3px' }}>1/6</div>
          </div>

          {/* Stat Bars */}
          {statBars.map((stat) => (
            <div key={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                <span>{stat.label}</span>
              </div>
              <div style={{ width: '100%', height: '14px', background: 'rgba(0,0,0,0.5)', borderRadius: '7px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{
                  width: `${(stat.value / stat.max) * 100}%`,
                  height: '100%',
                  background: stat.gradient,
                  borderRadius: '7px',
                  transition: 'width 0.5s ease',
                  boxShadow: `0 0 10px ${stat.color}40`
                }} />
              </div>
            </div>
          ))}

          {/* Level Up / Buy Section */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px', padding: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {isOwned ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>LEVEL UP</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px' }} />
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#ffc850' }}>10</span>
                </div>
                <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>COLLECT MORE CARDS TO LEVEL UP</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                  {!canUnlock ? `UNLOCKS AT LVL ${previewTank.unlockLevel}` : 'AVAILABLE'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px' }} />
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: canAfford ? '#ffc850' : '#ff4444' }}>
                    {previewTank.cost.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Booster */}
          <button style={{
            background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
            padding: '8px', borderRadius: '8px',
            fontWeight: 'bold', fontSize: '14px', color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            BOOSTER <span style={{ fontSize: '20px' }}>+</span>
          </button>
        </div>

        {/* Center — 3D Tank Preview */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Snow/Environment background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(100,120,140,0.3) 60%, #6a6a6a 100%)',
            pointerEvents: 'none', zIndex: 0
          }} />

          <Canvas shadows camera={{ position: [5, 2.5, 5], fov: 40 }} style={{ zIndex: 1 }}>
            <Suspense fallback={null}>
              <Stage environment="warehouse" intensity={0.6} adjustCamera={false}>
                <Tank tankId={previewTank.id} />
              </Stage>
              <OrbitControls
                autoRotate autoRotateSpeed={0.8}
                maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 5}
                minDistance={4} maxDistance={8}
                enablePan={false}
              />
            </Suspense>
          </Canvas>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            disabled={previewIndex === 0}
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              width: '50px', height: '50px', borderRadius: '50%',
              background: previewIndex === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)',
              fontSize: '24px', color: 'white', zIndex: 10,
              border: '2px solid rgba(255,255,255,0.2)',
              cursor: previewIndex === 0 ? 'default' : 'pointer'
            }}
          >
            ◀
          </button>

          <button
            onClick={goNext}
            disabled={previewIndex === sortedTanks.length - 1}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              width: '50px', height: '50px', borderRadius: '50%',
              background: previewIndex === sortedTanks.length - 1 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)',
              fontSize: '24px', color: 'white', zIndex: 10,
              border: '2px solid rgba(255,255,255,0.2)',
              cursor: previewIndex === sortedTanks.length - 1 ? 'default' : 'pointer'
            }}
          >
            ▶
          </button>

          {/* Price tags for locked tanks */}
          {!isOwned && canUnlock && (
            <div style={{
              position: 'absolute', top: 15, right: 80, zIndex: 10,
              display: 'flex', gap: '10px'
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: '5px',
                border: `2px solid ${rarityColor}`
              }}>
                <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px' }} />
                <span style={{ fontWeight: 'bold', color: '#ffc850' }}>{previewTank.cost.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div style={{
        padding: '10px 15px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '2px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 20
      }}>
        <div style={{ fontSize: '14px', color: '#aaa' }}>
          Tank {previewIndex + 1} / {sortedTanks.length}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Play button */}
          <button
            onClick={() => { if (isOwned) { selectTank(previewTank.id); setScreen('battle'); }}}
            style={{
              width: '60px', height: '60px',
              background: isOwned ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isOwned ? '3px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.1)',
              boxShadow: isOwned ? '0 4px 20px rgba(255,0,0,0.4)' : 'none',
              fontSize: '28px', color: isOwned ? 'white' : '#555',
              cursor: isOwned ? 'pointer' : 'not-allowed'
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
