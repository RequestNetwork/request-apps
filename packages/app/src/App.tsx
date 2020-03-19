import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ErrorBoundary, theme } from "request-ui";

import { CssBaseline, makeStyles, ThemeProvider } from "@material-ui/core";

import ErrorPage from "./containers/ErrorPage";
import NotFoundPage from "./containers/NotFoundPage";
import { RequestAppBar } from "./components/AppBar";
import CreatePage from "./containers/CreatePage";
import RequestPage from "./containers/RequestPage";

const useStyles = makeStyles(() => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100% - 80px)",
    maxWidth: "100vw",
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RequestAppBar />
        <div className={classes.paper}>
          <ErrorBoundary
            stackdriverErrorReporterApiKey="AIzaSyDhj4acOHHIsUsKyISqHv2j7Pqzdu0FjTk"
            projectId="request-240714"
            service="RequestPayments"
            component={ErrorPage}
          >
            <Switch>
              <Route path="/create" component={CreatePage} />
              <Route path="/:id([0-9a-fA-F]+)" component={RequestPage} />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
