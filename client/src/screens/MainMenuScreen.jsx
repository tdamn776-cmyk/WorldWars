import React, { useState } from 'react';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';

const RARITY_ORDER = ['COMMON', 'RARE', 'SUPER_RARE', 'EPIC', 'MYTHIC', 'LEGENDARY', 'ULTIMATE'];

export default function MainMenuScreen() {
  const { username, level, bp, xp } = usePlayerStore();
  const { setScreen } = useGameStore();
  const [showExit, setShowExit] = useState(false);

  const gameModes = [
    { id: '1vs1', title: '1 VS 1', subtitle: 'Duel', stars: 0, maxStars: 3, color: '#e74c3c', gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)', icon: '⚔️' },
    { id: '2vs2', title: '2 VS 2', subtitle: 'Team Battle', stars: 0, maxStars: 3, color: '#3498db', gradient: 'linear-gradient(135deg, #3498db, #2980b9)', icon: '🛡️' },
    { id: 'adventure', title: 'ADVENTURE', subtitle: 'Campaign', stars: 0, maxStars: 3, color: '#2ecc71', gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)', icon: '🗺️' },
    { id: 'classic', title: 'CLASSIC', subtitle: 'Free For All', stars: 0, maxStars: 3, color: '#f39c12', gradient: 'linear-gradient(135deg, #f39c12, #e67e22)', icon: '🏆' },
  ];

  const sideButtons = [
    { icon: '⚠️', label: 'Events', action: () => {} },
    { icon: '🛒', label: 'Shop', action: () => setScreen('shop') },
    { icon: '👑', label: 'Rank', action: () => {} },
    { icon: '⚙️', label: 'Settings', action: () => setScreen('admin') },
  ];

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #1a3a6a 0%, #2a5aaa 40%, #3a6acc 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-heading)',
      position: 'relative', overflow: 'hidden'
    }}>

      {/* Top Currency Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 15px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Gems */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '16px' }}>💎</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>0</span>
            <span style={{ color: '#4cff4c', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
          {/* Coins/BP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px', height: '18px' }} />
            <span style={{ color: '#ffc850', fontWeight: 'bold', fontSize: '14px' }}>{bp.toLocaleString()}</span>
            <span style={{ color: '#4cff4c', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
          {/* Chests */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <span style={{ fontSize: '16px' }}>📦</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>1</span>
            <span style={{ color: '#4cff4c', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', padding: '3px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
            VIP
          </div>
          {/* Close Button */}
          <button
            onClick={() => setShowExit(true)}
            style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #ff4444, #cc0000)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: 'bold', color: 'white',
              boxShadow: '0 2px 8px rgba(255,0,0,0.4)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', padding: '10px', gap: '10px', overflow: 'hidden' }}>

        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
          {sideButtons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              style={{
                width: '52px', height: '52px',
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
                transition: 'transform 0.1s'
              }}
              onPointerDown={(e) => e.target.style.transform = 'scale(0.9)'}
              onPointerUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Game Mode Cards */}
        <div style={{
          flex: 1, display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'stretch',
          overflowX: 'auto', padding: '5px 0'
        }}>
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setScreen('battle')}
              style={{
                width: '160px', minWidth: '140px',
                background: mode.gradient,
                borderRadius: '16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: `0 6px 20px rgba(0,0,0,0.4), inset 0 -4px 0 rgba(0,0,0,0.2)`,
                padding: '15px 10px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.15s'
              }}
              onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                {[...Array(3)].map((_, i) => (
                  <span key={i} style={{ fontSize: '22px', color: i < mode.stars ? '#ffd700' : 'rgba(255,255,255,0.3)' }}>★</span>
                ))}
              </div>

              {/* Icon */}
              <div style={{ fontSize: '40px', marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                {mode.icon}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px', fontWeight: '900', color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: '4px',
                lineHeight: 1.1
              }}>
                {mode.title}
              </div>

              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
                {mode.subtitle}
              </div>

              {/* Win count */}
              <div style={{
                marginTop: '10px',
                background: 'rgba(0,0,0,0.3)',
                padding: '4px 15px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                <span style={{ fontSize: '14px' }}>💀</span>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>0</span>
              </div>

              {/* Shine effect */}
              <div style={{
                position: 'absolute', top: 0, left: '-50%', width: '200%', height: '100%',
                background: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                animation: 'shimmer 3s infinite',
                pointerEvents: 'none'
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section — Chest Progress + Buttons */}
      <div style={{
        padding: '10px 15px',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '2px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {/* Chest progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '18px', color: '#ffd700' }}>★</span>
          <div style={{ flex: 1, maxWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa', marginBottom: '3px' }}>
              <span>0/3</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #4cff4c, #00cc00)', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{
            width: '40px', height: '40px', background: 'linear-gradient(135deg, #4a7a4a, #2a5a2a)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.2)', fontSize: '20px'
          }}>📦</div>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setScreen('garage')}
            style={{
              width: '60px', height: '60px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid rgba(255,255,255,0.2)',
              fontSize: '28px'
            }}
          >
            🔧
          </button>

          {/* PLAY Button */}
          <button
            onClick={() => setScreen('battle')}
            style={{
              width: '70px', height: '70px',
              background: 'linear-gradient(135deg, #ff4444, #cc0000)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '4px solid rgba(255,255,255,0.4)',
              boxShadow: '0 4px 20px rgba(255,0,0,0.5), inset 0 -3px 0 rgba(0,0,0,0.3)',
              fontSize: '32px'
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExit && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="animate-slide-up" style={{
            background: 'linear-gradient(135deg, #1a2a4a, #0a1a3a)',
            border: '3px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '30px 40px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: '#ffa500', marginBottom: '15px' }}>EXIT GAME?</h2>
            <p style={{ color: '#aaa', marginBottom: '25px' }}>Are you sure you want to leave the warzone?</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowExit(false)}
                style={{
                  padding: '12px 30px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4cff4c, #00cc00)',
                  color: '#000', fontWeight: 'bold', fontSize: '16px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                STAY
              </button>
              <button
                onClick={() => window.close()}
                style={{
                  padding: '12px 30px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                  color: '#fff', fontWeight: 'bold', fontSize: '16px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                EXIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
