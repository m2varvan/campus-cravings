import React from "react";
import { Typography, Grid, Paper } from "@mui/material";
import BiteMap from "./BiteMap";

const MapPage = ({ uuid }) => {
  return (
    <Grid container py={4} px={8} display={"flex"}>
      <Typography variant="h4">BiteMap</Typography>

      <Paper
        elevation={4}
        sx={{
          height: "70vh",
          minHeight: "500px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "2px solid",
          borderColor: "primary.main",
        }}
      >
        <BiteMap uuid={uuid} />
      </Paper>
    </Grid>
  );
};

export default MapPage;
