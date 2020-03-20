import React, { useState, useEffect } from "react";
import { listRequests, IParsedRequest } from "request-shared";
import { useWeb3React } from "@web3-react/core";

interface IContext {
  requests?: IParsedRequest[];
  loading: boolean;
}

const RequestListContext = React.createContext<IContext | null>(null);

export const RequestListProvider: React.FC = ({ children }) => {
  const { account, chainId } = useWeb3React();

  const [requests, setRequests] = useState<IParsedRequest[]>();
  useEffect(() => {
    if (chainId && account) {
      listRequests(account, chainId).then(setRequests);
    }
  }, [chainId, account]);
  return (
    <RequestListContext.Provider
      value={{ requests, loading: requests === undefined }}
    >
      {children}
    </RequestListContext.Provider>
  );
};

export const useRequestList = () => {
  const context = React.useContext(RequestListContext);
  if (!context) {
    throw new Error("This hook must be used inside a RequestListProvider");
  }
  return context;
};
