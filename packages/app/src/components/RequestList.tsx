import React from "react";
import { makeStyles, Container, Box, Typography } from "@material-ui/core";
import { IParsedRequest } from "request-shared";
import { Link } from "react-router-dom";
import { RStatusBadge } from "request-ui";
import Moment from "react-moment";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  container: {},
}));

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
      color={role === "payee" ? "#00cc8e" : role === "payer" ? "#ce2e2e" : ""}
      flex={1}
      textAlign="right"
    >
      {role === "payer" ? <>-</> : <>&nbsp;</>}&nbsp;
      {amount.toLocaleString("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}{" "}
      {currency}
    </Box>
  );
};

const Row = React.memo(
  ({ request, account }: { request: IParsedRequest; account: string }) => {
    const isPayee = account && account.toLowerCase() === request.payee;
    const isPayer = account && account.toLowerCase() === request.payer;
    return (
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        height={48}
      >
        <Box flex={1 / 10}>
          <Moment format="YYYY/MM/DD">{request.timestamp}</Moment>
        </Box>
        <Box flex={2 / 10}>
          <Typography variant={isPayee ? "h5" : "body2"}>
            {short(request.payeeName || request.payee)}
          </Typography>
        </Box>
        <Box flex={2 / 10}>
          <Typography variant={isPayer ? "h5" : "body2"}>
            {short(request.payerName || request.payer)}
          </Typography>
        </Box>
        <Box flex={1 / 10} display="flex">
          <Amount
            amount={request.amount}
            currency={request.currency}
            role={isPayee ? "payee" : isPayer ? "payer" : undefined}
          />
        </Box>
        <Box flex={2 / 10}>
          <RStatusBadge status={request.status} />
        </Box>
        <Box flex={1 / 10}>
          <Link to={`/${request.requestId}`} style={{ textDecoration: "none" }}>
            <Typography variant="h5" style={{ color: "#00CC8E" }}>
              View request
            </Typography>
          </Link>
        </Box>
      </Box>
    );
  }
);

const SkeletonRow = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      height={48}
    >
      <Box flex={1 / 10}>
        <Skeleton width={100} />
      </Box>
      <Box flex={2 / 10}>
        <Skeleton width={200} />
      </Box>
      <Box flex={2 / 10}>
        <Skeleton width={200} />
      </Box>
      <Box flex={1 / 10}>
        <Skeleton width={100} />
      </Box>
      <Box flex={2 / 10}>
        <Skeleton variant="rect" height={32} width={100} />
      </Box>
      <Box flex={1 / 10}>
        <Skeleton width={100} />
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
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      style={{ backgroundColor: "white" }}
    >
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        height={48}
        style={{
          borderBottom: "2px solid #050B20",
        }}
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
