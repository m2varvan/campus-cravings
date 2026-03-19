import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import UserInfo from './UserInfo';
import OwnerRestaurantList from './OwnerRestaurantList';
import loadUserInfo from '../../APIs/loadUserInfo';
import loadOwnerRestaurants from '../../APIs/loadOwnerRestaurants';

const Owner = ({ uuid }) => {
    const [userInfo, setUserInfo] = React.useState(null);
    const [ownerRestaurants, setOwnerRestaurants] = React.useState([]);

    return (
        <Grid container p={4}>
            <Grid item xs={12}>
                <Box sx={{ pb: 2 }}>
                    <Typography variant="h3">Owner Dashboard</Typography>
                </Box>
            </Grid>

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

                {/* Right Column - Owner Restaurants */}
                <Grid item xs={12} md={8}>
                    <OwnerRestaurantList
                        uuid={uuid}
                        loadOwnerRestaurants={loadOwnerRestaurants}
                        ownerRestaurants={ownerRestaurants}
                        setOwnerRestaurants={setOwnerRestaurants}
                    />
                </Grid>

            </Grid>
        </Grid>
    );
};

export default Owner;