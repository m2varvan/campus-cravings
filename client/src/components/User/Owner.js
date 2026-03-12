import React from "react";
import { Typography, Box } from "@mui/material";

const Owner = ({ uuid }) => {
  return (
    <Box sx={{ mt: 5}}>
      <Typography variant="h3">
        This is my Owner account
      </Typography>
    </Box>
  );
};

export default Owner;