import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  Switch,
} from "@mui/material";
import { RiHeart3Fill } from "react-icons/ri";
import "../styles/Weather.css";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import FormControlLabel from "@mui/material/FormControlLabel";

const Weather = ({ locationKey, cityName }) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [currentWeather, setCurrentWeather] = useState([]);
  const [nextDays, setNextDays] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [cities, setCities] = useState([]);
  const [cityNameSearch, setCityNameSearch] = useState(cityName);
  const filteredCities = cities.filter(
    (city, index) =>
      cities.findIndex((c) => c.LocalizedName === city.LocalizedName) === index
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [newKeySearch, setNewKeySearch] = useState(locationKey);
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === newKeySearch));
  }, [favorites, newKeySearch]);

  const weatherData = async (locationKey) => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
      );
      const result = await response.json();
      setCurrentWeather(result);
      console.log(result);
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
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    weatherData(newKeySearch);
    getNextDays(newKeySearch);
  }, [newKeySearch]);

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
    setInputValue("");
    setCityNameSearch(city.LocalizedName);
    weatherData(city.Key);
    getNextDays(city.Key);
    setNewKeySearch(city.Key);
    setIsFavorite(favorites.some((fav) => fav.id === city.Key));
  };

  const addToFavorites = () => {
    const newFavorite = {
      id: newKeySearch,
      cityNameSearch,
      temperatureC: parseInt(currentWeather[0]?.Temperature?.Metric?.Value),
      temperatureF: parseInt(currentWeather[0]?.Temperature?.Imperial?.Value),
      WeatherText: currentWeather[0]?.WeatherText,
    };
    if (!isFavorite) {
      setFavorites([...favorites, newFavorite]);
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, newFavorite])
      );
    } else {
      const updatedFavorites = favorites.filter(
        (fav) => fav.id !== newKeySearch
      );
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
    setIsFavorite(!isFavorite);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <div className="container">
      <div className="search-container">
        <div className="search">
          <input
            type="search"
            placeholder="Enter city name"
            value={inputValue}
            onChange={handleChange}
            className="search-input"
          />
        </div>
        {inputValue && (
          <div className="autocomplete-list-container">
            <List className="citySearchList">
              {filteredCities.map((city) => (
                <ListItem key={city.Key}>
                  <ListItemButton onClick={() => handleCityClick(city)}>
                    <Typography>{city.LocalizedName}</Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        )}
        <div className="tempSwitch">
          <FormControlLabel
            control={
              <Switch
                checked={isCelsius}
                onChange={toggleTemperatureUnit}
                className="switch"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#0F2255",
                  },
                }}
              />
            }
            label={
              <Typography variant="body1">{isCelsius ? "°C" : "°F"}</Typography>
            }
          />
        </div>
      </div>

      <div className="weather-container">
        <Grid container flexDirection="row" justifyContent="space-between">
          <Grid justifyContent="start" flexDirection="column">
            <Typography variant="h6">{cityNameSearch}</Typography>
            <Typography variant="body1">
              {isCelsius
                ? `${parseInt(currentWeather[0]?.Temperature?.Metric?.Value)}°C`
                : `${parseInt(
                    currentWeather[0]?.Temperature?.Imperial?.Value
                  )}°F`}
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              onClick={addToFavorites}
              sx={{
                backgroundColor: "#0F2255",
                color: "white",
                "&:active": {
                  backgroundColor: "#0F2255",
                },
              }}
            >
              <RiHeart3Fill
                color={isFavorite ? "red" : "inherit"}
                style={{ fontSize: "21px", marginRight: "8px" }}
              />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </Grid>
        </Grid>
        <Grid className="weather-details">
          <Typography variant="body10" className="weatherText">
            {currentWeather[0]?.WeatherText}
          </Typography>
        </Grid>
        <div className="nextDays">
          <div className="nextDays-cards">
            {Array.isArray(nextDays.DailyForecasts) &&
              nextDays.DailyForecasts.map((day, index) => (
                <Card key={index} className="card">
                  <CardContent>
                    <Typography variant="body1">
                      {new Date(day.Date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </Typography>
                    <Typography variant="body1" className="temperature">
                      {isCelsius
                        ? `${Math.round(
                            ((day.Temperature.Minimum.Value - 32) * 5) / 9
                          )}°C - ${Math.round(
                            ((day.Temperature.Maximum.Value - 32) * 5) / 9
                          )}°C`
                        : `${parseInt(
                            day.Temperature.Minimum.Value
                          )}°F - ${parseInt(day.Temperature.Maximum.Value)}°F`}
                    </Typography>
                    <div className="icon-container sunny">
                      <WbSunnyIcon className="icon" />
                      <Typography variant="body1">
                        {day.Day.IconPhrase}
                      </Typography>
                    </div>
                    <div className="icon-container moon">
                      <NightsStayIcon className="icon" />
                      <Typography variant="body1">
                        {day.Night.IconPhrase}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Weather;
