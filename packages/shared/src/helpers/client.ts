//@ts-nocheck
import { CurrencyDefinition } from "@requestnetwork/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useCurrency } from "../contexts/CurrencyContext";

export const useRequestClient = (
  network: string,
  signatureProvider?: Types.SignatureProvider.ISignatureProvider
) => {
  const { currencyList } = useCurrency();
  return getRequestClient(network, signatureProvider, currencyList);
};

export const getRequestClient = (
  network: string,
  signatureProvider?: Types.SignatureProvider.ISignatureProvider,
  currencyList?: CurrencyDefinition[]
) => {
  const networkMap = {
    matic: "xdai",
  };
  const networkName = networkMap[network] ?? network;
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: `https://${networkName}.gateway.request.network/`,
      // baseURL: `https://${networkName}.rn.huma.finance/`,
      // baseURL: `http://localhost:3000`,
    },
    signatureProvider,
    currencies: currencyList,
  });

  return requestNetwork;
};
