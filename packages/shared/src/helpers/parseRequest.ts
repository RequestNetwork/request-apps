import { ethers } from "ethers";
import { formatUnits, bigNumberify } from "ethers/utils";

import { Types } from "@requestnetwork/request-client.js";
import { IParsedRequest } from "../";
import { getEnsName } from "./getEnsName";
import { getDecimalsForCurrency, getCurrencySymbol } from "./currency";

/** Transforms a request to a more friendly format */
export const parseRequest = async ({
  requestId,
  data,
  network,
  pending,
  disableEns,
}: {
  requestId: string;
  data: Types.IRequestData;
  network: string;
  pending: boolean;
  disableEns?: boolean;
}): Promise<IParsedRequest> => {
  const decimals = await getDecimalsForCurrency(data.currencyInfo);
  const amount = Number(formatUnits(data.expectedAmount, decimals));

  const status =
    data.state === Types.RequestLogic.STATE.CANCELED
      ? "canceled"
      : bigNumberify(data.balance?.balance ?? 0).gte(
          bigNumberify(data.expectedAmount)
        )
      ? "paid"
      : pending
      ? "pending"
      : "open";

  const paidTimestamp = data.balance?.events.reverse()[0]?.timestamp;
  const canceledTimestamp = data.events.find(
    x => x.name === Types.RequestLogic.ACTION_NAME.CANCEL
  )?.timestamp;

  const extensionsValues = Object.values(data.extensions).find(
    x => x.type === "payment-network"
  )?.values;

  const provider = ethers.getDefaultProvider(
    data.currencyInfo.network === "rinkeby" ? "rinkeby" : "mainnet"
  );

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
    payeeName = await getEnsName(data.payee?.value);
    payerName = await getEnsName(data.payer?.value);
  }

  return {
    requestId,
    amount,
    currency:
      data.currency && data.currency !== "unknown"
        ? data.currency.split("-")[0]
        : await getCurrencySymbol(data.currencyInfo),
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
    currencyNetwork: data.currencyInfo.network,
    txHash: data.balance?.events[0]?.parameters?.txHash,
    payee: data.payee?.value?.toLowerCase() || "",
    payeeName,
    payer: data.payer?.value?.toLowerCase() || undefined,
    payerName,
    raw: data,
    network,
  };
};
