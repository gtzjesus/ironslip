'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

function Model({ url, isDemon }: { url: string; isDemon: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const clone = scene ? SkeletonUtils.clone(scene) : null;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions['capoeira'];
    if (action) {
      action.setEffectiveTimeScale(isDemon ? 1.25 : 1.0);
      action.reset().fadeIn(0.5).play();
    }
  }, [actions, isDemon]);

  if (!clone) return null;

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={clone} 
        scale={2.5} 
        position={[0, -4.5, 0]} // Centrado totalmente
      />
    </group>
  );
}

export default function BackgroundAvatar({ isDemon }: { isDemon: boolean }) {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={isDemon ? 0.3 : 0.6} />
        <pointLight position={[0, 0, 5]} intensity={isDemon ? 10 : 5} color={isDemon ? '#ef4444' : '#F1C232'} />
        <Suspense fallback={null}>
          <Model url="/models/avatar.glb" isDemon={isDemon} />
        </Suspense>
      </Canvas>
    </div>
  );
}