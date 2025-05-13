import api from "./config.ts";
import axios from "axios";

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

  // 함께한 모집글 목록 조회 API 추가
  getTogetherPosts: async (userId: number) => {
    try {
      // 백엔드 API가 404를 리턴하면 빈 배열로, 그 외 오류는 예외로 처리하는 로직
      const response = await api.get(`/api/posts/${userId}/together`, {
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404; // 404는 빈 배열로 처리
        },
      });

      // 성공적인 응답일 경우만 데이터 반환
      if (response.status === 200) {
        return response.data || [];
      }

      // 404 등의 경우는 빈 배열 반환
      return [];
    } catch (error) {
      console.error("함께한 모집글 목록 조회 에러:", error);
      return [];
    }
  },
};

// 리뷰 API 추가
export const reviewApi = {
  // 리뷰 목록 조회
  getReviews: async (userId: number) => {
    try {
      const response = await api.get(`/api/reviews/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error("리뷰 목록 조회 에러:", error);
      return [];
    }
  },

  // 리뷰 등록
  createReview: async (
    revieweeId: number,
    postId: number | null,
    content: string
  ) => {
    const response = await api.post(`/api/reviews/${revieweeId}`, {
      postId,
      content,
    });

    return response.data;
  },

  // 리뷰 수정
  updateReview: async (
    reviewId: number,
    postId: number | null,
    content: string
  ) => {
    await api.patch(`/api/reviews/${reviewId}`, {
      postId,
      content,
    });
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: number) => {
    try {
      const response = await api.delete(`/api/reviews/${reviewId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
