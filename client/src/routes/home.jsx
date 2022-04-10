import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSelector, useDispatch, useSelector } from 'react-redux'
import { signingIn, signingOut, setToken } from '../features/auth/authSlice'

function Users() {
  const [todo, setTodo] = useState([""])
  
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const handlingAdd = (data) => {
    console.log(data)
  }

  useEffect(() => {
    axios.get("http://localhost:8080/todo", {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token,
      }
    })
    .then(res => {
      const todo = res.data
      setTodo(todo)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div style={{ padding: "1rem 40px" }}>
      <h2>Home</h2>
      <ul>
        {todo.map(todo => {
          return (
            <li key={todo.TodoId}>
              {todo.Descriptions}
              <button>Delete</button>
            </li>
          )
        })}
      </ul>
      <div>
        <input required type="text" id="descriptions" label='descriptions' name='descriptions'/>
        <button id="descriptions" value='add' onClick={handlingAdd}>Add Todo</button>
      </div>
    </div>
  );
}

export default Users;