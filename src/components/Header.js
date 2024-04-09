import React from "react";
import { AppBar, Toolbar, Typography, Grid, Button } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0F2255" }}>
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
            favorite page
          </Button>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
