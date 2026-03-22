import React from 'react';
import {Typography, CircularProgress, Box } from '@mui/material';
import UserRating from './UserRating';

const UserRatingList = ({ uuid, loadUserRatings, setUserRatings, userRatings}) => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const onDelete = (id) => {
        setUserRatings(prev => prev.filter(r => r.ratingID !== id))
    }

    const onUpdate = (ratingID, taste, value, portion) => {
        setUserRatings(prev =>
            prev.map(r => r.ratingID === ratingID ? {
                ...r,
                userTasteRating: taste,
                userValueRating: value,
                userPortionRating: portion
            } : r)
        )
    }

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
        {/* Header with count*/}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">My Ratings</Typography>
            <Typography variant="body1">
                ({userRatings.length} {userRatings.length === 1 ? 'rating' : 'ratings'})
            </Typography>
        </Box>

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
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))
        )}
    </Box>
    </>
);
};

export default UserRatingList;