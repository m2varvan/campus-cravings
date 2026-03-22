import React from "react";
import { Typography, Grid } from "@mui/material";
import TodayDeal from "./TodayDeal";
import WeekDeal from "./WeekDeal";
import FilterSortDeals from "./FilterSortDeals";

const Deals = ({ uuid }) => {

  // Stateful variables to load today's deals from db
  const [todayDeals, setTodayDeals] = React.useState([]);
  const [loadingTodayDeals, setLoadingTodayDeals] = React.useState(false);
  const [todayDealsError, setTodayDealsError] = React.useState(false);

  // Stateful variables to load today's deals from db
  const [weekDeals, setWeekDeals] = React.useState({});
  const [loadingWeekDeals, setLoadingWeekDeals] = React.useState(false);
  const [WeekDealsError, setWeekDealsError] = React.useState(false);

  // Variables to hold displayed deals
  const [displayedTodayDeals, setDisplayedTodayDeals] = React.useState([])
  const [displayedWeekDeals, setDisplayedWeekDeals] = React.useState({});

  // Variables to hold filter states
  const [restaurantFilter, setRestaurantFilter] = React.useState([]);
  const [sort, setSort] = React.useState('');
  const [restaurantOptions, setRestaurantOptions] = React.useState([])



  // API to load today's deals
 const loadTodayDeals = async () => {
    try {
      setLoadingTodayDeals(true);

      const response = await fetch("/api/today/deals", {
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
      const sortedData = sortByVotes(data);
      setTodayDeals(data);
      setDisplayedTodayDeals(sortedData);

      console.log(data);
    } catch (error) {
      console.error("Failed to load today's deals:", error);
      setTodayDealsError(true);
    } finally {
      setLoadingTodayDeals(false);
    }
  };

  // API to load week deals
  const loadWeekDeals = async () => {
    try {
      setLoadingWeekDeals(true);

      const response = await fetch("/api/week/deals", {
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
      // Sort each day's deals by votes
      const sortedData = {};
      Object.keys(data).forEach((day) => {
        sortedData[day] = sortByVotes(data[day] || []);
      });
      setWeekDeals(data);
      setDisplayedWeekDeals(sortedData);
    } catch (error) {
      console.error("Failed to load weekly deals:", error);
      setWeekDealsError(true);
    } finally {
      setLoadingWeekDeals(false);
    }
  };


  // Funtion to find restaurants for dropdown list once deals load
  React.useEffect(() => {
    const restaurantSet = new Set();

    Object.values(weekDeals).forEach((dailyDeals) => {
      dailyDeals.forEach((deal) => {
        if (deal.restaurantName) {
          restaurantSet.add(deal.restaurantName);
        }
      });
    });

    setRestaurantOptions(Array.from(restaurantSet));
  }, [weekDeals])

  // Function to sort deals by vote descending
  const sortByVotes = (deals) => [...deals].sort((a, b) => b.totalVote - a.totalVote);


  // Apply filters and update lists of displayed deals
  React.useEffect(() => {

     // Helper to compute overall rating for a deal
    const getOverallRating = (deal) => {
      if (deal.numRatings === 0) return null; // unrated deals
      return (deal.dealTasteRating + deal.dealPortionRating + deal.dealValueRating) / 3;
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
    let filteredToday = todayDeals.filter((deal) =>
      restaurantFilter.length === 0 || restaurantFilter.includes(deal.restaurantName)
    );

    if (sort === '') {
      filteredToday = sortByVotes(filteredToday);
    } else {
      filteredToday = sortDeals(filteredToday)
    }

    setDisplayedTodayDeals(filteredToday);

    // Filter and sort week deals
    const newWeekDeals = {};
    Object.keys(weekDeals).forEach((day) => {
      let filtered = (weekDeals[day] || []).filter(
        (deal) => restaurantFilter.length === 0 || restaurantFilter.includes(deal.restaurantName)
      );

      if (sort === '') {
        filtered = sortByVotes(filtered);
      } else {
        filtered = sortDeals(filtered);
      }

      newWeekDeals[day] = filtered;
    });

    setDisplayedWeekDeals(newWeekDeals);

  }, [restaurantFilter, sort, todayDeals, weekDeals])

  // Function to reload all deals
  const reloadDeals = () => {
    loadWeekDeals();
    loadTodayDeals();
  };

  return (
    <Grid container p={4} display={"flex"}>

      {/* Page Title */}
      <Grid item xs={12}>
        <Typography variant="h3">University Shops Plaza Deals</Typography>
      </Grid>

      {/* Filter Options */}
      <Grid item xs={12} justifyContent={'flex-start'}>
        <FilterSortDeals 
          restaurantFilter={restaurantFilter}
          setRestaurantFilter={setRestaurantFilter}
          sort={sort}
          setSort={setSort}
          restaurantOptions={restaurantOptions} />
      </Grid>
      

      {/* Today's Deals */}
      <TodayDeal
        uuid={uuid}
        todayDeals={displayedTodayDeals}
        loading={loadingTodayDeals}
        error={todayDealsError}
        loadTodayDeals={loadTodayDeals}
        reloadDeals={reloadDeals}
      />

      {/* Weekly Deals */}
      <WeekDeal
        uuid={uuid}
        weekDeals={displayedWeekDeals}
        loading={loadingWeekDeals}
        error={WeekDealsError}
        loadWeekDeals={loadWeekDeals}
        reloadDeals={reloadDeals}
      />

    </Grid>
  );
};

export default Deals;
