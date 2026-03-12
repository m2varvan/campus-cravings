import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Deals from "../Deals/index";
import RestaurantList from "../Restaurant/index";
import Login from "../User/Login";
import SignUp from "../User/SignUp";
import User from "../User/User";
import Owner from "../User/Owner";
import SiteAppBar from "./AppBar";
import { FirebaseContext } from "../Firebase";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFF8F0",
      paper: "#FFF8F0",
    },
    text: {
      primary: "#2B2D42",
      secondary: "#2B2D42",
      disabled: "#2B2D42",
    },
    primary: {
      light: "#FFF3BF",
      main: "#FFD166",
      dark: "#F4C542",
      contrastText: "#2B2D42",
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

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("U");
  const [uuid, setUuid] = useState(null)
  const [userTypeAfter, setUserTypeAfter] = React.useState('regular');

  const firebase = useContext(FirebaseContext);

useEffect(() => {
    if (firebase) {
        const listener = firebase.auth.onAuthStateChanged(async (user) => {
            setAuthUser(user || null);

            if (user) {
              setUuid(user.uid)
              try {
                  const response = await fetch(`/api/user/${user.uid}`);
                  const data = await response.json();
                  console.log("Profile photo response:", data);
                  setProfilePhoto(data.profilePhoto);
                  const response2 = await fetch(`/api/user/type/${user.uid}`)
                  const data2 = await response2.json();
                  setUserTypeAfter(data2.userType)
                  
              } catch (err) {
                  console.error("Failed to fetch profile photo:", err);
              }
            } else {
              setUuid(null)
            }
        });

        return () => listener();
    }
}, [firebase]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SiteAppBar
          authUser={authUser}
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
          userTypeAfter={userTypeAfter}
        />

        <Routes>
          <Route path="/" element={<Deals uuid={uuid} />} />
          <Route path="/Restaurant" element={<RestaurantList uuid={uuid} />} />
          <Route path="/restaurant" element={<RestaurantList uuid={uuid} />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/User" element={<User uuid={uuid} />} />
          <Route path="/Owner" element={<Owner uuid={uuid} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
