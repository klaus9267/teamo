import api from "./config.ts";

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

export const authApi = {
  // 회원가입
  signUp: async (data: SignUpRequest) => {
    try {
      console.log("회원가입 요청 데이터:", data);
      const response = await api.post("/auth/signup", data);
      console.log("회원가입 응답:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("회원가입 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 로그인
  login: async (data: LoginRequest) => {
    try {
      console.log("로그인 요청 데이터:", data);
      const response = await api.post("/auth/login", data);
      console.log("로그인 응답:", response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
      }
      return response.data;
    } catch (error: any) {
      console.error("로그인 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 비밀번호 변경
  changePassword: async (data: PasswordChangeRequest) => {
    try {
      const response = await api.patch("/auth/password", data);
      return response.data;
    } catch (error: any) {
      console.error(
        "비밀번호 변경 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem("token");
  },

  // 토큰 확인
  getToken: () => {
    return localStorage.getItem("token");
  },

  // 로그인 상태 확인
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
