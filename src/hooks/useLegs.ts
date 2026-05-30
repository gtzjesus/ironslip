import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';

export function useLegs() {
  const [legs, setLegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegs = async () => {
      try {
        // 🔥 QUERY DE GROQ OPTIMIZADO: Mapeamos los campos nuevos explícitamente
        const query = `*[_type == "leg"] | order(_createdAt desc) {
          _id,
          task,
          category,
          regularTarget,
          regularReward,
          demonTarget,
          demonReward,
          verificationMethod
        }`;
        
        const data = await client.fetch(query);
        setLegs(data);
      } catch (error) {
        console.error('❌ Error fetching legs from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };

  	fetchLegs();
  }, []);

  return { legs, loading };
}