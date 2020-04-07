import {
  payRequest,
  getErc20Balance,
  hasErc20Approval,
  approveErc20,
} from "@requestnetwork/payment-processor";
import { useCallback, useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useRequest } from "request-shared";
import { Web3Provider, TransactionResponse } from "ethers/providers";
import { Types } from "@requestnetwork/request-client.js";
import React from "react";

export class NotEnoughForGasError extends Error {
  constructor() {
    super("Not Enough funds for gas");
    this.name = "NotEnoughForGasError";
  }
}
export class NotEnoughForRequestError extends Error {
  constructor() {
    super("Not Enough funds for request");
    this.name = "NotEnoughForRequestError";
  }
}
export class RequiresApprovalError extends Error {
  constructor() {
    super("Requires Approval");
    this.name = "RequiresApprovalError";
  }
}
export class FiatRequestNotSupportedError extends Error {
  constructor() {
    super("Fiat requests are not supported");
    this.name = "FiatRequestNotSupportedError";
  }
}

/** runs some verification on a request, throw errors if some expectation aren't met  */
const runChecks = async (
  request: Types.IRequestData,
  account: string,
  library: Web3Provider
) => {
  switch (request.currencyInfo.type) {
    case "ERC20":
      const erc20balance = await getErc20Balance(request, account, library);
      if (erc20balance.lt(request.expectedAmount)) {
        return new NotEnoughForRequestError();
      }
      const ethBalance = await library.getBalance(account);
      if (ethBalance.isZero()) {
        return new NotEnoughForGasError();
      }

      const approval = await hasErc20Approval(request, account, library);
      if (!approval) {
        return new RequiresApprovalError();
      }

      break;
    case "ETH":
      const balance = await library.getBalance(account);
      if (balance.lt(request.expectedAmount)) {
        return new NotEnoughForRequestError();
      }
      if (balance.eq(request.expectedAmount)) {
        return new NotEnoughForGasError();
      }

      break;
  }
};

export interface IPaymentContext {
  /** true when initial checks have run */
  ready: boolean;
  /** see runChecks  */
  error?: Error;
  /** true if the request is being paid */
  paying: boolean;
  /** triggers the pay action */
  pay: () => void;
  /** true if the request is being approved */
  approving: boolean;
  /** triggers the approve action */
  approve: () => void;
  /** true if the transaction is being broadcasting */
  broadcasting: boolean;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** exposes payment methods and information */
export const PaymentProvider: React.FC = ({ children }) => {
  const [paying, setPaying] = useState(false);
  const [approving, setApproving] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [loadingPendingTx, setLoadingPendingTx] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();

  const { account, library } = useWeb3React<Web3Provider>();
  const { request, setPending } = useRequest();

  const txCallback = useCallback(
    async (tx: TransactionResponse) => {
      if (!tx.hash) {
        throw new Error("no tx hash");
      }
      localStorage.setItem("txhash", tx.hash);
      setBroadcasting(true);
      await sleep(1000);
      setPending(true);
      await tx.wait(1);
      await sleep(1000);
      setBroadcasting(false);
      localStorage.removeItem("txhash");
    },
    [setBroadcasting, setPending]
  );

  // Check for locally stored payment transaction hash and
  // set payment as pending while waiting for transaction to be complete.
  useEffect(() => {
    const hash = localStorage.getItem("txhash");
    if (hash) {
      if (!library) return;
      if (request?.status === "paid") {
        localStorage.removeItem("txhash");
      }
      if (request?.status === "open") {
        setPending(true);
        setLoadingPendingTx(false);
        library.waitForTransaction(hash, 1).then(() => {
          setPending(false);
          localStorage.removeItem("txhash");
        });
      }
    } else {
      setLoadingPendingTx(false);
    }
  }, [library, request, setPending]);

  // Process paying a request or approving an erc20 allowance
  useEffect(() => {
    if (!request || !account || !library) return;
    if (paying && request.status === "open") {
      payRequest(request.raw, library)
        .then(txCallback)
        .then(() => setTimeout(() => setPending(false), 5000))
        .finally(() => setPaying(false));
    }
    if (approving) {
      approveErc20(request.raw, library)
        .then(async tx => {
          setBroadcasting(true);
          await tx.wait(1);
          await sleep(5000);
          setBroadcasting(false);
        })
        .then(() => setError(undefined))
        .finally(() => setApproving(false));
    }
  }, [approving, paying, request, account, library, txCallback, setPending]);

  // Run checks and show error messages if something is wrong.
  useEffect(() => {
    if (
      request?.currencyType === Types.RequestLogic.CURRENCY.ISO4217 &&
      request.status === "open"
    ) {
      setReady(true);
      setError(new FiatRequestNotSupportedError());
    } else if (request?.currencyType === Types.RequestLogic.CURRENCY.BTC) {
      setReady(true);
    } else {
      if (!account || !request || !library) return;
      runChecks(request.raw, account, library).then(err => {
        setError(err);
        setReady(true);
      });
    }
  }, [request, approving, paying, account, library]);

  const value = {
    ready: ready && !loadingPendingTx,
    error,
    paying,
    pay: () => setPaying(true),
    approving,
    approve: () => setApproving(true),
    broadcasting,
  };
  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export const PaymentContext = React.createContext<IPaymentContext | null>(null);

export const usePayment = () => {
  const context = React.useContext(PaymentContext);
  if (!context) {
    throw new Error("This hook must be used inside a PaymentProvider");
  }
  return context;
};
