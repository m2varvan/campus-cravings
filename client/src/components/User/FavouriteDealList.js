import React from 'react';
import { Typography, Box, CircularProgress, Grid, Button } from '@mui/material';
import FavouriteDeal from './FavouriteDeal';

const FavouriteDealList = ({ uuid, loadFaveDeals, faveDeals, setFaveDeals }) => {

    //States for loading / errors
    const [loadingDeals, setLoadingDeals] = React.useState(false);
    const [error, setError] = React.useState(false);

    // Show only 4 favourite deals by default
    const defaultVisible = 4;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(faveDeals.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    // Function to load favourite deals
    const loadDeals = async () => {
        try {
        setLoadingDeals(true);
        setError(false);
        const deals = await loadFaveDeals(uuid);
        setFaveDeals(deals);
        } catch (err) {
        setError(true);
        } finally {
        setLoadingDeals(false);
        }
    };

    // Load favourite deals when uuid changes
    React.useEffect(() => {
        loadDeals();
    }, [uuid, loadFaveDeals, setFaveDeals]);


    // Remove favourite deal from list
    const handleRemoveDeal = (dealID) => {
        setFaveDeals(prevDeals => prevDeals.filter(deal => deal.dealID !== dealID));
    };


    return (
    <>
    <Box sx={{
                border: "3px solid",
                borderColor: "secondary.dark",
                borderRadius: 2,
                p: 1,
                }} 
            >
        {/* Header with count*/}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">My Favourite Deals</Typography>
        <Typography variant="body1">
            ({faveDeals.length} favourite {faveDeals.length === 1 ? 'deal' : 'deals'})
        </Typography>
        </Box>

        {/* Loading */}
        {loadingDeals && (
        <Box display="flex" justifyContent="center" mt={3}>
            Loading your favourite deals...
            <CircularProgress sx={{ ml: 2 }} />
        </Box>
        )}

        {/* Error  */}
        {error && (
            <Typography>
                An error occurred loading your favourite deals. Please try again later.
            </Typography>
        )}

        {/* No deals */}
        {!loadingDeals && !error && (!faveDeals || faveDeals.length === 0) && (
            <Typography>No deals favourited.</Typography>
        )}

        {/* Display Deals in FavourtiteDeal Boxes */}
        {!loadingDeals && !error && faveDeals && faveDeals.length > 0 && (
        <>
            <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                <Grid container >
                    {faveDeals.slice(0, visibleCount).map(deal => (
                        <Grid item xs={12} md={6} key={deal.dealID}>
                            <FavouriteDeal
                                deal={deal}
                                uuid={uuid}
                                reloadDeals={loadDeals}
                                handleRemoveDeal={handleRemoveDeal}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Show More / Show Less Buttons */}
            <Box textAlign="center" mt={2}>
            {visibleCount < faveDeals.length && (
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
        </>
        )}
    </Box>
    </>
);
};

export default FavouriteDealList;