import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: true, 
            json: () => Promise.resolve({ message: "Log In successfull."})
        })
    );


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('LogIn Componenet', () => {

    beforeEach(() => {
        fetch.mockClear();
        mockedUsedNavigate.mockClear();
        jest.useFakeTimers();
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    })

    afterEach(() => {
        // Clean up timers after each test
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });


    test('renders the Log in form', () => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('shows error messages when fields are empty', () => {
        const logInButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(logInButton);

        expect(screen.getByText(/Enter your email address/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter your password/i)).toBeInTheDocument();
    });

    test('form submits successfullywith correct ID and initials', async () => {
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Mperson123' } });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await screen.findByText(/Login successful! Redirecting.../i);
        
        const expectedBody = JSON.stringify({
            username: 'test@gmail.com',
            password: 'Mperson123'
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/login', expect.objectContaining({
            body: expectedBody
        }));
    });
    
    test('shows an error message when an invalid email is entered', () => {
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvanigmail.' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: {value: 'Mperson123' } });

        const signUpButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument();
    });

    test('shows error when credentials entered were invalid', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false, 
                status: 409, 
                json: () => Promise.resolve("Log In credentials given do not exists")
            })
        )

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: {value: 'Mypassword123' } });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));    

        const errorMsg = await screen.findByText(/Invalid credentials/i);
        expect(errorMsg).toBeInTheDocument();
    });

    test('redirects to /Deals after 3 seconds on successful login', async () => {
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Mperson123' } });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Wait for the success message to appear
        await screen.findByText(/Login successful! Redirecting../i);

        // CHANGE 5: Fast-forward time by 3 seconds inside act()
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Verify the mock navigator was called with the correct path
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });


})