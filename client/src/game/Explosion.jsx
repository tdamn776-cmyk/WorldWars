import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particle({ position, velocity, color, size, life }) {
  const ref = useRef();
  const lifeRef = useRef(0);
  const velRef = useRef(new THREE.Vector3(...velocity));
  const [dead, setDead] = useState(false);

  useFrame((_, delta) => {
    if (dead || !ref.current) return;
    lifeRef.current += delta;
    if (lifeRef.current > life) {
      setDead(true);
      return;
    }

    velRef.current.y -= 15 * delta;
    ref.current.position.x += velRef.current.x * delta;
    ref.current.position.y += velRef.current.y * delta;
    ref.current.position.z += velRef.current.z * delta;

    const t = lifeRef.current / life;
    ref.current.scale.setScalar(1 - t * 0.8);
    ref.current.material.opacity = 1 - t;
  });

  if (dead) return null;

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 6, 4]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={1}
        roughness={0.3}
      />
    </mesh>
  );
}

export default function Explosion({ position, size = 1, onComplete }) {
  const [particles] = useState(() => {
    const arr = [];
    const count = 20 + Math.floor(size * 10);
    const colors = ['#ff4400', '#ff8800', '#ffcc00', '#ff2200', '#ff6600'];

    for (let i = 0; i < count; i++) {
      const speed = 3 + Math.random() * 8 * size;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      arr.push({
        id: i,
        position: [...position],
        velocity: [
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.abs(Math.sin(phi) * Math.sin(theta)) * speed * 1.5,
          Math.cos(phi) * speed,
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 0.05 + Math.random() * 0.12 * size,
        life: 0.5 + Math.random() * 1.0,
      });
    }

    for (let i = 0; i < 8; i++) {
      arr.push({
        id: count + i,
        position: [
          position[0] + (Math.random() - 0.5) * 0.5,
          position[1] + Math.random() * 0.3,
          position[2] + (Math.random() - 0.5) * 0.5,
        ],
        velocity: [
          (Math.random() - 0.5) * 2,
          1 + Math.random() * 3,
          (Math.random() - 0.5) * 2,
        ],
        color: '#444444',
        size: 0.15 + Math.random() * 0.2,
        life: 1 + Math.random() * 1.5,
      });
    }

    return arr;
  });

  const lightRef = useRef();
  const lightLife = useRef(0);

  useFrame((_, delta) => {
    lightLife.current += delta;
    if (lightRef.current) {
      const t = lightLife.current / 0.5;
      lightRef.current.intensity = Math.max(0, 15 * size * (1 - t));
    }
    if (lightLife.current > 2.5) {
      onComplete?.();
    }
  });

  return (
    <group>
      <pointLight
        ref={lightRef}
        position={position}
        color="#ff6600"
        intensity={15 * size}
        distance={20 * size}
      />

      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </group>
  );
}
