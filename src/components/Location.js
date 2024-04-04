import React, { useEffect, useState } from "react";
import Weather from "./Weather";

const Location = () => {
  const DefaultLat = 32.0853; // default latitude of Tel Aviv
  const DefaultLng = 34.7818; // default longitude of Tel Aviv
  const [latitude, setLatitude] = useState(DefaultLat);
  const [longitude, setLongitude] = useState(DefaultLng);
  const [locationKey, setLocationKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const getLocation = () => {
      // Request to Geoposition Search API to get a location key
      fetch(
        `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${latitude},${longitude}`
      )
        .then((response) => response.json())
        .then((data) => {
          setLocationKey(data.Key);
          setLoading(false);
          console.log("location key is:", locationKey);
        })
        .catch((error) => {
          setError("Error fetching location data");
          setLoading(false);
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }

    // When lat&lon are initialized, call the getLocation function to get a location key
    if (latitude != null && longitude != null) {
      getLocation();
    }
  }, [latitude, longitude, locationKey]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Weather locationKey={locationKey} />
      )}
    </div>
  );
};
export default Location;
