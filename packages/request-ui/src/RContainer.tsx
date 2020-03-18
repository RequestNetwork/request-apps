import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      background: 'linear-gradient(-68deg,#FAFAFA 35%,#ffffff 0%)',
      [theme.breakpoints.up('sm')]: {
        background: '#FAFAFA',
      },
    },
  },
  container: {
    flex: 1,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 532,
    },
  },
}));
export const RContainer: React.FC = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.container}>{children}</Box>;
};
