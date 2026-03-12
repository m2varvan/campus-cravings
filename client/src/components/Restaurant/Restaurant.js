import { Typography, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";
import Favourite from "../Deals/Favourite";
import saveFaveRestaurant from "../../APIs/saveFaveRestaurant";
import removeFaveRestaurant from "../../APIs/removeFaveRestaurant";

const Restaurant = ({ uuid, restaurant, ratings }) => {
  // State to open box with restaurant details
  const [openDetails, setOpenDetails] = useState(false);

  // If restaurant is undefined, return null to prevent a crash
  if (!restaurant) return null;

  const restaurantRating = ratings?.find(
    (r) => r.restaurant_id === restaurant.restaurant_id,
  );

  return (
    <>
      <Grid item xs={12} sm={6} lg={4}>
        <Box
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
          {/* Restaurant name and favourite button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Name in box - make clickable*/}
            <Box
              onClick={() => setOpenDetails(true)}
              sx={{ width: "90%" }}
              data-testid={`expand-restaurantID-${restaurant.restaurant_id}`}
            >
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

            <Favourite
              uuid={uuid}
              itemID={restaurant.restaurant_id}
              fave={restaurant.is_favourited}
              saveFave={saveFaveRestaurant}
              removeFave={removeFaveRestaurant}
            />
            {/* Restaurant name */}
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

            {/* Average Rating */}
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {restaurantRating && restaurantRating.total_ratings > 0
                  ? "⭐ " +
                    (
                      (restaurantRating.avg_value_rating +
                        restaurantRating.avg_taste_rating +
                        restaurantRating.avg_portion_rating) /
                      3
                    ).toFixed(2) +
                    "/5 (" +
                    restaurantRating.total_ratings +
                    ")"
                  : "No ratings yet"}
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
