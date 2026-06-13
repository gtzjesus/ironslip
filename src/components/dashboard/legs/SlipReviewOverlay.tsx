/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { Trash2, Wallet, Zap } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

// --- MODELO (Optimizado para Nitidez Max) ---
function Model({ url, isDemon }: { url: string; isDemon: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (clone) {
      clone.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material.map) {
          child.material.map.anisotropy = 16;
          child.material.map.needsUpdate = true;
        }
      });
    }
  }, [clone]);

  useEffect(() => {
    const action = actions['breathingidle'];
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

export default function SlipReviewOverlay({
  isOpen, onClose, activeSlip, onRemoveLeg, hasDemon, userBalance,
}: any) {
  const { playSound } = useSound();
  const [wager, setWager] = useState<number | ''>(10);

  // 🧠 LÓGICA DE MULTIPLICADOR (Tu motor original)
  const oddsMatrix = useMemo(() => {
    const compound = activeSlip.reduce((acc: any, leg: any) => acc * (1 + ((leg.creditReward || 0) / 200)), 1);
    const finalMult = compound * (1 + (activeSlip.length * 0.12)) * (hasDemon ? 1.4 : 1.0);
    return { multiplier: Math.max(finalMult, 1.01) };
  }, [activeSlip, hasDemon]);

  // 💰 CÁLCULO DINÁMICO "TO WIN"
  const dynamicPayout = Math.floor((Number(wager) || 0) * oddsMatrix.multiplier);

  const theme = hasDemon
    ? { modalBg: 'bg-zinc-950/85', border: 'border-iron-red/40', accent: 'text-iron-red', btn: 'bg-iron-red' }
    : { modalBg: 'bg-zinc-950/85', border: 'border-iron-volt/30', accent: 'text-iron-volt', btn: 'bg-iron-volt' };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0">
      {/* FONDO AVATAR NITIDEZ 100% */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
          <ambientLight intensity={1.5} /><spotLight position={[0, 5, 5]} intensity={2} />
          <Model url="/models/avatar.glb" isDemon={hasDemon} />
        </Canvas>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* UI MODAL */}
      <div className={`w-full h-full max-w-2xl relative z-10 flex flex-col ${theme.modalBg} border-x ${theme.border} backdrop-blur-xl animate-videogame-slam`}>
        <div className="p-8 pb-4 flex justify-between items-end border-b border-white/5">
          <h2 className={`font-black italic text-3xl uppercase text-white`}>
            {activeSlip.length}-LEG <span className={theme.accent}>{hasDemon ? 'DEMON' : 'IRON'}</span> SLIP
          </h2>
          <button onClick={() => { playSound('close'); onClose(); }}  className="text-black font-mono text-[11px] uppercase tracking-[0.2em] bg-iron-red px-2 py-1 shadow-md active:scale-90 transition-all border border-white/10 shrink-0 mt-0.5">
            [ X ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {activeSlip.map((leg: any) => (
            <div key={leg._id} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 group">
              <span className="font-black italic uppercase text-zinc-300">{leg.task}</span>
              <button onClick={() => { playSound('remove'); onRemoveLeg(leg._id); }} className="opacity-50 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          ))}
        </div>

        {/* 🚀 SECCIÓN FINANCIERA DINÁMICA */}
        <div className="p-6 bg-black/60 border-t border-white/10 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* BALANCE ACTUAL */}
            <div className="bg-zinc-900/50 p-3 border border-white/5 flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                <Wallet className="w-3 h-3" /> Current Balance
              </span>
              <span className="text-xl font-black italic text-white">
                {userBalance.toLocaleString()} <span className="text-[10px] text-zinc-500">CREDITS</span>
              </span>
            </div>

            {/* CÁLCULO TO WIN */}
            <div className={`bg-zinc-900/50 p-3 border ${theme.border} flex flex-col`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Estimated Payout
              </span>
              <span className={`text-xl font-black italic ${theme.accent}`}>
                +{dynamicPayout.toLocaleString()} <span className="text-[10px] opacity-70 italic">WIN</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 ml-1">Wager Amount</p>
            <input 
              type="number" value={wager} onChange={(e) => setWager(Number(e.target.value))}
              className="w-full bg-black border border-white/10 p-4 text-2xl font-mono text-white focus:border-white/30 transition-all outline-none"
            />
          </div>

          <button className={`w-full py-4 font-black italic text-2xl uppercase ${theme.btn} text-black shadow-lg shadow-black/50 active:scale-95 transition-all`}>
            INITIATE SLIP!
          </button>
        </div>
      </div>
    </div>
  );
}