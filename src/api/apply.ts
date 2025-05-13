import api from "./config.ts";

export interface ApplyRequest {
  postId: number;
  resumeId: number;
  reason: string;
}

export interface ApplyResponse {
  applyId: number;
  userId: number;
  introduction: string;
  profileImage: string;
  reason: string;
  isSelected: boolean;
  applyAt: string;
  resumeId: number;
  title: string;
  content: string;
  personality: string;
  portfolioUrl: string;
  skills: string[];
  aiScore: number;
  aiReason: string;
}

export interface ApplyListResponse {
  applyId: number;
  userId: number;
  resumeId: number;
  nickname: string;
  profileImage: string;
  introduction: string;
  personality: string;
  portfolioUrl: string;
  skills: string[];
  isSelected: boolean;
  aiScore: number;
  aiReason: string;
  aiSummary: string;
}

export const applyApi = {
  // 모집글 지원하기
  apply: async (applyData: ApplyRequest) => {
    try {
      const response = await api.post<ApplyResponse>("/api/applies", applyData);
      return response.data;
    } catch (error: any) {
      console.error("모집글 지원 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 특정 모집글의 지원자 목록 조회
  getAppliesByPostId: async (postId: number) => {
    try {
      const response = await api.get<ApplyListResponse[]>(
        `/api/applies/post/${postId}/resume-skills`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "모집글 지원자 목록 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 특정 지원서 상세 조회
  getApply: async (applyId: number) => {
    try {
      const response = await api.get<ApplyResponse>(`/api/applies/${applyId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "지원서 상세 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 지원 취소
  cancelApply: async (applyId: number) => {
    try {
      await api.delete(`/api/applies/${applyId}`);
    } catch (error: any) {
      console.error("지원 취소 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 팀원 매칭 선택/취소
  selectApplicant: async (applyId: number, selected: boolean) => {
    try {
      await api.patch(`/api/applies/${applyId}/selection?selected=${selected}`);
    } catch (error: any) {
      console.error(
        "팀원 매칭 선택/취소 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
