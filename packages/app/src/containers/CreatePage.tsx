import React from "react";
import { makeStyles, Container } from "@material-ui/core";
import { CreateRequestForm } from "../components/CreateRequest";

const useStyles = makeStyles(theme => ({
  container: {},
}));

export default () => {
  const classes = useStyles();

  return (
    <CreateRequestForm
      error=""
      onSubmit={(values, actions) => console.log(values)}
    />
  );
};
