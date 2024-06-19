import React, { useState } from "react";
import { signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import { auth } from "../firebase.js";

import { useNavigate } from 'react-router-dom';
import Nav from "../components/Nav.jsx";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (email === "admin@gmail.com") {
        await updateProfile(user, { role: "admin" });
        localStorage.setItem('userRole', 'admin');
      } else {
        await updateProfile(user, { role: "user" });
        localStorage.setItem('userRole', 'user');
      }

      setError("");
      setEmail("");
      setPassword("");
      navigate('/');
    } catch (error) {
        console.error(error);
        setError("SORRY, COULDN'T FIND YOUR ACCOUNT");
      };
  };

  return (
    <>
    <Nav />
    <Container component="main" maxWidth="xs">
      <form onSubmit={handleLogin}>
        <Typography component="h1" textAlign="center" variant="h5" sx={{ marginTop: 2, marginBottom: 2 }}>
          Вход
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button sx={{ marginTop: 2, marginBottom: 2 }} type="submit" fullWidth variant="contained" color="primary">
          Войти
        </Button>
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}
      </form>
    </Container>
    </>
  );
};

export default SignIn;
