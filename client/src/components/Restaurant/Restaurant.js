import { Typography, Box, Grid, Chip } from "@mui/material";
import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";
import Favourite from "../Deals/Favourite";
import saveFaveRestaurant from "../../APIs/saveFaveRestaurant";
import removeFaveRestaurant from "../../APIs/removeFaveRestaurant";

const Restaurant = ({ uuid, restaurant, ratings }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const { isOpen, isClosingSoon } = restaurant;

  if (!restaurant) return null;

  const restaurantRating = ratings?.find(
    (r) => r.restaurant_id === restaurant.restaurant_id,
  );

  const averageRating = restaurantRating && restaurantRating.total_ratings > 0
    ? ((restaurantRating.avg_value_rating +
        restaurantRating.avg_taste_rating +
        restaurantRating.avg_portion_rating) / 3).toFixed(1)
    : null;

  return (
    <>
      <Grid item xs={12} sm={6} lg={4} sx={{ display: "flex" }}>
        <Box
          sx={{
            bgcolor: "secondary.light",
            p: 2,
            m: 1,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            flexGrow: 1, 
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", 
            minHeight: "120px", 
            "&:hover": {
              filter: "brightness(0.95)",
              boxShadow: 3,
              transform: "translateY(-2px)" 
            },
          }}
          onClick={() => setOpenDetails(true)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1
            }}
          >
            {/* Restaurant Name and Status */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                {restaurant.restaurant_name}
              </Typography>
              
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {isOpen ? (
                  <Chip 
                    label={isClosingSoon ? "Closing Soon" : "Open Now"} 
                    size="small" 
                    color={isClosingSoon ? "warning" : "success"}
                    sx={{ height: 20, fontSize: "0.65rem", fontWeight: 'bold' }}
                  />
                ) : (
                  <Chip 
                    label="Closed" 
                    size="small" 
                    sx={{ height: 20, fontSize: "0.65rem", fontWeight: 'bold', bgcolor: "#ddd" }}
                  />
                )}
                <Chip 
                  label={restaurant.cuisine || "Food"} 
                  size="small" 
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.65rem" }}
                />
              </Box>
            </Box>

            {/* Heart and Rating */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
              <Box onClick={(e) => e.stopPropagation()}>
                <Favourite
                  uuid={uuid}
                  itemID={restaurant.restaurant_id}
                  fave={restaurant.is_favourited}
                  saveFave={saveFaveRestaurant}
                  removeFave={removeFaveRestaurant}
                />
              </Box>
              
              <Box sx={{ mt: 1, textAlign: "right" }}>
                {averageRating ? (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      ⭐ {averageRating}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      ({restaurantRating.total_ratings} reviews)
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No ratings
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

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