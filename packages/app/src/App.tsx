import { Web3Provider } from "ethers/providers";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ErrorBoundary, theme, RAlert, useMobile, Analytics } from "request-ui";
import Intercom from "react-intercom";

import {
  CssBaseline,
  makeStyles,
  ThemeProvider,
  Link,
} from "@material-ui/core";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";

import { RequestAppBar } from "./components/AppBar";
import CreatePage from "./containers/CreatePage";
import ErrorPage from "./containers/ErrorPage";
import NotFoundPage from "./containers/NotFoundPage";
import RequestPage from "./containers/RequestPage";
import DashboardPage from "./containers/DashboardPage";
import { useEagerConnect } from "./hooks/useEagerConnect";
import { useInactiveListener } from "./hooks/useInactiveListnerer";
import { useConnectedUser, UserProvider } from "./contexts/UserContext";
import { injected } from "./connectors";
import { Announcement } from "./components/Announcement";

const useStyles = makeStyles(() => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "calc(100% - 80px)",
    maxWidth: "100vw",
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const tried = useEagerConnect();
  useInactiveListener(!tried);
  const { account, activate, chainId, error } = useWeb3React();
  const { name, loading } = useConnectedUser();
  const web3detected = !!window.ethereum;
  const isMetaMask = window.ethereum?.isMetaMask || false;
  const isMobile = useMobile();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Intercom
          appID="mmdbekc3"
          custom_launcher_selector="#intercom-trigger"
          hide_default_launcher={isMobile}
        />
        <CssBaseline />
        <RequestAppBar
          network={chainId}
          loading={loading}
          account={name || account}
          connect={() => activate(injected)}
          hasError={!!error}
        />
        <Announcement
          id="1million"
          message="🎉 $1,000,000 has been transacted through the Request network."
          link="https://request.network/en/2020/04/22/milestone-reached-launching-request-create-and-pay"
          linkText="Read more on our blog."
        />

        {web3detected && isMetaMask && isMobile && (
          <RAlert
            severity="warning"
            message="It looks like you are using Metamask mobile. Please be aware this app might not work properly for now."
          />
        )}
        {!web3detected && !isMobile && (
          <RAlert
            severity="warning"
            message={
              <>
                No compatible wallet detected. Please{" "}
                <Link
                  underline="always"
                  style={{
                    color: "#656565",
                  }}
                  target="_blank"
                  href="https://metamask.io/download.html"
                >
                  install Metamask
                </Link>
                .
              </>
            }
          />
        )}
        {!web3detected && isMobile && (
          <RAlert
            severity="warning"
            message={
              <>
                You need to open this page on an Ethereum wallet.{" "}
                <Link
                  underline="always"
                  style={{
                    color: "#656565",
                  }}
                  target="_blank"
                  href="https://go.cb-w.com/PIn9piAR45"
                >
                  Open with Coinbase Wallet
                </Link>
                .
              </>
            }
          />
        )}
        {web3detected && error && error.name === "UnsupportedChainIdError" && (
          <RAlert severity="error" message="Network not supported" />
        )}
        <div className={classes.paper}>
          <Analytics trackingId="UA-105153327-15">
            <Switch>
              <Route path="/" exact component={CreatePage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/:id([0-9a-fA-F]+)" component={RequestPage} />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </Analytics>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default () => {
  return (
    <ErrorBoundary
      stackdriverErrorReporterApiKey="AIzaSyBr5Ix9knr8FPzOmkB6QmcEs-E9fjReZj8"
      projectId="request-240714"
      service="RequestApp"
      component={ErrorPage}
    >
      <Web3ReactProvider getLibrary={provider => new Web3Provider(provider)}>
        <UserProvider>
          <App />
        </UserProvider>
      </Web3ReactProvider>
    </ErrorBoundary>
  );
};
