import React from "react";
import { Typography, Box, CircularProgress, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import FollowButton from "./FollowButton";
import loadUserInfo from "../../APIs/loadUserInfo";
import UserInfo from "./UserInfo";
import UserRatingList from "./UserRatingList";
import UserReviewList from "./UserReviewList";
import { getUserRatings } from "../../APIs/getUserRatings";
import { getUserReviews } from "../../APIs/getUserReviews";

const Owner = ({ uuid }) => {
  const [searchParams] = useSearchParams();
  const profileUserID = searchParams.get("id") || uuid;
  const isOwnProfile = !searchParams.get("id") || searchParams.get("id") === uuid;

  const [userInfo, setUserInfo] = React.useState(null);
  const [userRatings, setUserRatings] = React.useState([]);
  const [userReviews, setUserReviews] = React.useState([]);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [loadingFollow, setLoadingFollow] = React.useState(false);

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
        .catch((err) => console.error("Failed to load follow status:", err))
        .finally(() => setLoadingFollow(false));
    }
  }, [uuid, profileUserID, isOwnProfile]);

  const pageTitle = isOwnProfile
    ? "My Owner Account"
    : userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}'s Profile`
    : "Owner Profile";

  return (
    <Grid container p={4}>

      {/* Page Title + Follow Button */}
      <Grid item xs={12}>
        <Box sx={{ pb: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h3">{pageTitle}</Typography>

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

      <Grid container item xs={12} spacing={2}>
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
      </Grid>
    </Grid>
  );
};

export default Owner;