import React from "react";
import ErrorPage from "./ErrorPage";

export default () => {
  return (
    <ErrorPage
      topText="You are not logged in!"
      bottomText="Please connect a wallet to continue."
    />
  );
};
