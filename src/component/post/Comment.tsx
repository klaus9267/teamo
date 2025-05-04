import React, { useState } from "react";
import "../../styles/post/Comment.css";

interface CommentType {
  id: number;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  replies?: CommentType[];
}

interface CommentProps {
  comments: CommentType[];
  postId: number;
}

const Comment: React.FC<CommentProps> = ({ comments, postId }) => {
  const [newComment, setNewComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [localComments, setLocalComments] = useState<CommentType[]>(comments);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // 현재 로그인한 사용자 ID (예시로 1 사용)
  const currentUserId = 1;

  // 댓글 작성 처리
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // 새 댓글 객체 생성 (실제로는 API 호출 후 응답 데이터를 사용)
    const newCommentObj: CommentType = {
      id: Date.now(),
      author: {
        id: currentUserId, // 현재 로그인한 사용자 ID
        name: "현재 사용자", // 현재 로그인한 사용자 이름
        avatar: "https://via.placeholder.com/40", // 현재 로그인한 사용자 아바타
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setLocalComments([...localComments, newCommentObj]);
    setNewComment("");
  };

  // 대댓글 작성 토글
  const toggleReplyForm = (commentId: number) => {
    setActiveReplyId(activeReplyId === commentId ? null : commentId);
    setReplyContent("");
  };

  // 대댓글 작성 처리
  const handleReplySubmit = (
    e: React.FormEvent,
    parentComment: CommentType
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    // 새 대댓글 객체 생성
    const newReply: CommentType = {
      id: Date.now(),
      author: {
        id: currentUserId, // 현재 로그인한 사용자 ID
        name: "현재 사용자", // 현재 로그인한 사용자 이름
        avatar: "https://via.placeholder.com/40", // 현재 로그인한 사용자 아바타
      },
      content: replyContent,
      createdAt: new Date().toISOString(),
    };

    // 댓글 목록 업데이트
    const updatedComments = localComments.map((comment) => {
      if (comment.id === parentComment.id) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      return comment;
    });

    setLocalComments(updatedComments);
    setReplyContent("");
    setActiveReplyId(null);
  };

  // 댓글 수정 모드 전환
  const handleEditStart = (comment: CommentType) => {
    setEditMode(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditMode(null);
    setEditContent("");
  };

  // a댓글 수정 저장
  const handleEditSave = (
    commentId: number,
    isReply: boolean = false,
    parentId?: number
  ) => {
    if (!editContent.trim()) return;

    let updatedComments;
    if (isReply && parentId) {
      // 대댓글 수정
      updatedComments = localComments.map((comment) => {
        if (comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? { ...reply, content: editContent }
                : reply
            ),
          };
        }
        return comment;
      });
    } else {
      // 일반 댓글 수정
      updatedComments = localComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: editContent }
          : comment
      );
    }

    setLocalComments(updatedComments);
    setEditMode(null);
    setEditContent("");
  };

  // 댓글 삭제 처리
  const handleDelete = (
    commentId: number,
    isReply: boolean = false,
    parentId?: number
  ) => {
    if (isReply && parentId) {
      // 대댓글 삭제
      const updatedComments = localComments.map((comment) => {
        if (comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== commentId),
          };
        }
        return comment;
      });
      setLocalComments(updatedComments);
    } else {
      // 일반 댓글 삭제
      setLocalComments(
        localComments.filter((comment) => comment.id !== commentId)
      );
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 댓글 총 개수 계산 (댓글 + 대댓글)
  const getTotalCommentCount = () => {
    let count = localComments.length;
    localComments.forEach((comment) => {
      if (comment.replies) {
        count += comment.replies.length;
      }
    });
    return count;
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">댓글</h3>

      {/* 댓글 작성 폼 */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-textarea"
        />
        <button type="submit" className="comment-submit-btn">
          댓글 작성
        </button>
      </form>

      {/* 댓글 목록 */}
      <div className="comments-list">
        {localComments.length === 0 ? (
          <div className="no-comments">첫 댓글을 작성해보세요!</div>
        ) : (
          localComments.map((comment) => (
            <div key={comment.id} className="comment-container">
              {/* 댓글 */}
              <div className="comment">
                <div className="comment-avatar">
                  <img src={comment.author.avatar} alt={comment.author.name} />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <div className="comment-author">{comment.author.name}</div>
                    <div className="comment-date">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>

                  {editMode === comment.id ? (
                    // 댓글 수정 폼
                    <div className="edit-form">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="comment-textarea"
                        style={{ width: "100%", boxSizing: "border-box" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                          marginTop: "8px",
                        }}
                      >
                        <button
                          className="modify-btn"
                          onClick={() => handleEditCancel()}
                          style={{ color: "#888" }}
                        >
                          취소
                        </button>
                        <button
                          className="comment-submit-btn"
                          onClick={() => handleEditSave(comment.id)}
                          style={{ padding: "4px 12px", margin: 0 }}
                        >
                          수정
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 댓글 내용
                    <div className="comment-text">{comment.content}</div>
                  )}

                  {editMode !== comment.id && (
                    <div className="comment-actions">
                      <button
                        className="reply-btn"
                        onClick={() => toggleReplyForm(comment.id)}
                      >
                        답글달기
                      </button>
                      {comment.author.id === currentUserId && (
                        <>
                          <button
                            className="modify-btn"
                            onClick={() => handleEditStart(comment)}
                          >
                            수정
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(comment.id)}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 대댓글 작성 폼 */}
              {activeReplyId === comment.id && (
                <form
                  className="reply-form"
                  onSubmit={(e) => handleReplySubmit(e, comment)}
                >
                  <textarea
                    placeholder="답글을 작성해주세요"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="reply-textarea"
                  />
                  <button type="submit" className="reply-submit-btn">
                    등록
                  </button>
                </form>
              )}

              {/* 대댓글 목록 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies-list">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply">
                      <div className="comment-avatar">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                        />
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <div className="comment-author">
                            {reply.author.name}
                          </div>
                          <div className="comment-date">
                            {formatDate(reply.createdAt)}
                          </div>
                        </div>

                        {editMode === reply.id ? (
                          // 대댓글 수정 폼
                          <div className="edit-form">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="reply-textarea"
                              style={{ width: "100%", boxSizing: "border-box" }}
                            />
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                justifyContent: "flex-end",
                                marginTop: "8px",
                              }}
                            >
                              <button
                                className="modify-btn"
                                onClick={() => handleEditCancel()}
                                style={{ color: "#888" }}
                              >
                                취소
                              </button>
                              <button
                                className="reply-submit-btn"
                                onClick={() =>
                                  handleEditSave(reply.id, true, comment.id)
                                }
                                style={{ padding: "4px 12px", margin: 0 }}
                              >
                                수정
                              </button>
                            </div>
                          </div>
                        ) : (
                          // 대댓글 내용
                          <div className="comment-text">{reply.content}</div>
                        )}

                        {editMode !== reply.id &&
                          reply.author.id === currentUserId && (
                            <div className="comment-actions">
                              <button
                                className="modify-btn"
                                onClick={() => handleEditStart(reply)}
                              >
                                수정
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(reply.id, true, comment.id)
                                }
                              >
                                삭제
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;
