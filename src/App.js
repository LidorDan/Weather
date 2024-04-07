import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite";
import Header from "./components/Header";

const App = () => {

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/favorite" element={<Favorite />} />
    </Routes>
  );
};

export default App;
