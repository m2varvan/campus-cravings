import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert, Box } from '@mui/material';

const UserInfo = ({ uuid, loadUserInfo, setUserInfo, userInfo }) => {

    const [loadingUserInfo, setLoadingUserInfo] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const getInfo = async () => {
            try {
                setLoadingUserInfo(true);
                setError(false);

                const response = await loadUserInfo(uuid);
                setUserInfo(response);

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoadingUserInfo(false);
            }
        };

        if (uuid) {
            getInfo();
        }
    }, [uuid, loadUserInfo, setUserInfo]);

    if (loadingUserInfo) {
        return (
            <Box display="flex" justifyContent="center" justifySelf={'center'} mt={3}>
                Loading your Account Information
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                Error loading user information.
            </Alert>
        );
    }

    if (!userInfo) return null;

    return (
        <Box sx={{
            border: "3px solid",
            borderColor: "secondary.dark",
            borderRadius: 2,
            p: 1,
            }} 
        >
            
            <Typography variant="h5" gutterBottom>
                Account Information
            </Typography>

            <Typography variant="body1">
                <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
            </Typography>

            <Typography variant="body1">
                <strong>Email:</strong> {userInfo.email}
            </Typography>

            <Typography variant="body1">
                <strong>Username:</strong> {userInfo.userName}
            </Typography>

            <Typography variant="body1">
                <strong>Account Created:</strong> {userInfo.createdDate}
            </Typography>
        </Box>
    );
};

export default UserInfo;