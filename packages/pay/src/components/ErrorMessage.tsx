import React from "react";
import { RAlert, Severity } from "request-ui";

import { UnsupportedChainIdError } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";

import {
  FiatRequestNotSupportedError,
  NotEnoughForGasError,
  NotEnoughForRequestError,
  RequiresApprovalError,
} from "../contexts/PaymentContext";
import { IParsedRequest } from "request-shared";
import { Link } from "@material-ui/core";

const getErrorMessage = (error: Error, request: IParsedRequest) => {
  if (error instanceof NoEthereumProviderError) {
    return (
      <>
        No compatible wallet detected. Please{" "}
        <Link
          underline="always"
          style={{
            color: "#656565",
          }}
          href="https://metamask.io/download.html"
        >
          install Metamask
        </Link>{" "}
        or finish your payment using a mobile wallet.
      </>
    );
  }
  if (error instanceof FiatRequestNotSupportedError) {
    return "This is a fiat request. You can't pay it here. You must be lost 🙃";
  }
  if (error instanceof RequiresApprovalError) {
    return "Please approve the contract using your connected wallet.";
  }
  if (error instanceof UnsupportedChainIdError) {
    if (request.currencyNetwork === "mainnet") {
      return "This is a live request. Please connect to the main network to pay.";
    }
    if (request.currencyNetwork === "rinkeby") {
      return "This is a test request. Please connect to the Rinkeby Test Network to pay.";
    }

    return `Please connect your wallet to ${request.currencyNetwork} to pay this request.`;
  }

  if (error instanceof NotEnoughForRequestError) {
    return `You do not have sufficient funds. Please add ${request.currency} to your wallet to pay this request.`;
  }
  if (error instanceof NotEnoughForGasError) {
    return `You do not have sufficient ETH to pay gas. Please add ETH to your wallet to pay this request.`;
  }

  console.error(error);
  return "An unknown error occurred.";
};

export const ErrorMessage = ({
  error,
  request,
}: {
  error: Error;
  request: IParsedRequest;
}) => {
  const severities: Record<string, Severity> = {
    FiatRequestNotSupportedError: "error",
    RequiresApprovalError: "info",
  };

  return (
    <RAlert
      severity={severities[error.name] || "warning"}
      message={getErrorMessage(error, request)}
    />
  );
};
