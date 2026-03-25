import { Typography, Box } from "@mui/material";
import React from "react";
import RestaurantDetails from "../Restaurant/RestaurantDetails";

const OwnerRestaurant = ({ uuid, restaurant }) => {
    const [openDetails, setOpenDetails] = React.useState(false);

    return (
        <>
            <Box
                sx={{
                    bgcolor: "primary.light",
                    p: 1,
                    pb: 0.5,
                    m: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    "&:hover": {
                        filter: "brightness(0.95)",
                        boxShadow: 1,
                    },
                }}
                onClick={() => setOpenDetails(true)}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ width: "70%" }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
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

            <RestaurantDetails
                uuid={uuid}
                restaurant_id={restaurant.restaurant_id}
                handleClose={() => setOpenDetails(false)}
                open={openDetails}
            />
        </>
    );
};

export default OwnerRestaurant;