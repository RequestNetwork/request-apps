import * as React from "react";

import { usePayment, RequiresApprovalError } from "../contexts/PaymentContext";
import { useWeb3React } from "@web3-react/core";

import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { useConnector } from "../contexts/ConnectorContext";
import { Typography, Box } from "@material-ui/core";
import { Types } from "@requestnetwork/request-client.js";
import { getBtcPaymentUrl } from "@requestnetwork/payment-processor";
import { useMobile } from "request-ui";
import QRCode from "qrcode.react";
import RequestIconDark from "../assets/img/Request_icon_dark.svg";
import BtcIcon from "../assets/img/btc.png";
import MetamaskIcon from "../assets/img/metamask.png";

import { Spacer, RButton, RIcon } from "request-ui";
import { IParsedRequest, useRequest } from "request-shared";

const PayAction = ({
  disabled,
  pay,
  broadcasting,
  paying,
}: {
  broadcasting: boolean;
  paying: boolean;
  disabled: boolean;
  pay: () => void;
}) => {
  return (
    <RButton
      disabled={disabled}
      onClick={pay}
      color="primary"
      size="large"
      fullWidth
      startIcon={<RIcon variant={disabled ? "dark" : "light"} />}
      sticky
      loading={paying}
      direction="left"
    >
      <Typography variant="h5">Pay now</Typography>
    </RButton>
  );
};
const ApproveAction = ({ approve }: { approve: () => void }) => {
  return (
    <RButton sticky size="medium" onClick={approve} color="secondary" fullWidth>
      <Typography variant="caption">Approve</Typography>
    </RButton>
  );
};

const ConnectAction = ({
  activate,
  redirectMetamask,
  installMetamask,
}: {
  activate: () => void;
  redirectMetamask: () => void;
  installMetamask: () => void;
}) => {
  const web3 = "ethereum" in window;
  const mobile = useMobile();
  return (
    <RButton
      startIcon={<img src={MetamaskIcon} width={32} height={32} />}
      color="default"
      onClick={web3 ? activate : mobile ? redirectMetamask : installMetamask}
    >
      <Box color="text.primary">
        <Typography variant="h4">
          {web3
            ? "Pay with Metamask"
            : mobile
            ? "Open with Metamask"
            : "Install Metamask"}
        </Typography>
      </Box>
    </RButton>
  );
};

const ReceiptLink = (props: {
  request: IParsedRequest;
  counterCurrency: string;
  counterValue?: string;
}) => {
  return (
    <RButton
      // onClick={() => downloadPdf(props)}
      onClick={() => console.log("download")}
      startIcon={<ArrowDownward />}
      color="default"
    >
      <Box color="text.primary">
        <Typography variant="h5">Download PDF receipt</Typography>
      </Box>
    </RButton>
  );
};

const BtcPay = ({ url }: { url: string }) => {
  const mobile = useMobile();
  if (mobile)
    return (
      <RButton
        color="default"
        onClick={() => window.open(url, "_blank")?.focus()}
        startIcon={<img src={BtcIcon} width={16} height={16} />}
      >
        Pay
      </RButton>
    );
  return (
    <>
      <Typography variant="body2">Pay with a mobile wallet</Typography>
      <Spacer />
      <QRCode
        value={url}
        size={128}
        level={"H"}
        imageSettings={{
          src: RequestIconDark,
          width: 24,
          height: 24,
          excavate: true,
        }}
      />
    </>
  );
};

export default () => {
  const { request, counterValue, counterCurrency } = useRequest();
  const { active, error } = useWeb3React();
  const {
    error: paymentError,
    pay,
    ready: paymentReady,
    approve,
    paying,
    broadcasting,
  } = usePayment();
  const { activateConnector } = useConnector();

  if (!request) {
    return <></>;
  }

  if (
    request.status === "canceled" ||
    (request.status === "pending" && !paying)
  ) {
    return <></>;
  }

  if (request.status === "paid") {
    return (
      <ReceiptLink
        request={request}
        counterCurrency={counterCurrency}
        counterValue={counterValue}
      />
    );
  }

  if (request.currencyType === Types.RequestLogic.CURRENCY.BTC) {
    return <BtcPay url={getBtcPaymentUrl(request.raw)} />;
  }

  if (request.currencyType === Types.RequestLogic.CURRENCY.ISO4217) {
    return <></>;
  }

  if (!active) {
    return (
      <ConnectAction
        activate={() => activateConnector("injected")}
        redirectMetamask={() =>
          window.open(
            `https://metamask.app.link/dapp/${window.location.host +
              window.location.pathname}`
          )
        }
        installMetamask={() => window.open("http://metamask.io/")}
      />
    );
  }

  if (paymentError instanceof RequiresApprovalError) {
    return <ApproveAction approve={approve} />;
  }

  return (
    <PayAction
      pay={pay}
      paying={paying}
      broadcasting={broadcasting}
      disabled={!paymentReady || !!error || !!paymentError}
    />
  );
};
