import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import Promotions from './Promotion';
import Restaurant from './Restaurant';
import Login from './Login';
import SiteAppBar from './AppBar';
import SignUp from './SignUp';

const App = () => {

  // Create theme
  const theme = createTheme({
  });


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SiteAppBar />
        <div>
          <Routes>
            <Route path="/" element = {<Promotions />} />
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
