import { RequestLogicTypes, ClientTypes } from "@requestnetwork/types";
export type RequestStatus = "paid" | "open" | "pending" | "canceled";

/** Formatted request */
export interface IParsedRequest {
  requestId: string;
  amount: number;
  currency: string;
  status: RequestStatus;
  createdDate: Date;
  paidDate?: Date;
  canceledDate?: Date;
  paymentAddress: string;
  paymentFrom?: string;
  invoiceNumber?: string;
  reason?: string;
  currencyType: RequestLogicTypes.CURRENCY;
  currencyNetwork?: string;
  txHash?: string;
  payee: string;
  payer?: string;
  payeeName?: string;
  payerName?: string;
  raw: ClientTypes.IRequestData;
  network: string;
  loaded?: boolean;
}

export * from "./contexts/RequestContext";
export * from "./hooks/useRate";
export * from "./helpers";
