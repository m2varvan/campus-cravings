import React from 'react';
import {Grid, Typography, Box} from '@mui/material';

import UserInfo from './UserInfo';
import FavouriteDealList from './FavouriteDealList';
import FavouriteRestaurantList from './FavouriteRestaurantList';
import loadUserInfo from '../../APIs/loadUserInfo';
import loadFaveDeals from '../../APIs/loadFaveDeals';
import loadFaveRestaurants from '../../APIs/loadFaveRestaurants';
import UserRatingList from './UserRatingList';
import UserReviewList from './UserReviewList';
import { getUserRatings } from '../../APIs/getUserRatings';
import { getUserReviews } from '../../APIs/getUserReviews';

const User = ({uuid}) => {

    const [userInfo, setUserInfo] = React.useState(null)
    const [faveDeals, setFaveDeals] = React.useState([])
    const [faveRestaurants, setFaveRestaurants] = React.useState([])
    const [userRatings, setUserRatings] = React.useState([])
    const [userReviews, setUserReviews] = React.useState([])

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
            
            <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <UserInfo 
                        uuid={uuid}
                        loadUserInfo={loadUserInfo}
                        setUserInfo={setUserInfo}
                        userInfo={userInfo}
                    />
                    </Grid>

                    <Grid item xs={12}>
                        <UserRatingList 
                            uuid={uuid}
                            loadUserRatings={getUserRatings}
                            setUserRatings={setUserRatings}
                            userRatings={userRatings}
                            />
                    </Grid>
                    

                    <Grid item xs={12}>
                        <UserReviewList 
                            uuid={uuid}
                            loadUserReviews={getUserReviews}
                            setUserReviews={setUserReviews}
                            userReviews={userReviews}
                            />
                    </Grid>
                    
                </Grid>
            </Grid>

            {/* Right Column - Favourites */}
            
            <Grid item xs={12} md={6} >

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