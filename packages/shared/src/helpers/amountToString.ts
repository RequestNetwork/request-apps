import { RequestLogicTypes } from "@requestnetwork/types";
import { Currency } from "@requestnetwork/request-client.js";
import { parseUnits } from "ethers/utils";

export const amountToString = (
  value: number,
  currency: RequestLogicTypes.ICurrency | string
): string => {
  if (typeof currency === "string") {
    currency = Currency.stringToCurrency(currency);
  }

  const base = Currency.getDecimalsForCurrency(currency);
  const amount = parseUnits(value.toString(), base).toString();
  return amount;
};
