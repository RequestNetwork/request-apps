import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Typography,
  TextField,
  Box,
  Button,
} from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";

import { Spacer } from "request-ui";

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: 48,
  },
  inputBase: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: 48,
    "& fieldset": {
      border: "1px solid #E4E4E4",
      borderRight: 0,
    },
    "&:hover": {
      "& fieldset": {
        borderColor: "#E4E4E4 !important",
        borderWidth: "1px !important",
      },
    },
    "&:focused": {
      "& fieldset": {
        borderColor: "#E4E4E4 !important",
        borderWidth: "1px !important",
      },
    },
  },
  notchedOutline: {
    borderColor: "#E4E4E4 !important",
    borderWidth: "1px !important",
  },
  button: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 48,
    minHeight: 48,
    color: "white",
    border: 0,
    width: 119,
    minWidth: "unset",
  },
}));

export const getPayUrl = (requestId: string) =>
  window.location.hostname === "localhost"
    ? `http://localhost:3001/${requestId}`
    : window.location.hostname.startsWith("baguette")
    ? `https://baguette-pay.request.network/${requestId}`
    : `https://pay.request.network/${requestId}`;

export default ({ requestId }: { requestId: string }) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  const url = getPayUrl(requestId);
  return (
    <>
      <Typography variant="h5">Share Request</Typography>
      <Spacer size={3} />
      <Box display="flex" className={classes.wrapper}>
        <TextField
          variant="outlined"
          value={url}
          InputProps={{
            className: classes.inputBase,
            classes: {
              notchedOutline: classes.notchedOutline,
            },
          }}
        />
        <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            size="small"
          >
            {copied ? "COPIED!" : "COPY LINK"}
          </Button>
        </CopyToClipboard>
      </Box>
    </>
  );
};
