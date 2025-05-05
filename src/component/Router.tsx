import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../pages/home/index.tsx";
import PostDetail from "../pages/post/detail.tsx";
import HubPage from "../pages/hub/index.tsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/hub" element={<HubPage />} />
    </Routes>
  );
}

export default Router;
