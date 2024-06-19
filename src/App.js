import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Book from './pages/Book.jsx';
import Error from './pages/Error.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Favorite from './pages/Favorite.jsx';
import AddBook from './pages/AddBook.jsx';
import Panel from './pages/Panel.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/book/:id" element={<Book />}/>
        <Route path="/SignIn" element={<SignIn />}/>
        <Route path="/SignUp" element={<SignUp />}/>
        <Route path="/Favorite" element={<Favorite />}/>
        <Route path="/AddBook" element={<AddBook />}/>
        <Route path="/Panel" element={<Panel />}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
