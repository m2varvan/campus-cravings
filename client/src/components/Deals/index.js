import TodayDeal from './TodayDeal';
import WeekDeal from './WeekDeal';
import React from 'react';
import { Typography, Grid } from '@mui/material';

const Deals = ({uuid}) => {

    // Stateful variables to load today's deals from db
    const [todayDeals, setTodayDeals] = React.useState([])
    const [loadingTodayDeals, setLoadingTodayDeals] = React.useState(false)
    const [todayDealsError, setTodayDealsError] = React.useState(false)

    // API to load today's deals
    const loadTodayDeals = async () => {
        try {
            setLoadingTodayDeals(true)
            const response = await fetch('/api/todaydeals');

            if (!response.ok) {
                throw new Error (`Server error: $(response.status)`);
            }

            const data = await response.json();
            setTodayDeals(data)
            console.log(data)

        } catch (error) {
            console.error("Failed to load today's deals:", error);
            setTodayDealsError(true)
        } finally{
            setLoadingTodayDeals(false)
        }
    };

    return(
        <Grid container p={4} display={'flex'}> 
            {/* Page Title */}
            <Typography variant='h4'>University Shops Plaza Deals</Typography>

            {/* Today's Deals */}
            <TodayDeal uuid={uuid} 
                    todayDeals={todayDeals}
                    loading={loadingTodayDeals}
                    error={todayDealsError}
                    loadTodayDeals={loadTodayDeals}/>

            {/* Weekly Deals */}
            <WeekDeal uuid={uuid}/>
        </Grid>
    )
};

export default Deals;