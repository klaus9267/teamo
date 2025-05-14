import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../styles/resume/detail.css";
import { resumeApi, Resume, Profile } from "../../api/resume.ts";
import Spinner from "../../component/common/Spinner.tsx";
import { authApi } from "../../api/auth.ts";
import {
  showSuccess,
  showWarning,
  showConfirm,
} from "../../utils/sweetAlert.ts";

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (id) {
          setLoading(true);
          const data = await resumeApi.getResume(Number(id));

          // 더이상 더미 데이터를 추가하지 않음
          // 스킬 정보는 API에서 받은 그대로 사용

          setResume(data);

          // localStorage에서 myUserId 가져오기
          const myUserId = localStorage.getItem("myUserId");

          // 사용자 ID 비교
          if (myUserId && data.userId) {
            const isCurrentUserOwner = Number(myUserId) === data.userId;
            setIsOwner(isCurrentUserOwner);
          }

          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("자기소개서를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  // 자기소개서 삭제 처리 함수
  const handleDeleteResume = async () => {
    if (!resume || !id) return;

    const confirmed = await showConfirm(
      "자기소개서 삭제",
      "정말 이 자기소개서를 삭제하시겠습니까?",
      "삭제",
      "취소"
    );

    if (confirmed) {
      try {
        await resumeApi.deleteResume(Number(id));
        showSuccess("자기소개서가 삭제되었습니다.");
        navigate("/profile");
      } catch (err) {
        console.error("자기소개서 삭제 중 오류 발생:", err);
        showWarning("자기소개서 삭제에 실패했습니다.");
      }
    }
  };

  if (loading)
    return (
      <div
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
  if (error) return <div className="error-message">{error}</div>;
  if (!resume)
    return <div className="error-message">자기소개서를 찾을 수 없습니다.</div>;

  // 줄바꿈을 처리하는 함수
  const formatContent = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => (
      <React.Fragment key={idx}>
        {line || " "}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="resume-detail-outer">
      <div className="resume-detail-container">
        <div className="resume-detail-main">
          <div className="resume-header">
            <Link to="/profile" className="back-link">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              자기소개서 목록으로 돌아가기
            </Link>
            <h1
              className="resume-title"
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                maxWidth: "100%",
                overflow: "visible",
              }}
            >
              {" "}
              {resume.title}{" "}
            </h1>
          </div>

          <div className="resume-detail-content">
            {resume.skills && resume.skills.length > 0 ? (
              <section className="resume-section">
                {" "}
                <h3>기술 스택</h3>{" "}
                <div className="resume-skills">
                  {" "}
                  {/* 중복 제거하여 기술 스택 표시 */}{" "}
                  {Array.from(new Set(resume.skills)).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {" "}
                      {skill}{" "}
                    </span>
                  ))}{" "}
                </div>{" "}
              </section>
            ) : (
              <section className="resume-section">
                <h3>기술 스택</h3>
                <div className="no-skills-message">
                  등록된 기술 스택이 없습니다
                </div>
              </section>
            )}

            {resume.personality && (
              <section className="resume-section">
                <h3>성향 및 성격</h3>
                <div className="resume-personality">{resume.personality}</div>
              </section>
            )}

            <section className="resume-section">
              <h3>자기소개서 내용</h3>
              <div
                className="resume-content"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  overflow: "visible",
                }}
              >
                {" "}
                {formatContent(resume.content)}{" "}
              </div>
            </section>

            <section className="resume-section">
              <h3>포트폴리오 파일</h3>
              <div className="resume-file">
                {resume.portfolio ? (
                  <a
                    href={resume.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-download-link"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15L12 3M12 15L8 11M12 15L16 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 17V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    포트폴리오 다운로드
                  </a>
                ) : (
                  <div className="no-file-message">
                    등록된 포트폴리오 파일이 없습니다
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* 오른쪽 사이드바 */}
      <aside className="resume-detail-aside">
        <div
          className="profile-info"
          onClick={() =>
            resume.profile?.userId &&
            navigate(`/profile/${resume.profile.userId}`)
          }
          style={{ cursor: resume.profile?.userId ? "pointer" : "default" }}
          title={resume.profile?.userId ? "사용자 프로필로 이동" : ""}
        >
          <img
            src={resume.profile?.image || "/profile.png"}
            alt="프로필"
            className="profile-image"
            onError={(e) => {
              e.currentTarget.src = "/profile.png";
            }}
          />
          <div className="profile-text profile-text-center">
            <p className="profile-name">
              {resume.profile?.name || resume.profile?.nickname || "개발자"}
            </p>
            {resume.profile?.nickname && resume.profile?.name && (
              <p className="profile-nickname">@{resume.profile.nickname}</p>
            )}
          </div>
        </div>

        {resume.profile?.introduction && (
          <>
            <div>
              <div className="aside-label">소개</div>
              <p className="profile-introduction">
                {resume.profile.introduction}
              </p>
            </div>
          </>
        )}

        {isOwner && (
          <div className="aside-actions">
            <button
              className="aside-edit-btn"
              onClick={() => navigate(`/profile/resume/edit/${resume.id}`)}
            >
              수정하기
            </button>
            <button className="aside-delete-btn" onClick={handleDeleteResume}>
              삭제하기
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
