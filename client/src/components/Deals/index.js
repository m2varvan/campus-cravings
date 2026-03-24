import React from "react";
import { Typography, Grid } from "@mui/material";
import TodayDeal from "./TodayDeal";
import WeekDeal from "./WeekDeal";
import FilterSortDeals from "./FilterSortDeals";
import { useDeals } from "../../Hooks/useDeals";

// Inner component that uses the context
const Deals = ({ uuid }) => {
  const { allDeals, loading, error, loadAllDeals } = useDeals();

  // Separated deals for display
  const [todayDeals, setTodayDeals] = React.useState([]);
  const [weekDeals, setWeekDeals] = React.useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  // Variables to hold displayed deals
  const [displayedTodayDeals, setDisplayedTodayDeals] = React.useState([]);
  const [displayedWeekDeals, setDisplayedWeekDeals] = React.useState({});

  // Variables to hold filter states
  const [restaurantFilter, setRestaurantFilter] = React.useState([]);
  const [sort, setSort] = React.useState("");
  const [restaurantOptions, setRestaurantOptions] = React.useState([]);

  // Load all deals on component mount
  React.useEffect(() => {
    loadAllDeals();
  }, [uuid, loadAllDeals]);

  // Separate deals into today and byDay based on day_of_week
  React.useEffect(() => {
    const todayDayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const separatedByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    const todayDealsArray = [];
    const dealMap = new Map(); // To avoid duplicates in today's deals

    allDeals.forEach((deal) => {
      // Add to byDay
      separatedByDay[deal.dayOfWeek].push(deal);

      // Add to today's deals if it's today (and not already added)
      if (deal.dayOfWeek === todayDayName && !dealMap.has(deal.dealID)) {
        todayDealsArray.push(deal);
        dealMap.set(deal.dealID, true);
      }
    });

    setTodayDeals(todayDealsArray);
    setWeekDeals(separatedByDay);
  }, [allDeals]);

  // Function to find restaurants for dropdown list once deals load
  React.useEffect(() => {
    const restaurantSet = new Set();

    allDeals.forEach((deal) => {
      if (deal.restaurantName) {
        restaurantSet.add(deal.restaurantName);
      }
    });

    setRestaurantOptions(Array.from(restaurantSet));
  }, [allDeals]);

  // Function to sort deals by vote descending
  const sortByVotes = (deals) =>
    [...deals].sort((a, b) => b.totalVote - a.totalVote);

  // Apply filters and update lists of displayed deals
  React.useEffect(() => {
    // Helper to compute overall rating for a deal
    const getOverallRating = (deal) => {
      if (deal.numRatings === 0) return null; // unrated deals
      return (
        (deal.dealTasteRating + deal.dealPortionRating + deal.dealValueRating) /
        3
      );
    };

    const sortDeals = (deals) => {
      return [...deals].sort((a, b) => {
        let aRating = null;
        let bRating = null;

        // Handle all rating-based sorts (always highest → lowest)
        if (
          sort === "Top Rated" ||
          sort === "Value Rated" ||
          sort === "Portion Rated" ||
          sort === "Taste Rated"
        ) {
          switch (sort) {
            case "Top Rated":
              aRating = getOverallRating(a);
              bRating = getOverallRating(b);
              break;

            case "Value Rated":
              aRating = a.dealValueRating;
              bRating = b.dealValueRating;
              break;

            case "Portion Rated":
              aRating = a.dealPortionRating;
              bRating = b.dealPortionRating;
              break;

            case "Taste Rated":
              aRating = a.dealTasteRating;
              bRating = b.dealTasteRating;
              break;

            default:
              aRating = getOverallRating(a);
              bRating = getOverallRating(b);
          }

          // Handle nulls (unrated last)
          if (aRating === null && bRating === null) return 0;
          if (aRating === null) return 1;
          if (bRating === null) return -1;

          return bRating - aRating;
        }

        // Price sorting
        if (sort === "Top Price") {
          return b.dealPrice - a.dealPrice;
        }

        if (sort === "Low Price") {
          return a.dealPrice - b.dealPrice;
        }

        // No sorting ("None")
        return 0;
      });
    };

    // Filter and sort today's deals
    let filteredToday = todayDeals.filter(
      (deal) =>
        restaurantFilter.length === 0 ||
        restaurantFilter.includes(deal.restaurantName),
    );

    if (sort === "") {
      filteredToday = sortByVotes(filteredToday);
    } else {
      filteredToday = sortDeals(filteredToday);
    }

    setDisplayedTodayDeals(filteredToday);

    // Filter and sort week deals
    const newWeekDeals = {};
    Object.keys(weekDeals).forEach((day) => {
      let filtered = (weekDeals[day] || []).filter(
        (deal) =>
          restaurantFilter.length === 0 ||
          restaurantFilter.includes(deal.restaurantName),
      );

      if (sort === "") {
        filtered = sortByVotes(filtered);
      } else {
        filtered = sortDeals(filtered);
      }

      newWeekDeals[day] = filtered;
    });

    setDisplayedWeekDeals(newWeekDeals);
  }, [restaurantFilter, sort, todayDeals, weekDeals]);

  return (
    <Grid container p={4} display={"flex"}>
      {/* Page Title */}
      <Grid item xs={12}>
        <Typography variant="h3">University Shops Plaza Deals</Typography>
      </Grid>

      {/* Filter Options */}
      <Grid item xs={12} justifyContent={"flex-start"}>
        <FilterSortDeals
          restaurantFilter={restaurantFilter}
          setRestaurantFilter={setRestaurantFilter}
          sort={sort}
          setSort={setSort}
          restaurantOptions={restaurantOptions}
        />
      </Grid>

      {/* Today's Deals */}
      <TodayDeal
        uuid={uuid}
        todayDeals={displayedTodayDeals}
        loading={loading}
        error={error}
        loadTodayDeals={loadAllDeals}
      />

      {/* Weekly Deals */}
      <WeekDeal
        uuid={uuid}
        weekDeals={displayedWeekDeals}
        loading={loading}
        error={error}
        loadWeekDeals={loadAllDeals}
      />
    </Grid>
  );
};

export default Deals;
