import api from './config.ts';

export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SocialLoginRequest {
  code: string;
  state?: string;
  redirectUri: string;
  provider: string;
}

export interface UserInfo {
  username: string;
  name: string;
  email: string;
}

export const AUTH_TOKEN_KEY = 'auth_token';

export const authApi = {
  // 회원가입
  signUp: async (data: SignUpRequest) => {
    try {
      console.log('회원가입 요청 데이터:', data);
      const response = await api.post('/auth/signup', data);
      console.log('회원가입 응답:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('회원가입 에러:', error.response?.data || error.message);
      throw error;
    }
  },

  // 로그인
  login: async (data: LoginRequest) => {
    try {
      console.log('로그인 요청 데이터:', data);
      const response = await api.post('/auth/login', data);
      console.log('로그인 응답:', response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return response.data;
    } catch (error: any) {
      console.error('로그인 에러:', error.response?.data || error.message);
      throw error;
    }
  },

  // 소셜 로그인: 인증 코드로 로그인 처리
  socialLogin: async (data: SocialLoginRequest) => {
    try {
      console.log(`${data.provider} 소셜 로그인 요청:`, data);
      const response = await api.post(`/auth/oauth2/callback/${data.provider}`, {
        code: data.code,
        state: data.state,
        redirectUri: data.redirectUri,
      });
      console.log('소셜 로그인 응답:', response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return response.data;
    } catch (error: any) {
      console.error('소셜 로그인 에러:', error.response?.data || error.message);
      throw error;
    }
  },

  // 소셜 로그인: 액세스 토큰으로 로그인 처리
  socialLoginWithToken: async (provider: string, accessToken: string, userInfo?: any) => {
    try {
      console.log(`${provider} 토큰 기반 소셜 로그인 요청`);
      const response = await api.post(`/auth/social-login/${provider}`, {
        accessToken,
        userInfo,
      });
      console.log('소셜 로그인 응답:', response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return response.data;
    } catch (error: any) {
      console.error('소셜 로그인 에러:', error.response?.data || error.message);
      throw error;
    }
  },

  // 비밀번호 변경
  changePassword: async (data: PasswordChangeRequest) => {
    try {
      const response = await api.patch('/auth/password', data);
      return response.data;
    } catch (error: any) {
      console.error('비밀번호 변경 에러:', error.response?.data || error.message);
      throw error;
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // 토큰 확인
  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // 로그인 상태 확인
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // 토큰에서 사용자 정보 추출 (JWT 디코딩)
  getUserInfo: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    try {
      // JWT 토큰은 header.payload.signature 형태로 되어 있음
      const base64Url = token.split('.')[1]; // payload 부분만 추출
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('토큰 디코딩 에러:', error);
      return null;
    }
  },
};
