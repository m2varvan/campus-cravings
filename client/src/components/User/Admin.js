import React from 'react';
import {Grid, Typography, Box} from '@mui/material';
import FlaggedDealsList from './FlaggedDealsList';

const Admin = () => {

    const [flaggedDeals, setFlaggedDeals] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)

    React.useEffect(() => {
        const getFlaggedDeals = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch('/api/get/flagged/deals');

                if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

                const data = await response.json();
                setFlaggedDeals(data);

                console.log(data)
            } catch(err) {
                console.log('An error occurred loading flagged deals:', err.message);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        getFlaggedDeals()
    }, [])

    
    

    return (
    <>
        <Grid container px={8} py={4} >
        
        {/* Page Title */}
        <Grid item xs={12}>
            <Box sx={{pb: 2}}>
                <Typography variant="h3">Admin</Typography>
            </Box>
        </Grid>

        {/* Flagged Deals */}
        <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
                <FlaggedDealsList 
                    flaggedDeals={flaggedDeals}
                    setFlaggedDeals={setFlaggedDeals}
                    loading={loading}
                    error={error}
                    />
            </Grid>
        </Grid>
        </Grid>
    </>
    );
}

export default Admin;