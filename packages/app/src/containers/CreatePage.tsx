import { FormikHelpers } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { amountToString, createRequest } from "request-shared";
import { useErrorReporter } from "request-ui";

import { useWeb3React } from "@web3-react/core";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";

export default () => {
  const history = useHistory();
  const [error, setError] = useState<string>();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { report } = useErrorReporter();

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
            builderId: "request-team",
            createdWith: window.location.hostname,
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
    } catch (e) {
      if (
        e.code !== 4001 &&
        e.message !== "canceled" &&
        e.message !== "Sign message cancelled"
      ) {
        setError(e.message);
        report(e);
      }
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
