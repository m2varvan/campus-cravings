// RestaurantPlaceholder.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const RestaurantDetails = () => {
  // Get the restaurantId from the URL params
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Restaurant Placeholder
      </Typography>
      <Typography variant="body1">
        This is a placeholder for restaurant with ID: <strong>{id}</strong>
      </Typography>
    </div>
  );
};

export default RestaurantDetails;
