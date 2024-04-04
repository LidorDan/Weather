import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Grid,
  Button,
} from "@mui/material";

const Header = () => {
  return (
    // <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="start">
          <Typography variant="h6" component="div">
            Herolo Weather Task
          </Typography>
        </Grid>
        <Grid container justifyContent="end">
          <Button color="inherit" href="/">
            Home Page
          </Button>
          <Button color="inherit" href="favorite">
            fav page
          </Button>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
