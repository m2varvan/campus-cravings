import React from 'react';
import {Typography, CircularProgress, Box } from '@mui/material';
import UserReview from './UserReview';

const UserReviewList = ({ uuid, loadUserReviews, setUserReviews, userReviews}) => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const getInfo = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await loadUserReviews(uuid);
                setUserReviews(response);
                console.log('My Reviews:', response)

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
    }, [uuid, loadUserReviews, setUserReviews]);


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
            My Reviews
        </Typography>

        {/* Loading */}
        {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
            Loading your Reviews...
            <CircularProgress sx={{ ml: 2 }} />
        </Box>
        )}

        {/* Error  */}
        {error && (
            <Typography>
                An error occured loading your reviews
            </Typography>
        )}

        {/* No Rated Deals*/}
        {!loading && !error && (!userReviews || userReviews.length === 0) && (
            <Typography>No reviews submitted.</Typography>
        )}

        {/* Display Reviews in UserReview Boxes*/}
        {!loading && !error && userReviews && userReviews.length > 0 && (
            userReviews.map((review, index) => (
                <UserReview 
                    key={index}
                    review={review}
                    uuid={uuid}
                />
            ))
        )}
    </Box>
    </>
    );
};

export default UserReviewList;