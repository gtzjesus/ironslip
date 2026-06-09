'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface AvatarCanvasProps {
  avatarUrl: string;
  activeAnimation: string;
  isDemon: boolean;
}

function Model({ url, activeAnimation, isDemon }: { url: string; activeAnimation: string; isDemon: boolean }) {
  const group = useRef<THREE.Group>(null);
  const previousAnimation = useRef<string>('');
  
  const { scene, animations } = useGLTF(url);
  const clone = SkeletonUtils.clone(scene);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const currentAction = actions[activeAnimation];
    if (currentAction) {
      if (previousAnimation.current && previousAnimation.current !== activeAnimation) {
        actions[previousAnimation.current]?.fadeOut(0.3);
      }
      currentAction.setEffectiveTimeScale(isDemon ? 1.25 : 1.0);
      currentAction.reset().fadeIn(0.3).play();
      previousAnimation.current = activeAnimation;
    }
  }, [actions, activeAnimation, isDemon]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={clone} scale={1.85} position={[0, -3.4, 0]} />
    </group>
  );
}

export default function AvatarCanvas({ avatarUrl, activeAnimation, isDemon }: AvatarCanvasProps) {
  return (
    <div className="w-full h-full relative overflow-hidden z-0 flex items-center justify-center bg-transparent">
      <Suspense fallback={null}>
        <Canvas 
          className="w-full h-full"
          camera={{ position: [0, 0, 6.5], fov: 42 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          {/* ⚡️ ILUMINACIÓN GLOBAL RE-CALIBRADA */}
          {/* Bajamos un pelo el ambiente para que las luces de color resalten chingón */}
          <ambientLight intensity={isDemon ? 0.4 : 0.8} />
          
          {/* 🟢 MODO STANDARD: ENERGÍA IRON VOLT (#F1C232) */}
          {!isDemon && (
            <>
              {/* Luz base para que no se pierdan los detalles del frente */}
              <directionalLight position={[0, 5, 5]} intensity={1.5} />
              
              {/* ¡LA MAGIA VOLT! Luz puntual desde atrás/atrás-derecha que baña el contorno del avatar */}
              <pointLight position={[3, -1, 2]} intensity={8} color="#F1C232" distance={7} decay={1.2} />
              
              {/* Luz de contra sutil para rellenar el lado izquierdo */}
              <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#fffebb" />
            </>
          )}

          {/* 👹 MODO DEMON: FURIA CARMESÍ */}
          {isDemon && (
            <>
              <pointLight position={[0, -3, 2]} intensity={12} color="#ef4444" distance={8} decay={1.5} />
              <directionalLight position={[3, 5, 2]} intensity={2} color="#ff8888" />
              <directionalLight position={[-3, -1, -2]} intensity={1.5} color="#450a0a" />
            </>
          )}

          <Model url={avatarUrl} activeAnimation={activeAnimation} isDemon={isDemon} />

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