import { useWeb3React } from '@web3-react/core';
import { RButton } from './RButton';
import React from 'react';
import { IParsedRequest } from 'request-shared';
import { RAlert } from './RAlert';
import { mintErc20TransferrableReceivable } from '@frinkly/payment-processor';
import { Typography } from '@material-ui/core';
import { Spacer } from './Spacer';
import { ExtensionTypes } from '@frinkly/types';

interface IProps {
  request: IParsedRequest;
}

export const MintReceivable = (props: IProps) => {
  const { account, library } = useWeb3React();

  const { request } = props;

  if (
    request.status !== 'receivablePending' ||
    request.paymentNetwork !==
      ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERRABLE_RECEIVABLE
  ) {
    return null;
  }

  let isPayee = account?.toLowerCase() === request.payee.toLowerCase();

  return (
    <>
      <RAlert
        severity="error"
        message={
          isPayee
            ? 'You must mint the receivable in order to receive payments.'
            : 'This request cannot be paid until the payee mints the receivable.'
        }
        actions={
          isPayee ? (
            <RButton
              color="default"
              onClick={async () => {
                await mintErc20TransferrableReceivable(request.raw, library);
              }}
            >
              <Typography variant="h4">Mint Receivable</Typography>
            </RButton>
          ) : undefined
        }
      />
      <Spacer size={12} />
    </>
  );
};
