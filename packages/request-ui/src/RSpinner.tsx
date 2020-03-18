import React from 'react';
import { Lottie } from '@crello/react-lottie';
import spinnerData from './assets/lottie/spinner.json';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  arrow: {
    [theme.breakpoints.up('sm')]: {
      borderRadius: 4,
    },
  },
}));

export const RSpinner = ({
  width = '80px',
  height = '80px',
  className,
}: {
  width?: string;
  height?: string;
  className?: string;
}) => {
  const classes = useStyles();

  return (
    <Lottie
      config={{
        animationData: spinnerData,
        rendererSettings: {
          className: classes.arrow,
        },
        loop: true,
      }}
      height={height}
      width={width}
      className={className}
    />
  );
};
