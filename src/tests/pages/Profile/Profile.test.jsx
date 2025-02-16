import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from '../../../pages/Profile';

describe('Profile Component', () => {
  beforeEach(() => {
    render(<Profile />);
  });

  test('renders profile information', () => {
    expect(screen.getByTestId('profile-info')).toBeInTheDocument();
  });

  test('renders activity feed', () => {
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
  });
});
