import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { RContainer, RequestView, Spacer, RButton } from "request-ui";
import { IParsedRequest, RequestProvider, useRequest } from "request-shared";

import ShareRequest from "../components/ShareRequest";
import Loading from "../components/Loading";
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
}: {
  request: IParsedRequest;
  account?: string | null;
}) => {
  const classes = useStyles();
  if (account && account === request.payee) {
    return (
      <RButton color="default" className={classes.cancel}>
        <Typography variant="h4">Cancel request</Typography>
      </RButton>
    );
  }
  if (account && account === request.payer) {
    return (
      <RButton color="default" className={classes.cancel}>
        <Typography variant="h4">Decline request</Typography>
      </RButton>
    );
  }
  return <></>;
};

export const RequestPage = () => {
  const { account } = useWeb3React();

  const { request, loading } = useRequest();
  if (loading) {
    return <Loading />;
  }
  if (!request) {
    return <NotFoundPage />;
  }
  return (
    <RContainer>
      <Spacer size={15} />
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
      <RequestActions request={request} account={account} />
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
