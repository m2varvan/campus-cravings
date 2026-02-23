import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';



const SignUp = () => {

    // Text field states
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    // Error handling
    const [error, setError] = React.useState({});
    const [confirmationMessage, setConfirmationMessage] = React.useState(null)
    const [submitStatus, setSubmitStatus] = React.useState(false)

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

    // Handle Submit functions 
    const navigate = useNavigate()
    const handleSubmit1 = (event) => {
        navigate('/Login')
    };

    const handleSubmit2 = (event) => {
        const newErrors = {};
        if (username.trim() === '') {
            newErrors.username = "Enter an email address";
            setConfirmationMessage(null)
        } else if (!isValidEmail(username)) {
            newErrors.username = "Enter a valid email address"
        };
        if (password.trim() === ''){
            newErrors.password = "Enter a password";
            setConfirmationMessage(null)
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
            setSubmitStatus(true)
            setConfirmationMessage(
                <>
                    Your account has been created <br />
                    First Name: {firstName} <br />
                    Last Name: {lastName} <br />
                    Username: {username} <br />
                    Password: {password} <br />
                </>
            )
        }
        setError(newErrors)
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
                                <TextField id="password-input" label="Password" type="password" fullWidth margin='normal' autoComplete='current-password' value={password} onChange={handleChangePassword}></TextField>
                                {error.password && (
                                    <Typography color="error">{error.password}</Typography>
                                )}
                            </Grid>

                            <Grid item sx={{ width: '80%' }}>
                                <Button id="submit-button" variant='contained' fullWidth onClick={handleSubmit2}>Sign Up</Button>
                                {submitStatus === true && (
                                    <Typography id="confirmation-message" color="success.main">
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
