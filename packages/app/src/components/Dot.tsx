import React from "react";
import { makeStyles, Box, Theme, Tooltip } from "@material-ui/core";

interface IProps {
  account?: string;
  network?: number;
}

const dotColors: Record<number, string> = {
  1: "#038789",
  4: "#FFB95F",
};

const names: Record<number, string> = {
  1: "Main Ethereum network",
  4: "Rinkeby Test network",
};

const useStyles = makeStyles<Theme, IProps>(theme => ({
  dot: {
    height: 18,
    width: 18,
    backgroundColor: ({ account, network }) =>
      account && network ? dotColors[network] || "#DE1C22" : "#DE1C22",
    borderRadius: "50%",
    display: "inline-block",
  },
}));

export default (props: IProps) => {
  const classes = useStyles(props);

  return (
    <Tooltip title={names[props.network || -1] || "Unsupported network"}>
      <Box className={classes.dot} />
    </Tooltip>
  );
};
