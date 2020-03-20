import React from "react";
import Box from "@material-ui/core/Box";
import { RButton } from "request-ui";
import MetamaskIcon from "../assets/img/metamask.png";

const CombinedIcon = () => {
  return (
    <Box display="flex" alignItems="center">
      <div
        style={{
          height: 18,
          width: 18,
          backgroundColor: "#00CC8E",
          borderRadius: "50%",
          display: "inline-block",
        }}
      />
      <Box width={4} />
      <img src={MetamaskIcon} width={32} height={32} />
    </Box>
  );
};

export default ({ name }: { name: string }) => {
  const displayName =
    name.length <= 20 ? name : `${name.slice(0, 10)}...${name.slice(-10)}`;

  return (
    <RButton color="default" startIcon={<CombinedIcon />}>
      {displayName}
    </RButton>
  );
};
