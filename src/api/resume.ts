import api from "./config.ts";

export interface Resume {
  id: number;
  title: string;
  content: string;
  date: string;
  skills: string[];
  personality: string;
  isMain?: boolean;
  file?: File;
  fileUrl?: string;
  userId?: number;
}

export const resumeApi = {
  // 자기소개서 목록 조회
  getResumes: async () => {
    try {
      const response = await api.get<Resume[]>("/api/resumes");
      return response.data;
    } catch (error: any) {
      console.error(
        "자기소개서 목록 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 자기소개서 상세 조회
  getResume: async (id: number) => {
    try {
      const response = await api.get<Resume>(`/api/resumes/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "자기소개서 상세 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 자기소개서 작성
  createResume: async (resumeData: FormData | Omit<Resume, "id" | "date">) => {
    try {
      const config = {
        headers: {
          "Content-Type":
            resumeData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      };

      const response = await api.post<Resume>(
        "/api/resumes",
        resumeData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "자기소개서 작성 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 자기소개서 수정
  updateResume: async (id: number, resumeData: FormData | Partial<Resume>) => {
    try {
      const config = {
        headers: {
          "Content-Type":
            resumeData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      };

      const response = await api.patch<Resume>(
        `/api/resumes/${id}`,
        resumeData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "자기소개서 수정 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 자기소개서 삭제
  deleteResume: async (id: number) => {
    try {
      await api.delete(`/api/resumes/${id}`);
    } catch (error: any) {
      console.error(
        "자기소개서 삭제 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 대표 자기소개서 설정
  setMainResume: async (id: number) => {
    try {
      const response = await api.put<Resume>(`/api/resumes/${id}/main`);
      return response.data;
    } catch (error: any) {
      console.error(
        "대표 자기소개서 설정 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
