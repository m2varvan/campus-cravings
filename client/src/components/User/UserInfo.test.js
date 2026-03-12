import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import UserInfo from './UserInfo';

describe('UserInfo', () => {

    const mockUser = {
        firstName: 'Aysha',
        lastName: 'Hide',
        email: 'test@email.com',
        userName: 'ahide123',
        createdDate: '2025-01-01',
    };

    let mockLoadUserInfo;
    let setUserInfo;

    function renderComponent() {
        mockLoadUserInfo = jest.fn();
        setUserInfo = jest.fn()

        render(
            <UserInfo
                uuid={1}
                loadUserInfo={mockLoadUserInfo}
                userInfo={mockUser}
                setUserInfo={setUserInfo}
            />
        );
    }

    test('loadUserInfo function is called on initial render', () => {
        renderComponent();
        expect(mockLoadUserInfo).toHaveBeenCalled();
    });

    test('First and Last Name are displayed', async () => {
        renderComponent();

        // Use findByText to wait for async rendering
        const name = await screen.findByText(/Aysha Hide/i);

        expect(name).toBeInTheDocument();
    });

    test('Account Created Date is displayed', async () => {
        renderComponent();

        const createdDate = await screen.findByText(/2025-01-01/i);
        expect(createdDate).toBeInTheDocument();
    });

    test('Email and Username are displayed', async () => {
        renderComponent();

        const email = await screen.findByText(/test@email.com/i);
        const username = await screen.findByText(/ahide123/i);

        expect(email).toBeInTheDocument();
        expect(username).toBeInTheDocument();
    });

});