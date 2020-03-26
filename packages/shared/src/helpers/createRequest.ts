import { IdentityTypes, PaymentTypes } from "@requestnetwork/types";
import { RequestNetwork, Request } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { chainIdToName } from "./chainIdToName";

export interface ICreateRequestArgs {
  payer?: IdentityTypes.IIdentity;
  amount: string;
  currency: string;
  paymentNetwork?: PaymentTypes.IPaymentNetworkCreateParameters;
  contentData: any;
}

export const createRequest = async (
  { currency, amount, payer, paymentNetwork, contentData }: ICreateRequestArgs,
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
  const request = await requestNetwork.createRequest({
    requestInfo: {
      currency,
      expectedAmount: amount,
      payer,
      payee: {
        type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        value: account,
      },
    },
    paymentNetwork,
    contentData,
    signer: {
      type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
      value: account,
    },
  });
  return request;
};
