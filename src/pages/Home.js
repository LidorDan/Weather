import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Location from "../components/Location";
import Weather from "../components/Weather";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="">
      <Header />
      <h1>Welcome to the Weather App</h1>
      <Location />
    </div>
  );
}

export default Home;
