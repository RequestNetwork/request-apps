import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { makeStyles, Theme, Box, Typography } from '@material-ui/core';
import { alertColors } from './colors';
import { AlertTitle } from '@material-ui/lab';

export type Severity = 'success' | 'info' | 'warning' | 'error';

const useStyles = makeStyles<Theme, { severity: Severity }>(() => ({
  alert: {
    backgroundColor: ({ severity }) => alertColors[severity],
    top: 0,
    left: 0,
    borderRadius: 0,
    width: '100%',
    padding: '8px 18px',
    display: 'flex',
    // alignItems: 'center',
  },
  message: {
    padding: '8px 0',
  },
  icon: {
    marginRight: 10,
    paddingTop: 4,
  },
  title: {
    marginBottom: 8,
  },
  action: {
    maxHeight: 32,
    paddingLeft: 0,
  },
}));

const iconMapping = {
  warning: <WarningRoundedIcon />,
  error: <ErrorRoundedIcon />,
  success: <CheckCircleRoundedIcon />,
  info: <InfoRoundedIcon style={{ color: '#2C5DE5' }} />,
};

export const RAlert = ({
  severity,
  message,
  title,
  actions,
}: {
  severity: Severity;
  message: string | JSX.Element;
  title?: string;
  actions?: JSX.Element;
}) => {
  const classes = useStyles({ severity });
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <>
      <Alert
        severity={severity}
        iconMapping={iconMapping}
        color={severity}
        className={classes.alert}
        classes={{
          icon: classes.icon,
          message: classes.message,
          action: classes.action,
        }}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box color="text.primary">
          {title && (
            <AlertTitle>
              <Typography variant="h5">{title}</Typography>
            </AlertTitle>
          )}
          <Typography variant="body2">{message}</Typography>
        </Box>
      </Alert>
      {actions && (
        <Alert
          className={classes.alert}
          icon={<></>}
          color={severity}
          style={{ marginTop: 1, justifyContent: 'center' }}
        >
          {actions}
        </Alert>
      )}
    </>
  );
};
