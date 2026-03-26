import React from "react";
import { Typography, Container, Paper } from "@mui/material";
import BiteMap from "./BiteMap";

const MapPage = ({ uuid }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#2B2D42" }}
      >
        BiteMap
      </Typography>

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
    </Container>
  );
};

export default MapPage;
