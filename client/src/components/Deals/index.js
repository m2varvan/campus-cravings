import TodayDeal from "./TodayDeal";
import WeekDeal from "./WeekDeal";
import React from "react";
import { Typography, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import ExpandedDeal from "./ExpandedDeal";

const Deals = ({ uuid }) => {
  // Stateful variables to load today's deals from db
  const [todayDeals, setTodayDeals] = React.useState([]);
  const [loadingTodayDeals, setLoadingTodayDeals] = React.useState(false);
  const [todayDealsError, setTodayDealsError] = React.useState(false);

  const [weekDeals, setWeekDeals] = React.useState({});
  const [loadingWeekDeals, setLoadingWeekDeals] = React.useState(false);
  const [WeekDealsError, setWeekDealsError] = React.useState(false);
  const { id } = useParams();

  const [selectedDeal, setSelectedDeal] = React.useState(null);

  React.useEffect(() => {
    if (id && weekDeals) {
      // matching id from params to deal id
      const allDeals = Object.values(weekDeals).flat();
      const foundDeal = allDeals.find((d) => String(d.dealID) === String(id));
      if (foundDeal) setSelectedDeal(foundDeal);
    }
  }, [id, weekDeals]);

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
      console.log(data);
    } catch (error) {
      console.error("Failed to load today's deals:", error);
      setTodayDealsError(true);
    } finally {
      setLoadingTodayDeals(false);
    }
  };

  // API to load today's deals
  const loadWeekDeals = async () => {
    try {
      setLoadingWeekDeals(true);
      const response = await fetch("/api/week/deals");

      if (!response.ok) {
        throw new Error(`Server error: $(response.status)`);
      }

      const data = await response.json();
      setWeekDeals(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to load weekly deals:", error);
      setWeekDealsError(true);
    } finally {
      setLoadingWeekDeals(false);
    }
  };

  // Function to reload all deals
  const reloadDeals = () => {
    loadWeekDeals();
    loadTodayDeals();
  };

  return (
    <Grid container p={4} display={"flex"}>
      {/* Page Title */}
      <Typography variant="h4">University Shops Plaza Deals</Typography>

      {/* Today's Deals */}
      <TodayDeal
        uuid={uuid}
        todayDeals={todayDeals}
        loading={loadingTodayDeals}
        error={todayDealsError}
        loadTodayDeals={loadTodayDeals}
        reloadDeals={reloadDeals}
      />

      {/* Weekly Deals */}
      <WeekDeal
        uuid={uuid}
        weekDeals={weekDeals}
        loading={loadingWeekDeals}
        error={WeekDealsError}
        loadWeekDeals={loadWeekDeals}
        reloadDeals={reloadDeals}
      />

      {selectedDeal && (
        <ExpandedDeal
          uuid={uuid}
          deal={selectedDeal}
          handleClose={() => setSelectedDeal(null)}
          open={!!selectedDeal}
          reloadDeals={reloadDeals}
        />
      )}
    </Grid>
  );
};

export default Deals;
