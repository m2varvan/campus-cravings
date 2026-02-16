import TodayDeal from './TodayDeal';
import WeekDeal from './WeekDeal';
import React from 'react';
import { Typography, Grid } from '@mui/material';

const Deals = ({uuid}) => {

    const [todayDeals, setTodayDeals] = React.useState([])

    const loadTodayDeals = async () => {
        try {
            const response = await fetch('/api/todaydeals');

            if (!response.ok) {
                throw new Error (`Server error: $(response.status)`);
            }

            const data = await response.json();
            setTodayDeals(data)
            console.log(data)

        } catch (error) {
            console.error("Failed to load today's deals:", error);

        } finally {

        }
        
    };

    React.useEffect(() => {
        loadTodayDeals()
    }, [])

   

    return(
        <Grid container p={4}> 
            <Typography variant='h4'>University Shops Plaza Deals</Typography>

            <TodayDeal uuid={uuid} 
                        loadTodayPromotions={loadTodayDeals}
                        todayPromotions={todayDeals}/>

            <WeekDeal uuid={uuid}/>
        </Grid>
    )

};

export default Deals;