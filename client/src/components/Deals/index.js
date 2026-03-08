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
  const [restaurantFilter, setRestaurantFilter] = React.useState('');
  const [ratingSort, setRatingSort] = React.useState('');
  const [restaurants, setRestaurantOptions] = React.useState([])


  // API to load today's deals
  const loadTodayDeals = async () => {
    try {
      setLoadingTodayDeals(true);
      const response = await fetch("/api/today/deals");

      if (!response.ok) {
        throw new Error(`Server error: $(response.status)`);
      }

      const data = await response.json();
      setTodayDeals(data);
      setDisplayedTodayDeals(data)

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
      const response = await fetch("/api/week/deals");

      if (!response.ok) {
        throw new Error(`Server error: $(response.status)`);
      }

      const data = await response.json();
      setWeekDeals(data);
      setDisplayedWeekDeals(data)

    } catch (error) {
      console.error("Failed to load weekly deals:", error);
      setWeekDealsError(true);
    } finally {
      setLoadingWeekDeals(false);
    }
  };

  // Funtion to find restaurants for dropdown list once deals load
  React.useEffect(() => {


  }, [weekDeals])

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
          restaurantFiler={restaurantFilter}
          ratingSort={ratingSort}
          setRestaurantFilter={setRestaurantFilter}
          setRatingSort={setRatingSort}
          restaurantOptions={restaurants} />
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
