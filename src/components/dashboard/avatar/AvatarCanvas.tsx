'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

function Model() {
  const group = useRef<THREE.Group>(null);
  
  // Cargamos el modelo exportado de Blender (Asegúrate que esté en public/models/avatar.glb)
  const { scene, animations } = useGLTF('/models/avatar.glb');
  
  // Clonamos de forma segura el esqueleto y la escena sin errores de tipos de TS
  const clone = SkeletonUtils.clone(scene);
  
  // Vinculamos las animaciones al grupo de referencia
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // LOG DE CONTROL: Abre la consola (F12) para ver 'Avatar_Idle' y el fantasma de mixamo
    console.log("Animaciones disponibles en tu archivo GLB:", Object.keys(actions));

    // Forzamos a que tu Breathing Idle sea la animación por defecto
    const miAnimacionDefault = 'Avatar_Idle';

    if (actions[miAnimacionDefault]) {
      // Si encuentra tu animación, la arranca con un fade suave de 0.5 segundos
      actions[miAnimacionDefault]!.reset().fadeIn(0.5).play();
    } else {
      // Plan de respaldo: Si por algo no se llama exactamente así, toca la primera que encuentre
      const primeraDisponible = Object.keys(actions)[0];
      if (primeraDisponible && actions[primeraDisponible]) {
        console.warn(`No se encontró '${miAnimacionDefault}', reproduciendo: ${primeraDisponible}`);
        actions[primeraDisponible]!.reset().fadeIn(0.5).play();
      }
    }
  }, [actions]);

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

// Pre-carga del modelo en memoria para evitar pantallas en blanco colgadas
useGLTF.preload('/models/avatar.glb');