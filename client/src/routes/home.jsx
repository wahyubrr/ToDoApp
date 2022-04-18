import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block'

import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'
// import { useDispatch } from 'react-redux'

function generate(element) { //delete
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function Home() {
  const [todo, setTodo] = useState([""])
  const [description, setDescription] = useState("")
  const [placeholder, setPlaceholder] = useState("Add todo here")
  const [updateState, setUpdate] = useState(false)
  const [editingTodo, setEditingTodo] = useState(false)
  const [todoId, setTodoId] = useState(0)
  
  const token = useSelector(state => state.auth.token)
  // const dispatch = useDispatch()

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/todo", {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    .then(res => {
      const todo = res.data
      setTodo(todo)
    })
    .catch(err => {
      console.log(err)
    })
  }, [updateState])

  const handleTodoChange = (e) => {
    setDescription(e.target.value)
  }

  const updateUi = () => {
    if (updateState === true) {
      setUpdate(false)
    } else {
      setUpdate(true)
    }
  }

  const handleTodoPost = () => {
    const auth = {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
      }
    }
    if (editingTodo === false) { // POST to /todo/add
      const body = {
        "descriptions": description,
        "completed": "0"
      }
      if (description) {
        axios.post(process.env.REACT_APP_API_URL + "/todo/add", body, auth)
        .then(res => {
          console.log(res.data)
          setDescription("")
          updateUi()
        })
        .catch(err => {
          console.log(err)
        })
      }
      else {
        if (placeholder === "Add todos here") {
          setPlaceholder("Add todos first")
        } else {
          setPlaceholder("Add todos here")
        }
      }
    } else if (editingTodo === true) {  // POST to /todo/edit
      const body = {
        "descriptions": description,
        "todoid": todoId
      }
      if (description) {
        axios.post(process.env.REACT_APP_API_URL + "/todo/edit", body, auth)
        .then(res => {
          setDescription("")
          updateUi()
          handleCancel()
        })
        .catch(err => {
          console.log(err)
        })
      }
      else {
        if (placeholder === "Edit todos here") {
          setPlaceholder("Edit todos first")
        } else {
          setPlaceholder("Edit todos here")
        }
      }
    }
  }

  const handleUpdate = (todoid) => {
    const auth = {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
      }
    }
    const body = {
      "descriptions": description,
      "TodoId": todoid
    }
    if (todoid === todoId) {
      handleCancel()
    } else {
      setEditingTodo(true)
      setTodoId(todoid)
    }
    
    // if (description) {
    //   axios.post(process.env.REACT_APP_API_URL + "/todo/edit", body, auth)
    //   .then(res => {
    //     console.log(res.data)
    //     setDescription("")
    //     updateUi()
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
    // }
    // else {
    //   if (placeholder === "Add todo here") {
    //     setPlaceholder("Add todo first")
    //   } else {
    //     setPlaceholder("Add todo here")
    //   }
    // }
  }
  
  const handleEditIconChange = (todoid) => {
    if (todoid === todoId) {
      if (editingTodo === true) {
        return <BlockIcon/>
      } else {
        <EditIcon />
      }
    } else {
      return <EditIcon />
    }
  }

  const handleCancel = () => {
    setEditingTodo(false)
    setTodoId(0)
  }

  const displayCancelEditButton = () => {
    if (editingTodo === true) {
      return (<Button
        id="descriptions"
        value='add'
        variant="contained"
        color="error"
        onClick={handleCancel}
        style={{ marginTop: 11, marginLeft: 16 }}
      >
        Cancel
      </Button>)
    }
  }

  const handleDelete = (todoid) => {
    const request = {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
      },
      data: {
        "todoid": todoid
      }
    }
    axios.delete(process.env.REACT_APP_API_URL + "/todo/delete", request)
    .then(res => {
      console.log(res.data)
      updateUi()
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
            Home
          </Typography>
          <Demo>
            <List dense={false}>
              {todo.map(todo => {
                return (
                  <Paper elevation={1}>
                  <ListItem key={"todo-"+todo.TodoId}
                    style={{ marginBottom: 5 }}
                    secondaryAction={
                      <div>
                      <IconButton edge="end" aria-label="edit"
                        onClick={() => handleUpdate(todo.TodoId)}
                      >
                        {handleEditIconChange(todo.TodoId)}
                      </IconButton>
                      <IconButton edge="end" aria-label="delete"
                        onClick={() => handleDelete(todo.TodoId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      </div>
                    }
                  >
                    <ListItemText
                      primary={todo.Descriptions}
                    />
                  </ListItem>
                  </Paper>
                )
              })}
            </List>
            <RedditTextField
              label={editingTodo ? "Edit todos here" : "Add todos here"}
              id="descriptions"
              variant="filled"
              fullWidth
              value={description}
              placeholder={placeholder}
              style={{ marginTop: 11, marginLeft: 16, maxWidth: '85%' }}
              onChange={(e) => handleTodoChange(e)}
              onSubmit={handleTodoPost}
            />
            <Button
              id="descriptions"
              value='add'
              variant="contained"
              onClick={handleTodoPost}
              style={{ marginTop: 11, marginLeft: 16 }}
            >
              {editingTodo ? "Edit Todo" : "Add Todo"}
            </Button>
            {displayCancelEditButton()}
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;

const RedditTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));