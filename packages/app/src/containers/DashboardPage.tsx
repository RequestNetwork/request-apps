import React, { useEffect, useState } from "react";
import { Spacer } from "request-ui";

import { Box, Hidden, makeStyles, Fab, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useWeb3React } from "@web3-react/core";

import CsvExport from "../components/CsvExport";
import { Filter } from "../components/Filter";
import RequestList from "../components/RequestList";
import { useRequestList } from "../contexts/RequestListContext";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: "white",
    maxWidth: 1150,
    width: "100%",
    maxWidth: 1150,
    padding: "0 16px",
    [theme.breakpoints.up("md")]: {
      backgroundColor: "unset",
      padding: "unset",
    },
    },
  },
}));

export default () => {
  const classes = useStyles();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { requests, filter, setFilter } = useRequestList();
  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setFirstLoad(false);
    }, 1000);
  }, [firstLoad]);

  useEffect(() => {
    setFirstLoad(true);
  }, [filter]);

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <Box className={classes.container}>
      <Spacer size={24} xs={5} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flex={1}>
          {["All", "Outstanding", "Paid"].map((f, index) => (
            <Filter
              key={index}
              name={f}
              select={() => setFilter(f.toLowerCase())}
              active={f.toLowerCase() === filter}
            />
          ))}
        </Box>
        <Hidden xsDown>
          <CsvExport requests={requests} />
        </Hidden>
      </Box>
      <RequestList
        requests={firstLoad ? requests?.slice(0, 15) : requests}
        account={account || undefined}
        loading={web3Loading}
      />
      <Spacer size={24} />
    </Box>
  );
};
