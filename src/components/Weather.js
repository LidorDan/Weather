import React, { useEffect, useState } from "react";

const Weather = ({ locationKey }) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [currentWeather, setCurrentWeather] = useState([]);
  const [nextDays, setNextDays] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("TEL AVIV");

  const weatherData = (locationKey) => {
    console.log("location key here:", locationKey);
    fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrentWeather(data);
        console.log("current data is:", currentWeather);
      })
      .catch((error) => {
        // setError("Error fetching current data");
        // setLoading(false);
      });
  };
  const getNextDays = (locationKey) => {
    fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNextDays(data);
        console.log("next days data is:", nextDays);
      })
      .catch((error) => {
        // setError("Error fetching current data");
        // setLoading(false);
      });
  };

  useEffect(() => {
    if (locationKey) {
      weatherData(locationKey);
      getNextDays(locationKey);
    } else {
      console.log("location keydkkd", locationKey);
    }
  }, [locationKey]); // Fetch weather data whenever locationKey changes

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
    setCityName(city.LocalizedName);
    // console.log("city.key current :", currentWeather(city.Key));
    // console.log("city.key next daye :", nextDays(city.Key));
  };

  return (
    <div className="App">
      <div>
        {nextDays.Headline && (
          <h2>
            {nextDays.Headline.MobileLink}
            <br />
            {cityName}
          </h2>
        )}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter city name"
      />
      <ul>
        {cities.map((city) => (
          <li key={city.Key}>
            <button onClick={() => handleCityClick(city)}>
              {city.LocalizedName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Weather;

//   // const locationKey = props.locationKey;

// const weatherData = (locationKey) => {
//   console.log("location key here:", locationKey);
//   fetch(
//     `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       setCurrentWeather(data);
//       console.log("current data is:", currentWeather);
//     })
//     .catch((error) => {
//       // setError("Error fetching current data");
//       // setLoading(false);
//     });
// };

// useEffect(() => {
//   if (locationKey) {
//     weatherData(locationKey);
//   }
// }, [locationKey]); // Fetch weather data whenever locationKey changes

//   return (
//     <div>
//       <h4>the current weather : {currentWeather}</h4>
//     </div>
//   );

/*----------------------------------------------------------------*/
// // const weatherData = (locationKey) => {
// //   console.log("location key here:", locationKey);
// //   fetch(
// //     `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
// //   )
// //     .then((response) => response.json())
// //     .then((data) => {
// //       // setCurrentWeather(data);
// //       console.log("current data is:", currentWeather);
// //     })
// //     .catch((error) => {
// //       // setError("Error fetching current data");
// //       // setLoading(false);
// //     });

// //   fetch(
// // `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`
// //   )
// //     .then((response) => response.json())
// //     .then((data) => {
// //       // setForecast(data);
// //       console.log("5 days is:", forecast);
// //     })
// //     .catch((error) => {
// //       // setError("Error fetching 5 days data");
// //       // setLoading(false);
// //     });
// // };
// // useEffect(() => {
// //   weatherData(locationKey);
// // }, []);
