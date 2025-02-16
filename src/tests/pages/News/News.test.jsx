import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import News from '../../../pages/News';
import { NewsProvider } from '../../../contexts/NewsContext';

describe('News Component', () => {
  beforeEach(() => {
    render(
      <NewsProvider>
        <News />
      </NewsProvider>
    );
  });

  test('renders news page title', () => {
    expect(screen.getByText('Intelligence News')).toBeInTheDocument();
  });

  test('renders search input', () => {
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  test('renders category filter', () => {
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  test('renders sort options', () => {
    expect(screen.getByText('Most Recent')).toBeInTheDocument();
  });
});
