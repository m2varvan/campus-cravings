import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const mockFirebase = {
    doSignInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
};

jest.mock('../Firebase', () => ({
    withFirebase: (Component) => (props) => <Component firebase={mockFirebase} {...props} />,
}));

describe('LogIn Component', () => {

    beforeEach(() => {
        mockFirebase.doSignInWithEmailAndPassword.mockClear();
        mockedUsedNavigate.mockClear();
        jest.useFakeTimers();
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    });

    afterEach(() => {
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

    test('form submits successfully', async () => {
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mperson123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        });

        const successMsg = await screen.findByTestId('login-success');
        expect(successMsg).toHaveTextContent('Login successful! Redirecting...');
    });

    test('shows an error message when an invalid email is entered', () => {
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvanigmail.' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mperson123' } });

        const loginButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(loginButton);

        expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument();
    });

    test('shows error when credentials are invalid', async () => {
        mockFirebase.doSignInWithEmailAndPassword.mockRejectedValueOnce(
            new Error('auth/wrong-password')
        );

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mypassword123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        });

        const errorMsg = await screen.findByText(/Invalid email or password/i);
        expect(errorMsg).toBeInTheDocument();
    });

    test('redirects to / after 2 seconds on successful login', async () => {
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mperson123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        });

        await screen.findByText(/Login successful! Redirecting/i);

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });

});