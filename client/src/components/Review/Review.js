import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';

function Review({ uuid, dealID }) {
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

useEffect(() => {
  setError('');
  fetch(`/api/deal/${dealID}/reviews`) // GET
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    })
    .then(data => setReviews(data))
    .catch(() => setError('Failed to load reviews.'));
}, [dealID]);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!uuid) {
      setError('Please log in to submit a review.');
      return;
    }

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }

    if (title.length > 250) {
      setError('Title cannot exceed 250 characters.');
      return;
    }

    if (body.length > 1000) {
      setError('Review cannot exceed 1000 characters.');
      return;
    }

    try {
      const res = await fetch('/api/add/review', { // <-- remove localhost
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dealID,
            userID: uuid,
            title,
            body
            })
        });

      const newReview = await res.json();

      if (!res.ok) {
        setError(newReview.error || 'Failed to submit review.');
        return;
      }

      setReviews([newReview, ...reviews]);
      setTitle('');
      setBody('');
      setSuccess('Review submitted successfully.');
    } catch {
      setError('Server error.');
    }
  };

  return (
    <Box mt={4}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Reviews
      </Typography>

      {reviews.length === 0 && (
        <Typography>No reviews yet.</Typography>
      )}

      {reviews.map(review => (
        <Box key={review.review_id} mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {review.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {review.body}
          </Typography>
          <Typography variant="caption">
            Posted by {review.user_id} on {review.created_at_formatted}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Write a Review</Typography>

      {!uuid && (
        <Typography color="error">
          Please log in to submit a review.
        </Typography>
      )}

      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        inputProps={{ maxLength: 250 }}
        disabled={!uuid}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Review"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        inputProps={{ maxLength: 1000 }}
        disabled={!uuid}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!uuid}
      >
        Submit Review
      </Button>

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="primary" mt={1}>
          {success}
        </Typography>
      )}
    </Box>
  );
}

export default Review;