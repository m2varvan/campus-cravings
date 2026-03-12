import React from 'react';
import {Grid, Typography, Box} from '@mui/material';

import UserInfo from './UserInfo';
import FavouriteDealList from './FavouriteDealList';
import FavouriteRestaurantList from './FavouriteRestaurantList';
import loadUserInfo from '../../APIs/loadUserInfo';
import loadFaveDeals from '../../APIs/loadFaveDeals';
import loadFaveRestaurants from '../../APIs/loadFaveRestaurants';

const User = ({uuid}) => {

    console.log('UUID', uuid)

    const [userInfo, setUserInfo] = React.useState(null)
    const [faveDeals, setFaveDeals] = React.useState([])
    const [faveRestaurants, setFaveRestaurants] = React.useState([])

    return (
    <>
        <Grid container p={4}>
        
        {/* Page Title */}
        <Grid item xs={12}>
            <Box sx={{pb: 2}}>
                <Typography variant="h3">My Account</Typography>
            </Box>
        </Grid>

        {/* Row */}
        <Grid container item xs={12} spacing={2}>

            {/* Left Column - User Info */}
            <Grid item xs={12} md={4}>
            <UserInfo 
                uuid={uuid}
                loadUserInfo={loadUserInfo}
                setUserInfo={setUserInfo}
                userInfo={userInfo}
            />
            </Grid>

            {/* Right Column - Favourites */}
            
            <Grid item xs={12} md={8} >

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FavouriteDealList 
                            uuid={uuid} 
                            loadFaveDeals={loadFaveDeals}
                            faveDeals={faveDeals}
                            setFaveDeals={setFaveDeals} 
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FavouriteRestaurantList 
                            uuid={uuid} 
                            loadFaveRestaurants={loadFaveRestaurants}
                            setFaveRestaurants={setFaveRestaurants}
                            faveRestaurants={faveRestaurants} 
                        />
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
        </Grid>
    </>
    );
}

export default User;