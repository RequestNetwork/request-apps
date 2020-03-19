import { RequestLogicTypes, ClientTypes } from "@requestnetwork/types";
export type RequestStatus = "paid" | "open" | "pending" | "canceled";

/** Formatted request */
export interface IParsedRequest {
  requestId: string;
  amount: number;
  currency: string;
  status: RequestStatus;
  timestamp: Date;
  paidDate?: Date;
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
}
