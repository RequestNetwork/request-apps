import React from "react";

import { Box, Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { Link as RouterLink } from "react-router-dom";

import RequestList from "../components/RequestList";
import {
  useRequestList,
  RequestListProvider,
} from "../contexts/RequestListContext";
import { useConnectedUser } from "../contexts/UserContext";
import { useGnosisSafe } from "../contexts/GnosisSafeContext";
import NotLoggedPage from "./NotLoggedPage";

const Header = () => {
  return (
    <Box padding="24px" paddingBottom={0}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Your dashboard</Typography>
        <RouterLink to="/" style={{ color: "#008C73" }}>
          <Typography variant="caption">Create a new Request</Typography>
        </RouterLink>
      </Box>
    </Box>
  );
};

export const Dashboard = () => {
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { safeInfo } = useGnosisSafe();
  const { requests } = useRequestList();

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <Box flex={1} borderRight="1px solid #E8E7E6;">
      <Header />
      <Box padding="24px">
        <RequestList
          requests={requests}
          account={account || undefined}
          smartContractAddress={safeInfo?.safeAddress || undefined}
          loading={web3Loading}
        />
      </Box>
    </Box>
  );
};

export default () => {
  return (
    <RequestListProvider>
      <Dashboard />
    </RequestListProvider>
  );
};
