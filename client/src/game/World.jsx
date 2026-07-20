import React from 'react';
import { Environment, Sky, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, SSAO } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { MAPS } from '../utils/constants';

export default function World({ mapType = 'forest', timeOfDay = 'day' }) {
  const mapConfig = MAPS.find(m => m.id === mapType) || MAPS[0];

  const ambientIntensity = timeOfDay === 'night' ? 0.2 : 0.6;
  const sunPosition = timeOfDay === 'night' ? [10, -10, 10] : [50, 50, 20];
  const sunIntensity = timeOfDay === 'night' ? 0 : 2.5;

  return (
    <>
      <color attach="background" args={[mapConfig.skyColor]} />
      
      <ambientLight intensity={ambientIntensity} />
      
      <directionalLight
        castShadow
        position={sunPosition}
        intensity={sunIntensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <directionalLight position={[-sunPosition[0], sunPosition[1] * 0.5, -sunPosition[2]]} intensity={0.2} />

      {timeOfDay === 'day' ? (
        <Sky sunPosition={sunPosition} turbidity={0.3} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      ) : (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}

      <Environment preset={timeOfDay === 'night' ? 'night' : 'park'} />

      <EffectComposer disableNormalPass multisampling={4}>
        <SSAO intensity={50} radius={0.1} luminanceInfluence={0.5} color="black" />
        <Bloom 
          intensity={1.2} 
          luminanceThreshold={0.8} 
          luminanceSmoothing={0.9} // Glow for explosions and projectiles
          blendFunction={BlendFunction.SCREEN}
        />
        <ChromaticAberration offset={[0.001, 0.001]} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
