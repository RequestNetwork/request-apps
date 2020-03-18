import React from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import { RButton, RIcon } from '../../';
import { Typography } from '@material-ui/core';

export default {
  title: 'Styles',
};

export const ButtonStory = () => {
  return (
    <>
      <h2>Normal</h2>
      <table>
        <tr>
          <th>Payment</th>
          <td style={{ width: 532 }}>
            <RButton variant="payment" startIcon={<RIcon />} fullWidth>
              Pay now
            </RButton>
          </td>
        </tr>

        <tr>
          <th>Primary</th>
          <td>
            <RButton variant="primary">
              <Typography variant="caption">Create a request</Typography>
            </RButton>
          </td>
        </tr>
        <tr>
          <th>Secondary</th>
          <td>
            <RButton variant="secondary" startIcon={<ArrowDownward />}>
              <Typography variant="h4">Download PDF receipt</Typography>
            </RButton>
          </td>
        </tr>
      </table>
      <h2>Loading</h2>
      <table>
        <tr>
          <th>Payment, Waiting for Metamask</th>
          <td style={{ width: 532 }}>
            <RButton
              variant="payment"
              startIcon={<RIcon />}
              loading
              direction="left"
            >
              Pay now
            </RButton>
          </td>
        </tr>
        <tr>
          <th>Payment, Broadcasting</th>
          <td>
            <RButton
              variant="payment"
              startIcon={<RIcon />}
              loading
              direction="right"
            >
              Pay now
            </RButton>
          </td>
        </tr>
      </table>
    </>
  );
};

ButtonStory.story = {
  name: 'Buttons',
};
