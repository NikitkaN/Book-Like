import * as React from 'react';
import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { Typography, Container, Box, Grid, Paper, Card, CardMedia, CardContent, Stack, TextField, Autocomplete, CardActions, Badge} from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../firebase.js'
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Books"));
      const bookData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(bookData);
    };

    fetchData();    
  }, []);

  const filterBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <Nav />
    <Container 
      maxWidth="xl" 
      sx={{ 
        display: 'flex',
        height: '100%',
        mt: 4

        }}>
      <Box sx={{ width: '40%', mr: 20 }}>
        <Typography variant='h1' sx={{ mt: 5 }}>
          Рады видеть тебя в нашей библиотеке
        </Typography>
        <Typography sx={{ mt: 5 }}>
          Найди интересную тебе книгу, если она сейчас свободна - выбери ее в списке и укажи свой ник<br/>
          <br/>
          - Брать книгу на одну неделю, не больше<br/>
          - Книги просим возвращать в свою ячейку согласно её номеру
        </Typography>

        <Stack sx={{ width: 300, mt: 6 }}>
        <Autocomplete
          id="Search"
          freeSolo
          disableClearable
          options={books.map((option) => option.title)}
          value={searchQuery}
          onInputChange={(event, newValue) => setSearchQuery(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        />
        </Stack>

      </Box>
      <Grid container spacing={4}>
        {filterBooks.map((book) => (
        <Grid item xs={4} key={book.id}>
          <Paper sx={{ borderRadius: 3}}>
            <Card sx={{ maxWidth: 350, height: 500, borderRadius: 3,
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
                      maxHeight: 350
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

export default Home;