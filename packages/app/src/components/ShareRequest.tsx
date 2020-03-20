import React, { useEffect, useRef, useState } from "react";
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

export default ({ requestId }: { requestId: string }) => {
  const classes = useStyles();
  const ref = useRef<any>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  return (
    <>
      <Typography variant="h5">Share your request</Typography>
      <Spacer size={3} />
      <Box display="flex" className={classes.wrapper}>
        <TextField
          variant="outlined"
          value={`https://pay.request.network/${requestId}`}
          InputProps={{
            className: classes.inputBase,
            classes: {
              notchedOutline: classes.notchedOutline,
            },
          }}
        />
        <CopyToClipboard
          text={`https://pay.request.network/${requestId}`}
          onCopy={() => setCopied(true)}
        >
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
