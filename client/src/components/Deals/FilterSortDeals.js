import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, OutlinedInput, Chip } from "@mui/material";

const FilterSortDeals = ({
    restaurantFilter,
    setRestaurantFilter,
    ratingSort,
    setRatingSort,
    restaurantOptions = []
    }) => {

  const handleClearFilters = () => {
    setRestaurantFilter([]);
    setRatingSort("");
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 400, // max height of dropdown in px
        width: 220,
      },
    },
  };

  // Functio to remove a single selected restaurant
  const handleDeleteRestaurant = (restaurant) => {
    setRestaurantFilter(restaurantFilter.filter((r) => r !== restaurant));
  };


  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      gap={1} // spacing between controls
      mt={2}
    >
    {/* Multi-select Restaurant Filter */}
      <FormControl size="small" sx={{ minWidth: 250 }}>
        <InputLabel id="restaurant-filter-label">Filter by Restaurant</InputLabel>
        <Select
          labelId="restaurant-filter-label"
          multiple
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
          input={<OutlinedInput label="Filter by Restaurant" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  onDelete={() => handleDeleteRestaurant(value)} // <-- delete one by one
                />
              ))}
            </Box>
          )}
          MenuProps={menuProps}
          data-testid="restaurant-filter"
        >
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