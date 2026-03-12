import React from "react";
import { Stack, IconButton, Typography, Alert } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

const HelpfulReview = ({ reviewID, helpfulVotes = 0, user }) => {

  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(helpfulVotes);
  const [error, setError] = React.useState("");

  const onHelpful = async () => {

    // User not logged in
    if (!user) {
      setError("You must be logged in to mark reviews as helpful.");
      return;
    }

    setError("");

    try {

      const res = await fetch("/api/review/helpful", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviewID,
          userID: user
        })
      });

      if (!res.ok) {
        throw new Error("Vote failed");
      }

      if (!liked) {
        setCount(prev => prev + 1);
      } else {
        setCount(prev => prev - 1);
      }

      setLiked(!liked);

    } catch (err) {
      console.error("Helpful vote failed", err);
      setError("Failed to record vote.");
    }

  };

  return (

    <>
      <Stack direction="row" alignItems="center" spacing={0}>

        <IconButton
          size="small"
          aria-label="helpful review"
          onClick={onHelpful}
        >
          {liked ? (
            <ThumbUpIcon
              fontSize="small"
              sx={{ color: "success.main" }}
            />
          ) : (
            <ThumbUpOutlinedIcon fontSize="small" />
          )}
        </IconButton>

        <Typography variant="subtitle2">
          {count}
        </Typography>

      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 1 }}
        >
          {error}
        </Alert>
      )}

    </>
  );
};

export default HelpfulReview;