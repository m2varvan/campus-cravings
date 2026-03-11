import { render, screen, } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import UserInfo from './UserInfo';
import loadUserInfo from '../../APIs/loadUserInfo';

describe('UserInfo', () => {

    const mockUser = {
        firstName: 'Aysha',
        lastName: 'Hide',
        email: 'test@email.com',
        userName: 'ahide123',
        createdDate: '2025-01-01',
    };

    let mockLoadUserInfo;

    function renderComponent() {
        mockLoadUserInfo = jest.fn();

        render(
            <UserInfo
                uuid={1}
                loadUserInfo={mockLoadUserInfo}
                userInfo={mockUser}
            />
        );
    }

    test('loadUserInfo function is called on initial render', () => {
        renderComponent();
        expect(mockLoadUserInfo).toHaveBeenCalled();
    });

    test('First and Last Name are displayed', () => {
        renderComponent();

        expect(screen.getByText(/Aysha/i)).toBeInTheDocument();
        expect(screen.getByText(/Hide/i)).toBeInTheDocument();
    });

    test('Account Created Date is displayed', () => {
        renderComponent();

        expect(screen.getByText(/2025-01-01/i)).toBeInTheDocument();
    });

    test('Email and Username are displayed', () => {
        renderComponent();

        expect(screen.getByText(/test@email.com/i)).toBeInTheDocument();
        expect(screen.getByText(/ahide123/i)).toBeInTheDocument();
    });

});