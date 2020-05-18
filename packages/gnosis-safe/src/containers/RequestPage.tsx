import React, { useState } from "react";
import { makeStyles, Typography, Box, Button, Link } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { Link as RouterLink } from "react-router-dom";
import { Spacer, RStatusBadge, downloadPdf } from "request-ui";
import Moment from "react-moment";

import {
  IParsedRequest,
  RequestProvider,
  useRequest,
  cancelRequest,
  isCancelError,
} from "request-shared";
import { getPayUrl } from "../components/ShareRequest";
import { useClipboard } from "use-clipboard-copy";

import ErrorPage from "./ErrorPage";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";
import { Skeleton } from "@material-ui/lab";

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
        <RouterLink to="/dashboard" style={{ color: "#001428" }}>
          <Typography variant="caption">Go to my dashboard</Typography>
        </RouterLink>
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
  link: {
    fontSize: 12,
    lineHeight: "14px",
    textDecoration: "underline",
    color: "#001428",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryLink: {
    cursor: "pointer",
    fontSize: 12,
    lineHeight: "14px",
    color: "#008C73",
    textDecoration: "underline",
    fontWeight: 600,
  },
});

const Body = ({ request }: { request?: IParsedRequest }) => {
  const classes = useBodyStyles();
  return (
    <Box display="flex" flexDirection="column">
      <Box className={classes.line}>
        <Box className={classes.title}>Date</Box>
        <Box className={classes.value}>
          {request ? (
            <Moment format="YYYY/MM/DD">{request.createdDate}</Moment>
          ) : (
            <Skeleton animation="wave" variant="text" width={50} />
          )}
        </Box>
      </Box>
      <Box className={classes.line}>
        <Box className={classes.title}>Amount</Box>
        <Box className={classes.value}>
          {request ? (
            `${request.amount} ${request.currency}`
          ) : (
            <Skeleton animation="wave" variant="text" width={50} />
          )}
        </Box>
      </Box>
      <Box className={classes.line}>
        <Box className={classes.title}>From</Box>
        <Box className={classes.value}>
          {request ? (
            request.payee
          ) : (
            <Skeleton animation="wave" variant="text" width={200} />
          )}
        </Box>
      </Box>
      {(!request || request.payer) && (
        <Box className={classes.line}>
          <Box className={classes.title}>To</Box>
          <Box className={classes.value}>
            {request ? (
              request.payer
            ) : (
              <Skeleton animation="wave" variant="text" width={200} />
            )}
          </Box>
        </Box>
      )}
      {(!request || request.reason) && (
        <Box className={classes.line}>
          <Box className={classes.title}>Reason</Box>
          <Box className={classes.value}>
            {request ? (
              request.reason
            ) : (
              <Skeleton animation="wave" variant="text" width={150} />
            )}
          </Box>
        </Box>
      )}

      <Box className={classes.line}>
        <Box className={classes.title}>Status</Box>
        <Box className={classes.value}>
          {request ? (
            <RStatusBadge status={request.status} className={classes.status} />
          ) : (
            <Skeleton animation="wave" variant="rect" width={75} height={32} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ActionsHeader = () => {
  return (
    <Box padding="24px">
      <Typography variant="subtitle1">Action</Typography>
    </Box>
  );
};

const Actions = ({
  request,
  cancel,
  download,
}: {
  request?: IParsedRequest;
  cancel: () => void;
  download: () => void;
}) => {
  const { copied, copy } = useClipboard({
    copiedTimeout: 1000,
  });
  const classes = useBodyStyles();
  const share = () => {
    copy(getPayUrl(request!.requestId));
  };

  if (!request) {
    return (
      <Box display="flex" flexDirection="column">
        <Box className={classes.line}>
          <Skeleton
            style={{
              fontSize: 12,
              lineHeight: "14px",
            }}
            animation="wave"
            variant="text"
            width={100}
          />
        </Box>
        <Box className={classes.line}>
          <Skeleton
            style={{
              fontSize: 12,
              lineHeight: "14px",
            }}
            animation="wave"
            variant="text"
            width={100}
          />
        </Box>
      </Box>
    );
  }
  if (request.status === "canceled") {
    return (
      <Box className={classes.line}>
        No action to take here. This request has been canceled.
      </Box>
    );
  }
  if (request.status === "paid") {
    return (
      <Box display="flex" flexDirection="column">
        <Box className={classes.line}>
          <Link className={classes.primaryLink} onClick={download}>
            Download PDF receipt
          </Link>
        </Box>
        <Box className={classes.line}>
          <Link className={classes.link} onClick={share}>
            {copied ? "Copied!" : "Share this request"}
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box className={classes.line}>
        <Link className={classes.primaryLink} onClick={share}>
          {copied ? "Copied!" : "Copy link to share this request"}
        </Link>
      </Box>
      <Box className={classes.line}>
        <Link className={classes.link} onClick={cancel}>
          Cancel this request
        </Link>
      </Box>
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

  const downloadReceipt = () =>
    downloadPdf({ request: request!, counterCurrency, counterValue });

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

  if (!loading && !request) {
    return <Box>Your request has not been found, sorry!</Box>;
  }
  return (
    <>
      <Box flex={1} borderRight="1px solid #E8E7E6;">
        <Header />
        <Body request={request} />
      </Box>
      <Box flex={1}>
        <ActionsHeader />
        <Actions request={request} cancel={cancel} download={downloadReceipt} />
      </Box>
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
