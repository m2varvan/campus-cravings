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

import loadUserInfo from "../../APIs/loadUserInfo";
import loadOwnerRestaurants from "../../APIs/loadOwnerRestaurants";
import loadOwnerDeals from "../../APIs/loadOwnerDeals";
import { getUserRatings } from "../../APIs/getUserRatings";
import { getUserReviews } from "../../APIs/getUserReviews";

const Owner = ({ uuid }) => {
  const [searchParams] = useSearchParams();
  const profileUserID = searchParams.get("id") || uuid;
  const isOwnProfile = profileUserID === uuid;

  // Shared state
  const [userInfo, setUserInfo] = React.useState(null);

  // Dashboard state
  const [ownerRestaurants, setOwnerRestaurants] = React.useState([]);
  const [ownerDeals, setOwnerDeals] = React.useState([]);
  const [openCreateDeal, setOpenCreateDeal] = React.useState(false);

  // Profile state
  const [userRatings, setUserRatings] = React.useState([]);
  const [userReviews, setUserReviews] = React.useState([]);

  // Follow system state
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

  // Follow status
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

  // Follow counts
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

          {/* Followers */}
          <Box sx={{ display: "flex", gap: 2, pb: 2 }}>
            <Button onClick={() => openModal("followers")}>
              <strong>{followerCount}</strong> Followers
            </Button>
            <Button onClick={() => openModal("following")}>
              <strong>{followingCount}</strong> Following
            </Button>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid container item xs={12} spacing={2}>
          {/* Left Side */}
          <Grid item xs={12} md={4}>
            <UserInfo
              uuid={profileUserID}
              loadUserInfo={loadUserInfo}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
            />
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={8}>

            {/* Dashboard (OWN PROFILE) */}
            {isOwnProfile && (
              <>
                <Box sx={{ pb: 2 }}>
                  <Button variant="contained" onClick={() => setOpenCreateDeal(true)}>
                    + Post New Deal
                  </Button>
                </Box>

                <OwnerDealList
                  uuid={uuid}
                  loadOwnerDeals={loadOwnerDeals}
                  ownerDeals={ownerDeals}
                  setOwnerDeals={setOwnerDeals}
                />

                <OwnerRestaurantList
                  uuid={uuid}
                  loadOwnerRestaurants={loadOwnerRestaurants}
                  ownerRestaurants={ownerRestaurants}
                  setOwnerRestaurants={setOwnerRestaurants}
                />

                <CreateDealDialog
                  open={openCreateDeal}
                  handleClose={() => setOpenCreateDeal(false)}
                  uuid={uuid}
                  ownerRestaurants={ownerRestaurants}
                  onDealCreated={reloadDeals}
                />
              </>
            )}

            {/* Profile (OTHER USERS) */}
            {!isOwnProfile && (
              <>
                <UserRatingList
                  uuid={profileUserID}
                  loadUserRatings={getUserRatings}
                  setUserRatings={setUserRatings}
                  userRatings={userRatings}
                  readOnly
                />

                <UserReviewList
                  uuid={profileUserID}
                  loadUserReviews={getUserReviews}
                  setUserReviews={setUserReviews}
                  userReviews={userReviews}
                  readOnly
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