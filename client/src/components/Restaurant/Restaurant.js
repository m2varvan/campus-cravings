import { Typography, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";

const Restaurant = ({ uuid, restaurant, isOpen }) => {
  // State to open box with restaurant details
  const [openDetails, setOpenDetails] = useState(isOpen);

  // If restaurant is undefined, return null to prevent a crash
  if (!restaurant) return null;

  return (
    <>
      <Grid item xs={12} sm={6} lg={4}>
        <Box
          onClick={() => setOpenDetails(true)}
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
          {/* Restaurant name and contact info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Name in box */}
            <Box sx={{ width: "100%" }}>
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
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Dialog with expanded restaurant information */}
      <RestaurantDetails
        uuid={uuid}
        restaurant_id={restaurant.restaurant_id}
        handleClose={() => setOpenDetails(false)}
        open={openDetails}
      />
    </>
  );
};

export default Restaurant;
