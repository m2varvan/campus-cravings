import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';



const SignUp = () => {

    // Text field states
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
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
    const handleChangeUsername = (event) => {
        setUsername(event.target.value)
    };
    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    };
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
        
        if (username.trim() === '') {
            newErrors.username = "Enter an email address";
            setConfirmationMessage(null)
        } else if (!isValidEmail(username)) {
            newErrors.username = "Enter a valid email address"
        };
        if (password.trim() === ''){
            newErrors.password = "Enter a password";
            setConfirmationMessage(null)
        } else if (!isValidPassword(password)) {
            newErrors.password = "Password must be at least 8 characters, include 1 uppercase letter and 1 number"
        }
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
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, firstName: firstName, lastName: lastName, profilePhoto: profilePhoto})
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    setError({ username: errorData });
                    return;
                }

                setSubmitStatus(true)
                setConfirmationMessage(
                <>
                    <br />
                    Your account has been created!!
                </>
                );
                setError({})
                
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
    

    return(
        <div>
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>

                {/*Main Parent Container*/}
                <Grid container spacing={4} sx={{ maxWidth: 1000, border: '1px solid #ccc', p: 2}}>
                    
                    {/* Left Side: Log in prompt */}
                    <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5'}}>
                        <Typography variant="h4">Already have an account?</Typography>
                        <Button variant="outlined" color="primary" onClick={handleSubmit1}>
                            Log In
                        </Button>
                    </Grid>
                    
                    {/* Right Side: Sign up prompt */}
                    <Grid item xs={12} md={6}>
                        <Grid container direction="column" spacing={2} alignItems="center">
                            <Grid item>
                                <Typography variant="h3">Create an account</Typography>
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField id="firstname-input" label="First Name" variant="outlined" fullWidth margin='normal' autoComplete='given-name' value={firstName} onChange={handleChangeFirstName}></TextField>
                                {error.firstname && (
                                    <Typography color="error">{error.firstname}</Typography>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField id="lastname-input" label="Last Name" variant='outlined' fullWidth margin='normal' autoComplete='family-name' value={lastName} onChange={handleChangeLastName}></TextField>
                                {error.lastname && (
                                    <Typography color="error">{error.lastname}</Typography>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField id="username-input" label="Email Address" type="email" variant='outlined' fullWidth margin='normal' autoComplete='username' value={username} onChange={handleChangeUsername}></TextField>
                                {error.username && (
                                    <Typography color="error">{error.username}</Typography>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <TextField id="password-input" label="Password" type="password" fullWidth margin='normal' autoComplete='current-password' value={password} onChange={handleChangePassword} inputProps={{ maxLength: 20 }} helperText={`${password.length}/20 characters`}></TextField>
                                {error.password && (
                                    <Typography color="error">{error.password}</Typography>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <Button id="submit-button" variant='contained' fullWidth onClick={handleSubmit2} disabled={loading}>{loading? <CircularProgress size={24} color="inherit" /> : "Sign Up"}</Button>
                                {error.general && (
                                    <Typography id="error-message" color="error" align="center" sx={{ mb: 2 }}>
                                        {error.general}
                                    </Typography>
                                )}
                                {submitStatus === true && (
                                    <Typography id="confirmation-message" color="success.main" align="center">
                                        {confirmationMessage}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>
            </Box>
        </div>
    )

}; 

export default SignUp;