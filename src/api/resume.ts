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
      console.log("자기소개서 생성 요청 데이터:", resumeData);

      // FormData 내용 로깅
      if (resumeData instanceof FormData) {
        console.log("FormData 내용:");
        for (let pair of resumeData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        // skills 확인
        const skills = resumeData.getAll("skills");
        console.log("전송되는 스킬 목록:", skills);
      }

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
      console.log("자기소개서 생성 응답:", response.data);
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
      console.log("자기소개서 수정 요청 데이터:", resumeData);

      // FormData 내용 로깅
      if (resumeData instanceof FormData) {
        console.log("FormData 내용:");
        for (let pair of resumeData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        // skills 확인
        const skills = resumeData.getAll("skills");
        console.log("전송되는 스킬 목록:", skills);
      }

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
      console.log("자기소개서 수정 응답:", response.data);
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
      console.log(`자기소개서 삭제 API 호출: /api/resumes/${id}`);
      const response = await api.delete(`/api/resumes/${id}`);
      console.log("자기소개서 삭제 API 응답:", response);
      return response.data;
    } catch (error: any) {
      console.error(
        "자기소개서 삭제 에러:",
        error.response?.data || error.message
      );
      console.error("에러 상세 정보:", error);
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
