import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import Weather from "../components/Weather";

const Home = () => {
  const defaultLat = 32.0853; // Default latitude of Tel Aviv
  const defaultLng = 34.781769; // Default longitude of Tel Aviv
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const [locationKey, setLocationKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");
  const location = useLocation();

  const getLocation = async () => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`
      );
      const result = await response.json();
      setLocationKey(result.Key);
      setLoading(false);
      setCityName(result.LocalizedName);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        location.state?.locationKey == null ||
        location.state?.locationKey == undefined
      ) {
        if (lat !== null && long !== null) {
          getLocation();
        }
      }
    };
    fetchData();
  }, [lat, long, apiKey]);

  useEffect(() => {
    const askForLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      } catch (error) {
        console.error("Error getting geolocation:", error);
        setLat(defaultLat);
        setLong(defaultLng);
      }
    };
    askForLocation();
  });
  useEffect(() => {
    const fetchedLocationKey = location.state?.locationKey;
    if (fetchedLocationKey) {
      setLocationKey(fetchedLocationKey);
      setLoading(false)
      setCityName(location.state?.cityNameSearch)
    }
  }, [location.state]);

  return (
    <div className="App">
      <Header />
      {!loading && locationKey && (
        <Weather locationKey={locationKey} cityName={cityName} />
      )}
    </div>
  );
};

export default Home;
