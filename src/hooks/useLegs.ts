import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';

export function useLegs() {
  const [legs, setLegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegs = async () => {
      try {
        // 🔥 QUERY ACTUALIZADA CON EL NUEVO ESQUEMA
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
            aiPrompt,
            isDemonSupported,
            demonMultiplier
          }
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