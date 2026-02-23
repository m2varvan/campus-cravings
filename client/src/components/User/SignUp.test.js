import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SignUp from './SignUp';
import { MemoryRouter } from 'react-router-dom';

global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: true, 
            json: () => Promise.resolve({ message: "User has been created"})
        })
    );

Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-1234',
    },
});

// CHANGE 2: Mock useNavigate to track redirects
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('SignUp Componenet', () => {

    beforeEach(() => {
        fetch.mockClear();
        mockedUsedNavigate.mockClear();
        jest.useFakeTimers();
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
    })

    afterEach(() => {
        // Clean up timers after each test
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });


    test('renders the sign up form', () => {
        expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    });

    test('shows error messages when fields are empty', () => {
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Enter an email address/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter a password/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter a first name/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter a last name/i)).toBeInTheDocument();
    });

    test('form submits successfullywith correct ID and initials', async () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Mperson123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        // CHANGE 6: Verify fetch was called with the calculated initials and mock UUID
        await screen.findByText(/Your account has been created!!/i);
        
        const expectedBody = JSON.stringify({
            id: 'test-uuid-1234',
            username: 'test@gmail.com',
            firstName: 'Muhammad',
            lastName: 'Varvani',
            profilePhoto: 'MV'
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/signup', expect.objectContaining({
            body: expectedBody
        }));
    });
    
    test('shows an error message when an invalid email is entered', () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvanigmail.' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: {value: 'Mperson123' } });

        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument();
    });

    test('shows an error message if the password does not meet standard', () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvani@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: {value: 'mypassword' } });

        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Password must be at least 8 characters, include 1 uppercase letter and 1 number/i)).toBeInTheDocument()
    });

    test('shows error when email is already taken', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false, 
                status: 409, 
                json: () => Promise.resolve("This email already has an account.")
            })
        )

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: {value: 'Mypassword123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));    

        const errorMsg = await screen.findByText(/This email already has an account./i);
        expect(errorMsg).toBeInTheDocument();
    });

    test('redirects to /Login after 3 seconds on successful signup', async () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Mperson123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        // Wait for the success message to appear
        await screen.findByText(/Your account has been created!!/i);

        // CHANGE 5: Fast-forward time by 3 seconds inside act()
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Verify the mock navigator was called with the correct path
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/Login');
    });


})