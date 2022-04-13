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
          <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          // onClick={}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Wahyu Berlianto" />
        </ListItemButton>
        <ListItemButton
          // onClick={}
        >
          <ListItemIcon>
            <MailsIcon />
          </ListItemIcon>
          <ListItemText primary="wahyubrlianto@gmail.com" />
        </ListItemButton>
        <ListItemButton
          // onClick={routeGithub}
        >
          <ListItemIcon>
            <GithubIcon />
          </ListItemIcon>
          <ListItemText primary="wahyubrr" />
        </ListItemButton>
        <ListItemButton
          // onClick={}
        >
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText primary="0813-2944-3896" />
        </ListItemButton>
      </List>
          </Demo>
        </Grid>
      </Grid>
    </Box>
    // <Box sx={{ marginTop: 1, width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    //   <List component="nav" aria-label="main mailbox folders">
    //     <ListItemButton
    //       // onClick={}
    //     >
    //       <ListItemIcon>
    //         <PersonIcon />
    //       </ListItemIcon>
    //       <ListItemText primary="Wahyu Berlianto" />
    //     </ListItemButton>
    //     <ListItemButton
    //       // onClick={}
    //     >
    //       <ListItemIcon>
    //         <MailsIcon />
    //       </ListItemIcon>
    //       <ListItemText primary="wahyubrlianto@gmail.com" />
    //     </ListItemButton>
    //     <ListItemButton
    //       // onClick={routeGithub}
    //     >
    //       <ListItemIcon>
    //         <GithubIcon />
    //       </ListItemIcon>
    //       <ListItemText primary="wahyubrr" />
    //     </ListItemButton>
    //     <ListItemButton
    //       // onClick={}
    //     >
    //       <ListItemIcon>
    //         <PhoneIcon />
    //       </ListItemIcon>
    //       <ListItemText primary="0813-2944-3896" />
    //     </ListItemButton>
    //   </List>
    // </Box>
  );
}
