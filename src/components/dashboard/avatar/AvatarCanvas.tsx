'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// 🟢 Añadimos la prop activeAnimation a la interfaz
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
    // Te va a escupir en la consola del navegador F12 qué animaciones detectó el GLB
    console.log(`🤖 Model [${url}] cargado. Animaciones en memoria:`, Object.keys(actions));
  }, [actions, url]);

  useEffect(() => {
    const currentAction = actions[activeAnimation];
    
    if (currentAction) {
      // Si hay una animación reproduciéndose antes, hacemos un fade out de transición
      if (previousAnimation.current && previousAnimation.current !== activeAnimation) {
        const prevAction = actions[previousAnimation.current];
        if (prevAction) {
          prevAction.fadeOut(0.3);
        }
      }

      // Reproducir la animación seleccionada con un fade in elegante
      currentAction.reset().fadeIn(0.3).play();
      
      // Guardamos la actual como referencia previa para el siguiente cambio
      previousAnimation.current = activeAnimation;
    } else {
      console.warn(`⚠️ La animación "${activeAnimation}" no se encuentra en este modelo GLB.`);
    }

    return () => {
      // Detener todo al desmontar
      currentAction?.stop();
    };
  }, [actions, activeAnimation]); // Reacciona cada vez que hundes el botón

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={clone} 
        scale={1.6} 
        position={[0, -1.5, 0]} 
      />
    </group>
  );
}

export default function AvatarCanvas({ avatarUrl, activeAnimation }: AvatarCanvasProps) {
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

          {/* Pasamos la prop al modelo */}
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