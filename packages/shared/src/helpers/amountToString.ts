import { RequestLogicTypes } from "@requestnetwork/types";
import { Currency } from "@requestnetwork/request-client.js";
import bn from "bignumber.js";

export const amountToString = (
  value: number,
  currency: RequestLogicTypes.ICurrency | string
): string => {
  if (typeof currency === "string") {
    currency = Currency.stringToCurrency(currency);
  }

  const base = Currency.getDecimalsForCurrency(currency);
  const amount = new bn(value)
    .multipliedBy(new bn(10).pow(new bn(base)))
    .toString();
  return amount;
};
