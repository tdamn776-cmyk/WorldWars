import React, { useRef, useState, useEffect } from 'react';

export default function MobileControls({ onMove, onAim, onShoot }) {
  const moveStickRef = useRef(null);
  const aimStickRef = useRef(null);
  
  const [moveActive, setMoveActive] = useState(false);
  const [aimActive, setAimActive] = useState(false);
  
  const [movePos, setMovePos] = useState({ x: 0, y: 0 });
  const [aimPos, setAimPos] = useState({ x: 0, y: 0 });

  const maxRadius = 50;

  const handlePointerDown = (e, type) => {
    e.target.setPointerCapture(e.pointerId);
    if (type === 'move') setMoveActive(true);
    if (type === 'aim') setAimActive(true);
    handlePointerMove(e, type);
  };

  const handlePointerMove = (e, type) => {
    const rect = type === 'move' 
      ? moveStickRef.current.getBoundingClientRect() 
      : aimStickRef.current.getBoundingClientRect();
      
    const active = type === 'move' ? moveActive : aimActive;
    if (!active) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    const normX = dx / maxRadius;
    const normY = dy / maxRadius;

    if (type === 'move') {
      setMovePos({ x: dx, y: dy });
      onMove?.({ x: normX, y: normY });
    } else {
      setAimPos({ x: dx, y: dy });
      onAim?.({ x: normX, y: normY });
    }
  };

  const handlePointerUp = (e, type) => {
    if (type === 'move') {
      setMoveActive(false);
      setMovePos({ x: 0, y: 0 });
      onMove?.({ x: 0, y: 0 });
    } else {
      setAimActive(false);
      setAimPos({ x: 0, y: 0 });
      onShoot?.(); // Fire when released
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '40%',
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '40px',
      zIndex: 100
    }}>
      
      {/* Move Joystick */}
      <div 
        ref={moveStickRef}
        style={{
          width: 140, height: 140,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.1)',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
        onPointerDown={(e) => handlePointerDown(e, 'move')}
        onPointerMove={(e) => handlePointerMove(e, 'move')}
        onPointerUp={(e) => handlePointerUp(e, 'move')}
        onPointerCancel={(e) => handlePointerUp(e, 'move')}
      >
        <div style={{
          width: 50, height: 50,
          borderRadius: '50%',
          background: 'rgba(255, 165, 0, 0.4)',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(calc(-50% + ${movePos.x}px), calc(-50% + ${movePos.y}px))`,
          boxShadow: '0 0 15px rgba(255, 165, 0, 0.5)',
          transition: moveActive ? 'none' : 'transform 0.2s',
        }} />
      </div>

      {/* Aim & Fire Joystick */}
      <div 
        ref={aimStickRef}
        style={{
          width: 140, height: 140,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.1)',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
        onPointerDown={(e) => handlePointerDown(e, 'aim')}
        onPointerMove={(e) => handlePointerMove(e, 'aim')}
        onPointerUp={(e) => handlePointerUp(e, 'aim')}
        onPointerCancel={(e) => handlePointerUp(e, 'aim')}
      >
        <div style={{
          width: 50, height: 50,
          borderRadius: '50%',
          background: aimActive ? 'rgba(255, 59, 59, 0.6)' : 'rgba(59, 139, 255, 0.4)',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(calc(-50% + ${aimPos.x}px), calc(-50% + ${aimPos.y}px))`,
          boxShadow: aimActive ? '0 0 20px rgba(255, 59, 59, 0.8)' : '0 0 15px rgba(59, 139, 255, 0.5)',
          transition: aimActive ? 'none' : 'transform 0.2s',
        }} />
        {!aimActive && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white', fontWeight: 'bold', fontSize: '12px',
            textShadow: '0 0 4px black'
          }}>FIRE</div>
        )}
      </div>

    </div>
  );
}
