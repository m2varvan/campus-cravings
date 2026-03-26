import React from 'react';
import { Grid, Typography, Box, CircularProgress, Button } from '@mui/material';
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
import FollowersFollowingModal from './FollowersFollowingModal';

const User = ({ uuid }) => {

  const [searchParams] = useSearchParams();
  const profileUserID = searchParams.get('id') || uuid;
  const isOwnProfile = !searchParams.get('id') || searchParams.get('id') === uuid;

  const [userInfo, setUserInfo] = React.useState(null);
  const [faveDeals, setFaveDeals] = React.useState([]);
  const [faveRestaurants, setFaveRestaurants] = React.useState([]);
  const [userRatings, setUserRatings] = React.useState([]);
  const [userReviews, setUserReviews] = React.useState([]);

  const profileName = userInfo ? userInfo.firstName : null;

  const [isFollowing, setIsFollowing] = React.useState(false);
  const [loadingFollow, setLoadingFollow] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(0);
  const [followingCount, setFollowingCount] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("followers");

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

  React.useEffect(() => {
    if (!profileUserID) return;
    fetch('/api/follow/counts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: profileUserID }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowerCount(data.followers || 0);
        setFollowingCount(data.following || 0);
      })
      .catch((err) => console.error('Failed to load follow counts:', err));
  }, [profileUserID]);

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const pageTitle = isOwnProfile
    ? 'My Account'
    : userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}'s Profile`
    : 'User Profile';

  return (
    <>
       <Grid container px={8} py={4}>

        <Grid item xs={12}>
          <Box sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h3">{pageTitle}</Typography>
            {!isOwnProfile && !loadingFollow && (
              <FollowButton 
                uuid={uuid} 
                targetUserID={profileUserID} 
                initialFollow={isFollowing} 
                setFollowerCount={setFollowerCount} />
            )}
            {!isOwnProfile && loadingFollow && <CircularProgress size={24} />}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
            <Button
              variant="text"
              onClick={() => openModal("followers")}
            >
              {`${followerCount} ${followerCount === 1 ? 'Follower' : 'Followers'}`}
            </Button>

            <Button
              variant="text"
              onClick={() => openModal("following")}
            >
              {`${followingCount} Following`}
            </Button>
          </Box>
        </Grid>

        <Grid container item xs={12} spacing={2}>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <UserInfo
                  uuid={profileUserID}
                  loadUserInfo={loadUserInfo}
                  setUserInfo={setUserInfo}
                  userInfo={userInfo}
                  isOwnProfile={isOwnProfile}
                />
              </Grid>
              <Grid item xs={12}>
                <UserRatingList
                  uuid={profileUserID}
                  loadUserRatings={getUserRatings}
                  setUserRatings={setUserRatings}
                  userRatings={userRatings}
                  readOnly={!isOwnProfile}
                  profileName={profileName}
                />
              </Grid>
              <Grid item xs={12}>
                <UserReviewList
                  uuid={profileUserID}
                  loadUserReviews={getUserReviews}
                  setUserReviews={setUserReviews}
                  userReviews={userReviews}
                  readOnly={!isOwnProfile}
                  profileName={profileName}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FavouriteDealList
                  uuid={profileUserID}
                  loadFaveDeals={loadFaveDeals}
                  faveDeals={faveDeals}
                  setFaveDeals={setFaveDeals}
                  profileName={profileName}
                />
              </Grid>
              <Grid item xs={12}>
                <FavouriteRestaurantList
                  uuid={profileUserID}
                  loadFaveRestaurants={loadFaveRestaurants}
                  setFaveRestaurants={setFaveRestaurants}
                  faveRestaurants={faveRestaurants}
                  profileName={profileName}
                />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Grid>

      <FollowersFollowingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        userID={profileUserID}
      />
    </>
  );
};

export default User;