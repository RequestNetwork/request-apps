import React from "react";
import { Formik, FormikHelpers, useField, useFormikContext } from "formik";
import {
  makeStyles,
  Box,
  Typography,
  TextField,
  useTheme,
  MenuItem,
  Hidden,
  Tooltip,
  Button,
} from "@material-ui/core";
import Moment from "react-moment";
import * as Yup from "yup";
import { Skeleton } from "@material-ui/lab";
import WalletAddressValidator from "wallet-address-validator";
import { isValidEns, ENS, isSimpleAscii } from "request-shared";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import {
  RIcon,
  RContainer,
  Spacer,
  RButton,
  TestnetWarning,
  RAlert,
  currencies,
} from "request-ui";
import Dot from "./Dot";

export interface IFormData {
  amount?: number;
  payer?: string;
  currency?: string;
  reason?: string;
  paymentAddress?: string;
}

export interface IProps {
  error?: string;
  onSubmit: (
    values: IFormData,
    formikActions: FormikHelpers<IFormData>
  ) => void;
  account?: string;
  address?: string;
  network?: number;
  loading: boolean;
}

const useHeaderStyles = makeStyles(theme => ({
  container: {
    height: 124,
    width: "100%",
    padding: 32,
    borderBottom: "1px solid #E4E4E4",
    justifyContent: "space-between",
    display: "flex",
    boxShadow: "0px -4px 5px rgba(211, 214, 219, 0.5)",
    [theme.breakpoints.up("sm")]: {
      boxShadow: "none",
    },
  },
}));

const Header = ({
  account,
  address,
  network,
  loading,
}: {
  account?: string;
  address?: string;
  network?: number;
  loading: boolean;
}) => {
  const classes = useHeaderStyles({ account });
  const theme = useTheme();
  const displayName = account
    ? account.length <= 20
      ? account
      : `${account.slice(0, 10)}...${account.slice(-10)}`
    : undefined;
  return (
    <Box className={classes.container}>
      <RIcon width={56} height={60} />
      <Box width={20} />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Box textAlign="right" color="#656565">
          <Typography variant="body1">
            <Moment format="ll">{Date.now()}</Moment>
          </Typography>
        </Box>
        <Box color={theme.palette.common.black}>
          <Typography variant="h5">Your wallet</Typography>
        </Box>
        <Box height={8} />

        <Box color="#656565" display="flex" alignItems="center">
          {loading ? (
            <>
              <Skeleton
                animation="wave"
                variant="circle"
                height={18}
                width={18}
              />
              <Box width={8} />
              <Skeleton animation="wave" variant="text" width={200} />
            </>
          ) : (
            <>
              <Dot account={account} network={network} />
              <Box width={8} />
              <Tooltip title={address || ""}>
                <Typography variant="body2">
                  {displayName ? displayName : "no wallet connected"}
                </Typography>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const useBodyStyles = makeStyles(theme => ({
  container: {
    minHeight: 290,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    //justifyContent: "space-around",
    padding: "20px 32px",
  },
  field: {
    marginBottom: 8,
  },
  advancedButton: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  advancedButtonLabel: {
    color: theme.palette.common.black,
  },
}));

const Amount = ({ className }: { className?: string }) => {
  const [field, meta] = useField("amount");
  return (
    <TextField
      {...field}
      name="amount"
      label="Amount"
      className={className}
      type="number"
      fullWidth
      required
      error={Boolean(meta.error && (meta.touched || !!field.value))}
      helperText={
        Boolean(meta.error && (meta.touched || !!field.value))
          ? meta.error
          : " "
      }
    />
  );
};

const getCurrencies = (network?: number): Record<string, React.FC> => {
  if (network === 1) {
    return {
      DAI: currencies.DaiIcon,
      ETH: currencies.EthIcon,
      // USDT: UsdtIcon,
      USDC: currencies.UsdcIcon,
      PAX: currencies.PaxIcon,
      // BUSD: BusdIcon,
      TUSD: currencies.TusdIcon,
    };
  }
  return {
    FAU: currencies.DaiIcon,
    ETH: currencies.EthIcon,
  };
};

const Currency = ({
  className,
  currencies,
}: {
  className?: string;
  currencies: Record<string, React.FC>;
}) => {
  const [field, meta] = useField("currency");

  const CurrencyIcon = ({ text, icon: Icon }: any) => (
    <Box display="flex" alignItems="center">
      <Icon style={{ width: 18, height: 18, marginRight: 8 }} /> {text}
    </Box>
  );

  return (
    <TextField
      {...field}
      select
      label=" "
      fullWidth
      className={className}
      error={Boolean(meta.error)}
      helperText={Boolean(meta.error) ? meta.error : " "}
    >
      {Object.keys(currencies).map(currency => (
        <MenuItem key={currency} value={currency}>
          <CurrencyIcon text={currency} icon={currencies[currency]} />
        </MenuItem>
      ))}
    </TextField>
  );
};

const Payer = ({ className }: { className?: string }) => {
  const [field, meta] = useField("payer");

  return (
    <TextField
      {...field}
      label="Who are you sending this request to? (optional)"
      placeholder="Enter an ENS name or ETH address"
      className={className}
      fullWidth
      size="medium"
      error={Boolean(meta.error)}
      helperText={Boolean(meta.error) ? meta.error : " "}
    />
  );
};

const Reason = ({ className }: { className?: string }) => {
  const [field, meta] = useField("reason");

  return (
    <TextField
      {...field}
      label="Reason (optional, only non-confidential)"
      fullWidth
      className={className}
      error={Boolean(meta.error)}
      helperText={Boolean(meta.error) ? meta.error : " "}
    />
  );
};

const PaymentAddress = ({ className }: { className?: string }) => {
  const [field, meta] = useField("paymentAddress");

  return (
    <TextField
      {...field}
      label="Where do you want to receive the funds?"
      placeholder="Enter an ENS name or ETH address"
      fullWidth
      className={className}
      error={Boolean(meta.error)}
      helperText={Boolean(meta.error) ? meta.error : " "}
    />
  );
};

const Body = ({ currencies }: { currencies: Record<string, React.FC> }) => {
  const classes = useBodyStyles();
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  return (
    <Box className={classes.container}>
      <Box display="flex" flexDirection="row">
        <Box flex={0.8}>
          <Amount className={classes.field} />
        </Box>
        <Box flex={0.2}>
          <Currency className={classes.field} currencies={currencies} />
        </Box>
      </Box>

      <Payer className={classes.field} />
      <Reason className={classes.field} />
      <Box>
        <Button
          variant="text"
          className={classes.advancedButton}
          classes={{ label: classes.advancedButtonLabel }}
          onClick={() => setAdvancedOpen(!advancedOpen)}
        >
          {advancedOpen ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}{" "}
          <Typography variant="body1">Advanced</Typography>
        </Button>
        {advancedOpen && (
          <Box mt={2}>
            <PaymentAddress className={classes.field} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const Footer = ({ account }: { account?: string }) => {
  const { submitForm, isValid, values, isSubmitting } = useFormikContext<
    IFormData
  >();
  return (
    <>
      <Hidden xsDown>
        <Spacer size={12} />
      </Hidden>
      <Hidden smUp>
        <Box flex={1} />
      </Hidden>
      <RButton
        disabled={!values.amount || !isValid || !account}
        color="primary"
        fullWidth
        onClick={submitForm}
        loading={isSubmitting}
        direction="right"
        tabIndex={5}
        sticky
      >
        <Typography variant="h4">Create a request</Typography>
      </RButton>
    </>
  );
};

export const schema = Yup.object().shape<IFormData>({
  amount: Yup.number()
    .positive("Please enter a positive number")
    .typeError("Please enter a number")
    .required("Required"),
  payer: Yup.string().test(
    "is-valid-recipient",
    "Please enter a valid ENS or ETH address",
    async (value: string) => {
      return (
        !value ||
        WalletAddressValidator.validate(value, "ethereum") ||
        (isValidEns(value) && !!(await new ENS(value).addr()))
      );
    }
  ),
  currency: Yup.mixed().required("Required"),
  reason: Yup.string().test(
    "is-valid-reason",
    "Reason contains unsupported characters or symbols.",
    val => {
      return !val || isSimpleAscii(val);
    }
  ),
  paymentAddress: Yup.string().required("Required"),
});

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    background: "white",
    boxShadow: "0px 4px 5px rgba(211, 214, 219, 0.5)",
    [theme.breakpoints.up("sm")]: {
      borderRadius: 4,
    },
  },
}));

export const CreateRequestForm = ({
  error,
  onSubmit,
  account,
  address,
  network,
  loading,
}: IProps) => {
  const classes = useStyles();
  const currencies = getCurrencies(network);
  return (
    <RContainer>
      <Spacer size={15} xs={8} />

      {network && network !== 1 && <TestnetWarning />}
      <Formik<IFormData>
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize
        initialValues={{
          currency: !network || network === 1 ? "DAI" : "FAU",
          amount: "" as any,
          payer: "",
          reason: "",
          paymentAddress: account,
        }}
      >
        <>
          <Box className={classes.container}>
            <Header
              address={address}
              account={account}
              network={network}
              loading={loading}
            />
            <Body currencies={currencies} />
          </Box>
          {error && (
            <>
              <Spacer size={4} />
              <RAlert
                severity="error"
                message="Request creation has failed. Please try again later."
              />
            </>
          )}
          <Hidden smUp>
            <Box flex={1} />
          </Hidden>
          <Footer account={account} />
        </>
      </Formik>
    </RContainer>
  );
};
