import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import UserInfo from './UserInfo';
import OwnerRestaurantList from './OwnerRestaurantList';
import OwnerDealList from './OwnerDealList';
import CreateDealDialog from './CreateDealDialog';
import loadUserInfo from '../../APIs/loadUserInfo';
import loadOwnerRestaurants from '../../APIs/loadOwnerRestaurants';
import loadOwnerDeals from '../../APIs/loadOwnerDeals';

const Owner = ({ uuid }) => {
    const [userInfo, setUserInfo] = React.useState(null);
    const [ownerRestaurants, setOwnerRestaurants] = React.useState([]);
    const [ownerDeals, setOwnerDeals] = React.useState([]);
    const [openCreateDeal, setOpenCreateDeal] = React.useState(false);

    const reloadDeals = async () => {
        const deals = await loadOwnerDeals(uuid);
        setOwnerDeals(deals);
    };

    return (
        <Grid container p={4}>
            <Grid item xs={12}>
                <Box sx={{ pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h3">Owner Dashboard</Typography>
                    <Button variant="contained" onClick={() => setOpenCreateDeal(true)}>
                        + Post New Deal
                    </Button>
                </Box>
            </Grid>

            <Grid container item xs={12} spacing={2}>
                <Grid item xs={12} md={4}>
                    <UserInfo uuid={uuid} loadUserInfo={loadUserInfo}
                        setUserInfo={setUserInfo} userInfo={userInfo} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <OwnerDealList uuid={uuid} loadOwnerDeals={loadOwnerDeals}
                                ownerDeals={ownerDeals} setOwnerDeals={setOwnerDeals} />
                        </Grid>
                        <Grid item xs={12}>
                            <OwnerRestaurantList uuid={uuid} loadOwnerRestaurants={loadOwnerRestaurants}
                                ownerRestaurants={ownerRestaurants} setOwnerRestaurants={setOwnerRestaurants} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <CreateDealDialog
                open={openCreateDeal}
                handleClose={() => setOpenCreateDeal(false)}
                uuid={uuid}
                ownerRestaurants={ownerRestaurants}
                onDealCreated={reloadDeals}
            />
        </Grid>
    );
};

export default Owner;