import { useState } from "react";
import Deal from './Deal';
import { Typography, Grid, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TodayDeal = ({ uuid, todayDeals = [], loading, error }) => {
    const [visibleCount, setVisibleCount] = useState(6);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const getTodayDate = () => {
        const now = new Date();

        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
        const dayOfMonth = now.getDate();
        const year = now.getFullYear();

        const getOrdinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${dayName}, ${monthName} ${dayOfMonth}${getOrdinal(dayOfMonth)}, ${year}`;
    };

    return (
        <Grid item xs={12}>
            <Typography variant='h5' sx={{ my: 2 }}>
                Today's Deals ({getTodayDate()})
            </Typography>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={24} />
                    <Typography>Loading Today's Deals</Typography>
                </Box>
            )}

            {/* Error State */}
            {!loading && error && (
                <Typography color="error">
                    Something went wrong while loading deals. Please try again.
                </Typography>
            )}

            {/* No Deals */}
            {!loading && !error && todayDeals.length === 0 && (
                <Typography>
                    No promotions available today.
                </Typography>
            )}

            {/* Deals List */}
            {!loading && !error && todayDeals.length > 0 && (
                <>
                    <Grid container>
                        {todayDeals.slice(0, visibleCount).map((deal) => (
                            <Deal key={deal.uuid} deal={deal} />
                        ))}
                    </Grid>

                    {/* 🔽 Show More Button */}
                    {visibleCount < todayDeals.length && (
                        <Box textAlign="center" mt={2}>
                            <Button variant="contained" onClick={handleShowMore}>
                                Show More
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Grid>
    );
};

export default TodayDeal;
