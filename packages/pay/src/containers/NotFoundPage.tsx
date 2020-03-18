import * as React from "react";
import ErrorPage from "./ErrorPage";

export default () => {
  return (
    <ErrorPage
      topText="This page does not exist!"
      bottomText="Please double check your url."
    />
  );
};
