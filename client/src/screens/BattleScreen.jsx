import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

import World from '../game/World';
import Terrain from '../game/Terrain';
import Tank from '../game/Tank';
import Camera from '../game/Camera';
import Projectile from '../game/Projectile';
import MobileControls from '../game/MobileControls';
import useGameStore from '../stores/useGameStore';
import usePlayerStore from '../stores/usePlayerStore';
import { getTankById } from '../utils/tankData';
import { playSound } from '../utils/audio';

// Network Player representation
function NetworkedPlayer({ id, player, isLocal }) {
  const visualRef = useRef();

  useFrame(() => {
    if (isLocal) return; // Local player handles own physics smoothly below
    if (!visualRef.current) return;
    
    // Smoothly interpolate towards network position for other players
    const targetPos = new THREE.Vector3(player.x, player.y - 0.15, player.z);
    visualRef.current.position.lerp(targetPos, 0.2);

    const targetEuler = new THREE.Euler(0, player.rotY, 0);
    const targetQuat = new THREE.Quaternion().setFromEuler(targetEuler);
    visualRef.current.quaternion.slerp(targetQuat, 0.2);
  });

  if (isLocal) return null; // Rendered by LocalPlayerController

  return (
    <group ref={visualRef} position={[player.x, player.y - 0.15, player.z]}>
      <Tank 
        tankId={player.tankId} 
        hp={player.hp} 
        maxHp={player.maxHp} 
        turretRotation={player.turretRot} 
      />
      
      {/* Name tag */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[2, 0.4]} />
        <meshBasicMaterial transparent opacity={0} />
        {/* Html or Text component could go here for names */}
      </mesh>
    </group>
  );
}

function LocalPlayerController({ tankId, moveInput, aimInput, room }) {
  const tankBody = useRef();
  const tankVisualRef = useRef();
  const [turretRotation, setTurretRotation] = useState(0);
  const tankConfig = getTankById(tankId);
  
  // Rate limiting network sends
  const lastSendTime = useRef(0);

  useFrame((state, delta) => {
    if (!tankBody.current || !tankVisualRef.current) return;

    const currentVel = tankBody.current.linvel();
    const currentRot = tankBody.current.rotation();
    const euler = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w)
    );

    const isMoving = Math.abs(moveInput.x) > 0.05 || Math.abs(moveInput.y) > 0.05;

    if (isMoving) {
      const speed = tankConfig.stats.speed * 1.5;
      const turnSpeed = tankConfig.stats.turnSpeed;
      const targetAngle = Math.atan2(-moveInput.x, -moveInput.y);

      let angleDiff = targetAngle - euler.y;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      euler.y += angleDiff * turnSpeed * delta;

      tankBody.current.setRotation(new THREE.Quaternion().setFromEuler(euler), true);

      const magnitude = Math.min(1, Math.sqrt(moveInput.x * moveInput.x + moveInput.y * moveInput.y));
      const direction = new THREE.Vector3(0, 0, -1).applyEuler(euler);
      const velocity = direction.multiplyScalar(speed * magnitude);

      tankBody.current.setLinvel({ x: velocity.x, y: currentVel.y, z: velocity.z }, true);
    } else {
      tankBody.current.setLinvel({ x: currentVel.x * 0.85, y: currentVel.y, z: currentVel.z * 0.85 }, true);
    }

    if (Math.abs(aimInput.x) > 0.05 || Math.abs(aimInput.y) > 0.05) {
      const aimAngle = Math.atan2(-aimInput.x, -aimInput.y);
      setTurretRotation(aimAngle - euler.y);
    }

    const pos = tankBody.current.translation();
    const q = tankBody.current.rotation();
    
    tankVisualRef.current.position.set(pos.x, pos.y - 0.15, pos.z);
    tankVisualRef.current.quaternion.set(q.x, q.y, q.z, q.w);

    // Send state to network ~20 times per second
    const now = performance.now();
    if (room && now - lastSendTime.current > 50) {
      room.send("move", {
        x: pos.x, y: pos.y, z: pos.z,
        rotY: euler.y,
        turretRot: turretRotation
      });
      lastSendTime.current = now;
    }
  });

  return (
    <>
      <RigidBody ref={tankBody} colliders={false} mass={80} position={[0, 1, 0]} friction={3} linearDamping={0.5} enabledRotations={[false, true, false]}>
        <CuboidCollider args={[tankConfig.visual.bodyWidth / 2, 0.35, tankConfig.visual.bodyLength / 2]} position={[0, 0.35, 0]} />
      </RigidBody>
      <group ref={tankVisualRef}>
        <Tank tankId={tankId} isPlayer turretRotation={turretRotation} />
      </group>
      <Camera targetRef={tankVisualRef} />
    </>
  );
}

export default function BattleScreen() {
  const { username, selectedTankId, hp } = usePlayerStore();
  const { room, networkPlayers, networkProjectiles, connectionStatus, connectToBattle, leaveBattle } = useGameStore();

  const [moveInput, setMoveInput] = useState({ x: 0, y: 0 });
  const [aimInput, setAimInput] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initiate connection on mount
    playSound('bgm');
    connectToBattle({ username, tankId: selectedTankId, hp: getTankById(selectedTankId).stats.hp });
    
    return () => {
      // Disconnect on unmount
      leaveBattle();
    };
  }, []);

  const handleShoot = useCallback(() => {
    if (!room) return;
    playSound('shootShell');
    
    const tankConfig = getTankById(selectedTankId);
    const direction = new THREE.Vector3(aimInput.x || 0, 0, aimInput.y || -1).normalize();
    
    // Get local player state to know where to spawn bullet
    const myState = networkPlayers[room.sessionId];
    const x = myState ? myState.x : 0;
    const z = myState ? myState.z : 0;

    room.send("shoot", {
      x, y: 1.5, z,
      dirX: direction.x, dirZ: direction.z,
      speed: 60,
      type: tankConfig.stats.projectileType
    });
  }, [aimInput, selectedTankId, room, networkPlayers]);

  if (connectionStatus !== 'connected') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white' }}>
        <h1 className="animate-pulse">{connectionStatus === 'error' ? 'SERVER IS OFFLINE.' : 'CONNECTING TO WARZONE...'}</h1>
      </div>
    );
  }

  const myPlayer = networkPlayers[room.sessionId];
  const hpRatio = myPlayer ? Math.max(0, myPlayer.hp / myPlayer.maxHp) : 1;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 15, 20], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <World mapType="forest" timeOfDay="day" />
          
          <Physics gravity={[0, -25, 0]}>
            <RigidBody type="fixed" friction={3}>
              <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
            </RigidBody>
            <Terrain mapType="forest" />

            {/* Local Player */}
            <LocalPlayerController tankId={selectedTankId} moveInput={moveInput} aimInput={aimInput} room={room} />
            
            {/* Building colliders (temporary, should match terrain gen later) */}
            <RigidBody type="fixed" friction={2}><CuboidCollider args={[1.5, 2, 1.5]} position={[15, 2, 0]} /></RigidBody>
            <RigidBody type="fixed" friction={2}><CuboidCollider args={[1.5, 2, 1.5]} position={[-18, 2, 8]} /></RigidBody>
          </Physics>

          {/* Network Players Rendering */}
          {Object.values(networkPlayers).map(player => (
            <NetworkedPlayer key={player.sessionId} id={player.sessionId} player={player} isLocal={player.sessionId === room.sessionId} />
          ))}

          {/* Network Projectiles Rendering */}
          {Object.entries(networkProjectiles).map(([id, p]) => (
            <Projectile key={id} id={id} type={p.type} startPosition={[p.x, p.y, p.z]} direction={[p.dirX, 0, p.dirZ]} speed={p.speed} />
          ))}
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, padding: '10px 15px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none', zIndex: 50
      }}>
        <button
          onClick={() => leaveBattle()}
          style={{
            pointerEvents: 'auto', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px', padding: '6px 12px', color: 'white', fontSize: '14px', fontWeight: 'bold'
          }}
        >✕ ESCAPE
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4cff4c' }}>HP</span>
          <div style={{ width: '150px', height: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ width: `${hpRatio * 100}%`, height: '100%', background: 'linear-gradient(90deg, #4cff4c, #00cc00)' }} />
          </div>
        </div>
      </div>

      <MobileControls onMove={setMoveInput} onAim={setAimInput} onShoot={handleShoot} />
    </div>
  );
}
