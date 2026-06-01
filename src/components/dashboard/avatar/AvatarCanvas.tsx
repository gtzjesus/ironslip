'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

function Model() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/avatar.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const nombreAnimacion = Object.keys(actions)[0];
    if (nombreAnimacion && actions[nombreAnimacion]) {
      actions[nombreAnimacion]!.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={1.6} 
        position={[0, -1.5, 0]} 
      />
    </group>
  );
}

export default function AvatarCanvas() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden z-0 flex items-center justify-center">
      <Suspense fallback={null}>
        <Canvas 
          className="w-full h-full"
          camera={{ position: [0, 0, 6.5], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, -5]} intensity={1} />

          <Model />

          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            target={[0, 0, 0]}
            minAzimuthAngle={-Math.PI / 4} 
            maxAzimuthAngle={Math.PI / 4}
            minPolarAngle={1.2} 
            maxPolarAngle={1.8}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload('/models/avatar.glb');