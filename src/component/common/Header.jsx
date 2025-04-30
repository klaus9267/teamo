import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../../styles/common/Header.css";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
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
              <Link to="/recruit" className="nav-link">
                팀원 모집하기
              </Link>
              <Link to="/hub" className="nav-link">
                허브
              </Link>
            </nav>
            <button className="login-btn" onClick={openLoginModal}>
              로그인
            </button>
          </div>
        </div>
      </header>

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </>
  );
};

export default Header;
