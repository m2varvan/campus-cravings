import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const ReviewDeal = ({ dealID, uuid, reloadReviews }) => {

    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {

        if (!uuid) {
            setError("You must be logged in to leave a review.");
            return;
        }

        if (!reviewText.trim()) {
            setError("Review cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`/api/deal/${dealID}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reviewText,
                    uuid
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            setReviewText("");
            setError("");
            reloadReviews();

        } catch (err) {
            setError("Something went wrong.");
        }
    };

    return (
        <Box mt={2}>
            <Typography variant="h6">Leave a Review</Typography>

            <TextField
                fullWidth
                multiline
                minRows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                sx={{ my: 1 }}
            />

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
            >
                Submit Review
            </Button>
        </Box>
    );
};

export default ReviewDeal;