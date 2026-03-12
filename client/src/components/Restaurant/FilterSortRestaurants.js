import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  OutlinedInput,
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material";

const FilterSortRestaurants = ({
  restaurantFilter,
  setRestaurantFilter,
  cuisineFilter,
  setCuisineFilter,
  ratingSort,
  setRatingSort,
  openNowFilter,       
  setOpenNowFilter,
  restaurantOptions = [],
  cuisineOptions = [],
}) => {
  const handleClearFilters = () => {
    setRestaurantFilter([]);
    setCuisineFilter([]);
    setRatingSort("");
    setOpenNowFilter(false); 
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 400,
        width: 220,
      },
    },
  };

  const handleDeleteRestaurant = (restaurant) => {
    setRestaurantFilter(restaurantFilter.filter((r) => r !== restaurant));
  };

  const handleDeleteCuisine = (cuisine) => {
    setCuisineFilter(cuisineFilter.filter((c) => c !== cuisine));
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      gap={2}
      mt={2}
    >
      {/* Multi-select Restaurant Filter */}
      <FormControl size="small" sx={{ minWidth: 250 }}>
        <InputLabel id="restaurant-filter-label">
          Filter by Restaurant
        </InputLabel>
        <Select
          labelId="restaurant-filter-label"
          multiple
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
          input={<OutlinedInput label="Filter by Restaurant" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  onDelete={() => handleDeleteRestaurant(value)}
                  onMouseDown={(event) => event.stopPropagation()}
                />
              ))}
            </Box>
          )}
          MenuProps={menuProps}
          data-testid="restaurant-filter"
        >
          {restaurantOptions.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/*Cuisine Filtering*/}
      <FormControl size="small" sx={{ minWidth: 250 }}>
        <InputLabel id="cuisine-filter-label">Filter by Cuisine</InputLabel>
        <Select
          labelId="cuisine-filter-label"
          multiple
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          input={<OutlinedInput label="Filter by Cuisine" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  onDelete={() => handleDeleteCuisine(value)}
                  onMouseDown={(event) => event.stopPropagation()}
                />
              ))}
            </Box>
          )}
          MenuProps={menuProps}
        >
          {cuisineOptions.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Rating Sort */}
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="rating-sort-label">Sort by Category</InputLabel>
        <Select
          labelId="rating-sort-label"
          data-testid="rating-sort"
          value={ratingSort}
          onChange={(e) => setRatingSort(e.target.value)}
          label="Sort by Category"
        >
          <MenuItem value="">
            <em>Default (Alphabetical)</em>
          </MenuItem>
          <MenuItem value="overall">Overall Rating</MenuItem>
          <MenuItem value="taste">Taste</MenuItem>
          <MenuItem value="value">Value</MenuItem>
          <MenuItem value="portion">Portion Size</MenuItem>
        </Select>
      </FormControl>
    
      {/* Open Now Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={openNowFilter}
            onChange={(e) => setOpenNowFilter(e.target.checked)}
            color="secondary"
          />
        }
        label="Open Now"
        sx={{ whiteSpace: "nowrap" }}
      />
      
      {/* Clear Filters */}
      <Button
        data-testid="clear-filters"
        variant="outlined"
        onClick={handleClearFilters}
        sx={{
          height: 40,
          px: 3,
          textTransform: "none",
        }}
      >
        Reset All
      </Button>
    </Box>
  );
};
export default FilterSortRestaurants;
