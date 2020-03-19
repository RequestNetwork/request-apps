import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { RContainer, RequestView, Spacer, RButton } from "request-ui";
import { IParsedRequest } from "request-shared";
import ShareRequest from "../components/ShareRequest";

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
  account: string;
}) => {
  const classes = useStyles();
  if (account === request.payee) {
    return (
      <RButton color="default" className={classes.cancel}>
        <Typography variant="h4">Cancel request</Typography>
      </RButton>
    );
  }
  if (account === request.payer) {
    return (
      <RButton color="default" className={classes.cancel}>
        <Typography variant="h4">>Decline request</Typography>
      </RButton>
    );
  }
  return <></>;
};

export default () => {
  const request: IParsedRequest = {
    payee: "brice.eth",
    timestamp: new Date(),
    status: "open",
    amount: 0.01,
    currency: "ETH",
    reason: "Morning croissants",
    requestId: "0xabcd",
    paymentAddress: "",
    raw: {} as any,
    currencyType: "ERC20" as any,
  };

  return (
    <RContainer>
      <Spacer size={15} />
      <RequestView
        payee={request.payee}
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
      <RequestActions request={request} account={request.payee} />
    </RContainer>
  );
};
