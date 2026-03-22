import React from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';

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


    return (
        <>
        <Box sx={{
                    border: "3px solid",
                    borderColor: "secondary.dark",
                    borderRadius: 2,
                    p: 1,
                    }} 
                >
            {/* Header*/}
            <Typography variant="h5" gutterBottom>
                Account Information
            </Typography>
    
            {/* Loading */}
            {loadingUserInfo && (
            <Box display="flex" justifyContent="center" mt={3}>
                Loading your Account Information...
                <CircularProgress sx={{ ml: 2 }} />
            </Box>
            )}
    
            {/* Error  */}
            {error && (
                <Typography>
                   Error loading user information.
                </Typography>
            )}
    
            {/* No Account Found */}
            {!loadingUserInfo && !error && (!userInfo) && (
                <Typography>No Account Found.</Typography>
            )}
    
            {/* Display Deals in FavourtiteDeal Boxes */}
            {!loadingUserInfo && !error && userInfo && Object.keys(userInfo).length > 0 && (
                <>
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
                </>
            
            )}
        </Box>
        </>
    );
};

export default UserInfo;