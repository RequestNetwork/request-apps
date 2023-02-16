import { FormikHelpers } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { isCancelError, useCreateRequest } from "request-shared";
import { useErrorReporter } from "request-ui";

import { useWeb3React } from "@web3-react/core";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";
import { ethers } from "ethers";
import { ExtensionTypes } from "@requestnetwork/types";
import { mintErc20TransferableReceivable } from "@requestnetwork/payment-processor";

const CreatePage = () => {
  const history = useHistory();
  const [error, setError] = useState<string>();
  const { account, chainId, library } = useWeb3React();
  const { loading: web3Loading, name } = useConnectedUser();
  const { report } = useErrorReporter();
  const createRequest = useCreateRequest();

  const submit = async (
    values: IFormData,
    helpers: FormikHelpers<IFormData>
  ) => {
    if (!account || !chainId) {
      throw new Error("not connected");
    }
    if (!values.amount) {
      throw new Error("amount not specified");
    }
    if (!values.currency) {
      throw new Error("currency not specified");
    }

    const provider = ethers.getDefaultProvider();
    if (!ethers.utils.isAddress(values.payer!)) {
      const addressFromEns = await provider.resolveName(values.payer!);
      if (!ethers.utils.isAddress(addressFromEns!)) {
        throw new Error("payer not valid");
      }
      values.payer = addressFromEns!;
    }
    if (!ethers.utils.isAddress(values.paymentAddress!)) {
      const paymentAddressFromEns = await provider.resolveName(
        values.paymentAddress!
      );
      if (!ethers.utils.isAddress(paymentAddressFromEns!)) {
        throw new Error("paymentAddress not valid");
      }
      values.paymentAddress = paymentAddressFromEns!;
    }

    try {
      const request = await createRequest(
        {
          amount: values.amount,
          contentData: {
            reason: values.reason,
            builderId: "request-team",
            createdWith: window.location.hostname,
          },
          currencyId: values.currency,
          payer: values.payer,
          paymentAddress: values.paymentAddress,
        },
        account,
        chainId
      );

      const data = request.getData();
      const paymentNetwork = Object.values(data.extensions).find(
        (x) => x.type === "payment-network"
      )?.id;

      if (
        paymentNetwork ===
        ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE
      ) {
        await request.waitForConfirmation();
        const mintTx = await mintErc20TransferableReceivable(data, library);
        await mintTx.wait(1);
        history.push(`/${request.requestId}`);
      } else {
        history.push(`/${request.requestId}`);
      }
    } catch (e) {
      if (!isCancelError(e)) {
        setError(e.message);
        report(e);
      }
    }
  };

  return (
    <CreateRequestForm
      account={name || account || undefined}
      address={account || undefined}
      network={chainId}
      error={error}
      onSubmit={submit}
      loading={web3Loading}
    />
  );
};

export default CreatePage;
