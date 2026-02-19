import { Typography, Button, Box, Rating } from '@mui/material';
import React from 'react';

const RateDealButtons = ({uuid, dealID, prevRating, setShowButtons}) => {

    const onSubmitRating = async () => {
        // API to submit rating to DB
    }

    const onEditRating = async () => {
        // API to edit current DB Rating
    }

    return(
        <>
        {/* Value Ratings */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">My Value Rating</Typography>
            <Rating name="value" defaultValue={prevRating ? prevRating.valueRating : 2.5} precision={0.1} />
        </Box>

        {/* Taste Ratings */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">My Taste Rating</Typography>
            <Rating name="taste" defaultValue={prevRating ? prevRating.tasteRating : 2.5} precision={0.1} />
        </Box>

        {/* Portion Size Ratings */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">My Portion Size Rating </Typography>
            <Rating name="portion" defaultValue={prevRating ? prevRating.portionRating : 2.5} precision={0.1} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Button
            onClick={null}
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
            onClick={()=>setShowButtons(false)}
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