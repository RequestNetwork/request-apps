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
} from "@material-ui/core";
import Moment from "react-moment";
import * as Yup from "yup";
import { Skeleton } from "@material-ui/lab";
import WalletAddressValidator from "wallet-address-validator";
import { isValidEns, getAddressFromEns } from "request-shared";

import {
  RIcon,
  RContainer,
  Spacer,
  RButton,
  TestnetWarning,
  RAlert,
} from "request-ui";
import Dot from "./Dot";
import { DaiIcon } from "./currencies/DaiIcon";
import { EthIcon } from "./currencies/EthIcon";

export interface IFormData {
  amount?: number;
  payer?: string;
  currency?: string;
  reason?: string;
}

export interface IProps {
  error?: string;
  onSubmit: (
    values: IFormData,
    formikActions: FormikHelpers<IFormData>
  ) => void;
  account?: string;
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
  network,
  loading,
}: {
  account?: string;
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
            <Moment format="MMM Do, YYYY">{Date.now()}</Moment>
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
              <Typography variant="body2">
                {displayName ? displayName : "no wallet connected"}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const useBodyStyles = makeStyles(theme => ({
  container: {
    height: 290,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    //justifyContent: "space-around",
    padding: "20px 32px",
  },
  field: {
    marginBottom: 8,
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
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
    />
  );
};

const Currency = ({ className }: { className?: string }) => {
  const [field, meta] = useField("currency");

  const CurrencyIcon = ({ text, icon: Icon }: any) => (
    <Box display="flex" alignItems="center">
      <Icon style={{ width: 18, height: 18, marginRight: 4 }} /> {text}
    </Box>
  );

  return (
    <TextField
      {...field}
      select
      name="currency"
      label=" "
      fullWidth
      className={className}
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
    >
      <MenuItem value="DAI">
        <CurrencyIcon text="DAI" icon={DaiIcon} />
      </MenuItem>
      <MenuItem value="ETH">
        <CurrencyIcon text="ETH" icon={EthIcon} />
      </MenuItem>
    </TextField>
  );
};

const Payer = ({ className }: { className?: string }) => {
  const [field, meta] = useField("payer");

  return (
    <TextField
      {...field}
      name="payer"
      label="Who are you sending this request to? (optional)"
      placeholder="Enter an ENS name or ETH address"
      className={className}
      fullWidth
      size="medium"
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
    />
  );
};

const Reason = ({ className }: { className?: string }) => {
  const [field, meta] = useField("reason");

  return (
    <TextField
      {...field}
      name="reason"
      label="Reason (optional)"
      fullWidth
      className={className}
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
    />
  );
};

const Body = () => {
  const classes = useBodyStyles();
  return (
    <Box className={classes.container}>
      <Box display="flex" flexDirection="row">
        <Box flex={0.8}>
          <Amount className={classes.field} />
        </Box>
        <Box flex={0.2}>
          <Currency className={classes.field} />
        </Box>
      </Box>

      <Payer className={classes.field} />
      <Reason className={classes.field} />
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
        (isValidEns(value) && !!(await getAddressFromEns(value)))
      );
    }
  ),
  currency: Yup.mixed().required("Required"),
  reason: Yup.string().test(
    "is-valid-reason",
    "Reason contains unsupported characters or symbols.",
    val => {
      return (
        !val ||
        val ===
          encodeURIComponent(val)
            .replace("%3A", ":")
            .replace("%2F", "/")
            .replace("%20", " ")
            .replace("%40", "@")
      );
    }
  ),
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
  network,
  loading,
}: IProps) => {
  const classes = useStyles();
  return (
    <RContainer>
      <Spacer size={15} xs={8} />

      {network && network !== 1 && <TestnetWarning />}
      <Formik<IFormData>
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          currency: "DAI",
          amount: "" as any,
          payer: "",
          reason: "",
        }}
      >
        <>
          <Box className={classes.container}>
            <Header account={account} network={network} loading={loading} />
            <Body />
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
