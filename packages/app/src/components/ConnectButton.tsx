import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { RButton } from "request-ui";
import classnames from "classnames";

const useStyles = makeStyles(theme => ({
  "@keyframes bounce": {
    "0%": {
      transform: "scale(1,1) translate(0px, 0px)",
    },

    "70%": {
      transform: "scale(1,1) translate(0px, 0px)",
    },
    "80%": {
      transform: "scale(1,0.8) translate(0px, 10px)",
    },

    "90%": {
      transform: "scale(1,1.1) translate(0px, -25px)",
    },

    "100%": {
      transform: "scale(1,1) translate(0px, 0px)",
    },
  },
  button: {
    width: 256,
    top: -2,
  },
  animated: {
    [theme.breakpoints.up("sm")]: {
      animation: "$bounce 3.75s infinite",

      "&:hover": {
        animation: "none",
      },
      "&:clicked": {
        animation: "none",
      },
    },
  },
}));

export default ({ connect }: { connect: () => Promise<void> }) => {
  const classes = useStyles();
  const [connecting, setConnecting] = useState(false);
  const click = () => {
    setConnecting(true);
    connect().finally(() => setConnecting(false));
  };
  return (
    <RButton
      color="secondary"
      onClick={click}
      loading={connecting}
      className={classnames(classes.button, {
        [classes.animated]: !connecting,
      })}
    >
      Connect a wallet
    </RButton>
  );
};
