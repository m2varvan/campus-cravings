import React from 'react';
import { Typography, Box, CircularProgress, Grid, Button } from '@mui/material';
import OwnerDeal from './OwnerDeal';

const OwnerDealList = ({ uuid, loadOwnerDeals, ownerDeals, setOwnerDeals }) => {
    const [loadingDeals, setLoadingDeals] = React.useState(false);
    const [error, setError] = React.useState(false);

    const defaultVisible = 4;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(ownerDeals.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    const loadDeals = async () => {
        try {
            setLoadingDeals(true);
            setError(false);
            const deals = await loadOwnerDeals(uuid);
            setOwnerDeals(deals);
        } catch (err) {
            setError(true);
        } finally {
            setLoadingDeals(false);
        }
    };

    React.useEffect(() => {
        loadDeals();
    }, [uuid]);

    return (
        <Box sx={{ border: "3px solid", borderColor: "secondary.dark", borderRadius: 2, p: 1 }}>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">My Deals</Typography>
                <Typography variant="body1">
                    ({ownerDeals.length} {ownerDeals.length === 1 ? 'deal' : 'deals'})
                </Typography>
            </Box>

            {loadingDeals && (
                <Box display="flex" justifyContent="center" mt={3}>
                    Loading your deals...
                    <CircularProgress sx={{ ml: 2 }} />
                </Box>
            )}

            {error && <Typography>An error occurred loading your deals. Please try again later.</Typography>}

            {!loadingDeals && !error && ownerDeals.length === 0 && (
                <Typography>No deals found.</Typography>
            )}

            {!loadingDeals && !error && ownerDeals.length > 0 && (
                <>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                        <Grid container>
                            {ownerDeals.slice(0, visibleCount).map(deal => (
                                <Grid item xs={12} md={6} key={deal.dealID}>
                                    <OwnerDeal
                                        deal={deal}
                                        uuid={uuid}
                                        reloadDeals={loadDeals}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box textAlign="center" mt={2}>
                        {visibleCount < ownerDeals.length && (
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

export default OwnerDealList;