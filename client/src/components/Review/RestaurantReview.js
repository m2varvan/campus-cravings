import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Button, Alert } from '@mui/material';

function RestaurantReview({ restaurantID }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setError('');

    fetch(`/api/restaurant/${restaurantID}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(() => setError('Failed to load reviews.'));
  }, [restaurantID]);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 5);

  return (
    <Box mt={3}>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        All Deal Reviews
      </Typography>

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
          <Box key={review.review_id} mb={2}>

            <Typography variant="subtitle1" fontWeight="bold">
              {review.title}
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{ mb: 0.5 }}
            >
              Deal: {review.deal_name}
            </Typography>

            <Typography variant="body2" gutterBottom>
              {review.body}
            </Typography>

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