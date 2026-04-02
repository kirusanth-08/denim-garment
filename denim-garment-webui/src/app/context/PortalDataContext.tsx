import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

type PortalDataContextValue = {
  version: number;
  bumpVersion: () => void;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export const PortalDataProvider = ({ children }: PropsWithChildren) => {
  const [version, setVersion] = useState(0);

  const value = useMemo(
    () => ({
      version,
      bumpVersion: () => setVersion((current) => current + 1),
    }),
    [version],
  );

  return <PortalDataContext.Provider value={value}>{children}</PortalDataContext.Provider>;
};

export const usePortalDataContext = () => {
  const context = useContext(PortalDataContext);

  if (!context) {
    throw new Error('usePortalDataContext must be used within a PortalDataProvider.');
  }

  return context;
};

