
import { useState, useEffect } from 'react';

export interface CreditTransaction {
  date: Date;
  amount: number;
  reason: string;
}

export function useCreditSystem(initialCredits: number = 5) {
  const [credits, setCredits] = useState(initialCredits);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load credits from localStorage on init
  useEffect(() => {
    const savedCredits = localStorage.getItem('user_credits');
    const savedHistory = localStorage.getItem('credit_history');
    
    if (savedCredits) {
      setCredits(parseInt(savedCredits));
    }
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        })));
      } catch (e) {
        console.error('Failed to parse credit history');
      }
    }
    
    setIsLoading(false);
  }, []);
  
  // Save credits to localStorage when they change
  useEffect(() => {
    localStorage.setItem('user_credits', credits.toString());
  }, [credits]);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('credit_history', JSON.stringify(history));
  }, [history]);
  
  const addCredits = (amount: number, reason: string = 'purchase') => {
    setCredits(prev => prev + amount);
    setHistory(prev => [...prev, {
      date: new Date(),
      amount,
      reason
    }]);
    return true;
  };
  
  const useCredits = (amount: number = 1, reason: string = 'generation') => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      setHistory(prev => [...prev, {
        date: new Date(),
        amount: -amount,
        reason
      }]);
      return true;
    }
    return false;
  };
  
  const hasEnoughCredits = (amount: number = 1) => {
    return credits >= amount;
  };
  
  return {
    credits,
    addCredits,
    useCredits,
    hasEnoughCredits,
    history,
    isLoading
  };
}
