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
  const [applyLoading, setApplyLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

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
      const data = await resumeApi.getResumes();
      setResumes(data);
    } catch (err) {
      console.error("자기소개서 목록 불러오기 실패:", err);
      if (err.response) {
      }
      setResumesError("자기소개서를 불러오는데 실패했습니다.");
      // 빈 배열로 설정하여 에러 발생 시에도 UI 표시 가능
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  const fetchApplicants = async (postId) => {
    if (!postId) {
      console.error("포스트 ID가 없어 지원자 목록을 불러올 수 없습니다.");
      return;
    }

    try {
      const data = await applyApi.getAppliesByPostId(postId);
      setApplicants(data);

      // 기존 중복 확인 로직 제거 - applies 배열로 확인하므로 여기서는 불필요
    } catch (err) {
      console.error("지원자 목록 조회 에러:", err);
      if (err.response) {
        console.error("응답 상태:", err.response.status);
        console.error("응답 데이터:", err.response.data);
      }
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
      const isUserAuthor = post.userId === userId;
      setIsAuthor(isUserAuthor);

      // 지원자 목록 조회 (내가 작성한 글인 경우에만)
      if (isUserAuthor && post.id) {
        fetchApplicants(post.id);
      }

      // 지원 상태 확인
      // 1. applies 배열에 현재 userId가 포함되어 있는지 확인 (이미 지원한 상태)
      if (
        post.applies &&
        Array.isArray(post.applies) &&
        post.applies.includes(userId)
      ) {
        setApplicationStatus("applied");
      }

      // 2. matchedUsers 배열에 현재 userId가 포함되어 있는지 확인 (이미 합류한 상태)
      if (post.matchedUsers && Array.isArray(post.matchedUsers)) {
        const isUserMatched = post.matchedUsers.some(
          (user) => user.userId === userId
        );
        if (isUserMatched) {
          setApplicationStatus("accepted");
        }
      }
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
  const handleApplicantAction = async (applyId, action) => {
    try {
      if (!id || !post?.id) return;

      // 승인 혹은 거절 액션에 따라 API 호출
      if (action === "accept") {
        await applyApi.selectApplicant(applyId, true);
        showSuccess("지원자가 승인되었습니다.");
      } else {
        await applyApi.selectApplicant(applyId, false);
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
    setApplyLoading(true);
    fetchResumes().finally(() => {
      setApplyLoading(false);
      // 모달 표시
      setShowApplyModal(true);
    });
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
      setSubmitLoading(true);
      await applyApi.apply({
        postId: post.id,
        resumeId: selectedResume,
        reason: motivationText,
      });

      showSuccess("지원이 완료되었습니다.");
      setApplicationStatus("applied");
      setShowApplyModal(false);

      // 작성자인 경우에만 지원자 목록 새로고침
      if (isAuthor) {
        fetchApplicants(post.id);
      }
    } catch (error) {
      console.error("지원 제출 에러:", error);
      showError("지원에 실패했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setShowApplyModal(false);
    setSelectedResume(null);
    setMotivationText("");
  };

  // 지원자 목록 토글 함수
  const toggleApplicantsList = () => {
    // 지원자 목록 표시 전에 항상 최신 데이터 불러오기
    if (post && post.id) {
      fetchApplicants(post.id);
    } else {
      console.error("포스트 ID가 없어 지원자 목록을 불러올 수 없습니다.");
    }

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

          {/* 지원자 목록 모달 섹션 - 분리하여 화면 전체에 모달로 표시 */}
          {isAuthor && showApplicantsList && (
            <div className="applicants-modal-overlay">
              <div className="applicants-modal wider-modal">
                <div className="applicants-modal-header">
                  <h2>지원자 매칭 ({applicants.length}명)</h2>
                  <button
                    className="modal-close-btn"
                    onClick={toggleApplicantsList}
                  >
                    ×
                  </button>
                </div>

                <div className="applicants-modal-content">
                  {applicants.length === 0 ? (
                    <p className="no-applicants-message">
                      아직 지원자가 없습니다.
                    </p>
                  ) : (
                    <div className="applicants-grid">
                      {applicants.map((applicant) => (
                        <div key={applicant.applyId} className="applicant-card">
                          <div className="applicant-header">
                            <div className="applicant-score">
                              {applicant.aiScore && (
                                <div
                                  className={`ai-score ${
                                    applicant.aiScore > 80
                                      ? "high-score"
                                      : applicant.aiScore > 60
                                      ? "medium-score"
                                      : "low-score"
                                  }`}
                                >
                                  AI 추천 {applicant.aiScore}점
                                </div>
                              )}
                            </div>
                            <div className="applicant-profile">
                              <img
                                src={applicant.profileImage || "/profile.png"}
                                alt={`${applicant.nickname} 프로필`}
                                className="applicant-avatar"
                                onError={(e) => {
                                  e.currentTarget.src = "/profile.png";
                                }}
                              />
                              <div className="applicant-info">
                                <div className="applicant-name">
                                  {applicant.nickname}
                                </div>
                                <div className="applicant-skills">
                                  {applicant.resume &&
                                    applicant.resume.skills &&
                                    applicant.resume.skills.map(
                                      (skill, index) => (
                                        <span key={index} className="skill-tag">
                                          {skill}
                                        </span>
                                      )
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="applicant-details">
                            <div className="applicant-section">
                              <h4>자기소개</h4>
                              <p>
                                {applicant.resume && applicant.resume.content
                                  ? applicant.resume.content
                                  : "자기소개 내용이 없습니다."}
                              </p>
                            </div>

                            {applicant.reason && (
                              <div className="applicant-section">
                                <h4>지원 동기</h4>
                                <p>{applicant.reason}</p>
                              </div>
                            )}

                            {applicant.resume &&
                              applicant.resume.personality && (
                                <div className="applicant-section">
                                  <h4>성향</h4>
                                  <p>{applicant.resume.personality}</p>
                                </div>
                              )}

                            {applicant.aiSummary && (
                              <div className="applicant-section ai-summary-section">
                                <h4>AI 요약</h4>
                                <p>{applicant.aiSummary}</p>
                              </div>
                            )}

                            {applicant.aiReason && (
                              <div className="applicant-section ai-reason-section">
                                <h4>AI 추천 이유</h4>
                                <p>{applicant.aiReason}</p>
                              </div>
                            )}

                            <div className="applicant-section">
                              <h4>포트폴리오</h4>
                              {applicant.resume &&
                              applicant.resume.portfolio &&
                              applicant.resume.portfolio !== "NULL" &&
                              applicant.resume.portfolio !== "null" ? (
                                <a
                                  href={applicant.resume.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="portfolio-link"
                                >
                                  포트폴리오 바로가기
                                </a>
                              ) : (
                                <p className="no-portfolio-message">
                                  포트폴리오가 없습니다.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="applicant-actions">
                            {applicant.isSelected !== undefined ? (
                              applicant.isSelected ? (
                                <div className="selected-badge">선발됨</div>
                              ) : (
                                <div className="rejected-badge">거절됨</div>
                              )
                            ) : (
                              <>
                                <button
                                  className="accept-button"
                                  onClick={() =>
                                    handleApplicantAction(
                                      applicant.applyId,
                                      "accept"
                                    )
                                  }
                                >
                                  승인
                                </button>
                                <button
                                  className="reject-button"
                                  onClick={() =>
                                    handleApplicantAction(
                                      applicant.applyId,
                                      "reject"
                                    )
                                  }
                                >
                                  거절
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
          <div className="post-comments">
            <Comment postId={Number(id)} />
          </div>
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
              <button
                onClick={handleApply}
                className="apply-button"
                disabled={applyLoading}
              >
                {applyLoading ? (
                  <Spinner size="small" color="#1B3A4B" inButton={true} />
                ) : (
                  "지원하기"
                )}
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
                    disabled={
                      !selectedResume || !motivationText.trim() || submitLoading
                    }
                  >
                    {submitLoading ? (
                      <Spinner size="small" color="#1B3A4B" inButton={true} />
                    ) : (
                      "지원하기"
                    )}
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
