import React, { useState, useEffect } from "react";
import "../../styles/post/Comment.css";
import Spinner from "../common/Spinner.tsx";
import { showInfo, showError, showSuccess } from "../../utils/sweetAlert.ts";
import {
  commentApi,
  CommentResponse,
  CommentRequest,
} from "../../api/comment.ts";
import { authApi } from "../../api/auth.ts";

interface CommentProps {
  postId: number;
}

const Comment: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 현재 로그인한 사용자 정보
  const userInfo = authApi.getUserInfo();
  const isLoggedIn = authApi.isAuthenticated();

  // localStorage에서 myUserId 가져오기
  useEffect(() => {
    const storedUserId = localStorage.getItem("myUserId");
    if (storedUserId) {
      setCurrentUserId(Number(storedUserId));
    } else if (userInfo?.id) {
      setCurrentUserId(userInfo.id);
    }
  }, [userInfo]);

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentApi.getComments(postId);

      // 계층 구조로 변환
      const commentMap = new Map<number, CommentResponse>();
      const rootComments: CommentResponse[] = [];

      // 먼저 모든 댓글을 맵에 저장
      data.forEach((comment) => {
        commentMap.set(comment.id, {
          ...comment,
          children: [],
        });
      });

      // 부모-자식 관계 설정
      data.forEach((comment) => {
        if (comment.parentCommentId) {
          const parentComment = commentMap.get(comment.parentCommentId);
          if (parentComment && parentComment.children) {
            parentComment.children.push(commentMap.get(comment.id) || comment);
          }
        } else {
          rootComments.push(commentMap.get(comment.id) || comment);
        }
      });

      setComments(rootComments);
      setLoading(false);
    } catch (err: any) {
      console.error("댓글 목록 조회 오류:", err);
      setError("댓글을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // 댓글 작성 처리
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId || !isLoggedIn) {
      if (!isLoggedIn) {
        showInfo("댓글 작성은 로그인 후 이용 가능합니다.");
      }
      return;
    }

    try {
      const commentData: CommentRequest = {
        content: newComment,
        postId: postId,
      };

      await commentApi.createComment(commentData);
      showSuccess("댓글이 등록되었습니다.");
      setNewComment("");
      fetchComments(); // 댓글 목록 갱신
    } catch (err) {
      console.error("댓글 작성 오류:", err);
      showError("댓글 등록에 실패했습니다.");
    }
  };

  // 대댓글 작성 토글
  const toggleReplyForm = (commentId: number) => {
    if (!isLoggedIn) {
      showInfo("댓글 작성은 로그인 후 이용 가능합니다.");
      return;
    }

    setActiveReplyId(activeReplyId === commentId ? null : commentId);
    setReplyContent("");
  };

  // 대댓글 작성 처리
  const handleReplySubmit = async (
    e: React.FormEvent,
    parentCommentId: number
  ) => {
    e.preventDefault();
    if (!replyContent.trim() || !postId || !isLoggedIn) {
      if (!isLoggedIn) {
        showInfo("댓글 작성은 로그인 후 이용 가능합니다.");
      }
      return;
    }

    try {
      const replyData: CommentRequest = {
        content: replyContent,
        postId: postId,
        parentCommentId: parentCommentId,
      };

      await commentApi.createComment(replyData);
      showSuccess("답글이 등록되었습니다.");
      setReplyContent("");
      setActiveReplyId(null);
      fetchComments(); // 댓글 목록 갱신
    } catch (err) {
      console.error("대댓글 작성 오류:", err);
      showError("답글 등록에 실패했습니다.");
    }
  };

  // 댓글 수정 모드 전환
  const handleEditStart = (comment: CommentResponse) => {
    setEditMode(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditMode(null);
    setEditContent("");
  };

  // 댓글 수정 저장
  const handleEditSave = async (commentId: number) => {
    if (!editContent.trim() || !postId) return;

    try {
      const editData: CommentRequest = {
        content: editContent,
        postId: postId,
      };

      await commentApi.updateComment(commentId, editData);
      showSuccess("댓글이 수정되었습니다.");
      setEditMode(null);
      setEditContent("");
      fetchComments(); // 댓글 목록 갱신
    } catch (err) {
      console.error("댓글 수정 오류:", err);
      showError("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제 처리
  const handleDelete = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      showSuccess("댓글이 삭제되었습니다.");
      fetchComments(); // 댓글 목록 갱신
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
      showError("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 소유자인지 확인
  const isCommentOwner = (commentUserId?: number) => {
    const storedUserId = localStorage.getItem("myUserId");
    const myUserId = storedUserId ? Number(storedUserId) : currentUserId;

    return myUserId && commentUserId && myUserId === commentUserId;
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } catch (error) {
      return "날짜 정보 없음";
    }
  };

  // 댓글 총 개수 계산 (댓글 + 대댓글)
  const getTotalCommentCount = () => {
    let count = comments?.length ?? 0;
    comments?.forEach((comment) => {
      if (comment?.children) {
        count += comment.children.length;
      }
    });
    return count;
  };

  // 댓글 컴포넌트 (재귀 렌더링)
  const renderComment = (comment: CommentResponse, isReply = false) => (
    <div key={comment.id} className={`comment ${isReply ? "reply" : ""}`}>
      <div className="comment-avatar">
        <img
          src={comment.profileImage || "https://via.placeholder.com/40"}
          alt={`${comment.username} avatar`}
        />
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.username}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>

        {editMode === comment.id ? (
          <div className="comment-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment-edit-textarea"
            />
            <div className="comment-edit-actions">
              <button
                onClick={() => handleEditSave(comment.id)}
                className="comment-edit-save"
              >
                저장
              </button>
              <button
                onClick={handleEditCancel}
                className="comment-edit-cancel"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}

        <div className="comment-actions">
          {!isReply && (
            <button
              onClick={() => toggleReplyForm(comment.id)}
              className="comment-reply-btn"
            >
              {activeReplyId === comment.id ? "취소" : "답글"}
            </button>
          )}

          {isCommentOwner(comment.userId) && (
            <>
              <button
                onClick={() => handleEditStart(comment)}
                className="comment-edit-btn"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="comment-delete-btn"
              >
                삭제
              </button>
            </>
          )}
        </div>

        {activeReplyId === comment.id && (
          <form
            className="reply-form"
            onSubmit={(e) => handleReplySubmit(e, comment.id)}
          >
            <textarea
              placeholder="답글을 입력하세요"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="reply-textarea"
            />
            <button type="submit" className="reply-submit-btn">
              답글 작성
            </button>
          </form>
        )}

        {comment.children && comment.children.length > 0 && (
          <div className="replies">
            {comment.children.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        댓글 <span className="comment-count">({getTotalCommentCount()})</span>
      </h3>

      {/* 댓글 작성 폼 */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          placeholder={
            isLoggedIn
              ? "댓글을 입력하세요"
              : "로그인 후 댓글을 작성할 수 있습니다"
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-textarea"
          disabled={!isLoggedIn}
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!isLoggedIn}
        >
          댓글 작성
        </button>
      </form>

      {/* 댓글 목록 */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">
            <Spinner size="small" text="댓글을 불러오는 중입니다" />
          </div>
        ) : error ? (
          <div className="comments-error">{error}</div>
        ) : !comments || comments.length === 0 ? (
          <div className="no-comments">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default Comment;
