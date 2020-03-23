import { ethers } from "ethers";

const ensCache: Record<string, string | null> = {};

export const getEnsName = async (user: string | undefined) => {
  if (!user) return undefined;
  const provider = ethers.getDefaultProvider("mainnet");
  if (!ensCache[user]) {
    ensCache[user] = (await provider.lookupAddress(user)) || null;
  }
  return ensCache[user] || undefined;
};
