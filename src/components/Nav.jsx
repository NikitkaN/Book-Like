import React, { useEffect, useState } from "react";
import { Typography, Container, Box, AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Tooltip, Avatar} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { onAuthStateChanged, signOut, getAuth, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase.js";

const pages = ['Главная', 'Избранное', 'Добавить книгу', 'Панель управления'];
const pagesLow = ['Главная', 'Избранное'];
const settings = ['Профиль', 'Сменить тему', 'Выход'];
const settingsInUp = ['Регистрация', 'Вход'];

const Nav = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
      const /*listen*/ unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
      /*return () => {
        listen();
      };*/
      return unsubscribe;
    }, []);

    useEffect(() => {
      const /*listen*/ unsubscribe = onAuthStateChanged(auth, async (user) => {
        const userRole = localStorage.getItem('userRole');
        if (user) {
          if (userRole === 'admin') {
            console.log('Пользователь имеет роль администратора');
            setIsAdmin(true);
          } else {
            console.log('Пользователь не имеет роль администратора');
            setIsAdmin(false);
          }
        } else {
          // setAuthUser(null);
          setIsAdmin(false);
        }
      });
  
      // return () => {
      //   listen();
      // };
      return unsubscribe;
    }, []);

    function userSignOut() {
      signOut(auth)
        .then(() => console.log("success"))
        .catch((e) => console.log(e));
    }

    const handleNavItemClick = (page) => {
      console.log('set');
      if (page === 'Главная') {
        navigate('/');
        console.log('go');
      } else if (page === 'Избранное') {
        navigate('/Favorite');
      } else if (page === 'Добавить книгу') {
        navigate('/AddBook');
      } else if (page === 'Панель управления') {
        navigate('/Panel');
      }
    };

    const handleMenuItemClick = (setting) => {
      handleCloseUserMenu();
      if (setting === 'Регистрация') {
        navigate('/SignUp');
      } else if (setting === 'Вход') {
        navigate('/SignIn');
      } else if (setting === 'Выход') {
        userSignOut();
      } else if (setting === 'Профиль') {
        navigate('/Profile');
      } else if (setting === 'Сменить тему') {
        // changeTheme();
      }
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
    <AppBar position="static" sx={{ bgcolor: "secondary.main"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant='h1'
            noWrap
            component="a"
            href="#"
            sx={{ py: 2,
                  px: 6,
                  color: "primary.main",
                  letterSpacing: ".2rem",
                  textDecoration: "none",
                  flexGrow: "2"}}
          >
            BookLike
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAdmin ? (
              pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavItemClick(page)}
                  sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              )) 
            ) : (
              pagesLow.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavItemClick(page)}
                  sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="logo192.png" />
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
              {authUser ? (
                settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))
              ) : (
                settingsInUp.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    )
};

export default Nav;