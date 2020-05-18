import React, { useState, useEffect } from "react";
import { listRequestsForSmartContract, IParsedRequest } from "request-shared";
import { useWeb3React } from "@web3-react/core";
import { useGnosisSafe } from "../contexts/GnosisSafeContext";

interface IContext {
  requests?: IParsedRequest[];
  loading: boolean;
  refresh: () => void;
}

const RequestListContext = React.createContext<IContext | null>(null);

export const RequestListProvider: React.FC = ({ children }) => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [requests, setRequests] = useState<IParsedRequest[]>();

  // without safe
  const { account, chainId } = useWeb3React();
  // with safe
  //const { loading, name, safeInfo } = useGnosisSafe();
  // const [account, setAccount] = useState<string>();
  // useEffect(()=>{
  //   setAccount(safeInfo?.safeAddress);
  // },[safeInfo])

  useEffect(() => {
    let canceled = false;
    if (chainId && account) {
      setRequests(undefined);
      listRequestsForSmartContract(account, chainId).then(newRequests => {
        if (!canceled) {
          setRequests(newRequests);
        }
      });
    }
    return () => {
      canceled = true;
    };
  }, [chainId, account, forceUpdate]);
  return (
    <RequestListContext.Provider
      value={{
        requests,
        loading: requests === undefined,
        refresh: () => setForceUpdate(!forceUpdate),
      }}
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
