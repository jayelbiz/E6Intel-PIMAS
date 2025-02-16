import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Analysis from '../../../pages/Analysis';

describe('Analysis Component', () => {
  beforeEach(() => {
    render(<Analysis />);
  });

  test('renders analysis tabs', () => {
    expect(screen.getByText('Legal & Constitutional')).toBeInTheDocument();
    expect(screen.getByText('Spiritual Warfare')).toBeInTheDocument();
    expect(screen.getByText('Financial Networks')).toBeInTheDocument();
  });

  test('renders analysis content', () => {
    expect(screen.getByTestId('analysis-content')).toBeInTheDocument();
  });
});
