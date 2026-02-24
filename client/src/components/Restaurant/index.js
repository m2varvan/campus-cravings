import { useEffect } from "react";
import { useState } from "react";
import {
  Typography,
  Grid,
  CircularProgress,
  Box,
  visibleCount,
  Button,
} from "@mui/material";
import Restaurant from "./Restaurant";
import { useParams } from "react-router-dom";

const RestaurantList = ({ uuid }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingRestaurantsError, setLoadingRestaurantsError] = useState(false);
  const { id } = useParams();

  // Variables and functions to show only 24 by default
  const defaultVisible = 24;
  const [visibleCount, setVisibleCount] = useState(defaultVisible);

  const handleShowMore = () => {
    setVisibleCount(restaurants.length);
  };
  const handleShowLess = () => {
    setVisibleCount(defaultVisible);
  };

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoadingRestaurants(true);
        const response = await fetch("/api/get-restaurants");

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setRestaurants(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        setLoadingRestaurantsError(true);
      } finally {
        setLoadingRestaurants(false);
      }
    }

    loadRestaurants();
  }, []);

  // created UseEffect hook to ensure expanded restaurant info shows for all restaurants, not just the defaultVisible ones
  useEffect(() => {
    if (id) {
      setVisibleCount(restaurants.length);
    }
  }, [restaurants, id]);

  return (
    <Grid container p={4} display={"flex"}>
      {/* Page Title */}
      <Typography variant="h4">University Shops Plaza Restaurants</Typography>
      <Grid item xs={12}>
        {/* Show loadingRestaurants message when restaurants are loading */}
        {loadingRestaurants && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={48} color="secondary" />
            <Typography variant={"h6"}>Loading Restaurants...</Typography>
          </Box>
        )}

        {/* Show error message if API call fails */}
        {!loadingRestaurants && loadingRestaurantsError && (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant={"h6"} color="error">
              Something went wrong while loading the restaurants. Please try
              again.
            </Typography>
          </Box>
        )}

        {/* Show message saying no restaurants available */}
        {!loadingRestaurants &&
          !loadingRestaurantsError &&
          restaurants.length === 0 && (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {" "}
              <Typography variant={"h6"} color="error">
                No Restaurants Available.
              </Typography>
            </Box>
          )}

        {/* Show restaurants */}
        {!loadingRestaurants &&
          !loadingRestaurantsError &&
          restaurants.length > 0 && (
            <>
              <Grid container>
                {/* Iterate through restaurants array and render each restaurant in a restaurant component */}
                {restaurants.slice(0, visibleCount).map((restaurant) => (
                  <Restaurant
                    key={restaurant.restaurant_id}
                    uuid={uuid}
                    restaurant={restaurant}
                    isOpen={
                      id
                        ? String(restaurant.restaurant_id) === String(id)
                        : false
                    }
                  />
                ))}
              </Grid>

              {/* Show More Button */}
              {visibleCount < restaurants.length && (
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleShowMore}
                    color={"secondary"}
                  >
                    Show More
                  </Button>
                </Box>
              )}

              {/* Show Less Button */}
              {visibleCount > defaultVisible && (
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleShowLess}
                    color={"secondary"}
                  >
                    Show Less
                  </Button>
                </Box>
              )}
            </>
          )}
      </Grid>
    </Grid>
  );
};

export default RestaurantList;
