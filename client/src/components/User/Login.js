import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';

const Login = ({ uuid, setUuid, profilePhoto, setProfilePhoto }) => {

    // Field states
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Error + status states
    const [error, setError] = React.useState({});
    const [confirmationMessage, setConfirmationMessage] = React.useState(null);
    const [submitStatus, setSubmitStatus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    // Handlers
    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    // Email validation
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async () => {

        if (loading) return;

        const newErrors = {};
        setError({});
        setConfirmationMessage(null);

        if (username.trim() === '') {
            newErrors.username = "Enter your email address";
        } else if (!isValidEmail(username)) {
            newErrors.username = "Enter a valid email address";
        }

        if (password.trim() === '') {
            newErrors.password = "Enter your password";
        }

        if (Object.keys(newErrors).length === 0) {

            setLoading(true);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: username, password: password })
                });

                const data = await response.json();

                if (!response.ok) {
                    setError({ general: data.message || "Invalid credentials" });
                    return;
                }

                setSubmitStatus(true);
                setUuid(password)
                setProfilePhoto(data.profilePhoto)
                setConfirmationMessage(
                    <>
                        <br />
                        <Alert severity="success">Login successful! Redirecting...</Alert>
                    </>
                );

            } catch (err) {
                console.error("Login error:", err.message);
                setError({ general: "Server connection failed. Try again later." });
            } finally {
                setLoading(false);
            }

        } else {
            setError(newErrors);
        }
    };

    // Redirect after success
    React.useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus, navigate]);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>

                <Grid container spacing={4} sx={{ maxWidth: 500, border: '1px solid #ccc', p: 3 }}>

                    <Grid item xs={12}>
                        <Typography variant="h3" align="center">
                            Login
                        </Typography>
                    </Grid>

                    {/* Email Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Email Address"
                            type="email"
                            fullWidth
                            autoComplete="username"
                            value={username}
                            onChange={handleChangeUsername}
                        />
                        {error.username && (
                            <Alert severity="error">{error.username}</Alert>
                        )}
                    </Grid>

                    {/* Password Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            autoComplete="current-password"
                            value={password}
                            onChange={handleChangePassword}
                        />
                        {error.password && (
                            <Alert severity="error">{error.password}</Alert>
                        )}
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading
                                ? <CircularProgress size={24} color="inherit" />
                                : "Login"}
                        </Button>

                        {/* General Error */}
                        {error.general && (
                            <Typography
                                color="error"
                                align="center"
                                sx={{ mt: 2 }}
                            >
                                {error.general}
                            </Typography>
                        )}

                        {/* Confirmation */}
                        {submitStatus && (
                            <Typography
                                color="success.main"
                                align="center"
                                sx={{ mt: 2 }}
                            >
                                {confirmationMessage}
                            </Typography>
                        )}

                        {/* Sign Up Option */}
                        <Typography
                            align="center"
                            sx={{ mt: 3 }}
                        >
                            Don't have an account?{" "}
                            <Button
                                variant="text"
                                onClick={() => navigate('/Signup')}
                            >
                                Sign Up
                            </Button>
                        </Typography>

                    </Grid>

                </Grid>
            </Box>
        </div>
    );
};

export default Login;