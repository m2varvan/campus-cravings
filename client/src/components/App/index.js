import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import Promotions from '../Promotion/Promotion';
import Restaurant from '../Restaurant/Restaurant';
import Login from '../User/Login';
import SiteAppBar from './AppBar';
import SignUp from '../User/SignUp';

const App = () => {

  // Create theme
  const theme = createTheme({
  });

  const uuid = null;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SiteAppBar />
        <div>
          <Routes>
            <Route path="/" element = {<Promotions uuid={uuid}/>} />
            <Route path="/Restaurant" element = {<Restaurant />} />
            <Route path="/Login" element = {<Login />} />
            <Route path="/Signup" element = {<SignUp />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
    
  );
}

export default App;
