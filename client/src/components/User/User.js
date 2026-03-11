import React from 'react';
import {Grid, Typography} from '@mui/material';


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

    return(
        <>
        <Grid container p={4} display={"flex"}>
            {/* Page Title */}
            <Typography variant="h3">My Account</Typography>

            <Grid item xs={12}>
                <UserInfo 
                    uuid={uuid}
                    loadUserInfo={loadUserInfo}
                    setUserInfo={setUserInfo}
                    userInfo={userInfo}
                    />

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

            </Grid>
        </Grid>
        </>
    );
}

export default User;