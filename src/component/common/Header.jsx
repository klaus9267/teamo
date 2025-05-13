import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal.jsx';
import '../../styles/common/Header.css';
import { authApi } from '../../api/auth.ts';
import { showInfo } from '../../utils/sweetAlert.ts';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = authApi.isAuthenticated();
      setIsLoggedIn(isAuthenticated);

      if (isAuthenticated) {
        const info = authApi.getUserInfo();
        setUserInfo(info);
      } else {
        setUserInfo(null);
      }
    };

    checkAuthStatus();

    // 로컬 스토리지 변경 감지
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
    const info = authApi.getUserInfo();
    setUserInfo(info);

    // 사용자 ID를 localStorage에 저장
    if (info && info.id) {
      localStorage.setItem('myUserId', String(info.id));
    }

    closeLoginModal();
  };

  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleCreateBtn = () => {
    if (!isLoggedIn) {
      showInfo('팀원 모집하기는 로그인 후 이용 가능합니다.');
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/post/create');
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">
              <Link to="/">
                <img src="/logo.png" alt="Teamo 로고" className="logo-image" />
              </Link>
            </h1>
          </div>
          <div className="header-right">
            <nav className="main-nav">
              <Link to="/hub" className="nav-link">
                허브
              </Link>
              <span className="nav-link" onClick={handleCreateBtn} style={{ cursor: 'pointer' }}>
                팀원 모집하기
              </span>
            </nav>
            {isLoggedIn ? (
              <div className="user-menu">
                <button className="profile-btn" onClick={goToProfile}>
                  <div className="profile-btn-content">
                    <img src={userInfo?.profileImage || '/profile.png'} alt="프로필" className="profile-btn-image" />
                    <span>프로필</span>
                  </div>
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

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />}
    </>
  );
};

export default Header;
