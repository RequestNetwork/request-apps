import { RequestNetwork } from "@requestnetwork/request-client.js";
import { IdentityTypes } from "@requestnetwork/types";
import { parseRequest } from "./parseRequest";
import { chainIdToName } from "./chainIdToName";

export const listRequests = async (
  account: string,
  network: string | number
) => {
  network = chainIdToName(network);
  if (!account) {
    throw new Error("Not connected");
  }
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL:
        network === "rinkeby"
          ? "https://gateway-rinkeby.request.network/"
          : "https://gateway.request.network/",
    },
  });

  const requests = await requestNetwork.fromIdentity(
    {
      type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
      value: account,
    },
    undefined,
    {
      disablePaymentDetection: true,
    }
  );

  const list = [];
  for (const request of requests) {
    try {
      const parsedRequest = await parseRequest(
        request.requestId,
        request.getData(),
        network as string,
        false
      );
      list.push(parsedRequest);
    } catch (e) {
      console.log(`request ${request.requestId} could not be parsed: ${e}`);
    }
  }
  return list.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
};
