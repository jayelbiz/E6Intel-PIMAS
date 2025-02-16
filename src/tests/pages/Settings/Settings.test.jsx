import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Settings from '../../../pages/Settings';

describe('Settings Component', () => {
  beforeEach(() => {
    render(<Settings />);
  });

  test('renders settings page title', () => {
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('renders notification settings', () => {
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  test('renders display settings', () => {
    expect(screen.getByText('Display Settings')).toBeInTheDocument();
  });

  test('renders filter settings', () => {
    expect(screen.getByText('Filter Settings')).toBeInTheDocument();
  });
});
