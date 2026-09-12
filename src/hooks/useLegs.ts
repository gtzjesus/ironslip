/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';

export function useLegs() {
  const [legs, setLegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLegs = async () => {
      try {
        const query = `*[_type == "leg"] | order(_createdAt desc) {
          _id,
          task,
          category,
          animationKey,  
          variants[] {
            name,
            target,
            probabilityWeight,
            isDemonSupported,
            verificationMethod,
            reward,        
            demonMultiplier,
            aiPrompt
          }
        }`;

        // ⚡️ FORCE NEXT.JS TO BYPASS ALL CACHING
        const data = await client.fetch(
          query,
          {},
          {
            cache: 'no-store',
            next: { revalidate: 0 },
          }
        );

        if (isMounted) {
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
      isMounted = false;
    };
  }, []);

  return { legs, loading };
}