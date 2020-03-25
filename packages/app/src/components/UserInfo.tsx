import React from "react";
import Box from "@material-ui/core/Box";
import { RButton } from "request-ui";
import MetamaskIcon from "../assets/img/metamask.png";
import Dot from "./Dot";

export default ({ name, network }: { name: string; network?: number }) => {
  const displayName =
    name.length <= 20 ? name : `${name.slice(0, 10)}...${name.slice(-10)}`;

  const CombinedIcon = () => {
    return (
      <Box display="flex" alignItems="center">
        <Dot network={network} account={name} />
        <Box width={4} />
        <img src={MetamaskIcon} width={48} height={48} />
      </Box>
    );
  };
  return (
    <RButton
      color="default"
      startIcon={<CombinedIcon />}
      style={{
        paddingTop: "6px",
        paddingBottom: "6px",
      }}
    >
      {displayName}
    </RButton>
  );
};
