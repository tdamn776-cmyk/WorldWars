import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTankById } from '../utils/tankData';

function Wheel({ x, z, radius = 0.12 }) {
  return (
    <group position={[x, radius, z]}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.2} />
      </mesh>
      {/* Hub cap */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.06, 0, 0]}>
        <cylinderGeometry args={[radius * 0.4, radius * 0.4, 0.02, 8]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  );
}

function TrackPlate({ x, z, bodyLength }) {
  return (
    <mesh castShadow position={[x, 0.05, z]}>
      <boxGeometry args={[0.18, 0.22, bodyLength * 1.1]} />
      <meshStandardMaterial color="#222" roughness={0.95} metalness={0.15} />
    </mesh>
  );
}

function TankBody({ config }) {
  const { bodyLength, bodyWidth, primaryColor, secondaryColor } = config.visual;
  const halfW = bodyWidth / 2;

  const wheelPositions = [-0.4, -0.2, 0, 0.2, 0.4].map(f => f * bodyLength);

  return (
    <group>
      {/* Main hull — lower */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[bodyWidth, 0.35, bodyLength]} />
        <meshStandardMaterial color={primaryColor} roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Upper hull — sloped front */}
      <mesh castShadow position={[0, 0.55, -bodyLength * 0.1]}>
        <boxGeometry args={[bodyWidth * 0.9, 0.2, bodyLength * 0.65]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.45} metalness={0.6} />
      </mesh>

      {/* Front slope */}
      <mesh castShadow position={[0, 0.45, bodyLength * 0.4]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[bodyWidth * 0.88, 0.15, bodyLength * 0.2]} />
        <meshStandardMaterial color={primaryColor} roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Rear plate */}
      <mesh castShadow position={[0, 0.4, -bodyLength * 0.48]}>
        <boxGeometry args={[bodyWidth * 0.9, 0.3, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Exhaust pipes */}
      {[-1, 1].map(side => (
        <mesh key={side} castShadow position={[side * bodyWidth * 0.3, 0.35, -bodyLength * 0.5]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}

      {/* Track assemblies */}
      <TrackPlate x={-(halfW + 0.1)} z={0} bodyLength={bodyLength} />
      <TrackPlate x={(halfW + 0.1)} z={0} bodyLength={bodyLength} />

      {/* Wheels */}
      {wheelPositions.map((z, i) => (
        <React.Fragment key={i}>
          <Wheel x={-(halfW + 0.1)} z={z} radius={0.13} />
          <Wheel x={(halfW + 0.1)} z={z} radius={0.13} />
        </React.Fragment>
      ))}

      {/* Fenders/mudguards */}
      {[-1, 1].map(side => (
        <mesh key={`fender-${side}`} castShadow position={[side * (halfW + 0.1), 0.28, 0]}>
          <boxGeometry args={[0.22, 0.06, bodyLength * 1.05]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Headlight */}
      <mesh position={[bodyWidth * 0.3, 0.4, bodyLength * 0.5]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#ffdd88" emissive="#ffcc44" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-bodyWidth * 0.3, 0.4, bodyLength * 0.5]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#ffdd88" emissive="#ffcc44" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function TankTurret({ config, turretRef, barrelRef }) {
  const { turretSize, barrelLength, barrelWidth, primaryColor, secondaryColor } = config.visual;

  return (
    <group ref={turretRef} position={[0, 0.7, -0.05]}>
      {/* Turret base ring */}
      <mesh castShadow>
        <cylinderGeometry args={[turretSize * 0.55, turretSize * 0.6, 0.08, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Main turret body */}
      <mesh castShadow position={[0, 0.15, -turretSize * 0.05]}>
        <cylinderGeometry args={[turretSize * 0.48, turretSize * 0.52, turretSize * 0.45, 20]} />
        <meshStandardMaterial color={primaryColor} roughness={0.35} metalness={0.72} />
      </mesh>

      {/* Commander's hatch */}
      <mesh castShadow position={[0, turretSize * 0.35, -turretSize * 0.05]}>
        <cylinderGeometry args={[turretSize * 0.15, turretSize * 0.15, 0.08, 12]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Periscope */}
      <mesh castShadow position={[turretSize * 0.1, turretSize * 0.38, turretSize * 0.1]}>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Gun mantlet */}
      <mesh castShadow position={[0, 0.12, turretSize * 0.42]}>
        <sphereGeometry args={[turretSize * 0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* Gun barrel group */}
      <group ref={barrelRef} position={[0, 0.12, turretSize * 0.42]}>
        {/* Main barrel */}
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, barrelLength * 0.5]}>
          <cylinderGeometry args={[barrelWidth, barrelWidth * 1.15, barrelLength, 16]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.25} metalness={0.82} />
        </mesh>

        {/* Muzzle brake */}
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, barrelLength * 0.95]}>
          <cylinderGeometry args={[barrelWidth * 1.5, barrelWidth * 1.3, barrelLength * 0.06, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, barrelLength * 0.98]}>
          <cylinderGeometry args={[barrelWidth * 1.3, barrelWidth * 1.5, barrelLength * 0.04, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Barrel thermal sleeve rings */}
        {[0.3, 0.5, 0.7].map((t) => (
          <mesh key={t} castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, barrelLength * t]}>
            <torusGeometry args={[barrelWidth * 1.1, 0.008, 8, 16]} />
            <meshStandardMaterial color="#111" roughness={0.5} metalness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Tank({
  tankId = 'recruit',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  turretRotation = 0,
  isPlayer = false,
  hp = null,
  maxHp = null,
  children,
}) {
  const groupRef = useRef();
  const turretRef = useRef();
  const barrelRef = useRef();

  const config = useMemo(() => getTankById(tankId), [tankId]);
  if (!config) return null;

  const currentHp = hp !== null ? hp : config.stats.hp;
  const currentMaxHp = maxHp !== null ? maxHp : config.stats.hp;
  const hpRatio = currentHp / currentMaxHp;

  useFrame(() => {
    if (turretRef.current) {
      turretRef.current.rotation.y = THREE.MathUtils.lerp(
        turretRef.current.rotation.y,
        turretRotation,
        0.08
      );
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <TankBody config={config} />
      <TankTurret config={config} turretRef={turretRef} barrelRef={barrelRef} />

      {/* HP bar for enemies */}
      {!isPlayer && (
        <group position={[0, 1.8, 0]}>
          {/* Background */}
          <mesh>
            <planeGeometry args={[1.4, 0.14]} />
            <meshBasicMaterial color="#111" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* Health fill */}
          <mesh position={[(hpRatio - 1) * 0.66, 0, 0.001]}>
            <planeGeometry args={[1.32 * hpRatio, 0.1]} />
            <meshBasicMaterial
              color={hpRatio > 0.6 ? '#4cff4c' : hpRatio > 0.3 ? '#ffaa00' : '#ff3b3b'}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Border */}
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[1.44, 0.18]} />
            <meshBasicMaterial color="#333" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {children}
    </group>
  );
}
