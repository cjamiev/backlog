import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { pingBackend } from '../api/library-service';

interface StorageContextType {
  isBackendAvailable: boolean;
  isLoadingPing: boolean;
  refreshStorageStatus: () => void;
}

const StorageContext = createContext<StorageContextType>({
  isBackendAvailable: false,
  isLoadingPing: true,
  refreshStorageStatus: () => { }
});

export const useStorageContext = () => useContext(StorageContext);

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoadingPing, setIsLoadingPing] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  useEffect(() => {
    if (isLoadingPing) {
      pingBackend()
        .then((success: boolean) => {
          setIsBackendAvailable(success);
        })
        .finally(() => setIsLoadingPing(false));
    }
  }, [isLoadingPing]);

  return (
    <StorageContext.Provider value={{ isBackendAvailable, isLoadingPing, refreshStorageStatus: pingBackend }}>
      {children}
    </StorageContext.Provider>
  );
};
