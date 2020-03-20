import { ethers } from "ethers";
import { formatUnits, bigNumberify } from "ethers/utils";

import { Utils, Types } from "@requestnetwork/request-client.js";
import { IParsedRequest } from "../";
import { getEnsName } from "./getEnsName";

/** Transforms a request to a more friendly format */
export const parseRequest = async (
  requestId: string,
  data: Types.IRequestData,
  pending: boolean
): Promise<IParsedRequest> => {
  const amount = Number(
    formatUnits(
      data.expectedAmount,
      Utils.getDecimalsForCurrency(data.currencyInfo)
    )
  );

  const status = pending
    ? "pending"
    : data.state === Types.RequestLogic.STATE.CANCELED
    ? "canceled"
    : bigNumberify(data.balance?.balance ?? 0).gte(
        bigNumberify(data.expectedAmount)
      )
    ? "paid"
    : "open";

  const paidTimestamp = data.balance?.events.reverse()[0]?.timestamp;

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
  // Try to get the payee ENS address
  const payeeName = await getEnsName(data.payee?.value);
  const payerName = await getEnsName(data.payer?.value);

  return {
    requestId,
    amount,
    currency: data.currency.split("-")[0],
    status,
    timestamp: new Date(data.timestamp * 1000),
    paidDate: paidTimestamp ? new Date(paidTimestamp * 1000) : undefined,
    paymentAddress: extensionsValues?.paymentAddress,
    paymentFrom,
    reason: data.contentData?.reason,
    invoiceNumber: data.contentData?.invoiceNumber,
    currencyType: data.currencyInfo.type,
    currencyNetwork: data.currencyInfo.network,
    txHash: data.balance?.events[0]?.parameters?.txHash,
    payee: data.payee?.value || "",
    payeeName,
    payer: data.payer?.value || undefined,
    payerName,
    raw: data,
  };
};
