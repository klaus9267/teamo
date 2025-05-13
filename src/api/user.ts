import api from "./config.ts";

export interface ProfileResponse {
  profile: {
    id: number;
    name: string;
    introduction: string;
    image: string;
    nickname: string;
    userId: number;
  };
  authorPosts: Post[];
  joinedPosts: Post[];
  reviews: Review[];
  resumes: Resume[];
}

export interface Post {
  id: number;
  image: string;
  title: string;
  content: string;
  category: string;
  type: string;
  endedAt: string;
  skills: string[];
  headCount: number;
  currentCount: number;
}

export interface Reviewer {
  id: number;
  name: string;
  introduction: string;
  image: string;
  nickname: string;
  userId: number;
}

export interface Review {
  id: number;
  content: string;
  reviewer: Reviewer;
  postId: number;
  postTitle: string;
}

export interface Resume {
  id: number;
  title: string;
  content: string;
  personality: string;
  portfolio: string;
  isMain: boolean;
}

export const userApi = {
  // 내 프로필 조회
  getCurrentUser: async (): Promise<ProfileResponse> => {
    try {
      const response = await api.get("/api/profiles/me");
      return response.data;
    } catch (error: any) {
      console.error(
        "내 프로필 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 다른 사용자 프로필 조회
  getUser: async (id: number): Promise<ProfileResponse> => {
    try {
      const response = await api.get(`/api/profiles/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "사용자 프로필 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 프로필 수정
  updateUser: async (userData: {
    introduction?: string;
    nickname?: string;
    image?: string | File | null;
  }) => {
    try {
      const formData = new FormData();

      // 일반 필드 추가 - 항상 JSON 형태로 전송
      formData.append(
        "request",
        JSON.stringify({
          introduction: userData.introduction,
          nickname: userData.nickname,
        })
      );

      // 새 이미지가 있는 경우에만 이미지 필드 추가
      if (userData.image) {
        // 이미지가 string이고 base64 형식인 경우 File 객체로 변환
        if (
          typeof userData.image === "string" &&
          userData.image.startsWith("data:")
        ) {
          const response = await fetch(userData.image);
          const blob = await response.blob();
          const file = new File([blob], "profile-image.jpg", {
            type: "image/jpeg",
          });
          formData.append("image", file);
        }
        // 이미 File 객체인 경우
        else if (userData.image instanceof File) {
          formData.append("image", userData.image);
        }
        // 기존 서버 이미지 URL인 경우 이미지 필드 추가하지 않음 (변경 없음으로 처리)
      }
      // 이미지가 null이거나 undefined인 경우 이미지 필드 추가하지 않음

      const response = await api.patch("/api/profiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("프로필 수정 에러:", error.response?.data || error.message);
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
