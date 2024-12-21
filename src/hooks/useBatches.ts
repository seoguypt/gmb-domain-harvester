import { useState, useEffect } from 'react';
import { Batch, BatchSummary, BatchResult } from '../types/batch';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'domain-checker-batches';

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);

  // Load batches from localStorage on mount
  useEffect(() => {
    const storedBatches = localStorage.getItem(STORAGE_KEY);
    if (storedBatches) {
      setBatches(JSON.parse(storedBatches));
    }
  }, []);

  // Save batches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
  }, [batches]);

  const createBatch = (name: string, results: BatchResult[]) => {
    const websiteMatches = results.filter(r => r.listing?.matchType === 'website');
    const nameMatches = results.filter(r => r.listing?.matchType === 'name');

    const newBatch: Batch = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
      results,
      websiteMatches,
      nameMatches
    };

    setBatches(prev => [...prev, newBatch]);
    setCurrentBatchId(newBatch.id);
    return newBatch.id;
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== id));
    if (currentBatchId === id) {
      setCurrentBatchId(null);
    }
  };

  const renameBatch = (id: string, newName: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === id ? { ...batch, name: newName } : batch
    ));
  };

  const getCurrentBatch = () => {
    return currentBatchId ? batches.find(b => b.id === currentBatchId) : null;
  };

  const getBatchSummaries = (): BatchSummary[] => {
    return batches.map(batch => ({
      id: batch.id,
      name: batch.name,
      createdAt: batch.createdAt,
      totalDomains: batch.results.length,
      websiteMatches: batch.websiteMatches.length,
      nameMatches: batch.nameMatches.length
    }));
  };

  return {
    batches,
    currentBatchId,
    setCurrentBatchId,
    createBatch,
    deleteBatch,
    renameBatch,
    getCurrentBatch,
    getBatchSummaries
  };
}
