'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Center } from '@react-three/drei';
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
      {/* El componente Center de Drei va a calcular el tamaño exacto 
          de tu modelo y lo va a clavar en el centro perfecto de la pantalla */}
      <Center>
        <primitive 
          object={scene} 
          scale={2.8} 
        />
      </Center>
    </group>
  );
}

export default function AvatarCanvas() {
  return (
    // Contenedor fijo que se adueña de toda la pantalla, sin fondos raros ni bordes
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden z-0">
      <Suspense fallback={null}>
        <Canvas 
          className="w-full h-full"
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, -5]} intensity={1} />

          <Model />

          {/* Puedes arrastrar desde cualquier píxel de la pantalla para rotarlo */}
          <OrbitControls enableZoom={false} />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload('/models/avatar.glb');