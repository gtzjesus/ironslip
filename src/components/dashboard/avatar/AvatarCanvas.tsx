'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Componente interno que carga físicamente el archivo GLB y activa la animación
function Model() {
  // Tipificación estricta para TypeScript
  const group = useRef<THREE.Group>(null);
  
  // Cargamos la escena y las animaciones
  const { scene, animations } = useGLTF('/models/avatar.glb');
  
  // Conectamos las animaciones de Mixamo
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
        scale={2.2} 
        position={[0, -1, 0]} 
      />
    </group>
  );
}

export default function AvatarCanvas() {
  return (
    // Regresamos al contenedor original de h-80 que respeta tu layout
    <div className="w-full h-80 bg-black/40 border border-zinc-900 rounded-sm relative overflow-hidden group">
      {/* Rejilla Cyberpunk Estética de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />
      
      <Suspense 
        fallback={
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-widest text-[#c4a000] animate-pulse">
            LOADING_RENDER_ENGINE...
          </div>
        }
      >
        <Canvas 
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          {/* Iluminación básica de estudio */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          <Model />

          {/* Permite rotar el monito arrastrando el mouse */}
          <OrbitControls 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 3} 
          />
        </Canvas>
      </Suspense>
      
      {/* Tag de estado de telemetría */}
      <div className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-widest text-zinc-600 bg-black/80 px-1.5 py-0.5 border border-zinc-900 pointer-events-none">
        RENDER_OK // WIREFRAME_READY
      </div>
    </div>
  );
}

// Pre-cargar el modelo para optimizar la app
useGLTF.preload('/models/avatar.glb');