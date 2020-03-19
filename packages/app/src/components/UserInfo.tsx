import React from "react";
import { makeStyles, Box } from "@material-ui/core";
import { RButton } from "request-ui";
import MetamaskIcon from "../assets/img/metamask.png";

const useStyles = makeStyles(theme => ({
  container: {},
}));

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
  const classes = useStyles();

  return (
    <RButton color="default" startIcon={<CombinedIcon />}>
      {name}
    </RButton>
  );
};
