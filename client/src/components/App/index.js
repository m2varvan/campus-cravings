import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Deals from "../Deals/index";
import RestaurantList from "../Restaurant/index";
import Login from "../User/Login";
import SiteAppBar from "./AppBar";
import SignUp from "../User/SignUp";
import User from "../User/User";

const App = () => {
  // Create theme
  const theme = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#FFF8F0", // cream background
        paper: "#FFF8F0", // cream paper surfaces
      },
      text: {
        primary: "#2B2D42", // dark text
        secondary: "#2B2D42",
        disabled: "#2B2D42",
      },
      primary: {
        light: "#FFF3BF", // soft yellow
        main: "#FFD166", // mid yellow
        dark: "#F4C542", // bright yellow
        contrastText: "#2B2D42", // dark text on yellow backgrounds
      },
      secondary: {
        light: "#A9BCD9",
        main: "#5E7AA6",
        dark: "#2B2D42",
      },
    },
    typography: {
      fontFamily: "monospace",
    },
  });
  
  const [uuid, setUuid] = React.useState('aa9b8a5d-5298-4212-9175-2db224dc9aa9') // For testing 'aa9b8a5d-5298-4212-9175-2db224dc9aa9'
  const [profilePhoto, setProfilePhoto] = React.useState("U")
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SiteAppBar uuid={uuid} setUuid={setUuid} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />
        <div>
          <Routes>
            <Route path="/" element={<Deals uuid={uuid} />} />
            <Route
              path="/Restaurant"
              element={<RestaurantList uuid={uuid} />}
            />
            <Route path="/restaurant" element={<RestaurantList />} />
            <Route path="/" element={<Deals uuid={uuid} />} />
            <Route path="/Login" element={<Login uuid={uuid} setUuid={setUuid} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/User" element={<User uuid={uuid} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
