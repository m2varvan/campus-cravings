import React from 'react';
import { Typography, CircularProgress, Box, Button } from '@mui/material';
import UserReview from './UserReview';

const UserReviewList = ({ uuid, loadUserReviews, setUserReviews, userReviews, readOnly = false }) => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const defaultVisible = 3;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(userReviews.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    const onDelete = (id) => {
        setUserReviews(prev => prev.filter(r => r.review_id !== id));
    };

    const onUpdate = (updated) => {
        setUserReviews(prev =>
            prev.map(r => r.review_id === updated.review_id ? updated : r)
        );
    };

    React.useEffect(() => {
        const getInfo = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await loadUserReviews(uuid);
                setUserReviews(response);
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
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">{readOnly ? 'Their Reviews' : 'My Reviews'}</Typography>
                <Typography variant="body1">
                    ({userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'})
                </Typography>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" mt={3}>
                    Loading reviews...
                    <CircularProgress sx={{ ml: 2 }} />
                </Box>
            )}

            {error && (
                <Typography>An error occurred loading reviews.</Typography>
            )}

            {!loading && !error && (!userReviews || userReviews.length === 0) && (
                <Typography>No reviews submitted.</Typography>
            )}

            {!loading && !error && userReviews && userReviews.length > 0 && (
                <>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                    {userReviews.slice(0, visibleCount).map((review, index) => (
                        <UserReview
                            key={index}
                            review={review}
                            uuid={uuid}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                            readOnly={readOnly}
                        />
                    ))}

                    <Box textAlign="center" mt={2}>
                        {visibleCount < userReviews.length && (
                            <Button variant="contained" color="primary" onClick={handleShowMore} sx={{ mr: 1 }}>
                                Show More
                            </Button>
                        )}
                        {visibleCount > defaultVisible && (
                            <Button variant="contained" color="primary" onClick={handleShowLess}>
                                Show Less
                            </Button>
                        )}
                    </Box>
                </Box>
                </>
            )}
        </Box>
        </>
    );
};

export default UserReviewList;