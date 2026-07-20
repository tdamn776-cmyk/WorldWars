import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Building({ position, width, height, depth, color }) {
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh castShadow position={[0, height + 0.3, 0]}>
        <boxGeometry args={[width + 0.3, 0.15, depth + 0.3]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Windows */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 + 0.01), height * 0.55, 0]}>
          <planeGeometry args={[width * 0.3, height * 0.25]} />
          <meshStandardMaterial
            color="#88ccff"
            emissive="#4488aa"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 0.6, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.3, 1.2]} />
        <meshStandardMaterial color="#5a3a1a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Tree({ position, trunkHeight = 1.5, crownRadius = 1.2 }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, trunkHeight, 8]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
      </mesh>
      {/* Crown */}
      <mesh castShadow position={[0, trunkHeight + crownRadius * 0.5, 0]}>
        <sphereGeometry args={[crownRadius, 12, 8]} />
        <meshStandardMaterial color="#2a6a1a" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, trunkHeight + crownRadius * 1.1, 0]}>
        <sphereGeometry args={[crownRadius * 0.7, 10, 6]} />
        <meshStandardMaterial color="#3a8a2a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rock({ position, scale = 1 }) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#7a7a7a" roughness={0.9} metalness={0.1} flatShading />
    </mesh>
  );
}

export default function Terrain({ mapType = 'forest', size = 100 }) {
  const buildings = useMemo(() => {
    const arr = [];
    const colors = ['#c8b090', '#a09080', '#d0c0a0', '#b0a080', '#e0d0b0'];
    
    // Create scattered buildings
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 15 + Math.random() * 25;
      arr.push({
        position: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        width: 2 + Math.random() * 2,
        height: 2 + Math.random() * 3,
        depth: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return arr;
  }, []);

  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 35;
      arr.push({
        position: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        trunkHeight: 1 + Math.random() * 1.5,
        crownRadius: 0.8 + Math.random() * 0.8,
      });
    }
    return arr;
  }, []);

  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 40;
      arr.push({
        position: [Math.cos(angle) * dist, 0.2, Math.sin(angle) * dist],
        scale: 0.3 + Math.random() * 0.8,
      });
    }
    return arr;
  }, []);

  const groundColor = {
    forest: '#4a7a3a',
    desert: '#c4a35a',
    arctic: '#d0e0f0',
    volcano: '#3a2a1a',
    city: '#555555'
  }[mapType] || '#4a7a3a';

  return (
    <group>
      {/* Flat Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Ground border/edge — slightly darker ring */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[size * 0.45, size * 0.5, 64]} />
        <meshStandardMaterial color="#2a4a1a" roughness={1} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => <Building key={`b-${i}`} {...b} />)}

      {/* Trees */}
      {trees.map((t, i) => <Tree key={`t-${i}`} {...t} />)}

      {/* Rocks */}
      {rocks.map((r, i) => <Rock key={`r-${i}`} {...r} />)}
    </group>
  );
}
