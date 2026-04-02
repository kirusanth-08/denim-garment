import { createContext, ReactNode, useContext, useState } from 'react';

type StorefrontDataContextValue = {
  refreshKey: number;
  refreshStorefrontData: () => void;
};

const StorefrontDataContext = createContext<StorefrontDataContextValue | null>(null);

export const StorefrontDataProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <StorefrontDataContext.Provider
      value={{
        refreshKey,
        refreshStorefrontData: () => setRefreshKey((current) => current + 1),
      }}
    >
      {children}
    </StorefrontDataContext.Provider>
  );
};

export const useStorefrontData = () => {
  const context = useContext(StorefrontDataContext);

  if (!context) {
    throw new Error('useStorefrontData must be used within StorefrontDataProvider.');
  }

  return context;
};
