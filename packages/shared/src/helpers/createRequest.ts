import { IdentityTypes, PaymentTypes } from "@requestnetwork/types";
import { RequestNetwork, Request } from "@requestnetwork/request-client.js";
import { Web3Provider } from "ethers/providers";
import WalletAddressValidator from "wallet-address-validator";

import { chainIdToName } from "./chainIdToName";
import { getAddressFromEns, isValidEns } from "./getEnsName";
import { CustomSignatureProvider } from "./CustomSignatureProvider";

export interface ICreateRequestArgs {
  payer?: string;
  amount: string;
  currency: string;
  paymentAddress?: string;
  contentData: any;
}

export const createRequest = async (
  { currency, amount, payer, paymentAddress, contentData }: ICreateRequestArgs,
  account: string,
  network: string | number
): Promise<Request> => {
  network = chainIdToName(network);
  const win = window as any;
  if (!win.ethereum) {
    throw new Error("ethereum not detected");
  }
  let signatureProvider = new CustomSignatureProvider(
    new Web3Provider((window as any).ethereum).getSigner()
  );
  if (!win.ethereum.isMetamask) {
    const { Web3SignatureProvider } = require("@requestnetwork/web3-signature");
    signatureProvider = new Web3SignatureProvider(win.ethereum);
  }
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL:
        network === "rinkeby"
          ? "https://gateway-rinkeby.request.network/"
          : "https://gateway.request.network/",
    },
    signatureProvider,
  });

  const paymentNetworkType =
    currency!.split("-")[0] === "ETH"
      ? PaymentTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA
      : PaymentTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT;

  if (network === "rinkeby") {
    switch (currency) {
      case "FAU":
        currency = "FAU-rinkeby";
        break;
      case "CTBK":
        currency = "CTBK-rinkeby";
        break;
      case "ETH":
        currency = "ETH-rinkeby";
        break;
    }
  }

  if (payer) {
    if (isValidEns(payer)) {
      payer = await getAddressFromEns(payer);
    } else if (!WalletAddressValidator.validate(payer, "ethereum")) {
      throw new Error("invalid ethereum address");
    }
  }

  const request = await requestNetwork.createRequest({
    requestInfo: {
      currency,
      expectedAmount: amount,
      payer: payer
        ? {
            type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
            value: payer,
          }
        : undefined,
      payee: {
        type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        value: account,
      },
    },
    paymentNetwork: {
      id: paymentNetworkType,
      parameters: {
        paymentAddress,
      },
    },
    contentData,
    signer: {
      type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
      value: account,
    },
  });
  return request;
};
