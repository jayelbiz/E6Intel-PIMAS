import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Map from '../../../pages/Map';

describe('Map Component', () => {
  beforeEach(() => {
    render(<Map />);
  });

  test('renders map container', () => {
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('renders map controls', () => {
    expect(screen.getByTestId('map-controls')).toBeInTheDocument();
  });
});
