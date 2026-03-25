import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

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
import FollowButton from './FollowButton';

const User = ({ uuid }) => {

  const [searchParams] = useSearchParams();
  // If ?id= is present we are viewing someone else's profile; otherwise own profile
  const profileUserID = searchParams.get('id') || uuid;
  const isOwnProfile = !searchParams.get('id') || searchParams.get('id') === uuid;

  const [userInfo, setUserInfo] = React.useState(null);
  const [faveDeals, setFaveDeals] = React.useState([]);
  const [faveRestaurants, setFaveRestaurants] = React.useState([]);
  const [userRatings, setUserRatings] = React.useState([]);
  const [userReviews, setUserReviews] = React.useState([]);

  // Follow state for public profiles
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [loadingFollow, setLoadingFollow] = React.useState(false);

  // Load follow status when viewing another user's profile
  React.useEffect(() => {
    if (!isOwnProfile && uuid && profileUserID) {
      setLoadingFollow(true);
      fetch('/api/follow/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerID: uuid, followingID: profileUserID }),
      })
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.isFollowing))
        .catch((err) => console.error('Failed to load follow status:', err))
        .finally(() => setLoadingFollow(false));
    }
  }, [uuid, profileUserID, isOwnProfile]);

  const pageTitle = isOwnProfile ? 'My Account' : (userInfo ? `${userInfo.firstName} ${userInfo.lastName}'s Profile` : 'User Profile');

  return (
    <>
      <Grid container p={4}>

        {/* Page Title + Follow Button */}
        <Grid item xs={12}>
          <Box sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3">{pageTitle}</Typography>

            {/* Follow/Unfollow button — only shown when viewing someone else's profile */}
            {!isOwnProfile && !loadingFollow && (
              <FollowButton
                uuid={uuid}
                targetUserID={profileUserID}
                initialFollow={isFollowing}
              />
            )}
            {!isOwnProfile && loadingFollow && <CircularProgress size={24} />}
          </Box>
        </Grid>

        {/* Row */}
        <Grid container item xs={12} spacing={2}>

          {/* Left Column - User Info + Ratings + Reviews */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <UserInfo
                  uuid={profileUserID}
                  loadUserInfo={loadUserInfo}
                  setUserInfo={setUserInfo}
                  userInfo={userInfo}
                />
              </Grid>

              <Grid item xs={12}>
                <UserRatingList
                  uuid={profileUserID}
                  loadUserRatings={getUserRatings}
                  setUserRatings={setUserRatings}
                  userRatings={userRatings}
                  readOnly={!isOwnProfile}
                />
              </Grid>

              <Grid item xs={12}>
                <UserReviewList
                  uuid={profileUserID}
                  loadUserReviews={getUserReviews}
                  setUserReviews={setUserReviews}
                  userReviews={userReviews}
                  readOnly={!isOwnProfile}
                />
              </Grid>

            </Grid>
          </Grid>

          {/* Right Column - Favourites (only on own profile) */}
          {isOwnProfile && (
            <Grid item xs={12} md={6}>
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
          )}

        </Grid>
      </Grid>
    </>
  );
};

export default User;