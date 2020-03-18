import { Web3Provider } from "ethers/providers";
import * as React from "react";

import { Box } from "@material-ui/core";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";

import {
  RAlert,
  RFooter,
  Spacer,
  RequestView,
  RSpinner,
  RContainer
} from "request-ui";

import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import PaymentActions from "../components/PaymentActions";
import { ConnectorProvider, useConnector } from "../contexts/ConnectorContext";
import {
  PaymentProvider,
  usePayment,
  RequiresApprovalError
} from "../contexts/PaymentContext";
import { RequestProvider, useRequest } from "../contexts/RequestContext";
import { usePrevious } from "../hooks/usePrevious";
import { useMobile } from "../hooks/useMobile";
import ErrorPage from "./ErrorPage";
import { ErrorMessage } from "../components/ErrorMessage";

export const RequestNotFound = () => {
  return (
    <ErrorPage
      topText="Your request has not been found, sorry!"
      bottomText="You might want to try again later"
    />
  );
};

export const ErrorContainer = () => {
  const mobile = useMobile();
  const { error } = usePayment();
  const { request } = useRequest();

  const requiresApproval = error instanceof RequiresApprovalError;
  const showErrorAtTop = !requiresApproval || mobile;

  if (!request) return null;
  if (request.status === "open" && error && showErrorAtTop) {
    return (
      <>
        <ErrorMessage error={error} request={request} />
        <Spacer size={4} />
      </>
    );
  }
  return <Spacer size={15} xs={5} />;
};

export const PaymentPage = () => {
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const { ready: connectorReady, connectorName } = useConnector();
  const {
    loading: requestLoading,
    request,
    counterCurrency,
    counterValue
  } = useRequest();
  const {
    paying,
    approving,
    error,
    broadcasting,
    ready: paymentReady
  } = usePayment();
  const prevStatus = usePrevious(request?.status);
  const mobile = useMobile();
  const { active } = useWeb3React();
  React.useEffect(() => {
    if (
      prevStatus &&
      prevStatus !== request?.status &&
      request?.status === "paid"
    ) {
      setFeedbackOpen(true);
    }
  }, [request?.status]);

  React.useEffect(() => {
    // this hook is to avoid flashing elements on screen.
    // handles only first load
    if (loaded) return;
    // request must be loaded
    if (requestLoading) return;
    // connector must be ready
    if (!connectorReady) return;
    // if connector is active, check if payment is ready
    if (active && paymentReady) setLoaded(true);
    // there can be a delay between connectorReady=true and active=true
    //  so wait 500ms to ensure the connector is not active.
    if (!active) {
      const t = setTimeout(() => setLoaded(true), 500);
      return () => clearTimeout(t);
    }
  }, [requestLoading, connectorReady, active, paymentReady, loaded]);

  if (!loaded) {
    return <Loading />;
  }

  if (!request) {
    return <RequestNotFound />;
  }
  if (!connectorReady) {
    return <Loading />;
  }

  const requiresApproval =
    request.status === "open" && error instanceof RequiresApprovalError;
  const activating = !active && !!connectorName;
  const stickToBottom =
    (mobile && active && request.status === "open") ||
    (request.status === "pending" && paying);
  const showSpinner = approving || activating;
  const showFooter =
    !mobile ||
    request.status === "paid" ||
    (request.status === "pending" && !paying);
  return (
    <RContainer>
      <Feedback open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <RequestView
        amount={request.amount.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 5
        })}
        createdDate={request.timestamp}
        currency={request.currency}
        payee={request.payeeName || request.payee}
        reason={request.reason}
        status={request.status}
        paidDate={request.paidDate}
        counterValue={counterValue}
        counterCurrency={counterCurrency}
      />

      {requiresApproval && !mobile ? (
        <>
          <Spacer size={12} />
          <RAlert
            severity="info"
            message="Please approve the contract using your connected wallet."
          />
          <Spacer size={5} />
        </>
      ) : (
        <Spacer size={15} xs={10} />
      )}
      {stickToBottom && <Box flex={1} />}
      {!showSpinner && <PaymentActions />}
      {showSpinner && (
        <Box
          display="flex"
          justifyContent="center"
          position="sticky"
          bottom={0}
          width="100%"
        >
          <RSpinner />
        </Box>
      )}
      {showFooter && (
        <>
          <Spacer size={15} />
          <RFooter />
        </>
      )}
    </RContainer>
  );
};

export default () => {
  return (
    <RequestProvider>
      <Web3ReactProvider getLibrary={provider => new Web3Provider(provider)}>
        <ConnectorProvider>
          <PaymentProvider>
            <ErrorContainer />
            <PaymentPage />
          </PaymentProvider>
        </ConnectorProvider>
      </Web3ReactProvider>
    </RequestProvider>
  );
};
