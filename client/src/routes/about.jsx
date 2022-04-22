import * as React from 'react';
// import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailsIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import GithubIcon from '@mui/icons-material/GitHub';
import PhoneIcon from '@mui/icons-material/Phone';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function SelectedListItem() {
  // let navigate = useNavigate()
  // const routeGithub = () => {
  //   const myGithub = 'http://github.com/wahyubrr'
  //   navigate(myGithub)
  // }
  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={11} md={7} >
          <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
            About
          </Typography>
          <Demo>
          <Typography sx={{ mt: 4, mb: 2, fontSize: '1.2em' }} variant="p" component="div">
            ToDo App is a web application to help you list all your important tasks in one single place. This application is made by <a href='https://github.com/wahyubrr' target='_blank'>wahyubrr</a> on GitHub.
          </Typography>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}
