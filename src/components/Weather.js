import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { RiHeart3Fill } from "react-icons/ri";

const Weather = ({ locationKey, cityName }) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [currentWeather, setCurrentWeather] = useState([]);
  const [nextDays, setNextDays] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [cities, setCities] = useState([]);
  const filteredCities = cities.filter(
    (city, index) =>
      cities.findIndex((c) => c.LocalizedName === city.LocalizedName) === index
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === locationKey));
  }, [favorites, locationKey]);

  const weatherData = async (locationKey) => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
      );
      const result = await response.json();
      setCurrentWeather(result);
      console.log("current data is:", result);
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = storedFavorites.map((fav) => {
        if (fav.id === locationKey) {
          return {
            ...fav,
            temperatureC: result[0]?.Temperature?.Metric?.Value,
            temperatureF: result[0]?.Temperature?.Imperial?.Value,
          };
        }
        return fav;
      });
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getNextDays = (locationKey) => {
    fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`
    )
      .then((Response) => Response.json())
      .then((data) => {
        setNextDays(data);
        console.log("next data :", data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    weatherData(locationKey);
    getNextDays(locationKey);
  }, [locationKey]);

  useEffect(() => {
    const fetchCities = async () => {
      if (inputValue.trim() !== "") {
        try {
          const response = await fetch(
            `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${inputValue}`
          );
          if (response.ok) {
            const data = await response.json();
            setCities(data);
          } else {
            console.error("Failed to fetch cities");
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [inputValue]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleCityClick = (city) => {
    weatherData(city.Key);
    getNextDays(city.Key);
  };

  const addToFavorites = () => {
    const newFavorite = {
      id: locationKey,
      cityName,
      temperatureC: currentWeather[0]?.Temperature?.Metric?.Value,
      temperatureF: currentWeather[0]?.Temperature?.Imperial?.Value,
    };
    if (!isFavorite) {
      setFavorites([...favorites, newFavorite]);
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, newFavorite])
      );
    } else {
      const updatedFavorites = favorites.filter(
        (fav) => fav.id !== locationKey
      );
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Grid>
      <Grid>
        <Grid>
          <TextField
            fullWidth
            value={inputValue}
            onChange={handleChange}
            label="Enter city name"
            variant="outlined"
            margin="normal"
            placeholder="Enter city name"
          />
          <List>
            {filteredCities.map((city) => (
              <ListItemButton
                key={city.Key}
                onClick={() => handleCityClick(city)}
              >
                <ListItemText primary={city.LocalizedName} />
              </ListItemButton>
            ))}
          </List>
        </Grid>
        <Card>
          <CardContent>
            <Typography variant="h6">city name:{cityName}</Typography>
            <Typography variant="h6">Current Weather</Typography>
            <Typography variant="body1">
              Temperature: {currentWeather?.Temperature?.Metric?.Value}°C
            </Typography>
            <Typography variant="body1">
              Weather Condition: {currentWeather?.WeatherText}
            </Typography>
            <Button
              onClick={addToFavorites}
              startIcon={
                <RiHeart3Fill color={isFavorite ? "red" : "inherit"} />
              }
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Next 5 Days Weather</Typography>
        {Array.isArray(nextDays) &&
          nextDays.map((day, index) => (
            <Card key={index}>
              <CardContent>
                <Typography variant="body1">{day.Date}</Typography>
                <Typography variant="body1">
                  Temperature: {day[0].Temperature.Minimum.Value}°C -{" "}
                  {day[0].Temperature.Maximum.Value}°C
                </Typography>
                <Typography variant="body1">
                  Day: {day.Day.IconPhrase}
                </Typography>
                <Typography variant="body1">
                  Night: {day.Night.IconPhrase}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Grid>
    </Grid>
  );
};
export default Weather;
