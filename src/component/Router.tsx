import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../pages/home/index.tsx";
import PostDetail from "../pages/post/detail.tsx";
import PostCreate from "../pages/post/create.tsx";
import HubPage from "../pages/hub/index.tsx";
import ProfilePage from "../pages/profile/index.tsx";
import ResumeForm from "../pages/resume/index.tsx";
import ResumeDetail from "../pages/resume/detail.tsx";
import ApplicantsPage from "../pages/post/ApplicantsPage.tsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/post/create" element={<PostCreate />} />
      <Route path="/hub" element={<HubPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/resume/new" element={<ResumeForm />} />
      <Route path="/profile/resume/edit/:id" element={<ResumeForm />} />
      <Route path="/profile/resume/:id" element={<ResumeDetail />} />
      <Route path="/post/:id/applicants" element={<ApplicantsPage />} />
    </Routes>
  );
}

export default Router;
