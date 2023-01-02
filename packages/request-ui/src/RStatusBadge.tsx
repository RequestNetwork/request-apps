import React from 'react';
import { makeStyles, Theme, Box, Typography } from '@material-ui/core';

import { colors, statusColors } from './colors';
import { RequestStatus } from 'request-shared';

interface IProps {
  status: RequestStatus;
  className?: string;
}

const useStyles = makeStyles<Theme, IProps>({
  status: {
    borderRadius: 3,
    padding: '8px 24px',
    backgroundColor: ({ status }) => statusColors[status],
    color: colors.statusText,
  },
});

export const statusLabels: Record<RequestStatus, string> = {
  open: 'Awaiting Payment',
  paid: 'Paid',
  pending: 'Pending',
  canceled: 'Canceled',
  overpaid: 'Overpaid',
  waiting: 'Waiting',
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
      <div
        className={[classes.status, props.className].join(' ')}
        title={
          props.status === 'waiting'
            ? `The request hasn't been indexed by IPFS yet. Please check back later`
            : ''
        }
      >
        <Typography variant="h6">{statusLabels[props.status]}</Typography>
      </div>
    </Box>
  );
};
