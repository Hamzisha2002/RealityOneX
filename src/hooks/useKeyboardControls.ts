import { useState, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, up: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys((prev) => ({ ...prev, down: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, up: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys((prev) => ({ ...prev, down: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

export const useCameraController = (speed: number = 0.5) => {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useFrame(() => {
    frontVector.set(0, 0, Number(keys.backward) - Number(keys.forward));
    sideVector.set(Number(keys.left) - Number(keys.right), 0, 0);
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);
    
    camera.position.add(direction);
    
    if (keys.up) camera.position.y += speed * 0.5;
    if (keys.down) camera.position.y -= speed * 0.5;
    
    // Keep camera above ground
    if (camera.position.y < 2) camera.position.y = 2;
  });

  return keys;
};
