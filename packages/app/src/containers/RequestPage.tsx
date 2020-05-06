import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Button,
  MenuItem,
  Menu,
  Divider,
  Box,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useWeb3React } from "@web3-react/core";
import {
  RContainer,
  RequestView,
  Spacer,
  RequestSkeleton,
  TestnetWarning,
  ReceiptLink,
  RSpinner,
} from "request-ui";
import {
  RequestProvider,
  useRequest,
  cancelRequest,
  isCancelError,
} from "request-shared";

import { ShareRequest } from "../components/ShareRequest";
import ErrorPage from "./ErrorPage";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";

const useStyles = makeStyles(() => ({
  cancel: {
    color: "#DE1C22",
  },
  menuList: {
    padding: 0,
  },
  menuPaper: {
    border: "1px solid #E4E4E4",
    marginTop: 38,
  },
  menuItem: {
    height: 48,
    justifyContent: "center",
  },
  actionButton: {
    position: "absolute",
    top: 0,
    right: 0,
    marginRight: -50,
    minWidth: 0,
    minHeight: 0,
    padding: 3,
  },
}));

export const RequestNotFound = () => {
  return (
    <ErrorPage
      topText="Your request has not been found, sorry!"
      bottomText="You might want to try again later"
    />
  );
};

export const RequestPage = () => {
  const classes = useStyles();

  const { account, chainId } = useWeb3React();
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement>();
  const [cancelling, setCancelling] = useState(false);

  const {
    request,
    loading,
    update,
    counterCurrency,
    counterValue,
  } = useRequest();

  useEffect(() => {
    setMenuOpen(false);
  }, [cancelling, shareOpen]);

  const cancel = async () => {
    setCancelling(true);
    if (!request || !account || !chainId) {
      throw new Error("cannot cancel because page is not ready");
    }
    try {
      await cancelRequest(request.requestId, account, chainId);
      await update();
    } catch (e) {
      if (isCancelError(e)) {
        setCancelling(false);
      } else {
        throw e;
      }
    }
    setCancelling(false);
  };

  if (loading) {
    return (
      <RContainer>
        <Spacer size={15} xs={8} />
        <RequestSkeleton />
      </RContainer>
    );
  }
  if (!request) {
    return <RequestNotFound />;
  }
  return (
    <RContainer>
      <Spacer size={15} xs={8} />
      {request && request.network !== "mainnet" && <TestnetWarning />}
      <Box position="relative" width="100%">
        <RequestView
          payee={request.payeeName || request.payee}
          createdDate={request.createdDate}
          paidDate={request.paidDate}
          canceledDate={request.canceledDate}
          status={request.status}
          amount={request.amount.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 5,
          })}
          overpaid={(request.balance - request.amount).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 5,
          })}
          currency={request.currency}
          reason={request.reason}
          counterValue={counterValue}
          counterCurrency={counterCurrency}
        />
        <Button
          variant="contained"
          color="default"
          className={classes.actionButton}
          onClick={e => {
            setMenuAnchor(e.currentTarget);
            setMenuOpen(true);
          }}
        >
          <MoreHorizIcon />
        </Button>
      </Box>
      <Menu
        anchorEl={menuAnchor}
        elevation={0}
        keepMounted
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        classes={{
          list: classes.menuList,
          paper: classes.menuPaper,
        }}
      >
        <MenuItem
          className={classes.menuItem}
          onClick={() => setShareOpen(true)}
        >
          <Typography variant="h4">Share request</Typography>
        </MenuItem>

        {request.status === "open" &&
          account &&
          [request.payer, request.payee].includes(account.toLowerCase()) && (
            <>
              <Divider />
              <MenuItem className={classes.menuItem} onClick={cancel}>
                <Typography className={classes.cancel} variant="h4">
                  Cancel request
                </Typography>
              </MenuItem>
            </>
          )}
      </Menu>
      <ShareRequest
        requestId={request.requestId}
        open={shareOpen}
        close={() => setShareOpen(false)}
      />

      <Spacer size={12} />
      {cancelling && <RSpinner />}
      {request.status === "paid" ||
        (request.status === "overpaid" && (
          <>
            <ReceiptLink
              request={request}
              counterValue={counterValue}
              counterCurrency={counterCurrency}
            />
            <Spacer size={11} />
          </>
        ))}
      <Spacer size={12} />
    </RContainer>
  );
};

export default () => {
  const { chainId, account } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <RequestProvider chainId={chainId}>
      <RequestPage />
    </RequestProvider>
  );
};
