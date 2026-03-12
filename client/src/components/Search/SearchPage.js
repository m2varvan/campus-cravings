import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

import Deal from "../Deals/Deal";
import Restaurant from "../Restaurant/Restaurant";

function SearchPage({ uuid }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const [restaurants, setRestaurants] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError("");

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then(async (searchResults) => {
        // Fetch all restaurants to get favorite status
        const restRes = await fetch("/api/get-restaurants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: uuid }),
        });
        const allRestaurants = restRes.ok ? await restRes.json() : [];
        
        // Build a map of restaurant_id -> is_favourited
        const restFavMap = {};
        allRestaurants.forEach((r) => {
          restFavMap[r.restaurant_id] = !!r.is_favourited;
        });

        // Enrich search results with favorite status
        const enrichedRestaurants = (searchResults.restaurants || []).map((r) => ({
          ...r,
          is_favourited: restFavMap[r.restaurant_id] || false,
        }));
        
        setRestaurants(enrichedRestaurants);

        const dealResults = searchResults.deals || [];
        if (dealResults.length === 0) {
          setDeals([]);
          return;
        }

        // Group deal IDs by restaurant so we can fetch them in batches
        const dealsByRestaurant = {};
        dealResults.forEach((d) => {
          const rid = d.restaurant_id;
          if (!dealsByRestaurant[rid]) dealsByRestaurant[rid] = [];
          dealsByRestaurant[rid].push(d.deal_id);
        });

        // Fetch full deals for each restaurant using the existing API
        const dealFetches = Object.entries(dealsByRestaurant).map(
          async ([restaurantId, dealIds]) => {
            const res = await fetch("/api/restaurant-deals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ restaurant_id: restaurantId, userID: uuid }),
            });
            if (!res.ok) return [];
            const allDeals = await res.json();
            return allDeals.filter((deal) => dealIds.includes(deal.dealID || deal.deal_id));
          }
        );

        const dealsArrays = await Promise.all(dealFetches);
        const fullDeals = dealsArrays.flat();

        // backend returns a row per hour; just dedupe and keep first instance
        const dedup = {};
        fullDeals.forEach((d) => {
          const id = d.dealID ?? d.deal_id;
          if (!dedup[id]) {
            dedup[id] = d;
          }
        });
        const uniqueDeals = Object.values(dedup);

        const favRes = await fetch("/api/week/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: uuid }),
        });
        const favByDay = favRes.ok ? await favRes.json() : {};
        const favMap = {};
        Object.values(favByDay).forEach((arr) => {
          arr.forEach((dd) => {
            favMap[dd.dealID] = !!dd.fave;
          });
        });

        // map into the shape expected by the Deal component
        const mappedDeals = uniqueDeals.map((d) => {
          const dayCount = d.daysOfWeek?.length || 1;
          return {
            dealID: d.dealID ?? d.deal_id,
            dealName: d.dealName ?? d.deal_name,
            dealPrice: d.dealPrice ?? d.deal_price,
            restaurantName: d.restaurantName ?? d.restaurant_name,
            dealValueRating: d.dealValueRating ?? d.avg_value_rating ?? 0,
            dealPortionRating: d.dealPortionRating ?? d.avg_portion_rating ?? 0,
            dealTasteRating: d.dealTasteRating ?? d.avg_taste_rating ?? 0,
            numRatings: d.numRatings ?? d.number_of_ratings ?? 0,
            totalVote: d.totalVote ? Math.round(d.totalVote / dayCount) : 0,
            userVote: d.userVote ?? d.user_vote ?? 0,
            fave: d.fave ?? favMap[d.dealID ?? d.deal_id] ?? false,
            dealDescription: d.dealDescription ?? d.description,
          };
        });

        setDeals(mappedDeals);
      })
      .catch((e) => {
        console.error("Search error", e);
        setError("Search failed.");
      })
      .finally(() => setLoading(false));
  }, [query, uuid]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Search Results for "{query}"
      </Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error">{error}</Typography>}

      {/* Restaurants */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Restaurants
      </Typography>
      {!loading && restaurants.length === 0 && <Typography>No restaurants found.</Typography>}
      {restaurants.map((restaurant) => (
        <Restaurant key={restaurant.restaurant_id} restaurant={restaurant} uuid={uuid} />
      ))}

      {/* Deals */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Deals
      </Typography>
      {!loading && deals.length === 0 && <Typography>No deals found.</Typography>}
      {deals.map((deal) => (
        <Deal key={deal.dealID} deal={deal} uuid={uuid} />
      ))}
    </Box>
  );
}

export default SearchPage;