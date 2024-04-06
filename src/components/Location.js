import React, { useEffect, useState } from "react";
import Weather from "./Weather";
const Location = () => {
  const defaultLat = 32.0853; // Default latitude of Tel Aviv
  const defaultLng = 34.7818; // Default longitude of Tel Aviv
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;
  const [locationKey, setLocationKey] = useState(null);

  const getLocation = async () => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`
      );
      const result = await response.json();
      setLocationKey(result.Key);
      setData(result);
      console.log(result);
      console.log("key:", result.Key);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (lat !== null && long !== null) {
        getLocation();
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

  return (

  <div className="App">
    {typeof data.main != "undefined" && data.main != null ? (
      <Weather weatherData={data} />
    ) : (
      <div>
        <h3>{data.Key}</h3>
        {<Weather locationKey={locationKey} />}
      </div>
    )}
  </div>
  );
};
export default Location;
