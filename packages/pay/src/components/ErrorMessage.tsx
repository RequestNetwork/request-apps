import React from "react";
import { RAlert, Severity } from "request-ui";

import { UnsupportedChainIdError } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";

import {
  FiatRequestNotSupportedError,
  NotEnoughForGasError,
  NotEnoughForRequestError,
  RequiresApprovalError
} from "../contexts/PaymentContext";
import { IParsedRequest } from "../contexts/RequestContext";

const getErrorMessage = (error: Error, request: IParsedRequest) => {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  }
  if (error instanceof FiatRequestNotSupportedError) {
    return "This is a fiat request. You can't pay it here. You must be lost 🙃";
  }
  if (error instanceof RequiresApprovalError) {
    return "Please approve the contract using your connected wallet.";
  }
  if (error instanceof UnsupportedChainIdError) {
    if (request.currencyNetwork === "mainnet") {
      return "Please connect your wallet to the Main Ethereum Network to pay this request.";
    }
    if (request.currencyNetwork === "rinkeby") {
      return "Please connect your wallet to the Rinkeby Test Network to pay this request.";
    }

    return "Please connect your wallet to {request.currencyNetwork} to pay this request.";
  }

  if (error instanceof NotEnoughForRequestError) {
    return `Please add ${request.currency} to your wallet to make a payment.`;
  }
  if (error instanceof NotEnoughForGasError) {
    return `Please add ETH to your wallet to make a payment.`;
  }

  console.error(error);
  return "An unknown error occurred.";
};

export const ErrorMessage = ({
  error,
  request
}: {
  error: Error;
  request: IParsedRequest;
}) => {
  const severities: Record<string, Severity> = {
    FiatRequestNotSupportedError: "error",
    RequiresApprovalError: "info"
  };

  return (
    <RAlert
      severity={severities[error.name] || "warning"}
      message={getErrorMessage(error, request)}
    />
  );
};
