import { utils, BigNumber } from "ethers";

import { Types } from "@requestnetwork/request-client.js";
import { ICurrencyManager } from "@requestnetwork/currency";
import { getDefaultProvider } from "@requestnetwork/payment-detection";

import { IParsedRequest } from "../";
import { ENS } from "./ens";

const getStatus = (
  state: Types.RequestLogic.STATE,
  expectedAmount: BigNumber,
  balance: BigNumber | undefined,
  pending: boolean
) => {
  if (!balance) return "unknown";
  if (state === Types.RequestLogic.STATE.CANCELED) return "canceled";

  if (balance?.eq(expectedAmount)) return "paid";
  if (balance?.gt(expectedAmount)) return "overpaid";
  if (pending) return "pending";
  return "open";
};

/** Transforms a request to a more friendly format */
export const parseRequest = async ({
  requestId,
  data,
  network,
  pending,
  disableEns,
  currencyManager,
}: {
  requestId: string;
  data: Types.IRequestData;
  network: string;
  pending: boolean;
  disableEns?: boolean;
  currencyManager: ICurrencyManager;
}): Promise<IParsedRequest> => {
  const currency = currencyManager.fromStorageCurrency(data.currencyInfo);
  if (!currency) {
    throw new Error("Currency not found");
  }
  if (currency.type === Types.RequestLogic.CURRENCY.ISO4217) {
    throw new Error("Unsupported currency");
  }
  const { decimals } = currency;
  const amount = Number(utils.formatUnits(data.expectedAmount, decimals));

  let balance = 0;
  if (data.balance?.balance !== null && data.balance?.balance !== undefined) {
    balance = Number(utils.formatUnits(data.balance.balance, decimals));
  }

  const status = getStatus(
    data.state,
    BigNumber.from(data.expectedAmount),
    data.balance?.balance ? BigNumber.from(data.balance.balance) : undefined,
    pending
  );

  const paidTimestamp = data.balance?.events.reverse()[0]?.timestamp;
  const canceledTimestamp = data.events.find(
    x => x.name === Types.RequestLogic.ACTION_NAME.CANCEL
  )?.timestamp;

  const extensionsValues = Object.values(data.extensions).find(
    x => x.type === "payment-network"
  )?.values;

  const provider = getDefaultProvider(currency.network);

  let paymentFrom;

  if (
    data.balance?.events?.length &&
    [
      Types.RequestLogic.CURRENCY.ERC20,
      Types.RequestLogic.CURRENCY.ETH,
    ].includes(data.currencyInfo.type)
  ) {
    const tx = await provider.getTransaction(
      data.balance.events[0].parameters.txHash
    );
    if (tx) {
      paymentFrom = tx.from;
    }
  }
  let payeeName, payerName;
  if (!disableEns) {
    // Try to get the payee ENS address
    payeeName = data.payee?.value
      ? await ENS.resolve(data.payee?.value)
      : undefined;
    payerName = data.payer?.value
      ? await ENS.resolve(data.payer?.value)
      : undefined;
  }

  return {
    requestId,
    amount,
    balance,
    currency,
    status,
    createdDate: new Date(data.timestamp * 1000),
    paidDate: paidTimestamp ? new Date(paidTimestamp * 1000) : undefined,
    canceledDate: canceledTimestamp
      ? new Date(canceledTimestamp * 1000)
      : undefined,
    paymentAddress: extensionsValues?.paymentAddress,
    paymentFrom,
    reason: data.contentData?.reason,
    invoiceNumber: data.contentData?.invoiceNumber,
    currencyType: data.currencyInfo.type,
    currencySymbol: currency.symbol,
    currencyNetwork: "network" in currency ? currency.network : "",
    txHash: data.balance?.events[0]?.parameters?.txHash,
    payee: data.payee?.value?.toLowerCase() || "",
    payeeName,
    payer: data.payer?.value?.toLowerCase() || undefined,
    payerName,
    raw: data,
    network,
  };
};
