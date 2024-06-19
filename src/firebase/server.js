const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { admin, db } = require('./firebaseConfig');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const secretKey = 'SAMURAI'; // secret key

const createToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
};

// Middleware для аутентификации
const authenticateJWT = expressJwt({
  secret: secretKey,
  algorithms: ['HS256'],
});

// Проверка ролей
const checkRole = (role) => (req, res, next) => {
  if (req.auth.role === role) {
    next();
  } else {
    res.status(403).send('Forbidden: Insufficient role');
  }
};

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log('User Record:', userRecord);
    if (userRecord) {
      const userDoc = await db.collection('Users').doc(userRecord.uid).get();
      if (userDoc.exists) {
        const user = {
          id: userRecord.uid,
          role: userDoc.data().role || 'user'
        };
        const token = createToken(user);
        res.send({ token });
      } else {
        console.log('User not found in Firestore:', userRecord.uid);
        res.status(401).send('Unauthorized: User not found');
      }
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(error.message);
  }
});

// CRUD для пользователей
app.post('/users', async (req, res) => {
  const { /*name, e*/mail, password, role } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ mail, password });
    await db.collection('Users').doc(userRecord.uid).set({
      name,
      email,
      role
    });
    res.status(201).send(userRecord);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/users/:id', /*authenticate, checkRole('admin'),*/ async (req, res) => {
  try {
    const userSnapshot = await db.collection('users').doc(req.params.id).get();
    if (userSnapshot.exists) {
      res.send(userSnapshot.data());
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/users/:id', /*authenticate, checkRole('admin'),*/ async (req, res) => {
  const { /*name, e*/mail, role } = req.body;
  try {
    await db.collection('Users').doc(req.params.id).update({ /*name, email,*/ mail, role });
    res.send('User updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/users/:id', /*authenticate, checkRole('admin'),*/ async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.id);
    await db.collection('Users').doc(req.params.id).delete();
    res.send('User deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// CRUD для книг
app.post('/books', authenticateJWT, checkRole('admin'), async (req, res) => {
  const { title, author, description, imageURL, rating, shelfNumber } = req.body;
  try {
    console.log('Adding book:', req.body); // Логируем данные книги
    const bookRef = await db.collection('Books').add({
      title,
      author,
      description,
      imageURL,
      rating,
      shelfNumber
    });
    console.log('Book added with ID:', bookRef.id); // Логируем ID новой книги
    res.status(201).send({ id: bookRef.id });
  } catch (error) {
    console.error('Error adding book:', error.message); // Логируем ошибку
    res.status(400).send(error.message);
  }
});

app.get('/Books/:id', async (req, res) => {
  try {
    const bookSnapshot = await db.collection('Books').doc(req.params.id).get();
    if (bookSnapshot.exists) {
      res.send(bookSnapshot.data());
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/Books/:id', /*authenticate, checkRole('admin'),*/ async (req, res) => {
  const { title, author, description, imageURL, rating, shelfNumber } = req.body;
  try {
    await db.collection('Books').doc(req.params.id).update({
      title,
      author,
      description,
      imageURL,
      rating,
      shelfNumber
    });
    res.send('Book updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/Books/:id', /*authenticate, checkRole('admin'),*/ async (req, res) => {
  try {
    await db.collection('Books').doc(req.params.id).delete();
    res.send('Book deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// CRUD для бронирований
app.post('/reservations', /*authenticate,*/ async (req, res) => {
  const { bookID, reservationDate, status, returnDate } = req.body;
  try {
    const reservationRef = await db.collection('Reservations').add({
      userID: req.user.uid,
      bookID,
      reservationDate,
      status,
      returnDate
    });
    res.status(201).send({ id: reservationRef.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/reservations/:id', /*authenticate,*/ async (req, res) => {
  try {
    const reservationSnapshot = await db.collection('Reservations').doc(req.params.id).get();
    if (reservationSnapshot.exists) {
      res.send(reservationSnapshot.data());
    } else {
      res.status(404).send('Reservation not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/reservations/:id', /*authenticate,*/ async (req, res) => {
  const { bookID, reservationDate, status, returnDate } = req.body;
  try {
    await db.collection('Reservations').doc(req.params.id).update({
      bookID,
      reservationDate,
      status,
      returnDate
    });
    res.send('Reservation updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/reservations/:id', /*authenticate,*/ async (req, res) => {
  try {
    await db.collection('Reservations').doc(req.params.id).delete();
    res.send('Reservation deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
