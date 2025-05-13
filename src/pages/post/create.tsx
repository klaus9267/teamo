import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/post/create.css";
import TechStack from "../../component/post/TechStack.tsx";
import { postApi } from "../../api/post.ts";
import { showSuccess, showError, showWarning } from "../../utils/sweetAlert.ts";

const PostCreate = () => {
  const navigate = useNavigate();

  // 오늘 날짜를 YYYY-MM-DD 형식으로 얻기
  const today = new Date().toISOString().split("T")[0];
  // 기본 마감일은 30일 후
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 30);
  const defaultEndDateString = defaultEndDate.toISOString().split("T")[0];

  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("사이드프로젝트"); // 기본값: 사이드프로젝트
  const [projectType, setProjectType] = useState("ONLINE"); // 기본값: ONLINE (온라인)
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // 실제 파일 객체 저장
  const [techStack, setTechStack] = useState([]);
  const [memberCount, setMemberCount] = useState(1);
  const [preference, setPreference] = useState("");
  const [endDate, setEndDate] = useState(defaultEndDateString);

  // 게시글 유형 옵션
  const postTypeOptions = [
    { value: "사이드프로젝트", label: "사이드프로젝트", apiValue: "PROJECT" },
    { value: "공모전", label: "공모전", apiValue: "CONTEST" },
    { value: "해커톤", label: "해커톤", apiValue: "HACKATHON" },
    { value: "스터디", label: "스터디", apiValue: "STUDY" },
  ];

  // 프로젝트 진행 방식 옵션
  const projectTypeOptions = [
    { value: "ONLINE", label: "온라인" },
    { value: "OFFLINE", label: "오프라인" },
    { value: "MIX", label: "혼합" },
  ];

  // 프론트엔드 카테고리 값을 백엔드 API 카테고리 값으로 변환하는 함수
  const mapCategoryToApiValue = (frontendCategory) => {
    const option = postTypeOptions.find(
      (opt) => opt.value === frontendCategory
    );
    return option ? option.apiValue : "PROJECT"; // 기본값은 PROJECT
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 객체 저장
      setImageFile(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 기술 스택 추가
  const handleAddTech = (tech) => {
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
    }
  };

  // 기술 스택 삭제
  const handleRemoveTech = (tech) => {
    setTechStack(techStack.filter((item) => item !== tech));
  };

  // 마감일 포맷팅 (YYYY-MM-DD → YYYY.MM.DD)
  const formatEndDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim()) {
      showWarning("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      showWarning("내용을 입력해주세요.");
      return;
    }

    // 서버에 데이터 전송
    const postData = {
      title,
      content,
      headCount: memberCount,
      image: imageFile, // base64 이미지 대신 파일 객체 전달
      requirementPersonality: preference,
      endedAt: endDate,
      category: mapCategoryToApiValue(postType),
      type: projectType, // 진행 방식(ONLINE, OFFLINE, MIX)
      skills: techStack,
      matchedUsers: [],
      currentCount: 0,
    };

    try {
      // API 호출
      const response = await postApi.createPost(postData);
      showSuccess("게시글이 등록되었습니다!");

      // 게시글 목록 페이지로 이동
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showError("로그인이 필요합니다. 다시 로그인 해주세요.");
        navigate("/login");
        return;
      }
      showError("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="post-create-container">
      <div className="page-header">
        <h1>프로젝트 모집 글쓰기</h1>
        <p>팀원을 모집하고 함께 성장할 수 있는 프로젝트를 시작해보세요.</p>
      </div>

      <div className="post-create-layout">
        <form onSubmit={handleSubmit} className="post-form">
          {/* 게시글 유형 선택 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>모집 유형</h2>
            <div className="post-type-selector">
              {postTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`type-option ${
                    postType === option.value ? "selected" : ""
                  }`}
                  onClick={() => setPostType(option.value)}
                >
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 진행 방식 선택 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>진행 방식</h2>
            <div className="post-type-selector">
              {projectTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`type-option ${
                    projectType === option.value ? "selected" : ""
                  }`}
                  onClick={() => setProjectType(option.value)}
                >
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>제목</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요 (최대 100자)"
              className="form-control"
              maxLength={100}
            />
          </div>

          {/* 모집 인원 및 마감일 설정 */}
          <div className="form-section">
            <div className="recruitment-info-container">
              <div className="member-count-wrapper">
                <label
                  className="info-label"
                  style={{ textAlign: "left", fontWeight: "bold" }}
                >
                  모집 인원
                </label>
                <div className="member-count-container">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={memberCount}
                    onChange={(e) => setMemberCount(parseInt(e.target.value))}
                    className="form-control member-count-input"
                    style={{ textAlign: "left", width: 180 }}
                  />
                  <span className="member-count-label">명</span>
                </div>
              </div>
              <div className="end-date-wrapper">
                <label
                  className="info-label"
                  style={{ textAlign: "left", fontWeight: "bold" }}
                >
                  모집 마감일
                </label>
                <input
                  type="date"
                  min={today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control date-input"
                  style={{ width: 180 }}
                />
              </div>
            </div>
          </div>

          {/* 기술 스택 입력 - TechStack 컴포넌트 사용 */}
          <div className="form-section">
            <TechStack technologies={techStack} onSelectTech={handleAddTech} />
            {techStack.length > 0 && (
              <div className="tech-stack-list">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-tag">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="remove-tech"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 내용 입력 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>내용</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="프로젝트에 대한 설명, 모집 요건, 진행 방식 등을 자세히 작성해주세요."
              className="form-control content-editor"
              rows={15}
            />
            <div className="word-count">{content.length}/3000</div>
          </div>

          {/* 우대사항 입력 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>우대사항</h2>
            <textarea
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="우대하는 경력이나 기술, 성향 등을 작성해주세요."
              className="form-control preference-editor"
              rows={5}
            />
            <div className="word-count">{preference.length}/500</div>
          </div>

          {/* 이미지 업로드 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>이미지 첨부</h2>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
                className="hidden-input"
              />
              <label htmlFor="image-upload" className="upload-label">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span>+</span>
                    <p>이미지를 추가해보세요</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-btn"
            >
              취소
            </button>
            <button type="submit" className="submit-btn">
              작성 완료
            </button>
          </div>
        </form>

        {/* 실시간 미리보기 카드 */}
        <div className="post-preview-container">
          <h2 className="preview-title" style={{ textAlign: "left" }}>
            미리보기
          </h2>
          <div className="recruitment-card-preview">
            <div className="card-image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="게시글 이미지" />
              ) : (
                <div className="placeholder-image">이미지 없음</div>
              )}
              <div className="card-category">{postType}</div>
            </div>
            <div className="card-content-preview">
              <h3 className="card-title-preview">
                {title || "제목을 입력해주세요"}
              </h3>
              <div className="card-tech-stack-preview">
                {techStack.length > 0 ? (
                  techStack.map((tech, index) => (
                    <span key={index} className="tech-tag-preview">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="tech-tag-preview placeholder">
                    기술 스택
                  </span>
                )}
              </div>
              <div className="card-status-preview">
                <div className="status-info">
                  <span className="status-text-preview">모집 현황</span>
                  <span className="status-count-preview">
                    0/{memberCount || 1}
                  </span>
                </div>
                <div className="deadline-info">
                  <span className="deadline-text-preview">마감일</span>
                  <span className="deadline-date-preview">
                    {formatEndDate(endDate)}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <span
                  style={{
                    display: "inline-block",
                    border: `1.5px solid ${
                      projectType === "ONLINE"
                        ? "#FFD54F"
                        : projectType === "OFFLINE"
                        ? "#888"
                        : "#FF9800"
                    }`,
                    color:
                      projectType === "ONLINE"
                        ? "#FFD54F"
                        : projectType === "OFFLINE"
                        ? "#888"
                        : "#FF9800",
                    background: "#fff",
                    borderRadius: 8,
                    padding: "2px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {projectType === "ONLINE" && "온라인"}
                  {projectType === "OFFLINE" && "오프라인"}
                  {projectType === "MIX" && "혼합"}
                </span>
              </div>
            </div>
          </div>
          <div className="preview-note">
            <p>* 실제 게시글은 약간 다를 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;
