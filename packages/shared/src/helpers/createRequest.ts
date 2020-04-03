import { IdentityTypes, PaymentTypes } from "@requestnetwork/types";
import { RequestNetwork, Request } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { chainIdToName } from "./chainIdToName";
import { getAddressFromEns, isValidEns } from "./getEnsName";
import WalletAddressValidator from "wallet-address-validator";

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
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL:
        network === "rinkeby"
          ? "https://gateway-rinkeby.request.network/"
          : "https://gateway.request.network/",
    },
    signatureProvider: new Web3SignatureProvider((window as any).ethereum),
  });

  const paymentNetworkType =
    currency!.split("-")[0] === "ETH"
      ? PaymentTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA
      : PaymentTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT;

  if (network === "rinkeby") {
    switch (currency) {
      case "DAI":
        currency = "FAU-rinkeby";
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
