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
  ratingSort,
  setRatingSort,
  restaurantOptions = [],
  cuisineFilter,
  setCuisineFilter,
  cuisineOptions = [],
  openNowFilter,
  setOpenNowFilter,
}) => {
  const handleClearFilters = () => {
    setRestaurantFilter([]);
    setRatingSort("");
    setCuisineFilter([]);
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

  const handleDeleteCuisine = (cuisine) => {
    setCuisineFilter(cuisineFilter.filter((c) => c !== cuisine));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1,
        mt: 2,
        p: 2,
        borderRadius: 2,
      }}
    >
      {/* Cuisine Filtering */}
      <FormControl
        size="small"
        sx={{ minWidth: 200, flexGrow: 1, maxWidth: 250 }}
      >
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
      <FormControl
        size="small"
        sx={{ minWidth: 200, flexGrow: 1, maxWidth: 220 }}
      >
        <InputLabel id="rating-sort-label">Sort By</InputLabel>
        <Select
          labelId="rating-sort-label"
          value={ratingSort}
          onChange={(e) => setRatingSort(e.target.value)}
          label="Sort by Category"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="overall">Overall Rating</MenuItem>
          <MenuItem value="taste">Taste</MenuItem>
          <MenuItem value="value">Value</MenuItem>
          <MenuItem value="portion">Portion Size</MenuItem>
        </Select>
      </FormControl>

      {/* Open Now Toggle Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 40,
          px: 1,
          borderRadius: 1,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={openNowFilter}
              onChange={(e) => setOpenNowFilter(e.target.checked)}
              sx={{
                // UNCHECKED thumb (circle)
                '& .MuiSwitch-switchBase': {
                  color: (theme) => theme.palette.grey[400],
                },

                // UNCHECKED track (background)
                '& .MuiSwitch-track': {
                  backgroundColor: (theme) => theme.palette.grey[300],
                  opacity: 1, // override default faded look if you want solid grey
                },

                // CHECKED thumb
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: (theme) => theme.palette.primary.dark,
                },

                // CHECKED track
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            />
          }
          label="Open Now"
          sx={{
            m: 0,
          }}
        />
      </Box>

      {/* Clear Filters */}
      <Button 
        variant="contained" 
        onClick={handleClearFilters}
        sx={{
          height: 40, // match small select height
          px: 3
        }}>
        Reset All
      </Button>
    </Box>
  );
};

export default FilterSortRestaurants;
