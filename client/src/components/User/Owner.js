import React from "react";
import { Typography, Box, CircularProgress, Grid, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import UserInfo from "./UserInfo";
import OwnerRestaurantList from "./OwnerRestaurantList";
import OwnerDealList from "./OwnerDealList";
import CreateDealDialog from "./CreateDealDialog";
import FollowButton from "./FollowButton";
import FollowersFollowingModal from "./FollowersFollowingModal";
import UserRatingList from "./UserRatingList";
import UserReviewList from "./UserReviewList";
import FavouriteDealList from "./FavouriteDealList";
import FavouriteRestaurantList from "./FavouriteRestaurantList";

import loadUserInfo from "../../APIs/loadUserInfo";
import loadOwnerRestaurants from "../../APIs/loadOwnerRestaurants";
import loadOwnerDeals from "../../APIs/loadOwnerDeals";
import loadFaveDeals from "../../APIs/loadFaveDeals";
import loadFaveRestaurants from "../../APIs/loadFaveRestaurants";
import { getUserRatings } from "../../APIs/getUserRatings";
import { getUserReviews } from "../../APIs/getUserReviews";

const Owner = ({ uuid }) => {
  const [searchParams] = useSearchParams();
  const profileUserID = searchParams.get("id") || uuid;
  const isOwnProfile = profileUserID === uuid;

  const [userInfo, setUserInfo] = React.useState(null);
  const profileName = userInfo ? userInfo.firstName : null;

  // Dashboard state
  const [ownerRestaurants, setOwnerRestaurants] = React.useState([]);
  const [ownerDeals, setOwnerDeals] = React.useState([]);
  const [openCreateDeal, setOpenCreateDeal] = React.useState(false);

  // Favourite profile state
  const [faveDeals, setFaveDeals] = React.useState([]);
  const [faveRestaurants, setFaveRestaurants] = React.useState([]);

  // Profile state
  const [userRatings, setUserRatings] = React.useState([]);
  const [userReviews, setUserReviews] = React.useState([]);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [loadingFollow, setLoadingFollow] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(0);
  const [followingCount, setFollowingCount] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("followers");

  const reloadDeals = async () => {
    const deals = await loadOwnerDeals(uuid);
    setOwnerDeals(deals);
  };

  React.useEffect(() => {
    if (!isOwnProfile && uuid && profileUserID) {
      setLoadingFollow(true);
      fetch("/api/follow/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerID: uuid, followingID: profileUserID }),
      })
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.isFollowing))
        .catch(console.error)
        .finally(() => setLoadingFollow(false));
    }
  }, [uuid, profileUserID, isOwnProfile]);

  React.useEffect(() => {
    if (!profileUserID) return;
    fetch("/api/follow/counts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: profileUserID }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowerCount(data.followers || 0);
        setFollowingCount(data.following || 0);
      })
      .catch(console.error);
  }, [profileUserID]);

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const pageTitle = isOwnProfile
    ? "Owner Dashboard"
    : userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}'s Profile`
    : "Owner Profile";

  return (
    <>
       <Grid container px={8} py={4}>

        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ pb: 1, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h3">{pageTitle}</Typography>
            {!isOwnProfile && !loadingFollow && (
              <FollowButton uuid={uuid} targetUserID={profileUserID} initialFollow={isFollowing} />
            )}
            {!isOwnProfile && loadingFollow && <CircularProgress size={24} />}
          </Box>

          {/* Followers + Post New Deal (aligned right for owners) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              pb: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
              <Button
                variant="text"
                onClick={() => openModal("followers")}
                sx={{
                    mr: 1,
                    color: 'text.primary',
                    '&:hover': {
                    backgroundColor: 'grey.100',
                    },
                }} 
              >
                {`${followerCount} ${followerCount === 1 ? 'Follower' : 'Followers'}`}
              </Button>

              <Button
                variant="text"
                onClick={() => openModal("following")}
                sx={{
                    mr: 1,
                    color: 'text.primary',
                    '&:hover': {
                    backgroundColor: 'grey.100',
                    },
                }} 
              >
                {`${followingCount} Following`}
              </Button>
            </Box>
            {isOwnProfile && (
              <Button variant="contained" onClick={() => setOpenCreateDeal(true)}>
                + Post New Deal
              </Button>
            )}
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid container item xs={12} spacing={2}>
          {/* Left Side */}
          <Grid item xs={12} md={6}>
            <UserInfo
              uuid={profileUserID}
              loadUserInfo={loadUserInfo}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
              isOwnProfile={isOwnProfile}
            />

            {isOwnProfile && (
              <>
                <Box mt={2}>
                  <UserRatingList
                    uuid={profileUserID}
                    loadUserRatings={getUserRatings}
                    setUserRatings={setUserRatings}
                    userRatings={userRatings}
                    readOnly={false}
                    profileName={profileName}
                  />
                </Box>

                <Box mt={2}>
                  <UserReviewList
                    uuid={profileUserID}
                    loadUserReviews={getUserReviews}
                    setUserReviews={setUserReviews}
                    userReviews={userReviews}
                    readOnly={false}
                    profileName={profileName}
                  />
                </Box>
              </>
            )}

            {!isOwnProfile && (
              <>
                <Box mt={2}>
                  <UserRatingList
                    uuid={profileUserID}
                    loadUserRatings={getUserRatings}
                    setUserRatings={setUserRatings}
                    userRatings={userRatings}
                    readOnly
                    profileName={profileName}
                  />
                </Box>

                <Box mt={2}>
                  <UserReviewList
                    uuid={profileUserID}
                    loadUserReviews={getUserReviews}
                    setUserReviews={setUserReviews}
                    userReviews={userReviews}
                    readOnly
                    profileName={profileName}
                  />
                </Box>
              </>
            )}
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={6}>
            {isOwnProfile ? (
              <>
                <Box mb={2}>
                  <OwnerDealList
                    uuid={uuid}
                    loadOwnerDeals={loadOwnerDeals}
                    ownerDeals={ownerDeals}
                    setOwnerDeals={setOwnerDeals}
                  />
                </Box>

                <OwnerRestaurantList
                  uuid={uuid}
                  loadOwnerRestaurants={loadOwnerRestaurants}
                  ownerRestaurants={ownerRestaurants}
                  setOwnerRestaurants={setOwnerRestaurants}
                />

                <Box mt={2}>
                  <FavouriteDealList
                    uuid={profileUserID}
                    loadFaveDeals={loadFaveDeals}
                    faveDeals={faveDeals}
                    setFaveDeals={setFaveDeals}
                    profileName={null}
                  />
                </Box>

                <Box mt={2}>
                  <FavouriteRestaurantList
                    uuid={profileUserID}
                    loadFaveRestaurants={loadFaveRestaurants}
                    faveRestaurants={faveRestaurants}
                    setFaveRestaurants={setFaveRestaurants}
                    profileName={null}
                  />
                </Box>

                <CreateDealDialog
                  open={openCreateDeal}
                  handleClose={() => setOpenCreateDeal(false)}
                  uuid={uuid}
                  ownerRestaurants={ownerRestaurants}
                  onDealCreated={reloadDeals}
                />
              </>
            ) : (
              <>
                <Box mb={2}>
                  <FavouriteDealList
                    uuid={profileUserID}
                    loadFaveDeals={loadFaveDeals}
                    faveDeals={faveDeals}
                    setFaveDeals={setFaveDeals}
                    profileName={profileName}
                  />
                </Box>

                <FavouriteRestaurantList
                  uuid={profileUserID}
                  loadFaveRestaurants={loadFaveRestaurants}
                  faveRestaurants={faveRestaurants}
                  setFaveRestaurants={setFaveRestaurants}
                  profileName={profileName}
                />
              </>
            )}
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

export default Owner;