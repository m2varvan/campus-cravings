import { Typography, Box, CircularProgress, Button, Grid, Alert, Snackbar} from '@mui/material';
import React from 'react';
import FlaggedDeal from './FlaggedDeal';

const FlaggedDealsList = ({loading, error, setFlaggedDeals, flaggedDeals}) => {

    // Show only 4 flagged deals
    const defaultVisible = 4;
    const [visibleCount, setVisibleCount] = React.useState(defaultVisible);
    const handleShowMore = () => setVisibleCount(flaggedDeals.length);
    const handleShowLess = () => setVisibleCount(defaultVisible);

    // States for Error and success messages
    const [successMSG, setSuccessMSG] = React.useState('');
    const [errorMSG, setErrorMSG] = React.useState('');

    return(
        <>
        <Box sx={{
                border: "3px solid",
                borderColor: "secondary.dark",
                borderRadius: 2,
                p: 1,
                }} 
                >
            {/* Header*/}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Flagged Deals</Typography>
                <Typography variant="body1">
                    ({flaggedDeals.length} flagged {flaggedDeals.length === 1 ? 'deal' : 'deals'})
                </Typography>
            </Box>
    
            {/* Loading */}
            {loading && (
            <Box display="flex" justifyContent="center" mt={3}>
                Loading flagged deals...
                <CircularProgress sx={{ ml: 2 }} />
            </Box>
            )}
    
            {/* Error  */}
            {error && (
                <Typography>
                   An error occured loading flagged deals.
                </Typography>
            )}
    
            {/* No Account Found */}
            {!loading && !error && (flaggedDeals.length === 0) && (
                <Typography>No Flagged Deals.</Typography>
            )}
    
            {/* Display Deals in FavourtiteDeal Boxes */}
            <Grid container > {/* Success Snackbar */}
            {successMSG &&
                <Alert severity="success" sx={{ width: '100%' }}>
                {successMSG}
                </Alert>
            }

            {/* Error Snackbar */}
            {errorMSG &&
                <Alert severity="error" sx={{ width: '100%' }}>
                {errorMSG}
                </Alert>
            }
            {!loading && !error && flaggedDeals && flaggedDeals.length > 0 && (
            <>
            <Grid container spacing={2} alignItems="stretch">
                {flaggedDeals.slice(0, visibleCount).map((deal) => {
                return (
                    <Grid item xs={12} md={6} sx={{ display: "flex" }} key={deal.dealID}>
                    <FlaggedDeal
                        deal={deal}
                        setFlaggedDeals={setFlaggedDeals}
                        setErrorMSG={setErrorMSG}
                        setSuccessMSG={setSuccessMSG}
                    />
                    </Grid>
                );
                })}
            </Grid>
            </>
            )}
            </Grid>

            {/* Show More / Show Less Buttons */}
            <Box textAlign="center" mt={2}>
            {visibleCount < flaggedDeals.length && (
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
    )
}

export default FlaggedDealsList;