import React, { useState, useEffect } from 'react';
import useGameStore from '../stores/useGameStore';
import usePlayerStore from '../stores/usePlayerStore';

export default function SplashScreen() {
  const { setScreen } = useGameStore();
  const { isLoggedIn } = usePlayerStore();
  const [phase, setPhase] = useState(0); // 0=logo, 1=loading, 2=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2500);
    const t3 = setTimeout(() => {
      setScreen(isLoggedIn ? 'mainMenu' : 'auth');
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [setScreen, isLoggedIn]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at center, #1a2040 0%, #0a0a15 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>

      {/* Background particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '2px', height: '2px',
          background: '#ffa500',
          borderRadius: '50%',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.5,
          animation: `pulse ${2 + Math.random() * 3}s infinite`,
          boxShadow: '0 0 6px #ffa500'
        }} />
      ))}

      {/* Logo */}
      <img
        src="/icons/game-logo.png"
        alt="WorldWars"
        style={{
          width: '300px',
          maxWidth: '80%',
          filter: `drop-shadow(0 0 30px rgba(255,165,0,0.6))`,
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Loading Bar */}
      <div style={{
        marginTop: '40px',
        width: '250px',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.5s'
      }}>
        <div style={{
          width: '100%', height: '6px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: phase >= 2 ? '100%' : '60%',
            height: '100%',
            background: 'linear-gradient(90deg, #ffa500, #ff6b35)',
            borderRadius: '3px',
            transition: 'width 1.5s ease',
            boxShadow: '0 0 10px rgba(255,165,0,0.5)'
          }} />
        </div>
        <div style={{
          textAlign: 'center', marginTop: '10px',
          fontFamily: 'var(--font-heading)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px'
        }}>
          {phase < 2 ? 'DEPLOYING FORCES...' : 'READY!'}
        </div>
      </div>

      {/* Version */}
      <div style={{
        position: 'absolute', bottom: '20px',
        color: 'rgba(255,255,255,0.2)',
        fontFamily: 'var(--font-body)',
        fontSize: '12px'
      }}>
        v1.0.0
      </div>
    </div>
  );
}
