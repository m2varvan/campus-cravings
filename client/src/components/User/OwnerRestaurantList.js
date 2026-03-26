import React from 'react';
import { Typography, Box, CircularProgress, Grid, Button } from '@mui/material';
import OwnerRestaurant from './OwnerRestaurant';

const OwnerRestaurantList = ({ uuid, loadOwnerRestaurants, ownerRestaurants, setOwnerRestaurants }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const defaultVisible = 4;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(ownerRestaurants.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    React.useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await loadOwnerRestaurants(uuid);
                setOwnerRestaurants(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [uuid, loadOwnerRestaurants, setOwnerRestaurants]);

    return (
        <Box sx={{ border: "3px solid", borderColor: "secondary.dark", borderRadius: 2, p: 1 }}>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">My Restaurants</Typography>
                <Typography variant="body1">
                    ({ownerRestaurants.length} {ownerRestaurants.length === 1 ? 'restaurant' : 'restaurants'})
                </Typography>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" mt={3}>
                    Loading your restaurants...
                    <CircularProgress sx={{ ml: 2 }} />
                </Box>
            )}

            {error && <Typography>An error occurred loading your restaurants. Please try again later.</Typography>}

            {!loading && !error && ownerRestaurants.length === 0 && (
                <Typography>No restaurants found.</Typography>
            )}

            {!loading && !error && ownerRestaurants.length > 0 && (
                <>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                        <Grid container>
                            {ownerRestaurants.slice(0, visibleCount).map(restaurant => (
                                <Grid item xs={12} md={6} key={restaurant.restaurant_id}>
                                    <OwnerRestaurant
                                        restaurant={restaurant}
                                        uuid={uuid}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box textAlign="center" mt={2}>
                        {visibleCount < ownerRestaurants.length && (
                            <Button variant="contained" onClick={handleShowMore} sx={{ mr: 1 }}>Show More</Button>
                        )}
                        {visibleCount > defaultVisible && (
                            <Button variant="contained" onClick={handleShowLess}>Show Less</Button>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default OwnerRestaurantList;