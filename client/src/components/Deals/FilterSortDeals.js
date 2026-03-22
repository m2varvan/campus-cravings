import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, OutlinedInput, Chip } from "@mui/material";

const FilterSortDeals = ({
    restaurantFilter,
    setRestaurantFilter,
    sort,
    setSort,
    restaurantOptions = []
    }) => {

  const handleClearFilters = () => {
    setRestaurantFilter([]);
    setSort("");
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 400, // max height of dropdown in px
        width: 220,
      },
    },
  };

  // Function to remove a single selected restaurant
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
                  <Box
                    key={value}
                    onMouseDown={(event) => {
                      event.stopPropagation(); // prevent select from opening
                    }}
                  >
                    <Chip
                      label={value}
                      size="small"
                      onDelete={() => {handleDeleteRestaurant(value)}}
                    />
                  </Box>
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

    {/* Rating and Price Sort */}
    <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="deal-sort-label">Sort By</InputLabel>
        <Select
          labelId="deal-sort-label"
          data-testid="deal-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          label="Sort By"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Top Rated">Overall Rating</MenuItem>
          <MenuItem value="Value Rated">Value Rating</MenuItem>
          <MenuItem value="Portion Rated">Portion Rating</MenuItem>
          <MenuItem value="Taste Rated">Taste Rating</MenuItem>
          <MenuItem value="Top Price">Price High to Low</MenuItem>
          <MenuItem value="Low Price">Price Low to High</MenuItem>
        </Select>
    </FormControl>

      {/* Clear Filters Button */}
    <Button
        data-testid="clear-filters"
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