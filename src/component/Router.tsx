import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../pages/home/index.tsx";
import PostDetail from "../pages/post/detail.tsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  );
}

export default Router;
