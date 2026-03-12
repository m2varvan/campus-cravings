import { useEffect } from "react";
import { useState } from "react";
import { Typography, Grid, CircularProgress, Box, Button } from "@mui/material";
import Restaurant from "./Restaurant";
import FilterSortRestaurants from "./FilterSortRestaurants";

const RestaurantList = ({ uuid }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantHours, setRestaurantHours] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingRestaurantsError, setLoadingRestaurantsError] = useState(false);

  // Filter and Sort States
  const [restaurantFilter, setRestaurantFilter] = useState([]);
  const [ratingSort, setRatingSort] = useState("");
  const [restaurantRatings, setRestaurantRatings] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState([]);
  const [openNowFilter, setOpenNowFilter] = useState(false);

  // Variables and functions to show only 24 by default
  const defaultVisible = 18;
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

        const response = await fetch("/api/get-restaurants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: uuid }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Restaurants',data)
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

    async function loadRestaurantHours() {
      try {
        setLoadingRestaurants(true);
        const res = await fetch("/api/restaurant-hours", {
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
        setRestaurantHours(data);
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
    loadRestaurantHours();
  }, []);

  // Get times for open now feature
  const getOpenStatus = (startTime, endTime, isYesterday) => {
    if (!startTime || !endTime) return { isOpen: false, isClosingSoon: false };

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let [startHour, startMinute] = startTime.toString().split(":").map(Number);
    let [endHour, endMinute] = endTime.toString().split(":").map(Number);

    let start = startHour * 60 + startMinute;
    let end = endHour * 60 + endMinute;

    if (end === 1440) end = 0;

    // Edge case: if a restaurant is always open (24 hours)
    if (start === end) return { isOpen: true, isClosingSoon: false };

    let isOpen = false;
    let minsUntilClose = 0;

    if (isYesterday) {
      // Handling restaurant hours that are open past midnight and time is currently before restaurant close time
      if (start > end && currentMins < end) {
        isOpen = true;
        minsUntilClose = end - currentMins;
      }
    } else {
      // Handles normal day-to-day hours
      if (start < end) {
        isOpen = currentMins >= start && currentMins < end;
        minsUntilClose = end - currentMins;
      } else {
        isOpen = currentMins >= start;
        minsUntilClose = end + 1440 - currentMins;
      }
    }

    return {
      isOpen,
      isClosingSoon: isOpen && minsUntilClose <= 30 && minsUntilClose > 0,
    };
  };

  // Filtering Logic
  let displayedRestaurants = [...restaurants];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const now = new Date();
  const currentDayNum = now.getDay();
  const currentDayName = daysOfWeek[currentDayNum];

  const yesterdayName = daysOfWeek[(currentDayNum + 6) % 7];

  // Map open status to every restaurant
  displayedRestaurants = displayedRestaurants.map((r) => {
    let isOpen = false;
    let isClosingSoon = false;

    // Checks for if hours of operation are overnight and ongoing
    const yesterdaySchedule = restaurantHours.find(
      (h) =>
        h.restaurantID === r.restaurant_id && h.dayOfWeek === yesterdayName,
    );

    if (yesterdaySchedule && yesterdaySchedule.startTimes.length > 0) {
      const status = getOpenStatus(
        yesterdaySchedule.startTimes[0],
        yesterdaySchedule.endTimes[0],
        true,
      );
      if (status.isOpen) {
        isOpen = true;
        isClosingSoon = status.isClosingSoon;
      }
    }

    if (!isOpen) {
      const todaysSchedule = restaurantHours.find(
        (h) =>
          h.restaurantID === r.restaurant_id && h.dayOfWeek === currentDayName,
      );

      if (todaysSchedule && todaysSchedule.startTimes.length > 0) {
        const status = getOpenStatus(
          todaysSchedule.startTimes[0],
          todaysSchedule.endTimes[0],
          false,
        );
        if (status.isOpen) {
          isOpen = true;
          isClosingSoon = status.isClosingSoon;
        }
      }
    }

    return { ...r, isOpen, isClosingSoon };
  });

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

  // Apply Open Now filter
  if (openNowFilter) {
    displayedRestaurants = displayedRestaurants.filter((r) => r.isOpen);
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

      if (scoreB !== scoreA) return scoreB - scoreA;
    }

    // If no data for cuisine for particular restaurant, website doesn't crash
    if ((a.cuisine || "") !== (b.cuisine || "")) {
      return (a.cuisine || "").localeCompare(b.cuisine || "");
    }

    if (a.cuisine !== b.cuisine) {
      return a.cuisine.localeCompare(b.cuisine);
    }

    // If more than 1 restaurant has the same score, order alphabetically
    return a.restaurant_name.localeCompare(b.restaurant_name);
  });

  const restaurantOptions = [
    ...new Set(restaurants.map((r) => r.restaurant_name)),
  ].sort();

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
          openNowFilter={openNowFilter}
          setOpenNowFilter={setOpenNowFilter}
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

        {/* Show message if no restaurants are open while filter is on */}
        {!loadingRestaurants &&
          !loadingRestaurantsError &&
          displayedRestaurants.length === 0 &&
          openNowFilter && (
            <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
              <Typography variant={"h6"} color="textSecondary">
                No restaurants currently open.
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
