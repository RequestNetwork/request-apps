import React from "react";
import { makeStyles, Box, Typography, Hidden } from "@material-ui/core";
import { IParsedRequest } from "request-shared";
import { Link } from "react-router-dom";
import { RStatusBadge, Spacer } from "request-ui";
import Moment from "react-moment";
import { Skeleton } from "@material-ui/lab";

const short = (val?: string) =>
  val
    ? val.length >= 20
      ? `${val.slice(0, 10)}...${val.slice(-10)}`
      : val
    : "";

const Amount = ({
  amount,
  currency,
  role,
}: {
  amount: number;
  currency: string;
  role?: "payee" | "payer";
}) => {
  return (
    <Box
      display="flex"
      color={role === "payee" ? "#008556" : role === "payer" ? "#DE1C22" : ""}
      flex={1}
      textAlign="right"
    >
      <Typography variant="h5">
        {role === "payer" ? <>-</> : <>+</>}&nbsp;
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}{" "}
        {currency}
      </Typography>
    </Box>
  );
};

const useStyles = makeStyles(theme => ({
  row: {
    display: "flex",
    flexDirection: "row",
    height: 176,
    padding: "20px 16px",
    margin: "20px 0 4px 0",
    width: "unset",
    backgroundColor: "white",
    boxShadow: "0px 4px 5px rgba(211, 214, 219, 0.8)",
    [theme.breakpoints.up("md")]: {
      borderBottom: "solid 1px #E4E4E4",
      margin: 0,
      padding: 0,
      height: 48,
      boxShadow: "none",
    },
  },
  rowInner: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    alignItems: "start",
    flex: 1,
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
  },
  status: {
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 0,
    },
  },
  viewButton: {
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 0,
      bottom: 0,
    },
  },
  amount: {
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      bottom: 0,
    },
  },
  payer: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: 8,
    },
  },
  payee: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: 24,
    },
  },
}));

const Row = React.memo(
  ({ request, account }: { request: IParsedRequest; account: string }) => {
    const classes = useStyles();
    const isPayee = account && account.toLowerCase() === request.payee;
    const isPayer = account && account.toLowerCase() === request.payer;
    return (
      <Box className={classes.row}>
        <Box className={classes.rowInner}>
          <Box flex={1 / 10}>
            <Spacer size={0} xs={1} />
            <Moment format="YYYY/MM/DD">{request.timestamp}</Moment>
          </Box>
          <Box flex={2 / 10} className={classes.payee}>
            <Box display="flex">
              <Hidden smUp>
                <Box width={40}>From:</Box>
              </Hidden>
              <Typography variant={isPayee ? "h5" : "body2"}>
                {short(request.payeeName || request.payee)}
              </Typography>
            </Box>
          </Box>
          <Box flex={2 / 10} className={classes.payer}>
            <Spacer size={0} xs={2} />
            <Box display="flex">
              <Hidden smUp>
                <Box width={40}>To:</Box>
              </Hidden>
              <Typography variant={isPayer ? "h5" : "body2"}>
                {short(request.payerName || request.payer)}
              </Typography>
            </Box>
          </Box>
          <Box flex={1 / 10} className={classes.amount}>
            <Amount
              amount={request.amount}
              currency={request.currency}
              role={isPayee ? "payee" : isPayer ? "payer" : undefined}
            />
          </Box>
          <Box flex={2 / 10} className={classes.status}>
            <RStatusBadge status={request.status} />
          </Box>
          <Box flex={1 / 10} className={classes.viewButton}>
            {request.status !== "open" || isPayee ? (
              <Link
                to={`/${request.requestId}`}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="h5" style={{ color: "#00CC8E" }}>
                  View request
                </Typography>
              </Link>
            ) : (
              <a
                href={`https://pay.request.network/${request.requestId}`}
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography variant="h5" style={{ color: "#00CC8E" }}>
                  Pay now
                </Typography>
              </a>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

const SkeletonRow = () => {
  const classes = useStyles();
  return (
    <Box className={classes.row}>
      <Box className={classes.rowInner}>
        <Box flex={1 / 10}>
          <Skeleton width={100} />
        </Box>
        <Box flex={2 / 10} className={classes.payee}>
          <Skeleton width={200} />
        </Box>
        <Box flex={2 / 10} className={classes.payer}>
          <Skeleton width={200} />
        </Box>
        <Box flex={1 / 10}>
          <Skeleton width={100} className={classes.amount} />
        </Box>
        <Box flex={2 / 10} className={classes.status}>
          <Skeleton variant="rect" height={32} width={100} />
        </Box>
        <Box flex={1 / 10} className={classes.viewButton}>
          <Skeleton width={100} />
        </Box>
      </Box>
    </Box>
  );
};

export default ({
  requests,
  account,
  loading,
}: {
  requests?: IParsedRequest[];
  account?: string;
  loading: boolean;
}) => {
  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <Hidden smDown>
        <Box
          display="flex"
          justifyContent="space-around"
          borderBottom="2px solid #050B20"
          alignItems="center"
          style={{ backgroundColor: "white" }}
          height={48}
        >
          <Box flex={1 / 10}>
            <Typography variant="h5">Date</Typography>
          </Box>
          <Box flex={2 / 10}>
            <Typography variant="h5">From</Typography>
          </Box>
          <Box flex={2 / 10}>
            <Typography variant="h5">To</Typography>
          </Box>
          <Box flex={1 / 10}>
            <Typography variant="h5">Amount</Typography>
          </Box>
          <Box flex={2 / 10}>
            <Typography variant="h5">Status</Typography>
          </Box>
          <Box flex={1 / 10}></Box>
        </Box>
      </Hidden>
      {loading || !requests || !account ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : (
        requests.map(request => (
          <Row key={request.requestId} request={request} account={account} />
        ))
      )}
    </Box>
  );
};
