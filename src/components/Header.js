import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Grid, Button } from "@mui/material";
// import { ThemeContext } from "../Theme";

const Header = () => {
  // const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="start">
          <Typography variant="h6" component="div">
            Herolo Weather Task
          </Typography>
          {/* <button onClick={() => toggleTheme()}>{theme}</button> */}
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
