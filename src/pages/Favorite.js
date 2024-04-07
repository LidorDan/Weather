import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div>
      <Header />
      <h1>Favorites</h1>
      {favorites.map((fav) => (
        <div key={fav.id}>
          <Link to={`/`}>
            <span>{fav.cityName}</span>
          </Link>
          <span>{fav.temperature}</span>
        </div>
      ))}
    </div>
  );
};

export default Favorite;
