import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { RequestNetwork, Request } from "@requestnetwork/request-client.js";

import { useRate } from "../hooks/useRate";
import { parseRequest } from "../helpers/parseRequest";
import { IParsedRequest } from "../";

interface IContext {
  /** true if first fetch is ongoing */
  loading: boolean;
  /** the fetched request */
  request?: IParsedRequest;
  /** the counter fiat currency, for display */
  counterCurrency: string;
  /** the request's expected amount in counter currency */
  counterValue?: string;
  /**
   * set the pending status for UX purposes
   * Pending means the payment is being processed and takes a long time.
   */
  setPending: (val: boolean) => void;
  update: () => void;
}

/**
 * This context loads the request, based on ID in the URL.
 * It also handles rate conversion of the request's amount in a counter currency,
 * as well as the pending state, that exists for UX reasons.
 */
export const RequestContext = React.createContext<IContext | null>(null);

/** Gets a request from a gateway. Tries mainnet then rinkeby */
const loadRequest = async (
  requestId: string,
  network?: string
): Promise<{ network: string; request: Request } | null> => {
  if (!network) {
    return (
      (await loadRequest(requestId, "mainnet")) ||
      (await loadRequest(requestId, "rinkeby"))
    );
  }
  try {
    const rn = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL:
          network === "rinkeby"
            ? "https://gateway-rinkeby.request.network"
            : "https://gateway.request.network",
      },
    });
    return {
      network,
      request: await rn.fromRequestId(requestId),
    };
  } catch (error) {
    return null;
  }
};

/** Loads the request and converts the amount to counter currency */
export const RequestProvider: React.FC = ({ children }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [parsedRequest, setParsedRequest] = useState<IParsedRequest>();
  const counterCurrency = "USD";
  const [counterValue, setCounterValue] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  // gets counter currency rate
  const rate = useRate(parsedRequest?.currency, counterCurrency);

  // load request and handle pending state change.
  useEffect(() => {
    if (id) {
      loadRequest(id).then(result => {
        if (result) {
          parseRequest(
            result.request.requestId,
            result.request.getData(),
            result.network,
            pending
          )
            .then(setParsedRequest)
            .then(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });
    }
  }, [id, pending, forceUpdate]);

  // handle rate conversion
  useEffect(() => {
    if (rate && parsedRequest?.amount)
      setCounterValue((rate * parsedRequest.amount).toFixed(2));
    else {
      setCounterValue("");
    }
  }, [rate, parsedRequest]);

  return (
    <RequestContext.Provider
      value={{
        loading,
        request: parsedRequest,
        counterCurrency,
        counterValue,
        setPending,
        update: () => setForceUpdate(!forceUpdate),
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

/** Utility to use the Request context */
export const useRequest = () => {
  const context = React.useContext(RequestContext);
  if (!context) {
    throw new Error("This hook must be used inside a RequestProvider");
  }
  return context;
};
