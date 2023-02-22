import { Request } from "@requestnetwork/request-client.js";
import { IdentityTypes, RequestLogicTypes } from "@requestnetwork/types";
import { PAYMENT_NETWORK_ID } from "@requestnetwork/types/dist/extension-types";
import { CurrencyManager } from "@requestnetwork/currency";
import { getDefaultProvider, providers, utils, constants } from "ethers";
import WalletAddressValidator from "wallet-address-validator";

import { useCurrency } from "../contexts/CurrencyContext";
import { chainIdToName } from "./chainIdToName";
import { getRequestClient } from "./client";
import { CustomSignatureProvider } from "./CustomSignatureProvider";
import { ENS, isValidEns } from "./ens";

export interface ICreateRequestArgs {
  payer?: string;
  amount: number;
  currencyId: string;
  paymentAddress?: string;
  contentData: any;
  topics?: string[];
}

export const useCreateRequest = () => {
  const { currencyManager, currencyList } = useCurrency();

  const createRequest = async (
    {
      currencyId,
      amount,
      payer,
      paymentAddress,
      contentData,
      topics,
    }: ICreateRequestArgs,
    account: string,
    chainId: string | number
  ): Promise<Request> => {
    const win = window as any;
    if (!win.ethereum) {
      throw new Error("ethereum not detected");
    }
    const chainName = chainIdToName(chainId);

    let signatureProvider = new CustomSignatureProvider(
      new providers.Web3Provider((window as any).ethereum).getSigner()
    );
    if (!win.ethereum.isMetamask) {
      const {
        Web3SignatureProvider,
      } = require("@requestnetwork/web3-signature");
      signatureProvider = new Web3SignatureProvider(win.ethereum);
    }
    const requestNetwork = getRequestClient(
      chainName,
      signatureProvider,
      currencyList
    );

    const currency = currencyManager.fromId(currencyId)!;

    const isEth = currency.type === RequestLogicTypes.CURRENCY.ETH;
    const paymentNetwork: any = isEth
      ? {
          id: PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
          parameters: { paymentAddress },
        }
      : {
          id: PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE,
          parameters: {
            paymentAddress,
            feeAddress: constants.AddressZero,
            feeAmount: "0",
          },
        };

    if (payer) {
      if (isValidEns(payer)) {
        const provider = getDefaultProvider(
          chainName === "goerli" ? "goerli" : "mainnet"
        );
        payer = await new ENS(payer, provider).addr();
      } else if (!WalletAddressValidator.validate(payer, "ethereum")) {
        throw new Error("invalid ethereum address");
      }
    }

    const request = await requestNetwork.createRequest({
      requestInfo: {
        currency: CurrencyManager.toStorageCurrency(currency),
        expectedAmount: utils
          .parseUnits(amount.toString(), currency.decimals)
          .toString(),
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
      paymentNetwork,
      contentData,
      signer: {
        type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        value: account,
      },
      topics,
    });
    return request;
  };

  return createRequest;
};
