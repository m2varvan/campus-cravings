import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { withFirebase } from "../Firebase";

const Login = ({ firebase }) => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [error, setError] = React.useState({});
    const [submitStatus, setSubmitStatus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

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

    React.useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => {
                navigate("/");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus, navigate]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Grid container spacing={4} sx={{ maxWidth: 500, border: "1px solid #ccc", p: 3 }}>

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
                        value={email}
                        onChange={handleChangeEmail}
                    />
                    {error.email && (
                        <Alert severity="error" sx={{ mt: 2 }}>{error.email}</Alert>
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}

                    />
                    {error.password && (
                        <Alert severity="error" sx={{ mt: 2 }}>{error.password}</Alert>
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
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Login"
                        )}
                    </Button>

                    {/* General Error */}
                    {error.general && (
                        <Alert severity="error" sx={{ mt: 2 }}>{error.general}</Alert>
                    )}

                    {/* Success Message */}
                    {submitStatus && (
                        <>
                            <br />
                            <Alert severity="success" data-testid="login-success" sx={{ mt: 2 }}>
                                Login successful! Redirecting...
                            </Alert>
                        </>
                    )}

                    {/* Sign Up Option */}
                    <Typography align="center" sx={{ mt: 3 }}>
                        Don't have an account?{" "}
                        <Button
                            variant="text"
                            onClick={() => navigate("/Signup")}
                        >
                            Sign Up
                        </Button>
                    </Typography>

                </Grid>

            </Grid>
        </Box>
    );
};

export default withFirebase(Login);