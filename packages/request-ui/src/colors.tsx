import { RequestStatus } from 'request-shared';

export const colors = {
  primary: '#00CC8E',
  black: '#050B20',
  statusText: '#456078',
  background: '#FAFAFA',
  subtext: '#656565',
  icon: '#656565',
  border: '#E4E4E4',
  footer: '#C4C4C4',
};

export const statusColors: Record<RequestStatus, string> = {
  open: '#FFF1BE',
  paid: '#D6F3E2',
  pending: '#CBBEFF',
  canceled: '#FFBEBE',
};
