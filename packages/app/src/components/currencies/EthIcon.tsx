import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

export const EthIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon viewBox="0 0 1920 1920" {...props}>
      <circle cx="961" cy="960" fill="#151c2f" r="953.1" />
      <path d="m959.9 209.9-419.9 764 419.9-209.3z" fill="#8a92b2" />
      <path d="m959.9 764.7-419.9 209.2 419.9 272.2z" fill="#62688f" />
      <path d="m1379.8 973.9-419.9-764v554.7z" fill="#62688f" />
      <path d="m959.9 1246.1 419.9-272.2-419.9-209.2z" fill="#454a75" />
      <path d="m540 1061.3 419.9 648.8v-376.8z" fill="#8a92b2" />
      <path d="m959.9 1333.3v376.8l420.1-648.8z" fill="#62688f" />
    </SvgIcon>
  );
};
