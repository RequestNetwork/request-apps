import React from 'react';
import { makeStyles, Theme, Box, Typography } from '@material-ui/core';

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
    </Box>
  );
};
