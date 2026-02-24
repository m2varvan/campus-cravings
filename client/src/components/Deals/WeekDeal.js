import { Typography, Grid, Box, CircularProgress } from "@mui/material";
import React from "react";
import WeekDayDeal from "./WeekDayDeal";

const WeekDeal = ({
  uuid,
  weekDeals,
  loadWeekDeals,
  loading,
  error,
  reloadDeals,
  id,
}) => {
  // Load all deals for week view
  React.useEffect(() => {
    loadWeekDeals();
  }, []);

  return (
    <Grid item xs={12}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Weekly Deals (Monday to Sunday)
      </Typography>

      {/* Show loading message when deals are loading */}
      {loading && (
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
          <Typography variant={"h6"}>Loading Weekly Deals</Typography>
        </Box>
      )}

      {/* Show error message if API call fails */}
      {!loading && error ? (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant={"h6"} color="error">
            Something went wrong while loading deals. Please try again.
          </Typography>
        </Box>
      ) : (
        <Grid container justifyContent={"center"}>
          {/*For each day of week, RenderWeekDayDeals* */}
          {Object.keys(weekDeals).map((dayOfWeek, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
              data-testid={dayOfWeek.toLocaleLowerCase()}
            >
              <WeekDayDeal
                uuid={uuid}
                day={dayOfWeek}
                dealList={weekDeals[dayOfWeek]}
                reloadDeals={reloadDeals}
                id={id}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default WeekDeal;
