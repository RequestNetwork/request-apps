import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RButton } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<RButton variant="payment" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
