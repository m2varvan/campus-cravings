import React, { useState } from "react";
import Deal from "./Deal";
import { Typography, Grid, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const TodayDeal = ({
      uuid,
      todayDeals,
      loading,
      error,
      loadTodayDeals,
    }) => {

  // Load today's deals on render
  React.useEffect(() => {
    loadTodayDeals();
  }, [uuid]);

  // Variables and functions to show only 12 by default
  const defaultVisible = 9;
  const [visibleCount, setVisibleCount] = useState(defaultVisible);
  const handleShowMore = () => {
    setVisibleCount(todayDeals.length);
  };
  const handleShowLess = () => {
    setVisibleCount(defaultVisible);
  };

  // Function to get the current date and format it
  const getTodayDate = () => {
    const now = new Date();

    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(now);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(now);
    const dayOfMonth = now.getDate();
    const year = now.getFullYear();

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${dayName}, ${monthName} ${dayOfMonth}${getOrdinal(dayOfMonth)}, ${year}`;
  };

  return (
    <Grid item xs={12}>
      {/* Today's Deals title and date */}
      <Typography variant="h4" sx={{ my: 2 }}>
        Today's Deals ({getTodayDate()})
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
          <Typography variant={"h6"}>Loading Today's Deals</Typography>
        </Box>
      )}

      {/* Show error message if API call fails */}
      {!loading && error && (
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
      )}

      {/* Show message saying no deals available */}
      {!loading && !error && todayDeals.length === 0 && (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant={"h6"}>No promotions available today.</Typography>
        </Box>
      )}

      {/* Show Deals */}
      {!loading && !error && todayDeals.length > 0 && (
        <>
          <Grid container data-testid="today-deals">
            {/* Iterate through deals array and render a each deal in a deal component */}
            {todayDeals.slice(0, visibleCount).map((deal) => (
              <Grid item xs={12} sm={6} lg={4} key={deal.dealID} >
                <Deal
                  uuid={uuid}
                  deal={deal}
                />
              </Grid>
            ))}
          </Grid>

          {/* Show More Button */}
          {visibleCount < todayDeals.length && (
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

          {/* Hide More Button */}
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
  );
};

export default TodayDeal;
