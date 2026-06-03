'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Definimos la interfaz de TypeScript para recibir la URL desde la página
interface AvatarCanvasProps {
  avatarUrl: string;
}

function Model({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  
  // 🟢 Dinámico: Cargamos el modelo que viene desde la base de datos de Supabase
  const { scene, animations } = useGLTF(url);
  
  // Clonamos de forma segura el esqueleto y la escena sin errores de tipos de TS
  const clone = SkeletonUtils.clone(scene);
  
  // Vinculamos las animaciones al grupo de referencia
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // LOG DE CONTROL: Abre la consola (F12) para ver las animaciones del GLB actual
    console.log(`Model cargado [${url}]. Animaciones disponibles:`, Object.keys(actions));

    // Forzamos a que tu Breathing Idle sea la animación por defecto
    const miAnimacionDefault = 'Avatar_Idle';

    if (actions[miAnimacionDefault]) {
      actions[miAnimacionDefault]!.reset().fadeIn(0.5).play();
    } else {
      // Plan de respaldo: si cambia la skin a una sin 'Avatar_Idle', toca la primera que herede
      const primeraDisponible = Object.keys(actions)[0];
      if (primeraDisponible && actions[primeraDisponible]) {
        console.warn(`No se encontró '${miAnimacionDefault}', reproduciendo: ${primeraDisponible}`);
        actions[primeraDisponible]!.reset().fadeIn(0.5).play();
      }
    }

    // Detener animaciones al desmontar o cambiar de modelo para evitar fugas de memoria
    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions, url]); // 🟢 Monitoreamos el hook si la URL del skin cambia

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

export default function AvatarCanvas({ avatarUrl }: AvatarCanvasProps) {
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

          {/* Inyectamos el componente con el url dinámico */}
          <Model url={avatarUrl} />

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

// Dejamos la pre-carga del base para optimizar la primera entrada
useGLTF.preload('/models/avatar.glb');