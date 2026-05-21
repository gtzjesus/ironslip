export interface LocalUserSlip {
  id: string;
  title: string;
  type: 'IRON' | 'DEMON';
  wagerAllocated: number; // ◄ ADDED: Tracks the user stake/investment for the parlay
  totalPayout: number;
  multiplier: number;
  status: 'PENDING' | 'HIT' | 'MISSED';
  createdAt: string;
  legs: Array<{
    _id: string;
    task: string;
    creditReward: number;
    isDemon?: boolean;
  }>;
}

export const slipStorage = {
  // Read all slips from memory
  getSlips: (): LocalUserSlip[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('iron_active_slips');
    return data ? JSON.parse(data) : [];
  },

  // Save a brand new user custom contract
  saveSlip: (newSlip: Omit<LocalUserSlip, 'id' | 'status' | 'createdAt'>) => {
    if (typeof window === 'undefined') return;
    const currentSlips = slipStorage.getSlips();
    
    const formattedSlip: LocalUserSlip = {
      ...newSlip,
      id: `CONTRACT-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('iron_active_slips', JSON.stringify([formattedSlip, ...currentSlips]));
    return formattedSlip;
  }
};