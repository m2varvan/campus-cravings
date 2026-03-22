import React from 'react';
import {Typography, CircularProgress, Box } from '@mui/material';
import UserRating from './UserRating';

const UserRatingList = ({ uuid, loadUserRatings, setUserRatings, userRatings}) => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const getInfo = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await loadUserRatings(uuid);
                setUserRatings(response);
                console.log('My Ratings:', response)

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (uuid) {
            getInfo();
        }
    }, [uuid, loadUserRatings, setUserRatings]);


    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                justifySelf={'center'} 
                mt={3}
                sx={{
                border: "3px solid",
                borderColor: "secondary.dark",
                borderRadius: 2,
                p: 1,
                }} >
                Loading your Account Information
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                justifySelf={'center'} 
                mt={3}
                sx={{
                border: "3px solid",
                borderColor: "secondary.dark",
                borderRadius: 2,
                p: 1,
                }} >
                 Error loading user information.
            </Box>
        );
    }

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
            My Deal Ratings
        </Typography>

        {/* Loading */}
        {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
            Loading your Ratings...
            <CircularProgress sx={{ ml: 2 }} />
        </Box>
        )}

        {/* Error  */}
        {error && (
            <Typography>
                An error occured loading your ratings.
            </Typography>
        )}

        {/* No Rated Deals*/}
        {!loading && !error && (!userRatings || userRatings.length === 0) && (
            <Typography>No ratings submitted.</Typography>
        )}

        {/* Display Rated Deals in UserRating Boxes*/}
        {!loading && !error && userRatings && userRatings.length > 0 && (
            userRatings.map((rating) => (
                <UserRating 
                    key={rating.dealID}
                    rating={rating}
                    uuid={uuid}
                />
            ))
        )}
    </Box>
    </>
);
};

export default UserRatingList;