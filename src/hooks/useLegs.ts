import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';

export function useLegs() {
  const [legs, setLegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegs = async () => {
      try {
        // Query de GROQ: Trae todo el tipo 'leg'
        const query = `*[_type == "leg"] | order(_createdAt desc)`;
        const data = await client.fetch(query);
        setLegs(data);
      } catch (error) {
        console.error('Error fetching legs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLegs();
  }, []);

  return { legs, loading };
}
