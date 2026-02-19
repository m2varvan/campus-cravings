import { Typography, Button, Box, Rating } from '@mui/material';
import React, { useState } from 'react';

const RateDealButtons = ({ uuid, dealID, prevRating, setShowButtons, setErrorMsg, setSuccessMsg, refreshRatings, updateRatings }) => {

    // States to hold values of rating buttons
    const [taste, setTaste] = useState(prevRating ? prevRating.tasteRating : 2.5);
    const [value, setValue] = useState(prevRating ? prevRating.valueRating : 2.5);
    const [portion, setPortion] = useState(prevRating ? prevRating.portionRating : 2.5);

    // API call to submit a new rating
    const onSubmitRating = async () => {
        try {

            // Check that taste, value and portion ratings are valid
            if ((taste < 0 || taste > 5) ||(portion < 0 || portion > 5) || (value < 0 || value > 5)) {
                setErrorMsg('Ratings must be between 0 and 5');
                return
            }
            const res = await fetch('/api/add/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealID,
                    userID: uuid,
                    tasteRating: taste,
                    valueRating: value,
                    portionRating: portion
                })
            });

            if (!res.ok) throw new Error('Failed to submit rating');

            setSuccessMsg('Rating submitted successfully!');
            setErrorMsg('');
            setShowButtons(false);
            refreshRatings(); // Update the user's rating
            updateRatings(); // Update the average rating

        } catch (err) {
            setErrorMsg(err.message);
            setSuccessMsg('');
        }
    };

    // API call to edit a rating
    const onEditRating = async () => {
        try {

            // Check that taste, value and portion ratings are valid
            if ((taste < 0 || taste > 5) ||(portion < 0 || portion > 5) || (value < 0 || value > 5)) {
                setErrorMsg('Ratings must be between 0 and 5');
                return
            }

            const res = await fetch('/api/edit/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealID,
                    userID: uuid,
                    tasteRating: taste,
                    valueRating: value,
                    portionRating: portion,
                    ratingID: prevRating.ratingID
                })
            });

            if (!res.ok) throw new Error('Failed to update rating');

            setSuccessMsg('Rating updated successfully!');
            setErrorMsg('');
            setShowButtons(false);
            refreshRatings(); // Update the user's rating
            updateRatings(); // Update the average rating

        } catch (err) {
            setErrorMsg(err.message);
            setSuccessMsg('');
        }
    };

    return (
        <>

        {/* Value Ratings Title and Buttons*/}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography id="value-label" variant="body2">My Value Rating</Typography>
            <Rating
                name="value"
                value={value}
                precision={0.1}
                onChange={(e, newValue) => setValue(newValue)}
                aria-label="value-rating"
            />
        </Box>

        {/* Taste Ratings Title and Buttons*/}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography id="taste-label" variant="body2">My Taste Rating</Typography>
            <Rating
                name="taste"
                value={taste}
                precision={0.1}
                onChange={(e, newValue) => setTaste(newValue)}
                aria-label="taste-rating"
            />
        </Box>

        {/* Portion Size Ratings Title and Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography id="portion-label" variant="body2">My Portion Size Rating</Typography>
            <Rating
                name="portion"
                value={portion}
                precision={0.1}
                onChange={(e, newValue) => setPortion(newValue)}
                aria-label="portion-rating"
            />
        </Box>

        {/* Buttons to Submit/Edit and Cancel         */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>

            {/* Submit/Edit Button */}
            <Button
                onClick={prevRating ? onEditRating : onSubmitRating}
                sx={{
                    backgroundColor: 'primary.light',
                    color: 'secondary.dark',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                    },
                }}
            >
                {prevRating ? 'Update Rating' : 'Submit Rating'}
            </Button>
            
            {/* Cancel Button */}
            <Button
                onClick={() => setShowButtons(false)}
                sx={{
                    backgroundColor: 'primary.light',
                    color: 'secondary.dark',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                    },
                }}
            >
                Cancel
            </Button>
        </Box>
        </>
    );
};

export default RateDealButtons;
