import {
  Divider,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import React from 'react';
import RateDeal from './RateDeal';
import Review from '../Review';

import RestaurantDetails from '../Restaurant/RestaurantDetails';
import Favourite from './Favourite';
import DealVote from './DealVote';
import saveFaveDeal from '../../APIs/saveFaveDeal';
import removeFaveDeal from '../../APIs/removeFaveDeal';
import { useDeals } from '../../Hooks/useDeals';

const ExpandedDeal = ({ uuid, dealID, open, handleClose }) => {

  const {loadAllDeals} = useDeals();

  // States to hold deal information
  const [deal, setDeal] = React.useState({})
  const [loadingDeal, setLoadingDeal] = React.useState(false)
  const [error, setError] = React.useState(false)

  // Deal hours states
  const [dealHours, setDealHours] = React.useState([]);
  const [dealHoursError, setDealHoursError] = React.useState(false);
  const [loadingHours, setLoadingHours] = React.useState(false);

  // Ratings states
  const [dealRatingsError, setDealRatingsError] = React.useState(false);
  const [loadingRatings, setLoadingRatings] = React.useState(false);

  // Local states to store rating information
  const [tasteRating, setTasteRating] = React.useState(0);
  const [valueRating, setValueRating] = React.useState(0);
  const [portionRating, setPortionRating] = React.useState(0);
  const [averageRating, setAverageRating] = React.useState(0);
  const [numRatings, setNumRatings] = React.useState(0);

  //Track if ratings were updated
  const [ratingsUpdated, setRatingsUpdated] = React.useState(false);

  // States to open link to Restaurant Page
  const [openRestaurant, setOpenRestaurant] = React.useState(false)

  // API to update ratings (reload averages)
  const updateRatings = async () => {
    try {
      setLoadingRatings(true);
      setDealRatingsError(false);

      const res = await fetch('/api/deal/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealID }),
      });

      setRatingsUpdated(true)

      if (!res.ok) throw new Error('Failed to load ratings');

      const data = await res.json();

      // Update state with new averages
      setTasteRating(data.dealTasteRating.toFixed(1));
      setValueRating(data.dealValueRating.toFixed(1));
      setPortionRating(data.dealPortionRating.toFixed(1));
      setAverageRating(
        ((data.dealValueRating + data.dealPortionRating + data.dealTasteRating) / 3).toFixed(1)
      );
      setNumRatings(data.numRatings);
    } catch (err) {
      console.error(err);
      setDealRatingsError(true);
    } finally {
      setLoadingRatings(false);
    }
  };

  // Load deal hours
  const getDealHours = async () => {
    try {
      setLoadingHours(true);
      setDealHoursError(false);

      const res = await fetch('/api/deal/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealID }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setDealHours(data);
    } catch (err) {
      console.error('Failed to get deal hours:', err);
      setDealHoursError(true);
    } finally {
      setLoadingHours(false);
    }
  };

  // Load deal information
  const getDealInfo = async () => {
    try{
      setLoadingDeal(true)
      setError(false)

      const res = await fetch('/api/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealID, userID: uuid }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setDeal(data);
      console.log('Deal', data)
    } catch (err) {
      console.error('Failed to get deal info:', err);
      setError(true);
    } finally {
      setLoadingDeal(false);
    }
  }

  // Load hours and deal information when dialog opens
  React.useEffect(() => {
    if (open && dealID) {
      getDealHours();
      getDealInfo();
    }
  }, [open, dealID]);

  // Update deal ratings when information loads.
  React.useEffect(() => {
    if (Object.keys(deal).length !== 0){
      setTasteRating(deal.dealTasteRating.toFixed(1))
      setValueRating(deal.dealValueRating.toFixed(1))
      setPortionRating(deal.dealPortionRating.toFixed(1))
      setAverageRating(((deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3).toFixed(1))
      setNumRatings(deal.numRatings)
    }
  }, [deal])

  // Handle dialog close
  const handleDialogClose = () => {
    if (ratingsUpdated ) {
      loadAllDeals();
      setRatingsUpdated(false);
    }
    handleClose?.();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleDialogClose}
      PaperProps={{ sx: { bgcolor: 'background.default', borderRadius: 3, p: 2 } }}
    >
      {/* Header */}
      {!loadingDeal && !error && (
        <>
          <DialogTitle>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>

              {/* Deal name and restaurant */}
              <Box>
              <Typography variant="h5" fontWeight={600}>
                {deal.dealName}
              </Typography>

              <Typography
                onClick={() => setOpenRestaurant(true)}
                variant="body1"
                sx={{ color: 'primary.dark', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {deal.restaurantName}
              </Typography>
              </Box>

              {/* Favourite Button */}
              <Favourite 
                  uuid={uuid}
                  itemID={deal.dealID}
                  fave={deal.fave}
                  saveFave={saveFaveDeal}
                  removeFave={removeFaveDeal}
                  size='43px'
                  />
            </Box>
          </DialogTitle>

          <Divider />
        </>
      )}

      <DialogContent sx={{ mt: 1 }}>
        {/* Loading State */}
        {loadingDeal ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2">Loading deal information...</Typography>
          </Box>

        // Error State
        ) : error ? (
          <Typography variant="body2" color="error" sx={{ py: 4 }}>
            Failed to load deal information. Please try again.
          </Typography>
        ) : (
          <>
            {/* Price + Description */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ width: '80%' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {deal.dealDescription}
                </Typography>
              </Box>

              <Box sx={{ width: '20%' }}>
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

          {loadingHours ? (
            <Typography variant="body2" color="text.secondary">
              Loading availability...
            </Typography>
          ) : dealHoursError ? (
            <Typography variant="body2" color="error">
              Failed to load availability. Please try again.
            </Typography>
          ) : dealHours.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No availability found.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {dealHours.map((day, index) => (
                <div key={index}>
                  <strong>{day.dayOfWeek}:</strong>{' '}
                  {day.dealStartTime.map((start, i) => (
                    <span key={i}>
                      {start} - {day.dealEndTime[i]}
                      {i < day.dealStartTime.length - 1 ? ', ' : ''}
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
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {numRatings === 1
                ? `Average Ratings (${numRatings} Rating)`
                : `Average Ratings (${numRatings} Ratings)`}
            </Typography>

            {loadingRatings ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} />
                <Typography variant="body2">Loading ratings...</Typography>
              </Box>
            ) : dealRatingsError ? (
              <Typography variant="body2" color="error">
                Failed to load ratings.
              </Typography>
            ) : numRatings === 0 ? (
              <Typography variant="body1">No ratings yet.</Typography>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Value Rating</Typography>
                  <Typography variant="body2">⭐ {valueRating}/5</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Taste Rating</Typography>
                  <Typography variant="body2">⭐ {tasteRating}/5</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Portion Size Rating</Typography>
                  <Typography variant="body2">⭐ {portionRating}/5</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight={600}>
                    Average Overall Rating
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ⭐ {averageRating}/5
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* My Ratings */}
          <RateDeal uuid={uuid} deal={deal} updateRatings={updateRatings} />
        </Box>

            <Review uuid={uuid} dealID={deal.dealID} />

            <Divider sx={{ my: 2 }} />
          </>
        )}

      </DialogContent>

      {/* Last Updated & Close Button */}
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
         <DealVote 
            uuid={uuid}
            totalVote={deal.totalVote}
            userVote={deal.userVote}
            dealID={deal.dealID}
            />

          <Typography variant="caption" color="text.secondary" sx={{mr: 'auto'}}>
            Deal information last updated: {deal.dealEditData}
          </Typography>

          <Button
            onClick={handleDialogClose}
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
      
      {/* Dialog to open Restaurant Details */}
      <RestaurantDetails 
        restaurant_id={deal.restaurantID} 
        open={openRestaurant} 
        handleClose={() => setOpenRestaurant(false)}
        uuid={uuid} />
    </Dialog>
  );
};

export default ExpandedDeal;