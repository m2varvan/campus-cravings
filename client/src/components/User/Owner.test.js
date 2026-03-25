import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Owner from './Owner';

// Mock all child components
jest.mock('./UserInfo', () => () => <div data-testid="user-info">UserInfo</div>);
jest.mock('./OwnerRestaurantList', () => () => <div data-testid="owner-restaurant-list">OwnerRestaurantList</div>);
jest.mock('./OwnerDealList', () => () => <div data-testid="owner-deal-list">OwnerDealList</div>);
jest.mock('./CreateDealDialog', () => () => <div data-testid="create-deal-dialog">CreateDealDialog</div>);

jest.mock('../../APIs/loadUserInfo', () => jest.fn());
jest.mock('../../APIs/loadOwnerRestaurants', () => jest.fn(() => Promise.resolve([])));
jest.mock('../../APIs/loadOwnerDeals', () => jest.fn(() => Promise.resolve([])));

describe('Owner Component', () => {

    const uuid = 'test-owner-uuid';

    beforeEach(() => {
        render(<Owner uuid={uuid} />);
    });

    test('renders the Owner Dashboard title', () => {
        expect(screen.getByText(/Owner Dashboard/i)).toBeInTheDocument();
    });

    test('renders the Post New Deal button', () => {
        expect(screen.getByRole('button', { name: /Post New Deal/i })).toBeInTheDocument();
    });

    test('renders UserInfo component', () => {
        expect(screen.getByTestId('user-info')).toBeInTheDocument();
    });

    test('renders OwnerDealList component', () => {
        expect(screen.getByTestId('owner-deal-list')).toBeInTheDocument();
    });

    test('renders OwnerRestaurantList component', () => {
        expect(screen.getByTestId('owner-restaurant-list')).toBeInTheDocument();
    });

    test('passes uuid prop down to child components', () => {
        expect(screen.getByTestId('user-info')).toBeInTheDocument();
        expect(screen.getByTestId('owner-deal-list')).toBeInTheDocument();
    });
});