import React from "react";
import { makeStyles, Container } from "@material-ui/core";
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

export default () => {
  const classes = useStyles();

  return (
    <RButton
      color="secondary"
      className={classnames(classes.button, classes.animated)}
    >
      Connect a wallet
    </RButton>
  );
};
