import React, { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, Button, TableRow, TableCell, TableBody, Typography, Container, Box, Grid, Paper, Card, CardMedia, CardContent, Stack, TextField, Autocomplete, CardActions, Badge} from '@mui/material';
import { getDocs, collection, doc, getDoc, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js'; 
import Nav from "../components/Nav.jsx";

const Panel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'Users'));
            const usersData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(usersData);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        fetchUsers();
      }, []);
    
      const handleRoleChange = async (userId, currentRole) => {
        try {
            // currentRole = users.role;
          // Определяем новую роль на основе текущей роли
          const newRole = currentRole === 'user' ? 'admin' : 'user';
    
          // Обновляем документ пользователя с новой ролью
          const userDocRef = doc(db, 'Users', userId);
          await updateDoc(userDocRef, { role: newRole });
    
          // Обновляем состояние для перерендеринга
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, role: newRole } : user
            )
          );
        } catch (error) {
          console.error('Error updating role:', error);
        }
      };

    return (
        <>
            <Nav/>
            <TableContainer component={Paper} sx={{width: 1000, display: 'flex', ml: 35, mt: 5}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Почта</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell>Изменить роль</TableCell>
                    <TableCell>Удалить пользователя</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.mail}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleRoleChange(user.id)}>
                          Изменить роль
                        </Button>
                      </TableCell>
                      <TableCell>
                          <Button /*onClick={() => handleDeleteUser(user.id)}*/ color="error">
                              Удалить
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </>
  );
};

export default Panel;