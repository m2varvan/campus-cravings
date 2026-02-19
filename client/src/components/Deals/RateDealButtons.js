import { Typography, Button, Box, Rating, Alert } from '@mui/material';
import React, { useState } from 'react';

const RateDealButtons = ({ uuid, dealID, prevRating, setShowButtons }) => {

    const [taste, setTaste] = useState(prevRating ? prevRating.tasteRating : 2.5);
    const [value, setValue] = useState(prevRating ? prevRating.valueRating : 2.5);
    const [portion, setPortion] = useState(prevRating ? prevRating.portionRating : 2.5);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmitRating = async () => {
        try {
            const res = await fetch('/api/addrating', {
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

        } catch (err) {
            setErrorMsg(err.message);
            setSuccessMsg('');
        }
    };

    const onEditRating = async () => {
        try {
            const res = await fetch('/api/editrating', {
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

        } catch (err) {
            setErrorMsg(err.message);
            setSuccessMsg('');
        }
    };

    return (
        <>

        {/* Value Ratings */}
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

        {/* Taste Ratings */}
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

        {/* Portion Size Ratings */}
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
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
        
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        </>
    );
};

export default RateDealButtons;
