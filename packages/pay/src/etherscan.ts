import { IRequestData } from "@requestnetwork/request-client.js/dist/types";
import { IParsedRequest } from "request-shared";

const etherscanDomain: Record<string, string> = {
  rinkeby: "https://rinkeby.etherscan.io",
  mainnet: "https://etherscan.io",
};

export const getEtherscanUrl = (request?: IRequestData | IParsedRequest) => {
  if (!request) {
    return "";
  }
  if ("currencyInfo" in request) {
    return request?.currencyInfo?.network
      ? etherscanDomain[request.currencyInfo.network]
      : "";
  }
  return request.currencyNetwork
    ? etherscanDomain[request.currencyNetwork]
    : "";
};
