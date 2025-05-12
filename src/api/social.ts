import axios from "axios";
import api from "./config.ts";

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  id_token?: string;
}

interface KakaoUserInfo {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile?: {
      nickname: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
    email?: string;
  };
}

interface SocialLoginPayload {
  name: string;
  socialId: string;
  type: string;
}

export const socialApi = {
  // 카카오 토큰 발급 (외부 API 호출)
  getKakaoToken: async (params: {
    grant_type: string;
    client_id: string;
    redirect_uri: string;
    code: string;
  }): Promise<KakaoTokenResponse> => {
    try {
      const response = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        {
          ...params,
          client_secret: process.env.REACT_APP_KAKAO_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "카카오 토큰 발급 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 카카오 사용자 정보 조회 (외부 API 호출)
  getKakaoUserInfo: async (accessToken: string): Promise<KakaoUserInfo> => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "카카오 사용자 정보 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 소셜 로그인 백엔드 인증 (내부 API 호출)
  socialLogin: async (payload: SocialLoginPayload) => {
    try {
      const response = await api.post("/auth/login/social", payload);
      return response.data;
    } catch (error: any) {
      console.error("소셜 로그인 에러:", error.response?.data || error.message);
      throw error;
    }
  },
};
