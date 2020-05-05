import React from "react";
import { makeStyles, Box, Theme, Tooltip } from "@material-ui/core";

interface IProps {
  account?: string;
  network?: number;
  size?: number;
}

const dotColors: Record<number, string> = {
  1: "#038789",
  4: "#FFB95F",
};

const names: Record<number, string> = {
  1: "Main Ethereum Network",
  4: "Rinkeby Test Network",
};

const useStyles = makeStyles<Theme, IProps>(theme => ({
  dot: {
    height: ({ size }) => size ?? 18,
    width: ({ size }) => size ?? 18,
    backgroundColor: ({ account, network }) =>
      account && network ? dotColors[network] || "#DE1C22" : "#DE1C22",
    borderRadius: "50%",
    display: "inline-block",
  },
}));

export default (props: IProps) => {
  const classes = useStyles(props);

  const title = props.network
    ? names[props.network] || "Unsupported network"
    : "";

  return (
    <Tooltip title={title}>
      <Box className={classes.dot} />
    </Tooltip>
  );
};
