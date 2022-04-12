import * as React from 'react';
import { useState } from 'react';
import { Navigate, resolvePath } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import { userSelector, useDispatch, useSelector } from 'react-redux'
import { signingIn, setToken, setRefreshToken } from '../features/auth/authSlice'
import { setUsername } from '../features/user/userSlice'

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

export default function SignIn() {
  const signed = useSelector(state => state.auth.signed)
  const dispatch = useDispatch()
  
  const [signinButton, setSigninButton] = useState("Sign In")
  const [error, setError] = useState("")
  
  const handleSubmit = (event) => {
    setSigninButton(<CircularProgress color="inherit" size="1.55rem"/>)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post('http://localhost:8081/login', {
      userid: data.get('username'),
      password: data.get('password')
    })
    .then(function (response) {
      dispatch(setToken(response.data.accessToken))
      dispatch(setRefreshToken(response.data.refreshToken))
    })
    .then((response) => {
      dispatch(setUsername(data.get('username')))
    })
    .then(() => {
      dispatch(signingIn())
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
        if (error.response.status < 500) {
          setError("Incorrect username or password")
        } else {
          setError("Server unreachable at the moment")
        }
      }
      setSigninButton("Sign In")
      console.log(error)
    })
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Typography component="p" variant="p" style={{fontSize:'1.05em', color: 'red', textAlign: 'center', paddingTop: '10px'}}>
              {error}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {signinButton}
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/registration" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      { signed && <Navigate replace to='/' /> }
    </ThemeProvider>
  );
}