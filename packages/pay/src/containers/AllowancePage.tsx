import * as React from "react";
import { ethers } from "ethers";
import {
  getSupportedERC20Tokens,
  supportedRinkebyERC20,
} from "@requestnetwork/request-client.js/dist/api/currency/erc20";
import { ERC20Contract } from "@requestnetwork/payment-processor/dist/contracts/Erc20Contract";
import { erc20ProxyArtifact } from "@requestnetwork/smart-contracts";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "ethers/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { chainIdToName } from "request-shared";
import { Switch } from "@material-ui/core";

const supportedCurrencies: Record<number, string[]> = {
  1: ["DAI", "USDT", "USDC", "PAX", "BUSD", "TUSD", "ARIA20"],
  4: ["FAU", "CBTK"],
};

interface IErc20 {
  name: string;
  symbol: string;
  decimals: number;
  address?: string;
}

const getCurrencies = (chainId: number) => {
  if (chainId === 1) {
    const currencies = getSupportedERC20Tokens().reduce((prev, curr) => {
      prev[curr.symbol] = curr;
      return prev;
    }, {} as Record<string, IErc20>);

    currencies["BUSD"] = {
      name: "Binance USD",
      decimals: 18,
      symbol: "BUSD",
      address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
    };

    return (supportedCurrencies[chainId || 1] || [])
      .map(c => currencies[c])
      .filter(x => !!x);
  }

  if (chainId === 4) {
    console.log(supportedRinkebyERC20);
    return Array.from(supportedRinkebyERC20).map(([key, val]) => {
      return {
        decimals: 18,
        name: key,
        symbol: key,
        address: val.value,
      };
    });
  }
  return [];
};

export const ApprovalList = () => {
  const { account, library, chainId, activate } = useWeb3React<Web3Provider>();
  const [allowances, setAllowances] = React.useState<Record<string, boolean>>(
    {}
  );
  const [currencies, setCurrencies] = React.useState<IErc20[]>([]);

  React.useEffect(() => {
    activate(new InjectedConnector({ supportedChainIds: [1, 4] }));
  }, []);
  React.useEffect(() => {
    if (chainId) {
      setCurrencies(getCurrencies(chainId));
    }
  }, [chainId]);

  React.useEffect(() => {
    setAllowances({});
    if (!account) return;
    const promises = [];
    for (const erc20 of currencies) {
      const contract = ERC20Contract.connect(erc20.address!, library!);
      promises.push(
        contract
          .allowance(
            account,
            erc20ProxyArtifact.getAddress(chainIdToName(chainId!))
          )
          .then(allowance => {
            return {
              symbol: erc20.symbol,
              hasAllowance: allowance.gt(0),
            };
          })
      );
    }
    Promise.all(promises).then(results => {
      setAllowances(
        results.reduce((prev, curr) => {
          prev[curr.symbol] = curr.hasAllowance;
          return prev;
        }, {} as Record<string, boolean>)
      );
    });
  }, [account, currencies]);

  const toggle = async (symbol: string) => {
    const contract = ERC20Contract.connect(
      currencies.find(x => x.symbol === symbol)!.address!,
      library!.getSigner()
    );
    const newAllowance = allowances[symbol]
      ? 0
      : ethers.utils
          .bigNumberify(2)
          .pow(256)
          .sub(1);
    await contract.approve(
      erc20ProxyArtifact.getAddress(chainIdToName(chainId!)),
      newAllowance
    );

    setAllowances(allowances => {
      return {
        ...allowances,
        [symbol]: !allowances[symbol],
      };
    });
  };

  return (
    <table
      style={{
        width: "100%",
        padding: 50,
        textAlign: "center",
      }}
    >
      <thead>
        <tr>
          <th>Token</th>
          <th>Address</th>
          <th>Allowance</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {currencies.map(c => {
          return (
            <tr key={c.symbol}>
              <td>{c.symbol}</td>
              <td>
                <a
                  href={`https://${
                    chainId === 4 ? "rinkeby." : ""
                  }etherscan.io/token/${c.address}`}
                >
                  {c.address}
                </a>
              </td>
              <td>
                <Switch
                  checked={!!allowances[c.symbol]}
                  disabled={allowances[c.symbol] === undefined}
                  onChange={() => toggle(c.symbol)}
                />
              </td>
              <td></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AutoConnect = () => {
  return <></>;
};

export default () => {
  return (
    <Web3ReactProvider getLibrary={provider => new Web3Provider(provider)}>
      <AutoConnect />
      <ApprovalList />
    </Web3ReactProvider>
  );
};
