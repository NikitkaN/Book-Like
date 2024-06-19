import React, { useEffect, useState } from "react";
import { Typography, TextField, Container, Box, AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Tooltip, Avatar} from '@mui/material';
import Nav from "../components/Nav";
import { db } from '../firebase.js';
import { doc, getDoc, collection, query, where, orderBy, getDocs, setDoc, addDoc, updateDoc } from "firebase/firestore";

const AddBook = () => {
    const [bookNumber, setBookNumber] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookImageURL, setBookImageURL] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [bookRating, setBookRating] = useState('');

    const handleAddBook = async () => {
        try {
            const newBookRef = await addDoc(collection(db, "Books"), {
              shelfNumber: bookNumber,
              title: bookTitle,
              author: bookAuthor,
              imageURL: bookImageURL,
              description: bookDescription,
              rating: bookRating,
            });
        
            console.log('Добавлена новая книга:', {
              id: newBookRef.id,
              shelfNumber: bookNumber,
              title: bookTitle,
              author: bookAuthor,
              imageURL: bookImageURL,
              description: bookDescription,
              rating: bookRating,
            });
        
            setBookNumber('');
            setBookTitle('');
            setBookAuthor('');
            setBookImageURL('');
            setBookDescription('');
            setBookRating('');
        
        } catch (error) {
          console.error('Ошибка при добавлении книги:', error);
        }
      };
    return (
        <>
        <Nav />
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
            <form>
                <TextField
                  aria-label="Номер"
                  name="shelfNumber"
                  id="shelfNumber"
                  variant="outlined"
                  value={bookNumber}
                  onChange={(e) => setBookNumber(e.target.value)}
                  fullWidth
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  aria-label="Название книги"
                  name="title"
                  id="title"
                  variant="outlined"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  fullWidth
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  aria-label="Автор"
                  name="author"
                  id="author"
                  variant="outlined"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  fullWidth
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  aria-label="Ссылка на фото"
                  name="imageURL"
                  id="imageURL"
                  variant="outlined"
                  value={bookImageURL}
                  onChange={(e) => setBookImageURL(e.target.value)}
                  fullWidth
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  aria-label="Описание книги"
                  name="description"
                  id="description"
                  variant="outlined"
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  aria-label="Рейтинг"
                  name="rating"
                  id="rating"
                  variant="outlined"
                  value={bookRating}
                  onChange={(e) => setBookRating(e.target.value)}
                  fullWidth
                  style={{ marginBottom: '20px' }}
                />
                <Button variant="contained" color="primary" onClick={handleAddBook}>
                  Добавить книгу
                </Button>
            </form>
        </Container>
        </>
    );
}

export default AddBook;