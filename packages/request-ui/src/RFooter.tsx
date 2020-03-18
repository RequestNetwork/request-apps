import * as React from 'react';

import { Box, Typography } from '@material-ui/core';
import { RIcon } from './RIcon';
import { Spacer } from './Spacer';

export const RFooter = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      flex={1}
      justifyContent="flex-end"
    >
      <Box display="flex" flexDirection="row">
        <Typography variant="caption">Powered by</Typography>
        <div>&nbsp;</div>
        <RIcon />
        <div>&nbsp;</div>
        <Typography variant="caption">Request</Typography>
      </Box>
      <Spacer />
      <Box fontStyle="italic">
        <Typography variant="caption">
          Take control of your financial data
        </Typography>
      </Box>
      <Spacer size={15} xs={10} />
    </Box>
  );
};
