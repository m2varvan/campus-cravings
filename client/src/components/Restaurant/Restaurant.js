import { Typography, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";

const Restaurant = ({ uuid, restaurant }) => {
  // State to open box with restaurant details
  const [openDetails, setOpenDetails] = useState(false);

  // If restaurant is undefined, return null to prevent a crash
  if (!restaurant) return null;

  return (
    <>
      <Grid item xs={12} sm={6} lg={4}>
        <Box
          onClick={() => setOpenDetails(true)} // Open box with details on click
          data-testid={`expand-restaurantID-${restaurant.restaurant_id}`}
          sx={{
            bgcolor: "secondary.light",
            p: 2,
            m: 1,
            borderRadius: 1,
            cursor: "pointer",
            "&:hover": {
              filter: "brightness(0.95)",
              boxShadow: 1,
            },
          }}
        >
          {/* Restaurant name and contact info on opposite ends */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Name and Location Summary */}
            <Box sx={{ width: "70%" }}>
              <Typography
                variant="h6"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                {restaurant.restaurant_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", color: "text.secondary" }}
              >
                {restaurant.city}, {restaurant.province}
              </Typography>
            </Box>

            {/* Address/Contact Summary on the Right */}
            <Box sx={{ textAlign: "right", width: "30%" }}>
              <Typography variant="body2" fontWeight={600}>
                {restaurant.postal_code}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "primary.main" }}
              >
                {restaurant.phone_number ? "Has Contact Info" : "No Phone"}
              </Typography>
            </Box>
          </Box>

          {/* Optional: Street Address preview */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {restaurant.street_address} {restaurant.unit || ""}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Dialog with expanded restaurant information */}
      <RestaurantDetails
        uuid={uuid}
        restaurant={restaurant}
        handleClose={() => setOpenDetails(false)}
        open={openDetails}
      />
    </>
  );
};

export default Restaurant;
