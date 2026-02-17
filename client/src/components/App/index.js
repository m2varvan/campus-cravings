import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Deals from '../Deals/index';
import RestaurantList from '../Restaurant/index';
import Login from '../User/Login';
import SiteAppBar from './AppBar';
import SignUp from '../User/SignUp';
import RestaurantDetails from '../Restaurant/RestaurantDetails';

const App = () => {

  // Create theme
  const theme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#FFF8F0', // cream background
        paper: '#FFF8F0',   // cream paper surfaces
      },
      text: {
        primary: '#2B2D42', // dark text
        secondary: '#2B2D42',
        disabled: '#2B2D42',
      },
      primary: {
        light: '#FFF3BF',       // soft yellow
        main: '#FFD166',        // mid yellow
        dark: '#F4C542',        // bright yellow
        contrastText: '#2B2D42', // dark text on yellow backgrounds
      },
      secondary: {
        light: '#A9BCD9',
        main: '#5E7AA6',
        dark: '#2B2D42',
      }
    },
  });

  const uuid = null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SiteAppBar />
        <div>
          <Routes>
            <Route path="/" element = {<Deals uuid={uuid}/>} />
            <Route path="/Restaurant" element = {<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/Login" element = {<Login />} />
            <Route path="/Signup" element = {<SignUp />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
    
  );
}

export default App;
