import { RequestNetwork } from "@requestnetwork/request-client.js";
import { IdentityTypes } from "@requestnetwork/types";
import { parseRequest } from "./parseRequest";
import { chainIdToName } from "./chainIdToName";

export const listRequestsForSmartContract = async (
  smartContractAddress: string,
  network: string | number
) => {
  network = chainIdToName(network);
  if (!smartContractAddress) {
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

  const requestsToSmartContract = await requestNetwork.fromIdentity({
    // TODO CHANGE TO SMARTCONTRACT type
    type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
    value: smartContractAddress,
  });
  console.log({ requestsToSmartContract });
  // TODO remove after "quick win v2"
  const requestsFromSmartContract = await requestNetwork.fromTopic(
    smartContractAddress
  );
  console.log({ requestsFromSmartContract });

  // TODO probably remove duplicates
  const requests = requestsToSmartContract.concat(requestsFromSmartContract);

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
