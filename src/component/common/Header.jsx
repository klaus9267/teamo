import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../../styles/common/Header.css";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리
  const navigate = useNavigate();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // 임시 로그인 처리 함수
  const handleLogin = () => {
    setIsLoggedIn(true);
    closeLoginModal();
  };

  // 임시 로그아웃 처리 함수
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // 프로필 페이지로 이동
  const goToProfile = () => {
    navigate("/profile");
  };

  // 게시글 작성 페이지로 이동
  const goToCreatePost = () => {
    navigate("/post/create");
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">
              <Link to="/">Teamo</Link>
            </h1>
          </div>
          <div className="header-right">
            <nav className="main-nav">
              <Link to="/hub" className="nav-link">
                허브
              </Link>
              <Link to="/post/create" className="nav-link">
                팀원 모집하기
              </Link>
            </nav>
            {isLoggedIn ? (
              <div className="user-menu">
                <button className="profile-btn" onClick={goToProfile}>
                  프로필
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={openLoginModal}>
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {isLoginModalOpen && (
        <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />
      )}
    </>
  );
};

export default Header;
