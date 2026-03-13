import React from "react";
import { Stack, IconButton, Typography, Alert } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

const HelpfulReview = ({ reviewID, helpfulVotes = 0, user, userVoted }) => {

  const [liked, setLiked] = React.useState(userVoted);
  const [count, setCount] = React.useState(helpfulVotes);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLiked(userVoted);
  }, [userVoted]);

  React.useEffect(() => {
    setCount(helpfulVotes);
  }, [helpfulVotes]);

  const onHelpful = async () => {

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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Vote failed");
        return;
      }

      if (data.voted) {
        setLiked(true);
        setCount(prev => prev + 1);
      } else {
        setLiked(false);
        setCount(prev => prev - 1);
      }

    } catch (err) {
      console.error(err);
      setError("Server error.");
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
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default HelpfulReview;