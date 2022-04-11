import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button'
import { userSelector, useDispatch, useSelector } from 'react-redux'
import { signingIn, signingOut, setToken } from '../features/auth/authSlice'
import { setUsername, setFirstName } from '../features/user/userSlice'

function Users() {
  const [users, setUsers] = useState([])
  const token = useSelector(state => state.auth.token)
  const userState = useSelector(state => state.user.username)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get("http://localhost:8080/user/" + userState)
      .then(res => {
        setUsers(res.data)
      })
  }, [])

  const deleteAccount = () => {
    alert("Account deleted")
    axios.delete("http://localhost:8080/user/delete", {
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
    <div style={{ padding: "1rem 40px" }}>
      <h2>Account</h2>
      <ul>
        {users.map(user => {
          return (
            <div>
              <p key={"Users"+user.UserId}>
                Username: {user.UserId}
              </p>
              <p key={user.FirstName}>
                First Name: {user.FirstName}
              </p>
              <p key={user.LirstName}>
                Last Name: {user.LastName}
              </p>
            </div>
          )
        })}
      </ul>
      <Button variant="contained" color="error" onClick={deleteAccount}>
        Delete Account
      </Button>
    </div>
  );
}

export default Users;