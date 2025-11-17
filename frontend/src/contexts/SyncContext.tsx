import { createContext, useContext, useState, ReactNode } from 'react';
import type { SyncStatus, SyncState } from '../types';

interface SyncContextType extends SyncState {
  recordSyncStart: () => void;
  recordSyncSuccess: (timestamp?: string) => void;
  recordSyncError: (error: string) => void;
  incrementPending: () => void;
  decrementPending: () => void;
  checkForStaleData: (localTimestamp: string, remoteTimestamp: string) => boolean;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SyncState>({
    status: 'idle',
    lastSynced: null,
    pendingOperations: 0,
    error: null,
  });

  const recordSyncStart = () => {
    setState((prev) => ({
      ...prev,
      status: 'syncing',
      error: null,
    }));
  };

  const recordSyncSuccess = (timestamp?: string) => {
    setState((prev) => ({
      ...prev,
      status: 'idle',
      lastSynced: timestamp || new Date().toISOString(),
      error: null,
    }));
  };

  const recordSyncError = (error: string) => {
    setState((prev) => ({
      ...prev,
      status: 'error',
      error,
    }));
  };

  const incrementPending = () => {
    setState((prev) => ({
      ...prev,
      pendingOperations: prev.pendingOperations + 1,
    }));
  };

  const decrementPending = () => {
    setState((prev) => ({
      ...prev,
      pendingOperations: Math.max(0, prev.pendingOperations - 1),
    }));
  };

  /**
   * Check if local data is stale compared to remote
   * Returns true if remote is newer and should be fetched
   */
  const checkForStaleData = (
    localTimestamp: string,
    remoteTimestamp: string
  ): boolean => {
    try {
      const localDate = new Date(localTimestamp);
      const remoteDate = new Date(remoteTimestamp);
      return remoteDate > localDate;
    } catch (error) {
      console.error('Error comparing timestamps:', error);
      return false;
    }
  };

  const value: SyncContextType = {
    ...state,
    recordSyncStart,
    recordSyncSuccess,
    recordSyncError,
    incrementPending,
    decrementPending,
    checkForStaleData,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
