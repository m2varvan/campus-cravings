import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CircularProgress, Alert, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { withFirebase } from "../Firebase";

const Login = ({ firebase }) => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState({});
    const [submitStatus, setSubmitStatus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [resetSent, setResetSent] = React.useState(false);

    const navigate = useNavigate();

    const handleChangeEmail = (event) => setEmail(event.target.value);
    const handleChangePassword = (event) => setPassword(event.target.value);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async () => {
        if (loading) return;

        const newErrors = {};
        setError({});

        if (email.trim() === "") {
            newErrors.email = "Enter your email address";
        } else if (!isValidEmail(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (password.trim() === "") {
            newErrors.password = "Enter your password";
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        try {
            await firebase.doSignInWithEmailAndPassword(email, password);
            setSubmitStatus(true);
        } catch (err) {
            console.error("Login error:", err.message);
            setError({ general: "Invalid email or password" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!isValidEmail(email)) {
            setError({ general: "Please enter your email address first." });
            return;
        }
        try {
            await firebase.doPasswordReset(email);
            setResetSent(true);
            setError({});
        } catch (err) {
            setError({ general: "Could not send reset email. Please check the email address." });
        }
    };

    React.useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => navigate("/"), 2000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus, navigate]);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '90vh',
            px: 2,
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: 460,
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: 'secondary.dark',
                borderRadius: 3,
                overflow: 'hidden',
            }}>
                {/* Header Banner */}
                <Box sx={{
                    bgcolor: 'primary.main',
                    px: 4,
                    py: 3,
                    borderBottom: '2px solid',
                    borderColor: 'secondary.dark',
                }}>
                    <Typography variant="h4" fontWeight="bold" align="center" sx={{ color: 'text.primary', letterSpacing: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Sign in to your Campus Cravings account
                    </Typography>
                </Box>

                <Box sx={{ px: 4, py: 3 }}>
                    <Grid container spacing={2}>

                        {/* Email Field */}
                        <Grid item xs={12}>
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                size="small"
                                autoComplete="username"
                                value={email}
                                onChange={handleChangeEmail}
                                error={!!error.email}
                            />
                            {error.email && (
                                <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.email}</Alert>
                            )}
                        </Grid>

                        {/* Password Field */}
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                size="small"
                                autoComplete="current-password"
                                value={password}
                                onChange={handleChangePassword}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                error={!!error.password}
                            />
                            {error.password && (
                                <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.password}</Alert>
                            )}
                        </Grid>

                        {/* Forgot Password */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    size="small"
                                    onClick={handlePasswordReset}
                                    sx={{ textDecoration: 'underline', fontWeight: 'bold' }}
                                >
                                    Forgot Password?
                                </Button>
                            </Box>
                        </Grid>

                        {/* Reset Sent Success */}
                        {resetSent && (
                            <Grid item xs={12}>
                                <Alert severity="success" sx={{ py: 0 }}>
                                    Password reset email sent! Check your inbox.
                                </Alert>
                            </Grid>
                        )}

                        {/* General Error */}
                        {error.general && (
                            <Grid item xs={12}>
                                <Alert severity="error" sx={{ py: 0 }}>{error.general}</Alert>
                            </Grid>
                        )}

                        {/* Success Message */}
                        {submitStatus && (
                            <Grid item xs={12}>
                                <Alert severity="success" data-testid="login-success" sx={{ py: 0 }}>
                                    Login successful! Redirecting...
                                </Alert>
                            </Grid>
                        )}

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                                disableElevation
                                sx={{
                                    py: 1.4,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    letterSpacing: 1,
                                    border: '2px solid',
                                    borderColor: 'secondary.dark',
                                    borderRadius: 2,
                                    mt: 1,
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                            </Button>
                        </Grid>

                        {/* Divider */}
                        <Grid item xs={12}>
                            <Divider sx={{ borderColor: 'secondary.light' }} />
                        </Grid>

                        {/* Sign Up Link */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?
                                </Typography>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    size="small"
                                    onClick={() => navigate("/Signup")}
                                    sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default withFirebase(Login);