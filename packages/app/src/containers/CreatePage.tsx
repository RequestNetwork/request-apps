import { FormikHelpers } from "formik";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { amountToString, createRequest } from "request-shared";

import { IdentityTypes, PaymentTypes } from "@requestnetwork/types";
import { useWeb3React } from "@web3-react/core";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";

export default () => {
  const history = useHistory();
  const [error, setError] = useState<string>();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();

  const submit = async (
    values: IFormData,
    helpers: FormikHelpers<IFormData>
  ) => {
    if (!account || !chainId) {
      throw new Error("not connected");
    }
    try {
      const paymentNetworkType =
        values.currency!.split("-")[0] === "ETH"
          ? PaymentTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA
          : PaymentTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT;
      const request = await createRequest(
        {
          amount: amountToString(values.amount!, values.currency!),
          contentData: {
            reason: values.reason,
          },
          currency: values.currency!,
          payer: values.payer
            ? {
                type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                value: values.payer,
              }
            : undefined,
          paymentNetwork: {
            id: paymentNetworkType,
            parameters: {
              paymentAddress: account, // TODO
            },
          },
        },
        account,
        chainId
      );
      // await request.waitForConfirmation();
      history.push(`/${request.requestId}`);
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <CreateRequestForm
      account={account || undefined}
      network={chainId}
      error={error}
      onSubmit={submit}
      loading={web3Loading}
    />
  );
};
