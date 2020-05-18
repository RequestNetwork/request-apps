import React from "react";
import { Formik, FormikHelpers, useField, useFormikContext } from "formik";
import {
  makeStyles,
  Box,
  Typography,
  TextField,
  MenuItem,
  Hidden,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import WalletAddressValidator from "wallet-address-validator";
import { isValidEns, getAddressFromEns } from "request-shared";

import { Spacer, RAlert } from "request-ui";
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

const Header = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Request a payment</Typography>
        <Link to="/dashboard" style={{ color: "#001428" }}>
          <Typography variant="caption">Go to my dashboard</Typography>
        </Link>
      </Box>
      <Spacer size={8} />
    </Box>
  );
};

const useBodyStyles = makeStyles(() => ({
  container: {
    // height: 290,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    //justifyContent: "space-around",
    // padding: "20px 32px",
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
      variant="filled"
      size="small"
      className={className}
      type="number"
      fullWidth
      required
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
      InputProps={{
        disableUnderline: true,
        style: {
          backgroundColor: "#F0EFEE",
          borderBottomLeftRadius: 4,
          borderTopRightRadius: 0,
        },
      }}
    />
  );
};

const useCurrencyStyles = makeStyles(() => ({
  select: {
    paddingTop: 14,
    paddingBottom: 11,
  },
}));

const Currency = ({ className }: { className?: string }) => {
  const [field, meta] = useField("currency");
  const classes = useCurrencyStyles();

  const CurrencyIcon = ({ text, icon: Icon }: any) => (
    <Box display="flex" alignItems="center" fontSize={12}>
      <Icon style={{ width: 18, height: 18, marginRight: 6 }} /> {text}
    </Box>
  );

  return (
    <TextField
      {...field}
      select
      name="currency"
      variant="filled"
      size="small"
      label=" "
      fullWidth
      className={className}
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
      InputProps={{
        disableUnderline: true,
        style: {
          backgroundColor: "#F0EFEE",
          borderBottomRightRadius: 4,
          borderTopLeftRadius: 0,
        },
      }}
      SelectProps={{
        IconComponent: props => (
          <ArrowDropDownRoundedIcon
            {...props}
            style={{ fontSize: 26, color: "#001428" }}
          />
        ),
        classes: {
          filled: classes.select,
        },
      }}
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
      variant="filled"
      size="small"
      label="Who are you sending this request to? (optional)"
      placeholder="Enter an ENS name or ETH address"
      className={className}
      fullWidth
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
      InputProps={{
        disableUnderline: true,
        style: {
          backgroundColor: "#F0EFEE",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        },
      }}
    />
  );
};

const Reason = ({ className }: { className?: string }) => {
  const [field, meta] = useField("reason");

  return (
    <TextField
      {...field}
      name="reason"
      variant="filled"
      size="small"
      label="Reason (optional)"
      fullWidth
      className={className}
      error={Boolean(meta.error && meta.touched)}
      helperText={Boolean(meta.error && meta.touched) ? meta.error : " "}
      InputProps={{
        disableUnderline: true,
        style: {
          backgroundColor: "#F0EFEE",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        },
      }}
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
  const { submitForm, isValid, values } = useFormikContext<IFormData>();
  return (
    <>
      <Button
        disabled={!values.amount || !isValid || !account}
        color="primary"
        variant="contained"
        style={{
          backgroundColor: "#008C73",
          color: "#FFFFFF",
          height: 40,
          fontSize: 12,
          lineHeight: "14px",
        }}
        fullWidth
        onClick={submitForm}
      >
        Create request
      </Button>
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
    [theme.breakpoints.up("sm")]: {
      borderRadius: 4,
    },
  },
}));

export const CreateRequestForm = ({ error, onSubmit, account }: IProps) => {
  const classes = useStyles();
  return (
    <>
      <Box flex={1} width={310}>
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
            <Box>
              <Box className={classes.container}>
                <Header />
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
            </Box>
          </>
        </Formik>
      </Box>
      <Box flex={1}></Box>
    </>
  );
};
