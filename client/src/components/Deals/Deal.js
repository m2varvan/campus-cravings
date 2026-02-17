import { Typography, Box, Grid } from "@mui/material";
import React from 'react';

const Deal = ({uuid, deal}) => {
    return(
        <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{bgcolor: 'primary.light', p: 1, m: 1}}>
                <Typography>
                    {deal.dealName}
                </Typography>
                <Typography>
                    ${deal.dealPrice}
                </Typography>
                <Typography>
                    {deal.restaurantName}
                </Typography>
            </Box>
        </Grid>
    )
};

export default Deal