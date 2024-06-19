import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import { Typography, Container, Box, IconButton, Button, Paper,
    Card, CardMedia, CardContent, TableContainer, Rating, CardActions, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { db } from '../firebase.js';
import { doc, getDoc, collection, query, where, orderBy, getDocs, setDoc, addDoc, updateDoc } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase.js";

let userName;

function Book() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [bookHistory, setBookHistory] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const [isBookReserved, setBookReserved] = useState(false);
    const [reservationId, setReservationId] = useState(null);
    const [authUser, setAuthUset] = useState(null);
    
    console.log(id);

    useEffect(() => {
        
      const fetchBook = async () => {
        try {
            const bookRef = doc(db, "Books", id);
            const docSnap = await getDoc(bookRef);

            if (docSnap.exists) {
                setBook({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
      };

      const fetchBookHistory = async () => {
        try {
          const q = query(collection(db, 'Reservation'), where('BookId', '==', id));
  
          const querySnapshot = await getDocs(q);
  
          const historyData = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log(data.ReturnData);
            return {
              name: data.Name,
              take: data.ReservationData.toDate().toLocaleString(),
              returned: data.ReturnData ? data.ReturnData.toDate().toLocaleString() : 'Не возвращена',
            };
          });
  
          setBookHistory(historyData);
        } catch (error) {
          console.error('Ошибка при получении данных из Firestore:', error);
        }
      };

      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setIsFavorite(favorites.includes(id));

      fetchBook();
      fetchBookHistory();
    }, [id]);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthUset(user);
            const userEmail = user.email;
            userName = userEmail.split('@')[0];
            console.log(userName);
          } else {
            setAuthUset(null);
          }
        });
      
        return () => {
          listen();
        };
      }, []);

    if (!book) {
        return <div>Loading...</div>;
    }

    const reserveBook = async () => {
        try {
          const date = Timestamp.fromMillis(new Date().getTime());
          const docRef = await addDoc(collection(db, "Reservation"), {
            BookId: id,
            Name: userName,
            ReservationData: date
          });

          setReservationId(docRef.id);
    
          setBookReserved(true);
        } catch (error) {
          console.error('Ошибка при бронировании книги:', error);
        }
      };
      
    const returnBook = async () => {
        try {
        const date = Timestamp.fromMillis(new Date().getTime());
        await updateDoc(doc(db, "Reservation", reservationId), {
            ReturnData: date
          });
    
          setBookReserved(false);
          setReservationId(null);
        } catch (error) {
          console.error('Ошибка при возврате книги:', error);
        }
    };
  
    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        if (isFavorite) {
          const updatedFavorites = favorites.filter((id) => id !== book.id);
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
          favorites.push(book.id);
          localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    
        setIsFavorite(!isFavorite);
    };
    
    return (
        <>
        <Nav />
        <Container maxWidth='false' sx={{ display:"flex", alignItems: 'center', justifyContent: 'center' }} >
            <Box sx={{ mr: 5 }}>
                <Typography variant='h1'>Ранее брали</Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
                    <Table sx={{ minWidth: 500 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nickname</TableCell>
                                <TableCell>Взял</TableCell>
                                <TableCell>Сдал</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookHistory.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.take}</TableCell>
                                    <TableCell>{row.returned}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Card sx={{mt: 5, mr:-5, borderRadius: 4}}>
                <CardContent sx={{ display: 'flex', p: 6 }}>
                    <CardMedia
                        component="img"
                        image={book.imageURL}
                        loading='lazy'
                        sx={{
                            width: 250,
                            boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px 0px, rgba(0, 0, 0, 0.23) 0px 6px 6px 0px',
                            mr: 5
                        }}
                    />
                    <Container>
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: '50%',
                                    color: 'white',
                                    backgroundColor: 'green',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px 0px, rgba(0, 0, 0, 0.23) 0px 6px 6px 0px',
                                    mt: 2
                                }}>
                                {book.shelfNumber}
                            </Typography>
                        <Typography variant="h5" component="div" sx={{ mt: 2, mb: 1}}>
                            {book.title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {book.author}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph sx={{mt: 5}}>
                            {book.description}
                        </Typography>
                    </Container>
                </CardContent>
                <CardActions>
                    <IconButton onClick={handleToggleFavorite} color="secondary">
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Rating value={book.rating}  readOnly />
                    <Button onClick={authUser ? (isBookReserved ? returnBook : reserveBook) : null} color="primary" variant="contained" disabled={!authUser}>
                        {isBookReserved ? 'Вернуть книгу' : 'Взять книгу'}
                    </Button>
                </CardActions>
            </Card>
        </Container>
        </>
    );
}

export default Book;