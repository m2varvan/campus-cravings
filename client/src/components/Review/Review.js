import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Alert } from '@mui/material';
import HelpfulReview from './HelpfulReview';
import ReviewSort from './ReviewSort';


const sortReviews = (reviews, sortType) => {

  const sorted = [...reviews];

  switch(sortType){

    case "newest":
      sorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      break;

    case "oldest":
      sorted.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
      break;

    case "mostHelpful":
      sorted.sort((a,b) => b.helpful_votes - a.helpful_votes);
      break;

    case "leastHelpful":
      sorted.sort((a,b) => a.helpful_votes - b.helpful_votes);
      break;

    default:
      break;
  }

  return sorted;
};


function Review({ uuid, dealID }) {
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [sortType, setSortType] = useState('newest');
  const sortedReviews = sortReviews(reviews, sortType);
  const visibleReviews = showAll ? sortedReviews : sortedReviews.slice(0,3);

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
      const res = await fetch('/api/add/review', { 
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

  const handleDelete = async (reviewID) => {
  const res = await fetch(`/api/review/${reviewID}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    setReviews(reviews.filter(r => r.review_id !== reviewID));
    setSuccess('Review deleted successfully.');

  }
};

  const handleEdit = (review) => {
    setEditingReviewId(review.review_id);
    setEditTitle(review.title);
    setEditBody(review.body);
  };

  const handleSave = async (reviewID) => {
    setError('');
    setSuccess('');

    if (!editTitle.trim() || !editBody.trim()) {
      setError('Title and body are required.');
      return;
    }

    if (editTitle.length > 250) {
      setError('Title cannot exceed 250 characters.');
      return;
    }

    if (editBody.length > 1000) {
      setError('Review cannot exceed 1000 characters.');
      return;
    }

    try {
      const res = await fetch(`/api/review/${reviewID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          body: editBody
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update review.');
        return;
      }

      // Refresh reviews from server so edited_at is correct
      const refreshed = await fetch(`/api/deal/${dealID}/reviews`);
      const refreshedData = await refreshed.json();
      setReviews(refreshedData);

      setEditingReviewId(null);
      setSuccess('Review updated successfully.');

    } catch {
      setError('Server error.');
    }
  };

  const handleCancel = () => {
    setEditingReviewId(null);
  };

  return (
    <Box mt={4}>

      <Divider sx={{ my: 2 }} />

      <Typography
      variant="h6" gutterBottom
      sx={{ mb: 1 }}
      >Write a Review</Typography>

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

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Reviews
      </Typography>

      <ReviewSort
        sortType={sortType}
        setSortType={setSortType}
      />

      {reviews.length === 0 && (
        <Typography>No reviews yet.</Typography>
      )}

    {visibleReviews.map((review) => (
  <Box key={review.review_id} mb={2}>

    {editingReviewId === review.review_id ? (

      <>
        <TextField
          fullWidth
          label="Edit Title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          inputProps={{ maxLength: 250 }}
          sx={{ mb: 1 }}
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Edit Review"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          inputProps={{ maxLength: 1000 }}
          sx={{ mb: 1 }}
        />

        <Button
          variant="contained"
          size="small"
          onClick={() => handleSave(review.review_id)}
          sx={{ mr: 1 }}
        >
          Save
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </>

    ) : (

      <>
        <Typography variant="subtitle1" fontWeight="bold">
          {review.title}
        </Typography>

        <Typography variant="body2" gutterBottom>
          {review.body}
        </Typography>

        <HelpfulReview
          reviewID={review.review_id}
          helpfulVotes={review.helpful_votes}
          user={uuid}
        />

        <Typography variant="caption" display="block" gutterBottom>
          Posted by {review.username} on {review.created_at}
        </Typography>

        {uuid === review.user_id && (
          <>
            <Button
              size="small"
              onClick={() => handleEdit(review)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>

            <Button
              size="small"
              color="error"
              onClick={() => handleDelete(review.review_id)}
            >
              Delete
            </Button>
          </>
        )}
      </>
    )}

  </Box>
))}

  {reviews.length > 3 && (
  <Box textAlign="center" mt={2}>
    <Button onClick={() => setShowAll(prev => !prev)}>
      {showAll ? 'Show Less' : 'Show More'}
    </Button>
  </Box>
  )}
    </Box>
  );
}

export default Review;