import { useEffect } from "react";
import { useState } from "react";
import { Typography, Grid, CircularProgress, Box, Button } from "@mui/material";
import Restaurant from "./Restaurant";
import FilterSortRestaurants from "./FilterSortRestaurants";

const RestaurantList = ({ uuid }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingRestaurantsError, setLoadingRestaurantsError] = useState(false);

  // Filter and Sort States
  const [restaurantFilter, setRestaurantFilter] = useState([]);
  const [ratingSort, setRatingSort] = useState("");
  const [restaurantRatings, setRestaurantRatings] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState([]);

  // Variables and functions to show only 24 by default
  const defaultVisible = 24;
  const [visibleCount, setVisibleCount] = useState(defaultVisible);

  const handleShowMore = () => {
    setVisibleCount(displayedRestaurants.length);
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

    async function loadRestaurantRatings() {
      try {
        setLoadingRestaurants(true);
        const res = await fetch("/api/restaurant-rating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            getAll: true,
          }),
        });
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setRestaurantRatings(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        setLoadingRestaurantsError(true);
      } finally {
        setLoadingRestaurants(false);
      }
    }

    loadRestaurants();
    loadRestaurantRatings();
  }, []);

  // Filtering Logic
  let displayedRestaurants = [...restaurants];

  if (restaurantFilter.length > 0) {
    displayedRestaurants = displayedRestaurants.filter((r) =>
      restaurantFilter.includes(r.restaurant_name),
    );
  }
  if (cuisineFilter.length > 0) {
    displayedRestaurants = displayedRestaurants.filter((r) =>
      cuisineFilter.includes(r.cuisine),
    );
  }

  // Sorting Logic
  displayedRestaurants.sort((a, b) => {
    if (ratingSort) {
      const ratingA = restaurantRatings.find(
        (r) => r.restaurant_id === a.restaurant_id,
      );
      const ratingB = restaurantRatings.find(
        (r) => r.restaurant_id === b.restaurant_id,
      );

      let scoreA = 0;
      let scoreB = 0;

      if (ratingSort === "overall") {
        scoreA = ratingA
          ? (ratingA.avg_value_rating +
              ratingA.avg_taste_rating +
              ratingA.avg_portion_rating) /
            3
          : 0;
        scoreB = ratingB
          ? (ratingB.avg_value_rating +
              ratingB.avg_taste_rating +
              ratingB.avg_portion_rating) /
            3
          : 0;
      } else {
        const key = `avg_${ratingSort}_rating`;
        scoreA = ratingA ? ratingA[key] : 0;
        scoreB = ratingB ? ratingB[key] : 0;
      }

      // Sort by the scores
      if (scoreB !== scoreA) return scoreB - scoreA;
    }

    // If no data for cuisne for particular restaurant, website doesn't crash
    if ((a.cuisine || "") !== (b.cuisine || "")) {
      return (a.cuisine || "").localeCompare(b.cuisine || "");
    }

    if (a.cuisine !== b.cuisine) {
      return a.cuisine.localeCompare(b.cuisine);
    }

    // If more than 1 restaurants has the same score, order alphabetically
    return a.restaurant_name.localeCompare(b.restaurant_name);
  });

  const restaurantOptions = [
    ...new Set(restaurants.map((r) => r.restaurant_name)),
  ];

  const cuisineOptions = [...new Set(restaurants.map((r) => r.cuisine))];
  return (
    <Grid container p={4} display={"flex"}>
      <Grid item xs={12} mb={2}>
        {/* Page Title */}
        <Typography variant="h4">University Shops Plaza Restaurants</Typography>

        <FilterSortRestaurants
          restaurantFilter={restaurantFilter}
          setRestaurantFilter={setRestaurantFilter}
          ratingSort={ratingSort}
          setRatingSort={setRatingSort}
          restaurantOptions={restaurantOptions}
          cuisineOptions={cuisineOptions}
          cuisineFilter={cuisineFilter}
          setCuisineFilter={setCuisineFilter}
        />
      </Grid>

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
                {displayedRestaurants
                  .slice(0, visibleCount)
                  .map((restaurant) => (
                    <Restaurant
                      key={restaurant.restaurant_id}
                      uuid={uuid}
                      restaurant={restaurant}
                      ratings={restaurantRatings}
                    />
                  ))}
              </Grid>

              {/* Show More Button */}
              {visibleCount < displayedRestaurants.length && (
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
