import { CurrencyDefinition } from "@requestnetwork/currency";
import { RequestLogicTypes, ClientTypes } from "@requestnetwork/types";
import { providers, utils } from "ethers";
export type RequestStatus =
  | "paid"
  | "open"
  | "pending"
  | "canceled"
  | "overpaid"
  | "unknown";

/** Formatted request */
export interface IParsedRequest {
  requestId: string;
  amount: number;
  balance: number;
  currency: CurrencyDefinition;
  status: RequestStatus;
  createdDate: Date;
  paidDate?: Date;
  canceledDate?: Date;
  paymentAddress: string;
  paymentFrom?: string;
  invoiceNumber?: string;
  reason?: string;
  currencyType: RequestLogicTypes.CURRENCY;
  currencySymbol: string;
  currencyNetwork?: string;
  txHash?: string;
  payee: string;
  payer?: string;
  payeeName?: string;
  payerName?: string;
  raw: ClientTypes.IRequestData;
  network: string;
  loaded?: boolean;
}

export * from "./contexts/RequestContext";
export * from "./contexts/CurrencyContext";
export * from "./hooks/useRate";
export * from "./helpers";

export type ChainInfo = {
  id: string;
  chainId: number;
  name: string;
  color?: string;
  isTest?: boolean;
  rpcUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
};

export const chainInfos: Record<string | number, ChainInfo> = {
  mainnet: { id: "mainnet", name: "Ethereum", chainId: 1, color: "#038789" },
  xdai: {
    id: "xdai",
    color: "#48a900",
    chainId: 100,
    name: "xDAI Chain",
    rpcUrls: ["https://rpc.xdaichain.com"],
    nativeCurrency: {
      name: "xDAI",
      symbol: "xDAI",
      decimals: 18,
    },
    blockExplorerUrls: ["https://blockscout.com/poa/xdai"],
  },
  matic: {
    id: "matic",
    name: "Polygon",
    chainId: 137,
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.matic.network/"],
  },
  rinkeby: {
    id: "rinkeby",
    name: "Rinkeby",
    chainId: 4,
    color: "#FFB95F",
  },
};

export const addEthereumChain = (
  chain: string | number,
  library?: providers.Web3Provider
) => {
  const { chainId, name, blockExplorerUrls, rpcUrls, nativeCurrency } =
    chainInfos[chain] || {};
  if (!library) {
    library = new providers.Web3Provider((window as any).ethereum);
  }
  return library.send("wallet_addEthereumChain", [
    {
      chainId: utils.hexlify(chainId),
      chainName: name,
      blockExplorerUrls,
      rpcUrls,
      nativeCurrency,
    },
  ]);
};

Object.values(chainInfos).forEach(val => (chainInfos[val.chainId] = val));
