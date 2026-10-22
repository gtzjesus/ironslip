/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLegs } from '@/hooks/useLegs';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import LegsHeader from '@/components/dashboard/legs/Legsheader';
import LegCard from '@/components/dashboard/legs/LegCard';
import LegExpansion from '@/components/dashboard/legs/LegExpansion';
import LegFilterNav from '@/components/dashboard/legs/LegFilterNav';
import SlipNavbar from '@/components/dashboard/legs/SlipNavbar';

import { getUserBalance } from '@/actions/supabase/slips';

export default function LegsPage() {
  const { legs, loading } = useLegs();
  const { isLoaded, isSignedIn } = useUser();
  const [selectedLeg, setSelectedLeg] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [userBalance, setUserBalance] = useState<number>(0);
  
  // 🎛️ Estado para alternar vista: 'list' (1 col) o 'grid' (2 cols)
  const [isGridView, setIsGridView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iron_slip_view_mode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // 🧠 Inicialización perezosa (Lazy State) para el slip
  const [activeSlip, setActiveSlip] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('iron_slip_draft');
      if (savedDraft) {
        try {
          return JSON.parse(savedDraft);
        } catch (error) {
          console.error('Failed parsing slip draft initialization:', error);
        }
      }
    }
    return [];
  });

  // Sincronizar preferencia de vista
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iron_slip_view_mode', JSON.stringify(isGridView));
    }
  }, [isGridView]);

  // Sincronización bancaria en vivo
  useEffect(() => {
    let isMounted = true;
    async function syncWallet() {
      if (isLoaded && isSignedIn) {
        const res = await getUserBalance();
        if (isMounted) {
          if (res.success) {
            setUserBalance(res.credits);
          } else {
            console.error('Failed to sync live wallet credits:', res.error);
          }
        }
      }
    }
    syncWallet();
    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn]);

  // Sincronizar cambios del slip hacia localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('iron_slip_draft', JSON.stringify(activeSlip));
    }
  }, [activeSlip, isLoaded]);

  // Filtrado de Legs en memoria
  const filteredLegs = useMemo(() => {
    if (activeCategory === 'all') return legs;
    return legs.filter((leg: any) => leg.category === activeCategory);
  }, [legs, activeCategory]);

  // Búsqueda ultrarrápida O(1) de elementos activos en el slip
  const activeSlipIds = useMemo(() => {
    return new Set(activeSlip.map((item: any) => item._id.split('-')[0]));
  }, [activeSlip]);

  // Modificador del slip congelado en caché
  const toggleLegInSlip = useCallback((mutatedLeg: any) => {
    setActiveSlip((prevSlip) => {
      const exists = prevSlip.some((l) => l._id === mutatedLeg._id);

      if (exists) {
        return prevSlip.filter((l) => l._id !== mutatedLeg._id);
      } else {
        if (prevSlip.length >= 5) {
          alert('MAX_CAPACITY: 5_LEGS');
          return prevSlip;
        }
        return [...prevSlip, mutatedLeg];
      }
    });
  }, []);

  const handleClearSlipData = useCallback(() => {
    setActiveSlip([]);
    localStorage.removeItem('iron_slip_draft');
  }, []);

  const handleRemoveLeg = useCallback((id: string) => {
    setActiveSlip((prev) => prev.filter((l) => l._id !== id));
  }, []);

  // 🚀 Callback tras el éxito en la creación del slip maestro
  const handleConfirmSuccess = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iron_slip_draft');
    }
    setActiveSlip([]);
    window.location.href = '/slips';
  }, []);

  return (
    <main 
      className="min-h-screen w-full flex flex-col max-w-2xl mx-auto border-x border-zinc-900/60 relative pb-40"
      style={{
        backgroundColor: '#0d0b09',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
    >
      <meta name="theme-color" content="#0d0b09" />

      {/* HEADER & FILTROS (FIJOS ARRIBA PARA COMODIDAD) */}
      <div className="sticky top-0 z-30 bg-[#0d0b09]/95 backdrop-blur-md p-2 pb-0 flex flex-col border-b border-zinc-900">
        <div className="w-full">
          <LegsHeader userBalance={userBalance} />
        </div>

        {isLoaded && isSignedIn && (
          <div className="w-full flex items-center justify-between gap-2 pr-1 pt-1">
            <div className="overflow-x-auto overflow-y-hidden scrollbar-hide flex-1">
              <LegFilterNav
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                legs={legs}
              />
            </div>

            {/* 🎛️ BOTÓN CYBERPUNK PARA ALTERNAR VISTA */}
            <button
              onClick={() => setIsGridView((prev) => !prev)}
              className="flex-shrink-0 px-2.5 py-1.5 bg-zinc-900/80 border border-zinc-800 hover:border-iron-volt/60 text-zinc-400 hover:text-iron-volt font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 mb-2"
              title={isGridView ? "Switch to List View" : "Switch to 2-Col Grid View"}
            >
              {isGridView ? (
                <>
                  <svg className="w-3.5 h-3.5 text-iron-volt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>GRID</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-iron-volt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  <span>2X2</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* CONTENEDOR PRINCIPAL CON SCROLL NATIVO FLUIDO */}
      <div className="flex-1 mt-3 px-2">
        {loading || !isLoaded ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-iron-volt font-mono text-[10px] animate-pulse tracking-[0.3em]">
              CONNECTING
            </p>
          </div>
        ) : (
          <motion.div 
            layout 
            className={`transition-all duration-300 ${
              isGridView 
                ? 'grid grid-cols-2 gap-2' 
                : 'flex flex-col gap-1'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredLegs.map((leg: any) => (
                <motion.div
                  key={leg._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <LegCard
                    leg= {leg}
                    isSignedIn={!!isSignedIn}
                    onClick={setSelectedLeg}
                    isAlreadyInSlip={activeSlipIds.has(leg._id)}
                    isGridView={isGridView}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="col-span-full mt-8 flex flex-col items-center opacity-20">
              <div className="w-full h-[1px] bg-iron-volt mb-2" />
              <p className="font-mono text-[8px] text-iron-volt uppercase tracking-widest text-center">
                End_of_transmission
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* FOOTER NAV COMANDOS */}
      <SlipNavbar
        activeSlip={activeSlip}
        onRemoveLeg={handleRemoveLeg}
        clearSlipData={handleClearSlipData}
        userBalance={userBalance}
        onConfirmSuccess={handleConfirmSuccess}
      />

      {/* MODAL DETALLE DE PIERNA */}
      {selectedLeg && (
        <LegExpansion
          leg={selectedLeg}
          onClose={() => {
            setTimeout(() => {
              setSelectedLeg(null);
            }, 10);
          }}
          onToggleSlip={toggleLegInSlip}
          isInSlip={activeSlipIds.has(selectedLeg._id)}
          currentSlipItems={activeSlip}
          userBalance={userBalance}
          onRemoveLeg={handleRemoveLeg}
          clearSlipData={handleClearSlipData}
          onConfirmSuccess={handleConfirmSuccess}
        />
      )}
    </main>
  );
}