import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SignUp from './SignUp';
import { MemoryRouter } from 'react-router-dom';

global.fetch = jest.fn(() => 
    Promise.resolve({
        ok: true, 
        json: () => Promise.resolve({ message: "User has been created"})
    })
);

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../Firebase', () => {
    const mockFirebase = {
        doCreateUserWithEmailAndPassword: jest.fn(() =>
            Promise.resolve({
                user: {
                    uid: 'test-uuid-1234',
                    delete: jest.fn(),
                }
            })
        ),
        doSignOut: jest.fn(() => Promise.resolve()),
    };
    return {
        withFirebase: (Component) => (props) => <Component firebase={mockFirebase} {...props} />,
        FirebaseContext: {
            Consumer: ({ children }) => children(mockFirebase),
        },
    };
});

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
        expect(screen.getByText(/Enter a username/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirm your password/i)).toBeInTheDocument();
    });

    test('form submits successfully with correct ID and initials', async () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mperson123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mperson123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await screen.findByText(/Your account has been created! Redirecting to login/i);
        
        const expectedBody = JSON.stringify({
            uid: 'test-uuid-1234',
            username: 'm2varvan',
            email: 'test@gmail.com',
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
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mperson123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mperson123' } });

        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument();
    });

    test('shows an error message if the password does not meet standard', () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvani@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'mypassword' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'mypassword' } });

        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Password must be at least 8 characters, include 1 uppercase letter and 1 number/i)).toBeInTheDocument();
    });

    test('shows an error message if the username does not meet the standard', () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvani@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'mvarv' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mypassword1' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mypassword1' } });

        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Username must be at least 8 characters and contain only letters, numbers, or underscores/i)).toBeInTheDocument();
    });

    test('shows an error message if the password does not match the confirm password section', () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'muhammadvarvani@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mypassword1' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mypassword12' } });

        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(signUpButton);

        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    test('shows error when email is already taken', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false, 
                status: 409, 
                json: () => Promise.resolve({
                    field: 'email',
                    message: "This email already has an account."
                })
            })
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mypassword123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mypassword123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));    

        const errorMsg = await screen.findByText(/This email already has an account./i);
        expect(errorMsg).toBeInTheDocument();
    });

    test('shows error when username is already taken', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false, 
                status: 409, 
                json: () => Promise.resolve({
                    field: 'username',
                    message: "This username is already taken."
                })
            })
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mypassword123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mypassword123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));    

        const errorMsg = await screen.findByText(/This username is already taken./i);
        expect(errorMsg).toBeInTheDocument();
    });

    test('redirects to /Login after 3 seconds on successful signup', async () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Muhammad' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Varvani' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'm2varvan' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Mperson123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Mperson123' } });

        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await screen.findByText(/Your account has been created! Redirecting to login/i);

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/Login');
    });

});