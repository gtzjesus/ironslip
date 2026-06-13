/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { Trash2 } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

// --- COMPONENTE MODELO ---
function Model({ url, isDemon }: { url: string; isDemon: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions['boxing'];
    if (action) {
      action.setEffectiveTimeScale(isDemon ? 1.25 : 1.0);
      action.reset().fadeIn(0.5).play();
    }
  }, [actions, isDemon]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={clone} scale={2.8} position={[0, -6.5, 0]} />
    </group>
  );
}

// --- OVERLAY PRINCIPAL ---
export default function SlipReviewOverlay({
  isOpen, onClose, activeSlip, onRemoveLeg, hasDemon, userBalance,
}: any) {
  const { playSound } = useSound();
  const [wager, setWager] = useState<number | ''>(10);

  // Lógica de cálculo
  const oddsMatrix = useMemo(() => {
    const compound = activeSlip.reduce((acc: any, leg: any) => acc * (1 + ((leg.creditReward || 0) / 200)), 1);
    const finalMult = compound * (1 + (activeSlip.length * 0.12)) * (hasDemon ? 1.4 : 1.0);
    return { multiplier: Math.max(finalMult, 1.01) };
  }, [activeSlip, hasDemon]);

  const dynamicPayout = Math.floor((Number(wager) || 0) * oddsMatrix.multiplier);

  const theme = hasDemon
    ? { modalBg: 'bg-zinc-950/80', borderStyle: 'border-x-[0.5px] border-iron-red/40', titleText: 'text-white', dataCoreBg: 'bg-zinc-900/60 border-t border-iron-red/30', labelColor: 'text-zinc-500', valueColor: 'text-white', accentText: 'text-iron-green', inputBg: 'bg-black/60 border border-zinc-800 text-white', buttonBg: 'bg-iron-red text-black' }
    : { modalBg: 'bg-zinc-950/80', borderStyle: 'border-x-[0.5px] border-iron-volt/30', titleText: 'text-iron-volt', dataCoreBg: 'bg-zinc-950/60 border-t border-iron-volt/20', labelColor: 'text-zinc-400', valueColor: 'text-iron-volt', accentText: 'text-iron-green', inputBg: 'bg-black border border-iron-volt/30 text-iron-volt', buttonBg: 'bg-iron-volt text-black' };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0">
      
      {/* CAPA DE AVATAR (Z-0) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 85 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
        >
          <spotLight position={[0, 5, 5]} intensity={65} />
          <Model url="/models/avatar.glb" isDemon={hasDemon} />
        </Canvas>
      </div>

      {/* TU INTERFAZ */}
      <div className={`w-full h-full max-w-2xl relative z-10 flex flex-col overflow-hidden text-white animate-videogame-slam ${theme.modalBg} ${theme.borderStyle} backdrop-blur-md`}>
        <div className="p-8 pb-4 relative z-10 flex justify-between items-end border-b border-zinc-900/40">
          <h2 className={`${theme.titleText} font-black italic text-3xl uppercase tracking-tighter leading-none`}>
            {activeSlip.length}-LEG {hasDemon ? 'DEMON' : 'IRON'} SLIP
          </h2>
          <button onClick={() => { playSound('close'); onClose(); }} className="absolute top-5 right-5 text-white font-mono text-[12px] uppercase bg-red-600 px-2 py-1 z-[100] shadow-md border border-white/10">
            [ X ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2 z-10">
          {activeSlip.map((leg: any) => (
            <div key={leg._id} className="flex justify-between items-center p-4 bg-black/40 border border-white/5">
              <span className="font-black italic uppercase">{leg.task}</span>
              <button onClick={() => { playSound('remove'); onRemoveLeg(leg._id); }}><Trash2 className="w-4 h-4 text-zinc-500" /></button>
            </div>
          ))}
        </div>

        <div className={`p-6 ${theme.dataCoreBg} z-10`}>
          {/* NUEVOS CONTADORES */}
          <div className="grid grid-cols-2 gap-2 mb-3">
             <div className="bg-black/50 p-2 border border-white/10 text-center">
                <p className="text-[8px] uppercase text-zinc-500 font-mono">Balance</p>
                <p className="text-sm font-black italic">{userBalance.toLocaleString()}</p>
             </div>
             <div className="bg-black/50 p-2 border border-white/10 text-center">
                <p className="text-[8px] uppercase text-zinc-500 font-mono">To Win</p>
                <p className={`text-sm font-black italic ${hasDemon ? 'text-iron-red' : 'text-iron-volt'}`}>+{dynamicPayout.toLocaleString()}</p>
             </div>
          </div>

          <input type="number" value={wager} onChange={(e) => setWager(Number(e.target.value))} className={`w-full px-4 py-3 font-mono text-xl ${theme.inputBg}`} />
          <button className={`w-full py-4 mt-2 font-black italic text-2xl uppercase ${theme.buttonBg}`}>
            INITIATE SLIP!
          </button>
        </div>
      </div>
    </div>
  );
}