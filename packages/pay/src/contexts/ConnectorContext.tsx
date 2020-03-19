import React, { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useRequest } from "./RequestContext";
import {
  WalletConnectConnector,
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from "@web3-react/injected-connector";
import { usePrevious } from "../hooks/usePrevious";
import { RequestLogicTypes } from "@requestnetwork/types";
import { IParsedRequest } from "request-shared";

interface IContext {
  /** name of the active connector */
  connectorName: string | undefined;
  /** set the active connector */
  activateConnector: (name: string) => void;
  /** for walletconnect only, the connection URL */
  walletConnectUrl?: string;
  /** true when connectors are loaded. Avoids flashing UIs */
  ready: boolean;
  /** name of the connected provider (metamask,...) if available */
  providerName: string;
}

/**
 * This context manages the active web3 Connector based on the current Request as well as the user's choice.
 * It relies on both Web3ReactContext for the web3 context, and the RequestContext for the current request.
 */
export const ConnectorContext = React.createContext<IContext | null>(null);

/** Get available connectors based on request type and network. */
const getConnectors = (
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
    walletconnect:
      request &&
      new WalletConnectConnector({
        rpc,
        bridge: "https://bridge.walletconnect.org",
        qrcode: false,
        pollingInterval: 8000,
      }),
  };
};

/** attempt to get the connected wallet. Falls back to the connector name (injected, walletconnect...) */
export default function getProviderName(connectorName?: string): string {
  const provider = (window as any).ethereum;
  if (provider) {
    if (provider.isMetaMask) return "metamask";
    if (provider.isTrust) return "trust";
    if (provider.isGoWallet) return "goWallet";
    if (provider.isAlphaWallet) return "alphaWallet";
    if (provider.isStatus) return "status";
    if (provider.isToshi) return "coinbase";
    if (provider.isGSNProvider) return "GSN";
    if (provider.constructor?.name === "EthereumProvider") return "mist";
    if (provider.constructor?.name === "Web3FrameProvider") return "parity";
    if (provider.host?.indexOf("infura") !== -1) return "infura";
    if (provider.connection?.url.indexOf("infura") !== -1) return "infura";
    if (provider.host?.indexOf("localhost") !== -1) return "localhost";
    if (provider.host?.indexOf("127.0.0.1") !== -1) return "localhost";
  }
  if (connectorName) return connectorName;
  return "unknown";
}

/**
 * This provider reacts to changes on the request
 */
export const ConnectorProvider: React.FC = ({ children }) => {
  const [connectors, setConnectors] = useState<
    Record<string, AbstractConnector>
  >();
  const [connectorName, setConnectorName] = useState<string>();
  const [walletConnectUrl, setWalletConnectUrl] = useState("");
  const [ready, setReady] = useState(false);

  const { request } = useRequest();
  const { activate, deactivate, active, error } = useWeb3React();

  const prevActive = usePrevious(active);

  // load available connectors for request
  useEffect(() => {
    if (request) {
      setConnectors(getConnectors(request));
    }
  }, [request]);

  // handle errors and connector deactivation
  useEffect(() => {
    if (
      error &&
      (error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect)
    ) {
      setConnectorName("");
      deactivate();
    }
    if (connectorName && prevActive && !active && !error) {
      setConnectorName("");
    }
  }, [error, active, prevActive, connectorName]);

  // handle connector activation
  useEffect(() => {
    if (connectors && connectorName && connectors[connectorName]) {
      console.log(connectorName);
      activate(connectors[connectorName], undefined, false);
    }
  }, [connectors, connectorName]);

  // Try activate the previously used connector silently
  useEffect(() => {
    if (!connectors) return;
    if (Object.keys(connectors).length === 0) {
      setReady(true);
      return;
    }

    const injected = connectors.injected as InjectedConnector;
    const walletconnect = connectors.walletconnect;

    if (injected && walletconnect) {
      // try getting walletconnect URL
      walletconnect.on(URI_AVAILABLE, setWalletConnectUrl);
      // try activating Injected connector
      injected.isAuthorized().then(async isAuthorized => {
        if (isAuthorized) {
          try {
            await activate(injected, undefined, true);
            setConnectorName("injected");
            setReady(true);
            return;
          } catch (e) {
            console.log(e);
            setConnectorName("");
          }
        }

        if (localStorage.getItem("walletconnect")) {
          try {
            // try activating WalletConnect connector
            await activate(walletconnect, undefined, true);
            setConnectorName("walletconnect");
          } catch (e) {
            console.log(e);
            setConnectorName("");
          }
        }
      });
    }
    setReady(true);

    return () => {
      walletconnect?.off(URI_AVAILABLE, setWalletConnectUrl);
    };
  }, [connectors]);

  return (
    <ConnectorContext.Provider
      value={{
        connectorName,
        activateConnector: setConnectorName,
        walletConnectUrl,
        ready,
        providerName: getProviderName(connectorName),
      }}
    >
      {children}
    </ConnectorContext.Provider>
  );
};

/** Utility to use the Connector context */
export const useConnector = () => {
  const context = React.useContext(ConnectorContext);
  if (!context) {
    throw new Error("This hook must be used inside a ConnectorProvider");
  }
  return context;
};
