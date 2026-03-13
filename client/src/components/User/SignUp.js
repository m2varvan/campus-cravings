import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
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
    const [restaurantName, setRestaurantName] = React.useState('');
    const [restaurantOptions, setRestaurantOptions] = React.useState([]);
    const [userType, setUserType] = React.useState('regular');

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

    React.useEffect(() => {
        if (userType === 'restaurant_owner') {
            fetch('/api/signup/restaurants')
                .then(res => res.json())
                .then(data => setRestaurantOptions(data.map(r => r.restaurant_name)))
                .catch(err => console.error("Failed to fetch restaurants:", err));
        }
    }, [userType]);

    const handleSubmit = async () => {
        if (loading) return;

        const newErrors = {};
        setError({});

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

        if (userType === 'restaurant_owner' && restaurantName.trim() === '')
            newErrors.restaurantName = "Please select your restaurant";

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        const initials = ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase();
        let authUser = null;

        try {
            authUser = await firebase.doCreateUserWithEmailAndPassword(email, password);
            await firebase.doSignOut();

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
                    userType,
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', mt: 0 }}>
            <Box sx={{ width: '100%', maxWidth: 700, border: '1px solid #ccc', borderRadius: 2, p: 3 }}>

                <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                    Create an account
                </Typography>

                {/* User Type Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Button
                        variant={userType === 'regular' ? 'contained' : 'outlined'}
                        onClick={() => { setUserType('regular'); setRestaurantName(''); }}
                        sx={{ mr: 1 }}
                    >
                        Regular User
                    </Button>
                    <Button
                        variant={userType === 'restaurant_owner' ? 'contained' : 'outlined'}
                        onClick={() => setUserType('restaurant_owner')}
                    >
                        Restaurant Owner
                    </Button>
                </Box>

                {/* First Name & Last Name side by side */}
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <TextField
                            label="First Name"
                            fullWidth
                            size="small"
                            value={firstName}
                            onChange={handleChangeFirstName}
                        />
                        {error.firstname && <Alert severity="error" sx={{ mt: 0.5 }}>{error.firstname}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Last Name"
                            fullWidth
                            size="small"
                            value={lastName}
                            onChange={handleChangeLastName}
                        />
                        {error.lastname && <Alert severity="error" sx={{ mt: 0.5 }}>{error.lastname}</Alert>}
                    </Grid>

                    {/* Email & Username side by side */}
                    <Grid item xs={6}>
                        <TextField
                            label="Email Address"
                            type="email"
                            fullWidth
                            size="small"
                            value={email}
                            onChange={handleChangeEmail}
                        />
                        {error.email && <Alert severity="error" sx={{ mt: 0.5 }}>{error.email}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Username"
                            fullWidth
                            size="small"
                            value={username}
                            onChange={handleChangeUsername}
                        />
                        {error.username && <Alert severity="error" sx={{ mt: 0.5 }}>{error.username}</Alert>}
                    </Grid>

                    {/* Password & Confirm Password side by side */}
                    <Grid item xs={6}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            size="small"
                            value={password}
                            onChange={handleChangePassword}
                        />
                        {error.password && <Alert severity="error" sx={{ mt: 0.5 }}>{error.password}</Alert>}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            size="small"
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        {error.confirmPassword && <Alert severity="error" sx={{ mt: 0.5 }}>{error.confirmPassword}</Alert>}
                    </Grid>

                    {/* Restaurant Dropdown - only for Owners */}
                    {userType === 'restaurant_owner' && (
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="restaurant-select-label">Select Your Restaurant</InputLabel>
                                <Select
                                    labelId="restaurant-select-label"
                                    value={restaurantName}
                                    onChange={(e) => setRestaurantName(e.target.value)}
                                    input={<OutlinedInput label="Select Your Restaurant" />}
                                >
                                    {restaurantOptions.map((name) => (
                                        <MenuItem key={name} value={name}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {error.restaurantName && <Alert severity="error" sx={{ mt: 0.5 }}>{error.restaurantName}</Alert>}
                        </Grid>
                    )}

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                        </Button>
                    </Grid>

                    {/* Errors & Success */}
                    {error.general && (
                        <Grid item xs={12}>
                            <Typography color="error" align="center">{error.general}</Typography>
                        </Grid>
                    )}
                    {submitStatus && (
                        <Grid item xs={12}>
                            <Typography align="center">{confirmationMessage}</Typography>
                        </Grid>
                    )}

                    {/* Login Link */}
                    <Grid item xs={12}>
                        <Typography align="center">
                            Already have an account?{" "}
                            <Button variant="text" onClick={() => navigate('/Login')}>
                                Log In
                            </Button>
                        </Typography>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
};

export default withFirebase(SignUp);