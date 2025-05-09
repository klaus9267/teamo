import api from "./config.ts";

export interface Resume {
  id: number;
  title: string;
  content: string;
  date: string;
  skills: string[];
  personality: string;
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
  createResume: async (resumeData: Omit<Resume, "id" | "date">) => {
    try {
      const response = await api.post<Resume>("/api/resumes", resumeData);
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
  updateResume: async (id: number, resumeData: Partial<Resume>) => {
    try {
      const response = await api.put<Resume>(`/api/resumes/${id}`, resumeData);
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
};
