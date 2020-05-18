import React, { useState } from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import { Spacer, RStatusBadge } from "request-ui";
import Moment from "react-moment";

import {
  IParsedRequest,
  RequestProvider,
  useRequest,
  cancelRequest,
  isCancelError,
} from "request-shared";

import ShareRequest from "../components/ShareRequest";
import ErrorPage from "./ErrorPage";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";

const useStyles = makeStyles(() => ({
  cancel: {
    color: "#DE1C22",
    border: "1px solid #E4E4E4",
  },
}));

export const RequestNotFound = () => {
  return (
    <ErrorPage
      topText="Your request has not been found, sorry!"
      bottomText="You might want to try again later"
    />
  );
};

const Header = () => {
  return (
    <Box padding="24px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">You request details</Typography>
        <Link to="/dashboard" style={{ color: "#001428" }}>
          <Typography variant="caption">Go to my dashboard</Typography>
        </Link>
      </Box>
    </Box>
  );
};

const useBodyStyles = makeStyles({
  line: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #E8E7E6",
    padding: "16px 24px",
    "&:last-child": {
      borderBottom: "none",
    },
  },
  title: {
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: "14px",
  },
  value: {
    fontSize: 12,
    lineHeight: "14px",
  },
  status: {
    padding: "4px 12px",
  },
});

const Body = ({ request }: { request: IParsedRequest }) => {
  const classes = useBodyStyles();
  return (
    <Box display="flex" flexDirection="column">
      <Box className={classes.line}>
        <Box className={classes.title}>Date</Box>
        <Box className={classes.value}>
          <Moment format="YYYY/MM/DD">{request.createdDate}</Moment>
        </Box>
      </Box>
      <Box className={classes.line}>
        <Box className={classes.title}>Amount</Box>
        <Box className={classes.value}>
          {request.amount} {request.currency}
        </Box>
      </Box>
      <Box className={classes.line}>
        <Box className={classes.title}>From</Box>
        <Box className={classes.value}>{request.payee}</Box>
      </Box>
      {request.payer && (
        <Box className={classes.line}>
          <Box className={classes.title}>To</Box>
          <Box className={classes.value}>{request.payer}</Box>
        </Box>
      )}
      {request.reason && (
        <Box className={classes.line}>
          <Box className={classes.title}>Reason</Box>
          <Box className={classes.value}>{request.reason}</Box>
        </Box>
      )}
      {request.status && (
        <Box className={classes.line}>
          <Box className={classes.title}>Status</Box>
          <Box className={classes.value}>
            <RStatusBadge status={request.status} className={classes.status} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const RequestPage = () => {
  const { account, chainId } = useWeb3React();

  const {
    request,
    loading,
    update,
    counterCurrency,
    counterValue,
  } = useRequest();

  const cancel = async () => {
    if (!request || !account || !chainId) {
      throw new Error("cannot cancel because page is not ready");
    }
    try {
      await cancelRequest(request.requestId, account, chainId);
    } catch (e) {
      if (!isCancelError(e)) {
      } else {
        throw e;
      }
    }
    await update();
  };

  if (loading || !request) {
    return null;
  }
  return (
    <>
      <Box flex={1}>
        <Header />
        <Body request={request} />
      </Box>
      <Box flex={1}></Box>
    </>
  );
};

export default () => {
  const { chainId, account } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <RequestProvider chainId={chainId}>
      <RequestPage />
    </RequestProvider>
  );
};
