import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import { auth } from "../firebase.js";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.js';
import { doc, getDoc, collection, query, where, orderBy, getDocs, setDoc, addDoc, updateDoc } from "firebase/firestore";
import Nav from "../components/Nav.jsx";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (copyPassword !== password) {
      setError("Passwords didn't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (email === "admin@gmail.com") {
        await updateProfile(user, { role: "admin" });
        await addDoc(collection(db, "Users"), {
          mail: email,
          role: 'admin'
        });
        localStorage.setItem('userRole', 'admin');
      } else {
        await updateProfile(user, { role: "user" });
        await addDoc(collection(db, "Users"), {
          mail: email,
          role: 'user'
        });
        localStorage.setItem('userRole', 'user');
      }

      console.log(user);
      setError("");
      setEmail("");
      setCopyPassword("");
      setPassword("");
      navigate('/');
    } catch (error) {
      console.error(error);
      setError("Registration failed");
    }
  };

  return (
    <>
    <Nav />
    <Container component="main" maxWidth="xs">
      <form onSubmit={handleRegister}>
        <Typography component="h1" textAlign="center" variant="h5" sx={{ marginTop: 2, marginBottom: 2 }}>
          Создание аккаунта
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm Password"
              type="password"
              value={copyPassword}
              onChange={(e) => setCopyPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button sx={{ marginTop: 2, marginBottom: 2 }} type="submit" fullWidth variant="contained" color="primary">
          Создать
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

export default SignUp;
