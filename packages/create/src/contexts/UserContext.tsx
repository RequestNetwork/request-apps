import React, { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { ENS } from "request-shared";
import { providers } from "ethers";

interface IContext {
  loading: boolean;
  name?: string;
  account?: string;
}

const UserContext = React.createContext<IContext | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { account, library, chainId } = useWeb3React<providers.Web3Provider>();
  const [name, setName] = useState<string>();

  const load = useCallback(
    async (account?: string) => {
      if (account) {
        if (chainId === 1 || chainId === 4) {
          const ens = await ENS.fromAddress(account, library);
          if (ens) {
            setName(ens.name);
          }
        }
        // const t = setTimeout(() => setLoading(false), 200);
        // return () => clearTimeout(t);
        setLoading(false);
      }
    },
    [chainId, library]
  );

  useEffect(() => {
    if (!account) {
      const t = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(t);
    } else {
      setName(undefined);
      load(account);
    }
  }, [account, load]);

  return (
    <UserContext.Provider
      value={{ loading, name, account: account || undefined }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useConnectedUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("This hook must be used inside a UserProvider");
  }
  return context;
};
