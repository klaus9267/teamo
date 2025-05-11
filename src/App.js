import { createContext, useState, useEffect } from 'react';
import './App.css';
import Header from './component/common/Header';
import Router from './component/Router.tsx';
import { authApi } from './api/auth.ts';

// 인증 컨텍스트 생성
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authApi.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // 사용자 정보 가져오기 (JWT 토큰에서 디코딩)
        const userInfo = authApi.getUserInfo();
        setUser(userInfo);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // 로그인 핸들러
  const login = userData => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // 로그아웃 핸들러
  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // 인증 관련 값과 함수들을 컨텍스트 프로바이더를 통해 자식 컴포넌트들에 제공
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      <div className="App">
        <Header />
        <Router />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
