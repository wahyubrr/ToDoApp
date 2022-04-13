import * as React from 'react';
import { useState } from 'react';
import { Navigate } from "react-router-dom";
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress'
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState("")
  const [signupButton, setSignupButton] = useState("Sign Up")

  const redirectNow = () => {
    setRedirect(true)
  }

  const handleSubmit = (event) => {
    setSignupButton(<CircularProgress color="inherit" size="1.55rem"/>)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if ( data.get('firstName') === "" ) {
      setSignupButton("Sign Up")
      setError("First Name is empty.")
    } else if ( data.get('lastName') === "" ) {
      setSignupButton("Sign Up")
      setError("Last Name is empty.")
    } else if ( data.get('username') === "" ) {
      setSignupButton("Sign Up")
      setError("Username is empty.")
    } else if ( data.get('password') === "" ) {
      setSignupButton("Sign Up")
      setError("Password is empty.")
    } else {
      const query = {
        firstname: data.get('firstName'),
        lastname: data.get('lastName'),
        userid: data.get('username'),
        password: data.get('password')
      }
      axios.post(process.env.REACT_APP_AUTH_URL + "/registration", query)
      .then((response) => {
        setError(response.data)
        if (response.status === 201) {
          // this.setState({ redirect: true })
          setError("")
          redirectNow()
        }
      })
      .catch((error) => {
        setSignupButton("Sign Up")
        setError("Sorry, username is taken.")
      })
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography component="p" variant="p" style={{fontSize:'1.05em', color: 'red', textAlign: 'center'}}>
                  {error}
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {signupButton}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      { redirect && <Navigate replace to='/login' /> }
    </ThemeProvider>
  );
}