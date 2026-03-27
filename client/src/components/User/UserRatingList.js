import React from 'react';
import { Typography, CircularProgress, Box, Button } from '@mui/material';
import UserRating from './UserRating';

const UserRatingList = ({ uuid, loadUserRatings, setUserRatings, userRatings, readOnly = false, profileName }) => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    // Show only 3 reviews by default
    const defaultVisible = 3;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(userRatings.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    const onDelete = (id) => {
        setUserRatings(prev => prev.filter(r => r.ratingID !== id));
    };

    const onUpdate = (ratingID, taste, value, portion) => {
        setUserRatings(prev =>
            prev.map(r => r.ratingID === ratingID ? {
                ...r,
                userTasteRating: taste,
                userValueRating: value,
                userPortionRating: portion,
            } : r)
        );
    };

    React.useEffect(() => {
        const getInfo = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await loadUserRatings(uuid);
                setUserRatings(response);
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

    const title = readOnly
        ? profileName
            ? `${profileName}'s Ratings`
            : 'Their Ratings'
        : 'My Ratings';

    return (
        <>
        <Box sx={{
            border: "3px solid",
            borderColor: "secondary.dark",
            borderRadius: 2,
            p: 1,
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body1">
                    ({userRatings.length} {userRatings.length === 1 ? 'rating' : 'ratings'})
                </Typography>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" mt={3}>
                    Loading ratings...
                    <CircularProgress sx={{ ml: 2 }} />
                </Box>
            )}

            {error && (
                <Typography>An error occurred loading ratings.</Typography>
            )}

            {!loading && !error && (!userRatings || userRatings.length === 0) && (
                <Typography>No ratings submitted.</Typography>
            )}

            <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                {!loading && !error && userRatings && userRatings.length > 0 && (
                    userRatings.slice(0, visibleCount).map((rating) => (
                        <UserRating
                            key={rating.dealID}
                            rating={rating}
                            uuid={uuid}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                            readOnly={readOnly}
                        />
                    ))
                )}

                <Box textAlign="center" mt={2}>
                    {visibleCount < userRatings.length && (
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
        </Box>
        </>
    );
};

export default UserRatingList;