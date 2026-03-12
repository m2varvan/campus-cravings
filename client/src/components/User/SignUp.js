import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import { withFirebase } from '../Firebase';

const SignUp = ({ firebase }) => {

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const [error, setError] = React.useState({});
    const [confirmationMessage, setConfirmationMessage] = React.useState(null);
    const [submitStatus, setSubmitStatus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleChangeEmail = (e) => setEmail(e.target.value);
    const handleChangeUsername = (e) => setUsername(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);
    const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);
    const handleChangeFirstName = (e) => setFirstName(e.target.value);
    const handleChangeLastName = (e) => setLastName(e.target.value);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidUsername = (username) => /^[a-zA-Z0-9_]{8,}$/.test(username);
    const isValidPassword = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

    const handleSubmit = async () => {
        if (loading) return;

        const newErrors = {};
        setError({});

        // Validation
        if (email.trim() === '') newErrors.email = "Enter an email address";
        else if (!isValidEmail(email)) newErrors.email = "Enter a valid email address";

        if (username.trim() === '') newErrors.username = "Enter a username";
        else if (!isValidUsername(username))
            newErrors.username = "Username must be at least 8 characters and contain only letters, numbers, or underscores";

        if (password.trim() === '') newErrors.password = "Enter a password";
        else if (!isValidPassword(password))
            newErrors.password = "Password must be at least 8 characters, include 1 uppercase letter and 1 number";

        if (confirmPassword.trim() === '') newErrors.confirmPassword = "Confirm your password";
        else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        if (firstName.trim() === '') newErrors.firstname = "Enter a first name";
        if (lastName.trim() === '') newErrors.lastname = "Enter a last name";

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        const initials = ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase();
        let authUser = null;

        try {
            // Create Firebase user
            authUser = await firebase.doCreateUserWithEmailAndPassword(email, password);

            await firebase.doSignOut()

            // Save user to your own database
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: authUser.user.uid,
                    username,
                    email,
                    firstName,
                    lastName,
                    profilePhoto: initials,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                const error = new Error(data.message || "Signup failed on server");
                error.field = data.field;
                throw error;
            }

            setSubmitStatus(true);
            setConfirmationMessage(
                <>
                    <br />
                    <Alert severity="success">
                        Your account has been created! Redirecting to login...
                    </Alert>
                </>
            );

        } catch (err) {
            console.error("Signup error:", err.message);

            // Clean up Firebase user if backend save failed
            if (authUser?.user) {
                try {
                    await authUser.user.delete();
                } catch (deleteErr) {
                    console.error("Failed to delete Firebase user after failed signup:", deleteErr);
                }
            }

            if (err.field === "email") {
                setError({ email: err.message });
            } else if (err.field === "username") {
                setError({ username: err.message });
            } else if (err.code === "auth/email-already-in-use") {
                setError({ email: "This email already has an account" });
            } else {
                setError({ general: "Signup failed. Try again." });
            }

        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => {
                navigate('/Login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus, navigate]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>

            <Grid container spacing={4} sx={{ maxWidth: 600, border: '1px solid #ccc', p: 2 }}>

                <Grid item xs={12}>
                    <Grid container direction="column" spacing={2} alignItems="center">

                        <Grid item>
                            <Typography variant="h3">Create an account</Typography>
                        </Grid>

                        {/* First Name */}
                        <Grid item sx={{ width: '80%' }}>
                            <TextField
                                label="First Name"
                                fullWidth
                                margin="normal"
                                value={firstName}
                                onChange={handleChangeFirstName}
                            />
                            {error.firstname && <Alert severity="error">{error.firstname}</Alert>}
                        </Grid>

                        {/* Last Name */}
                        <Grid item sx={{ width: '80%' }}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                margin="normal"
                                value={lastName}
                                onChange={handleChangeLastName}
                            />
                            {error.lastname && <Alert severity="error">{error.lastname}</Alert>}
                        </Grid>

                        {/* Email */}
                        <Grid item sx={{ width: '80%' }}>
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={handleChangeEmail}
                            />
                            {error.email && <Alert severity="error">{error.email}</Alert>}
                        </Grid>

                        {/* Username */}
                        <Grid item sx={{ width: '80%' }}>
                            <TextField
                                label="Username"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={handleChangeUsername}
                            />
                            {error.username && <Alert severity="error">{error.username}</Alert>}
                        </Grid>

                        {/* Password */}
                        <Grid item sx={{ width: '80%' }}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={handleChangePassword}
                            />
                            {error.password && <Alert severity="error">{error.password}</Alert>}
                        </Grid>

                        {/* Confirm Password */}
                        <Grid item sx={{ width: '80%' }}>
                            <TextField
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={confirmPassword}
                                onChange={handleChangeConfirmPassword}
                            />
                            {error.confirmPassword && <Alert severity="error">{error.confirmPassword}</Alert>}
                        </Grid>

                        {/* Submit */}
                        <Grid item sx={{ width: '80%' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading
                                    ? <CircularProgress size={24} color="inherit" />
                                    : "Sign Up"}
                            </Button>

                            {error.general && (
                                <Typography color="error" align="center" sx={{ mt: 2 }}>
                                    {error.general}
                                </Typography>
                            )}

                            {submitStatus && (
                                <Typography align="center">
                                    {confirmationMessage}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item sx={{ mt: 3 }}>
                            <Typography align="center">
                                Already have an account?{" "}
                                <Button onClick={() => navigate('/')}>
                                    Log In
                                </Button>
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid>

            </Grid>
        </Box>
    );
};

export default withFirebase(SignUp);