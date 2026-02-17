import { Typography, Box, Grid } from "@mui/material";
import React from 'react';

const Deal = ({uuid, deal}) => {
    return(
        <Grid item xs={12} sm={6} lg={4}>
        <Box
            sx={{
            bgcolor: 'primary.main',
            p: 2,
            m: 1,
            borderRadius: 1,
            }}
        >
            {/* Deal name and price on opposite ends */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
                <Typography variant="h6">{deal.dealName}</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {deal.restaurantName}
                </Typography>
            </Box>
            <Typography variant="h6">${deal.dealPrice}</Typography>
            </Box>
        </Box>
        </Grid>
    )
};

export default Deal