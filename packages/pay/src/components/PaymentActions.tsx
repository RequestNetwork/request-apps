import * as React from "react";
import axios from "axios";

import { usePayment, RequiresApprovalError } from "../contexts/PaymentContext";
import { useWeb3React } from "@web3-react/core";

import { useConnector } from "../contexts/ConnectorContext";
import { Typography, Box } from "@material-ui/core";
import { Types } from "@requestnetwork/request-client.js";
import { getBtcPaymentUrl } from "@requestnetwork/payment-processor";
import {
  useMobile,
  ReceiptLink,
  Spacer,
  RButton,
  RIcon,
  RSpinner,
} from "request-ui";
import QRCode from "qrcode.react";
import RequestIconDark from "../assets/img/Request_icon_dark.svg";
import BtcIcon from "../assets/img/btc.png";
import MetamaskIcon from "../assets/img/metamask.png";
import CoinbaseIcon from "../assets/img/coinbase.png";
import { useRequest } from "request-shared";

import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWalletOutlined";

const PayAction = ({
  disabled,
  pay,
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
  mobileRedirect,
  installMetamask,
}: {
  activate: () => void;
  mobileRedirect: () => Promise<any>;
  installMetamask: () => void;
}) => {
  const web3 = "ethereum" in window;
  const [active, setActive] = React.useState(false);

  const mobileRedirectWrapper = async () => {
    setActive(true);
    await mobileRedirect();
    setActive(false);
  };
  const mobile = useMobile();
  return active ? (
    <RSpinner />
  ) : (
    <RButton
      startIcon={
        web3 ? (
          <AccountBalanceWallet />
        ) : (
          <img
            src={mobile ? CoinbaseIcon : MetamaskIcon}
            alt=""
            width={32}
            height={32}
          />
        )
      }
      color="default"
      onClick={
        web3 ? activate : mobile ? mobileRedirectWrapper : installMetamask
      }
    >
      <Box color="text.primary">
        <Typography variant="h4">
          {web3
            ? "Connect your wallet"
            : mobile
            ? "Open with Coinbase"
            : "Install Metamask"}
        </Typography>
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
        startIcon={<img src={BtcIcon} alt="" width={16} height={16} />}
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

const coinbaseShare = async (requestId: string) => {
  const { data } = await axios.get(
    `https://europe-west1-request-240714.cloudfunctions.net/coinbase-share?requestId=${requestId}`
  );
  return data || "https://go.cb-w.com/jHZvKzZ2H5";
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

  if (!active && !error) {
    return (
      <ConnectAction
        activate={() => activateConnector("injected")}
        mobileRedirect={() =>
          coinbaseShare(request.requestId).then(url => window.open(url))
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
