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

  const handleDeleteRestaurant = (restaurant) => {
    setRestaurantFilter(restaurantFilter.filter((r) => r !== restaurant));
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
        gap: 2,
        mt: 2,
        p: 2,
        backgroundColor: "#f9f9f9", 
        borderRadius: 2,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.05)"
      }}
    >
      {/* Multi-select Restaurant Filter */}
      <FormControl size="small" sx={{ minWidth: 220, flexGrow: 1, maxWidth: 300 }}>
        <InputLabel id="restaurant-filter-label">Filter by Restaurant</InputLabel>
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
        >
          {restaurantOptions.map((name) => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Cuisine Filtering */}
      <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1, maxWidth: 250 }}>
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
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Rating Sort */}
      <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1, maxWidth: 220 }}>
        <InputLabel id="rating-sort-label">Sort by Category</InputLabel>
        <Select
          labelId="rating-sort-label"
          value={ratingSort}
          onChange={(e) => setRatingSort(e.target.value)}
          label="Sort by Category"
        >
          <MenuItem value=""><em>Default (A-Z)</em></MenuItem>
          <MenuItem value="overall">Overall Rating</MenuItem>
          <MenuItem value="taste">Taste</MenuItem>
          <MenuItem value="value">Value</MenuItem>
          <MenuItem value="portion">Portion Size</MenuItem>
        </Select>
      </FormControl>

      {/* Open Now Toggle Container */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        height: 40, 
        px: 1,
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: 1,
        backgroundColor: "#fff" 
      }}>
        <FormControlLabel
          control={
            <Switch
              checked={openNowFilter}
              onChange={(e) => setOpenNowFilter(e.target.checked)}
              color="success" 
            />
          }
          label="Open Now"
          sx={{ 
            m: 0, 
            "& .MuiFormControlLabel-label": { fontSize: "0.9rem", color: "text.secondary" } 
          }}
        />
      </Box>

      {/* Clear Filters */}
      <Button
        variant="contained"
        onClick={handleClearFilters}
        sx={{
          height: 40,
          px: 3,
          ml: "auto", 
          textTransform: "none",
          fontWeight: "bold",
          backgroundColor: "#c5a000", 
          color: "#fff",
          "&:hover": {
            backgroundColor: "#a38400", 
          },
        }}
      >
        Reset All
      </Button>
    </Box>
  );
};

export default FilterSortRestaurants;