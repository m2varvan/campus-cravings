import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Button, Alert } from '@mui/material';
import ReviewSort from "./ReviewSort";
import HelpfulReview from "./HelpfulReview";

const sortReviews = (reviews, sortType) => {
  const sorted = [...reviews];
  switch(sortType) {
    case "newest":
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case "oldest":
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case "mostHelpful":
      sorted.sort((a, b) => Number(b.helpful_votes) - Number(a.helpful_votes));
      break;
    case "leastHelpful":
      sorted.sort((a, b) => Number(a.helpful_votes) - Number(b.helpful_votes));
      break;
    default:
      break;
  }
  return sorted;
};

function RestaurantReview({ restaurantID, uuid }) { // uuid added for HelpfulReview

  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [sortType, setSortType] = useState("newest");

  useEffect(() => {
    setError('');

    fetch(`/api/restaurant/${restaurantID}/reviews?userID=${uuid}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(() => setError('Failed to load reviews.'));
  }, [restaurantID]);

  // STEP 1: Sort reviews
  const sortedReviews = sortReviews(reviews, sortType);

  // STEP 2: Apply show more / show less
  const visibleReviews = showAll
    ? sortedReviews
    : sortedReviews.slice(0, 5);

  return (
    <Box mt={3}>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        All Deal Reviews
      </Typography>

      <ReviewSort
        sortType={sortType}
        setSortType={setSortType}
      />

      {error && <Alert severity="error">{error}</Alert>}

      {reviews.length === 0 && !error && (
        <Typography>No reviews yet.</Typography>
      )}

      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          pr: 1
        }}
      >

        {visibleReviews.map((review) => (
          <Box
            key={review.review_id}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              mb: 2
            }}
          >

            <Typography variant="subtitle1" fontWeight="bold">
              {review.title}
            </Typography>

            <Typography
              variant="body2"
              color="primary.dark"
              sx={{ mb: 0.5 }}
            >
              Deal: {review.deal_name}
            </Typography>

            <Typography variant="body2" gutterBottom>
              {review.body}
            </Typography>

            
            <HelpfulReview
              reviewID={review.review_id}
              helpfulVotes={review.helpful_votes}
              user={uuid}
              userVoted={review.user_voted}
            />

            <Typography variant="caption" display="block">
              Posted by {review.username} on {review.created_at}
              {review.edited_at &&
                review.edited_at !== review.created_at && (
                  <> (Edited on {review.edited_at})</>
              )}
            </Typography>

          </Box>
        ))}

      </Box>

      {reviews.length > 5 && (
        <Box textAlign="center" mt={2}>
          <Button onClick={() => setShowAll(prev => !prev)}>
            {showAll ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
      )}

    </Box>
  );
}

export default RestaurantReview;