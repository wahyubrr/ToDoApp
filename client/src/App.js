import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Link, Outlet, Navigate } from "react-router-dom";
import AppBar from "./AppBar.jsx"
import { useSelector, useDispatch } from 'react-redux'
import { signingIn, signingOut, setToken, setRefreshToken } from './features/auth/authSlice'
// import "./Home.css";

export default function Home() {
  // const [loggedIn, setLoggedIn] = useState(true)
  const signed = useSelector(state => state.auth.signed)
  // const dispatch = useDispatch()

  return (
    <div>
      <AppBar/>
      {/* <Link to="/" className="nav-button"><h1>To Do App!</h1><Link>
      <nav className="navbar">
        <Link to="/users" className="nav-button">Users</Link> | {""}
        <Link to ="/about" className="nav-button">About</Link>
      </nav> */}
      <Outlet />
      {signed ? <p/> : <Navigate replace to='/login'/>}
    </div>
  );
}
