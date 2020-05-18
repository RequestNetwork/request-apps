import { RequestNetwork, Request } from "@requestnetwork/request-client.js";
import { IdentityTypes } from "@requestnetwork/types";
import { EventEmitter } from "events";
import { parseRequest } from "./parseRequest";
import { chainIdToName } from "./chainIdToName";
import { IParsedRequest } from "../";

interface IBalanceEvents {
  finished: () => void;
  update: (request: IParsedRequest) => void;
}

export class BalanceEventEmitter extends EventEmitter {
  private _untypedOn = this.on;
  private _untypedEmit = this.emit;
  public on = <K extends keyof IBalanceEvents>(
    event: K,
    listener: IBalanceEvents[K]
  ): this => this._untypedOn(event, listener);
  public emit = <K extends keyof IBalanceEvents>(
    event: K,
    ...args: Parameters<IBalanceEvents[K]>
  ): boolean => this._untypedEmit(event, ...args);
}

export const listRequests = async (
  account: string,
  network: string | number,
  isSmartContract: boolean = false
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

  if (isSmartContract) {
    // TODO @VRO
  }

  const list = [];
  for (const request of requests) {
    try {
      const parsedRequest = await parseRequest({
        requestId: request.requestId,
        data: request.getData(),
        network: network as string,
        pending: false,
        disableEns: true,
      });
      parsedRequest.loaded = false;
      list.push(parsedRequest);
    } catch (e) {
      console.log(`request ${request.requestId} could not be parsed: ${e}`);
    }
  }
  const sorted = list.sort(
    (a, b) => b.createdDate.getTime() - a.createdDate.getTime()
  );

  const emitter = new BalanceEventEmitter();

  return {
    // preloaded requests, without balance
    requests: sorted,
    // a function to start loading balances.
    // The callback is called for each updated balance.
    loadBalances: () =>
      loadBalances(requests, sorted, network as string, emitter),
    on: emitter.on,
  };
};

const loadBalances = async (
  requests: Request[],
  sortedRequests: IParsedRequest[],
  network: string,
  emitter: BalanceEventEmitter
) => {
  let i = 0;
  // update balances by batches of 10.
  while (i < sortedRequests.length) {
    const promises = [];
    for (let j = i; j < Math.min(i + 10, sortedRequests.length); j++) {
      const parsedRequest = sortedRequests[j];
      const request = requests.find(
        x => x.requestId === parsedRequest.requestId
      );
      if (!request) {
        continue;
      }
      const promise = loadBalance(request, network);
      promise.then(req => emitter.emit("update", req));
      promises.push(promise);
    }

    await Promise.all(promises);
    i += 10;
  }
  emitter.emit("finished");
};

const loadBalance = async (request: Request, network: string) => {
  await request.refreshBalance();
  const newParsedRequest = await parseRequest({
    requestId: request.requestId,
    data: request.getData(),
    network,
    pending: false,
  });
  newParsedRequest.loaded = true;
  return newParsedRequest;
};
