import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Projectile({
  id,
  type = 'shell',
  startPosition,
  direction,
  speed = 60,
  onHit,
  onExpire,
}) {
  const meshRef = useRef();
  const trailRef = useRef();
  const lifeRef = useRef(0);
  const posRef = useRef(new THREE.Vector3(...startPosition));
  const dirRef = useRef(new THREE.Vector3(...direction).normalize());

  const maxLife = type === 'sniper' ? 4 : type === 'rocket' ? 3 : type === 'laser' ? 2 : 2.5;
  const actualSpeed = type === 'sniper' ? 100 : type === 'rocket' ? 45 : type === 'laser' ? 150 : speed;

  const projectileConfig = useMemo(() => {
    switch (type) {
      case 'rocket':
        return { color: '#ff4400', emissive: '#ff2200', size: [0.08, 0.3], glow: true, trail: '#ff6600' };
      case 'sniper':
        return { color: '#00ccff', emissive: '#0088ff', size: [0.03, 0.5], glow: true, trail: '#0066ff' };
      case 'bullet':
        return { color: '#ffcc00', emissive: '#ff8800', size: [0.025, 0.15], glow: false, trail: '#ffaa00' };
      case 'laser':
        return { color: '#00ff88', emissive: '#00ff44', size: [0.04, 0.8], glow: true, trail: '#00ff66' };
      case 'plasma':
        return { color: '#cc00ff', emissive: '#aa00ff', size: [0.12, 0.12], glow: true, trail: '#8800ff' };
      case 'flame':
        return { color: '#ff6600', emissive: '#ff4400', size: [0.1, 0.15], glow: true, trail: '#ff3300' };
      case 'emp':
        return { color: '#0044ff', emissive: '#0022ff', size: [0.15, 0.15], glow: true, trail: '#0033ff' };
      default:
        return { color: '#ffaa00', emissive: '#ff6600', size: [0.06, 0.2], glow: true, trail: '#ff8800' };
    }
  }, [type]);

  useFrame((_, delta) => {
    lifeRef.current += delta;
    if (lifeRef.current > maxLife) {
      onExpire?.(id);
      return;
    }

    const velocity = dirRef.current.clone().multiplyScalar(actualSpeed * delta);

    if (type === 'rocket') {
      velocity.y -= 2 * delta;
    }

    posRef.current.add(velocity);

    if (meshRef.current) {
      meshRef.current.position.copy(posRef.current);
      meshRef.current.lookAt(posRef.current.clone().add(dirRef.current));
    }
  });

  const isRound = type === 'plasma' || type === 'flame' || type === 'emp';

  return (
    <group>
      <mesh ref={meshRef} position={startPosition}>
        {isRound ? (
          <sphereGeometry args={[projectileConfig.size[0], 12, 8]} />
        ) : (
          <capsuleGeometry args={[projectileConfig.size[0], projectileConfig.size[1], 4, 8]} />
        )}
        <meshStandardMaterial
          color={projectileConfig.color}
          emissive={projectileConfig.emissive}
          emissiveIntensity={3}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {projectileConfig.glow && (
        <pointLight
          position={posRef.current.toArray()}
          color={projectileConfig.emissive}
          intensity={2}
          distance={8}
        />
      )}
    </group>
  );
}
