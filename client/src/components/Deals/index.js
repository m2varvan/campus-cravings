import TodayDeal from './TodayDeal';
import WeekDeal from './WeekDeal';
import React from 'react';
import { Typography, Grid } from '@mui/material';

const Deals = ({uuid}) => {

    const [todayDeals, setTodayDeals] = React.useState([])
    const [loadingTodayDeals, setLoadingTodayDeals] = React.useState(false)
    const [todayDealsError, setTodayDealsError] = React.useState(false)

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
            setTodayDeals(true)
        } finally{
            setLoadingTodayDeals(false)
        }
    };

    React.useEffect(() => {
        loadTodayDeals()
    }, [])

    return(
        <Grid container p={4} display={'flex'}> 
            <Typography variant='h4'>University Shops Plaza Deals</Typography>

            <TodayDeal uuid={uuid} 
                    todayDeals={todayDeals}
                    loading={loadingTodayDeals}
                    error={todayDealsError}/>

            <WeekDeal uuid={uuid}/>
        </Grid>
    )
};

export default Deals;