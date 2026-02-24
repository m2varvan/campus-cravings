import Deal from "./Deal";
import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useEffect } from "react";

const WeekDayDeal = ({ uuid, day, dealList, reloadDeals, id }) => {
  // Variables and functions to show only deals 6 by default
  const defaultVisible = 6;
  const [visibleCount, setVisibleCount] = useState(defaultVisible);
  const handleShowMore = () => {
    setVisibleCount(dealList.length);
  };
  const handleShowLess = () => {
    setVisibleCount(defaultVisible);
  };
  useEffect(() => {
    if (id) {
      setVisibleCount(dealList.length);
    }
  }, [id, dealList]);
  console.log("idih: ", id);

  return (
    <>
      {/* Outlined Box */}
      <Box
        sx={{
          border: "3px solid",
          borderColor: "secondary.dark",
          borderRadius: 2,
          p: 1,
          m: 1,
          height: 550, // Set height so boxes are same size
        }}
      >
        {/* Day Title */}
        <Typography variant="h5">{day}</Typography>

        {/* Scrollable Box for deals */}
        <Box
          sx={{
            maxHeight: 485, // scrollable height
            overflowY: "auto",
          }}
        >
          {/* No promotions message */}
          {dealList.length === 0 ? (
            <Typography>No promotions available on {day}.</Typography>
          ) : (
            <>
              {/* Visible deals */}
              {dealList.slice(0, visibleCount).map((deal) => (
                <Deal
                  key={deal.dealID}
                  uuid={uuid}
                  deal={deal}
                  size={"sm"}
                  reloadDeals={reloadDeals}
                  isOpen={id ? String(id) === String(deal.dealID) : false}
                />
              ))}

              {/* Show More button */}
              {visibleCount < dealList.length && (
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleShowMore}
                    color="secondary"
                  >
                    Show More
                  </Button>
                </Box>
              )}

              {/* Show Less button */}
              {visibleCount > defaultVisible && (
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleShowLess}
                    color="secondary"
                  >
                    Show Less
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default WeekDayDeal;
