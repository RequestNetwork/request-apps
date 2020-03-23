import React from "react";
import NotLoggedPage from "./NotLoggedPage";
import { useWeb3React } from "@web3-react/core";
import { useConnectedUser } from "../contexts/UserContext";
import RequestList from "../components/RequestList";
import { Spacer } from "request-ui";
import { CSVLink } from "react-csv";
import { makeStyles, Box } from "@material-ui/core";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { useRequestList } from "../contexts/RequestListContext";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  csv: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "20px",
    color: "#050B20",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default () => {
  const classes = useStyles();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { requests } = useRequestList();

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <Box maxWidth={1150} width="100%">
      <Spacer size={24} />
      <Box display="flex" justifyContent="flex-end">
        {web3Loading || !requests ? (
          <Skeleton width={117} height={24} />
        ) : (
          <CSVLink
            data={requests.map(({ raw, ...request }) => request)}
            filename="requests.csv"
            className={classes.csv}
          >
            <ArrowDownward />
            Export in CSV
          </CSVLink>
        )}
      </Box>
      <Spacer size={5} />
      <RequestList
        requests={requests}
        account={account || undefined}
        loading={web3Loading}
      />
      <Spacer size={24} />
    </Box>
  );
};
