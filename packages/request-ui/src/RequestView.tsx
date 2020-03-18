import * as React from 'react';
import Moment from 'react-moment';

import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';

import { RequestStatus } from 'request-shared';

import { colors } from './colors';
import { Spacer } from './Spacer';
import { RStatusBadge } from './RStatusBadge';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    boxShadow:
      '0px -4px 5px rgba(211, 214, 219, 0.5), 0px 4px 5px rgba(211, 214, 219, 0.5)',
    textAlign: 'center',
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      boxShadow: '0px 4px 5px rgba(211, 214, 219, 0.5)',
      borderRadius: 4,
      boxSizing: 'border-box',
    },
    '& p': {
      width: '100%',
      overflowWrap: 'break-word',
    },
  },

  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingRight: 16,
    paddingLeft: 16,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 40,
      paddingLeft: 40,
    },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: colors.background,
    paddingTop: 32,
    paddingBottom: 40,
    borderTop: '1px solid',
    borderColor: colors.border,
  },
  footer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 40,
    paddingRight: 16,
    paddingLeft: 16,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 40,
      paddingLeft: 40,
    },
    borderTop: '1px solid',
    borderColor: colors.border,
  },
}));

interface IProps {
  payee: string;
  paidDate?: Date;
  createdDate: Date;
  status: RequestStatus;
  amount: string;
  currency: string;
  reason?: string;
  counterValue?: string;
  counterCurrency: string;
}

export const RequestView = ({
  payee,
  paidDate,
  createdDate,
  status,
  amount,
  currency,
  reason,
  counterValue,
  counterCurrency,
}: IProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.header} color="">
        <Typography variant="body2">Request for payment from</Typography>
        <Spacer />
        <Typography variant="caption">{payee}</Typography>
      </Box>
      <Box className={classes.body}>
        <Typography variant="body2">
          {paidDate ? (
            <>
              Paid on <Moment format="LL">{paidDate}</Moment>{' '}
            </>
          ) : (
            <>
              Created on <Moment format="LL">{createdDate}</Moment>{' '}
            </>
          )}
        </Typography>
        <Spacer size={4} />
        <RStatusBadge status={status} />
        <Spacer size={3} />
        <Typography variant="h3">
          {amount} {currency}
        </Typography>

        {counterValue && (
          <Typography variant="body2">
            {counterCurrency} {counterValue}
          </Typography>
        )}
      </Box>

      {reason && (
        <Box className={classes.footer}>
          <CommentIcon />
          <Spacer />
          <Typography variant="caption">{reason}</Typography>
        </Box>
      )}
    </Box>
  );
};
