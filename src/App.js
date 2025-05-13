import { createContext, useState, useEffect } from 'react';
import './App.css';
import Header from './component/common/Header';
import Router from './component/Router.tsx';
import { authApi } from './api/auth.ts';
import { userApi } from './api/user.ts';

// 인증 컨텍스트 생성
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 로드 시 로그인 상태 확인
  useEffect(() => {
    const initAuthStatus = async () => {
      const authenticated = authApi.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // 먼저 토큰에서 사용자 정보 추출하여 userId 저장
        const userInfo = authApi.getUserInfo();
        if (userInfo && userInfo.id) {
          // 사용자 기본 정보 설정
          setUser(userInfo);

          // userId를 localStorage에 바로 저장 (API 오류에 대비)
          localStorage.setItem('myUserId', String(userInfo.id));
        }

        try {
          // API를 통해 내 프로필 정보 가져오기
          const profileData = await userApi.getCurrentUser();

          if (profileData && profileData.profile) {
            // 사용자 정보 설정
            setUser({
              id: profileData.profile.userId,
              name: profileData.profile.name || profileData.profile.nickname,
              profileImage: profileData.profile.image,
              introduction: profileData.profile.introduction,
            });

            // userId를 localStorage에 저장
            if (profileData.profile.userId) {
              localStorage.setItem('myUserId', String(profileData.profile.userId));
            }
          }
        } catch (error) {
          console.error('프로필 정보 불러오기 실패:', error);
          // 실패 시 fallback으로 JWT 토큰 정보 사용
          // 이미 위에서 기본 정보를 설정했으므로 추가 작업 불필요
        }
      } else {
        // 로그인 상태가 아니면 localStorage의 userId 제거
        localStorage.removeItem('myUserId');
      }

      setLoading(false);
    };

    initAuthStatus();
  }, []);

  // 로그인 핸들러
  const login = userData => {
    setIsAuthenticated(true);
    setUser(userData);

    // 로그인 후 프로필 정보 다시 불러오기
    refreshUserProfile();
  };

  // 로그아웃 핸들러
  const logout = () => {
    authApi.logout();
    localStorage.removeItem('myUserId');
    setIsAuthenticated(false);
    setUser(null);
  };

  // 프로필 정보 다시 불러오는 함수
  const refreshUserProfile = async () => {
    const authenticated = authApi.isAuthenticated();

    if (authenticated) {
      try {
        const profileData = await userApi.getCurrentUser();

        if (profileData && profileData.profile) {
          setUser({
            id: profileData.profile.userId,
            name: profileData.profile.name || profileData.profile.nickname,
            profileImage: profileData.profile.image,
            introduction: profileData.profile.introduction,
          });

          if (profileData.profile.userId) {
            localStorage.setItem('myUserId', String(profileData.profile.userId));
          }
        }
      } catch (error) {
        console.error('프로필 정보 다시 불러오기 실패:', error);
      }
    }
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
        refreshUserInfo: refreshUserProfile,
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
