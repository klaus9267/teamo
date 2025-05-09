import api from "./config.ts";

// 새로운 API 응답 형식에 맞게 수정된 인터페이스
export interface MatchedUser {
  userId: number;
  nickname: string;
  image: string;
  introduction: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  headCount: number;
  image: string;
  requirementPersonality: string;
  endedAt: string;
  category: string;
  type: string;
  skills: string[];
  matchedUsers: MatchedUser[];
  currentCount: number;
}

export const postApi = {
  // 게시글 목록 조회
  getPosts: async () => {
    try {
      const response = await api.get("/api/posts");
      return response.data;
    } catch (error: any) {
      console.error(
        "게시글 목록 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 게시글 상세 조회
  getPost: async (id: number) => {
    try {
      const response = await api.get<Post>(`/api/posts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "게시글 상세 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 게시글 작성
  createPost: async (postData: Omit<Post, "id">) => {
    try {
      // FormData 객체 생성
      const formData = new FormData();

      // 일반 필드 추가
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("headCount", postData.headCount.toString());
      formData.append(
        "requirementPersonality",
        postData.requirementPersonality || ""
      );
      formData.append("endedAt", postData.endedAt);
      formData.append("category", postData.category);
      formData.append("type", postData.type);

      // 스킬 배열 추가 (각 항목을 별도의 skills 파라미터로 추가)
      postData.skills.forEach((skill) => {
        formData.append("skills", skill);
      });

      // 이미지 처리
      if (postData.image) {
        // 이미지가 File 객체인 경우
        if (typeof postData.image !== "string" && "name" in postData.image) {
          formData.append("image", postData.image as File);
        }
        // 이미지가 base64 문자열인 경우
        else if (
          typeof postData.image === "string" &&
          postData.image.startsWith("data:")
        ) {
          const blob = await (await fetch(postData.image)).blob();
          const file = new File([blob], "image.png", { type: "image/png" });
          formData.append("image", file);
        }
      }

      // multipart/form-data로 전송
      const response = await api.post<Post>("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("게시글 작성 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 게시글 수정
  updatePost: async (id: number, postData: Partial<Post>) => {
    try {
      const response = await api.put<Post>(`/api/posts/${id}`, postData);
      return response.data;
    } catch (error: any) {
      console.error("게시글 수정 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 게시글 삭제
  deletePost: async (id: number) => {
    try {
      await api.delete(`/api/posts/${id}`);
    } catch (error: any) {
      console.error("게시글 삭제 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 지원자 목록 조회
  getApplicants: async (postId: number) => {
    try {
      const response = await api.get(`/api/posts/${postId}/applicants`);
      return response.data;
    } catch (error: any) {
      console.error(
        "지원자 목록 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 지원하기
  apply: async (
    postId: number,
    data: { resumeId: number; motivation: string }
  ) => {
    try {
      const response = await api.post(`/api/posts/${postId}/apply`, data);
      return response.data;
    } catch (error: any) {
      console.error("게시글 지원 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 지원자 승인/거절
  handleApplicant: async (
    postId: number,
    applicantId: number,
    action: "accept" | "reject"
  ) => {
    try {
      const response = await api.post(
        `/api/posts/${postId}/applicants/${applicantId}/${action}`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `지원자 ${action === "accept" ? "승인" : "거절"} 에러:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
