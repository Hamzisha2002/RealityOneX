import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FirstPersonControlsProps {
  onLockChange?: (locked: boolean) => void;
  enabled?: boolean;
}

export const FirstPersonControls = ({ onLockChange, enabled = true }: FirstPersonControlsProps) => {
  const { camera, gl } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const canJump = useRef(false);
  const prevTime = useRef(performance.now());
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const isLocked = useRef(false);

  const moveSpeed = 5.0;
  const jumpVelocity = 8.0;
  const gravity = 20.0;

  useEffect(() => {
    if (!enabled) return;

    const onPointerLockChange = () => {
      const isPointerLocked = document.pointerLockElement === gl.domElement;
      isLocked.current = isPointerLocked;
      onLockChange?.(isPointerLocked);
    };

    const onPointerLockError = () => {
      console.error('Pointer lock error');
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    // Click to lock pointer
    const handleClick = () => {
      if (!isLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    gl.domElement.addEventListener('click', handleClick);

    // Keyboard controls
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true;
          break;
        case 'Space':
          if (canJump.current === true) {
            velocity.current.y += jumpVelocity;
          }
          canJump.current = false;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false;
          break;
      }
    };

    // Mouse movement
    const onMouseMove = (event: MouseEvent) => {
      if (!isLocked.current) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
      euler.setFromQuaternion(camera.quaternion);

      euler.y -= movementX * 0.002;
      euler.x -= movementY * 0.002;

      // Limit vertical rotation
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

      camera.quaternion.setFromEuler(euler);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);

    // ESC to unlock
    const onEsc = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && isLocked.current) {
        document.exitPointerLock();
      }
    };
    document.addEventListener('keydown', onEsc);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onEsc);
      gl.domElement.removeEventListener('click', handleClick);
      document.exitPointerLock();
    };
  }, [enabled, gl, camera, onLockChange]);

  useFrame((state, delta) => {
    if (!isLocked.current || !enabled) return;

    const time = performance.now();
    const deltaTime = Math.min((time - prevTime.current) / 1000, 0.1);
    prevTime.current = time;

    velocity.current.x -= velocity.current.x * 10.0 * deltaTime;
    velocity.current.z -= velocity.current.z * 10.0 * deltaTime;
    velocity.current.y -= gravity * deltaTime; // Apply gravity

    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();

    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * moveSpeed * deltaTime;
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * moveSpeed * deltaTime;
    }

    // Apply movement relative to camera direction
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    camera.position.add(forward.multiplyScalar(-velocity.current.z * deltaTime));
    camera.position.add(right.multiplyScalar(velocity.current.x * deltaTime));
    camera.position.y += velocity.current.y * deltaTime;

    // Ground collision (simple)
    if (camera.position.y < 1.6) {
      camera.position.y = 1.6;
      velocity.current.y = 0;
      canJump.current = true;
    }

    // Wall collision (simple bounds)
    const bounds = 8;
    camera.position.x = Math.max(-bounds, Math.min(bounds, camera.position.x));
    camera.position.z = Math.max(-bounds, Math.min(bounds, camera.position.z));
  });

  return null;
};

