import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
  FormControlLabel,
  Switch,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import "../styles/Favorite.css";

const Favorite = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleCityClick = (id) => {
    navigate("/", { favId: id });
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };
  return (
    <div>
      <Header />
      <div className="tempSwitch">
        <FormControlLabel
          control={
            <Switch
              checked={isCelsius}
              onChange={toggleTemperatureUnit}
              className="switch"
            />
          }
          label={
            <Typography variant="body1">{isCelsius ? "°C" : "°F"}</Typography>
          }
        />
      </div>
      <div className="cards-container">
        {favorites.map((fav) => (
          <Card
            key={fav.id}
            onClick={() => handleCityClick(fav.id)}
            className="card"
          >
            <CardContent>
              <Typography>{fav.cityNameSearch}</Typography>
              <Typography>
                {isCelsius ? `${fav.temperatureC}°C` : `${fav.temperatureF}°F`}
              </Typography>
              <Typography marginTop={10}>{fav.WeatherText}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
