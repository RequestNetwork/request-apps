import React from "react";
import { makeStyles, Typography, Box, Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useWeb3React } from "@web3-react/core";
import { Link as RouterLink } from "react-router-dom";
import { RStatusBadge, downloadPdf } from "request-ui";
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
    <Box padding="24px" paddingBottom={0}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Your request details</Typography>
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
        <Box>
          <Typography variant="h5">Date</Typography>
        </Box>
        <Box>
          {request ? (
            <Typography>
              <Moment format="YYYY/MM/DD">{request.createdDate}</Moment>
            </Typography>
          ) : (
            <Skeleton animation="wave" variant="text" width={50} />
          )}
        </Box>
      </Box>
      <Box className={classes.line}>
        <Box>
          <Typography variant="h5">Amount</Typography>
        </Box>
        <Box>
          {request ? (
            <Typography>
              {request.amount} {request.currency}
            </Typography>
          ) : (
            <Skeleton animation="wave" variant="text" width={50} />
          )}
        </Box>
      </Box>
      <Box className={classes.line}>
        <Box>
          <Typography variant="h5">From</Typography>
        </Box>
        <Box>
          {request ? (
            <Typography>{request.payee}</Typography>
          ) : (
            <Skeleton animation="wave" variant="text" width={200} />
          )}
        </Box>
      </Box>
      {(!request || request.payer) && (
        <Box className={classes.line}>
          <Box>
            <Typography variant="h5">To</Typography>
          </Box>
          <Box>
            {request ? (
              <Typography>{request.payer}</Typography>
            ) : (
              <Skeleton animation="wave" variant="text" width={200} />
            )}
          </Box>
        </Box>
      )}
      {(!request || request.reason) && (
        <Box className={classes.line}>
          <Box>
            <Typography variant="h5">Reason</Typography>
          </Box>
          <Box>
            {request ? (
              <Typography>{request.reason}</Typography>
            ) : (
              <Skeleton animation="wave" variant="text" width={150} />
            )}
          </Box>
        </Box>
      )}

      <Box className={classes.line}>
        <Box>
          <Typography variant="h5">Status</Typography>
        </Box>
        <Box>
          {request ? (
            <RStatusBadge status={request.status} className={classes.status} />
          ) : (
            <Skeleton animation="wave" variant="rect" width={75} height={24} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ActionsHeader = () => {
  return (
    <Box padding="24px" paddingBottom={0}>
      <Typography variant="subtitle1">Action</Typography>
    </Box>
  );
};

const Actions = ({
  request,
  pay,
  cancel,
  download,
  account,
}: {
  request?: IParsedRequest;
  pay: () => void;
  cancel: () => void;
  download: () => void;
  account?: string;
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
          <Skeleton animation="wave" variant="text" width={100} />
        </Box>
        <Box className={classes.line}>
          <Skeleton animation="wave" variant="text" width={100} />
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

  if (
    request.payer &&
    request.payer?.toLowerCase() === account?.toLowerCase()
  ) {
    return (
      <Box display="flex" flexDirection="column">
        <Box className={classes.line}>
          <Link className={classes.primaryLink} onClick={pay}>
            Pay now
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

  const pay = () => {
    alert("not implemented");
  };

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
    return <RequestNotFound />;
  }
  return (
    <>
      <Box flex={1} borderRight="1px solid #E8E7E6;">
        <Header />
        <Body request={request} />
      </Box>
      <Box flex={1}>
        <ActionsHeader />
        <Actions
          account={account || undefined}
          request={request}
          pay={pay}
          cancel={cancel}
          download={downloadReceipt}
        />
      </Box>
    </>
  );
};

export default () => {
  const { chainId } = useWeb3React();

  return (
    <RequestProvider chainId={chainId}>
      <RequestPage />
    </RequestProvider>
  );
};
