import {
  Divider,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import RateDeal from './RateDeal';

const ExpandedDeal = ({ uuid, deal, open, handleClose }) => {

  // States for loading deal hours from db
  const [dealHours, setDealHours] = React.useState([]);
  const [dealHoursError, setDealHoursError] = React.useState(false);
  const [loadingHours, setLoadingHours] = React.useState(false);

  // API call to load deal hours
  const getDealHours = async () => {
    try{
      setLoadingHours(true)
      setDealHoursError(false)

      const res = await fetch('/api/dealhours', {
        method: 'POST',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify({ dealID: deal.dealID})

        });
      
      if (!res.ok) throw new Error(res.statusText);
      
      const data = await res.json();
      console.log(data);
      setDealHours(data);
      }

    catch (err) {
      console.error('Failed to get deal hours:', err);
      setDealHoursError(true)
    }
    finally {
      setLoadingHours(false)
    }
  }

  // Call getDealHours on change of open if getDealHours() has length 0 (it has not been called already)
  React.useEffect(() => {
    if (open && dealHours.length === 0) {
      getDealHours();
    }
  }, [open]);



  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      {/* Header (Deal name and restaurant name*/}
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          {deal.dealName}
        </Typography>

        <Typography
            component={RouterLink} // Link to restaurant's page
            to={`/restaurant/${deal.restaurantID}`}
            variant="body1"
            sx={{
                color: 'primary.dark',
                textDecoration: 'underline',
                cursor: 'pointer',
            }}
            >
            {deal.restaurantName}
        </Typography>
      </DialogTitle>

      <Divider />

    
      <DialogContent sx={{ mt: 1 }}>
        {/* Price + Description */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
            {/* Description */}
            <Box sx={{width: '80%'}}>
                <Typography variant="subtitle1" fontWeight={600}>
                    Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {deal.dealDescription}
                </Typography>
            </Box>

            <Box sx={{width: '20%'}}>
                <Typography variant="subtitle1" fontWeight={600}>
                    Price
                </Typography>
                <Typography variant="h6" color="primary.dark">
                ${deal.dealPrice}
            </Typography>
            </Box>
            

        </Box>

        <Divider sx={{ my: 2 }} />
        
        {/* Availability */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Availability
          </Typography>

          {/* Display loading message if loading deal hours */}
          {loadingHours ? (
            <Typography variant="body2" color="text.secondary">
              Loading availability...
            </Typography>

          // Display error message if API call to load hours fails
          ) : dealHoursError ? (
            <Typography variant="body2" color="error">
              Failed to load availability. Please try again.
            </Typography>

          // If there are no hours, show no availability found message
          ) : dealHours.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No availability found.
            </Typography>

          // Iterate throug list of days of week, displaying the hours for each day
          ) : (
            <Typography variant="body2" color="text.secondary">
              {dealHours.map((day, index) => (
                <div key={index}>
                  <strong>{day.dayOfWeek}:</strong>{" "}

                  {/* Iterate through hours available on each day (in case of multiple timeslots) */}
                  {day.dealStartTime.map((start, i) => (
                    <span key={i}>
                      {start} - {day.dealEndTime[i]}
                      {i < day.dealStartTime.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              ))}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Ratings */}
        <Box sx={{ display: 'flex', gap: 3 }}>
            
            {/* Average Ratings */}
            <Box sx={{ width: '50%' }}>

                {/* Title */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {deal.numRatings === 1 ?
                  'Average Ratings ('+ deal.numRatings+ ' Rating)'
                  :
                  'Average Ratings ('+ deal.numRatings+ ' Ratings)'
                  }
                </Typography>

                {/* If there are no ratings, display message saying no ratings yet. Otherwise display ratings */}
                {deal.numRatings === 0 ?
                <Typography variant='body1'>No ratings yet. </Typography>
                :
                <>
                {/* Value Ratings */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Value Rating</Typography>
                  <Typography variant="body2">⭐ {deal.dealValueRating.toFixed(1)}/5</Typography>
                </Box>

                {/* Taste Ratings */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Taste Rating</Typography>
                  <Typography variant="body2">⭐ {deal.dealTasteRating.toFixed(1)}/5</Typography>
                </Box>

                {/* Portion Size Ratings */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Portion Size Rating </Typography>
                  <Typography variant="body2">⭐ {deal.dealPortionRating.toFixed(1)}/5</Typography>
                </Box>

                {/* Overall Rating */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight={600}>
                      Average Overall Rating
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                      ⭐ {(
                      (deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3
                      ).toFixed(1)}/5
                  </Typography>
                </Box>
                </>
                }
                
            </Box>

            {/* My Ratings */}
           <RateDeal uuid={uuid}
                    deal={deal}/>
        </Box>


      <Divider sx={{ my: 2 }} />
      </DialogContent>

        {/* Last Updated Text and Dialog Close Button */}
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
            Deal information last updated: {deal.dealEditData}
        </Typography>
        
        {/* Button to Close Dialog */}
        <Button
            onClick={handleClose}
            sx={{
            bgcolor: 'primary.dark',
            color: 'secondary.dark',
            px: 3,
            '&:hover': {
                bgcolor: 'primary.main',
            },
            }}
        >
            Close
        </Button>
        </DialogActions>

    </Dialog>
  );
};

export default ExpandedDeal;
