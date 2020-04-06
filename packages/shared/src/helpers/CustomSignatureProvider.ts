import Utils from "@requestnetwork/utils";
import { JsonRpcSigner } from "ethers/providers";
import {
  IdentityTypes,
  SignatureProviderTypes,
  SignatureTypes,
} from "@requestnetwork/types";

export class CustomSignatureProvider
  implements SignatureProviderTypes.ISignatureProvider {
  constructor(private signer: JsonRpcSigner) {}
  /** list of supported signing method */
  public supportedMethods: SignatureTypes.METHOD[] = [
    SignatureTypes.METHOD.ECDSA_ETHEREUM,
  ];
  /** list of supported identity types */
  public supportedIdentityTypes: IdentityTypes.TYPE[] = [
    IdentityTypes.TYPE.ETHEREUM_ADDRESS,
  ];
  public async sign(
    data: any,
    _signer: IdentityTypes.IIdentity
  ): Promise<SignatureTypes.ISignedData> {
    const normalizedData = Utils.crypto.normalize(data);
    const signatureValue = await this.signer.signMessage(normalizedData);
    return {
      data,
      signature: {
        method: SignatureTypes.METHOD.ECDSA_ETHEREUM,
        value: signatureValue,
      },
    };
  }
}
