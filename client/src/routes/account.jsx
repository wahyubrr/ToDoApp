import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { signingOut, setToken } from '../features/auth/authSlice'
import { setUsername } from '../features/user/userSlice'

function Account() {
  const [users, setUsers] = useState([{
    "UserId": "",
    "FirstName": "",
    "LastName": ""
  }])
  const token = useSelector(state => state.auth.token)
  const userState = useSelector(state => state.user.username)
  const dispatch = useDispatch()

  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/user/" + userState)
      .then(res => {
        // console.log(users) // DEBUGGING
        setUsers(res.data)
      })
  }, [])

  const deleteAccount = () => {
    alert("Account deleted")
    axios.delete(process.env.REACT_APP_API_URL + "/user/delete", {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token,
      }
    })
    .then(res => {
      dispatch(setToken(""))
      dispatch(setUsername(""))
      dispatch(signingOut())
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={11} md={5} >
          <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
            Account
          </Typography>
          <Demo>
            <List dense={false}>
              <Paper elevation={1}>
                <ListItem key={"todo-"+users[0].UserId}
                  style={{ marginBottom: 5 }}
                  secondaryAction={
                    <div>
                    <IconButton edge="end" aria-label="edit"
                        // onClick={() => handleDelete(todo.TodoId)}
                    >
                      <EditIcon />
                    </IconButton>
                    </div>
                  }
                >
                <ListItemText
                  primary={"Username: "+users[0].UserId}
                />
                </ListItem>
              </Paper>
              <Paper elevation={1}>
                <ListItem key={"todo-"+users[0].UserId}
                  style={{ marginBottom: 5 }}
                  secondaryAction={
                    <div>
                    <IconButton edge="end" aria-label="edit"
                        // onClick={() => handleDelete(todo.TodoId)}
                    >
                      <EditIcon />
                    </IconButton>
                    </div>
                  }
                >
                <ListItemText
                  primary={"First Name: "+users[0].FirstName}
                />
                </ListItem>
              </Paper>
              <Paper elevation={1}>
                <ListItem key={"todo-"+users[0].UserId}
                  style={{ marginBottom: 5 }}
                  secondaryAction={
                    <div>
                    <IconButton edge="end" aria-label="edit"
                        // onClick={() => handleDelete(todo.TodoId)}
                    >
                      <EditIcon />
                    </IconButton>
                    </div>
                  }
                >
                <ListItemText
                  primary={"Last Name: "+users[0].LastName}
                />
                </ListItem>
              </Paper>
            </List>
            <Button variant="contained" color="error" onClick={deleteAccount}
            >
              Delete Account
           </Button>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Account;