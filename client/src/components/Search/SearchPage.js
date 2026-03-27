import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, CircularProgress, Grid, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

import Deal from "../Deals/Deal";
import Restaurant from "../Restaurant/Restaurant";
import { useDeals } from "../../Hooks/useDeals";


const getOpenStatus = (startTime, endTime, isYesterday) => {
  if (!startTime || !endTime) return { isOpen: false, isClosingSoon: false };

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMinute] = startTime.toString().split(":").map(Number);
  const [endHour, endMinute] = endTime.toString().split(":").map(Number);

  let start = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;

  if (end === 1440) end = 0;
  if (start === end) return { isOpen: true, isClosingSoon: false };

  let isOpen = false;
  let minsUntilClose = 0;

  if (isYesterday) {
    if (start > end && currentMins < end) {
      isOpen = true;
      minsUntilClose = end - currentMins;
    }
  } else {
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

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function SearchPage({ uuid }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const { allDeals, loadAllDeals } = useDeals();

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantRatings, setRestaurantRatings] = useState([]); // kept separately so Restaurant component receives it the same way as RestaurantList
  const [deals, setDeals] = useState([]);
  const [matchedDealIDs, setMatchedDealIDs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Callback to update favorite status in the restaurants list
  const handleFavouriteChange = (restaurantID, isFavourited) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((r) =>
        r.restaurant_id === restaurantID
          ? { ...r, is_favourited: isFavourited }
          : r,
      ),
    );
  };

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
      setLoading(true);
      setError("");
      setUsers([]);
      setRestaurants([]);
      setRestaurantRatings([]);
      setMatchedDealIDs([]);

      
      if (allDeals.length === 0) {
        await loadAllDeals();
      }

        Promise.all([
      // existing search (restaurants + deals ids)
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then((res) => {
        if (!res.ok) throw new Error("Search API failed");
        return res.json();
      }),
      // user search
      fetch(`/api/search/users?q=${encodeURIComponent(query)}`).then((res) =>
        res.ok ? res.json() : []
      ),
      // full restaurant list — gives us cuisine, is_favourited
      fetch("/api/get-restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: uuid }),
      }).then((res) => (res.ok ? res.json() : [])),
      // all ratings — same payload RestaurantList uses
      fetch("/api/restaurant-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ getAll: true }),
      }).then((res) => (res.ok ? res.json() : [])),
      // all hours — same payload RestaurantList uses
      fetch("/api/restaurant-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ getAll: true }),
      }).then((res) => (res.ok ? res.json() : [])),
    ])
        .then(async ([searchResults, userResults, allRestaurants, allRatings, allHours]) => {

        
        setUsers(userResults || []);

        // Keep ratings array for passing to Restaurant cards (same shape as RestaurantList)
        setRestaurantRatings(allRatings);

        
        const restMap = {};
        allRestaurants.forEach((r) => { restMap[r.restaurant_id] = r; });

        const now = new Date();
        const currentDayName = daysOfWeek[now.getDay()];
        const yesterdayName = daysOfWeek[(now.getDay() + 6) % 7];

        const enrichedRestaurants = (searchResults.restaurants || []).map((searchRest) => {
          const full = restMap[searchRest.restaurant_id] || searchRest;

          let isOpen = false;
          let isClosingSoon = false;

          // Check yesterday's schedule for overnight hours
          const yesterdaySchedule = allHours.find(
            (h) => h.restaurantID === full.restaurant_id && h.dayOfWeek === yesterdayName
          );
          if (yesterdaySchedule?.startTimes?.length > 0) {
            const status = getOpenStatus(yesterdaySchedule.startTimes[0], yesterdaySchedule.endTimes[0], true);
            if (status.isOpen) { isOpen = true; isClosingSoon = status.isClosingSoon; }
          }

          // Check today's schedule
          if (!isOpen) {
            const todaySchedule = allHours.find(
              (h) => h.restaurantID === full.restaurant_id && h.dayOfWeek === currentDayName
            );
            if (todaySchedule?.startTimes?.length > 0) {
              const status = getOpenStatus(todaySchedule.startTimes[0], todaySchedule.endTimes[0], false);
              if (status.isOpen) { isOpen = true; isClosingSoon = status.isClosingSoon; }
            }
          }

          // Return the full restaurant object (with cuisine, is_favourited) plus open status
          return { ...full, isOpen, isClosingSoon };
        });

        setRestaurants(enrichedRestaurants);

        
        setMatchedDealIDs((searchResults.deals || []).map((deal) => deal.deal_id));
      })
      .catch((e) => {
        console.error("Search error", e);
        setError("Search failed. Please try again.");
      })
      .finally(() => setLoading(false));
    };

    performSearch();
  }, [query, uuid, allDeals.length, loadAllDeals]);

  useEffect(() => {
    if (matchedDealIDs.length === 0) {
      setDeals([]);
      return;
    }

    const searchDealIds = new Set(matchedDealIDs);
    const dealMap = new Map();
    const foundDeals = [];

    allDeals.forEach((deal) => {
      if (searchDealIds.has(deal.dealID) && !dealMap.has(deal.dealID)) {
        foundDeals.push(deal);
        dealMap.set(deal.dealID, true);
      }
    });

    setDeals(foundDeals);
  }, [allDeals, matchedDealIDs]);

  const handleUserClick = (user) => {
    const route = user.user_type === "restaurant_owner" ? "/Owner" : "/User";
    navigate(`${route}?id=${user.id}`);
  };

  return (
    <Box sx={{ py: 4, px: 8, width: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Search Results for "{query}"
        </Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error">{error}</Typography>}

      {/* ── Users ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Users</Typography>

      {!loading && users.length === 0 && <Typography>No users found.</Typography>}

      <Grid container spacing={2} justifyContent="flex-start">
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Paper
              data-testid={`user-result-${user.id}`}
              elevation={1}
              onClick={() => handleUserClick(user)}
              sx={{
                width: "100%",
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                borderRadius: 2,
                border: "1px solid #000",
                bgcolor: "#fff",
                "&:hover": { filter: "brightness(0.98)", boxShadow: 3 },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: "secondary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {user.profile_photo && user.profile_photo.length <= 2
                  ? user.profile_photo
                  : <PersonIcon />}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {user.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.user_type === "restaurant_owner" ? "Restaurant Owner" : "Regular User"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Restaurants ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Restaurants</Typography>
      {!loading && restaurants.length === 0 && <Typography>No restaurants found.</Typography>}
      {/* Pass restaurantRatings the same way RestaurantList does so the Rating chip renders correctly */}
      <Grid container spacing={2} justifyContent="flex-start">
        {restaurants.map((restaurant) => (
          <Restaurant
            key={restaurant.restaurant_id}
            restaurant={restaurant}
            uuid={uuid}
            ratings={restaurantRatings}
            onFavouriteChange={handleFavouriteChange}
          />
        ))}
      </Grid>

      {/* ── Deals ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Deals</Typography>
      {!loading && deals.length === 0 && <Typography>No deals found.</Typography>}
      {deals.length > 0 && (
        <Grid container spacing={2} justifyContent="flex-start">
          {deals.map((deal) => (
            <Grid item xs={12} sm={6} lg={4} key={deal.dealID}>
              <Deal deal={deal} uuid={uuid} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  </Box>
  );
}

export default SearchPage;