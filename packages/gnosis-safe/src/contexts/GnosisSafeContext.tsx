import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getEnsName } from "request-shared";

import initSdk, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

interface IGnosisSafeInfo {
  loading: boolean;
  name?: string;
  safeInfo?: SafeInfo;
}

const GnosisSafeContext = React.createContext<IGnosisSafeInfo | null>(null);

export const GnosisSafeProvider: React.FC = ({ children }) => {
  // TODO: put the right URL here for production
  const [appsSdk] = useState(initSdk([/https?:\/\/localhost/]));
  const [safeInfo, setSafeInfo] = useState({} as any);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
    });
    return () => appsSdk.removeListeners();
  }, [appsSdk]);

  const load = async (address?: string) => {
    if (address) {
      const ens = await getEnsName(address);
      setName(ens);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log({ safeInfo });
    if (!safeInfo?.safeAddress) {
      const t = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(t);
    } else {
      load(safeInfo!.safeAddress);
    }
  }, [safeInfo]);

  return (
    <GnosisSafeContext.Provider value={{ loading, name, safeInfo }}>
      {children}
    </GnosisSafeContext.Provider>
  );
};

export const useGnosisSafe = () => {
  const context = React.useContext(GnosisSafeContext);
  if (!context) {
    throw new Error("This hook must be used inside a GnosisSafeProvider");
  }
  return context;
};
