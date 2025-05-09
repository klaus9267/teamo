import api from "./config.ts";

export interface User {
  id: number;
  name: string;
  profileImg: string;
  skills: string[];
  introduce: string;
  projects: {
    id: number;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
  }[];
  reviews: {
    id: number;
    author: string;
    content: string;
    date: string;
  }[];
  resumeList: {
    id: number;
    title: string;
    content: string;
    date: string;
  }[];
}

export const userApi = {
  // 사용자 정보 조회
  getUser: async (id: number) => {
    try {
      const response = await api.get<User>(`/api/users/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "사용자 정보 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 현재 로그인한 사용자 정보 조회
  getCurrentUser: async () => {
    try {
      const response = await api.get<User>("/api/users/me");
      return response.data;
    } catch (error: any) {
      console.error(
        "현재 사용자 정보 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 사용자 정보 수정
  updateUser: async (userData: Partial<User>) => {
    try {
      const response = await api.put<User>("/api/users/me", userData);
      return response.data;
    } catch (error: any) {
      console.error(
        "사용자 정보 수정 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 리뷰 작성
  createReview: async (
    userId: number,
    reviewData: { content: string; postId?: number }
  ) => {
    try {
      const response = await api.post(
        `/api/users/${userId}/reviews`,
        reviewData
      );
      return response.data;
    } catch (error: any) {
      console.error("리뷰 작성 에러:", error.response?.data || error.message);
      throw error;
    }
  },
};
