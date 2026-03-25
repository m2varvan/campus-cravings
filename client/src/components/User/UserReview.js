import { Typography, Button, Box, TextField, Alert } from "@mui/material";
import React, { useState } from "react";

const UserReview = ({ review, uuid, onDelete, onUpdate }) => {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const handleDelete = async (reviewID) => {
    try {
      const res = await fetch(`/api/review/${reviewID}`, { method: 'DELETE' });

      if (res.ok) {
        onDelete(reviewID); // update parent state
        setSuccess('Review deleted successfully.');
      } else {
        setError('Failed to delete review.');
      }
    } catch {
      setError('Server error.');
    }
  };

  const handleEdit = () => {
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
        headers: { 'Content-Type': 'application/json' },
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

      onUpdate(data); // update parent
      setEditingReviewId(null);
      setSuccess('Review updated successfully.');

    } catch {
      setError('Server error.');
    }
  };

  const handleCancel = () => setEditingReviewId(null);

  return (
    <Box mt={2}>

      <Box
        sx={{
          border: '3px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 0.5,
          mb: 0.5
        }}
      >

        {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

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
            <Typography variant="h6" color="text.secondary">
                {review.deal_name} •{' '}
                <Box component="span" sx={{ fontStyle: 'italic' }}>
                    {review.restaurant_name}
                </Box>
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
                {review.title}
            </Typography>

            <Typography variant="body2" gutterBottom>
              {review.body}
            </Typography>

            <Typography variant="caption" display="block" gutterBottom>
              Posted by {review.username} on {review.created_at}
              {review.edited_at && review.edited_at !== review.created_at &&
                <> (Edited on {review.edited_at})</>}
            </Typography>

            {uuid === review.user_id && (
              <>
                <Button
                  size="small"
                  onClick={handleEdit}
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
    </Box>
  );
};

export default UserReview;