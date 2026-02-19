import React from "react";
import { useParams } from "react-router-dom";
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
import { Link as RouterLink } from "react-router-dom";

const RestaurantDetails = ({ restaurant, open, handleClose }) => {
  // Helper to format the timestamp
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
              {restaurant.phone_number || "No phone listed"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ADD HOURS INTO RESTAURANT DB -- PLACEHOLDER FOR NOW */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            About This Location
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This restaurant is located in {restaurant.city}. For specific hours
            of operation, please contact them directly at{" "}
            {restaurant.phone_number} or visit their website.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ID Reference Section */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Restaurant ID: {restaurant.restaurant_id}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Region: {restaurant.province}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
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

        {/* Button to Close Dialog */}
        <Button
          onClick={handleClose}
          sx={{
            bgcolor: "primary.dark",
            color: "white", // Adjusted for contrast
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
