import { ethers, Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { namehash } from "ethers/utils";
import WalletAddressValidator from "wallet-address-validator";

const ensCache: Record<string, string | null> = {};

abstract class EnsResolverContract extends Contract {
  private static abi = [
    "function text(bytes32 node, string key) view returns (string)",
    "function addr(bytes32 node) view returns (address)",
    "function name(bytes32 node) view returns (string)",
  ];
  public static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EnsResolverContract {
    return new Contract(
      address,
      EnsResolverContract.abi,
      signerOrProvider
    ) as EnsResolverContract;
  }
  public abstract text(node: string, key: string): Promise<string>;
  public abstract addr(node: string): Promise<string>;
  public abstract name(node: string): Promise<string>;
}

abstract class EnsRegistryContract extends Contract {
  private static abi = [
    "function resolver(bytes32 node) view returns (address)",
  ];
  public static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EnsRegistryContract {
    return new Contract(
      address,
      EnsRegistryContract.abi,
      signerOrProvider
    ) as EnsRegistryContract;
  }
  public abstract resolver(node: string): Promise<string>;
}

const getResolver = async (nodehash: string, provider?: Provider) => {
  if (!provider) {
    provider = ethers.getDefaultProvider("rinkeby");
  }
  const registryContract = EnsRegistryContract.connect(
    ENS.registryAddress,
    provider
  );
  const resolverContractAddress = await registryContract.resolver(nodehash);

  if (
    resolverContractAddress &&
    resolverContractAddress != "0x0000000000000000000000000000000000000000"
  ) {
    return EnsResolverContract.connect(resolverContractAddress, provider);
  }
  return undefined;
};

export class ENS {
  private resolver?: EnsResolverContract;
  private nodehash: string;
  public static registryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  static async resolve(address: string, provider?: Provider) {
    if (ensCache[address] === undefined) {
      const nodehash = namehash(address.substring(2) + ".addr.reverse");
      const resolver = await getResolver(nodehash, provider);
      if (resolver) {
        ensCache[address] = (await resolver.name(nodehash)) || null;
      } else {
        ensCache[address] = null;
      }
      console.log(`cache missed for ${address} => ${ensCache[address]}`);
    }
    return ensCache[address] || undefined;
  }

  static async fromAddress(address: string, provider?: Provider) {
    const name = await ENS.resolve(address, provider);
    return name ? new ENS(name, provider) : null;
  }

  constructor(public name: string, private provider?: Provider) {
    if (WalletAddressValidator.validate(name, "ethereum")) {
      throw new Error("ens should not be an ethereum address");
    }
    this.nodehash = namehash(name);
  }

  private async getResolver() {
    if (!this.resolver) {
      this.resolver = await getResolver(this.nodehash, this.provider);
    }
    return this.resolver;
  }

  async addr() {
    const resolver = await this.getResolver();
    if (!resolver) {
      return undefined;
    }
    return await resolver.addr(this.nodehash);
  }

  async text(key: string) {
    const resolver = await this.getResolver();
    if (!resolver) {
      return undefined;
    }
    return await resolver.text(this.nodehash, key);
  }
}

export const isValidEns = (val: string) =>
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?$/.test(
    val
  );
