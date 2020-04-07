import { InjectedConnector } from "@web3-react/injected-connector";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IParsedRequest } from "request-shared";
import { RequestLogicTypes } from "@requestnetwork/types";

/** Get available connectors based on request type and network. */
export const getConnectors = (
  request: IParsedRequest
): Record<string, AbstractConnector> => {
  if (
    !(
      request.currencyType === RequestLogicTypes.CURRENCY.ETH ||
      request.currencyType === RequestLogicTypes.CURRENCY.ERC20
    )
  ) {
    return {};
  }
  const rpc: Record<number, string> = {};
  const supportedChainIds = [];
  if (request?.currencyNetwork === "rinkeby") {
    supportedChainIds.push(4);
    rpc[4] = "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213";
  } else if (request?.currencyNetwork === "mainnet") {
    supportedChainIds.push(1);
    rpc[1] = "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213";
  }

  return {
    injected: new InjectedConnector({ supportedChainIds }),
    // walletconnect:
    //   request &&
    //   new WalletConnectConnector({
    //     rpc,
    //     bridge: "https://bridge.walletconnect.org",
    //     qrcode: false,
    //     pollingInterval: 8000,
    //   }),
  };
};
