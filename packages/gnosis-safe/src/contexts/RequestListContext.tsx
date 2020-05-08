import React, { useState, useEffect } from "react";
import { listRequestsForSmartContract, IParsedRequest } from "request-shared";
import { useWeb3React } from "@web3-react/core";
import { useGnosisSafe } from "../contexts/GnosisSafeContext";

interface IContext {
  requests?: IParsedRequest[];
  loading: boolean;
  refresh: () => void;
  filter: string;
  setFilter: (val: string) => void;
}

const RequestListContext = React.createContext<IContext | null>(null);

const applyFilter = (
  requests: IParsedRequest[] | undefined,
  filter: string
) => {
  if (!requests) return undefined;
  if (filter === "all") return requests;
  if (filter === "outstanding")
    return requests.filter(x => x.status === "open");
  if (filter === "paid") return requests.filter(x => x.status === "paid");
};

export const RequestListProvider: React.FC = ({ children }) => {
  const { loading, name, safeInfo } = useGnosisSafe();

  const { /* account, */ chainId } = useWeb3React();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [requests, setRequests] = useState<IParsedRequest[]>();

  const [filter, setFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState<IParsedRequest[]>();

  useEffect(() => {
    setFilteredRequests(undefined);
    setTimeout(() => {
      setFilteredRequests(applyFilter(requests, filter));
    }, 100);
  }, [filter, requests]);

  useEffect(() => {
    let canceled = false;
    if (chainId && safeInfo?.safeAddress) {
      setRequests(undefined);
      listRequestsForSmartContract(safeInfo!.safeAddress, chainId).then(
        newRequests => {
          if (!canceled) {
            setRequests(newRequests);
          }
        }
      );
    }
    return () => {
      canceled = true;
    };
  }, [chainId, safeInfo, forceUpdate]);
  return (
    <RequestListContext.Provider
      value={{
        requests: filteredRequests,
        loading: filteredRequests === undefined,
        refresh: () => setForceUpdate(!forceUpdate),
        filter,
        setFilter,
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
