import { FormikHelpers } from "formik";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { amountToString, createRequest, isCancelError } from "request-shared";
import { useErrorReporter } from "request-ui";

import { useWeb3React } from "@web3-react/core";
import initSdk from "@gnosis.pm/safe-apps-sdk";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";

import { useGnosisSafe } from "../contexts/GnosisSafeContext";

export default () => {
  const { loading, name: ensSafeName, safeInfo } = useGnosisSafe();
  const history = useHistory();
  const [error, setError] = useState<string>();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading, name } = useConnectedUser();
  const { report } = useErrorReporter();

  const submit = async (
    values: IFormData,
    helpers: FormikHelpers<IFormData>
  ) => {
    if (!account || !chainId) {
      throw new Error("not connected");
    }
    if (!safeInfo?.safeAddress) {
      throw new Error("Safe not connected");
    }
    try {
      const request = await createRequest(
        {
          amount: await amountToString(values.amount!, values.currency!),
          contentData: {
            reason: values.reason,
            builderId: "request-team-gnosis-safe",
            createdWith: window.location.hostname,
          },
          currency: values.currency!,
          payer: values.payer,
          paymentAddress: safeInfo!.safeAddress,
          // add the safeAddress in the topics to link it to the gnosis multisig
          topics: [safeInfo!.safeAddress],
        },
        account,
        chainId
      );
      // await request.waitForConfirmation();
      history.push(`/${request.requestId}`);
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
      network={chainId}
      error={error}
      onSubmit={submit}
      loading={web3Loading}
    />
  );
};
