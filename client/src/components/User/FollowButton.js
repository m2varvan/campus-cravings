import React from "react";
import { Button, Alert, Box } from "@mui/material";

const FollowButton = ({ uuid, targetUserID, initialFollow }) => {

  const [isFollowing, setIsFollowing] = React.useState(initialFollow);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setIsFollowing(initialFollow);
  }, [initialFollow]);

  // Don't render anything if the user is viewing their own profile
  if (!uuid || uuid === targetUserID) return null;

  const handleClick = async () => {
    setError("");
    setLoading(true);

    const endpoint = isFollowing ? "/api/unfollow" : "/api/follow";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerID: uuid, followingID: targetUserID }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Action failed. Please try again.");
        return;
      }

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow/unfollow error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={loading}
        sx={{
          bgcolor: isFollowing ? "secondary.main" : "#FFC107",
          color: isFollowing ? "white" : "#000000",
          fontWeight: 600,
          "&:hover": {
            bgcolor: isFollowing ? "secondary.dark" : "#FFA000",
            color: isFollowing ? "white" : "#000000",
          },
        }}
      >
        {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FollowButton;