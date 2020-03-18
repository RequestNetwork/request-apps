import React from 'react';
import RequestIconGreen from './assets/img/Request_icon_green.svg';
import RequestIconDark from './assets/img/Request_icon_dark.svg';

export const RIcon = ({
  width = 22,
  height = 22,
  disabled = false,
}: {
  width?: number;
  height?: number;
  disabled?: boolean;
}) => (
  <img
    alt=""
    width={width}
    height={height}
    src={disabled ? RequestIconDark : RequestIconGreen}
  />
);
