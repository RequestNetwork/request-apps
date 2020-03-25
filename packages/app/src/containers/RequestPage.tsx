import React, { useState } from "react";
import { makeStyles, Typography, Box, ThemeProvider } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import {
  RContainer,
  RequestView,
  Spacer,
  RButton,
  RequestSkeleton,
  TestnetWarning,
} from "request-ui";
import {
  IParsedRequest,
  RequestProvider,
  useRequest,
  cancelRequest,
} from "request-shared";

import ShareRequest from "../components/ShareRequest";
import NotFoundPage from "./NotFoundPage";

const useStyles = makeStyles(theme => ({
  cancel: {
    color: "#DE1C22",
    border: "1px solid #E4E4E4",
  },
}));

const RequestActions = ({
  request,
  account,
  cancel,
}: {
  request: IParsedRequest;
  account?: string | null;
  cancel: () => Promise<void>;
}) => {
  const [cancelling, setCancelling] = useState(false);
  const onCancelClick = async () => {
    setCancelling(true);
    await cancel();
    setCancelling(false);
  };
  const classes = useStyles();
  account = account?.toLowerCase();
  if (
    request.status === "open" &&
    account &&
    [request.payer, request.payee].includes(account)
  ) {
    return (
      <RButton
        color="default"
        className={classes.cancel}
        onClick={onCancelClick}
        disabled={cancelling}
      >
        <Typography variant="h4">
          {request.payer === account ? "Decline request" : "Cancel request"}
        </Typography>
      </RButton>
    );
  }
  return <></>;
};

export const RequestPage = () => {
  const { account, chainId } = useWeb3React();

  const { request, loading, update } = useRequest();

  const cancel = async () => {
    if (!request || !account || !chainId) {
      throw new Error("cannot cancel because page is not ready");
    }
    try {
      await cancelRequest(request.requestId, account, chainId);
    } catch (e) {
      if (e.code === 4001) {
      } else {
        throw e;
      }
    }
    update();
  };

  if (loading) {
    return (
      <RContainer>
        <Spacer size={15} xs={8} />
        <RequestSkeleton />
      </RContainer>
    );
  }
  if (!request) {
    return <NotFoundPage />;
  }
  return (
    <RContainer>
      <Spacer size={15} xs={8} />
      {chainId !== 1 && <TestnetWarning />}
      <RequestView
        payee={request.payeeName || request.payee}
        createdDate={request.timestamp}
        status={request.status}
        amount={request.amount.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 5,
        })}
        currency={request.currency}
        reason={request.reason}
        counterValue={"USD"}
        counterCurrency={"2.04"}
      />
      <Spacer size={12} />
      <ShareRequest requestId={request.requestId} />
      <Spacer size={11} />
      <RequestActions request={request} account={account} cancel={cancel} />
      <Spacer size={12} />
    </RContainer>
  );
};

export default () => {
  return (
    <RequestProvider>
      <RequestPage />
    </RequestProvider>
  );
};
