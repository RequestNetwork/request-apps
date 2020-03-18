import React from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import { RButton, RIcon } from '../../';
import { Typography } from '@material-ui/core';

export default {
  title: 'Styles/Buttons',
};

export const NormalButtonStory = () => {
  return (
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
  );
};

NormalButtonStory.story = {
  name: 'Normal',
};

export const LoadingButtonStory = () => (
  <table>
    <tr>
      <th>Payment, Waiting for Metamask</th>
      <td style={{ width: 532 }}>
        <RButton
          variant="payment"
          startIcon={<RIcon />}
          loading
          fullWidth
          direction="left"
        >
          Pay now
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Payment, Broadcasting</th>
      <td style={{ width: 532 }}>
        <RButton
          variant="payment"
          startIcon={<RIcon />}
          loading
          fullWidth
          direction="right"
        >
          Pay now
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Primary</th>
      <td>
        <RButton variant="primary" loading>
          <Typography variant="caption">Create a request</Typography>
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Secondary</th>
      <td>
        <RButton variant="secondary" startIcon={<ArrowDownward />} loading>
          <Typography variant="h4">Download PDF receipt</Typography>
        </RButton>
      </td>
    </tr>
  </table>
);

LoadingButtonStory.story = {
  name: 'Loading',
};

export const DisabledButtonStory = () => (
  <table>
    <tr>
      <th>Payment</th>
      <td style={{ width: 532 }}>
        <RButton
          variant="payment"
          startIcon={<RIcon />}
          disabled
          fullWidth
          direction="left"
        >
          Pay now
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Primary</th>
      <td>
        <RButton variant="primary" disabled>
          <Typography variant="caption">Create a request</Typography>
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Secondary</th>
      <td>
        <RButton variant="secondary" startIcon={<ArrowDownward />} disabled>
          <Typography variant="h4">Download PDF receipt</Typography>
        </RButton>
      </td>
    </tr>
  </table>
);

DisabledButtonStory.story = {
  name: 'Disabled',
};
