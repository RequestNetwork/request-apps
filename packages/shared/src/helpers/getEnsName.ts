import { ethers } from "ethers";

const ensCache: Record<string, string | null> = {};

export const isValidEns = (val: string) =>
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?$/.test(
    val
  );

export const getAddressFromEns = async (ens: string) => {
  const provider = ethers.getDefaultProvider("mainnet");
  return await provider.resolveName(ens);
};

export const getEnsName = async (user: string | undefined) => {
  if (!user) return undefined;
  const provider = ethers.getDefaultProvider("mainnet");
  if (!ensCache[user]) {
    ensCache[user] = (await provider.lookupAddress(user)) || null;
  }
  return ensCache[user] || undefined;
};
