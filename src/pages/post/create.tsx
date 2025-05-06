import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/post/create.css";

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
  const [imagePreview, setImagePreview] = useState(null);
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [memberCount, setMemberCount] = useState(1);
  const [preference, setPreference] = useState("");
  const [endDate, setEndDate] = useState(defaultEndDateString);

  // 게시글 유형 옵션
  const postTypeOptions = [
    { value: "사이드프로젝트", label: "사이드프로젝트" },
    { value: "공모전", label: "공모전" },
    { value: "해커톤", label: "해커톤" },
    { value: "스터디", label: "스터디" },
  ];

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 기술 스택 추가
  const handleAddTech = () => {
    if (techInput && !techStack.includes(techInput)) {
      setTechStack([...techStack, techInput]);
      setTechInput("");
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
  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 서버에 데이터 전송 (실제로는 API 호출 구현 필요)
    const postData = {
      title,
      content,
      postType,
      techStack,
      imageUrl: imagePreview,
      memberCount,
      preference,
      endDate,
    };

    console.log("게시글 데이터:", postData);
    alert("게시글이 등록되었습니다!");

    // 게시글 목록 페이지로 이동
    navigate("/hub");
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
                <label className="info-label" style={{ textAlign: "left" }}>
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
                  />
                  <span className="member-count-label">명</span>
                </div>
              </div>
              <div className="end-date-wrapper">
                <label className="info-label" style={{ textAlign: "left" }}>
                  모집 마감일
                </label>
                <input
                  type="date"
                  min={today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control date-input"
                />
              </div>
            </div>
          </div>

          {/* 기술 스택 입력 */}
          <div className="form-section">
            <h2 style={{ textAlign: "left" }}>기술 스택</h2>
            <div className="tech-input-container">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="기술 스택을 입력하세요 (예: React, Node.js)"
                className="form-control tech-input"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="add-tech-btn"
              >
                추가
              </button>
            </div>

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
