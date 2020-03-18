import React from 'react';
import Alert from '@material-ui/lab/Alert';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { makeStyles, Theme } from '@material-ui/core';

export type Severity = 'success' | 'info' | 'warning' | 'error';

const useStyles = makeStyles<Theme, { severity: Severity }>({
  alert: {
    backgroundColor: ({ severity }) => backgroundColors[severity],
    top: 0,
    left: 0,
    borderRadius: 0,
    width: '100%',
  },
});

const backgroundColors = {
  success: '#D6F3E2',
  info: '#D7E1FE',
  warning: '#FFE1BE',
  error: '#F9D3D4',
};

const iconMapping = {
  warning: <WarningRoundedIcon />,
  error: <ErrorRoundedIcon />,
  success: <CheckCircleRoundedIcon />,
  info: <InfoRoundedIcon />,
};

export const RAlert = ({
  severity,
  message,
}: {
  severity: Severity;
  message: string;
}) => {
  const classes = useStyles({ severity });
  return (
    <Alert
      severity={severity}
      iconMapping={iconMapping}
      color={severity}
      className={classes.alert}
    >
      {message}
    </Alert>
  );
};
