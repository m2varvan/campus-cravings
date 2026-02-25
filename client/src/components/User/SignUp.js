import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';


const SignUp = () => {

    // Text field states
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [profilePhoto, setProfilePhoto] = React.useState('N/A')

    // Error handling
    const [error, setError] = React.useState({});
    const [confirmationMessage, setConfirmationMessage] = React.useState(null)
    const [submitStatus, setSubmitStatus] = React.useState(false)

    // Loading State
    const [loading, setLoading] = React.useState(false);

    // Handle Change functions
    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    };
    const handleChangeUsername = (event) => {
        setUsername(event.target.value)
    };
    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    };
    const handleChangeConfirmPassword = (event) => {
        setConfirmPassword(event.target.value)
    }
    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value)
    };
    const handleChangeLastName = (event) => {
        setLastName(event.target.value)
    };

    // Email validity checker
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidUsername = (username) => {
        return /^[a-zA-Z0-9_]{8,}$/.test(username);
    };

    // Password validity checker
    const isValidPassword = (password) => {
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

    // Handle Submit functions 
    const navigate = useNavigate()

    const handleSubmit1 = (event) => {
        navigate('/Login')
    };

    const handleSubmit2 = async (event) => {
        
        if (loading) return;

        const newErrors = {};
        setError({})

        if (email.trim() === '') {
            newErrors.email = "Enter an email address"
        } else if (!isValidEmail(email)) {
            newErrors.email = "Enter a valid email address"
        };
        
        if (username.trim() === '') {
            newErrors.username = "Enter a username";
            setConfirmationMessage(null)
        } else if (!isValidUsername(username)) {
            newErrors.username = "Username must be at least 8 characters and contain only letters, numbers, or underscores"
        };

        if (password.trim() === ''){
            newErrors.password = "Enter a password";
            setConfirmationMessage(null)
        } else if (!isValidPassword(password)) {
            newErrors.password = "Password must be at least 8 characters, include 1 uppercase letter and 1 number"
        };

        if (confirmPassword.trim() === '') {
            newErrors.confirmPassword = "Confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        };

        if (firstName.trim() === ''){
            newErrors.firstname = "Enter a first name";
            setConfirmationMessage(null)
        }

        if (lastName.trim() === ''){
            newErrors.lastname = "Enter a last name";
            setConfirmationMessage(null)
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            
            const initials = ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase();
            const id = crypto.randomUUID();
    
            setProfilePhoto(initials);

            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id,
                        email: email,
                        username: username,
                        firstName: firstName,
                        lastName: lastName,
                        profilePhoto: initials
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json()

                    if (errorData.field) {
                        setError({ [errorData.field]: errorData.message })
                    }
                    return;
                }

                setSubmitStatus(true)

                setConfirmationMessage(
                <>
                    <br />
                    <Alert severity="success">Your account has been created!! Redirecting to login...</Alert>
                </>
                );

                setError({});
                
            } catch (error) {
                console.error("Error during signup:", error.message)
                setError({ general: "Server connection failed. Try again later."})
            } finally {
                setLoading(false);
            }

        } else {
            setError(newErrors)
        }
    }

    React.useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => {
                navigate('/Login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus, navigate])
    

    return(
        <div>
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>

                {/* Main Parent Container */}
                <Grid container spacing={4} sx={{ maxWidth: 600, border: '1px solid #ccc', p: 2}}>
                    
                    {/* Sign up form */}
                    <Grid item xs={12}>
                        <Grid container direction="column" spacing={2} alignItems="center">

                            <Grid item>
                                <Typography variant="h3">Create an account</Typography>
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField
                                    id="firstname-input"
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    margin='normal'
                                    autoComplete='given-name'
                                    value={firstName}
                                    onChange={handleChangeFirstName}
                                />
                                {error.firstname && (
                                    <Alert severity="error">{error.firstname}</Alert>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField
                                    id="lastname-input"
                                    label="Last Name"
                                    variant='outlined'
                                    fullWidth
                                    margin='normal'
                                    autoComplete='family-name'
                                    value={lastName}
                                    onChange={handleChangeLastName}
                                />
                                {error.lastname && (
                                    <Alert severity="error">{error.lastname}</Alert>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField
                                    id="email-input"
                                    label="Email Address"
                                    variant='outlined'
                                    type="email"
                                    fullWidth
                                    margin='normal'
                                    value={email}
                                    onChange={handleChangeEmail}
                                />
                                {error.email && <Alert severity="error">{error.email}</Alert>}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField
                                    id="username-input"
                                    label="Username"
                                    variant='outlined'
                                    fullWidth
                                    margin='normal'
                                    value={username}
                                    onChange={handleChangeUsername}
                                />
                                {error.username && (
                                    <Alert severity="error">{error.username}</Alert>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField
                                    id="password-input"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    margin='normal'
                                    autoComplete='current-password'
                                    value={password}
                                    onChange={handleChangePassword}
                                    inputProps={{ maxLength: 50 }}
                                    helperText={`${password.length}/50 characters`}
                                />
                                {error.password && (
                                    <Alert severity="error">{error.password}</Alert>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    margin='normal'
                                    value={confirmPassword}
                                    onChange={handleChangeConfirmPassword}
                                />
                                {error.confirmPassword && <Alert severity="error">{error.confirmPassword}</Alert>}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <Button
                                    id="submit-button"
                                    variant='contained'
                                    fullWidth
                                    onClick={handleSubmit2}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                                </Button>

                                {error.general && (
                                    <Typography
                                        id="error-message"
                                        color="error"
                                        align="center"
                                        sx={{ mb: 2 }}
                                    >
                                        {error.general}
                                    </Typography>
                                )}

                                {submitStatus === true && (
                                    <Typography
                                        id="confirmation-message"
                                        color="success.main"
                                        align="center"
                                    >
                                        {confirmationMessage}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item sx={{ mt: 3 }}>
                                <Typography variant="body1" align="center">
                                    Already have an account?{" "}
                                    <Button
                                        variant="text"
                                        onClick={handleSubmit1}
                                    >
                                        Log In
                                    </Button>
                                </Typography>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            </Box>
        </div>
    )

}; 

export default SignUp;