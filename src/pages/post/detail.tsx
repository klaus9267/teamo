import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../styles/post/PostDetailPage.css";
import TechStack from "../../component/post/TechStack.tsx";
import TeamMembers from "../../component/post/TeamMembers.tsx";
import Comment from "../../component/post/Comment.tsx";
import { postApi } from "../../api/post.ts";
import { resumeApi } from "../../api/resume.ts";
import Spinner from "../../component/common/Spinner.tsx";

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
  const [isAuthor] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("none");
  const [showApplicantsList, setShowApplicantsList] = useState(false);
  const [applicants, setApplicants] = useState([]);

  // 지원 모달 관련 상태
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [motivationText, setMotivationText] = useState("");
  const [resumes, setResumes] = useState([]);

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
      // API 미완성 - 자기소개서 API 연결 예정
      // const data = await resumeApi.getResumes();
      // setResumes(data);
      console.log("자기소개서 API 연결 예정");
      setResumes([
        { id: 1, title: "[API 연결 예정] 자기소개서 API가 준비 중입니다." },
      ]);
    } catch (err) {
      setError("자기소개서를 불러오는데 실패했습니다.");
    }
  };

  const fetchApplicants = async (postId) => {
    if (!postId) return;

    try {
      // API 미완성 - 지원자 목록 API 연결 예정
      // const data = await postApi.getApplicants(postId);
      // setApplicants(data);
      console.log("지원자 목록 API 연결 예정");
      setApplicants([]);
    } catch (err) {
      setError("지원자 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (post && post.id) {
      fetchResumes();
      fetchApplicants(post.id);
    }
  }, [post]);

  // 지원자 승인/거절 처리 함수
  const handleApplicantAction = async (applicantId, action) => {
    try {
      if (!id || !post?.id) return;

      // API 미완성 - 지원자 승인/거절 API 연결 예정
      // await postApi.handleApplicant(Number(id), applicantId, action);
      alert("API 연결 예정: 지원자 승인/거절 기능은 아직 준비 중입니다.");

      fetchApplicants(post.id);
    } catch (error) {
      console.error(`Error ${action}ing applicant:`, error);
      alert(`지원자 ${action === "accept" ? "승인" : "거절"}에 실패했습니다.`);
    }
  };

  // 지원하기 함수
  const handleApply = () => {
    if (!post) {
      alert("게시글 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // API 미완성 - 지원하기 기능 준비 중
    alert("API 연결 예정: 지원하기 기능은 아직 준비 중입니다.");
    setShowApplyModal(true);
  };

  // 지원 제출 함수
  const handleSubmitApplication = async () => {
    if (!selectedResume) {
      alert("자기소개서를 선택해주세요.");
      return;
    }

    if (!id) {
      alert("잘못된 접근입니다.");
      return;
    }

    try {
      // API 미완성 - 지원 API 연결 예정
      // await postApi.apply(Number(id), {
      //   resumeId: selectedResume,
      //   motivation: motivationText,
      // });
      alert("API 연결 예정: 지원 제출 기능은 아직 준비 중입니다.");
      setApplicationStatus("applied");
      setShowApplyModal(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("지원에 실패했습니다.");
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
                style={{ margin: 0, whiteSpace: "pre-line", textAlign: "left" }}
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
                backgroundColor: "#f0f9f8",
                display: "inline-block",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#2a9d8f" }}>
                진행 방식:{" "}
              </span>
              <span style={{ color: "#333" }}>
                {post?.type === "ONLINE" && "온라인"}
                {post?.type === "OFFLINE" && "오프라인"}
                {post?.type === "MIX" && "온라인 + 오프라인 혼합"}
                {!post?.type && "미정"}
              </span>
            </div>
          </section>

          {/* 필요한 성향 섹션 */}
          <div className="team-members-section">
            <h3 className="team-title">필요한 성향</h3>
            <div style={{ marginBottom: 16, color: "#444" }}>
              <p
                style={{ margin: 0, whiteSpace: "pre-line", textAlign: "left" }}
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
            {post?.type === "MIX" && "온라인 + 오프라인 혼합"}
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
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}
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
          <button
            onClick={() => post && navigate(`/post/${post.id}/applicants`)}
            className="apply-button"
            style={{ position: "relative" }}
          >
            지원자 목록 확인
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                left: 0,
                right: 0,
                fontSize: "11px",
                color: "#ff6b6b",
                fontWeight: "normal",
              }}
            >
              * API 연결 예정
            </div>
          </button>
        ) : (
          <div>
            {applicationStatus === "applied" ? (
              <div className="applied-status">
                이미 지원한 모집글입니다
                <div
                  style={{
                    fontSize: "11px",
                    color: "#ff6b6b",
                    marginTop: "4px",
                  }}
                >
                  * API 연결 예정
                </div>
              </div>
            ) : applicationStatus === "accepted" ? (
              <div className="accepted-status">
                합류한 {post?.category ?? "프로젝트"}입니다
                <div
                  style={{
                    fontSize: "11px",
                    color: "#ff6b6b",
                    marginTop: "4px",
                  }}
                >
                  * API 연결 예정
                </div>
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="apply-button"
                style={{ position: "relative" }}
              >
                지원하기
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: 0,
                    right: 0,
                    fontSize: "11px",
                    color: "#ff6b6b",
                    fontWeight: "normal",
                  }}
                >
                  * API 연결 예정
                </div>
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
              <div
                className="apply-modal-info"
                style={{ position: "relative" }}
              >
                <p>{post?.content?.substring(0, 100) ?? ""}...</p>
                <div
                  style={{
                    padding: "8px",
                    background: "#ffefef",
                    border: "1px solid #ffcfcf",
                    borderRadius: "4px",
                    marginTop: "12px",
                    color: "#e74c3c",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  현재 자기소개서 및 지원 API가 연결 예정 중입니다.
                </div>
              </div>

              <div className="apply-form-section">
                <label htmlFor="resume-select">자기소개서 선택</label>
                <select
                  id="resume-select"
                  value={selectedResume || ""}
                  onChange={(e) =>
                    setSelectedResume(Number(e.target.value) || null)
                  }
                  className="resume-select"
                >
                  <option value="">자기소개서를 선택해주세요</option>
                  {resumes.map((resume) => (
                    <option
                      key={resume?.id ?? Math.random()}
                      value={resume?.id ?? ""}
                    >
                      {resume?.title ?? "자기소개서"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="apply-form-section">
                <label htmlFor="motivation-text">지원 동기 (선택사항)</label>
                <textarea
                  id="motivation-text"
                  value={motivationText}
                  onChange={(e) => setMotivationText(e.target.value)}
                  placeholder="지원 동기를 작성해주세요 (선택사항)"
                  className="motivation-textarea"
                />
              </div>
            </div>
            <div className="apply-modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                취소
              </button>
              <button className="submit-btn" onClick={handleSubmitApplication}>
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
