import { Typography, Box, Button } from "@mui/material";
import React from "react";
import RestaurantDetails from "../Restaurant/RestaurantDetails";
import EditRestaurantDialog from "./EditRestaurantDialog";

const OwnerRestaurant = ({ uuid, restaurant, onRestaurantUpdated }) => {
    const [openDetails, setOpenDetails] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    return (
        <>
            <Box sx={{
                bgcolor: "primary.light", p: 1, pb: 0.5, m: 1, borderRadius: 1,
                "&:hover": { filter: "brightness(0.95)", boxShadow: 1 },
            }}>
                <Box onClick={() => setOpenDetails(true)} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ width: "70%" }}>
                            <Typography variant="subtitle1"
                                sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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

                {/* Edit button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                    <Button size="small" variant="outlined" onClick={() => setOpenEdit(true)}>
                        Edit
                    </Button>
                </Box>
            </Box>

            <RestaurantDetails
                uuid={uuid}
                restaurant_id={restaurant.restaurant_id}
                handleClose={() => setOpenDetails(false)}
                open={openDetails}
            />

            <EditRestaurantDialog
                open={openEdit}
                handleClose={() => setOpenEdit(false)}
                restaurant={restaurant}
                onRestaurantUpdated={() => {
                    onRestaurantUpdated();
                    setOpenEdit(false);
                }}
            />
        </>
    );
};

export default OwnerRestaurant;