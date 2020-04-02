import { chainIdToName } from "./chainIdToName";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { IdentityTypes } from "@requestnetwork/types";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export const cancelRequest = async (
  requestId: string,
  account: string,
  network: string | number
) => {
  network = chainIdToName(network);
  const rn = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL:
        network === "rinkeby"
          ? "https://gateway-rinkeby.request.network"
          : "https://gateway.request.network",
    },
    signatureProvider: new Web3SignatureProvider((window as any).ethereum),
  });

  const request = await rn.fromRequestId(requestId);
  await request.cancel({
    type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
    value: account,
  });
};
