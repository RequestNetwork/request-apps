import React from 'react';
import { Box, Hidden, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  top: {
    background: 'linear-gradient(-26deg,#ffffff 50%,#FAFAFA 0%)',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      background: '#FAFAFA',
    },
  },
}));

export const Spacer = ({
  size = 1,
  top,
  xs,
}: {
  size?: number;
  xs?: number;
  top?: boolean;
}) => {
  const classes = useStyles();
  if (xs) {
    return (
      <>
        <Hidden xsDown>
          <Spacer size={size} top={top} />
        </Hidden>
        <Hidden smUp>
          <Spacer size={xs} top={top} />
        </Hidden>
      </>
    );
  }
  return <Box height={size * 4} className={top ? classes.top : ''} />;
};
