'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface AvatarCanvasProps {
  avatarUrl: string;
  activeAnimation: string;
}

function Model({ url, activeAnimation }: { url: string; activeAnimation: string }) {
  const group = useRef<THREE.Group>(null);
  const previousAnimation = useRef<string>('');
  
  const { scene, animations } = useGLTF(url);
  const clone = SkeletonUtils.clone(scene);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log(`🤖 Model [${url}] cargado. Animaciones en memoria:`, Object.keys(actions));
  }, [actions, url]);

  useEffect(() => {
    const currentAction = actions[activeAnimation];
    
    if (currentAction) {
      if (previousAnimation.current && previousAnimation.current !== activeAnimation) {
        const prevAction = actions[previousAnimation.current];
        if (prevAction) {
          prevAction.fadeOut(0.3);
        }
      }

      currentAction.reset().fadeIn(0.3).play();
      previousAnimation.current = activeAnimation;
    } else {
      console.warn(`⚠️ La animación "${activeAnimation}" no se encuentra en este modelo GLB.`);
    }

    return () => {
      currentAction?.stop();
    };
  }, [actions, activeAnimation]);

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={clone} 
        scale={1.2}          
        position={[0, -2.4, 0]} 
      />
    </group>
  );
}

export default function AvatarCanvas({ avatarUrl, activeAnimation }: AvatarCanvasProps) {
  return (
    // 🟢 CORRECCIÓN DE LA UI: Quitamos "fixed inset-0 w-screen h-screen bg-black"
    // Ahora usa w-full h-full para amoldarse perfectamente al contenedor h-72 de tu LegExpansion
    <div className="w-full h-full relative overflow-hidden z-0 flex items-center justify-center bg-transparent">
      <Suspense fallback={null}>
        <Canvas 
          className="w-full h-full"
          camera={{ position: [0, 0, 6.5], fov: 42 }} // 🟢 FOV ajustado levemente para encuadre pro
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, -5]} intensity={1} />

          <Model url={avatarUrl} activeAnimation={activeAnimation} />

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