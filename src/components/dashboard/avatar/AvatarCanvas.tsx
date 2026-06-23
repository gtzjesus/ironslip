/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface AvatarCanvasProps {
  avatarUrl: string;
  activeAnimation: string;
  isDemon?: boolean;
}

function Model({
  url,
  activeAnimation,
  isDemon,
}: {
  url: string;
  activeAnimation: string;
  isDemon: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const previousAnimation = useRef<string>('');

  const { scene, animations } = useGLTF(url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // ⚡️ OPTIMIZACIÓN DE MATERIALES: Forzamos a que Three.js use shaders más simples
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        // Si el material es muy complejo, reducimos su costo de renderizado
        if (mesh.material) {
          const mat = mesh.material as any;
          mat.roughness = Math.max(mat.roughness, 0.7); // Menos reflejos = más rápido
          mat.metalness = Math.min(mat.metalness, 0.3);
        }
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    const currentAction = actions[activeAnimation];
    if (currentAction) {
      if (
        previousAnimation.current &&
        previousAnimation.current !== activeAnimation
      ) {
        actions[previousAnimation.current]?.fadeOut(0.2);
      }

      currentAction.setEffectiveTimeScale(isDemon ? 1.25 : 1.0);
      currentAction.reset().fadeIn(0.2).play();
      previousAnimation.current = activeAnimation;
    }

    return () => {
      currentAction?.stop();
    };
  }, [actions, activeAnimation, isDemon]);

  return (
    <group ref={group} dispose={null} rotation={[0, -0.75, 0]}>
      <primitive object={clonedScene} scale={1.95} position={[-0.6, -3.9, 0]} />
    </group>
  );
}

export default function AvatarCanvas({
  avatarUrl,
  activeAnimation,
  isDemon = false,
}: AvatarCanvasProps) {
  return (
    <div className="w-full h-full relative overflow-hidden z-0 flex items-center justify-center bg-transparent">
      <Suspense fallback={null}>
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 6.5], fov: 42 }}
          // 📊 EL SECOTO PARA TELÉFONOS VIEJOS:
          dpr={1} // ⚡️ Forzamos resolución 1:1 estándar. Cero pixeles extra de pantallas Retina.
          gl={{
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance',
            antialias: false, // ❌ Apagado para ahorrar el 30% de GPU
            precision: 'mediump', // 📉 Baja la precisión matemática de los shaders para mejorar FPS
            alpha: true,
          }}
        >
          {/* Bajamos la cantidad de luces. Menos luces = menos cálculos por pixel */}
          <ambientLight intensity={isDemon ? 0.4 : 0.8} />

          {!isDemon && (
            <>
              <directionalLight position={[0, 5, 5]} intensity={1.0} />
              <pointLight
                position={[3, -1, 2]}
                intensity={4}
                color="#F1C232"
                distance={4}
                decay={2}
              />
            </>
          )}

          {isDemon && (
            <>
              <pointLight
                position={[0, -3, 2]}
                intensity={6}
                color="#ef4444"
                distance={4}
                decay={2}
              />
              <directionalLight
                position={[3, 5, 2]}
                intensity={1.0}
                color="#ff8888"
              />
            </>
          )}

          <Model
            url={avatarUrl}
            activeAnimation={activeAnimation}
            isDemon={isDemon}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            target={[-0.6, 0, 0]}
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
