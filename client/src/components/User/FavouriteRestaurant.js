import { Typography, Box } from "@mui/material";
import React from "react";
import Favourite from "../Deals/Favourite";
import saveFaveRestaurant from "../../APIs/saveFaveRestaurant";
import removeFaveRestaurant from "../../APIs/removeFaveRestaurant";

import RestaurantDetails from "../Restaurant/RestaurantDetails";

const FavouriteRestaurant = ({ uuid, restaurant, handleRemoveRestaurant }) => {

    // State to open dialog box with restaurant details
    const [openDetails, setOpenDetails] = React.useState(false);

    // Function to remove restaurant from local favourites shown and update database
    const removeRestaurant = () => {
        handleRemoveRestaurant(restaurant.restaurant_id);
        removeFaveRestaurant(uuid, restaurant.restaurant_id);
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: "primary.light",
                    p: 1,
                    pb: 0.5,
                    m: 1,
                    borderRadius: 1,
                    "&:hover": {
                        filter: "brightness(0.95)",
                        boxShadow: 1,
                    },
                }}
            >

                {/* Clickable area */}
                <Box onClick={() => setOpenDetails(true)}>
                    {/* Restaurant name and average rating*/}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ width: "70%" }}>
                            <Typography
                                data-testid="restaurant-name"
                                variant="subtitle1"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {restaurant.restaurant_name}
                            </Typography>
                        </Box>

                        <Typography variant="body2">
                            {restaurant.num_ratings
                                ? "⭐ " + restaurant.avg_rating.toFixed(1) + "/5 (" + restaurant.num_ratings + ")"
                                : "No ratings yet"}
                        </Typography>
                        
                    </Box>

                </Box>

                {/* Favourite Button */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box onClick={() => setOpenDetails(true)} sx={{width: '90%'}} />
                    <Favourite
                        uuid={uuid}
                        itemID={restaurant.restaurant_id}
                        fave={restaurant.fave}
                        saveFave={saveFaveRestaurant}
                        removeFave={removeRestaurant}
                    />
                </Box>

            </Box>

            <RestaurantDetails
                    uuid={uuid}
                    restaurant_id={restaurant.restaurant_id}
                    handleClose={() => setOpenDetails(false)}
                    open={openDetails}
                  />
        </>
    );
};

export default FavouriteRestaurant;