import { RequestLogicTypes } from "@requestnetwork/types";
import { Currency } from "@requestnetwork/request-client.js";
import { parseUnits } from "ethers/utils";
import { getDefaultProvider, Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

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
  currency: RequestLogicTypes.ICurrency | string
): Promise<string> => {
  if (typeof currency === "string") {
    currency = Currency.stringToCurrency(currency);
  }

  const base = await getDecimalsForCurrency(currency);

  const amount = parseUnits(value.toString(), base).toString();
  return amount;
};
