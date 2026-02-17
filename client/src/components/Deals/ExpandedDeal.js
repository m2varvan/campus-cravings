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
import Link from '@mui/material';
import React from 'react';

const ExpandedDeal = ({ uuid, deal, open, handleClose }) => {
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
      {/* Header */}
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          {deal.dealName}
        </Typography>
        <Typography
            component={Link}
            to={`/restaurant/${deal.restaurantId}`}
            state={{ restaurantId: deal.restaurantId }}
            variant="body1"
            sx={{
                textDecoration: 'underline',
                cursor: 'pointer',
            }}
            >
            {deal.restaurantName}
        </Typography>
      </DialogTitle>

      <Divider />

      {/* Content */}
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
          <Typography variant="body2" color="text.secondary">
            Day of week: start time – end time
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Ratings */}
            <Box sx={{ width: '50%' }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Average Ratings ({deal.numRatings} Ratings)
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Value</Typography>
                <Typography variant="body2">⭐ {deal.dealValueRating}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Taste</Typography>
                <Typography variant="body2">⭐ {deal.dealTasteRating}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Portion</Typography>
                <Typography variant="body2">⭐ {deal.dealPortionRating}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" fontWeight={600}>
                    Overall
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                    ⭐ {(
                    (deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3
                    ).toFixed(1)}
                </Typography>
                </Box>
            </Box>

            {/* My Ratings */}
            <Box sx={{ width: '50%' }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                My Ratings
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Value</Typography>
                <Typography variant="body2">My Value Rating Here</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Taste</Typography>
                <Typography variant="body2">My Taste Rating Here</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Portion</Typography>
                <Typography variant="body2">My Portion Rating Here</Typography>
                </Box>
            </Box>
        </Box>


      <Divider sx={{ my: 2 }} />
      </DialogContent>

        {/* Last Updated and Dialog Close Button */}
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
            Deal information last updated: {deal.dealEditData}
        </Typography>

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
