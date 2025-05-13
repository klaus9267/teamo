import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../styles/post/PostDetailPage.css";
import TechStack from "../../component/post/TechStack.tsx";
import TeamMembers from "../../component/post/TeamMembers.tsx";
import Comment from "../../component/post/Comment.tsx";
import { postApi } from "../../api/post.ts";
import { resumeApi } from "../../api/resume.ts";
import Spinner from "../../component/common/Spinner.tsx";
import { authApi } from "../../api/auth.ts";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "../../utils/sweetAlert.ts";
import { applyApi } from "../../api/apply.ts";

// 지원 상태 타입 정의
type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "none"
  | "applied"
  | "accepted";

interface MatchedUser {
  userId?: number;
  nickname?: string;
  image?: string;
  skills?: string[];
  isLeader?: boolean;
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(
    "none" as ApplicationStatus
  );
  const [showApplicantsList, setShowApplicantsList] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [userId, setUserId] = useState(null as number | null);

  // 지원 모달 관련 상태
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [motivationText, setMotivationText] = useState("");
  const [resumes, setResumes] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [resumesError, setResumesError] = useState(null);

  // API 연동을 위한 함수들
  const fetchPost = async (postId) => {
    try {
      const data = await postApi.getPost(postId);
      setPost(data);
      setLoading(false);
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      setResumesLoading(true);
      setResumesError(null);
      console.log("자기소개서 목록 불러오기 시작");
      const data = await resumeApi.getResumes();
      console.log("자기소개서 목록 불러오기 성공:", data);
      setResumes(data);
    } catch (err) {
      console.error("자기소개서 목록 불러오기 실패:", err);
      console.log("에러 상세 정보:", JSON.stringify(err, null, 2));
      if (err.response) {
        console.log("에러 응답 상태:", err.response.status);
        console.log("에러 응답 데이터:", err.response.data);
      }
      setResumesError("자기소개서를 불러오는데 실패했습니다.");
      // 빈 배열로 설정하여 에러 발생 시에도 UI 표시 가능
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  const fetchApplicants = async (postId) => {
    if (!postId) return;

    try {
      const data = await applyApi.getAppliesByPostId(postId);
      setApplicants(data);

      // 현재 사용자가 이미 지원했는지 확인
      if (userId) {
        const userApplied = data.some((app) => app.userId === userId);
        if (userApplied) {
          setApplicationStatus("applied");
        }
      }
    } catch (err) {
      console.error("지원자 목록 조회 에러:", err);
    }
  };

  // 사용자 정보 불러오기
  useEffect(() => {
    const userInfo = authApi.getUserInfo();

    // localStorage에서 직접 myUserId를 확인하여 사용
    const storedUserId = localStorage.getItem("myUserId");

    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else if (userInfo?.id) {
      setUserId(userInfo.id);
    } else {
      setUserId(null);
    }
  }, []);

  // 게시글 불러오기
  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id]);

  // post와 userId가 모두 로드된 후 글 작성자 및 지원 상태 확인
  useEffect(() => {
    if (post && userId) {
      setIsAuthor(post.userId === userId);

      // 지원자 목록 조회 (내가 작성한 글이거나 지원 여부 확인 필요할 때)
      fetchApplicants(post.id);
    }
  }, [post, userId]);

  // 자기소개서 목록 미리 로드
  useEffect(() => {
    if (userId) {
      // 사용자 ID가 있을 경우 자기소개서 목록 로드
      fetchResumes();
    }
  }, [userId]);

  // 지원자 승인/거절 처리 함수
  const handleApplicantAction = async (applicantId, action) => {
    try {
      if (!id || !post?.id) return;

      // 승인 혹은 거절 액션에 따라 API 호출
      if (action === "accept") {
        await applyApi.selectApplicant(applicantId, true);
        showSuccess("지원자가 승인되었습니다.");
      } else {
        await applyApi.selectApplicant(applicantId, false);
        showSuccess("지원자가 거절되었습니다.");
      }

      // 지원자 목록 새로고침
      fetchApplicants(post.id);
    } catch (error) {
      console.error(`지원자 ${action}하기 오류:`, error);
      showError(
        `지원자 ${action === "accept" ? "승인" : "거절"}에 실패했습니다.`
      );
    }
  };

  // 지원하기 함수
  const handleApply = () => {
    console.log("지원하기 버튼 클릭");
    console.log("로그인 상태:", authApi.isAuthenticated());
    console.log("토큰:", authApi.getToken());
    console.log("저장된 myUserId:", localStorage.getItem("myUserId"));

    if (!post) {
      showWarning(
        "게시글 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    // 로그인 상태 확인 방식 수정
    if (!authApi.isAuthenticated()) {
      showWarning("로그인이 필요한 기능입니다.");
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    // 사용자 ID 확인
    if (!userId && !localStorage.getItem("myUserId")) {
      showWarning("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    // 모달 표시 전에 자기소개서 로드
    fetchResumes();

    // 모달 표시
    console.log("지원하기 모달 열기");
    setShowApplyModal(true);
  };

  // 지원 제출 함수
  const handleSubmitApplication = async () => {
    if (!selectedResume) {
      showWarning("자기소개서를 선택해주세요.");
      return;
    }

    if (!motivationText.trim()) {
      showWarning("지원 동기를 입력해주세요.");
      return;
    }

    if (!id || !post?.id) {
      showError("잘못된 접근입니다.");
      return;
    }

    try {
      await applyApi.apply({
        postId: post.id,
        resumeId: selectedResume,
        reason: motivationText,
      });

      showSuccess("지원이 완료되었습니다.");
      setApplicationStatus("applied");
      setShowApplyModal(false);

      // 지원자 목록 새로고침
      fetchApplicants(post.id);
    } catch (error) {
      console.error("지원 제출 에러:", error);
      showError("지원에 실패했습니다.");
    }
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    console.log("지원하기 모달 닫기");
    setShowApplyModal(false);
    setSelectedResume(null);
    setMotivationText("");
  };

  // 지원자 목록 토글 함수
  const toggleApplicantsList = () => {
    setShowApplicantsList(!showApplicantsList);
  };

  if (loading) {
    return (
      <div
        className="post-detail-loading"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}
      >
        <Spinner size="large" text="로딩중입니다" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-error">
        {error || "게시글을 찾을 수 없습니다."}
      </div>
    );
  }

  // matchedUsers 배열을 TeamMembers 컴포넌트에 맞게 변환
  const getLeader = (matchedUsers) => {
    if (
      !matchedUsers ||
      !Array.isArray(matchedUsers) ||
      matchedUsers.length === 0
    ) {
      return null;
    }

    // 먼저 isLeader가 true인 사용자를 찾고, 없으면 첫 번째 사용자를 팀장으로 간주
    const leaderUser =
      matchedUsers.find((user) => user?.isLeader === true) || matchedUsers[0];

    return leaderUser
      ? {
          id: leaderUser.userId ?? 0,
          name: leaderUser.nickname ?? "팀장",
          avatar: leaderUser.image ?? "https://via.placeholder.com/40",
          email: "팀장@example.com", // 이메일 정보가 없으므로 임의 값 사용
          isLeader: true,
        }
      : null;
  };

  const getMembers = (matchedUsers, leaderId) => {
    if (
      !matchedUsers ||
      !Array.isArray(matchedUsers) ||
      matchedUsers.length <= 1
    ) {
      return [];
    }

    // 팀장을 제외한 나머지 사용자들을 멤버로 변환
    return matchedUsers
      .filter((user) => user?.userId !== leaderId)
      .map((user) => ({
        id: user?.userId ?? 0,
        name: user?.nickname ?? "멤버",
        avatar: user?.image ?? "https://via.placeholder.com/40",
        skills: user?.skills ?? [],
      }));
  };

  const leader = getLeader(post?.matchedUsers);
  const members = getMembers(post?.matchedUsers, leader?.id);

  return (
    <div className="post-detail-outer">
      <div className="post-detail-container">
        <div className="post-detail-main">
          <h1 style={{ textAlign: "left" }}>{post?.title}</h1>

          {/* 지원자 목록 섹션 */}
          {isAuthor && showApplicantsList && (
            <section className="applicants-section">
              <h2 style={{ fontSize: 20, marginBottom: 15, textAlign: "left" }}>
                지원자 목록
              </h2>

              {applicants.length === 0 ? (
                <p>아직 지원자가 없습니다.</p>
              ) : (
                <div className="applicants-list">
                  {applicants.map((applicant) => (
                    <div
                      key={applicant?.id ?? Math.random()}
                      className="applicant-card"
                    >
                      <div className="applicant-header">
                        <img
                          src={
                            applicant?.avatar ??
                            "https://via.placeholder.com/40"
                          }
                          alt={`${applicant?.name ?? "지원자"} 프로필`}
                          className="applicant-avatar"
                        />
                        <div className="applicant-info">
                          <div className="applicant-name">
                            {applicant?.name ?? "지원자"}
                          </div>
                          <div className="applicant-date">
                            지원일: {applicant?.applyDate ?? "정보 없음"}
                          </div>
                        </div>
                      </div>

                      <div className="applicant-resume">
                        <div className="applicant-resume-title">
                          {applicant?.resumeTitle ?? "자기소개서 제목"}
                        </div>
                        <p className="applicant-resume-content">
                          {applicant?.resumeContent ?? "자기소개서 내용"}
                        </p>
                      </div>

                      <div>
                        <div className="applicant-skills-label">보유 기술:</div>
                        <div className="applicant-skills-list">
                          {applicant?.skills?.map((skill, index) => (
                            <span key={index} className="applicant-skill-tag">
                              {skill}
                            </span>
                          )) ?? "기술 정보 없음"}
                        </div>
                      </div>

                      <div className="applicant-actions">
                        <button
                          className="accept-button"
                          onClick={() =>
                            handleApplicantAction(applicant?.id ?? 0, "accept")
                          }
                        >
                          승인
                        </button>
                        <button
                          className="reject-button"
                          onClick={() =>
                            handleApplicantAction(applicant?.id ?? 0, "reject")
                          }
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={toggleApplicantsList} className="close-button">
                닫기
              </button>
            </section>
          )}

          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, textAlign: "left" }}>
              프로젝트 소개
            </h2>
            <div style={{ marginBottom: 16, color: "#444" }}>
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-line",
                  textAlign: "left",
                }}
              >
                {post?.content ?? "프로젝트 내용을 가져오는 중입니다."}
              </p>
            </div>

            {/* 진행 방식 - 간략 표시 */}
            <div
              style={{
                marginTop: 12,
                marginBottom: 20,
                padding: 12,
                borderRadius: 6,
                backgroundColor: "#FFF8E1",
                display: "inline-block",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#FFC107" }}>
                진행 방식:{" "}
              </span>
              <span style={{ color: "#333" }}>
                {post?.type === "ONLINE" && "온라인"}
                {post?.type === "OFFLINE" && "오프라인"}
                {post?.type === "MIX" && "혼합"}
                {!post?.type && "미정"}
              </span>
            </div>
          </section>

          {/* 필요한 성향 섹션 */}
          <div className="team-members-section">
            <h3 className="team-title">필요한 성향</h3>
            <div style={{ marginBottom: 16, color: "#444" }}>
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-line",
                  textAlign: "left",
                }}
              >
                {post?.requirementPersonality ||
                  "특별히 필요한 성향이 없습니다."}
              </p>
            </div>
          </div>

          {/* 기술 스택 컴포넌트 */}
          <TechStack technologies={post?.skills ?? []} />

          {/* 팀 멤버 컴포넌트 */}
          <TeamMembers leader={leader} members={members} />

          {/* 댓글 컴포넌트 */}
          <Comment comments={[]} postId={post?.id} />
        </div>
      </div>

      {/* 오른쪽 배너 */}
      <aside className="post-detail-aside">
        {leader && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                to={`/profile/${leader.id ?? 0}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={leader.avatar ?? "https://via.placeholder.com/40"}
                  alt="리더 프로필"
                  style={{ width: 48, height: 48, borderRadius: "50%" }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{leader.name ?? "팀장"}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>
                    {leader.email ?? "이메일 정보 없음"}
                  </div>
                </div>
              </Link>
            </div>
            <div className="aside-divider" />
          </>
        )}
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 마감일</div>
          <div style={{ fontWeight: 600 }}>{post?.endedAt || "미정"}</div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>진행 방식</div>
          <div style={{ fontWeight: 600 }}>
            {post?.type === "ONLINE" && "온라인"}
            {post?.type === "OFFLINE" && "오프라인"}
            {post?.type === "MIX" && "혼합"}
            {!post?.type && "미정"}
          </div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 완료</div>
          <div style={{ fontWeight: 600 }}>
            {post?.currentCount ?? 0} / {post?.headCount ?? 0}
          </div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>기술 스택</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 6,
            }}
          >
            {(post?.skills ?? []).map((tech) => (
              <span className="tech-tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 지원하기/지원자 확인 버튼 */}
        <div className="aside-divider" />
        {isAuthor ? (
          <button onClick={toggleApplicantsList} className="apply-button">
            지원자 목록 확인
          </button>
        ) : (
          <div>
            {applicationStatus === "applied" ? (
              <div className="applied-status">이미 지원한 모집글입니다</div>
            ) : applicationStatus === "accepted" ? (
              <div className="accepted-status">
                합류한 {post?.category ?? "프로젝트"}입니다
              </div>
            ) : (
              <button onClick={handleApply} className="apply-button">
                지원하기
              </button>
            )}
          </div>
        )}
      </aside>

      {/* 지원하기 모달 */}
      {showApplyModal && (
        <div className="apply-modal-overlay">
          <div className="apply-modal">
            <div className="apply-modal-header">
              <h2>{post?.title}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="apply-modal-content">
              <div className="apply-modal-info">
                <p>{post?.content?.substring(0, 100) ?? ""}...</p>
              </div>

              <div className="apply-form">
                <h3>자기소개서 선택</h3>
                {resumesLoading ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spinner
                      size="medium"
                      text="자기소개서 목록을 불러오는 중..."
                    />
                  </div>
                ) : resumesError ? (
                  <div
                    className="error-message"
                    style={{
                      padding: "15px",
                      backgroundColor: "#ffebee",
                      borderRadius: "8px",
                      color: "#d32f2f",
                      marginBottom: "15px",
                    }}
                  >
                    <p style={{ margin: 0 }}>{resumesError}</p>
                    <button
                      onClick={fetchResumes}
                      style={{
                        marginTop: "10px",
                        padding: "5px 12px",
                        backgroundColor: "#ffcdd2",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      다시 시도
                    </button>
                  </div>
                ) : resumes.length > 0 ? (
                  <div className="resume-select-container">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className={`resume-option ${
                          selectedResume === resume.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedResume(resume.id)}
                      >
                        <div className="resume-option-title">
                          {resume.title}
                        </div>
                        <div className="resume-option-content">
                          {resume.content?.substring(0, 50)}
                          {resume.content?.length > 50 ? "..." : ""}
                        </div>
                        {selectedResume === resume.id && (
                          <div className="resume-selected-check">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-resumes-message">
                    <p>등록된 자기소개서가 없습니다.</p>
                    <button
                      className="create-resume-btn"
                      onClick={() => navigate("/profile/resume/new")}
                    >
                      자기소개서 작성하기
                    </button>
                  </div>
                )}

                <h3>지원 동기</h3>
                <textarea
                  value={motivationText}
                  onChange={(e) => setMotivationText(e.target.value)}
                  placeholder="프로젝트에 지원하는 동기를 작성해주세요."
                  className="motivation-textarea"
                  rows={5}
                />

                <div className="apply-modal-actions">
                  <button className="cancel-btn" onClick={handleCloseModal}>
                    취소
                  </button>
                  <button
                    className="apply-submit-btn"
                    onClick={handleSubmitApplication}
                    disabled={!selectedResume || !motivationText.trim()}
                  >
                    지원하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
