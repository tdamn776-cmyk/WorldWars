import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Camera({ targetRef }) {
  const cameraRef = useRef();

  useFrame((state) => {
    if (!targetRef.current) return;

    // The target is the tank
    const targetPos = targetRef.current.position;
    
    // We want the camera to trail behind and above the tank
    // Calculate desired position
    const desiredPos = new THREE.Vector3(
      targetPos.x,
      targetPos.y + 12,
      targetPos.z + 18
    );

    // Smoothly interpolate camera position manually or use lerp
    state.camera.position.lerp(desiredPos, 0.1);
    
    // Smoothly look at the tank (slightly ahead of it)
    const lookTarget = new THREE.Vector3(
      targetPos.x,
      targetPos.y + 1,
      targetPos.z - 2
    );
    
    // To smooth rotation, we use a dummy quaternion
    const dummyCamera = new THREE.PerspectiveCamera();
    dummyCamera.position.copy(state.camera.position);
    dummyCamera.lookAt(lookTarget);
    
    state.camera.quaternion.slerp(dummyCamera.quaternion, 0.1);
  });

  return null; // This component just controls the default camera
}
