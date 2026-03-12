import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../Search/SearchBar";
import { useLocation } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';


const pages = [
  { label: 'Deals', path: '/', id: 'nav-promotions' },
  { label: 'Restaurants', path: '/Restaurant', id: 'nav-restaurant' },
];

const SiteAppBar = ({ authUser, profilePhoto, setProfilePhoto }) => {

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const firebase = React.useContext(FirebaseContext);

  let settings;

  const handleSignOut = async () => {
    await firebase.doSignOut();
    setProfilePhoto('U');

    if (location.pathname === '/User') {
      navigate('/');
    }

    window.location.reload();
  };

  if (authUser == null) {
    settings = [
      { label: 'Login', path: '/Login', id: 'nav-login' },
      { label: 'SignUp', path: '/SignUp', id: 'nav-signup' },
    ];
  } else {
    settings = [
      { label: 'My Account', path: '/User', id: 'nav-user' },
      { label: 'SignOut', action: handleSignOut, id: 'nav-signout' }
      
    ];
  }
  

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="sticky" sx={{bgcolor: 'secondary.dark', color: 'background.default'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Logo for md and up */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Campus Cravings
          </Typography>

          {/* Logo for xs and sm*/}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontSize: '1.8rem', 
              fontWeight: 700,
              color: 'inherit',
            }}
          >
            CampusCravings
          </Typography>

          {/* Page Buttons */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                id={page.id}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  color: 'white',
                  display: 'block',
                  fontSize: '1.1rem',      
                  px: 3,   
                  py: 1.5,
                  minWidth: 120,
                  textTransform: 'none'
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          
          {/* Search Bar */}
          <SearchBar />

          {/* User Avatar & Settings */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="User Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{profilePhoto}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() => {
                    if (setting.action) {
                      setting.action()
                    } else if (setting.path) {
                        handleNavigate(setting.path);
                    }
                    handleCloseUserMenu();
                  }}
                  id={setting.id}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default SiteAppBar;
