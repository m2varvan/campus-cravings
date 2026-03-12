import React from 'react';
import { Typography, Box, CircularProgress, Grid, Button } from '@mui/material';
import FavouriteRestaurant from './FavouriteRestaurant';

const FavouriteRestaurantList = ({ uuid, loadFaveRestaurants, faveRestaurants, setFaveRestaurants }) => {

    //States for loading / errors
    const [loadingRestaurants, setLoadingRestaurants] = React.useState(false);
    const [error, setError] = React.useState(false);

    // Show only 4 favourite restaurants by default
    const defaultVisible = 4;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(faveRestaurants.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    // Function to load favourite restaurants
    const loadRestaurants = async () => {
        try {
            setLoadingRestaurants(true);
            setError(false);
            const restaurants = await loadFaveRestaurants(uuid);
            setFaveRestaurants(restaurants);
        } catch (err) {
            setError(true);
        } finally {
            setLoadingRestaurants(false);
        }
    };

    // Load favourite restaurants when uuid changes
    React.useEffect(() => {
        loadRestaurants();
    }, [uuid, loadFaveRestaurants, setFaveRestaurants]);

    // Remove favourite restaurant from list
    const handleRemoveRestaurant = (restaurantID) => {
        setFaveRestaurants(prevRestaurants =>
            prevRestaurants.filter(r => r.restaurant_id !== restaurantID)
        );
    };

    return (
        <>
        <Box sx={{
            border: "3px solid",
            borderColor: "secondary.dark",
            borderRadius: 2,
            p: 1,
        }}>

            {/* Header title and count */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">My Favourite Restaurants</Typography>
                <Typography variant="body1">
                    ({faveRestaurants.length} favourite {faveRestaurants.length === 1 ? 'restaurant' : 'restaurants'})
                </Typography>
            </Box>

            {/* Loading */}
            {loadingRestaurants && (
                <Box display="flex" justifyContent="center" mt={3}>
                    Loading your favourite restaurants...
                    <CircularProgress sx={{ ml: 2 }} />
                </Box>
            )}

            {/* Error */}
            {error && (
                <Typography>
                    An error occurred loading your favourite restaurants. Please try again later.
                </Typography>
            )}

            {/* No favourite restaurants */}
            {!loadingRestaurants && !error && (!faveRestaurants || faveRestaurants.length === 0) && (
                <Typography>No restaurants favourited.</Typography>
            )}

            {/* Display Restaurants */}
            {!loadingRestaurants && !error && faveRestaurants && faveRestaurants.length > 0 && (
            <>
                <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                    <Grid container>
                        {faveRestaurants.slice(0, visibleCount).map(restaurant => (
                            <Grid item xs={12} md={6} key={restaurant.restaurant_id}>
                                <FavouriteRestaurant
                                    restaurant={restaurant}
                                    uuid={uuid}
                                    handleRemoveRestaurant={handleRemoveRestaurant}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Show More / Show Less Buttons */}
                <Box textAlign="center" mt={2}>
                    {visibleCount < faveRestaurants.length && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowMore}
                            sx={{ mr: 1 }}
                        >
                            Show More
                        </Button>
                    )}
                    {visibleCount > defaultVisible && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowLess}
                        >
                            Show Less
                        </Button>
                    )}
                </Box>
            </>
            )}
        </Box>
        </>
    );
};

export default FavouriteRestaurantList;