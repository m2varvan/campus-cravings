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
import { CircularProgress, Alert, Divider } from '@mui/material';
import { withFirebase } from '../Firebase';

const SignUp = ({ firebase }) => {

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [restaurantOptions, setRestaurantOptions] = React.useState([]);
    const [restaurantId, setRestaurantId] = React.useState('');
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
                .then(data => setRestaurantOptions(data))
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

        if (userType === 'restaurant_owner' && !restaurantId)
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
                    restaurantId: userType === 'restaurant_owner' ? restaurantId : null
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
                <Alert severity="success" sx={{ mt: 1 }}>
                    Your account has been created! Redirecting to login...
                </Alert>
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
            const timer = setTimeout(() => navigate('/Login'), 3000);
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
                maxWidth: 620,
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
                        Join Campus Cravings
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Create your account to get started
                    </Typography>
                </Box>

                <Box sx={{ px: 4, py: 3 }}>

                    {/* Account Type Toggle */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2, fontSize: '0.7rem' }}>
                            Account Type
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            mt: 1,
                            border: '2px solid',
                            borderColor: 'secondary.dark',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}>
                            <Button
                                fullWidth
                                disableElevation
                                variant={userType === 'regular' ? 'contained' : 'text'}
                                onClick={() => { setUserType('regular'); setRestaurantId(''); }}
                                sx={{
                                    borderRadius: 0,
                                    py: 1.2,
                                    fontWeight: userType === 'regular' ? 'bold' : 'normal',
                                    borderRight: '1px solid',
                                    borderColor: 'secondary.dark',
                                }}
                            >
                                Regular User
                            </Button>
                            <Button
                                fullWidth
                                disableElevation
                                variant={userType === 'restaurant_owner' ? 'contained' : 'text'}
                                onClick={() => setUserType('restaurant_owner')}
                                sx={{
                                    borderRadius: 0,
                                    py: 1.2,
                                    fontWeight: userType === 'restaurant_owner' ? 'bold' : 'normal',
                                }}
                            >
                                Restaurant Owner
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: 'secondary.light' }} />

                    {/* Form Fields */}
                    <Grid container spacing={2}>

                        {/* Name Row */}
                        <Grid item xs={6}>
                            <TextField
                                label="First Name"
                                fullWidth
                                size="small"
                                value={firstName}
                                onChange={handleChangeFirstName}
                                error={!!error.firstname}
                            />
                            {error.firstname && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.firstname}</Alert>}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                size="small"
                                value={lastName}
                                onChange={handleChangeLastName}
                                error={!!error.lastname}
                            />
                            {error.lastname && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.lastname}</Alert>}
                        </Grid>

                        {/* Email & Username */}
                        <Grid item xs={6}>
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                size="small"
                                value={email}
                                onChange={handleChangeEmail}
                                error={!!error.email}
                            />
                            {error.email && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.email}</Alert>}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Username"
                                fullWidth
                                size="small"
                                value={username}
                                onChange={handleChangeUsername}
                                error={!!error.username}
                            />
                            {error.username && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.username}</Alert>}
                        </Grid>

                        {/* Password Row */}
                        <Grid item xs={6}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                size="small"
                                value={password}
                                onChange={handleChangePassword}
                                error={!!error.password}
                            />
                            {error.password && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.password}</Alert>}
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
                                error={!!error.confirmPassword}
                            />
                            {error.confirmPassword && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.confirmPassword}</Alert>}
                        </Grid>

                        {/* Restaurant Dropdown */}
                        {userType === 'restaurant_owner' && (
                            <Grid item xs={12}>
                                <Divider sx={{ mb: 2, borderColor: 'secondary.light' }} />
                                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2, fontSize: '0.7rem' }}>
                                    Your Restaurant
                                </Typography>
                                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                    <InputLabel id="restaurant-select-label">Select Your Restaurant</InputLabel>
                                    <Select
                                        labelId="restaurant-select-label"
                                        value={restaurantId}
                                        onChange={(e) => setRestaurantId(e.target.value)}
                                        input={<OutlinedInput label="Select Your Restaurant" />}
                                    >
                                        {restaurantOptions.map((r) => (
                                            <MenuItem key={r.restaurant_id} value={r.restaurant_id}>
                                                {r.restaurant_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {error.restaurantName && <Alert severity="error" sx={{ mt: 0.5, py: 0 }}>{error.restaurantName}</Alert>}
                            </Grid>
                        )}

                        {/* General Error */}
                        {error.general && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error.general}</Alert>
                            </Grid>
                        )}

                        {/* Success Message */}
                        {submitStatus && (
                            <Grid item xs={12}>
                                {confirmationMessage}
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                            </Button>
                        </Grid>

                        {/* Login Link */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?
                                </Typography>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    size="small"
                                    onClick={() => navigate('/Login')}
                                    sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                                >
                                    Log In
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default withFirebase(SignUp);