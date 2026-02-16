import Deal from './Deal';
import { Typography, Grid } from '@mui/material';

const TodayDeal = ({uuid}) => {

    const getTodayDate = () => {
        const now = new Date();

        // Get day name and month
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
        const dayOfMonth = now.getDate();
        const year = now.getFullYear();

        // Helper to get st, nd, rd, or th
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
    }

    return(
        <Grid item xs={12}>
            <Typography variant='h5'>Today's Deals ({getTodayDate()})</Typography>
        </Grid>
    )
};

export default TodayDeal;