import React, { useEffect, useState } from "react";
import { Typography, Container, Box, Grid, Paper, Card, CardMedia, CardContent, Stack, TextField, Autocomplete, CardActions, Badge} from '@mui/material';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import Nav from "../components/Nav";
import { Link } from 'react-router-dom';

const Favorite = () => {
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        const fetchAllBooks = async () => {
            const querySnapshot = await getDocs(collection(db, 'Books'));
            const bookData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAllBooks(bookData);
        };

        const fetchFavoriteBooks = async () => {
            const favoriteBooksData = await Promise.all(
              favorites.map(async (bookId) => {
                const bookDoc = await getDoc(doc(db, 'Books', bookId));
                return { id: bookDoc.id, ...bookDoc.data() };
              })
            );
            setFavoriteBooks(favoriteBooksData);
        };
        
        fetchAllBooks();
        fetchFavoriteBooks();
      }, []);

    return (
        <>
        <Nav />
        <Typography variant="h1" sx={{ textAlign:'center', pt:3, pb:3 }}>Избранное</Typography>
            <Container maxWidth="xl" sx={{ display:'flex', justifyContent: 'center', height: '100vh', width: '100%', ml:8 }}>
            <Grid container spacing={3} >
                {favoriteBooks.map((book) => (
                    <Grid item xs={4} key={book.id}>
                      <Paper sx={{ borderRadius: 3, maxWidth: 350}}>
                        <Card sx={{ maxWidth: 350, height: 550, borderRadius: 3,
                        p: 2.5 }}>
                          <Link style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} to={`/book/${book.id}`}>
                            {/* <Badge 
                              badgeContent="3"
                              color="primary"
                              anchorOrigin={{
                                vertical: 'top',
                                horisontal: 'left'
                              }}> */}
                              <CardMedia
                                component="img"
                                image={book.imageURL}
                                sx={{
                                  mr: 35,
                                  backgroundSize: 'cover',
                                  boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px 0px, rgba(0, 0, 0, 0.23) 0px 6px 6px 0px',
                                  maxHeight: 400
                                }}
                              />
                            {/* </Badge> */}
                            <CardContent sx={{ p: 0, pt: 2, pr: 10 }}>
                              <Typography gutterBottom variant='h6'>{book.author}</Typography>
                              <Typography variant='p' noWrap>{book.title}</Typography>
                            
                            </CardContent>
                          </Link>
                          <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{book.Reading === true ? 'Читают' : ''}</Typography>
                            {/* <IconButton onClick={() => addToFavorites(book.id)} color="secondary">
                              <FavoriteBorder />
                            </IconButton> */}
                          </CardActions>
                        </Card>
                      </Paper>
                    </Grid>
                ))}
            </Grid>
            </Container>
        </>
    );
}

export default Favorite;