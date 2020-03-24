import React, { useEffect, useState } from "react";
import { IParsedRequest } from "request-shared";
import { Spacer } from "request-ui";

import { Box } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";

import CsvExport from "../components/CsvExport";
import { Filter } from "../components/Filter";
import RequestList from "../components/RequestList";
import { useRequestList } from "../contexts/RequestListContext";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";

const applyFilter = (
  requests: IParsedRequest[] | undefined,
  filter: string
) => {
  if (!requests) return undefined;
  if (filter === "all") return requests;
  if (filter === "outstanding")
    return requests.filter(x => x.status === "open");
  if (filter === "paid") return requests.filter(x => x.status === "paid");
};

export default () => {
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { requests } = useRequestList();
  const [filter, setFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState<IParsedRequest[]>();

  useEffect(() => {
    setFilteredRequests(applyFilter(requests, filter));
  }, [filter, requests]);

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <Box maxWidth={1150} width="100%">
      <Spacer size={24} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex">
          {["All", "Outstanding", "Paid"].map((f, index) => (
            <Filter
              key={index}
              name={f}
              select={() => setFilter(f.toLowerCase())}
              active={f.toLowerCase() === filter}
            />
          ))}
        </Box>
        <CsvExport requests={requests} />
      </Box>
      <RequestList
        requests={filteredRequests}
        account={account || undefined}
        loading={web3Loading}
      />
      <Spacer size={24} />
    </Box>
  );
};
