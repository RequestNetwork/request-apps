import React from "react";
import { colors, RSpinner } from "request-ui";

import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: colors.background,
    position: "absolute",
    top: 0,
    right: 0,
    width: "100vw",
    height: "100vh"
  },
  text: {
    color: "white",
    textAlign: "center",
    marginBottom: 60
  }
}));

export default ({ text }: { text?: string | JSX.Element }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {text ? <Typography className={classes.text}>{text}</Typography> : <p />}
      <RSpinner />
    </div>
  );
};
