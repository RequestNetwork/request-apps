import React from "react";
import Loading from "../components/Loading";
import NotLoggedPage from "./NotLoggedPage";
import { useWeb3React } from "@web3-react/core";
import { useConnectedUser } from "../contexts/UserContext";
import RequestList from "../components/RequestList";
import { Spacer } from "request-ui";
import { CSVLink } from "react-csv";
import { makeStyles, Box } from "@material-ui/core";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { useRequestList } from "../contexts/RequestListContext";

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

  if (web3Loading) {
    return <Loading />;
  }
  if (!account || !chainId) {
    return <NotLoggedPage />;
  }
  if (!requests) {
    return <Loading />;
  }
  return (
    <Box maxWidth={1150} width="100%">
      <Spacer size={24} />
      <Box display="flex" justifyContent="flex-end">
        <CSVLink
          data={requests.map(({ raw, ...request }) => request)}
          filename="requests.csv"
          className={classes.csv}
        >
          <ArrowDownward />
          Export in CSV
        </CSVLink>
      </Box>
      <Spacer size={5} />
      <RequestList requests={requests} account={account} />
      <Spacer size={24} />
    </Box>
  );
};
