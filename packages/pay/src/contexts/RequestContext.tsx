import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ethers } from "ethers";
import { formatUnits, bigNumberify } from "ethers/utils";

import {
  RequestNetwork,
  Request,
  Utils,
  Types
} from "@requestnetwork/request-client.js";

import { useRate } from "../hooks/useRate";

export type RequestStatus = "paid" | "open" | "pending" | "canceled";

/** Formatted request */
export interface IParsedRequest {
  requestId: string;
  amount: number;
  currency: string;
  status: RequestStatus;
  timestamp: Date;
  paidDate?: Date;
  paymentAddress: string;
  paymentFrom?: string;
  invoiceNumber?: string;
  reason?: string;
  currencyType: Types.RequestLogic.CURRENCY;
  currencyNetwork?: string;
  txHash?: string;
  payee: string;
  payeeName?: string;
  raw: Types.IRequestData;
}

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
): Promise<Request | null> => {
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
            : "https://gateway.request.network"
      }
    });
    return await rn.fromRequestId(requestId);
  } catch (error) {
    return null;
  }
};

/** Transforms a request to a more friendly format */
const parseRequest = async (
  requestId: string,
  data: Types.IRequestData,
  pending: boolean
): Promise<IParsedRequest> => {
  const amount = Number(
    formatUnits(
      data.expectedAmount,
      Utils.getDecimalsForCurrency(data.currencyInfo)
    )
  );

  const status = pending
    ? "pending"
    : data.state === Types.RequestLogic.STATE.CANCELED
    ? "canceled"
    : bigNumberify(data.balance!.balance).gte(bigNumberify(data.expectedAmount))
    ? "paid"
    : "open";

  const paidTimestamp = data.balance?.events.reverse()[0]?.timestamp;

  const extensionsValues = Object.values(data.extensions).find(
    x => x.type === "payment-network"
  )?.values;

  const provider = ethers.getDefaultProvider(
    data.currencyInfo.network === "rinkeby" ? "rinkeby" : "mainnet"
  );

  let paymentFrom;

  if (
    data.balance?.events?.length &&
    [
      Types.RequestLogic.CURRENCY.ERC20,
      Types.RequestLogic.CURRENCY.ETH
    ].includes(data.currencyInfo.type)
  ) {
    const tx = await provider.getTransaction(
      data.balance.events[0].parameters.txHash
    );
    if (tx) {
      paymentFrom = tx.from;
    }
  }
  // Try to get the payee ENS address
  let ens;
  if (data.payee) {
    const mainnetProvider =
      (await provider.getNetwork()).chainId === 1
        ? provider
        : ethers.getDefaultProvider("mainnet");
    ens = await mainnetProvider.lookupAddress(data.payee.value);
  }

  return {
    requestId,
    amount,
    currency: data.currency.split("-")[0],
    status,
    timestamp: new Date(data.timestamp * 1000),
    paidDate: paidTimestamp ? new Date(paidTimestamp * 1000) : undefined,
    paymentAddress: extensionsValues.paymentAddress,
    paymentFrom,
    reason: data.contentData?.reason,
    invoiceNumber: data.contentData?.invoiceNumber,
    currencyType: data.currencyInfo.type,
    currencyNetwork: data.currencyInfo.network,
    txHash: data.balance?.events[0]?.parameters?.txHash,
    payee: data.payee?.value || "",
    payeeName: ens,
    raw: data
  };
};

/** Loads the request and converts the amount to counter currency */
export const RequestProvider: React.FC = ({ children }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [parsedRequest, setParsedRequest] = useState<IParsedRequest>();
  const counterCurrency = "USD";
  const [counterValue, setCounterValue] = useState<string>("");
  const [pending, setPending] = useState(false);

  // gets counter currency rate
  const rate = useRate(parsedRequest?.currency, counterCurrency);

  // load request and handle pending state change.
  useEffect(() => {
    if (id) {
      loadRequest(id).then(request => {
        if (request) {
          parseRequest(request.requestId, request.getData(), pending)
            .then(setParsedRequest)
            .then(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });
    }
  }, [id, pending]);

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
        setPending
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
