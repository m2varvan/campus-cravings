import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ReviewSort = ({ sortType, setSortType }) => {

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 180,
        mb: 2
      }}
    >

      <InputLabel id="review-sort-label">
        Sort Reviews
      </InputLabel>

      <Select
        labelId="review-sort-label"
        value={sortType}
        label="Sort Reviews"
        onChange={(e) => setSortType(e.target.value)}
      >

        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
        <MenuItem value="mostHelpful">Most Helpful</MenuItem>
        <MenuItem value="leastHelpful">Least Helpful</MenuItem>

      </Select>

    </FormControl>
  );
};

export default ReviewSort;