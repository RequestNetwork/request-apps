import React from 'react';
import { Box, Typography } from '@material-ui/core';

export const TestnetWarning = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="180px"
        height="40px"
        color="#fff"
        style={{ backgroundColor: '#FFB95F' }}
      >
        <Typography variant="body1">Test Network</Typography>
      </Box>
      <Box width="100%" borderBottom="4px solid #FFB95F" />
    </>
  );
};
