/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';

// 🧠 CACHÉ EN MEMORIA: Evita llamadas repetidas a Sanity
let cachedLegs: any[] | null = null;

export function useLegs() {
  const [legs, setLegs] = useState<any[]>(cachedLegs || []);
  const [loading, setLoading] = useState(!cachedLegs);

  useEffect(() => {
    // ⚡️ RUTA DE ESCAPE RÁPIDA: Si ya tenemos los datos, no hagas fetch
    if (cachedLegs) {
      return;
    }

    let isMounted = true;

    const fetchLegs = async () => {
      try {
        const query = `*[_type == "leg"] | order(_createdAt desc) {
          _id,
          task,
          animationKey,
          category,
          variants[] {
            name,
            target,
            reward,
            verificationMethod,
            isDemonSupported,
            demonMultiplier
          }
        }`;

        const data = await client.fetch(query);

        if (isMounted) {
          cachedLegs = data; // Guardamos en la caché global
          setLegs(data);
        }
      } catch (error) {
        console.error('❌ Error fetching legs from Sanity:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLegs();

    return () => {
      isMounted = false; // Evita memory leaks si el usuario cambia de pantalla rápido
    };
  }, []);

  return { legs, loading };
}
