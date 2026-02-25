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
import { Link } from "react-router-dom";

const RestaurantDetails = ({ restaurant, open, handleClose }) => {
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [deals, setDeals] = useState([]);
  const [loadingDealsError, setLoadingDealsError] = useState(false);
  const [loadingDealHours, setLoadingDealHours] = useState(false);
  const [dealHours, setDealHours] = useState([]);
  const [loadingDealHoursError, setLoadingDealHoursError] = useState(false);
  const [restaurantHours, setRestaurantHours] = React.useState([]);
  const [loadingHours, setLoadingHours] = React.useState(false);
  const [hoursError, setHoursError] = React.useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [ratings, setRatings] = useState({});
  const [loadingRatingsError, setLoadingRatingsError] = useState(false);

  useEffect(() => {
    async function loadDeals() {
      try {
        setLoadingDeals(true);
        const response = await fetch("/api/get-deals-by-restaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurant_id: restaurant.restaurant_id }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        setLoadingDealsError(true);
      } finally {
        setLoadingDeals(false);
      }
    }

    async function loadDealHours() {
      try {
        setLoadingDealHours(true);
        const response = await fetch("/api/deal-availability-by-restaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurant_id: restaurant.restaurant_id }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setDealHours(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        setLoadingDealHoursError(true);
      } finally {
        setLoadingDealHours(false);
      }
    }
    const getRestaurantHours = async () => {
      try {
        setLoadingHours(true);
        setHoursError(false);

        const response = await fetch("/api/restaurant-hours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurantID: restaurant.restaurant_id }),
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setRestaurantHours(data);
      } catch (err) {
        console.error("Failed to load restaurant hours:", err);
        setHoursError(true);
      } finally {
        setLoadingHours(false);
      }
    };

    async function loadRatings() {
      try {
        setLoadingRatings(true);
        const response = await fetch("/api/restaurant-rating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurant_id: restaurant.restaurant_id }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setRatings(data);
      } catch (error) {
        console.error("Failed to load restaurant ratings:", error);
        setLoadingRatingsError(true);
      } finally {
        setLoadingRatings(false);
      }
    }

    loadDeals();
    loadDealHours();
    getRestaurantHours();
    loadRatings();
  }, [restaurant]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  console.log("restaurantHours:", restaurantHours);
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
      {/* Restaurant Name Header */}
      <DialogTitle>
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
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Address Section */}
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

          {/* Contact Section */}
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

        {/* Cuisine + Hours + Ratings Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Restaurant Details
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Cuisine:</strong>{" "}
            {restaurant.cuisine && restaurant.cuisine.trim() !== ""
              ? restaurant.cuisine
              : "Information is not available"}
          </Typography>

          {/* Hours + Ratings side by side */}
          <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
            {/* Hours */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Hours
              </Typography>

              {loadingHours && (
                <Typography variant="body2" color="text.secondary">
                  Loading hours...
                </Typography>
              )}

              {hoursError && (
                <Typography variant="body2" color="error">
                  Failed to load hours.
                </Typography>
              )}

              {!loadingHours && !hoursError && restaurantHours.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No hours available.
                </Typography>
              )}

              {!loadingHours &&
                !hoursError &&
                restaurantHours.length > 0 &&
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
                ))}
            </Box>

        {/* Deals Section */}
        {/* Deals Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Current Deals
          </Typography>

          {deals && deals.length > 0 ? (
            deals.map((deal, index) => (
              <Box
                key={index}
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
                    {deal.deal_name || "Information is not available"}
                  </Typography>

                  <Typography
                    component={Link}
                    to={`/${deal.deal_id}`}
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
                </Box>
            {/* Ratings */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Ratings
              </Typography>

              {ratings &&
              (ratings.avg_value_score ||
                ratings.avg_taste_score ||
                ratings.avg_portion_score) ? (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Value</Typography>
                    <Typography variant="body2">
                      ⭐ {Number(ratings.avg_value_score).toFixed(2)}/5
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Taste</Typography>
                    <Typography variant="body2">
                      ⭐ {Number(ratings.avg_taste_score).toFixed(2)}/5
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Portion</Typography>
                    <Typography variant="body2">
                      ⭐ {Number(ratings.avg_portion_score).toFixed(2)}/5
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Overall
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ⭐{" "}
                      {(
                        (Number(ratings.avg_value_score || 0) +
                          Number(ratings.avg_taste_score || 0) +
                          Number(ratings.avg_portion_score || 0)) /
                        3
                      ).toFixed(2)}
                      /5
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  No ratings yet
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer Info */}
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Added on: {formatDate(restaurant.created_at)}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Last updated: {formatDate(restaurant.updated_at)}
          </Typography>
        </Box>

        <Button
          onClick={handleClose}
          sx={{
            bgcolor: "primary.dark",
            color: "white",
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
