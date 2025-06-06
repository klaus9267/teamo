import api from "./config.ts";

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  parentCommentId?: number;
  profile?: {
    id?: number;
    name?: string;
    introduction?: string;
    image?: string;
    nickname?: string;
    userId?: number;
  };
  // 이전 버전 호환성을 위한 필드들 (선택적)
  username?: string;
  profileImage?: string;
  userId?: number;
  children?: CommentResponse[];
}

export interface CommentRequest {
  content: string;
  postId: number;
  parentCommentId?: number;
}

export const commentApi = {
  // 댓글 목록 조회
  getComments: async (postId: number): Promise<CommentResponse[]> => {
    try {
      const response = await api.get(`/api/comments?postId=${postId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "댓글 목록 조회 에러:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 댓글 작성
  createComment: async (commentData: CommentRequest): Promise<any> => {
    try {
      const response = await api.post("/api/comments", commentData);
      return response.data;
    } catch (error: any) {
      console.error("댓글 작성 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 댓글 수정
  updateComment: async (
    commentId: number,
    commentData: CommentRequest
  ): Promise<any> => {
    try {
      const response = await api.patch(
        `/api/comments/${commentId}`,
        commentData
      );
      return response.data;
    } catch (error: any) {
      console.error("댓글 수정 에러:", error.response?.data || error.message);
      throw error;
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<any> => {
    try {
      const response = await api.delete(`/api/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      console.error("댓글 삭제 에러:", error.response?.data || error.message);
      throw error;
    }
  },
};
