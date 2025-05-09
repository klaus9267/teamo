import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../../styles/common/Header.css";
import { authApi } from "../../api/auth.ts";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = authApi.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
    };

    checkAuthStatus();

    // 로컬 스토리지 변경 감지
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    closeLoginModal();
  };

  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      // 로그인하지 않은 경우 알림 표시 후 로그인 모달 열기
      alert("팀원 모집하기는 로그인 후 이용 가능합니다.");
      openLoginModal();
    } else {
      navigate("/post/create");
    }
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
              <span
                className="nav-link"
                onClick={handleCreatePost}
                style={{ cursor: "pointer" }}
              >
                팀원 모집하기
              </span>
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
