import React from 'react';
import { render } from '@testing-library/react';
import Error from '../Error.jsx';

describe('Error component', () => {
    it('renders "404" text', () => {
      const { getByText } = render(<Error />);
      const errorText = getByText('404');
      expect(errorText).toBeTruthy();
    });
});