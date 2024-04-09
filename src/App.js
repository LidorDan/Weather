import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/favorite" element={<Favorite />} />
      <Route path="/:locationKey" element={<Home />} />
    </Routes>
  );
};

export default App;
