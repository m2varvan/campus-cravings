import React from 'react';
import UserInfo from './UserInfo';
import FavouriteDeals from './FavouriteDeals';
import FavouriteRestaurant from './FavouriteRestaurants';
import loadUserInfo from '../../APIs/loadUserInfo';
import loadFaveDeals from '../../APIs/loadFaveDeals';
import loadFaveRestaurants from '../../APIs/loadFaveRestaurants';

const User = ({uuid}) => {

    return(
        <>
            <p>User Page</p>
            <UserInfo uuid={uuid} loadUserInfo={loadUserInfo}/>
            <FavouriteDeals uuid={uuid} loadFaveDeals={loadFaveDeals} />
            <FavouriteRestaurant uuid={uuid} loadFaveRestaurants={loadFaveRestaurants} />
        </>
        
    );
}

export default User;