import React from 'react';
import { render } from '@testing-library/react';
import { DealsProvider } from '../Contexts/DealsContext';

/**
 * Custom render function that wraps components with DealsProvider
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Options for render (includes renderOptions and dealsContextValue)
 * @param {Object} options.dealsContextValue - Custom context value for DealsProvider
 * @param {string} options.uuid - UUID to pass to DealsProvider
 * @param {Object} options.renderOptions - Standard render options
 * @returns {Object} - The render result with utilities
 */
export function renderWithDealsProvider(
  ui,
  {
    dealsContextValue = {},
    uuid = null,
    ...renderOptions
  } = {}
) {
  const Wrapper = ({ children }) => (
    <DealsProvider uuid={uuid}>
      {children}
    </DealsProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create a mock DealsContext value with default implementations
 * @param {Object} overrides - Values to override defaults
 * @returns {Object} - Mock context value
 */
export function createMockDealsContext(overrides = {}) {
  return {
    allDeals: [],
    loading: false,
    error: false,
    loadAllDeals: jest.fn(),
    updateDealFavorite: jest.fn(),
    updateDealVote: jest.fn(),
    updateDealRating: jest.fn(),
    ...overrides,
  };
}

// Re-export everything from testing library for convenience
export * from '@testing-library/react';
