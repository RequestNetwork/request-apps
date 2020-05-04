import { RequestLogicTypes } from "@requestnetwork/types";
import { Currency } from "@requestnetwork/request-client.js";
import { parseUnits } from "ethers/utils";
import { getDefaultProvider, Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { chainIdToName } from "./chainIdToName";

abstract class ERC20Contract extends Contract {
  private static abi = [
    "function decimals() view returns (uint8)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  ];
  public static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20Contract {
    return new Contract(
      address,
      ERC20Contract.abi,
      signerOrProvider
    ) as ERC20Contract;
  }
  public abstract decimals(): Promise<number>;
  public abstract name(): Promise<string>;
  public abstract symbol(): Promise<string>;
}

const getErc20Contract = (
  currency: RequestLogicTypes.ICurrency
): ERC20Contract => {
  const contract = ERC20Contract.connect(
    currency.value,
    getDefaultProvider(currency.network)
  );
  return contract;
};

export const getDecimalsForCurrency = async (
  currency: RequestLogicTypes.ICurrency
) => {
  try {
    return Currency.getDecimalsForCurrency(currency);
  } catch (e) {
    if (currency.type === "ERC20") {
      return await getErc20Contract(currency).decimals();
    } else throw e;
  }
};

export const getCurrencySymbol = async (
  currency: RequestLogicTypes.ICurrency
) => {
  return await getErc20Contract(currency).symbol();
};

export const amountToString = async (
  value: number,
  currency: RequestLogicTypes.ICurrency
): Promise<string> => {
  const base = await getDecimalsForCurrency(currency);

  const amount = parseUnits(value.toString(), base).toString();
  return amount;
};

export const parseCurrency = (
  currency: string,
  network: string | number
): RequestLogicTypes.ICurrency => {
  network = chainIdToName(network);

  if (network === "rinkeby") {
    return Currency.stringToCurrency(`${currency}-rinkeby`);
  }
  if (network === "mainnet" && currency === "BUSD") {
    return {
      type: RequestLogicTypes.CURRENCY.ERC20,
      value: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      network: "mainnet",
    };
  }
  return Currency.stringToCurrency(currency);
};
