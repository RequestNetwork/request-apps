import React from 'react';
import { makeStyles, Theme, Box, Tooltip, Typography } from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';

import { colors, statusColors } from './colors';
import { RequestStatus } from 'request-shared';

interface IProps {
  status: RequestStatus;
}

const useStyles = makeStyles<Theme, IProps>({
  status: {
    borderRadius: 3,
    padding: '8px 24px',
    backgroundColor: ({ status }) => statusColors[status],
    color: colors.statusText,
  },
});

const label = {
  open: 'Awaiting Payment',
  paid: 'Paid',
  pending: 'Pending',
  canceled: 'Canceled',
};

const useHelpStyles = makeStyles(theme => ({
  popper: {
    top: '5px !important',
    left: '-15px !important',
    width: 185,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: colors.border,
    boxSizing: 'border-box',
    color: 'rgba(0, 0, 0, 0.87)',
    position: 'relative',
    paddingBottom: 30,
    '&::after': {
      content: "''",
      position: 'absolute',
      top: 'calc(100% - 3px)',
      left: '20px',
      height: '7px',
      width: '7px',
      backgroundColor: theme.palette.common.white,
      transform: 'rotate(45deg)',
      borderBottom: 'inherit',
      borderRight: 'inherit',
    },
  },
  helpIcon: {
    marginLeft: 10,
    position: 'absolute',
    left: 95,
    color: colors.icon,
    fontSize: 20,
  },
}));

const HelpIcon = () => {
  const classes = useHelpStyles();
  return (
    <Tooltip
      title={
        <Typography variant="body1">
          Payment is processing but taking longer than expected. Please check
          back soon.
        </Typography>
      }
      classes={{
        tooltip: classes.tooltip,
        popper: classes.popper,
      }}
      placement="top-start"
    >
      <ContactSupportIcon className={classes.helpIcon} />
    </Tooltip>
  );
};

export const RStatusBadge = (props: IProps) => {
  const classes = useStyles(props);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      position="relative"
    >
      <div className={classes.status}>
        <Typography variant="h6">{label[props.status]}</Typography>
      </div>

      {props.status === 'pending' && <HelpIcon />}
    </Box>
  );
};
