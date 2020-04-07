import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ErrorBoundary, theme } from "request-ui";

import { CssBaseline, makeStyles, ThemeProvider } from "@material-ui/core";

import DemoPage from "./containers/DemoPage";
import ErrorPage from "./containers/ErrorPage";
import NotFoundPage from "./containers/NotFoundPage";
import PaymentPage from "./containers/PaymentPage";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    maxWidth: "100vw",
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.paper}>
          <ErrorBoundary
            stackdriverErrorReporterApiKey="AIzaSyDhj4acOHHIsUsKyISqHv2j7Pqzdu0FjTk"
            projectId="request-240714"
            service="RequestPayments"
            component={ErrorPage}
          >
            <Switch>
              {/* There is no homepage. In Production, redirects to request website. */}
              {!window.location.host.startsWith("localhost") && (
                <Route
                  path="/"
                  exact
                  component={() => {
                    window.location.href = "https://request.network";
                    return null;
                  }}
                />
              )}
              {/* Old URL format */}
              <Redirect from="/pay/:id" to="/:id" />
              {/* Demo page, for tests only */}
              <Route path="/demo" component={DemoPage} />
              {/* Main Payment page */}
              <Route path="/:id([0-9a-fA-F]+)" component={PaymentPage} />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
