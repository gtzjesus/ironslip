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
      {/* QUITAMOS el <Center> estúpido que lo mandaba al techo y 
          lo bajamos manualmente en el eje Y para que entre el torso */}
      <primitive 
        object={scene} 
        scale={2.5} 
        position={[0, -2.5, 0]} 
      />
    </group>
  );
}

export default function AvatarCanvas() {
  return (
    // 👈 "margin top" real: Usamos pt-32 (padding top) y transformamos el contenedor 
    // para empujar TODO el bloque 3D hacia abajo de la pantalla
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden z-0 pt-40 flex flex-col items-center justify-start">
      <Suspense fallback={null}>
        <Canvas 
          className="w-full h-[80vh]"
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, -5]} intensity={1} />

          <Model />

          {/* Ponemos el target en 0 para que la cámara mire al centro de este nuevo espacio abajo */}
          <OrbitControls 
            enableZoom={false}
            target={[0, 1.2, 1]}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload('/models/avatar.glb');