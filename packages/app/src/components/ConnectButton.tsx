import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Link,
  Box,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Spacer, RButton } from "request-ui";
import classnames from "classnames";
import MetamaskIcon from "../assets/img/metamask.png";
import { Spinner } from "./Spinner";

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
    width: "100%",
    top: -2,
    [theme.breakpoints.up("sm")]: {
      width: 256,
    },
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
  link: {
    color: "#00CC8E",
    textDecorationLine: "underline",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default ({ connect }: { connect: () => Promise<void> }) => {
  const classes = useStyles();
  const [connecting, setConnecting] = useState(false);
  const [open, setOpen] = useState(false);
  const click = () => {
    setConnecting(true);
    connect().finally(() => setConnecting(false));
  };

  useEffect(() => {
    if (connecting && !open) {
      setConnecting(false);
    }
  }, [open, connecting]);

  return (
    <>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle disableTypography>
          {connecting ? (
            <></>
          ) : (
            <Typography variant="subtitle1">Sign in</Typography>
          )}

          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {connecting ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
            >
              <Spinner style={{ width: 64, height: 64 }} />
              <Spacer size={8} />
              <Typography variant="body2">
                Please connect your MetaMask account...
              </Typography>
            </Box>
          ) : (
            <>
              <RButton color="default" fullWidth onClick={click}>
                <Box
                  display="flex"
                  flex={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <img src={MetamaskIcon} width={48} height={48} />
                  <Typography variant="caption">Metamask</Typography>
                  <Box width={48} />
                </Box>
              </RButton>
              <Spacer size={12} />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="caption">
                  Is your favorite wallet not supported?
                </Typography>
                <Link
                  href="https://share.hsforms.com/1SUDFJxJySliSedFiwifsfw2nz19"
                  className={classes.link}
                >
                  <Typography variant="caption">Let us know</Typography>
                </Link>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      <RButton
        color="secondary"
        onClick={() => setOpen(true)}
        disabled={open}
        className={classnames(classes.button, {
          [classes.animated]: !connecting,
        })}
      >
        Connect a wallet
      </RButton>
    </>
  );
};
