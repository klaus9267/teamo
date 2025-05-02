import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../pages/home/index.tsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
    </Routes>
  );
}

export default Router;
