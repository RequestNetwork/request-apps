import { chainIdToName } from "./chainIdToName";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { IdentityTypes } from "@requestnetwork/types";
import { Web3Provider } from "ethers/providers";

import { CustomSignatureProvider } from "./CustomSignatureProvider";

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
    signatureProvider: new CustomSignatureProvider(
      new Web3Provider((window as any).ethereum).getSigner()
    ),
  });

  const request = await rn.fromRequestId(requestId);
  const cancellation = await request.cancel({
    type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
    value: account,
  });
  await new Promise((resolve) => cancellation.on("confirmed", () => resolve()));
};
