import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Divider,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";

import RestaurantReview from "../Review/RestaurantReview";
import ExpandedDeal from "../Deals/ExpandedDeal";
import Favourite from "../Deals/Favourite";
import removeFaveRestaurant from '../../APIs/removeFaveRestaurant';
import saveFaveRestaurant from '../../APIs/saveFaveRestaurant';



const RestaurantDetails = ({ uuid, restaurant_id, open, handleClose, onFavouriteChange }) => {
  // States to load restaurant details and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // States to hold deals, hours, ratings and restaurant
  const [deals, setDeals] = useState([]);
  const [restaurantHours, setRestaurantHours] = useState([]);
  const [ratings, setRatings] = useState({});
  const [restaurant, setRestaurant] = useState({});

  // States to open/close expanded deal
  const [openDeal, setOpenDeal] = useState(false);

  // Function to load all restaurant details
  const loadRestaurantDetails = async () => {
    try {
      setLoading(true);
      setError(false);

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurant_id, userID: uuid }),
      };

      // Run all requests
      const [dealsRes, hoursRes, ratingsRes, detailsRes] = await Promise.all([
        fetch("/api/restaurant-deals", options),
        fetch("/api/restaurant-hours", options),
        fetch("/api/restaurant-rating", options),
        fetch("/api/restaurant-info", options),
      ]);

      // Check all responses
      if (!dealsRes.ok || !hoursRes.ok || !ratingsRes.ok || !detailsRes.ok) {
        throw new Error("One or more requests failed");
      }

      // Parse JSON
      const [deals, hours, ratings, details] = await Promise.all([
        dealsRes.json(),
        hoursRes.json(),
        ratingsRes.json(),
        detailsRes.json(),
      ]);

      // Debugging
      console.log("Deals:", deals);
      console.log("Hours:", hours);
      console.log("Ratings:", ratings);
      console.log("Details:", details);

      // Set states
      setDeals(deals || []);
      setRestaurantHours(hours || []);
      setRatings(ratings || {});
      setRestaurant(details || {});

      console.log('Deatails', details)
    } catch (error) {
      console.error("Failed to load restaurant data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadRestaurantDetails();
    }
  }, [open]);

  // Wrapper functions that call the API and then notify parent
  const handleSaveFave = async (uuid, itemID) => {
    await saveFaveRestaurant(uuid, itemID);
    onFavouriteChange?.(itemID, true);
  };

  const handleRemoveFave = async (uuid, itemID) => {
    await removeFaveRestaurant(uuid, itemID);
    onFavouriteChange?.(itemID, false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      {/* Loading / Error States */}
      {loading ? (
        <DialogContent>
          <Typography>Loading restaurant details...</Typography>
        </DialogContent>
      ) : error ? (
        <DialogContent>
          <Typography color="error">
            Failed to load restaurant details.
          </Typography>
        </DialogContent>
      ) : (
        <>
          {/* Header */}
          <DialogTitle>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>

            <Box>
              <Typography variant="h4" fontWeight={600}>
                {restaurant.restaurant_name}
              </Typography>

              {restaurant.website_url && (
                <Typography
                  component="a"
                  href={restaurant.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body1"
                  sx={{
                    color: "primary.dark",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Visit Official Website
                </Typography>
              )}
            </Box>

            <Favourite 
              uuid={uuid} 
              fave={restaurant.is_favourited} 
              itemID={restaurant_id}
              saveFave={handleSaveFave}
              removeFave={handleRemoveFave}
              size='40px'
            />
            </Box>

          </DialogTitle>

          <Divider />

          <DialogContent sx={{ mt: 1 }}>
            {/* Address + Contact */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ width: "60%" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Location
                </Typography>
                <Typography variant="body1">
                  {restaurant.street_address}
                  {restaurant.unit ? `, ${restaurant.unit}` : ""}
                </Typography>
                <Typography variant="body1">
                  {restaurant.city}, {restaurant.province}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {restaurant.postal_code}
                </Typography>
              </Box>

              <Box sx={{ width: "40%" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Contact Information
                </Typography>
                <Typography variant="h6" color="primary.dark">
                  {restaurant.phone_number || "Information is not available"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Details */}
            <Typography variant="subtitle1" fontWeight={600}>
              Restaurant Details
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Cuisine:</strong>{" "}
              {restaurant.cuisine?.trim() || "Information is not available"}
            </Typography>

            {/* Hours + Ratings */}
            <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
              {/* Hours */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Hours
                </Typography>

                {restaurantHours.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hours available.
                  </Typography>
                ) : (
                  restaurantHours.map((day, index) => (
                    <Typography key={index} variant="body2">
                      <strong>{day.dayOfWeek}:</strong>{" "}
                      {day.startTimes.map((start, i) => (
                        <span key={i}>
                          {start} - {day.endTimes[i]}
                          {i < day.startTimes.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </Typography>
                  ))
                )}
              </Box>

              {/* Ratings */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Ratings
                </Typography>

                {ratings.total_ratings > 0 ? (
                  <>
                    <Typography variant="body2">
                      Value: ⭐ {Number(ratings.avg_value_rating).toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      Taste: ⭐ {Number(ratings.avg_taste_rating).toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      Portion: ⭐{" "}
                      {Number(ratings.avg_portion_rating).toFixed(1)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No ratings yet
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Deals */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Current Deals
              </Typography>

              {deals.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No deals available.
                </Typography>
              ) : (
                deals.map((deal) => (
                  <Box
                    key={deal.deal_id}
                    sx={{
                      mt: 1,
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {deal.dealName || "Information is not available"}
                      </Typography>

                      <Typography
                        onClick={() => setOpenDeal(true)}
                        variant="body2"
                        sx={{
                          color: "primary.dark",
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        View Details
                      </Typography>

                      <ExpandedDeal
                        open={openDeal}
                        handleClose={() => setOpenDeal(false)}
                        uuid={uuid}
                        deal={deal}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>

        <RestaurantReview
          restaurantID={restaurant.restaurant_id}
          uuid={uuid}
        />
      
      </DialogContent>
      </>
      )}

      {/* Footer */}
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Box>
          <Typography variant="caption">
            Added on: {restaurant.created_at}
          </Typography>
          <Typography variant="caption" display="block">
            Last updated: {restaurant.updated_at}
          </Typography>
        </Box>

        <Button
          onClick={handleClose}
          sx={{
            bgcolor: "primary.dark",
            color: "secondary.dark",
            px: 3,
            "&:hover": {
              bgcolor: "primary.main",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantDetails;
