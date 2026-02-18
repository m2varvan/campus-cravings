import { Typography, Grid, Box, CircularProgress } from "@mui/material";
import React from "react";

const WeekDeal = ({uuid, weekDeals, loadWeekDeals, loading, error}) => {

    React.useEffect(() => {
        loadWeekDeals();
    }, [])

    return(
        <Grid item xs={12}>
            <Typography variant='h5' sx={{ my: 2 }}>
                Weekly Deals (Monday to Sunday)
            </Typography>

            {/* Show loading message when deals are loading */}
            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',   
                        justifyContent: 'center',
                        width: '100%',      
                        textAlign: 'center',
                        gap: 2,
                    }}
                >
                    <CircularProgress size={48} color="secondary" />
                    <Typography variant={'h6'}>Loading Weekly Deals</Typography>
                </Box>
            )}
        </Grid>
    )
};

export default WeekDeal;