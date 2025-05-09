import api from "./config.ts";

export interface Developer {
  id: number;
  name: string;
  profileImg: string;
  role: string;
  company: string;
  experience: string;
  skills: string[];
  description: string;
  contactUrl: string;
}

export const developerApi = {
  // 개발자 목록 조회
  getDevelopers: async () => {
    try {
      const response = await api.get<Developer[]>("/api/developers");
      return response.data;
    } catch (error) {
      console.error("개발자 목록 조회 에러:", error);
      throw error;
    }
  },

  // 개발자 상세 조회
  getDeveloper: async (id: number) => {
    try {
      const response = await api.get<Developer>(`/api/developers/${id}`);
      return response.data;
    } catch (error) {
      console.error("개발자 상세 조회 에러:", error);
      throw error;
    }
  },

  // 개발자 검색
  searchDevelopers: async (query: string) => {
    try {
      const response = await api.get<Developer[]>(
        `/api/developers/search?q=${query}`
      );
      return response.data;
    } catch (error) {
      console.error("개발자 검색 에러:", error);
      throw error;
    }
  },

  // 기술 스택별 개발자 필터링
  filterDevelopersBySkills: async (skills: string[]) => {
    try {
      const response = await api.get<Developer[]>(
        `/api/developers/filter?skills=${skills.join(",")}`
      );
      return response.data;
    } catch (error) {
      console.error("개발자 필터링 에러:", error);
      throw error;
    }
  },
};
