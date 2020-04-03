import { FormikHelpers } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { amountToString, createRequest } from "request-shared";

import { useWeb3React } from "@web3-react/core";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";
import { useRequestList } from "../contexts/RequestListContext";

export default () => {
  const history = useHistory();
  const [error, setError] = useState<string>();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { refresh } = useRequestList();

  const submit = async (
    values: IFormData,
    helpers: FormikHelpers<IFormData>
  ) => {
    if (!account || !chainId) {
      throw new Error("not connected");
    }
    try {
      const request = await createRequest(
        {
          amount: amountToString(values.amount!, values.currency!),
          contentData: {
            reason: values.reason,
          },
          currency: values.currency!,
          payer: values.payer,
          paymentAddress: account,
        },
        account,
        chainId
      );
      // await request.waitForConfirmation();
      history.push(`/${request.requestId}`);
      refresh();
    } catch (e) {
      console.log(e.message);
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
