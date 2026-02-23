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

const RestaurantDetails = ({ restaurant, open, handleClose }) => {
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [deals, setDeals] = useState([]);
  const [loadingDealsError, setLoadingDealsError] = useState(false);
  const [loadingDealHours, setLoadingDealHours] = useState(false);
  const [dealHours, setDealHours] = useState([]);
  const [loadingDealHoursError, setLoadingDealHoursError] = useState(false);

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

    loadDeals();
    loadDealHours();
  }, [restaurant]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

        {/* Cuisine + Hours Section */}
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

          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Hours:</strong>{" "}
            {restaurant.opening_time && restaurant.closing_time
              ? `${restaurant.opening_time} - ${restaurant.closing_time}`
              : "Information is not available"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

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
                <Typography variant="body1" fontWeight={600}>
                  {deal.deal_name || "Information is not available"}
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Price:</strong>{" "}
                  {deal.deal_price !== undefined && deal.deal_price !== null
                    ? `$${deal.deal_price}`
                    : "Information is not available"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 0.5 }}
                  color="text.secondary"
                >
                  <strong>Description:</strong>{" "}
                  {deal.description || "Information is not available"}
                </Typography>

                {/* Deal Hours */}
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  <strong>Availability:</strong>
                </Typography>

                {dealHours[deal.deal_id] &&
                dealHours[deal.deal_id].length > 0 ? (
                  dealHours[deal.deal_id].map((hour, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{ ml: 2 }}
                      color="text.secondary"
                    >
                      {hour.day_of_week}:{" "}
                      {hour.start_times
                        .split(",")
                        .map(
                          (start, idx) =>
                            `${start} - ${hour.end_times.split(",")[idx]}`,
                        )
                        .join(", ")}
                    </Typography>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ ml: 2 }}
                    color="text.secondary"
                  >
                    Information is not available
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Information is not available
            </Typography>
          )}
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
