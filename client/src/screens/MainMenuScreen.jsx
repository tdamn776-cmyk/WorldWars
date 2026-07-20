import React, { useState } from 'react';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';
import { 
  Diamond, Package, Settings, Crown, ShoppingCart, 
  AlertTriangle, Swords, Shield, Map, Trophy, Skull, 
  Play, Wrench, X, Star
} from 'lucide-react';

export default function MainMenuScreen() {
  const { bp } = usePlayerStore();
  const { setScreen } = useGameStore();
  const [showExit, setShowExit] = useState(false);

  const gameModes = [
    { id: '1vs1', title: '1 VS 1', subtitle: 'Duel', stars: 0, maxStars: 3, color: '#e74c3c', gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)', icon: <Swords size={40} color="white" /> },
    { id: '2vs2', title: '2 VS 2', subtitle: 'Team Battle', stars: 0, maxStars: 3, color: '#3498db', gradient: 'linear-gradient(135deg, #3498db, #2980b9)', icon: <Shield size={40} color="white" /> },
    { id: 'adventure', title: 'ADVENTURE', subtitle: 'Campaign', stars: 0, maxStars: 3, color: '#2ecc71', gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)', icon: <Map size={40} color="white" /> },
    { id: 'classic', title: 'CLASSIC', subtitle: 'Free For All', stars: 0, maxStars: 3, color: '#f39c12', gradient: 'linear-gradient(135deg, #f39c12, #e67e22)', icon: <Trophy size={40} color="white" /> },
  ];

  const sideButtons = [
    { icon: <AlertTriangle size={22} color="white" />, label: 'Events', action: () => {} },
    { icon: <ShoppingCart size={22} color="white" />, label: 'Shop', action: () => setScreen('shop') },
    { icon: <Crown size={22} color="white" />, label: 'Rank', action: () => {} },
    { icon: <Settings size={22} color="white" />, label: 'Settings', action: () => setScreen('admin') },
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
        padding: '8px 15px', background: 'rgba(0,0,0,0.3)',
        borderBottom: '2px solid rgba(255,255,255,0.1)', zIndex: 20
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <Diamond size={16} color="#45aaf2" />
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>0</span>
            <span style={{ color: '#4cff4c', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <img src="/icons/currency-bp.png" alt="BP" style={{ width: '18px', height: '18px' }} />
            <span style={{ color: '#ffc850', fontWeight: 'bold', fontSize: '14px' }}>{bp.toLocaleString()}</span>
            <span style={{ color: '#4cff4c', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '20px' }}>
            <Package size={16} color="#fa8231" />
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>1</span>
            <span style={{ color: '#4cff4c', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', padding: '3px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
            VIP
          </div>
          <button
            onClick={() => setShowExit(true)}
            style={{
              width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff4444, #cc0000)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255,0,0,0.4)', border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            <X size={20} color="white" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', padding: '10px', gap: '10px', overflow: 'hidden' }}>

        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
          {sideButtons.map((btn, i) => (
            <button
              key={i} onClick={btn.action}
              style={{
                width: '52px', height: '52px', background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
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
              key={mode.id} onClick={() => setScreen('battle')}
              style={{
                width: '160px', minWidth: '140px', background: mode.gradient, borderRadius: '16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.3)', boxShadow: `0 6px 20px rgba(0,0,0,0.4), inset 0 -4px 0 rgba(0,0,0,0.2)`,
                padding: '15px 10px', position: 'relative', overflow: 'hidden', transition: 'transform 0.15s'
              }}
              onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                {[...Array(3)].map((_, i) => (
                  <Star key={i} size={18} fill={i < mode.stars ? '#ffd700' : 'none'} color={i < mode.stars ? '#ffd700' : 'rgba(255,255,255,0.3)'} />
                ))}
              </div>

              <div style={{ marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                {mode.icon}
              </div>

              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '900', color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '4px', lineHeight: 1.1
              }}>
                {mode.title}
              </div>

              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{mode.subtitle}</div>

              <div style={{
                marginTop: '10px', background: 'rgba(0,0,0,0.3)', padding: '4px 15px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                <Skull size={14} color="white" />
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'white' }}>0</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        padding: '10px 15px', background: 'rgba(0,0,0,0.3)', borderTop: '2px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <Star size={18} fill="#ffd700" color="#ffd700" />
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
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <Package size={20} color="white" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setScreen('garage')}
            style={{
              width: '60px', height: '60px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.2)'
            }}
          >
            <Wrench size={28} color="white" />
          </button>
          <button
            onClick={() => setScreen('battle')}
            style={{
              width: '70px', height: '70px', background: 'linear-gradient(135deg, #ff4444, #cc0000)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '4px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 20px rgba(255,0,0,0.5), inset 0 -3px 0 rgba(0,0,0,0.3)'
            }}
          >
            <Play size={32} color="white" fill="white" />
          </button>
        </div>
      </div>

      {showExit && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="animate-slide-up" style={{
            background: 'linear-gradient(135deg, #1a2a4a, #0a1a3a)', border: '3px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '30px 40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: '#ffa500', marginBottom: '15px' }}>EXIT GAME?</h2>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => setShowExit(false)} style={{
                padding: '12px 30px', borderRadius: '10px', background: 'linear-gradient(135deg, #4cff4c, #00cc00)',
                color: '#000', fontWeight: 'bold'
              }}>STAY</button>
              <button onClick={() => window.close()} style={{
                padding: '12px 30px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                color: '#fff', fontWeight: 'bold'
              }}>EXIT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
