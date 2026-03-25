import React from 'react';
import {Grid, Typography, Box} from '@mui/material';
import FlaggedDealsList from './FlaggedDealsList';

const Admin = ({uuid}) => {

    const [flaggedDeals, setFlaggedDeals] = React.useState([])

    return (
    <>
        <Grid container p={4}>
        
        {/* Page Title */}
        <Grid item xs={12}>
            <Box sx={{pb: 2}}>
                <Typography variant="h3">Admin</Typography>
            </Box>
        </Grid>

        {/* Flagged Deals */}
        <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
                <FlaggedDealsList />
            </Grid>
        </Grid>
        </Grid>
    </>
    );
}

export default Admin;