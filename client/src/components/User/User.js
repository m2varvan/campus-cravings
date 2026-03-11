import React from 'react';
import {Grid, Typography, Box} from '@mui/material';


import UserInfo from './UserInfo';
import FavouriteDeals from './FavouriteDeals';
import FavouriteRestaurant from './FavouriteRestaurants';
import loadUserInfo from '../../APIs/loadUserInfo';
import loadFaveDeals from '../../APIs/loadFaveDeals';
import loadFaveRestaurants from '../../APIs/loadFaveRestaurants';

const User = ({uuid}) => {

    const [userInfo, setUserInfo] = React.useState(null)
    const [faveDeals, setFaveDeals] = React.useState(null)
    const [faveRestaurants, setFaveRestaurants] = React.useState(null)

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
                <Box sx={{
                    maxHeight: 600, // scrollable height
                    overflowY: "auto",
                }}>
                <FavouriteDeals 
                    uuid={uuid} 
                    loadFaveDeals={loadFaveDeals}
                    faveDeals={faveDeals}
                    setFaveDeals={setFaveDeals} 
                />

                <FavouriteRestaurant 
                    uuid={uuid} 
                    loadFaveRestaurants={loadFaveRestaurants}
                    setFaveRestaurants={setFaveRestaurants}
                    faveRestaurants={faveRestaurants} 
                />
                </Box>
            </Grid>

        </Grid>

        </Grid>
    </>
    );
}

export default User;