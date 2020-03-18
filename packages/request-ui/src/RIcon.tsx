import React from 'react';
import { SvgIcon, SvgIconProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  light1: {
    fill: '#008c62',
  },
  light2: {
    fill: '#00e6a0',
  },
  dark1: {
    fill: '#001912',
  },
  dark2: {
    fill: '#004422',
  },
}));

export const RIcon: React.FC<SvgIconProps & { disabled: boolean }> = ({
  disabled = false,
  ...props
}) => {
  const classes = useStyles();
  return (
    <SvgIcon {...props} viewBox="0 0 129.7 141.16">
      <g>
        <path
          className={disabled ? classes.dark1 : classes.light1}
          d="M87.65,79.31,123.07,44a14.07,14.07,0,0,0,4.14-10l.06-28.54a5.71,5.71,0,0,0-1.58-3.93L57.74,69.33a14.08,14.08,0,0,0,0,20l47.91,47.76a14.1,14.1,0,1,0,19.9-20Z"
        />
        <path
          className={disabled ? classes.dark2 : classes.light2}
          d="M121.73,0H15C6.37,0,0,6.52,0,15.42V126.77a14.17,14.17,0,0,0,14.36,14.35h0a14.11,14.11,0,0,0,14.35-14.35V27.47h71l26-25.87A5.45,5.45,0,0,0,121.73,0Z"
        />
      </g>
    </SvgIcon>
  );
};

RIcon.defaultProps = {
  disabled: false,
  width: 22,
  height: 22,
};
