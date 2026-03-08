import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

const FilterSortDeals = ({
    restaurantFilter,
    setRestaurantFilter,
    ratingSort,
    setRatingSort,
    restaurantOptions = []
    }) => {

  const handleClearFilters = () => {
    setRestaurantFilter("");
    setRatingSort("");
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      gap={1} // spacing between controls
      mt={2}
    >
      {/* Restaurant Filter */}
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="restaurant-filter-label">Filter by Restaurant</InputLabel>
        <Select
          labelId="restaurant-filter-label"
          data-testid="restaurant-filter"
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
          label="Filter by Restaurant"
        >
          <MenuItem value=""><em>All</em></MenuItem>
          {restaurantOptions.map((name) => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Rating Sort */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="rating-sort-label">Sort by Rating</InputLabel>
        <Select
          labelId="rating-sort-label"
          data-testid="rating-sort"
          value={ratingSort}
          onChange={(e) => setRatingSort(e.target.value)}
          label="Sort by Rating"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Highest">Highest to Lowest</MenuItem>
          <MenuItem value="Lowest">Lowest to Highest</MenuItem>
        </Select>
      </FormControl>

      {/* Clear Filters Button */}
      <Button
        data-testid="clear-filters-btn"
        variant="contained"
        onClick={handleClearFilters}
        sx={{
          height: 40, // match small select height
          px: 3
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default FilterSortDeals;