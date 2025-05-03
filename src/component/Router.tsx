import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../pages/home/index.tsx";
import PostDetailPage from "../pages/post/PostDetailPage.tsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/post/:id" element={<PostDetailPage />} />
    </Routes>
  );
}

export default Router;
